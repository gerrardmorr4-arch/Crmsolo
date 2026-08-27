export interface PricingTier {
  name: string;
  price: number;
  period: string; // "month" | "year"
  features: string[];
}

export interface RatingBreakdown {
  easeOfUse: number; // 0-10
  valueForMoney: number; // 0-10
  realEstateFeatures: number; // 0-10
  mobileApp: number; // 0-10
}

export interface CRMReview {
  id: string;
  slug: string;
  name: string;
  logo: string;
  overallScore: number; // 0-10
  pricingTiers: PricingTier[];
  pros: string[];
  cons: string[];
  bestFor: string;
  oneLinePitch: string;
  affiliateLink: string;
  verdict: string;
  ratingBreakdown: RatingBreakdown;
  detailedReview: string; // Markdown supported
  lastUpdated: string;
  // GetApp-style Directory Extensions
  categoryBadge?: string; // e.g. "Editor's Choice", "Best Value", "Top Rated 2026", "Easiest to Use"
  pricingModel?: 'free-tier' | 'free-trial' | 'paid-subscription';
  startingPrice?: number;
  freeTrialDays?: number;
  recommendationRate?: number; // e.g. 96 for 96%
  userRatingCount?: number;
  featuresList?: string[];
  deployments?: string[];
  targetAgents?: string[];
}

export interface CRMComparison {
  id: string;
  slug: string;
  crmAId: string; // CRMReview ID
  crmBId: string; // CRMReview ID
  verdictSummary: string;
  categoryWinners: {
    [category: string]: {
      winnerId: string | 'draw';
      reason: string;
    };
  };
  overallWinnerId: string;
  isPillarHub?: boolean;
  title: string;
}

export interface CRMGuide {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown supported
  author: string;
  readTime: string;
  category: string;
  agentStage: 'new-agent' | 'established-solo' | 'small-team' | 'all';
  budgetTier: 'free' | 'budget' | 'low' | 'mid' | 'premium' | 'all';
  primaryNeed: 'lead-gen' | 'follow-up' | 'transactions' | 'mobile' | 'crm-selection' | 'marketing' | 'productivity' | 'all';
  lastUpdated: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  category: string;
  readTime?: string;
  metaTitle?: string;
  metaDescription?: string;
  targetKeywords?: string[];
  featuredTools?: Array<{ name: string; url: string; badge?: string }>;
}

export interface CalculatorInputs {
  leadsPerMonth: number;
  responseTime: 'under-5' | 'within-1-hour' | 'few-hours' | 'next-day';
  commissionPerDeal: number;
  currentCloseRate: number; // percentage (e.g. 3 for 3%)
  hoursSpentOnAdmin: number;
  timeValuePerHour: number;
  currentToolSpend: number;
}

export interface CalculatorResults {
  improvedCloseRate: number;
  additionalDealsPerYear: number;
  additionalAnnualRevenue: number;
  hoursSavedPerWeek: number;
  annualValueTimeSaved: number;
  totalAnnualGain: number;
  recommendations: Array<{
    crmName: string;
    netRoi: number;
    annualCost: number;
    isBestFit: boolean;
    reason: string;
    affiliateLink: string;
  }>;
}

export interface AdSenseSlotSettings {
  enabled: boolean;
  code: string;
  fallbackImage: string;
  fallbackLink: string;
}

export interface AdSenseSettings {
  globalEnabled: boolean;
  publisherId: string;
  headScript: string;
  headerBanner: AdSenseSlotSettings;
  sidebarAd: AdSenseSlotSettings;
  inContentAd: AdSenseSlotSettings;
  footerBanner?: AdSenseSlotSettings;
}

export interface BacklinkPartner {
  id: string;
  crmName: string;
  portalUrl: string;
  anchorText: string;
  category: string;
  status: 'Active' | 'Pending' | 'Archived';
  dateAdded: string;
}

export interface EmailSubscriber {
  id: string;
  email: string;
  name?: string;
  subscribedAt: string;
  source: string;
  status: 'Active' | 'Unsubscribed';
}

export interface PlanningToolItem {
  name: string;
  rating: number; // 0-5
  pricingStarting: string;
  bestFor: string;
  websiteUrl: string;
  trialUrl?: string;
  featuredBadge?: string;
  keyFeatures: string[];
  pros: string[];
  cons: string[];
  geoCompliance: string[]; // e.g. ["US / SOC 2", "EU / GDPR", "UK / ICO", "APAC / IRAP"]
  deployment?: string;
  pricingTier?: 'Free' | 'Freemium' | 'Paid' | 'Open-Source' | 'Enterprise Quote';
  categoryName?: string;
  categorySlug?: string;
}

export interface PlanningCategory {
  id: string;
  slug: string;
  name: string;
  toolCount: number; // Exact bracket number
  tagline: string;
  description: string;
  evaluationCriteria: string[];
  marketOverview: string;
  geoFocus: {
    regions: string[];
    topComplianceStandards: string[];
    typicalCurrencySupport: string[];
    regionalDeploymentNotes: string;
  };
  topTools: PlanningToolItem[];
  indexedTools?: PlanningToolItem[];
  faqs: Array<{ question: string; answer: string }>;
  keyBuyerTakeaways: string[];
}

