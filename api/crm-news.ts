/**
 * Vercel Serverless Function backing GET /api/crm-news.
 *
 * The Express server in server.ts only runs locally; on Vercel the deployment is
 * static, so without this function the widget's request fell through to the SPA
 * rewrite and returned 404 (Search Console: "Submitted URL not found (404)").
 *
 * This module is deliberately self-contained: it must not import from outside
 * `api/`. Vercel compiles this file on its own, and a relative import reaching
 * into `../src` is not reliably traced into the deployed function bundle, which
 * fails at module load with FUNCTION_INVOCATION_FAILED before the handler runs.
 * The curated dataset below mirrors src/lib/newsFallback.ts, which stays the
 * source used by the local Express server. Keep the two in sync.
 */
import type { IncomingMessage, ServerResponse } from 'http';

export interface NewsItem {
  title: string;
  source: string;
  url: string;
  date: string;
  summary: string;
  targetCrm: string;
  sentiment: string;
}

export interface NewsPayload {
  news: NewsItem[];
  searchQueries: string[];
  sources: { title: string; uri: string }[];
  message: string;
  isGrounded: boolean;
}

function getFallbackNews(message: string): NewsPayload {
  return {
    news: [
      {
        title: 'Follow Up Boss Unveils Advanced Lead Parsing Engines',
        source: 'RealTrends',
        url: 'https://realtrends.com',
        date: 'July 2026',
        summary: 'Follow Up Boss announced enhanced ingestion layers that instantly parse leads from over 200 sources including Zillow and Realtor.com. This enables solo agents to initiate automations in under 15 seconds.',
        targetCrm: 'Follow Up Boss',
        sentiment: 'Positive'
      },
      {
        title: 'Pipedrive Integrates Native Email Copilot for Client Communications',
        source: 'Pipedrive Official Blog',
        url: 'https://pipedrive.com/blog',
        date: 'June 2026',
        summary: 'Pipedrive rolled out its new AI-driven writing assistant, enabling agents to instantly draft professional deal follow-ups, contract inquiries, and cold outreach drafts right from their visual pipelines.',
        targetCrm: 'Pipedrive',
        sentiment: 'Positive'
      },
      {
        title: 'Streak CRM Upgrades Offline Sync & Safari Extensions for macOS Power Users',
        source: 'MacRumors / TechNews',
        url: 'https://streak.com',
        date: 'May 2026',
        summary: 'Streak deployed an upgraded engine inside their browser extensions, bringing near-instant offline caching and flawless background synchronicity for agents working in regions with intermittent cell signals.',
        targetCrm: 'Streak',
        sentiment: 'Positive'
      },
      {
        title: '2026 National Association of Realtors Technology Survey Results Published',
        source: 'NAR Research',
        url: 'https://nar.realtor',
        date: 'April 2026',
        summary: 'The annual report indicates over 68% of solo brokers now prioritize single-user integrated CRMs (Pipedrive, Streak) over complex enterprise suites, citing setup speed and mobile-friendliness as core factors.',
        targetCrm: 'General',
        sentiment: 'Neutral'
      }
    ],
    searchQueries: [
      'Pipedrive CRM latest features 2026',
      'Streak CRM updates 2026',
      'Follow Up Boss lead routing enhancements'
    ],
    sources: [
      { title: 'Pipedrive Product Updates', uri: 'https://www.pipedrive.com/en/blog/category/product-updates' },
      { title: 'Streak CRM Changelog', uri: 'https://www.streak.com/changelog' },
      { title: 'Follow Up Boss Release Notes', uri: 'https://news.followupboss.com' }
    ],
    message,
    isGrounded: false
  };
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
  // Imported lazily so the fallback path never pays the SDK load cost, and so a
  // bundling problem in the SDK cannot break module load for the whole function.
  const { GoogleGenAI } = await import('@google/genai');
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
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

interface ApiRequest extends IncomingMessage {
  query?: Record<string, string | string[] | undefined>;
}

interface ApiResponse extends ServerResponse {
  status(code: number): ApiResponse;
  json(body: unknown): void;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const forceQuery = Array.isArray(req.query?.force) ? req.query?.force[0] : req.query?.force;
    const forceRefresh = forceQuery === 'true';
    const now = Date.now();

    if (now < quotaExhaustedUntil) {
      if (crmNewsCache) {
        res.setHeader('Cache-Control', 'public, s-maxage=300');
        res.status(200).json({ ...crmNewsCache, isFromCache: true });
        return;
      }
      const fallback = getFallbackNews('Intel search grounding is operating on curated standby dataset.');
      crmNewsCache = fallback;
      crmNewsCacheTime = now;
      res.setHeader('Cache-Control', 'public, s-maxage=300');
      res.status(200).json({ ...fallback, isFromCache: true });
      return;
    }

    if (!forceRefresh && crmNewsCache && now - crmNewsCacheTime < CACHE_DURATION) {
      res.setHeader('Cache-Control', 'public, s-maxage=3600');
      res.status(200).json({ ...crmNewsCache, isFromCache: true });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      const fallback = getFallbackNews('GEMINI_API_KEY is not configured in environment. Displaying curated news.');
      crmNewsCache = fallback;
      crmNewsCacheTime = now;
      res.setHeader('Cache-Control', 'public, s-maxage=3600');
      res.status(200).json(fallback);
      return;
    }

    const live = await fetchGroundedNews();
    const curated = getFallbackNews('');
    crmNewsCache = { ...live, message: '' };
    crmNewsCacheTime = now;
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.status(200).json({
      ...live,
      sources: live.sources.length ? live.sources : curated.sources,
      searchQueries: live.searchQueries.length ? live.searchQueries : curated.searchQueries,
      isFromCache: false
    });
  } catch (err) {
    const now = Date.now();
    const isQuotaError = /quota|rate|429|exceed/i.test(String(err));
    if (isQuotaError) quotaExhaustedUntil = now + 60 * 60 * 1000;
    console.warn('[crm-news] live fetch failed, serving curated fallback:', err);

    if (crmNewsCache) {
      res.setHeader('Cache-Control', 'public, s-maxage=300');
      res.status(200).json({ ...crmNewsCache, isFromCache: true });
      return;
    }
    const fallback = getFallbackNews(
      isQuotaError
        ? 'Intel search grounding is operating on curated standby dataset.'
        : 'Intel search grounding is in standby. Showing curated news.'
    );
    crmNewsCache = fallback;
    crmNewsCacheTime = now;
    res.setHeader('Cache-Control', 'public, s-maxage=300');
    res.status(200).json(fallback);
  }
}
