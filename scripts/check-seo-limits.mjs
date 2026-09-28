/**
 * Enforces the SEO audit limits across every indexable page in dist/, matching
 * the rules the external audit applies:
 *   - <title> must be at most 60 characters
 *   - meta description must be present and 70-160 characters
 *   - heading levels must not skip (h1 -> h3 is a skip)
 *
 * Noindex pages are skipped, matching the audit's indexable-only scope.
 * Requires a completed `npm run build`.
 */
import fs from 'fs';
import path from 'path';

const DIST = path.resolve('dist');
const TITLE_MAX = 60;
const DESC_MIN = 70;
const DESC_MAX = 160;

let failures = 0;
const fail = msg => { failures++; console.log('  FAIL', msg); };

const htmlFiles = fs
  .readdirSync(DIST, { recursive: true })
  .map(f => String(f))
  .filter(f => f.endsWith('.html') && !f.endsWith('404.html'))
  .map(f => path.join(DIST, f));

const decode = s =>
  s
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .trim();

let scanned = 0;
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const rel = path.relative(DIST, file);
  if (/<meta[^>]+name="robots"[^>]*noindex/i.test(html)) continue;
  scanned++;

  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '');
  if (!title) fail(`${rel}: missing <title>`);
  else if (title.length > TITLE_MAX) fail(`${rel}: title is ${title.length} chars (max ${TITLE_MAX})`);

  // Attribute regex stops at the closing double quote, so apostrophes inside
  // the description ("buyer's guide") do not truncate the match.
  const desc = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '');
  if (!desc) fail(`${rel}: missing meta description`);
  else if (desc.length > DESC_MAX) fail(`${rel}: description is ${desc.length} chars (max ${DESC_MAX})`);
  else if (desc.length < DESC_MIN) fail(`${rel}: description is ${desc.length} chars (min ${DESC_MIN})`);

  const levels = [...html.matchAll(/<h([1-6])[^>]*>[\s\S]*?<\/h\1>/gi)].map(m => Number(m[1]));
  let prev = 0;
  for (const level of levels) {
    if (prev && level > prev + 1) fail(`${rel}: heading skips h${prev} -> h${level}`);
    prev = level;
  }
}

console.log(`indexable pages scanned: ${scanned}`);
console.log(failures === 0 ? 'SEO LIMITS PASSED' : `SEO LIMITS FAILED (${failures} issues)`);
process.exit(failures === 0 ? 0 : 1);
