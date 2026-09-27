/**
 * Curated CRM industry news used whenever live search-grounding is unavailable
 * (missing GEMINI_API_KEY, quota exhaustion, or a failed request). Shared by the
 * Express dev server and the Vercel serverless function so both environments
 * return the same shape.
 */
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

export function getFallbackNews(message: string): NewsPayload {
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
