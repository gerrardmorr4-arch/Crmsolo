import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Trust reverse proxies (Cloud Run, Cloudflare, Sevalla, Nginx) so req.protocol and req.hostname reflect real client
  app.set('trust proxy', true);

  app.use(express.json());

  // Health Check Endpoints for Cloud Hosting & Deployment Monitors (Sevalla / Cloud Run)
  app.get(['/health', '/api/health'], (req, res) => {
    res.status(200).json({ status: 'ok', service: 'CRMsolo', timestamp: new Date().toISOString() });
  });

  // 1. Canonical Domain & HTTPS 301 Permanent Redirect Middleware
  // Resolves Google Search Console "Page with redirect" warnings:
  // - Single-hop 301 from http://crmsolo.online/ -> https://crmsolo.online/
  // - Single-hop 301 from https://www.crmsolo.online/ -> https://crmsolo.online/
  // - Single-hop 301 from http://www.crmsolo.online/ -> https://crmsolo.online/ (eliminates redirect chains)
  // - Consolidates legacy crmsolo.com to canonical crmsolo.online
  app.use((req, res, next) => {
    const hostHeader = req.headers['x-forwarded-host'] || req.headers.host || '';
    const rawHost = Array.isArray(hostHeader) ? hostHeader[0] : hostHeader;
    const hostname = rawHost.split(':')[0].toLowerCase();

    // Skip localhost, 127.0.0.1, internal endpoints, and cloud run dev preview domains
    if (!hostname || hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.run.app') || hostname.endsWith('.internal')) {
      return next();
    }

    const protoHeader = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const proto = (Array.isArray(protoHeader) ? protoHeader[0] : protoHeader).toLowerCase();
    const isHttp = proto === 'http';
    const isWww = hostname.startsWith('www.');
    const isCrmsolo = hostname.includes('crmsolo.');

    // If request comes via http://, www., or old .com domain, perform an immediate single-hop 301 Permanent Redirect
    if (isCrmsolo && (isWww || isHttp || hostname.endsWith('.com'))) {
      const canonicalHost = 'crmsolo.online';
      const cleanPath = req.originalUrl || req.url || '/';
      const destination = `https://${canonicalHost}${cleanPath}`;

      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
      return res.redirect(301, destination);
    }

    // Set canonical security & transport headers for all production requests
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
  });

  // API Route: Download Pinterest SEO & Viral Traffic Kit (.txt / .md)
  app.get(['/api/download-pinterest-kit', '/download/pinterest-seo-kit.txt'], (req, res) => {
    const format = (req.query.format as string) || 'txt';
    const filename = format === 'md' ? 'pinterest-seo-traffic-kit.md' : 'pinterest-seo-traffic-kit.txt';

    const kitText = `================================================================================
CRMSOLO OFFICIAL PINTEREST & GOOGLE SEO VIRAL TRAFFIC KIT (2026 EDITION)
Target Site: https://crmsolo.online (CRM Reviews, ROI Calculator & Solo Agent Guides)
Category: Real Estate Marketing / CRM Automation / Solo Realtor Tools
Generated: ${new Date().toISOString().split('T')[0]}
================================================================================

[PIN TEMPLATE 1: HIGH-INTENT CRM COMPARISON]
Title: Top 5 Real Estate CRMs for Solo Agents (2026 Comparison)
Destination URL: https://crmsolo.online/reviews
Description: Stop overpaying for bloated enterprise CRMs. Compare Pipedrive, Streak, and Follow Up Boss side-by-side. Save 10+ hours a week with automated speed-to-lead follow-ups and custom pipeline tracking! #RealEstateCRM #RealtorTools #RealEstateMarketing #SoloAgent #Pipedrive #FollowUpBoss

[PIN TEMPLATE 2: FREE ROI CALCULATOR]
Title: How Much Time & Money Is Your Real Estate CRM Costing You?
Destination URL: https://crmsolo.online/calculator
Description: Calculate your annual commission recovery value and weekly time saved in under 60 seconds! Free interactive CRM ROI savings calculator built specifically for independent real estate brokers and solo agents. #RealtorROI #RealEstateTech #CRMCalculator #RealEstateLeadGen #RealtorLife

[PIN TEMPLATE 3: 25-30 CRM AUTOMATION & SEO HACKS]
Title: 25-30 Proven Real Estate CRM & Pinterest Traffic Hacks (2026 SEO Playbook)
Destination URL: https://crmsolo.online/blog/25-30-real-estate-crm-pinterest-traffic-hacks-seo-playbook
Description: Discover 25-30 actionable SEO and Pinterest lead generation strategies for solo realtors. Learn how to structure visual pipelines, automate open house follow-ups, and convert Pinterest impressions into buyer consultations. #RealEstateSEO #PinterestForRealtors #LeadGeneration #RealEstateMarketing #RealtorAutomation

[PIN TEMPLATE 4: PIPEDRIVE VS FOLLOW UP BOSS]
Title: Pipedrive vs Follow Up Boss: Which CRM Wins for Solo Realtors?
Destination URL: https://crmsolo.online/comparison/pipedrive-vs-followupboss-for-solo-realtors
Description: Pipedrive vs Follow Up Boss head-to-head review. Which CRM gives solo agents the fastest speed-to-lead and highest return on investment? Read the unbiased breakdown before buying. #PipedriveVsFollowUpBoss #RealtorCRM #RealEstateSoftware #AgentTools

[PIN TEMPLATE 5: STREAK GMAIL CRM FOR REALTORS]
Title: Run Your Entire Real Estate Business Inside Gmail (Streak CRM Setup)
Destination URL: https://crmsolo.online/reviews/streak-for-real-estate-agents
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

  // Serve explicit SEO crawlers endpoints with full resilience
  app.get(['/robots.txt', '/robots'], (req, res) => {
    const candidatePaths = [
      path.join(process.cwd(), 'public', 'robots.txt'),
      path.join(process.cwd(), 'dist', 'robots.txt'),
      path.join(process.cwd(), 'robots.txt')
    ];
    const robotsPath = candidatePaths.find(p => fs.existsSync(p));

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    if (robotsPath) {
      res.sendFile(robotsPath);
    } else {
      res.send("User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: https://crmsolo.online/sitemap.xml\n");
    }
  });

  app.get(['/ads.txt'], (req, res) => {
    const candidatePaths = [
      path.join(process.cwd(), 'public', 'ads.txt'),
      path.join(process.cwd(), 'dist', 'ads.txt'),
      path.join(process.cwd(), 'ads.txt')
    ];
    const adsPath = candidatePaths.find(p => fs.existsSync(p));

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    if (adsPath) {
      res.sendFile(adsPath);
    } else {
      res.send("google.com, pub-1587039209512710, DIRECT, f08c47fec0942fa0\n");
    }
  });

  // Canonical XML Sitemap Endpoint
  app.get('/sitemap.xml', (req, res) => {
    const candidatePaths = [
      path.join(process.cwd(), 'public', 'sitemap.xml'),
      path.join(process.cwd(), 'dist', 'sitemap.xml'),
      path.join(process.cwd(), 'sitemap.xml')
    ];
    const sitemapPath = candidatePaths.find(p => fs.existsSync(p));

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    if (sitemapPath) {
      res.sendFile(sitemapPath);
    } else {
      res.status(404).send('<!-- Sitemap file not found -->');
    }
  });

  // 301 Permanent Redirect for secondary or alternate sitemap variations to canonical /sitemap.xml
  app.get(['/sitemap', '/sitemap_index.xml', '/sitemaps.xml', '/sitemap-index.xml'], (req, res) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    return res.redirect(301, '/sitemap.xml');
  });

  // Catch duplicate-prefix attempts like /https://crmsolo.online/sitemap.xml
  app.use((req, res, next) => {
    if (req.path.includes('sitemap.xml') && req.path !== '/sitemap.xml') {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      return res.redirect(301, '/sitemap.xml');
    }
    next();
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
    // `redirect: false` stops static middleware from redirecting a hub URL such
    // as /blueprints to /blueprints/ just because a sibling directory exists.
    app.use(express.static(distPath, { redirect: false }));
    app.get('*', (req, res) => {
      // Serve the prerendered HTML for this route when it exists so crawlers
      // receive real per-page content and metadata, and return a genuine 404
      // status for unknown paths instead of the old 200 homepage fallback.
      const cleanPath = req.path.replace(/\/+$/, '') || '/';
      const candidate = path.join(distPath, cleanPath === '/' ? 'index.html' : `${cleanPath}.html`);
      if (cleanPath !== '/' && fs.existsSync(candidate)) {
        return res.sendFile(candidate);
      }
      res.status(404).sendFile(path.join(distPath, '404.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
