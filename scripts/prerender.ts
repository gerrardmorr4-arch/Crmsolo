/**
 * Build-time static prerenderer.
 *
 * The app is a client-side React SPA: Vercel serves one static index.html for
 * every path, so every URL previously shipped identical <title>, <meta> and
 * <link rel="canonical"> tags pointing at the homepage. Search engines treated
 * the whole site as one duplicate page (Search Console: "Duplicate, Google
 * chose different canonical", "Crawled - currently not indexed", "Soft 404").
 *
 * This script renders each real route to its own HTML file with the correct
 * per-route metadata, and emits a matching sitemap plus a 404 page.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import React from 'react';
import { JSDOM } from 'jsdom';
import { initialReviews, initialComparisons, initialGuides, initialBlogPosts } from '../src/data/initialData';
import { PLANNING_BLOG_ARTICLES } from '../src/data/planningBlogArticles';
import { automationBlueprints } from '../src/data/blueprintsData';
import { PLANNING_CATEGORIES } from '../src/data/planningToolsData';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const PUBLIC = path.join(ROOT, 'public');
const ORIGIN = 'https://crmsolo.online';
const NOT_FOUND_SENTINEL = '/__not-found__';

interface SeoSnapshot {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType: string;
  ogImage: string;
  keywords: string[];
  jsonLd: object | object[];
}

/**
 * Canonical static routes handled directly by App.tsx. These are the URLs the
 * sitemap advertises and the only ones internal navigation should target.
 */
const STATIC_ROUTES = [
  '/',
  '/directory',
  '/buyer-guide',
  '/calculator',
  '/checklist',
  '/reviews',
  '/compare',
  '/guides',
  '/blog',
  '/blueprints',
  '/planning-tools',
  '/about',
  '/contact',
  '/privacy-policy',
  '/affiliate-disclosure'
];

/** Routes that must never be indexed. */
const NOINDEX_ROUTES = new Set(['/admin']);

/**
 * CRM blog posts shorter than this (in words, after markdown/HTML stripping) are
 * still published and prerendered, but are held out of the sitemap and marked
 * noindex. Roughly half the CRM posts currently fall under this line; they
 * compete with nothing and dilute the section until they are expanded. Raising
 * the content above the threshold automatically restores them to the sitemap on
 * the next build, so this list needs no maintenance.
 */
const THIN_CONTENT_WORDS = 150;

/**
 * CRM blog posts that substantially duplicate the /planning-tools section, which
 * targets a different audience (project management software rather than real
 * estate CRM). Kept live for inbound links but excluded from the sitemap and
 * marked noindex so they stop competing with the CRM cluster.
 */
const OFF_TOPIC_POST_SLUGS = new Set([
  'scrum-master-certifications-guide-2026'
]);

/** Strips markdown syntax and counts remaining word tokens. */
function countWords(markdown: string): number {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#*_>`|]/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

interface RouteEntry {
  path: string;
  /** URL that should be treated as the one true location for this content. */
  canonicalPath: string;
  noindex: boolean;
}

/** Canonical content routes: hubs plus every dynamic detail page. */
function collectCanonicalRoutes(): RouteEntry[] {
  const entries = new Map<string, RouteEntry>();
  const add = (route: string, noindex = false) => {
    entries.set(route, { path: route, canonicalPath: route, noindex });
  };

  STATIC_ROUTES.forEach(r => add(r, NOINDEX_ROUTES.has(r)));

  initialReviews.forEach(r => add(`/reviews/${r.slug}`));
  initialComparisons.forEach(c => add(`/compare/${c.slug}`));
  initialGuides.forEach(g => add(`/guides/${g.slug}`));
  automationBlueprints.forEach(b => add(`/blueprints/${b.slug}`));
  PLANNING_CATEGORIES.forEach(c => add(`/planning-tools/${c.slug}`));

  // Thin-content rule applies to the CRM blog only. The planning articles are
  // just as short, but that section is out of scope here and its indexing is a
  // separate decision, so it is left untouched.
  initialBlogPosts.forEach(b => {
    const thin = countWords(b.content) < THIN_CONTENT_WORDS;
    add(`/blog/${b.slug}`, thin || OFF_TOPIC_POST_SLUGS.has(b.slug));
  });
  PLANNING_BLOG_ARTICLES.forEach(b => add(`/blog/${b.slug}`));

  add('/admin', true);
  return [...entries.values()].sort((a, b) => a.path.localeCompare(b.path));
}

/**
 * Legacy/duplicate URLs the client router still resolves. They are rendered so
 * crawlers never hit a soft 404, but each declares the canonical URL so ranking
 * signals consolidate onto a single page.
 */
function collectAliasRoutes(): RouteEntry[] {
  const aliases: RouteEntry[] = [
    { path: '/comparisons', canonicalPath: '/compare', noindex: false },
    { path: '/guide', canonicalPath: '/guides', noindex: false },
    { path: '/buyers-guide', canonicalPath: '/buyer-guide', noindex: false },
    { path: '/privacy', canonicalPath: '/privacy-policy', noindex: false },
    { path: '/affiliate', canonicalPath: '/affiliate-disclosure', noindex: false },
    { path: '/category', canonicalPath: '/directory', noindex: false },
    { path: '/category/crm', canonicalPath: '/directory', noindex: false },
    { path: '/settings', canonicalPath: '/admin', noindex: true }
  ];
  initialComparisons.forEach(c => {
    aliases.push({ path: `/comparison/${c.slug}`, canonicalPath: `/compare/${c.slug}`, noindex: false });
  });
  initialGuides.forEach(g => {
    aliases.push({ path: `/guide/${g.slug}`, canonicalPath: `/guides/${g.slug}`, noindex: false });
  });
  return aliases;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Replaces the generated surfaces of the head with the route's real values. */
function applySeoToDocument(doc: Document, seo: SeoSnapshot, route: string, noindex: boolean) {
  const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
    let el = doc.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
      el = doc.createElement('meta');
      el.setAttribute(attr, key);
      doc.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  doc.title = seo.title;
  // The static shell also carries a (non-standard) name="title" meta tag that
  // would otherwise keep advertising the homepage on every route.
  setMeta('name', 'title', seo.title);
  setMeta('name', 'description', seo.description);
  setMeta('name', 'keywords', seo.keywords.join(', '));

  setMeta('property', 'og:type', seo.ogType);
  setMeta('property', 'og:title', seo.title);
  setMeta('property', 'og:description', seo.description);
  setMeta('property', 'og:url', seo.canonicalUrl);
  setMeta('property', 'og:image', seo.ogImage);

  setMeta('name', 'twitter:title', seo.title);
  setMeta('name', 'twitter:description', seo.description);
  setMeta('name', 'twitter:image', seo.ogImage);
  setMeta('name', 'twitter:url', seo.canonicalUrl);

  let canonical = doc.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = doc.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    doc.head.appendChild(canonical);
  }
  canonical.setAttribute('href', seo.canonicalUrl);

  // Always set robots explicitly: the shared DOM persists across routes, so a
  // noindex value would otherwise leak from /admin or the 404 page onto every
  // route rendered afterwards.
  setMeta(
    'name',
    'robots',
    noindex
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  );

  let jsonLd = doc.getElementById('seo-json-ld');
  if (seo.jsonLd) {
    if (!jsonLd) {
      jsonLd = doc.createElement('script');
      jsonLd.setAttribute('type', 'application/ld+json');
      jsonLd.setAttribute('id', 'seo-json-ld');
      doc.head.appendChild(jsonLd);
    }
    jsonLd.textContent = JSON.stringify(seo.jsonLd, null, 2);
  } else if (jsonLd) {
    jsonLd.remove();
  }

  doc.documentElement.setAttribute('lang', 'en');
  if (route === NOT_FOUND_SENTINEL) {
    doc.title = 'Page Not Found (404) | CRMsolo';
  }
}

function writeRouteFile(route: string, html: string) {
  const relative = route === '/' ? 'index.html' : `${route.replace(/^\//, '')}.html`;
  const target = path.join(DIST, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, html);
  return relative;
}

function write404(html: string) {
  fs.writeFileSync(path.join(DIST, '404.html'), html);
}

/**
 * Hub routes such as /blueprints also exist as directories holding their detail
 * pages (dist/blueprints/<slug>.html), and static hosts prefer a directory over
 * the sibling .html file, which redirects `/blueprints` to `/blueprints/` and
 * breaks the hub URL. Mirroring each hub into `<hub>/index.html` keeps the
 * extensionless URL working regardless of which form the host resolves first.
 */
function mirrorHubsIntoDirectories(written: string[]) {
  const writtenSet = new Set(written);
  const directories = new Set<string>();
  for (const file of written) {
    const slash = file.lastIndexOf('/');
    if (slash !== -1) directories.add(file.slice(0, slash));
  }
  const mirrored: string[] = [];
  for (const dir of directories) {
    const hubFile = `${dir}.html`;
    const indexPath = path.join(DIST, dir, 'index.html');
    if (writtenSet.has(hubFile) && !fs.existsSync(indexPath)) {
      fs.copyFileSync(path.join(DIST, hubFile), indexPath);
      mirrored.push(`${dir}/index.html`);
    }
  }
  return mirrored;
}

function generateSitemap(entries: RouteEntry[]) {
  // Anything marked noindex — /admin, plus thin or off-topic blog posts — is
  // deliberately withheld. Advertising a noindex URL in the sitemap sends
  // crawlers conflicting signals and is reported as an error in Search Console.
  const indexable = entries.filter(e => !e.noindex).map(e => e.path);
  const today = new Date().toISOString().slice(0, 10);
  const priorityFor = (r: string) => {
    if (r === '/') return '1.0';
    if (['/directory', '/reviews', '/compare', '/blueprints'].includes(r)) return '0.9';
    if (r === '/blog' || r === '/guides' || r === '/buyer-guide') return '0.8';
    return '0.7';
  };
  const changefreqFor = (r: string) => (r === '/' || r.startsWith('/blog/') ? 'weekly' : 'monthly');

  const urlEntries = indexable
    .map(route => [
      '  <url>',
      `    <loc>${escapeXml(`${ORIGIN}${route === '/' ? '/' : route}`)}</loc>`,
      `    <lastmod>${today}</lastmod>`,
      `    <changefreq>${changefreqFor(route)}</changefreq>`,
      `    <priority>${priorityFor(route)}</priority>`,
      '  </url>'
    ].join('\n'))
    .join('\n');

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlEntries,
    '</urlset>',
    ''
  ].join('\n');

  fs.writeFileSync(path.join(PUBLIC, 'sitemap.xml'), xml);
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), xml);
  return indexable.length;
}

async function main() {
  const shellPath = path.join(DIST, 'index.html');
  if (!fs.existsSync(shellPath)) {
    throw new Error('dist/index.html not found - run `vite build` before prerendering.');
  }
  const shell = fs.readFileSync(shellPath, 'utf8');

  const dom = new JSDOM(shell, { url: `${ORIGIN}/`, pretendToBeVisual: true });
  const { window } = dom;

  // react-dom and the app read the DOM through globals, so bind them before the
  // app module is imported (module side effects may touch window).
  global.window = window as unknown as Window & typeof globalThis;
  global.document = window.document;
  Object.defineProperty(global, 'navigator', { value: window.navigator, configurable: true });
  global.localStorage = window.localStorage as unknown as Storage;
  global.sessionStorage = window.sessionStorage as unknown as Storage;
  global.history = window.history as unknown as History;
  global.location = window.location as unknown as Location;
  global.HTMLElement = window.HTMLElement as unknown as typeof HTMLElement;
  global.Element = window.Element as unknown as typeof Element;
  global.Node = window.Node as unknown as typeof Node;
  global.CustomEvent = window.CustomEvent as unknown as typeof CustomEvent;
  global.Event = window.Event as unknown as typeof Event;
  window.scrollTo = () => {};

  const stubClass = class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  };
  const matchMedia = () => ({
    matches: false,
    media: '',
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() { return false; }
  });
  (global as any).matchMedia = matchMedia;
  (global as any).IntersectionObserver = stubClass;
  (global as any).ResizeObserver = stubClass;
  (window as any).matchMedia = matchMedia;
  (window as any).IntersectionObserver = stubClass;
  (window as any).ResizeObserver = stubClass;
  (global as any).IS_REACT_ACT_ENVIRONMENT = true;

  // The news widget calls its API on mount; fail fast instead of hanging the build.
  (global as any).fetch = () => Promise.reject(new Error('prerender: network disabled'));

  const { createRoot } = await import('react-dom/client');
  const { act } = await import('react');
  const { resetSeoTitlePriority } = await import('../src/lib/seo');
  const App = (await import('../src/App.tsx')).default;

  const routes = collectCanonicalRoutes();
  const container = window.document.getElementById('root');
  if (!container) throw new Error('dist/index.html is missing #root');

  let captured: SeoSnapshot | null = null;
  window.addEventListener('crmsolo:seo', (event: Event) => {
    captured = (event as CustomEvent<SeoSnapshot>).detail;
  });

  /**
   * Renders a route into the shared container and serializes the document while
   * the markup is still mounted. `root.unmount()` clears the container, so it
   * must only run after serialization.
   */
  const renderAndSerialize = async (route: RouteEntry, canonicalUrl?: string): Promise<string> => {
    captured = null;
    // The shell and prerenderer share one long-lived DOM, so per-navigation
    // title precedence must be reset exactly as the browser does on a real
    // route change.
    resetSeoTitlePriority();
    window.history.pushState(null, '', route.path);
    container.innerHTML = '';

    const root = createRoot(container);
    await act(async () => {
      root.render(React.createElement(App));
    });
    if (!captured) {
      throw new Error(`No SEO metadata captured for ${route.path}`);
    }
    const seo: SeoSnapshot = canonicalUrl ? { ...captured, canonicalUrl } : captured;
    applySeoToDocument(window.document, seo, route.path, route.noindex);

    const html = dom.serialize();
    await act(async () => {
      root.unmount();
    });
    return html;
  };

  const written: string[] = [];
  for (const entry of routes) {
    // Canonical routes already report their own URL, so the client-generated
    // canonical is used as-is.
    written.push(writeRouteFile(entry.path, await renderAndSerialize(entry)));
  }

  for (const alias of collectAliasRoutes()) {
    const canonicalUrl = `${ORIGIN}${alias.canonicalPath}`;
    written.push(writeRouteFile(alias.path, await renderAndSerialize(alias, canonicalUrl)));
  }

  // Custom 404: same shell rendered at an unmatched path, marked noindex.
  captured = null;
  resetSeoTitlePriority();
  window.history.pushState(null, '', NOT_FOUND_SENTINEL);
  container.innerHTML = '';
  const notFoundRoot = createRoot(container);
  await act(async () => {
    notFoundRoot.render(React.createElement(App));
  });
  const notFoundSeo: SeoSnapshot = captured ?? {
    title: 'Page Not Found (404) | CRMsolo',
    description: 'The page you requested could not be found on CRMsolo.',
    canonicalUrl: `${ORIGIN}/`,
    ogType: 'website',
    ogImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    keywords: [],
    jsonLd: []
  };
  applySeoToDocument(window.document, notFoundSeo, NOT_FOUND_SENTINEL, true);
  write404(dom.serialize());
  await act(async () => {
    notFoundRoot.unmount();
  });

  const mirrored = mirrorHubsIntoDirectories(written);
  const sitemapCount = generateSitemap(routes);
  console.log(`[prerender] wrote ${written.length} route files + 404.html`);
  console.log(`[prerender] mirrored hubs: ${mirrored.join(', ') || 'none'}`);
  console.log(`[prerender] sitemap.xml contains ${sitemapCount} indexable URLs`);
}

main().catch(err => {
  console.error('[prerender] failed:', err);
  process.exit(1);
});
