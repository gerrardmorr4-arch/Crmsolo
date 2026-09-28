# CRMSolo repository notes

## Build and verification

The build has three stages: `vite build`, then the prerenderer, then the
esbuild bundle of `server.ts` for Cloud Run/VPS style hosting.

```bash
npm run build        # vite build + prerender + esbuild server bundle
npm run lint         # tsc --noEmit
npm run verify:seo   # checks the prerendered output in dist/
npm run dev          # Express + Vite middleware on :3000
```

Always run `verify:seo` after touching anything under `src/lib/seo.ts`,
`src/App.tsx`, or `scripts/prerender.ts`. It enforces:

- every sitemap URL resolves to a page with a unique title
- a canonical link, an H1, and a substantial body
- valid, non-empty JSON-LD

## Deployment topology

Vercel (project `crmsolo-6zji`, domain `https://crmsolo.online/`) serves the
static `dist/` output. Two consequences to keep in mind:

- `server.ts` runs only locally and on non-Vercel hosting. Anything under
  `/api/*` needs a serverless function in `api/` instead, or it falls through
  to the SPA rewrite and returns 404.
- Routing order on Vercel is redirects, then filesystem, then rewrites. A
  directory on disk takes precedence over a sibling `.html` file, so a hub route
  such as `/blueprints` is shadowed by the `dist/blueprints/` directory.
  `scripts/prerender.ts` mirrors those hubs into `<hub>/index.html` to keep the
  extensionless URL working.

## SEO model

- `src/lib/seo.ts` owns all metadata. Pages call `useSEO(...)`. A page-level
  value wins over the App-shell fallback; `resetSeoTitlePriority()` (used by the
  prerenderer per route) restores that precedence.
- `noindex` belongs only on `/admin` and `404.html`.
- Canonical routes are `/guides/<slug>`, `/compare/<slug>`, `/privacy-policy`
  and `/category/crm`. Aliases (`/guide/<slug>`, `/comparison/<slug>`) must not
  appear in the sitemap.
- Structured data: WebSite + Organization everywhere, FAQPage on reviews and
  comparisons, Product on review details, BlogPosting on blog and guide detail
  pages. Guide pages must pass `author` to `useSEO` to get article markup.

## Content integrity

CRMSolo publishes editorial assessments, not first-hand lab testing. Keep new
copy consistent with that:

- Do not add customer testimonials, named personas, or aggregate ratings
  (`aggregateRating`, review counts, recommendation percentages) unless they
  come from a real, verifiable source. The site previously shipped invented
  testimonials, a fake video carousel, hardcoded rating schema, and expert
  bylines carrying credentials such as CPA — all of which were removed.
- `/methodology` states ratings are an editorial assessment and not
  independently audited. Do not describe reviews as "tested", "verified",
  "unbiased", or "independently audited".
- Platform scores, prices, and pros/cons live in `initialReviews`
  (`src/data/initialData.ts`) and are the only sanctioned source for homepage
  comparisons. Blog bylines use `CRMSolo Editorial Team`; only Eugene Boniface
  is a real author.

## Lockfile

`bun.lock` is the source of truth. Regenerate it with `bun install` after
changing `package.json`; a stale lockfile breaks frozen-lockfile installs.
