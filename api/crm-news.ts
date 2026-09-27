/**
 * Vercel Serverless Function backing GET /api/crm-news.
 *
 * The Express server in server.ts only runs locally; on Vercel the deployment
 * is static, so without this function the widget's request fell through to the
 * SPA rewrite and returned 404 (Search Console: "Submitted URL not found (404)").
 */
import { getFallbackNews, NewsItem, NewsPayload } from '../src/lib/newsFallback';

// Minimal structural types for the Node/Vercel request+response pair, so the
// function needs no additional type dependency and stays framework-agnostic.
interface ApiRequest {
  method?: string;
  query: Record<string, string | string[] | undefined>;
}

interface ApiResponse {
  setHeader(name: string, value: string): void;
  status(code: number): ApiResponse;
  json(body: unknown): void;
}

const CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 hours, matching the dev server

let crmNewsCache: NewsPayload | null = null;
let crmNewsCacheTime = 0;
let quotaExhaustedUntil = 0;

function extractJson(text: string): string {
  let cleaned = text.trim();
  if (cleaned.includes('```')) {
    cleaned = cleaned.replace(/```json/gi, '').replace(/```/g, '').trim();
  }
  const first = cleaned.indexOf('{');
  const last = cleaned.lastIndexOf('}');
  return first !== -1 && last !== -1 ? cleaned.substring(first, last + 1) : cleaned;
}

async function fetchGroundedNews(): Promise<Omit<NewsPayload, 'message'>> {
  // Imported lazily so the fallback path never pays the SDK load cost.
  const { GoogleGenAI } = await import('@google/genai');
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: `Search for recent real news, headlines, product releases, acquisitions, features, or press articles specifically about:
1. Pipedrive CRM
2. Streak CRM
3. Follow Up Boss CRM

Use Google Search Grounding to find real, actual, current updates.
Return ONLY a valid JSON object with a "news" array containing 5-6 news items.

Format example:
{
  "news": [
    {
      "title": "Headline title",
      "source": "Source or Publisher Name",
      "url": "https://example.com",
      "date": "Month Year",
      "summary": "2-3 sentence summary for real estate agents.",
      "targetCrm": "Pipedrive",
      "sentiment": "Positive"
    }
  ]
}`,
    config: {
      systemInstruction: 'You are an expert real estate technology reporter. Use the Google Search tool to find actual real-time news and feature updates about Pipedrive, Streak, and Follow Up Boss. Output MUST be valid JSON with a top-level "news" array. Do not include markdown formatting or backticks.',
      tools: [{ googleSearch: {} }]
    }
  });

  const raw = response.text;
  if (!raw) throw new Error('No content returned from Gemini Search Grounding.');

  const parsed = JSON.parse(extractJson(raw));
  const news: NewsItem[] = (parsed.news || []).map((item: Record<string, unknown>) => ({
    title: String(item.title || 'CRM Platform Update'),
    source: String(item.source || 'Industry News'),
    url: String(item.url || '#'),
    date: String(item.date || 'Recent'),
    summary: String(item.summary || 'Recent product or industry update.'),
    targetCrm: String(item.targetCrm || 'General'),
    sentiment: String(item.sentiment || 'Positive')
  }));

  if (news.length === 0) throw new Error('No news items found in search response.');

  const metadata = response.candidates?.[0]?.groundingMetadata;
  return {
    news,
    searchQueries: metadata?.webSearchQueries || [],
    sources: metadata?.groundingChunks?.map(chunk => ({
      title: chunk?.web?.title || 'Web Reference',
      uri: chunk?.web?.uri || '#'
    })) || [],
    isGrounded: true
  };
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const forceQuery = Array.isArray(req.query.force) ? req.query.force[0] : req.query.force;
  const forceRefresh = forceQuery === 'true';
  const now = Date.now();

  try {
    if (now < quotaExhaustedUntil) {
      if (crmNewsCache) {
        res.setHeader('Cache-Control', 'public, s-maxage=300');
        return res.json({ ...crmNewsCache, isFromCache: true });
      }
      const fallback = getFallbackNews('Intel search grounding is operating on curated standby dataset.');
      crmNewsCache = fallback;
      crmNewsCacheTime = now;
      res.setHeader('Cache-Control', 'public, s-maxage=300');
      return res.json({ ...fallback, isFromCache: true });
    }

    if (!forceRefresh && crmNewsCache && now - crmNewsCacheTime < CACHE_DURATION) {
      res.setHeader('Cache-Control', 'public, s-maxage=3600');
      return res.json({ ...crmNewsCache, isFromCache: true });
    }

    if (!process.env.GEMINI_API_KEY) {
      const fallback = getFallbackNews('GEMINI_API_KEY is not configured in environment. Displaying curated news.');
      crmNewsCache = fallback;
      crmNewsCacheTime = now;
      res.setHeader('Cache-Control', 'public, s-maxage=3600');
      return res.json(fallback);
    }

    const live = await fetchGroundedNews();
    const curated = getFallbackNews('');
    crmNewsCache = { ...live, message: '' };
    crmNewsCacheTime = now;
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    return res.json({
      ...live,
      sources: live.sources.length ? live.sources : curated.sources,
      searchQueries: live.searchQueries.length ? live.searchQueries : curated.searchQueries,
      isFromCache: false
    });
  } catch (err) {
    const isQuotaError = /quota|rate|429|exceed/i.test(String(err));
    if (isQuotaError) quotaExhaustedUntil = now + 60 * 60 * 1000;
    console.warn('[crm-news] live fetch failed, serving curated fallback:', err);

    if (crmNewsCache) {
      res.setHeader('Cache-Control', 'public, s-maxage=300');
      return res.json({ ...crmNewsCache, isFromCache: true });
    }
    const fallback = getFallbackNews(
      isQuotaError
        ? 'Intel search grounding is operating on curated standby dataset.'
        : 'Intel search grounding is in standby. Showing curated news.'
    );
    crmNewsCache = fallback;
    crmNewsCacheTime = now;
    res.setHeader('Cache-Control', 'public, s-maxage=300');
    return res.json(fallback);
  }
}
