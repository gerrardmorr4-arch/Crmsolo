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
static `dist/` output. Three consequences to keep in mind:

- `server.ts` runs only locally and on non-Vercel hosting. Anything under
  `/api/*` needs a serverless function in `api/` instead, or it falls through
  to the SPA rewrite and returns 404.
- Files in `api/` must not import from outside `api/`. Vercel compiles each
  function on its own and does not trace a relative import that reaches into
  `../src`, so the deployed bundle dies at module load with
  `FUNCTION_INVOCATION_FAILED` (HTTP 500) before the handler runs. A `POST` to
  the endpoint returning 500 instead of its usual 405 is the tell. Keep shared
  data inline in the function, or duplicate it.
- Routing order on Vercel is redirects, then filesystem, then rewrites. A
  directory on disk takes precedence over a sibling `.html` file, so a hub route
  such as `/blueprints` is shadowed by the `dist/blueprints/` directory.
  `scripts/prerender.ts` mirrors those hubs into `<hub>/index.html` to keep the
  extensionless URL working.

## SEO model

- `src/lib/seo.ts` owns all metadata. Pages call `useSEO(...)`. A page-level
  value wins over the App-shell fallback; `resetSeoTitlePriority()` (used by the
  prerenderer per route) restores that precedence.
- `noindex` is not limited to `/admin` and `404.html`. `collectCanonicalRoutes()`
  in `scripts/prerender.ts` also marks a route noindex when its content falls
  under `THIN_CONTENT_WORDS` (150), when it is an off-topic CRM post
  (`OFF_TOPIC_POST_SLUGS`), or when it is an enterprise-buyer planning category
  (`OFF_TOPIC_PLANNING_SLUGS`). Thin routes stay prerendered and reachable; they
  are only withheld from the sitemap. Expanding a page past the threshold returns
  it to the sitemap on the next build, so there is no list to maintain.
- `generateSitemap()` derives indexability from each `RouteEntry.noindex` flag,
  so anything marked noindex is withheld automatically. Never advertise a
  noindex URL in the sitemap — the conflicting signal is a Search Console error.
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

## Planning tool counts

`PlanningCategory.toolCount` is derived, never authored. `PLANNING_CATEGORIES` is
normalized at module load by `getCategoryToolCount()` in
`src/data/planningToolsData.ts`, which counts indexed tools plus curated top
tools not already present, deduped by name. Do not hand-write a `toolCount`
literal and expect it to survive, and do not add copy that asserts a count
without reading it from the category object.

## Lockfile

`bun.lock` is the source of truth. Regenerate it with `bun install` after
changing `package.json`; a stale lockfile breaks frozen-lockfile installs.
