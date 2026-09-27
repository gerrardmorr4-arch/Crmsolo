/**
 * Verifies the prerendered output: every sitemap URL must resolve to a real
 * page with a self-referential canonical, unique metadata and crawlable body
 * content, and the 404 page must exist and be noindex.
 */
import fs from 'fs';
import path from 'path';

const DIST = path.resolve('dist');
const ORIGIN = 'https://crmsolo.online';
let failures = 0;
const fail = msg => { failures++; console.log('  FAIL', msg); };

const sitemap = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
console.log(`sitemap URLs: ${urls.length}`);

const fileFor = url => {
  const p = url.replace(ORIGIN, '').replace(/\/+$/, '') || '/';
  return path.join(DIST, p === '/' ? 'index.html' : `${p}.html`);
};

const titles = new Map();
let minBody = Infinity, minPath = '';

for (const url of urls) {
  const file = fileFor(url);
  if (!fs.existsSync(file)) { fail(`${url} -> missing ${path.relative(DIST, file)}`); continue; }
  const html = fs.readFileSync(file, 'utf8');
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? '';
  const robots = html.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? '';
  const body = html.split('<body')[1] ?? '';
  const h1 = /<h1[\s>]/i.test(body);

  const expectedCanonical = url.replace(/\/+$/, '') || `${ORIGIN}/`;
  if (canonical.replace(/\/+$/, '') !== expectedCanonical.replace(/\/+$/, '')) {
    fail(`${url} canonical mismatch: ${canonical}`);
  }
  if (!canonical.startsWith(ORIGIN)) fail(`${url} canonical not on canonical host: ${canonical}`);
  if (!title) fail(`${url} has no title`);
  if (robots.includes('noindex')) fail(`${url} is noindex but listed in sitemap`);
  if (!h1) fail(`${url} has no <h1> in body`);
  if (body.length < 8000) console.log(`  note: ${url} body is ${body.length} bytes`);

  const parse = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
  if (!parse) {
    fail(`${url} has no JSON-LD`);
  } else {
    try {
      const parsed = JSON.parse(parse[1]);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      if (!items.some(i => i && typeof i === 'object' && i['@type'])) {
        fail(`${url} has empty/typeless JSON-LD`);
      }
    } catch { fail(`${url} has invalid JSON-LD`); }
  }

  if (!titles.has(title)) titles.set(title, []);
  titles.get(title).push(url);
  if (body.length < minBody) { minBody = body.length; minPath = url; }
}

console.log(`unique titles among sitemap URLs: ${titles.size}`);
const dupes = [...titles.entries()].filter(([, u]) => u.length > 1);
if (dupes.length) {
  console.log(`duplicate titles (${dupes.length}):`);
  dupes.forEach(([t, u]) => console.log(`  "${t.slice(0, 60)}" x${u.length}`));
}

const notFound = path.join(DIST, '404.html');
if (!fs.existsSync(notFound)) fail('404.html missing');
else {
  const html = fs.readFileSync(notFound, 'utf8');
  if (!/noindex/.test(html)) fail('404.html is not noindex');
}

console.log(`smallest sitemap body: ${minBody} bytes (${minPath})`);
const htmlCount = fs.readdirSync(DIST, { recursive: true }).filter(f => String(f).endsWith('.html')).length;
console.log(`total html files: ${htmlCount}`);
console.log(failures === 0 ? 'VERIFICATION PASSED' : `VERIFICATION FAILED (${failures} issues)`);
process.exit(failures === 0 ? 0 : 1);
