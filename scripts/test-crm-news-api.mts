/**
 * Exercises the /api/crm-news serverless handler without network access to
 * confirm it always returns real news JSON (never a 404/HTML body) and that
 * method and caching behavior are correct.
 */
import handler from '../api/crm-news.js';

interface MockRes {
  setHeader(k: string, v: string): void;
  status(c: number): MockRes;
  json(b: unknown): MockRes;
  state: { status: number; headers: Record<string, string>; body: any };
}

function mockRes(): MockRes {
  const state: MockRes['state'] = { status: 200, headers: {}, body: null };
  const res: MockRes = {
    setHeader: (k, v) => { state.headers[k] = v; },
    status: c => { state.status = c; return res; },
    json: b => { state.body = b; return res; },
    state
  };
  return res;
}

let failures = 0;
const check = (label: string, cond: boolean, detail = '') => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${label}${detail ? ` (${detail})` : ''}`);
  if (!cond) failures++;
};

delete process.env.GEMINI_API_KEY;

// 1. Missing API key must still return curated news JSON, not an error.
const noKey = mockRes();
await handler({ method: 'GET', query: {} } as any, noKey as any);
check('GET without GEMINI_API_KEY returns 200', noKey.state.status === 200);
check('payload has non-empty news array', Array.isArray(noKey.state.body?.news) && noKey.state.body.news.length > 0);
check('news items have required fields',
  noKey.state.body.news.every((n: any) => n.title && n.source && n.url && n.targetCrm));
check('reports isGrounded=false', noKey.state.body?.isGrounded === false);
check('sets a cache header', Boolean(noKey.state.headers['Cache-Control']));

// 2. Cached response is served on the next call.
const cached = mockRes();
await handler({ method: 'GET', query: {} } as any, cached as any);
check('second GET is served from cache', cached.state.body?.isFromCache === true);

// 3. force=true still returns valid JSON.
const forced = mockRes();
await handler({ method: 'GET', query: { force: 'true' } } as any, forced as any);
check('force=true returns news', Array.isArray(forced.state.body?.news) && forced.state.body.news.length > 0);

// 4. Non-GET is rejected.
const post = mockRes();
await handler({ method: 'POST', query: {} } as any, post as any);
check('POST returns 405', post.state.status === 405);

console.log(failures === 0 ? 'CRM-NEWS API TESTS PASSED' : `CRM-NEWS API TESTS FAILED (${failures})`);
process.exit(failures === 0 ? 0 : 1);
