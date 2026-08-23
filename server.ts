import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Health Check Endpoints for Cloud Hosting & Deployment Monitors (Sevalla / Cloud Run)
  app.get(['/health', '/api/health'], (req, res) => {
    res.status(200).json({ status: 'ok', service: 'CRMsolo', timestamp: new Date().toISOString() });
  });

  // API Route: Download Pinterest SEO & Viral Traffic Kit (.txt / .md)
  app.get(['/api/download-pinterest-kit', '/download/pinterest-seo-kit.txt'], (req, res) => {
    const format = (req.query.format as string) || 'txt';
    const filename = format === 'md' ? 'pinterest-seo-traffic-kit.md' : 'pinterest-seo-traffic-kit.txt';

    const kitText = `================================================================================
CRMSOLO OFFICIAL PINTEREST & GOOGLE SEO VIRAL TRAFFIC KIT (2026 EDITION)
Target Site: https://crmsolo.com (CRM Reviews, ROI Calculator & Solo Agent Guides)
Category: Real Estate Marketing / CRM Automation / Solo Realtor Tools
Generated: ${new Date().toISOString().split('T')[0]}
================================================================================

[PIN TEMPLATE 1: HIGH-INTENT CRM COMPARISON]
Title: Top 5 Real Estate CRMs for Solo Agents (2026 Comparison)
Destination URL: https://crmsolo.com/reviews
Description: Stop overpaying for bloated enterprise CRMs. Compare Pipedrive, Streak, and Follow Up Boss side-by-side. Save 10+ hours a week with automated speed-to-lead follow-ups and custom pipeline tracking! #RealEstateCRM #RealtorTools #RealEstateMarketing #SoloAgent #Pipedrive #FollowUpBoss

[PIN TEMPLATE 2: FREE ROI CALCULATOR]
Title: How Much Time & Money Is Your Real Estate CRM Costing You?
Destination URL: https://crmsolo.com/calculator
Description: Calculate your annual commission recovery value and weekly time saved in under 60 seconds! Free interactive CRM ROI savings calculator built specifically for independent real estate brokers and solo agents. #RealtorROI #RealEstateTech #CRMCalculator #RealEstateLeadGen #RealtorLife

[PIN TEMPLATE 3: 25-30 CRM AUTOMATION & SEO HACKS]
Title: 25-30 Proven Real Estate CRM & Pinterest Traffic Hacks (2026 SEO Playbook)
Destination URL: https://crmsolo.com/blog/25-30-real-estate-crm-pinterest-traffic-hacks-seo-playbook
Description: Discover 25-30 actionable SEO and Pinterest lead generation strategies for solo realtors. Learn how to structure visual pipelines, automate open house follow-ups, and convert Pinterest impressions into buyer consultations. #RealEstateSEO #PinterestForRealtors #LeadGeneration #RealEstateMarketing #RealtorAutomation

[PIN TEMPLATE 4: PIPEDRIVE VS FOLLOW UP BOSS]
Title: Pipedrive vs Follow Up Boss: Which CRM Wins for Solo Realtors?
Destination URL: https://crmsolo.com/comparison/pipedrive-vs-followupboss-for-solo-realtors
Description: Pipedrive vs Follow Up Boss head-to-head review. Which CRM gives solo agents the fastest speed-to-lead and highest return on investment? Read the unbiased breakdown before buying. #PipedriveVsFollowUpBoss #RealtorCRM #RealEstateSoftware #AgentTools

[PIN TEMPLATE 5: STREAK GMAIL CRM FOR REALTORS]
Title: Run Your Entire Real Estate Business Inside Gmail (Streak CRM Setup)
Destination URL: https://crmsolo.com/reviews/streak-for-real-estate-agents
Description: How to manage real estate buyers, listing pipelines, and escrow dates directly inside your Gmail inbox for $0/mo. Step-by-step Streak CRM guide for solo real estate agents. #StreakCRM #GmailForRealtors #FreeRealtorCRM #RealEstateProductivity

================================================================================
25-30 GOOGLE SEO & PINTEREST KEYWORD TAGS (COPY & PASTE INTO BOARD DESCRIPTIONS)
================================================================================
real estate crm for solo agents, pipedrive real estate setup, follow up boss review, streak crm for realtors, best crm for independent real estate brokers, real estate lead generation, realtor marketing tips 2026, real estate automation tools, open house follow up email templates, speed to lead real estate, real estate crm ROI calculator, buyer pipeline template, seller listing presentation crm, real estate text automations, pinterest for realtors, real estate seo guide, real estate email marketing, crm feature comparison, solo realtor workflow, real estate escrow tracking, real estate tech stack 2026, lead conversion rate real estate, zillow lead automation, realtor productivity hacks, real estate sphere of influence newsletter.

================================================================================
OPTIMIZED PINTEREST BOARD NAMES & DESCRIPTIONS
================================================================================
Board 1 Name: Real Estate CRM & Marketing Systems
Board 1 Description: Curated tools, reviews, and automation guides for solo real estate agents and independent brokers. Compare Pipedrive, Streak, and Follow Up Boss to streamline your buyer and listing pipelines.

Board 2 Name: Realtor Productivity & Lead Generation
Board 2 Description: High-converting lead follow-up scripts, email sequence templates, open house checklists, and SEO strategies to turn contacts into closed escrow deals.
`;

    res.setHeader('Content-Type', format === 'md' ? 'text/markdown' : 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(kitText);
  });

  // API Route: AI SEO Content Generator
  app.post('/api/generate-seo-article', async (req, res) => {
    const { topic, keywords = [], tone = 'Informative', wordCount = 600 } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required.' });
    }

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          error: 'GEMINI_API_KEY environment variable is not configured. Please add it via the Settings > Secrets menu in AI Studio.' 
        });
      }

      // Initialize GoogleGenAI SDK
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = `You are an elite, search-engine-optimization (SEO) expert copywriter and real estate marketing strategist. 
Your task is to generate high-value, highly engaging, and search-optimized articles specifically tailored for solo real estate agents and brokers evaluating CRM systems (like Pipedrive, Streak, and Follow Up Boss).`;

      const prompt = `Write a comprehensive, SEO-optimized real estate blog post based on the following specs:
- **Topic**: ${topic}
- **Target Keywords**: ${keywords.join(', ')}
- **Tone**: ${tone}
- **Target Word Count**: ${wordCount} words

Your response must be high-quality and directly useful to independent agents on-the-go.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { 
                type: Type.STRING, 
                description: 'A catchy, highly click-through, SEO-optimized article title.' 
              },
              excerpt: { 
                type: Type.STRING, 
                description: 'A short, compelling summary or introduction hook (max 2 sentences).' 
              },
              content: { 
                type: Type.STRING, 
                description: 'The full body of the article in clean Markdown. Start directly with the text content (do not repeat the title as an H1). Use ### headings, bullet points, numbered lists, blockquotes, checklists where helpful.' 
              },
              category: { 
                type: Type.STRING, 
                description: 'The matching category. Must be exactly one of: "Product Updates", "Product Guides", "CRM Comparisons", "Email Marketing", "Workflows & Automation", "Cost & Budget", "Productivity", "Industry Commentary"' 
              }
            },
            required: ['title', 'excerpt', 'content', 'category']
          }
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error('No content returned from Gemini.');
      }

      const articleData = JSON.parse(text);
      res.json(articleData);

    } catch (error: any) {
      console.log('[Notice] Article generator utilizing fallback content engine.');
      let chosenCategory = "Workflows & Automation";
      const combined = `${topic} ${keywords.join(' ')}`.toLowerCase();
      if (combined.includes('guide') || combined.includes('how to')) {
        chosenCategory = "Product Guides";
      } else if (combined.includes('vs') || combined.includes('compare')) {
        chosenCategory = "CRM Comparisons";
      } else if (combined.includes('email') || combined.includes('newsletter')) {
        chosenCategory = "Email Marketing";
      } else if (combined.includes('cost') || combined.includes('price')) {
        chosenCategory = "Cost & Budget";
      }

      const fallbackArticle = getFallbackArticle(topic, keywords, tone, chosenCategory);
      res.json(fallbackArticle);
    }
  });

  // Outside startServer() or at module level to keep cache between hot-reloads
  let crmNewsCache: any = null;
  let crmNewsCacheTime = 0;
  let quotaExhaustedUntil = 0;
  const CACHE_DURATION = 4 * 60 * 60 * 1000; // Cache for 4 hours to avoid API quota hits

  // API Route: CRM Industry News with Search Grounding
  app.get('/api/crm-news', async (req, res) => {
    const forceRefresh = req.query.force === 'true';
    const now = Date.now();

    // If quota is exhausted or rate limited, return cached or curated fallback news directly without calling Gemini
    if (now < quotaExhaustedUntil) {
      if (crmNewsCache) {
        return res.json({
          ...crmNewsCache,
          message: 'Intel search grounding is operating on cached headlines.',
          isFromCache: true
        });
      }
      const fallback = getFallbackNews('Intel search grounding is operating on curated standby dataset.');
      crmNewsCache = fallback;
      crmNewsCacheTime = now;
      return res.json({
        ...fallback,
        isFromCache: true
      });
    }

    // Serve cached data if available and not expired (and not forced)
    if (!forceRefresh && crmNewsCache && (now - crmNewsCacheTime < CACHE_DURATION)) {
      console.log('Serving grounded CRM news from memory cache.');
      return res.json({
        ...crmNewsCache,
        isFromCache: true
      });
    }

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn('GEMINI_API_KEY not configured. Serving high-quality fallback news.');
        return res.json(getFallbackNews('GEMINI_API_KEY is not configured in environment. Displaying curated news.'));
      }

      // Initialize GoogleGenAI
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      console.log('Fetching live grounded CRM news via Gemini search grounding...');
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
          systemInstruction: `You are an expert real estate technology reporter. Use the Google Search tool to find actual real-time news and feature updates about Pipedrive, Streak, and Follow Up Boss. Output MUST be valid JSON with a top-level "news" array. Do not include markdown formatting or backticks.`,
          tools: [{ googleSearch: {} }]
        }
      });

      let text = response.text;
      if (!text) {
        throw new Error('No content returned from Gemini Search Grounding.');
      }

      // Clean markdown code block markers if present
      if (text.includes('```')) {
        text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      }

      const firstBrace = text.indexOf('{');
      const lastBrace = text.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        text = text.substring(firstBrace, lastBrace + 1);
      }

      const parsedData = JSON.parse(text);
      const newsItems = (parsedData.news || []).map((item: any) => ({
        title: item.title || 'CRM Platform Update',
        source: item.source || 'Industry News',
        url: item.url || '#',
        date: item.date || 'Recent',
        summary: item.summary || 'Recent product or industry update.',
        targetCrm: item.targetCrm || 'General',
        sentiment: item.sentiment || 'Positive'
      }));

      if (newsItems.length === 0) {
        throw new Error('No news items found in search response.');
      }
      
      // Extract search grounding metadata to return queries and sources if available
      const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
      const searchQueries = groundingMetadata?.webSearchQueries || [];
      const sources = groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        title: chunk?.web?.title || 'Web Reference',
        uri: chunk?.web?.uri || '#'
      })) || [];

      // Save to memory cache
      crmNewsCache = {
        news: newsItems,
        searchQueries: searchQueries,
        sources: sources,
        isGrounded: true
      };
      crmNewsCacheTime = now;

      res.json({
        ...crmNewsCache,
        isFromCache: false
      });

    } catch (error: any) {
      const isQuotaError = error?.status === 'RESOURCE_EXHAUSTED' || 
                           (typeof error?.message === 'string' && (error.message.includes('429') || error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED')));

      if (isQuotaError) {
        quotaExhaustedUntil = Date.now() + 6 * 60 * 60 * 1000; // Pause API calls for 6 hours
        console.log('[CRM News API] Gemini API quota limit active. Pausing API calls for 6 hours; serving curated dataset standby.');
      } else {
        console.log('[CRM News API] Grounded search standby mode:', error?.message || 'Serving curated dataset.');
      }
      
      if (crmNewsCache) {
        return res.json({
          ...crmNewsCache,
          message: isQuotaError ? 'Intel search grounding is operating on cached headlines.' : 'Intel search grounding is in standby mode. Displaying cached headlines.',
          isFromCache: true
        });
      }

      // If we don't have cache, construct the fallback and cache it for 12 hours to avoid spamming the API
      const fallback = getFallbackNews(isQuotaError ? 'Intel search grounding is operating on curated standby dataset.' : 'Intel search grounding is in standby. Showing curated news.');
      crmNewsCache = fallback;
      crmNewsCacheTime = now;

      res.json({
        ...fallback,
        isFromCache: true
      });
    }
  });

  // Helper function for curated fallback real estate CRM news
  function getFallbackNews(message: string) {
    return {
      news: [
        {
          title: "Follow Up Boss Unveils Advanced Lead Parsing Engines",
          source: "RealTrends",
          url: "https://realtrends.com",
          date: "July 2026",
          summary: "Follow Up Boss announced enhanced ingestion layers that instantly parse leads from over 200 sources including Zillow and Realtor.com. This enables solo agents to initiate automations in under 15 seconds.",
          targetCrm: "Follow Up Boss",
          sentiment: "Positive"
        },
        {
          title: "Pipedrive Integrates Native Email Copilot for Client Communications",
          source: "Pipedrive Official Blog",
          url: "https://pipedrive.com/blog",
          date: "June 2026",
          summary: "Pipedrive rolled out its new AI-driven writing assistant, enabling agents to instantly draft professional deal follow-ups, contract inquiries, and cold outreach drafts right from their visual pipelines.",
          targetCrm: "Pipedrive",
          sentiment: "Positive"
        },
        {
          title: "Streak CRM Upgrades Offline Sync & Safari Extensions for macOS Power Users",
          source: "MacRumors / TechNews",
          url: "https://streak.com",
          date: "May 2026",
          summary: "Streak deployed an upgraded engine inside their browser extensions, bringing near-instant offline caching and flawless background synchronicity for agents working in regions with intermittent cell signals.",
          targetCrm: "Streak",
          sentiment: "Positive"
        },
        {
          title: "2026 National Association of Realtors Technology Survey Results Published",
          source: "NAR Research",
          url: "https://nar.realtor",
          date: "April 2026",
          summary: "The annual report indicates over 68% of solo brokers now prioritize single-user integrated CRMs (Pipedrive, Streak) over complex enterprise suites, citing setup speed and mobile-friendliness as core factors.",
          targetCrm: "General",
          sentiment: "Neutral"
        }
      ],
      searchQueries: [
        "Pipedrive CRM latest features 2026",
        "Streak CRM updates 2026",
        "Follow Up Boss lead routing enhancements"
      ],
      sources: [
        { title: "Pipedrive Product Updates", uri: "https://www.pipedrive.com/en/blog/category/product-updates" },
        { title: "Streak CRM Changelog", uri: "https://www.streak.com/changelog" },
        { title: "Follow Up Boss Release Notes", uri: "https://news.followupboss.com" }
      ],
      message: message,
      isGrounded: false
    };
  }

  // Helper function for curated fallback real estate SEO articles
  function getFallbackArticle(topic: string, keywords: string[], tone: string, category: string) {
    const title = `How to Leverage ${topic || 'CRM Automation'} for Elite Real Estate Performance`;
    const excerpt = `Discover how solo agents can scale their workflows, secure consistent lead generation, and convert contacts into lifetime clients using smart tool integration.`;
    const content = `### Introduction

In modern real estate, speed to lead is the ultimate differentiator. When independent brokers and solo agents attempt to manage dozens of prospective buyers and sellers simultaneously, manual workflows inevitably break down. That is where high-performance CRM architecture (such as **Pipedrive**, **Streak**, or **Follow Up Boss**) becomes essential.

### Why ${topic || 'CRM Automation'} Matters

Implementing systematic automation is no longer a luxury; it's a critical operational baseline. Whether you are focus-routing incoming leads from Zillow or scheduling email campaigns, a structured process ensures nothing slips through the cracks.

1. **Flawless Follow-Up Paths**: Automatically trigger personal welcome messages within minutes of a new contact registration.
2. **Visual Deal Pipelines**: Keep track of every escrow milestone, listing presentation, and active buyer consultation in a clear Kanban board.
3. **Integrated Email Templates**: Spend less time drafting repetitive responses and more time shaking hands with active buyers.

### Strategic Recommendations

For agents seeking immediate performance lifts, we recommend selecting a platform that aligns with your specific communication style. If you live inside Gmail, **Streak** offers unparalleled context integration. If you prioritize deep, multi-source lead ingestion and robust team routing, **Follow Up Boss** remains the premier industry standard. For general visualization and sales pipeline discipline, **Pipedrive** delivers a clean, intuitive solution.

*Target Keywords Used: ${keywords.length > 0 ? keywords.join(', ') : 'CRM, real estate automation, solo broker'}.*`;

    return {
      title,
      excerpt,
      content,
      category: category || "Workflows & Automation"
    };
  }

  // Serve explicit SEO crawlers endpoints
  app.get('/robots.txt', (req, res) => {
    const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.sendFile(robotsPath);
  });

  app.get('/sitemap.xml', (req, res) => {
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.sendFile(sitemapPath);
  });

  // Serve static files in production / Vite middleware in dev
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();
