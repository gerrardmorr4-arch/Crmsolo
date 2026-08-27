import { CRMReview, CRMComparison, CRMGuide, BlogPost, AdSenseSettings, BacklinkPartner, EmailSubscriber } from '../types';
import { initialReviews, initialComparisons, initialGuides, initialBlogPosts } from '../data/initialData';
import { PLANNING_BLOG_ARTICLES } from '../data/planningBlogArticles';

const REVIEWS_KEY = 'crmsolo_reviews';
const COMPARISONS_KEY = 'crmsolo_comparisons';
const GUIDES_KEY = 'crmsolo_guides';
const BLOG_POSTS_KEY = 'crmsolo_blog_posts';
const ADSENSE_KEY = 'crmsolo_adsense_settings';
const BACKLINKS_KEY = 'crmsolo_backlinks';
const SUBSCRIBERS_KEY = 'crmsolo_subscribers';

export const initialBacklinks: BacklinkPartner[] = [
  {
    id: 'pipedrive-official',
    crmName: 'Pipedrive CRM Portal',
    portalUrl: 'https://www.pipedrive.com/taf/WHY0MH',
    anchorText: 'Pipedrive for Realtors & Solo Agents',
    category: 'Pipeline Management',
    status: 'Active',
    dateAdded: '2026-07-01'
  },
  {
    id: 'streak-official',
    crmName: 'Streak Gmail Portal',
    portalUrl: 'https://streak.sjv.io/crmsolo-realestate',
    anchorText: 'Streak Gmail Real Estate Extension',
    category: 'Inbox Tools',
    status: 'Active',
    dateAdded: '2026-07-05'
  },
  {
    id: 'fub-official',
    crmName: 'Follow Up Boss Portal',
    portalUrl: 'https://www.followupboss.com',
    anchorText: 'Follow Up Boss Lead Conversion Suite',
    category: 'Real Estate Leads',
    status: 'Active',
    dateAdded: '2026-07-10'
  }
];

export const initialSubscribers: EmailSubscriber[] = [
  {
    id: 'sub-1',
    email: 'eugeneboniface4@yahoo.com',
    name: 'Eugene Boniface',
    subscribedAt: '2026-07-25 10:15',
    source: 'Founder Portal',
    status: 'Active'
  },
  {
    id: 'sub-2',
    email: 'sarah.jenkins@realtybroker.com',
    name: 'Sarah Jenkins',
    subscribedAt: '2026-07-20 14:22',
    source: 'ROI Calculator',
    status: 'Active'
  },
  {
    id: 'sub-3',
    email: 'marcus.vance@solorealtors.com',
    name: 'Marcus Vance',
    subscribedAt: '2026-07-18 09:40',
    source: 'Guide Footer',
    status: 'Active'
  }
];

export const defaultAdSenseSettings: AdSenseSettings = {
  globalEnabled: false,
  publisherId: 'ca-pub-1587039209512710',
  headScript: '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1587039209512710" crossorigin="anonymous"></script>',
  headerBanner: {
    enabled: false,
    code: '',
    fallbackImage: '',
    fallbackLink: '/calculator'
  },
  sidebarAd: {
    enabled: false,
    code: '',
    fallbackImage: '',
    fallbackLink: '/'
  },
  inContentAd: {
    enabled: false,
    code: '',
    fallbackImage: '',
    fallbackLink: '/about'
  },
  footerBanner: {
    enabled: false,
    code: '',
    fallbackImage: '',
    fallbackLink: '/'
  }
};

export function getAdSenseSettings(): AdSenseSettings {
  const data = localStorage.getItem(ADSENSE_KEY);
  if (!data) {
    localStorage.setItem(ADSENSE_KEY, JSON.stringify(defaultAdSenseSettings));
    return defaultAdSenseSettings;
  }
  try {
    const parsed: AdSenseSettings = JSON.parse(data);
    if (parsed.publisherId === 'ca-pub-1234567890123456') {
      parsed.publisherId = 'ca-pub-1587039209512710';
      parsed.globalEnabled = false;
      localStorage.setItem(ADSENSE_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch (e) {
    return defaultAdSenseSettings;
  }
}

export function saveAdSenseSettings(settings: AdSenseSettings): void {
  localStorage.setItem(ADSENSE_KEY, JSON.stringify(settings));
}


export function getReviews(): CRMReview[] {
  const data = localStorage.getItem(REVIEWS_KEY);
  if (!data) {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(initialReviews));
    return initialReviews;
  }
  let reviews: CRMReview[] = JSON.parse(data);
  let changed = false;

  // Merge any new reviews added to initialReviews into localStorage
  for (const initRev of initialReviews) {
    const idx = reviews.findIndex(r => r.id === initRev.id);
    if (idx === -1) {
      reviews.push(initRev);
      changed = true;
    } else {
      // Sync any missing new metadata fields like categoryBadge, featuresList, etc.
      reviews[idx] = {
        ...initRev,
        ...reviews[idx],
        featuresList: reviews[idx].featuresList || initRev.featuresList,
        deployments: reviews[idx].deployments || initRev.deployments,
        targetAgents: reviews[idx].targetAgents || initRev.targetAgents,
        categoryBadge: reviews[idx].categoryBadge || initRev.categoryBadge,
        pricingModel: reviews[idx].pricingModel || initRev.pricingModel,
        startingPrice: reviews[idx].startingPrice ?? initRev.startingPrice,
        recommendationRate: reviews[idx].recommendationRate ?? initRev.recommendationRate,
        userRatingCount: reviews[idx].userRatingCount ?? initRev.userRatingCount
      };
    }
  }

  // Ensure Pipedrive referral link is synced to https://www.pipedrive.com/taf/WHY0MH
  const pipedrive = reviews.find(r => r.id === 'pipedrive');
  if (pipedrive && pipedrive.affiliateLink !== 'https://www.pipedrive.com/taf/WHY0MH') {
    pipedrive.affiliateLink = 'https://www.pipedrive.com/taf/WHY0MH';
    changed = true;
  }
  if (changed) {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  }
  return reviews;
}

export function saveReviews(reviews: CRMReview[]): void {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
}

export function getComparisons(): CRMComparison[] {
  const data = localStorage.getItem(COMPARISONS_KEY);
  if (!data) {
    localStorage.setItem(COMPARISONS_KEY, JSON.stringify(initialComparisons));
    return initialComparisons;
  }
  const comparisons: CRMComparison[] = JSON.parse(data);
  let changed = false;
  for (const initComp of initialComparisons) {
    if (!comparisons.some(c => c.id === initComp.id)) {
      comparisons.push(initComp);
      changed = true;
    }
  }
  if (changed) {
    localStorage.setItem(COMPARISONS_KEY, JSON.stringify(comparisons));
  }
  return comparisons;
}

export function saveComparisons(comparisons: CRMComparison[]): void {
  localStorage.setItem(COMPARISONS_KEY, JSON.stringify(comparisons));
}

export function getGuides(): CRMGuide[] {
  const data = localStorage.getItem(GUIDES_KEY);
  if (!data) {
    localStorage.setItem(GUIDES_KEY, JSON.stringify(initialGuides));
    return initialGuides;
  }
  let guides: CRMGuide[] = JSON.parse(data);
  let updated = false;

  // Merge any new initial guides
  for (const initGuide of initialGuides) {
    if (!guides.some(g => g.id === initGuide.id)) {
      guides.push(initGuide);
      updated = true;
    }
  }

  const remediated = guides.map(g => {
    const fresh = initialGuides.find(f => f.id === g.id);
    if (fresh) {
      const gWords = g.content ? g.content.trim().split(/\s+/).filter(Boolean).length : 0;
      const gExcerptLen = g.excerpt ? g.excerpt.length : 0;
      if (gWords < 250 || gExcerptLen > 160 || gExcerptLen < 80) {
        updated = true;
        return {
          ...g,
          excerpt: fresh.excerpt,
          content: fresh.content
        };
      }
    }
    return g;
  });

  if (updated) {
    localStorage.setItem(GUIDES_KEY, JSON.stringify(remediated));
    return remediated;
  }
  return guides;
}

export function saveGuides(guides: CRMGuide[]): void {
  localStorage.setItem(GUIDES_KEY, JSON.stringify(guides));
}

export function getBlogPosts(): BlogPost[] {
  const allBaselinePosts = [...initialBlogPosts, ...PLANNING_BLOG_ARTICLES];
  const data = localStorage.getItem(BLOG_POSTS_KEY);
  if (!data) {
    localStorage.setItem(BLOG_POSTS_KEY, JSON.stringify(allBaselinePosts));
    return allBaselinePosts;
  }
  const posts: BlogPost[] = JSON.parse(data);
  // Ensure all baseline planning & CRM articles exist in the retrieved array
  const existingIds = new Set(posts.map(p => p.id));
  const missingBaseline = allBaselinePosts.filter(b => !existingIds.has(b.id));
  const combined = [...posts, ...missingBaseline];

  let updated = missingBaseline.length > 0;
  const remediated = combined.map(p => {
    const fresh = allBaselinePosts.find(f => f.id === p.id);
    if (fresh) {
      const pWords = p.content ? p.content.trim().split(/\s+/).filter(Boolean).length : 0;
      const pExcerptLen = p.excerpt ? p.excerpt.length : 0;
      if (pWords < 250 || pExcerptLen > 160 || pExcerptLen < 80) {
        updated = true;
        return {
          ...p,
          excerpt: fresh.excerpt,
          content: fresh.content,
          metaTitle: fresh.metaTitle,
          metaDescription: fresh.metaDescription,
          targetKeywords: fresh.targetKeywords,
          featuredTools: fresh.featuredTools
        };
      }
    }
    return p;
  });

  if (updated) {
    localStorage.setItem(BLOG_POSTS_KEY, JSON.stringify(remediated));
    return remediated;
  }
  return posts;
}

export function saveBlogPosts(posts: BlogPost[]): void {
  localStorage.setItem(BLOG_POSTS_KEY, JSON.stringify(posts));
}

export function getBacklinks(): BacklinkPartner[] {
  const data = localStorage.getItem(BACKLINKS_KEY);
  if (!data) {
    localStorage.setItem(BACKLINKS_KEY, JSON.stringify(initialBacklinks));
    return initialBacklinks;
  }
  return JSON.parse(data);
}

export function saveBacklinks(links: BacklinkPartner[]): void {
  localStorage.setItem(BACKLINKS_KEY, JSON.stringify(links));
}

export function getSubscribers(): EmailSubscriber[] {
  const data = localStorage.getItem(SUBSCRIBERS_KEY);
  if (!data) {
    localStorage.setItem(SUBSCRIBERS_KEY, JSON.stringify(initialSubscribers));
    return initialSubscribers;
  }
  return JSON.parse(data);
}

export function saveSubscribers(subs: EmailSubscriber[]): void {
  localStorage.setItem(SUBSCRIBERS_KEY, JSON.stringify(subs));
}

export function addSubscriber(email: string, name?: string, source: string = 'Website'): EmailSubscriber {
  const subs = getSubscribers();
  const existing = subs.find(s => s.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return existing;
  }
  const newSub: EmailSubscriber = {
    id: 'sub-' + Date.now(),
    email: email.trim(),
    name: name?.trim(),
    subscribedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    source,
    status: 'Active'
  };
  const updated = [newSub, ...subs];
  saveSubscribers(updated);
  return newSub;
}

export function resetToDefaults(): void {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(initialReviews));
  localStorage.setItem(COMPARISONS_KEY, JSON.stringify(initialComparisons));
  localStorage.setItem(GUIDES_KEY, JSON.stringify(initialGuides));
  localStorage.setItem(BLOG_POSTS_KEY, JSON.stringify(initialBlogPosts));
  localStorage.setItem(BACKLINKS_KEY, JSON.stringify(initialBacklinks));
  localStorage.setItem(SUBSCRIBERS_KEY, JSON.stringify(initialSubscribers));
}

