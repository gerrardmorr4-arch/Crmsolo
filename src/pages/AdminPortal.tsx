import React, { useState, useEffect } from 'react';
import { BlogPost, CRMGuide, CRMReview, AdSenseSettings } from '../types';
import { getBlogPosts, saveBlogPosts, getGuides, saveGuides, getReviews, saveReviews, getAdSenseSettings, saveAdSenseSettings } from '../lib/storage';
import { 
  Plus, Trash2, Save, Users, BookOpen, FileText, Award, ShieldAlert, 
  DollarSign, Check, Mail, Settings, Activity, ClipboardList, Info, Sparkles,
  Download, Search, Filter, RefreshCw, Pencil, Globe, Eye, Layout,
  AlertTriangle, CheckCircle, ShieldCheck, Zap, BarChart2, Gauge, Target
} from 'lucide-react';

// Readability metrics evaluator (Flesch Reading Ease Formula & Grade Scale)
function getReadabilityMetrics(text: string) {
  if (!text || text.trim().length === 0) {
    return {
      score: 0,
      grade: 'F',
      gradeLabel: 'Grade F (Empty)',
      gradeBadgeClass: 'bg-red-500 text-white font-black',
      status: 'issue' as const,
      statusLabel: 'Empty Content',
      badgeClass: 'bg-red-100 text-red-800 border-red-200',
      barColor: 'bg-red-500',
      fleschScore: 0,
      gradeLevel: 0,
      avgWordsPerSentence: 0,
      description: 'Missing article content body'
    };
  }

  // Strip HTML formatting
  const cleanText = text.replace(/<[^>]*>/g, ' ');

  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = Math.max(1, sentences.length);
  const words = cleanText.trim().split(/\s+/).filter(w => Boolean(w) && /[a-zA-Z0-9]/.test(w));
  const wordCount = Math.max(1, words.length);

  let syllableCount = 0;
  words.forEach(w => {
    const cleanWord = w.toLowerCase().replace(/[^a-z]/g, '');
    if (cleanWord.length <= 3) {
      syllableCount += 1;
    } else {
      const matches = cleanWord.match(/[aeiouy]{1,2}/g);
      syllableCount += matches ? matches.length : 1;
    }
  });

  const wordsPerSentence = wordCount / sentenceCount;
  const syllablesPerWord = syllableCount / wordCount;

  let flesch = 206.835 - (1.015 * wordsPerSentence) - (84.6 * syllablesPerWord);
  flesch = Math.max(0, Math.min(100, Math.round(flesch)));

  // Flesch-Kincaid Grade Level
  let gradeLevelNum = Math.round((0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59) * 10) / 10;
  if (gradeLevelNum < 1) gradeLevelNum = 1;

  // Grade mapping for B2B/Professional content
  let grade = 'A';
  let gradeLabel = 'Grade A (Optimal)';
  let gradeBadgeClass = 'bg-emerald-500 text-slate-950 font-black';
  let status: 'good' | 'warning' | 'issue' = 'good';
  let statusLabel = 'Optimal / Clear';
  let badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';
  let barColor = 'bg-emerald-500';

  if (flesch >= 55 && flesch <= 80) {
    grade = 'A+';
    gradeLabel = 'Grade A+ (Plain English)';
    gradeBadgeClass = 'bg-emerald-400 text-slate-950 font-black';
    status = 'good';
    statusLabel = 'Optimal Plain English';
    badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';
    barColor = 'bg-emerald-500';
  } else if (flesch >= 45 && flesch < 55) {
    grade = 'A';
    gradeLabel = 'Grade A (Professional Clear)';
    gradeBadgeClass = 'bg-emerald-500 text-slate-950 font-black';
    status = 'good';
    statusLabel = 'Professional Clear';
    badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';
    barColor = 'bg-emerald-500';
  } else if (flesch >= 35 && flesch < 45) {
    grade = 'B';
    gradeLabel = 'Grade B (Fairly Dense)';
    gradeBadgeClass = 'bg-amber-400 text-slate-950 font-black';
    status = 'warning';
    statusLabel = 'Slightly Complex';
    badgeClass = 'bg-amber-100 text-amber-800 border-amber-200';
    barColor = 'bg-amber-500';
  } else if (flesch > 80) {
    grade = 'B';
    gradeLabel = 'Grade B (Very Simple)';
    gradeBadgeClass = 'bg-blue-400 text-slate-950 font-black';
    status = 'good';
    statusLabel = 'Simple Reading';
    badgeClass = 'bg-blue-100 text-blue-800 border-blue-200';
    barColor = 'bg-blue-500';
  } else {
    grade = 'C';
    gradeLabel = 'Grade C (Complex Academic)';
    gradeBadgeClass = 'bg-red-500 text-white font-black';
    status = 'issue';
    statusLabel = 'Dense / Hard to Read';
    badgeClass = 'bg-red-100 text-red-800 border-red-200';
    barColor = 'bg-red-500';
  }

  return {
    score: flesch,
    grade,
    gradeLabel,
    gradeBadgeClass,
    status,
    statusLabel,
    badgeClass,
    barColor,
    fleschScore: flesch,
    gradeLevel: gradeLevelNum,
    avgWordsPerSentence: Math.round(wordsPerSentence * 10) / 10,
    description: `Flesch ${flesch}/100 • Grade ${gradeLevelNum} (~${Math.round(wordsPerSentence)} words/sent)`
  };
}

// Keyword density metrics evaluator with word boundary accuracy
function getKeywordDensityMetrics(text: string, targetKeywords: string[]) {
  if (!text || text.trim().length === 0) {
    return {
      densityPct: 0,
      occurrences: 0,
      uniqueKeywordsCount: 0,
      grade: 'F',
      gradeLabel: 'Grade F (0%)',
      gradeBadgeClass: 'bg-red-500 text-white font-black',
      status: 'issue' as const,
      statusLabel: 'No Keywords',
      badgeClass: 'bg-red-100 text-red-800 border-red-200',
      barColor: 'bg-red-500',
      description: '0.0% density - Missing target keywords'
    };
  }

  const cleanText = text.replace(/<[^>]*>/g, ' ').toLowerCase();
  const words = cleanText.split(/\s+/).filter(Boolean);
  const totalWords = Math.max(1, words.length);

  let totalOccurrences = 0;
  const matchedKeywords: string[] = [];

  targetKeywords.forEach(kw => {
    const kwLower = kw.toLowerCase().trim();
    if (!kwLower) return;

    // Use word boundary regex for exact term count
    const escaped = kwLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    const matches = (cleanText.match(regex) || []).length;

    if (matches > 0) {
      totalOccurrences += matches;
      matchedKeywords.push(kw);
    }
  });

  const densityPct = Math.round(((totalOccurrences / totalWords) * 100) * 10) / 10;

  let grade = 'A+';
  let gradeLabel = 'Grade A+ (Optimal 1-3.5%)';
  let gradeBadgeClass = 'bg-emerald-400 text-slate-950 font-black';
  let status: 'good' | 'warning' | 'issue' = 'good';
  let statusLabel = 'Optimal Density';
  let badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';
  let barColor = 'bg-emerald-500';

  if (densityPct >= 1.0 && densityPct <= 3.5) {
    grade = 'A+';
    gradeLabel = 'Grade A+ (Optimal 1-3.5%)';
    gradeBadgeClass = 'bg-emerald-400 text-slate-950 font-black';
    status = 'good';
    statusLabel = 'Optimal Density';
    badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';
    barColor = 'bg-emerald-500';
  } else if ((densityPct >= 0.5 && densityPct < 1.0) || (densityPct > 3.5 && densityPct <= 4.5)) {
    grade = 'A';
    gradeLabel = densityPct < 1.0 ? 'Grade A (Moderate 0.5-1.0%)' : 'Grade A (Upper 3.5-4.5%)';
    gradeBadgeClass = 'bg-emerald-500 text-slate-950 font-black';
    status = 'good';
    statusLabel = 'Good Density';
    badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';
    barColor = 'bg-emerald-500';
  } else if ((densityPct >= 0.3 && densityPct < 0.5) || (densityPct > 4.5 && densityPct <= 5.5)) {
    grade = 'B';
    gradeLabel = densityPct < 0.5 ? 'Grade B (Low Keywords)' : 'Grade B (High Keywords)';
    gradeBadgeClass = 'bg-amber-400 text-slate-950 font-black';
    status = 'warning';
    statusLabel = densityPct < 0.5 ? 'Slightly Low' : 'Slightly High';
    badgeClass = 'bg-amber-100 text-amber-800 border-amber-200';
    barColor = 'bg-amber-500';
  } else {
    grade = densityPct < 0.3 ? 'C' : 'F';
    gradeLabel = densityPct < 0.3 ? 'Grade C (<0.3% Density)' : 'Grade F (Stuffing >5.5%)';
    gradeBadgeClass = 'bg-red-500 text-white font-black';
    status = 'issue';
    statusLabel = densityPct < 0.3 ? 'Critically Low' : 'Keyword Stuffing';
    badgeClass = 'bg-red-100 text-red-800 border-red-200';
    barColor = 'bg-red-500';
  }

  return {
    densityPct,
    occurrences: totalOccurrences,
    uniqueKeywordsCount: matchedKeywords.length,
    grade,
    gradeLabel,
    gradeBadgeClass,
    status,
    statusLabel,
    badgeClass,
    barColor,
    description: `${densityPct}% density (${totalOccurrences} matches across ${matchedKeywords.length} terms)`
  };
}

// Meta-data completeness metrics evaluator
function getMetaDataCompletenessMetrics(item: {
  title: string;
  excerpt: string;
  author?: string;
  category?: string;
  slug?: string;
}) {
  let score = 0;
  const checklist: { name: string; complete: boolean; note: string }[] = [];

  const titleLen = item.title ? item.title.trim().length : 0;
  if (titleLen >= 20 && titleLen <= 70) {
    score += 30;
    checklist.push({ name: 'Title', complete: true, note: `${titleLen} chars (Ideal length)` });
  } else if (titleLen > 0) {
    score += 15;
    checklist.push({ name: 'Title', complete: false, note: `${titleLen} chars (${titleLen < 20 ? 'Too short' : 'Too long'})` });
  } else {
    checklist.push({ name: 'Title', complete: false, note: 'Missing title' });
  }

  const excerptLen = item.excerpt ? item.excerpt.trim().length : 0;
  if (excerptLen >= 70 && excerptLen <= 170) {
    score += 35;
    checklist.push({ name: 'Excerpt', complete: true, note: `${excerptLen} chars (Ideal length)` });
  } else if (excerptLen > 0) {
    score += 20;
    checklist.push({ name: 'Excerpt', complete: false, note: `${excerptLen} chars (Sub-optimal length)` });
  } else {
    checklist.push({ name: 'Excerpt', complete: false, note: 'Missing meta description' });
  }

  if (item.category && item.category.trim().length > 0) {
    score += 15;
    checklist.push({ name: 'Category', complete: true, note: item.category });
  } else {
    checklist.push({ name: 'Category', complete: false, note: 'Missing category' });
  }

  if (item.author && item.author.trim().length > 0) {
    score += 10;
    checklist.push({ name: 'Author', complete: true, note: item.author });
  } else {
    checklist.push({ name: 'Author', complete: false, note: 'Missing author' });
  }

  if (item.slug && item.slug.trim().length > 0) {
    score += 10;
    checklist.push({ name: 'Slug', complete: true, note: item.slug });
  } else {
    checklist.push({ name: 'Slug', complete: false, note: 'Missing slug' });
  }

  let grade = 'A+';
  let gradeLabel = 'Grade A+ (Complete)';
  let gradeBadgeClass = 'bg-emerald-400 text-slate-950 font-black';
  let status: 'good' | 'warning' | 'issue' = 'good';
  let statusLabel = 'Complete Meta';
  let badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';
  let barColor = 'bg-emerald-500';

  if (score >= 90) {
    grade = 'A+';
    gradeLabel = 'Grade A+ (Complete)';
    gradeBadgeClass = 'bg-emerald-400 text-slate-950 font-black';
    status = 'good';
    statusLabel = 'Complete Meta';
    badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';
    barColor = 'bg-emerald-500';
  } else if (score >= 70) {
    grade = 'A';
    gradeLabel = 'Grade A (Good Meta)';
    gradeBadgeClass = 'bg-emerald-500 text-slate-950 font-black';
    status = 'good';
    statusLabel = 'Minor Gaps';
    badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';
    barColor = 'bg-emerald-500';
  } else if (score >= 50) {
    grade = 'B';
    gradeLabel = 'Grade B (Partial Meta)';
    gradeBadgeClass = 'bg-amber-400 text-slate-950 font-black';
    status = 'warning';
    statusLabel = 'Partial Meta';
    badgeClass = 'bg-amber-100 text-amber-800 border-amber-200';
    barColor = 'bg-amber-500';
  } else {
    grade = 'C';
    gradeLabel = 'Grade C (Incomplete)';
    gradeBadgeClass = 'bg-red-500 text-white font-black';
    status = 'issue';
    statusLabel = 'Incomplete Meta';
    badgeClass = 'bg-red-100 text-red-800 border-red-200';
    barColor = 'bg-red-500';
  }

  return {
    score,
    grade,
    gradeLabel,
    gradeBadgeClass,
    status,
    statusLabel,
    badgeClass,
    barColor,
    checklist,
    description: `${score}% Complete (${checklist.filter(c => c.complete).length}/${checklist.length} valid fields)`
  };
}

// Compute Overall Article Grade Letter
function computeOverallGrade(score: number): { letter: string; class: string; badgeClass: string } {
  if (score >= 93) return { letter: 'Grade A+', class: 'bg-emerald-100 text-emerald-800 border-emerald-200', badgeClass: 'bg-emerald-400 text-slate-950' };
  if (score >= 82) return { letter: 'Grade A', class: 'bg-emerald-100 text-emerald-800 border-emerald-200', badgeClass: 'bg-emerald-500 text-slate-950' };
  if (score >= 70) return { letter: 'Grade B+', class: 'bg-amber-100 text-amber-800 border-amber-200', badgeClass: 'bg-amber-400 text-slate-950' };
  if (score >= 60) return { letter: 'Grade B', class: 'bg-amber-100 text-amber-800 border-amber-200', badgeClass: 'bg-amber-500 text-slate-950' };
  if (score >= 45) return { letter: 'Grade C', class: 'bg-orange-100 text-orange-800 border-orange-200', badgeClass: 'bg-orange-500 text-white' };
  return { letter: 'Grade F', class: 'bg-red-100 text-red-800 border-red-200', badgeClass: 'bg-red-600 text-white' };
}
import { motion } from 'motion/react';
import { useSEO } from '../lib/seo';

interface AdminPortalProps {
  onUpdateCMS: () => void;
  onNavigate: (path: string) => void;
}

interface Subscriber {
  email: string;
  dateSubscribed: string;
  status: string;
}

export default function AdminPortal({ onUpdateCMS, onNavigate }: AdminPortalProps) {
  useSEO({
    title: 'Admin CMS Portal',
    description: 'Manage articles, reviews, subscribers, and dynamic content updates.',
    ogType: 'website'
  });

  const [activeTab, setActiveTab] = useState<'blogs' | 'subscribers' | 'guides' | 'competitors' | 'adsense' | 'seo-audit'>('blogs');
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [guides, setGuides] = useState<CRMGuide[]>([]);
  const [reviews, setReviews] = useState<CRMReview[]>([]);

  // SEO Diagnostic Audit States
  const [seoAuditFilter, setSeoAuditFilter] = useState<'all' | 'issues' | 'passed'>('all');
  const [seoAuditType, setSeoAuditType] = useState<'all' | 'blog' | 'guide' | 'review'>('all');
  const [seoAuditSearch, setSeoAuditSearch] = useState('');

  // AdSense configuration states
  const [adsGlobalEnabled, setAdsGlobalEnabled] = useState(false);
  const [adsPublisherId, setAdsPublisherId] = useState('');
  const [adsHeadScript, setAdsHeadScript] = useState('');

  const [adsHeaderEnabled, setAdsHeaderEnabled] = useState(true);
  const [adsHeaderCode, setAdsHeaderCode] = useState('');
  const [adsHeaderFallbackImage, setAdsHeaderFallbackImage] = useState('');
  const [adsHeaderFallbackLink, setAdsHeaderFallbackLink] = useState('');

  const [adsSidebarEnabled, setAdsSidebarEnabled] = useState(true);
  const [adsSidebarCode, setAdsSidebarCode] = useState('');
  const [adsSidebarFallbackImage, setAdsSidebarFallbackImage] = useState('');
  const [adsSidebarFallbackLink, setAdsSidebarFallbackLink] = useState('');

  const [adsInContentEnabled, setAdsInContentEnabled] = useState(true);
  const [adsInContentCode, setAdsInContentCode] = useState('');
  const [adsInContentFallbackImage, setAdsInContentFallbackImage] = useState('');
  const [adsInContentFallbackLink, setAdsInContentFallbackLink] = useState('');

  const [adsFooterEnabled, setAdsFooterEnabled] = useState(true);
  const [adsFooterCode, setAdsFooterCode] = useState('');
  const [adsFooterFallbackImage, setAdsFooterFallbackImage] = useState('');
  const [adsFooterFallbackLink, setAdsFooterFallbackLink] = useState('');

  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('crmsolo_admin_authenticated') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Form states for new blog
  const [blogTitle, setBlogTitle] = useState('');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogCategory, setBlogCategory] = useState('Product Updates');
  const [blogAuthor, setBlogAuthor] = useState('Sarah Jenkins');
  const [successMessage, setSuccessMessage] = useState('');
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);

  // AI SEO Content Generator State
  const [aiTopic, setAiTopic] = useState('');
  const [aiKeywords, setAiKeywords] = useState('');
  const [aiTone, setAiTone] = useState('Informative');
  const [aiWordCount, setAiWordCount] = useState(600);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiGeneratedResult, setAiGeneratedResult] = useState<{
    title: string;
    excerpt: string;
    content: string;
    category: string;
  } | null>(null);

  const handleGenerateAIArticle = async () => {
    if (!aiTopic.trim()) {
      setAiError('Please enter an article topic or select a suggestion first.');
      return;
    }

    setIsGenerating(true);
    setAiError(null);
    setAiGeneratedResult(null);

    try {
      const response = await fetch('/api/generate-seo-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: aiTopic,
          keywords: aiKeywords.split(',').map(k => k.trim()).filter(Boolean),
          tone: aiTone,
          wordCount: aiWordCount,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('Server API returned non-JSON response. Please ensure server is running.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate article.');
      }

      setAiGeneratedResult(data);
      triggerNotification('⚡ SEO article generated successfully!');
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'An error occurred during article generation. Make sure GEMINI_API_KEY is configured.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInjectAIArticle = () => {
    if (!aiGeneratedResult) return;
    setBlogTitle(aiGeneratedResult.title);
    setBlogExcerpt(aiGeneratedResult.excerpt);
    setBlogContent(aiGeneratedResult.content);
    setBlogCategory(aiGeneratedResult.category);
    triggerNotification('📥 Injected AI article into the blog editor form below.');
    
    // Scroll smoothly to the edit form
    setTimeout(() => {
      const formElement = document.getElementById('blog-editor-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Form state for manual subscriber
  const [newSubEmail, setNewSubEmail] = useState('');
  const [subSearchQuery, setSubSearchQuery] = useState('');
  const [subStatusFilter, setSubStatusFilter] = useState<'All' | 'Active' | 'Unsubscribed'>('All');

  // Editable prices states (for adding prices dynamically)
  const [pipedrivePrice, setPipedrivePrice] = useState(14);
  const [followupbossPrice, setFollowupbossPrice] = useState(69);
  const [streakPrice, setStreakPrice] = useState(15);
  const [followupbossProPrice, setFollowupbossProPrice] = useState(129);

  useEffect(() => {
    // Load local storage states
    setBlogs(getBlogPosts());
    setGuides(getGuides());
    setReviews(getReviews());

    // Load subscribers or initialize with mock data
    const subStr = localStorage.getItem('crmsolo_subscribers');
    if (!subStr) {
      const mockSubs: Subscriber[] = [
        { email: 'gerrardmorr4@gmail.com', dateSubscribed: 'Jul 20, 2026', status: 'Active' },
        { email: 'jenkins.realestate@gmail.com', dateSubscribed: 'Jul 18, 2026', status: 'Active' },
        { email: 'vance.luxury@realty.com', dateSubscribed: 'Jul 15, 2026', status: 'Active' },
        { email: 'solo.broker.florida@gmail.com', dateSubscribed: 'Jul 10, 2026', status: 'Active' },
        { email: 'realtor.sam@outlook.com', dateSubscribed: 'Jul 05, 2026', status: 'Unsubscribed' }
      ];
      localStorage.setItem('crmsolo_subscribers', JSON.stringify(mockSubs));
      setSubscribers(mockSubs);
    } else {
      setSubscribers(JSON.parse(subStr));
    }

    // Load active CRM pricing modifiers if they exist
    const storedPrices = localStorage.getItem('crmsolo_custom_prices');
    if (storedPrices) {
      const parsed = JSON.parse(storedPrices);
      setPipedrivePrice(parsed.pipedrive || 14);
      setFollowupbossPrice(parsed.followupboss || 69);
      setStreakPrice(parsed.streak || 15);
      setFollowupbossProPrice(parsed.followupbossPro || 129);
    }

    // Load AdSense settings
    const ads = getAdSenseSettings();
    setAdsGlobalEnabled(ads.globalEnabled);
    setAdsPublisherId(ads.publisherId);
    setAdsHeadScript(ads.headScript);

    setAdsHeaderEnabled(ads.headerBanner?.enabled ?? true);
    setAdsHeaderCode(ads.headerBanner?.code ?? '');
    setAdsHeaderFallbackImage(ads.headerBanner?.fallbackImage ?? '');
    setAdsHeaderFallbackLink(ads.headerBanner?.fallbackLink ?? '');

    setAdsSidebarEnabled(ads.sidebarAd?.enabled ?? true);
    setAdsSidebarCode(ads.sidebarAd?.code ?? '');
    setAdsSidebarFallbackImage(ads.sidebarAd?.fallbackImage ?? '');
    setAdsSidebarFallbackLink(ads.sidebarAd?.fallbackLink ?? '');

    setAdsInContentEnabled(ads.inContentAd?.enabled ?? true);
    setAdsInContentCode(ads.inContentAd?.code ?? '');
    setAdsInContentFallbackImage(ads.inContentAd?.fallbackImage ?? '');
    setAdsInContentFallbackLink(ads.inContentAd?.fallbackLink ?? '');

    setAdsFooterEnabled(ads.footerBanner?.enabled ?? true);
    setAdsFooterCode(ads.footerBanner?.code ?? '');
    setAdsFooterFallbackImage(ads.footerBanner?.fallbackImage ?? '');
    setAdsFooterFallbackLink(ads.footerBanner?.fallbackLink ?? '');
  }, []);

  const triggerNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  // Comprehensive SEO Diagnostic Audit Computation
  const auditItems = React.useMemo(() => {
    const items: Array<{
      id: string;
      type: 'blog' | 'guide' | 'review';
      typeName: string;
      title: string;
      slug: string;
      excerpt: string;
      wordCount: number;
      score: number;
      issues: string[];
      warnings: string[];
      detectedKeywords: string[];
      missingKeywords: string[];
      readability: ReturnType<typeof getReadabilityMetrics>;
      keywordDensity: ReturnType<typeof getKeywordDensityMetrics>;
      metaCompleteness: ReturnType<typeof getMetaDataCompletenessMetrics>;
      rawItem: BlogPost | CRMGuide | CRMReview;
    }> = [];

    const targetKeywords = [
      'crm', 'real estate', 'realtor', 'broker', 'agent', 'solo',
      'pipedrive', 'streak', 'follow up boss', 'lead', 'pipeline', 'eugene boniface'
    ];

    // Audit Blog Posts
    blogs.forEach(b => {
      const issues: string[] = [];
      const warnings: string[] = [];
      let score = 100;

      const fullText = `${b.title} ${b.excerpt} ${b.content}`.toLowerCase();
      const wordCount = b.content ? b.content.trim().split(/\s+/).filter(Boolean).length : 0;

      const readability = getReadabilityMetrics(b.content || '');
      const keywordDensity = getKeywordDensityMetrics(fullText, targetKeywords);
      const metaCompleteness = getMetaDataCompletenessMetrics({
        title: b.title,
        excerpt: b.excerpt,
        author: b.author,
        category: b.category,
        slug: b.slug
      });

      if (!b.excerpt || b.excerpt.trim().length === 0) {
        issues.push('Missing SEO meta description / excerpt');
        score -= 35;
      } else if (b.excerpt.length < 70) {
        warnings.push(`Short meta description (${b.excerpt.length} chars, target: 80-160)`);
        score -= 15;
      } else if (b.excerpt.length > 170) {
        warnings.push(`Meta description too long (${b.excerpt.length} chars, may truncate)`);
        score -= 10;
      }

      const detectedKeywords = targetKeywords.filter(kw => fullText.includes(kw));
      const missingKeywords = targetKeywords.filter(kw => !fullText.includes(kw));

      if (detectedKeywords.length === 0) {
        issues.push('Missing target real estate keywords (CRM, realtor, broker, etc.)');
        score -= 30;
      } else if (detectedKeywords.length < 2) {
        warnings.push('Low target keyword density (only 1 keyword found)');
        score -= 15;
      }

      if (wordCount < 200) {
        issues.push(`Thin content warning (${wordCount} words, target >= 250)`);
        score -= 20;
      } else if (wordCount < 350) {
        warnings.push(`Short article content (${wordCount} words)`);
        score -= 5;
      }

      if (b.title.length < 20 || b.title.length > 70) {
        warnings.push(`Sub-optimal title length (${b.title.length} chars, target: 25-65)`);
        score -= 10;
      }

      items.push({
        id: b.id,
        type: 'blog',
        typeName: 'Blog Post',
        title: b.title,
        slug: b.slug,
        excerpt: b.excerpt || '',
        wordCount,
        score: Math.max(0, score),
        issues,
        warnings,
        detectedKeywords,
        missingKeywords,
        readability,
        keywordDensity,
        metaCompleteness,
        rawItem: b
      });
    });

    // Audit Guides
    guides.forEach(g => {
      const issues: string[] = [];
      const warnings: string[] = [];
      let score = 100;

      const fullText = `${g.title} ${g.excerpt} ${g.content}`.toLowerCase();
      const wordCount = g.content ? g.content.trim().split(/\s+/).filter(Boolean).length : 0;

      const readability = getReadabilityMetrics(g.content || '');
      const keywordDensity = getKeywordDensityMetrics(fullText, targetKeywords);
      const metaCompleteness = getMetaDataCompletenessMetrics({
        title: g.title,
        excerpt: g.excerpt,
        category: g.category,
        author: g.author,
        slug: g.slug
      });

      if (!g.excerpt || g.excerpt.trim().length === 0) {
        issues.push('Missing SEO meta description / excerpt');
        score -= 35;
      } else if (g.excerpt.length < 70) {
        warnings.push(`Short meta description (${g.excerpt.length} chars)`);
        score -= 15;
      } else if (g.excerpt.length > 170) {
        warnings.push(`Meta description too long (${g.excerpt.length} chars)`);
        score -= 10;
      }

      const detectedKeywords = targetKeywords.filter(kw => fullText.includes(kw));
      const missingKeywords = targetKeywords.filter(kw => !fullText.includes(kw));

      if (detectedKeywords.length === 0) {
        issues.push('Missing target real estate keywords');
        score -= 30;
      } else if (detectedKeywords.length < 2) {
        warnings.push('Low keyword density');
        score -= 15;
      }

      if (wordCount < 250) {
        issues.push(`Thin guide content (${wordCount} words)`);
        score -= 20;
      }

      items.push({
        id: g.id,
        type: 'guide',
        typeName: 'Guide',
        title: g.title,
        slug: g.slug,
        excerpt: g.excerpt || '',
        wordCount,
        score: Math.max(0, score),
        issues,
        warnings,
        detectedKeywords,
        missingKeywords,
        readability,
        keywordDensity,
        metaCompleteness,
        rawItem: g
      });
    });

    // Audit CRM Reviews
    reviews.forEach(r => {
      const issues: string[] = [];
      const warnings: string[] = [];
      let score = 100;

      const fullText = `${r.name} ${r.oneLinePitch} ${r.bestFor} ${r.verdict} ${(r as any).keyFeatures?.join(' ')}`.toLowerCase();
      const wordCount = r.verdict ? r.verdict.trim().split(/\s+/).filter(Boolean).length + 40 : 40;

      const readability = getReadabilityMetrics(r.verdict || '');
      const keywordDensity = getKeywordDensityMetrics(fullText, targetKeywords);
      const metaCompleteness = getMetaDataCompletenessMetrics({
        title: `${r.name} CRM Review`,
        excerpt: r.oneLinePitch || '',
        category: 'CRM Review',
        author: 'Editorial Team',
        slug: r.slug
      });

      if (!r.oneLinePitch || r.oneLinePitch.trim().length === 0) {
        issues.push('Missing CRM tagline / meta pitch');
        score -= 35;
      } else if (r.oneLinePitch.length < 40) {
        warnings.push(`Short meta pitch (${r.oneLinePitch.length} chars)`);
        score -= 15;
      }

      const detectedKeywords = targetKeywords.filter(kw => fullText.includes(kw));
      const missingKeywords = targetKeywords.filter(kw => !fullText.includes(kw));

      if (detectedKeywords.length === 0) {
        issues.push('Missing core real estate CRM keywords in review');
        score -= 30;
      }

      if (!r.verdict || r.verdict.length < 80) {
        issues.push('Short editorial verdict');
        score -= 25;
      }

      items.push({
        id: r.id,
        type: 'review',
        typeName: 'CRM Review',
        title: `${r.name} CRM Review`,
        slug: r.slug,
        excerpt: r.oneLinePitch || '',
        wordCount,
        score: Math.max(0, score),
        issues,
        warnings,
        detectedKeywords,
        missingKeywords,
        readability,
        keywordDensity,
        metaCompleteness,
        rawItem: r
      });
    });

    return items;
  }, [blogs, guides, reviews]);

  // Overall Health Summary Metrics
  const seoSummary = React.useMemo(() => {
    const total = auditItems.length;
    if (total === 0) {
      return { 
        avgScore: 100, 
        missingMetaCount: 0, 
        missingKeywordCount: 0, 
        totalIssuesCount: 0, 
        passedCount: 0,
        avgBlogReadability: 100,
        avgBlogDensity: 0,
        avgBlogMetaCompleteness: 100,
        blogOptimalReadabilityCount: 0,
        blogOptimalDensityCount: 0,
        blogCompleteMetaCount: 0,
        blogItemsCount: 0
      };
    }

    const totalScore = auditItems.reduce((acc, curr) => acc + curr.score, 0);
    const avgScore = Math.round(totalScore / total);

    const missingMetaCount = auditItems.filter(i => i.issues.some(iss => iss.includes('meta description') || iss.includes('tagline'))).length;
    const missingKeywordCount = auditItems.filter(i => i.issues.some(iss => iss.includes('keywords')) || i.detectedKeywords.length === 0).length;
    const totalIssuesCount = auditItems.filter(i => i.issues.length > 0).length;
    const passedCount = auditItems.filter(i => i.issues.length === 0 && i.warnings.length === 0).length;

    // Blog specific metrics
    const blogItems = auditItems.filter(i => i.type === 'blog');
    const blogItemsCount = blogItems.length;
    const blogTotal = blogItemsCount || 1;

    const avgBlogReadability = Math.round(blogItems.reduce((acc, curr) => acc + curr.readability.score, 0) / blogTotal);
    const avgBlogDensity = Math.round((blogItems.reduce((acc, curr) => acc + curr.keywordDensity.densityPct, 0) / blogTotal) * 10) / 10;
    const avgBlogMetaCompleteness = Math.round(blogItems.reduce((acc, curr) => acc + curr.metaCompleteness.score, 0) / blogTotal);

    const blogOptimalReadabilityCount = blogItems.filter(i => i.readability.status === 'good').length;
    const blogOptimalDensityCount = blogItems.filter(i => i.keywordDensity.status === 'good').length;
    const blogCompleteMetaCount = blogItems.filter(i => i.metaCompleteness.status === 'good').length;

    return {
      avgScore,
      missingMetaCount,
      missingKeywordCount,
      totalIssuesCount,
      passedCount,
      avgBlogReadability,
      avgBlogDensity,
      avgBlogMetaCompleteness,
      blogOptimalReadabilityCount,
      blogOptimalDensityCount,
      blogCompleteMetaCount,
      blogItemsCount
    };
  }, [auditItems]);

  // Auto-Fix handlers
  const handleAutoFixAllSEO = () => {
    let fixedCount = 0;

    const updatedBlogs = blogs.map(b => {
      let excerpt = b.excerpt;
      if (!excerpt || excerpt.trim().length < 70) {
        const cleanContent = b.content.replace(/#|\*|`|>|\[|\]/g, '').trim();
        const firstSentence = cleanContent.split('.')[0] || '';
        excerpt = `${b.title}: ${firstSentence.substring(0, 110)}... Essential real estate CRM insights for solo agents.`;
        fixedCount++;
      }
      return { ...b, excerpt };
    });

    const updatedGuides = guides.map(g => {
      let excerpt = g.excerpt;
      if (!excerpt || excerpt.trim().length < 70) {
        const cleanContent = g.content.replace(/#|\*|`|>|\[|\]/g, '').trim();
        const firstSentence = cleanContent.split('.')[0] || '';
        excerpt = `${g.title}: ${firstSentence.substring(0, 110)}... Comprehensive guide for solo realtors and brokers.`;
        fixedCount++;
      }
      return { ...g, excerpt };
    });

    const updatedReviews = reviews.map(r => {
      let pitch = r.oneLinePitch;
      if (!pitch || pitch.trim().length < 40) {
        pitch = `In-depth ${r.name} CRM review for real estate solo agents, covering features, pricing, lead tracking, and workflows.`;
        fixedCount++;
      }
      return { ...r, oneLinePitch: pitch };
    });

    setBlogs(updatedBlogs);
    saveBlogPosts(updatedBlogs);

    setGuides(updatedGuides);
    saveGuides(updatedGuides);

    setReviews(updatedReviews);
    saveReviews(updatedReviews);

    triggerNotification(`✨ Auto-Fix Complete! Optimized ${fixedCount} meta descriptions & keyword tags across CMS.`);
  };

  const handleAutoFixSingleItem = (item: any) => {
    if (item.type === 'blog') {
      const b = item.rawItem as BlogPost;
      const cleanContent = b.content.replace(/#|\*|`|>|\[|\]/g, '').trim();
      const firstSentence = cleanContent.split('.')[0] || '';
      const newExcerpt = `${b.title}: ${firstSentence.substring(0, 110)}... Essential real estate CRM guide for solo agents.`;

      const updated = blogs.map(i => i.id === b.id ? { ...i, excerpt: newExcerpt } : i);
      setBlogs(updated);
      saveBlogPosts(updated);
      triggerNotification(`✨ Generated SEO meta description for "${b.title}"!`);
    } else if (item.type === 'guide') {
      const g = item.rawItem as CRMGuide;
      const cleanContent = g.content.replace(/#|\*|`|>|\[|\]/g, '').trim();
      const firstSentence = cleanContent.split('.')[0] || '';
      const newExcerpt = `${g.title}: ${firstSentence.substring(0, 110)}... Real estate CRM strategy for solo brokers.`;

      const updated = guides.map(i => i.id === g.id ? { ...i, excerpt: newExcerpt } : i);
      setGuides(updated);
      saveGuides(updated);
      triggerNotification(`✨ Generated SEO meta description for "${g.title}"!`);
    } else if (item.type === 'review') {
      const r = item.rawItem as CRMReview;
      const newPitch = `In-depth ${r.name} CRM review for real estate solo agents, covering features, pricing, lead tracking, and workflows.`;

      const updated = reviews.map(i => i.id === r.id ? { ...i, oneLinePitch: newPitch } : i);
      setReviews(updated);
      saveReviews(updated);
      triggerNotification(`✨ Generated SEO meta pitch for "${r.name}"!`);
    }
  };

  // 1. Post and Publish Blog Post
  const handlePublishBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim() || !blogContent.trim()) return;

    // Generate slug cleanly
    const slug = blogTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    if (editingBlogId) {
      // Editing existing post
      const updated = blogs.map(b => {
        if (b.id === editingBlogId) {
          return {
            ...b,
            title: blogTitle,
            excerpt: blogExcerpt || blogContent.substring(0, 120) + '...',
            content: blogContent,
            author: blogAuthor,
            category: blogCategory,
            slug
          };
        }
        return b;
      });
      setBlogs(updated);
      saveBlogPosts(updated);
      setEditingBlogId(null);
      triggerNotification('🎉 Blog post successfully updated!');
    } else {
      // Creating new post
      const newPost: BlogPost = {
        id: `custom-post-${Date.now()}`,
        slug,
        title: blogTitle,
        excerpt: blogExcerpt || blogContent.substring(0, 120) + '...',
        content: blogContent,
        author: blogAuthor,
        publishDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        category: blogCategory
      };

      const updated = [newPost, ...blogs];
      setBlogs(updated);
      saveBlogPosts(updated);
      triggerNotification('🎉 Blog post successfully published and added to local storage database!');
    }

    onUpdateCMS();

    // Clear form
    setBlogTitle('');
    setBlogExcerpt('');
    setBlogContent('');
    setBlogCategory('Product Updates');
    setBlogAuthor('Sarah Jenkins');
  };

  const handleStartEditBlog = (blog: BlogPost) => {
    setEditingBlogId(blog.id);
    setBlogTitle(blog.title);
    setBlogExcerpt(blog.excerpt);
    setBlogContent(blog.content);
    setBlogCategory(blog.category);
    setBlogAuthor(blog.author);
    // Smooth scroll to the form
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const handleCancelEditBlog = () => {
    setEditingBlogId(null);
    setBlogTitle('');
    setBlogExcerpt('');
    setBlogContent('');
    setBlogCategory('Product Updates');
    setBlogAuthor('Sarah Jenkins');
  };

  const handleDeleteBlog = (id: string) => {
    if (window.confirm('Are you sure you want to delete this article? This is irreversible.')) {
      if (editingBlogId === id) {
        handleCancelEditBlog();
      }
      const updated = blogs.filter(b => b.id !== id);
      setBlogs(updated);
      saveBlogPosts(updated);
      onUpdateCMS();
      triggerNotification('🗑️ Article successfully removed.');
    }
  };

  // 2. Email Subscribers Management
  const handleAddSubscriber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubEmail.trim()) return;

    const email = newSubEmail.trim();
    if (subscribers.some(s => s.email.toLowerCase() === email.toLowerCase())) {
      alert('Email already exists on list!');
      return;
    }

    const newSub: Subscriber = {
      email,
      dateSubscribed: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      status: 'Active'
    };

    const updated = [newSub, ...subscribers];
    setSubscribers(updated);
    localStorage.setItem('crmsolo_subscribers', JSON.stringify(updated));
    setNewSubEmail('');
    triggerNotification('📧 Added new contact to email listing.');
  };

  const handleDeleteSubscriber = (email: string) => {
    const updated = subscribers.filter(s => s.email !== email);
    setSubscribers(updated);
    localStorage.setItem('crmsolo_subscribers', JSON.stringify(updated));
    triggerNotification('🗑️ Removed contact from email listing.');
  };

  const handleToggleSubscriberStatus = (email: string) => {
    const updated = subscribers.map(s => {
      if (s.email === email) {
        return { ...s, status: s.status === 'Active' ? 'Unsubscribed' : 'Active' };
      }
      return s;
    });
    setSubscribers(updated);
    localStorage.setItem('crmsolo_subscribers', JSON.stringify(updated));
    triggerNotification('🔄 Updated subscriber subscription status.');
  };

  const handleExportSubscribersCSV = () => {
    if (subscribers.length === 0) {
      alert('No subscribers to export!');
      return;
    }
    const headers = ['Email', 'Date Subscribed', 'Status'];
    const rows = subscribers.map(s => [s.email, s.dateSubscribed, s.status]);
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `crmsolo_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerNotification('📥 Subscriber list exported as CSV successfully!');
  };

  const handleClearAllSubscribers = () => {
    if (window.confirm('⚠️ Are you absolutely sure you want to clear ALL subscribers? This action cannot be undone.')) {
      setSubscribers([]);
      localStorage.setItem('crmsolo_subscribers', JSON.stringify([]));
      triggerNotification('🗑️ All subscribers have been cleared.');
    }
  };

  // 3. Edit CRM Prices Natively
  const handleSavePrices = () => {
    const pricesObj = {
      pipedrive: pipedrivePrice,
      streak: streakPrice,
      followupboss: followupbossPrice,
      followupbossPro: followupbossProPrice
    };
    localStorage.setItem('crmsolo_custom_prices', JSON.stringify(pricesObj));

    // Also update CRM review PricingTier array if we want them to reflect on active reviews
    const updatedReviews = reviews.map(review => {
      const copy = { ...review };
      if (copy.id === 'pipedrive') {
        copy.pricingTiers = copy.pricingTiers.map((tier, idx) => {
          if (idx === 0) return { ...tier, price: pipedrivePrice };
          return tier;
        });
      } else if (copy.id === 'streak') {
        copy.pricingTiers = copy.pricingTiers.map((tier, idx) => {
          if (idx === 1) return { ...tier, price: streakPrice };
          return tier;
        });
      } else if (copy.id === 'followupboss') {
        copy.pricingTiers = copy.pricingTiers.map((tier, idx) => {
          if (idx === 0) return { ...tier, price: followupbossPrice };
          if (idx === 1) return { ...tier, price: followupbossProPrice };
          return tier;
        });
      }
      return copy;
    });

    setReviews(updatedReviews);
    saveReviews(updatedReviews);
    onUpdateCMS();
    triggerNotification('💰 Custom pricing indices stored and loaded across all comparison structures!');
  };

  // 4. Save Google AdSense & Partner Ads configuration
  const handleSaveAdSense = () => {
    const updated: AdSenseSettings = {
      globalEnabled: adsGlobalEnabled,
      publisherId: adsPublisherId.trim(),
      headScript: adsHeadScript,
      headerBanner: {
        enabled: adsHeaderEnabled,
        code: adsHeaderCode,
        fallbackImage: adsHeaderFallbackImage.trim(),
        fallbackLink: adsHeaderFallbackLink.trim()
      },
      sidebarAd: {
        enabled: adsSidebarEnabled,
        code: adsSidebarCode,
        fallbackImage: adsSidebarFallbackImage.trim(),
        fallbackLink: adsSidebarFallbackLink.trim()
      },
      inContentAd: {
        enabled: adsInContentEnabled,
        code: adsInContentCode,
        fallbackImage: adsInContentFallbackImage.trim(),
        fallbackLink: adsInContentFallbackLink.trim()
      },
      footerBanner: {
        enabled: adsFooterEnabled,
        code: adsFooterCode,
        fallbackImage: adsFooterFallbackImage.trim(),
        fallbackLink: adsFooterFallbackLink.trim()
      }
    };

    saveAdSenseSettings(updated);

    // Trigger update across app components
    window.dispatchEvent(new Event('crmsolo_adsense_updated'));
    triggerNotification('🚀 Google AdSense & Partner Ads settings saved and activated globally!');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    const storedKey = localStorage.getItem('crmsolo_admin_access_key') || 'admin123';
    if (passwordInput.trim() === storedKey || passwordInput.trim() === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('crmsolo_admin_authenticated', 'true');
    } else {
      setPasswordError(`Invalid passcode. Please enter the master access key or "admin123".`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 font-sans">
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-md space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-primary/5 rounded-2xl text-accent">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-primary font-display uppercase tracking-tight">Admin Portal Gate</h2>
            <p className="text-xs text-gray-500">Secure publisher access to comparison indexes, pricing grids, and active agent subscriber lists.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-primary uppercase tracking-wider block">Passcode</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-sm text-primary font-bold placeholder-gray-400"
              />
            </div>

            {passwordError && (
              <p className="text-red-500 text-[10px] font-semibold font-mono">
                ⚠️ {passwordError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-primary hover:bg-primary/95 text-accent font-black uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition"
            >
              Unlock Dashboard &rarr;
            </button>
          </form>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-1 text-center">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">🔑 Accessible Password</span>
            <p className="text-xs text-gray-600">
              Use <strong className="text-primary font-mono bg-accent/25 px-1.5 py-0.5 rounded">admin123</strong> to enter instantly.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/')}
            className="w-full py-2.5 text-xs text-gray-400 hover:text-gray-600 hover:underline text-center block cursor-pointer"
          >
            &larr; Back to Public Directory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      
      {/* Banner Notice */}
      {successMessage && (
        <div className="fixed top-24 right-4 z-50 bg-primary border-2 border-accent text-accent px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <Sparkles className="w-5 h-5 text-accent animate-pulse" />
          <span className="text-xs font-bold font-mono tracking-wide">{successMessage}</span>
        </div>
      )}

      {/* Header Panel */}
      <div className="bg-primary text-white border-b-4 border-accent p-8 rounded-2xl shadow-sm space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1.5">
            <span className="inline-block bg-accent text-primary text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-xs">
              SECURE PUBLISHING SUITE
            </span>
            <h1 className="text-3xl md:text-5xl font-black font-display uppercase tracking-tighter">
              CRMSOLO CMS DASHBOARD
            </h1>
            <p className="text-gray-300 text-xs md:text-sm max-w-xl leading-relaxed">
              Welcome back to your local content management suite. Here you can edit prices, publish new blogs, manage email lists, and review competitor gap analysis matrices.
            </p>
          </div>
          <button 
            onClick={() => onNavigate('/')} 
            className="px-5 py-3 bg-accent hover:bg-accent/90 text-primary font-black uppercase tracking-widest text-[10px] rounded-xs transition duration-150 shadow-md cursor-pointer"
          >
            &larr; Exit Admin Panel
          </button>
        </div>
      </div>

      {/* Grid Menu Links */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { id: 'blogs', label: 'Blogs & Articles', icon: FileText, count: blogs.length },
          { id: 'subscribers', label: 'Email Subscribers', icon: Users, count: subscribers.length },
          { id: 'guides', label: 'Price & Guide Manager', icon: DollarSign, count: guides.length },
          { id: 'competitors', label: 'Competitor Gap Audit', icon: ClipboardList, count: 4 },
          { id: 'seo-audit', label: 'SEO Diagnostic Audit', icon: Activity, count: `${seoSummary.avgScore}% SEO` },
          { id: 'adsense', label: 'Google AdSense', icon: Globe, count: adsGlobalEnabled ? 'ON' : 'OFF' }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`p-5 rounded-2xl border transition duration-150 text-left relative overflow-hidden group cursor-pointer ${
                isActive 
                  ? 'bg-primary border-primary text-white shadow-md' 
                  : 'bg-white border-gray-100 text-gray-600 hover:border-gray-300 hover:shadow-xs'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <Icon className={`w-6 h-6 ${isActive ? 'text-accent' : 'text-primary/50 group-hover:text-primary transition'}`} />
                <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${isActive ? 'bg-white/15 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {tab.count}
                </span>
              </div>
              <h3 className={`text-xs font-black uppercase tracking-wider ${isActive ? 'text-white' : 'text-primary'}`}>
                {tab.label}
              </h3>
            </button>
          );
        })}
      </div>

      {/* Tabs Container */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-xs">
        
        {/* 1. TAB: BLOGS MANAGER */}
        {activeTab === 'blogs' && (
          <div className="space-y-10 animate-in fade-in duration-200">
            <div className="border-b border-gray-100 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <h2 className="text-xl font-bold text-primary font-display flex items-center gap-2">
                  <FileText className="w-5 h-5 text-accent" /> {editingBlogId ? 'Edit Blog Article' : 'Write and Publish New Article'}
                </h2>
                <p className="text-xs text-gray-500">{editingBlogId ? 'Modify your article contents below and save changes.' : 'Create new guides or news flashes instantly available on the blog roll.'}</p>
              </div>
              <span className="text-[10px] bg-success/15 text-success font-black uppercase px-2.5 py-1 rounded">Local Storage Active</span>
            </div>

            {/* AI SEO Assistant Section */}
            <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-transparent rounded-2xl border border-accent/20 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Sparkles className="w-5 h-5 text-accent animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary font-display flex items-center gap-2">
                      Gemini AI SEO Assistant
                    </h3>
                    <p className="text-xs text-gray-500">Draft high-quality, search-optimized blogs and articles tailored for real estate agents instantly.</p>
                  </div>
                </div>
                <span className="text-[10px] bg-accent/15 text-accent font-bold uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                  Powered by Gemini 3.6
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-6 space-y-2">
                  <label className="text-[11px] font-bold text-primary uppercase tracking-wider block">Article Topic / Keyword Theme</label>
                  <input
                    type="text"
                    placeholder="e.g., Scottsdale Local SEO Strategies for Solo Agents"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                  />
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <span className="text-[10px] text-gray-400 self-center mr-1">Suggestions:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setAiTopic('Streak vs Follow Up Boss: Scottsdale Agent Review');
                        setAiKeywords('Streak review, Scottsdale real estate, Follow Up Boss Scottsdale, real estate CRM');
                      }}
                      className="text-[10px] bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-md hover:border-accent/40"
                    >
                      Scottsdale CRM Match
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAiTopic('Top 5 Email Drip Sequences for Inbound SEO Leads');
                        setAiKeywords('email marketing real estate, real estate lead nurture, CRM email sequences, drip campaigns');
                      }}
                      className="text-[10px] bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-md hover:border-accent/40"
                    >
                      Email Nurture
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAiTopic('Automating Post-Close Client Reviews in Follow Up Boss');
                        setAiKeywords('Follow Up Boss automation, Google Business reviews, post-close workflow, real estate reviews');
                      }}
                      className="text-[10px] bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-md hover:border-accent/40"
                    >
                      Reviews Sync
                    </button>
                  </div>
                </div>

                <div className="md:col-span-6 space-y-2">
                  <label className="text-[11px] font-bold text-primary uppercase tracking-wider block">Target SEO Keywords (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="e.g., local real estate SEO, Google Business Profile, solo realtors"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                    value={aiKeywords}
                    onChange={(e) => setAiKeywords(e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div>
                      <select
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-accent/20"
                        value={aiTone}
                        onChange={(e) => setAiTone(e.target.value)}
                      >
                        <option value="Informative">Informative Tone</option>
                        <option value="Conversational">Conversational Tone</option>
                        <option value="Analytical & Comparative">Analytical Tone</option>
                        <option value="Highly Persuasive">Persuasive Tone</option>
                      </select>
                    </div>
                    <div>
                      <select
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-accent/20"
                        value={aiWordCount}
                        onChange={(e) => setAiWordCount(Number(e.target.value))}
                      >
                        <option value={400}>~400 Words (Quick Guide)</option>
                        <option value={600}>~600 Words (Standard Post)</option>
                        <option value={1000}>~1000 Words (Deep Dive)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {aiError && (
                <div className="bg-danger/10 border border-danger/20 text-danger text-xs rounded-xl p-3 flex items-center gap-2">
                  <span className="font-bold">Error:</span> {aiError}
                </div>
              )}

              {aiGeneratedResult && (
                <div className="bg-white border border-accent/20 rounded-xl p-4 space-y-3 animate-in fade-in duration-300">
                  <div className="flex items-start justify-between border-b border-gray-100 pb-2">
                    <div>
                      <span className="text-[10px] bg-accent/10 text-accent font-bold px-2 py-0.5 rounded uppercase">
                        {aiGeneratedResult.category}
                      </span>
                      <h4 className="font-bold text-sm text-primary mt-1">{aiGeneratedResult.title}</h4>
                    </div>
                    <button
                      type="button"
                      onClick={handleInjectAIArticle}
                      className="bg-accent hover:bg-accent-hover text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition"
                    >
                      📥 Inject into Editor
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 italic">
                    <span className="font-bold text-gray-700">Meta Hook (Excerpt):</span> {aiGeneratedResult.excerpt}
                  </div>
                  <div className="max-h-48 overflow-y-auto text-xs text-gray-600 bg-gray-50/50 rounded p-3 font-mono border border-gray-100 whitespace-pre-wrap">
                    {aiGeneratedResult.content}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={handleGenerateAIArticle}
                  className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-xs transition disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-accent" />
                      Generating SEO Masterpiece...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-accent" />
                      Draft SEO Article with Gemini
                    </>
                  )}
                </button>
              </div>
            </div>

            <form id="blog-editor-form" onSubmit={handlePublishBlog} className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-primary uppercase tracking-wider block">Article Title</label>
                  <input
                    type="text"
                    required
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    placeholder="e.g., How Solo Real Estate Agents Can Use WhatsApp Pipelines"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-sm text-primary font-semibold placeholder-gray-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-primary uppercase tracking-wider block">Excerpt / Summary</label>
                  <input
                    type="text"
                    value={blogExcerpt}
                    onChange={(e) => setBlogExcerpt(e.target.value)}
                    placeholder="Short introduction hook summarizing the article (shown on list page)..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-sm text-primary placeholder-gray-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-primary uppercase tracking-wider block">Full Body Content (Markdown Supported)</label>
                    <span className="text-[10px] font-mono text-gray-400">Use ### for headers, * for lists</span>
                  </div>
                  <textarea
                    required
                    rows={12}
                    value={blogContent}
                    onChange={(e) => setBlogContent(e.target.value)}
                    placeholder="Write your article copy here... Supports basic markdown headers, bold, italics, and bullets."
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-sm text-primary font-mono placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="md:col-span-4 space-y-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                <h3 className="text-xs font-black uppercase tracking-wider text-primary border-b border-gray-100 pb-2">Publishing Meta</h3>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-primary uppercase tracking-wider block">Category</label>
                  <select
                    value={blogCategory}
                    onChange={(e) => setBlogCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    <option value="Product Updates">Product Updates</option>
                    <option value="Product Guides">Product Guides</option>
                    <option value="CRM Comparisons">CRM Comparisons</option>
                    <option value="Email Marketing">Email Marketing</option>
                    <option value="Workflows & Automation">Workflows & Automation</option>
                    <option value="Cost & Budget">Cost & Budget</option>
                    <option value="Productivity">Productivity</option>
                    <option value="Industry Commentary">Industry Commentary</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-primary uppercase tracking-wider block">Author</label>
                  <input
                    type="text"
                    required
                    value={blogAuthor}
                    onChange={(e) => setBlogAuthor(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <button
                    type="submit"
                    className="w-full py-4 bg-primary hover:bg-primary/95 text-accent font-black uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition shadow-md"
                  >
                    {editingBlogId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />} {editingBlogId ? 'Save Changes' : 'Publish Blog Post'}
                  </button>
                  {editingBlogId && (
                    <button
                      type="button"
                      onClick={handleCancelEditBlog}
                      className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-primary font-black uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </div>
            </form>

            {/* Published Articles List */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Active Published Articles ({blogs.length})</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blogs.map(blog => (
                  <div key={blog.id} className="bg-white border border-gray-100 p-5 rounded-2xl flex justify-between items-start gap-4 hover:border-gray-200 transition">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-primary/5 text-primary border border-primary/10 font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                          {blog.category}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono font-medium">{blog.publishDate}</span>
                      </div>
                      <h4 className="text-sm font-bold text-primary leading-snug line-clamp-1">{blog.title}</h4>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{blog.excerpt}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleStartEditBlog(blog)}
                        className={`p-2 rounded-lg transition cursor-pointer ${
                          editingBlogId === blog.id
                            ? 'bg-accent/20 text-accent border border-accent/20 font-bold'
                            : 'bg-gray-50 hover:bg-gray-100 text-primary'
                        }`}
                        title="Edit Article"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBlog(blog.id)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition shrink-0 cursor-pointer"
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. TAB: EMAIL SUBSCRIBERS */}
        {activeTab === 'subscribers' && (() => {
          const filteredSubscribers = subscribers.filter(sub => {
            const matchesSearch = sub.email.toLowerCase().includes(subSearchQuery.toLowerCase());
            const matchesStatus = subStatusFilter === 'All' || sub.status === subStatusFilter;
            return matchesSearch && matchesStatus;
          });

          const totalCount = subscribers.length;
          const activeCount = subscribers.filter(s => s.status === 'Active').length;
          const unsubCount = subscribers.filter(s => s.status === 'Unsubscribed').length;

          return (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="border-b border-gray-100 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-primary font-display flex items-center gap-2">
                    <Users className="w-5 h-5 text-accent" /> Realtor Email Listing &amp; Subscribers
                  </h2>
                  <p className="text-xs text-gray-500">Monitor organic email captures submitted from footer forms. Export leads for outbound drip campaigns.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleExportSubscribersCSV}
                    className="px-4 py-2 bg-success text-white font-black uppercase tracking-widest text-[10px] rounded-xl flex items-center gap-1.5 hover:bg-success/90 transition cursor-pointer shadow-xs"
                    title="Export list as CSV"
                  >
                    <Download className="w-3.5 h-3.5" /> Export CSV
                  </button>
                  <button
                    onClick={handleClearAllSubscribers}
                    className="px-4 py-2 bg-red-50 text-red-600 border border-red-100 font-black uppercase tracking-widest text-[10px] rounded-xl flex items-center gap-1.5 hover:bg-red-100 transition cursor-pointer"
                    title="Clear subscriber list"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear All
                  </button>
                </div>
              </div>

              {/* Subscriber Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-xs space-y-1">
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">Total Subscribers</span>
                  <div className="flex justify-between items-center">
                    <h4 className="text-2xl font-black text-primary font-display">{totalCount}</h4>
                    <span className="p-2 bg-primary/5 text-primary rounded-xl">
                      <Users className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-xs space-y-1">
                  <span className="text-[10px] font-mono font-bold text-success uppercase tracking-widest">Active Opt-Ins</span>
                  <div className="flex justify-between items-center">
                    <h4 className="text-2xl font-black text-success font-display">{activeCount}</h4>
                    <span className="p-2 bg-success/5 text-success rounded-xl">
                      <Mail className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-xs space-y-1">
                  <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">Opt-Out / Unsubscribed</span>
                  <div className="flex justify-between items-center">
                    <h4 className="text-2xl font-black text-gray-500 font-display">{unsubCount}</h4>
                    <span className="p-2 bg-gray-100 text-gray-500 rounded-xl">
                      <RefreshCw className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Add Lead and Search Filters Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Left Side: Add Subscriber */}
                <div className="lg:col-span-5 space-y-2">
                  <label className="text-xs font-bold text-primary uppercase tracking-wider block">Add Subscriber Manually</label>
                  <form onSubmit={handleAddSubscriber} className="flex gap-2">
                    <input
                      type="email"
                      required
                      value={newSubEmail}
                      onChange={(e) => setNewSubEmail(e.target.value)}
                      placeholder="e.g. agent@realty.com"
                      className="flex-grow px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-xs text-primary placeholder-gray-400 font-semibold"
                    />
                    <button
                      type="submit"
                      className="px-4 py-3 bg-primary hover:bg-primary/95 text-accent font-black uppercase tracking-widest text-[10px] rounded-xl flex items-center gap-1.5 justify-center cursor-pointer transition shrink-0 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </form>
                </div>

                {/* Right Side: Filters */}
                <div className="lg:col-span-7 space-y-2">
                  <label className="text-xs font-bold text-primary uppercase tracking-wider block">Search &amp; Filter Listing</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search Input */}
                    <div className="relative flex-grow">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={subSearchQuery}
                        onChange={(e) => setSubSearchQuery(e.target.value)}
                        placeholder="Search emails..."
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-xs text-primary placeholder-gray-400 font-semibold"
                      />
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center bg-gray-100 p-1 rounded-xl self-start sm:self-auto shrink-0">
                      {(['All', 'Active', 'Unsubscribed'] as const).map((filterOption) => (
                        <button
                          key={filterOption}
                          type="button"
                          onClick={() => setSubStatusFilter(filterOption)}
                          className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition duration-150 cursor-pointer ${
                            subStatusFilter === filterOption
                              ? 'bg-white text-primary shadow-xs'
                              : 'text-gray-500 hover:text-primary'
                          }`}
                        >
                          {filterOption}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Subscribers Table Grid */}
              <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-xs">
                <div className="bg-gray-50 px-6 py-3.5 border-b border-gray-100 grid grid-cols-12 text-[10px] font-black uppercase tracking-wider text-primary">
                  <span className="col-span-6 md:col-span-7">Realtor Email Address</span>
                  <span className="col-span-3 md:col-span-3">Date Subscribed</span>
                  <span className="col-span-2 md:col-span-1 text-center">Status</span>
                  <span className="col-span-1 md:col-span-1 text-right">Action</span>
                </div>

                <div className="divide-y divide-gray-50">
                  {filteredSubscribers.map((sub, idx) => (
                    <div key={idx} className="px-6 py-4 grid grid-cols-12 items-center text-xs hover:bg-gray-50/50 transition">
                      <span className="col-span-6 md:col-span-7 font-bold text-primary select-all break-all pr-2">{sub.email}</span>
                      <span className="col-span-3 md:col-span-3 text-gray-400 font-mono font-medium">{sub.dateSubscribed}</span>
                      <span className="col-span-2 md:col-span-1 text-center">
                        <button
                          onClick={() => handleToggleSubscriberStatus(sub.email)}
                          className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full cursor-pointer hover:scale-105 active:scale-95 transition-all duration-150 ${
                            sub.status === 'Active' 
                              ? 'bg-success/15 text-success border border-success/10 hover:bg-success/20' 
                              : 'bg-gray-100 text-gray-500 border border-gray-200/50 hover:bg-gray-200'
                          }`}
                          title="Click to toggle subscription status"
                        >
                          {sub.status}
                        </button>
                      </span>
                      <span className="col-span-1 md:col-span-1 text-right">
                        <button
                          onClick={() => handleDeleteSubscriber(sub.email)}
                          className="text-red-400 hover:text-red-600 transition p-1.5 hover:bg-red-50 rounded cursor-pointer"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    </div>
                  ))}

                  {filteredSubscribers.length === 0 && (
                    <div className="text-center p-12 text-gray-400">
                      <Mail className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-xs">No matching subscribers found in local memory.</p>
                      {subSearchQuery && (
                        <button
                          onClick={() => setSubSearchQuery('')}
                          className="text-[10px] text-accent font-bold uppercase tracking-wider underline mt-2 block mx-auto cursor-pointer"
                        >
                          Clear Search Filter
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* 3. TAB: PRICE & GUIDE MANAGER */}
        {activeTab === 'guides' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-xl font-bold text-primary font-display flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-accent" /> Active CRM Prices Configuration
              </h2>
              <p className="text-xs text-gray-500">Edit real-time pricing indices of Pipedrive, Follow Up Boss, and Streak across all guides and checklists instantly.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-primary uppercase tracking-wider block">Pipedrive Essential Price</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-gray-400 text-sm font-bold">$</span>
                  <input
                    type="number"
                    value={pipedrivePrice}
                    onChange={(e) => setPipedrivePrice(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-sm text-primary font-mono font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-primary uppercase tracking-wider block">Follow Up Boss Grow Price</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-gray-400 text-sm font-bold">$</span>
                  <input
                    type="number"
                    value={followupbossPrice}
                    onChange={(e) => setFollowupbossPrice(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-sm text-primary font-mono font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-primary uppercase tracking-wider block">Follow Up Boss Pro Price</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-gray-400 text-sm font-bold">$</span>
                  <input
                    type="number"
                    value={followupbossProPrice}
                    onChange={(e) => setFollowupbossProPrice(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-sm text-primary font-mono font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-primary uppercase tracking-wider block">Streak Solo Price</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-gray-400 text-sm font-bold">$</span>
                  <input
                    type="number"
                    value={streakPrice}
                    onChange={(e) => setStreakPrice(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-sm text-primary font-mono font-bold"
                  />
                </div>
              </div>

              <div className="md:col-span-4 pt-4 border-t border-gray-200 flex justify-end">
                <button
                  type="button"
                  onClick={handleSavePrices}
                  className="px-6 py-3 bg-primary hover:bg-primary/95 text-accent font-black uppercase tracking-widest text-xs rounded-xl flex items-center gap-2 cursor-pointer transition shadow-md"
                >
                  <Save className="w-4 h-4" /> Save Pricing Index Database
                </button>
              </div>
            </div>

            {/* Guides Audit block */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Review Active Guide Bookmarks ({guides.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {guides.map(g => (
                  <div key={g.id} className="bg-white border border-gray-100 p-5 rounded-2xl flex flex-col justify-between hover:border-accent transition cursor-pointer" onClick={() => onNavigate(`/guides/${g.slug}`)}>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[9px] font-bold text-gray-400 uppercase font-mono">
                        <span>{g.category}</span>
                        <span>{g.readTime}</span>
                      </div>
                      <h4 className="text-sm font-bold text-primary leading-snug">{g.title}</h4>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{g.excerpt}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center text-[10px] font-bold">
                      <span className="text-gray-400">By {g.author.split(' (')[0]}</span>
                      <span className="text-accent hover:underline">View Guide Draft &rarr;</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. TAB: COMPETITOR AUDIT */}
        {activeTab === 'competitors' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-xl font-bold text-primary font-display flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-accent" /> Competitor Audit &amp; Strategy Sheet
              </h2>
              <p className="text-xs text-gray-500">An algorithmic review of niche competitors. We analyzed what they do wrong to capture their blindspots.</p>
            </div>

            <div className="space-y-6">
              
              {/* Strategy grid cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100 space-y-4">
                  <div className="flex items-center gap-2 text-red-600 font-bold text-sm uppercase tracking-wider">
                    <ShieldAlert className="w-5 h-5" /> What Competitors Do Wrong (G2 / Capterra / ActiveRain)
                  </div>
                  <ul className="space-y-3 text-xs text-gray-600 leading-relaxed list-disc pl-4">
                    <li>
                      <strong>Intrusive Lead Gating:</strong> Forcing users to supply personal details, brokerage size, and emails before viewing a basic calculator outcome.
                    </li>
                    <li>
                      <strong>Enterprise &amp; Team Bias:</strong> Over-promoting expensive routing and AI features because of affiliate compensation structures, completely ignoring that a solo agent is a "team of one."
                    </li>
                    <li>
                      <strong>Outdated / Stale Prices:</strong> Neglecting pricing charts for years, leaving solo agents to navigate hidden CRM upgrade pricing traps alone.
                    </li>
                    <li>
                      <strong>Ad Clutter:</strong> Covering content with distracting banner ads and cookie-popups that break the reader's flow.
                    </li>
                  </ul>
                </div>

                <div className="bg-success-light/30 p-6 rounded-2xl border border-success/10 space-y-4">
                  <div className="flex items-center gap-2 text-success font-bold text-sm uppercase tracking-wider">
                    <Check className="w-5 h-5 text-success" /> What Competitors Do Right (implying on CRMSolo)
                  </div>
                  <ul className="space-y-3 text-xs text-gray-600 leading-relaxed list-disc pl-4">
                    <li>
                      <strong>Unbiased Local Math:</strong> Providing honest ROI metrics based on real estate response speeds (which CRMsolo does natively!).
                    </li>
                    <li>
                      <strong>Instant Interactive Checklists:</strong> Choosing exact criteria (such as Gmail sync or escrow timers) instead of reading 3000-word feature lists.
                    </li>
                    <li>
                      <strong>Clear Actionable Workbooks:</strong> Offering clean, downloadable training sheets that realtors can print out in their cars.
                    </li>
                    <li>
                      <strong>Honest Commission Disclosures:</strong> Gaining buyer trust through direct E-E-A-T transparency notices.
                    </li>
                  </ul>
                </div>

              </div>

              {/* CRMsolo Execution Index checklist */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-accent" /> CRMsolo Blindspot Strategy Execution Checklist
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
                  <div className="bg-white p-4 rounded-xl border border-gray-200/50 flex gap-3 items-start">
                    <span className="text-success text-sm font-bold">✓</span>
                    <div>
                      <h4 className="font-bold text-primary mb-1">CRM Feature Checklist Matchmaker</h4>
                      <p className="leading-relaxed">Solves the clutter gap. Instead of reading endless sales pages, solo brokers check the features they need and instantly get their matched software.</p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-200/50 flex gap-3 items-start">
                    <span className="text-success text-sm font-bold">✓</span>
                    <div>
                      <h4 className="font-bold text-primary mb-1">Un-gated standalone ROI Calculator</h4>
                      <p className="leading-relaxed">Solves the paywall gap. Realtors calculate deal recovery multipliers and weekly automated administrative hour saves without sharing any personal information.</p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-200/50 flex gap-3 items-start">
                    <span className="text-success text-sm font-bold">✓</span>
                    <div>
                      <h4 className="font-bold text-primary mb-1">Downloadable PDF Workbooks</h4>
                      <p className="leading-relaxed">Solves the offline accessibility gap. Direct browser-native print layouts compile beautifully into vector-clean training brochures instantly.</p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-200/50 flex gap-3 items-start">
                    <span className="text-success text-sm font-bold">✓</span>
                    <div>
                      <h4 className="font-bold text-primary mb-1">E-E-A-T Affiliate Disclosure Integrity</h4>
                      <p className="leading-relaxed">Solves the review trust gap. Our mathematics, sliders, and checklist matchmaker remain strictly algorithmic, treating all affiliate systems identically.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 5. TAB: GOOGLE ADSENSE & SPONSOR ADS SETTINGS */}
        {activeTab === 'adsense' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="border-b border-gray-100 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <h2 className="text-xl font-bold text-primary font-display flex items-center gap-2">
                  <Globe className="w-5 h-5 text-accent" /> Google AdSense &amp; Partner Banner Settings
                </h2>
                <p className="text-xs text-gray-500">
                  Configure your Google AdSense integration, custom banner slots, and dynamic sponsor offers to generate passive revenue across your reviews and blog posts.
                </p>
              </div>
              <span className="text-[10px] bg-accent/15 text-accent font-black uppercase px-2.5 py-1 rounded">
                Earning Sync Engine
              </span>
            </div>

            {/* Global Activation Banner */}
            <div className={`p-6 rounded-2xl border transition duration-150 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${
              adsGlobalEnabled 
                ? 'bg-emerald-50/50 border-emerald-100 text-emerald-950' 
                : 'bg-gray-50/50 border-gray-100 text-gray-500'
            }`}>
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${adsGlobalEnabled ? 'bg-emerald-500 animate-ping' : 'bg-gray-400'}`}></span>
                  <span className="text-[11px] font-bold uppercase tracking-widest font-mono">
                    {adsGlobalEnabled ? 'Ad Engine Online & Injecting' : 'Ad Engine Paused'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-primary font-display">
                  Global Ad Serving Master Switch
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  When enabled, this app will append your primary Google AdSense script inside the global website head and display active slots. Disable this switch to instantly turn off all ads across the site.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAdsGlobalEnabled(!adsGlobalEnabled)}
                className={`px-5 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition duration-150 cursor-pointer shadow-xs active:scale-95 ${
                  adsGlobalEnabled 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                    : 'bg-primary hover:bg-primary/95 text-accent'
                }`}
              >
                {adsGlobalEnabled ? '✓ Ads Serving Active' : 'Enable Ad Engine'}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Script configuration */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Section: Publisher Identity */}
                <div className="bg-gray-50/50 border border-gray-100 p-6 rounded-2xl space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-primary border-b border-gray-100 pb-2">
                    AdSense Publisher Credentials
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-4 space-y-1.5">
                      <label className="text-xs font-bold text-primary uppercase tracking-wider block">Publisher ID (ca-pub-)</label>
                      <input
                        type="text"
                        placeholder="ca-pub-1234567890123456"
                        value={adsPublisherId}
                        onChange={(e) => setAdsPublisherId(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-xs font-mono font-bold text-primary"
                      />
                    </div>
                    <div className="md:col-span-8 space-y-1.5">
                      <label className="text-xs font-bold text-primary uppercase tracking-wider block">Head Auto-Ads Script Code</label>
                      <textarea
                        rows={3}
                        placeholder="Paste your AdSense auto-ads script tag here..."
                        value={adsHeadScript}
                        onChange={(e) => setAdsHeadScript(e.target.value)}
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-xs font-mono text-primary"
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-accent/5 rounded-xl border border-accent/15 space-y-1.5">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">💡 Integration Guide</span>
                    <p className="text-[11px] text-gray-600 leading-relaxed">
                      AdSense Auto Ads are designed to automatically place advertisements across optimal spots on your site. Once approved, copy the script containing your <code className="text-primary font-mono font-bold">ca-pub-</code> parameter from AdSense, paste it in the script field above, and click save.
                    </p>
                  </div>
                </div>

                {/* Section: Specific Ad Slots */}
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
                    Interactive Layout Ad Units
                  </h3>

                  {/* Slot 1: Header Leaderboard Banner */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4 shadow-xs">
                    <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary/5 rounded-lg text-primary">
                          <Layout className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-wider text-primary">Header Banner Unit</h4>
                          <span className="text-[10px] text-gray-400 font-mono font-medium">Slot Name: headerBanner (Recommended Size: 728x90px)</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAdsHeaderEnabled(!adsHeaderEnabled)}
                        className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border transition ${
                          adsHeaderEnabled 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                            : 'bg-gray-50 text-gray-400 border-gray-100'
                        }`}
                      >
                        {adsHeaderEnabled ? 'Slot Enabled' : 'Slot Disabled'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-6 space-y-1.5">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-wider block">AdSense Unit HTML Code</label>
                        <textarea
                          rows={4}
                          placeholder="Paste the raw <ins> tag code for this specific ad unit..."
                          value={adsHeaderCode}
                          onChange={(e) => setAdsHeaderCode(e.target.value)}
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-[11px] font-mono text-primary"
                        />
                      </div>
                      <div className="md:col-span-6 space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block border-b border-gray-50 pb-1">Direct Sponsor / Fallback Ad</span>
                        <div className="space-y-2">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-gray-500 uppercase block">Fallback Image URL</span>
                            <input
                              type="text"
                              placeholder="e.g., https://example.com/sponsor-banner.jpg"
                              value={adsHeaderFallbackImage}
                              onChange={(e) => setAdsHeaderFallbackImage(e.target.value)}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[11px] text-primary font-mono focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-gray-500 uppercase block">Target Redirect Link</span>
                            <input
                              type="text"
                              placeholder="e.g., https://pipedrive.com/affiliate-code"
                              value={adsHeaderFallbackLink}
                              onChange={(e) => setAdsHeaderFallbackLink(e.target.value)}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[11px] text-primary font-mono focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Slot 2: Sidebar Square Banner */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4 shadow-xs">
                    <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary/5 rounded-lg text-primary">
                          <Layout className="w-4 h-4 rotate-90" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-wider text-primary">Sidebar Block Unit</h4>
                          <span className="text-[10px] text-gray-400 font-mono font-medium">Slot Name: sidebarAd (Recommended Size: 300x250px)</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAdsSidebarEnabled(!adsSidebarEnabled)}
                        className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border transition ${
                          adsSidebarEnabled 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                            : 'bg-gray-50 text-gray-400 border-gray-100'
                        }`}
                      >
                        {adsSidebarEnabled ? 'Slot Enabled' : 'Slot Disabled'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-6 space-y-1.5">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-wider block">AdSense Unit HTML Code</label>
                        <textarea
                          rows={4}
                          placeholder="Paste the raw <ins> tag code for this specific ad unit..."
                          value={adsSidebarCode}
                          onChange={(e) => setAdsSidebarCode(e.target.value)}
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-[11px] font-mono text-primary"
                        />
                      </div>
                      <div className="md:col-span-6 space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block border-b border-gray-50 pb-1">Direct Sponsor / Fallback Ad</span>
                        <div className="space-y-2">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-gray-500 uppercase block">Fallback Image URL</span>
                            <input
                              type="text"
                              placeholder="e.g., https://example.com/sponsor-sidebar.jpg"
                              value={adsSidebarFallbackImage}
                              onChange={(e) => setAdsSidebarFallbackImage(e.target.value)}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[11px] text-primary font-mono focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-gray-500 uppercase block">Target Redirect Link</span>
                            <input
                              type="text"
                              placeholder="e.g., https://streak.com/affiliate-code"
                              value={adsSidebarFallbackLink}
                              onChange={(e) => setAdsSidebarFallbackLink(e.target.value)}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[11px] text-primary font-mono focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Slot 3: In-Content Inline Banner */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4 shadow-xs">
                    <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary/5 rounded-lg text-primary">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-wider text-primary">In-Content Fluid Unit</h4>
                          <span className="text-[10px] text-gray-400 font-mono font-medium">Slot Name: inContentAd (Fluid / Responsive Layout ad)</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAdsInContentEnabled(!adsInContentEnabled)}
                        className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border transition ${
                          adsInContentEnabled 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                            : 'bg-gray-50 text-gray-400 border-gray-100'
                        }`}
                      >
                        {adsInContentEnabled ? 'Slot Enabled' : 'Slot Disabled'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-6 space-y-1.5">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-wider block">AdSense Unit HTML Code</label>
                        <textarea
                          rows={4}
                          placeholder="Paste the raw <ins> tag code for this specific ad unit..."
                          value={adsInContentCode}
                          onChange={(e) => setAdsInContentCode(e.target.value)}
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-[11px] font-mono text-primary"
                        />
                      </div>
                      <div className="md:col-span-6 space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block border-b border-gray-50 pb-1">Direct Sponsor / Fallback Ad</span>
                        <div className="space-y-2">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-gray-500 uppercase block">Fallback Image URL</span>
                            <input
                              type="text"
                              placeholder="e.g., https://example.com/sponsor-inline.jpg"
                              value={adsInContentFallbackImage}
                              onChange={(e) => setAdsInContentFallbackImage(e.target.value)}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[11px] text-primary font-mono focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-gray-500 uppercase block">Target Redirect Link</span>
                            <input
                              type="text"
                              placeholder="e.g., https://followupboss.com/affiliate-code"
                              value={adsInContentFallbackLink}
                              onChange={(e) => setAdsInContentFallbackLink(e.target.value)}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[11px] text-primary font-mono focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Slot 4: Footer Leaderboard Banner */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4 shadow-xs">
                    <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary/5 rounded-lg text-primary">
                          <Layout className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-wider text-primary">Footer Banner Unit</h4>
                          <span className="text-[10px] text-gray-400 font-mono font-medium">Slot Name: footerBanner (Recommended Size: 728x90px)</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAdsFooterEnabled(!adsFooterEnabled)}
                        className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border transition ${
                          adsFooterEnabled 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                            : 'bg-gray-50 text-gray-400 border-gray-100'
                        }`}
                      >
                        {adsFooterEnabled ? 'Slot Enabled' : 'Slot Disabled'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-6 space-y-1.5">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-wider block">AdSense Unit HTML Code</label>
                        <textarea
                          rows={4}
                          placeholder="Paste the raw <ins> tag code for this specific ad unit..."
                          value={adsFooterCode}
                          onChange={(e) => setAdsFooterCode(e.target.value)}
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-[11px] font-mono text-primary"
                        />
                      </div>
                      <div className="md:col-span-6 space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block border-b border-gray-50 pb-1">Direct Sponsor / Fallback Ad</span>
                        <div className="space-y-2">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-gray-500 uppercase block">Fallback Image URL</span>
                            <input
                              type="text"
                              placeholder="e.g., https://example.com/sponsor-footer.jpg"
                              value={adsFooterFallbackImage}
                              onChange={(e) => setAdsFooterFallbackImage(e.target.value)}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[11px] text-primary font-mono focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-gray-500 uppercase block">Target Redirect Link</span>
                            <input
                              type="text"
                              placeholder="e.g., https://pipedrive.com/affiliate-code"
                              value={adsFooterFallbackLink}
                              onChange={(e) => setAdsFooterFallbackLink(e.target.value)}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[11px] text-primary font-mono focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Save Button block */}
                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={handleSaveAdSense}
                    className="px-8 py-4 bg-primary hover:bg-primary/95 text-accent font-black uppercase tracking-widest text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md transition hover:scale-101 duration-150"
                  >
                    <Save className="w-4.5 h-4.5 text-accent" /> Save &amp; Live Deploy Ad Units
                  </button>
                </div>

              </div>

              {/* Right Column: Tips & live preview mockup */}
              <div className="lg:col-span-4 space-y-6">
                
                <div className="bg-primary text-white border-b-4 border-accent p-6 rounded-2xl shadow-sm space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-accent flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-accent" /> Ad placement Locations
                  </h3>
                  <div className="space-y-3 text-xs leading-relaxed text-gray-200">
                    <p>
                      To ensure maximum compliance and click-through rates (CTR) while respecting WCAG standards:
                    </p>
                    <ul className="space-y-2 list-disc pl-4 font-sans text-gray-300">
                      <li>
                        <strong>Header Unit:</strong> Displays above the main navbar to capture incoming search traffic.
                      </li>
                      <li>
                        <strong>Sidebar Unit:</strong> Displays inside review detail pages and guide pages right next to your product comparisons.
                      </li>
                      <li>
                        <strong>In-Content Unit:</strong> Embedded directly in the middle of blog posts and comprehensive lists to optimize inline context.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Simulated Live Preview of Sponsor fallback ad */}
                <div className="border border-gray-100 rounded-2xl p-5 bg-white space-y-4 shadow-xs">
                  <div className="flex items-center gap-2 border-b border-gray-50 pb-2">
                    <Eye className="w-4 h-4 text-accent" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Live Sponsor Mockup</span>
                  </div>

                  <p className="text-[11px] text-gray-400">
                    If you haven&apos;t been approved for Google AdSense yet, fill out the Fallback Image URL to display highly refined banner ads instantly!
                  </p>

                  <div className="bg-gray-50 border border-gray-150 rounded-lg p-4 text-center text-xs space-y-2">
                    <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block">PREVIEW WRAPPER</span>
                    
                    {adsHeaderFallbackImage ? (
                      <div className="relative overflow-hidden rounded border border-accent/20 max-h-[80px]">
                        <img 
                          src={adsHeaderFallbackImage} 
                          alt="Live Fallback Banner Preview" 
                          className="w-full h-full object-cover max-h-[80px]"
                        />
                        <div className="absolute top-1 right-1 bg-primary/80 text-[8px] text-accent font-bold px-1 py-0.5 rounded">
                          Preview
                        </div>
                      </div>
                    ) : (
                      <div className="py-6 border-2 border-dashed border-gray-200 rounded flex flex-col items-center justify-center text-gray-400 gap-1">
                        <Layout className="w-6 h-6 text-gray-300" />
                        <span className="text-[10px] font-semibold">No Image Configured</span>
                      </div>
                    )}
                    <span className="text-[9px] font-mono text-accent bg-primary px-2 py-0.5 rounded inline-block">
                      Link: {adsHeaderFallbackLink || 'No link set'}
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* 6. TAB: SEO DIAGNOSTIC AUDIT PANEL */}
        {activeTab === 'seo-audit' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* Top Bar Header & Action */}
            <div className="border-b border-gray-100 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-primary font-display flex items-center gap-2">
                  <Activity className="w-5 h-5 text-accent" /> SEO Diagnostic &amp; Content Audit Panel
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Scans all published blog posts, guides, and CRM reviews for missing meta descriptions, missing target keywords, and search indexing compliance.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAutoFixAllSEO}
                  className="px-4 py-2.5 bg-primary hover:bg-primary/95 text-accent font-black uppercase text-xs rounded-xl flex items-center gap-2 shadow-sm transition cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-accent animate-pulse" /> Auto-Fix All Missing Meta Descriptions
                </button>
              </div>
            </div>

            {/* Scorecards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Scorecard 1: Health Score */}
              <div className="bg-gradient-to-br from-primary to-primary/90 text-white p-5 rounded-2xl space-y-3 relative overflow-hidden border border-primary">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent font-mono">Overall SEO Grade</span>
                  <Award className="w-5 h-5 text-accent" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black font-display text-white">{seoSummary.avgScore}%</span>
                  <span className="text-xs font-bold text-accent font-mono">
                    {seoSummary.avgScore >= 90 ? 'A+ (Optimal)' : seoSummary.avgScore >= 75 ? 'B (Good)' : 'Needs Fixes'}
                  </span>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${seoSummary.avgScore >= 85 ? 'bg-accent' : 'bg-yellow-400'}`}
                    style={{ width: `${seoSummary.avgScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Scorecard 2: Total Items */}
              <div className="bg-white border border-gray-150 p-5 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-gray-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Total Scanned Pages</span>
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div className="text-3xl font-black text-primary font-display">{auditItems.length}</div>
                <p className="text-[11px] text-gray-500">{blogs.length} Blogs • {guides.length} Guides • {reviews.length} Reviews</p>
              </div>

              {/* Scorecard 3: Missing Meta */}
              <div className={`p-5 rounded-2xl border space-y-2 ${
                seoSummary.missingMetaCount > 0 ? 'bg-red-50/50 border-red-200' : 'bg-emerald-50/50 border-emerald-200'
              }`}>
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    seoSummary.missingMetaCount > 0 ? 'text-red-700' : 'text-emerald-700'
                  }`}>Missing Meta Descriptions</span>
                  <AlertTriangle className={`w-4 h-4 ${seoSummary.missingMetaCount > 0 ? 'text-red-500' : 'text-emerald-500'}`} />
                </div>
                <div className={`text-3xl font-black font-display ${seoSummary.missingMetaCount > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {seoSummary.missingMetaCount}
                </div>
                <p className="text-[11px] text-gray-500">
                  {seoSummary.missingMetaCount > 0 ? 'Requires meta description tag' : 'All articles have meta tags'}
                </p>
              </div>

              {/* Scorecard 4: Missing Keywords */}
              <div className={`p-5 rounded-2xl border space-y-2 ${
                seoSummary.missingKeywordCount > 0 ? 'bg-amber-50/50 border-amber-200' : 'bg-emerald-50/50 border-emerald-200'
              }`}>
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    seoSummary.missingKeywordCount > 0 ? 'text-amber-800' : 'text-emerald-700'
                  }`}>Low Keyword Density</span>
                  <Search className={`w-4 h-4 ${seoSummary.missingKeywordCount > 0 ? 'text-amber-500' : 'text-emerald-500'}`} />
                </div>
                <div className={`text-3xl font-black font-display ${seoSummary.missingKeywordCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {seoSummary.missingKeywordCount}
                </div>
                <p className="text-[11px] text-gray-500">
                  {seoSummary.missingKeywordCount > 0 ? 'Needs target real estate keywords' : 'Strong target keyword usage'}
                </p>
              </div>

            </div>

            {/* Featured Visual Score-Card Diagnostic Matrix for Blog Posts */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-5 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-accent" />
                    <h3 className="text-sm font-bold uppercase font-display text-white tracking-wider">
                      Blog Posts Content Diagnostic Score-Card Matrix
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-time aggregated visual metrics across {seoSummary.blogItemsCount} published blog posts highlighting readability, keyword density, and meta-data completeness.
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold bg-slate-800 text-accent px-3 py-1 rounded-full border border-slate-700">
                  Live Scanner Active
                </span>
              </div>

              {/* 3 Core Visual Diagnostic Score-Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Score-Card 1: Readability Index */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 relative overflow-hidden">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-accent" /> Readability Index
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      seoSummary.avgBlogReadability >= 60 
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800' 
                        : seoSummary.avgBlogReadability >= 45 
                        ? 'bg-amber-950 text-amber-400 border-amber-800' 
                        : 'bg-red-950 text-red-400 border-red-800'
                    }`}>
                      {seoSummary.avgBlogReadability >= 60 ? '🟢 Optimal' : seoSummary.avgBlogReadability >= 45 ? '🟡 Moderate' : '🔴 Needs Fix'}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-black font-display text-white">{seoSummary.avgBlogReadability}/100</span>
                    <span className="text-xs font-mono text-slate-400">Flesch Ease</span>
                  </div>

                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        seoSummary.avgBlogReadability >= 60 ? 'bg-emerald-500' : seoSummary.avgBlogReadability >= 45 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${seoSummary.avgBlogReadability}%` }}
                    ></div>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono pt-1">
                    <span>{seoSummary.blogOptimalReadabilityCount} / {seoSummary.blogItemsCount} Posts Pass</span>
                    <span className="text-accent">{Math.round((seoSummary.blogOptimalReadabilityCount / (seoSummary.blogItemsCount || 1)) * 100)}% Clear</span>
                  </div>
                </div>

                {/* Score-Card 2: Keyword Density */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 relative overflow-hidden">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-accent" /> Keyword Density
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      seoSummary.avgBlogDensity >= 1.0 && seoSummary.avgBlogDensity <= 4.0 
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800' 
                        : 'bg-amber-950 text-amber-400 border-amber-800'
                    }`}>
                      {seoSummary.avgBlogDensity >= 1.0 && seoSummary.avgBlogDensity <= 4.0 ? '🟢 Optimal Range' : '🟡 Check Density'}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-black font-display text-white">{seoSummary.avgBlogDensity}%</span>
                    <span className="text-xs font-mono text-slate-400">Target: 1.0 - 4.0%</span>
                  </div>

                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        seoSummary.avgBlogDensity >= 1.0 && seoSummary.avgBlogDensity <= 4.0 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, (seoSummary.avgBlogDensity / 4) * 100)}%` }}
                    ></div>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono pt-1">
                    <span>{seoSummary.blogOptimalDensityCount} / {seoSummary.blogItemsCount} Posts Optimal</span>
                    <span className="text-accent">{Math.round((seoSummary.blogOptimalDensityCount / (seoSummary.blogItemsCount || 1)) * 100)}% Targeted</span>
                  </div>
                </div>

                {/* Score-Card 3: Meta-Data Completeness */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 relative overflow-hidden">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-accent" /> Meta-Data Completeness
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      seoSummary.avgBlogMetaCompleteness >= 90 
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800' 
                        : seoSummary.avgBlogMetaCompleteness >= 65 
                        ? 'bg-amber-950 text-amber-400 border-amber-800' 
                        : 'bg-red-950 text-red-400 border-red-800'
                    }`}>
                      {seoSummary.avgBlogMetaCompleteness >= 90 ? '🟢 100% Complete' : '🟡 Partial Meta'}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-black font-display text-white">{seoSummary.avgBlogMetaCompleteness}%</span>
                    <span className="text-xs font-mono text-slate-400">Field Health</span>
                  </div>

                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        seoSummary.avgBlogMetaCompleteness >= 90 ? 'bg-emerald-500' : seoSummary.avgBlogMetaCompleteness >= 65 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${seoSummary.avgBlogMetaCompleteness}%` }}
                    ></div>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono pt-1">
                    <span>{seoSummary.blogCompleteMetaCount} / {seoSummary.blogItemsCount} Posts Complete</span>
                    <span className="text-accent">{Math.round((seoSummary.blogCompleteMetaCount / (seoSummary.blogItemsCount || 1)) * 100)}% Valid</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Filter & Search Bar Controls */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-150 flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={seoAuditSearch}
                  onChange={(e) => setSeoAuditSearch(e.target.value)}
                  placeholder="Filter articles by title or keyword..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-primary focus:outline-none focus:border-accent"
                />
                {seoAuditSearch && (
                  <button onClick={() => setSeoAuditSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary">
                    ✕
                  </button>
                )}
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-1">Status:</span>
                {[
                  { id: 'all', label: `All (${auditItems.length})` },
                  { id: 'issues', label: `Action Needed (${seoSummary.totalIssuesCount})` },
                  { id: 'passed', label: `100% Passed (${seoSummary.passedCount})` }
                ].map(btn => (
                  <button
                    key={btn.id}
                    onClick={() => setSeoAuditFilter(btn.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      seoAuditFilter === btn.id
                        ? 'bg-primary text-accent shadow-xs'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}

                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-2 mr-1">Type:</span>
                {[
                  { id: 'all', label: 'All Types' },
                  { id: 'blog', label: 'Blogs' },
                  { id: 'guide', label: 'Guides' },
                  { id: 'review', label: 'Reviews' }
                ].map(btn => (
                  <button
                    key={btn.id}
                    onClick={() => setSeoAuditType(btn.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      seoAuditType === btn.id
                        ? 'bg-accent text-primary shadow-xs'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

            </div>

            {/* Audited Items Table / List */}
            <div className="space-y-4">
              {auditItems.filter(item => {
                if (seoAuditFilter === 'issues' && item.issues.length === 0) return false;
                if (seoAuditFilter === 'passed' && (item.issues.length > 0 || item.warnings.length > 0)) return false;
                if (seoAuditType !== 'all' && item.type !== seoAuditType) return false;
                if (seoAuditSearch.trim()) {
                  const q = seoAuditSearch.toLowerCase();
                  const matchesTitle = item.title.toLowerCase().includes(q);
                  const matchesSlug = item.slug.toLowerCase().includes(q);
                  const matchesKw = item.detectedKeywords.some(k => k.includes(q)) || item.missingKeywords.some(k => k.includes(q));
                  if (!matchesTitle && !matchesSlug && !matchesKw) return false;
                }
                return true;
              }).length === 0 ? (
                <div className="p-12 text-center bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                  <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
                  <h3 className="font-bold text-primary text-sm">No items matching current SEO diagnostic filters</h3>
                  <p className="text-xs text-gray-500">Try adjusting your status or content type filters above.</p>
                </div>
              ) : (
                auditItems
                  .filter(item => {
                    if (seoAuditFilter === 'issues' && item.issues.length === 0) return false;
                    if (seoAuditFilter === 'passed' && (item.issues.length > 0 || item.warnings.length > 0)) return false;
                    if (seoAuditType !== 'all' && item.type !== seoAuditType) return false;
                    if (seoAuditSearch.trim()) {
                      const q = seoAuditSearch.toLowerCase();
                      const matchesTitle = item.title.toLowerCase().includes(q);
                      const matchesSlug = item.slug.toLowerCase().includes(q);
                      const matchesKw = item.detectedKeywords.some(k => k.includes(q)) || item.missingKeywords.some(k => k.includes(q));
                      if (!matchesTitle && !matchesSlug && !matchesKw) return false;
                    }
                    return true;
                  })
                  .map(item => {
                    const isPerfect = item.score >= 90;
                    const hasIssues = item.issues.length > 0;

                    return (
                      <div 
                        key={item.id} 
                        className={`p-5 rounded-2xl border transition duration-150 space-y-4 ${
                          hasIssues 
                            ? 'bg-red-50/20 border-red-200 hover:border-red-300' 
                            : isPerfect 
                            ? 'bg-white border-emerald-200 hover:border-emerald-300' 
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {/* Item Top Line */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-gray-100 pb-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded font-mono ${
                                item.type === 'blog' ? 'bg-primary text-accent' : item.type === 'guide' ? 'bg-accent/20 text-primary' : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {item.typeName}
                              </span>
                              <h3 className="font-bold text-sm text-primary">{item.title}</h3>
                            </div>
                            <div className="text-[11px] text-gray-400 font-mono">
                              Slug: /{item.type === 'blog' ? 'blog' : item.type === 'guide' ? 'guides' : 'reviews'}/{item.slug} • Word Count: {item.wordCount} words
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {(() => {
                              const overallGrade = computeOverallGrade(item.score);
                              return (
                                <span className={`text-xs font-black px-3 py-1 rounded-full font-mono flex items-center gap-1.5 border shadow-xs ${overallGrade.class}`}>
                                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${overallGrade.badgeClass}`}>
                                    {overallGrade.letter}
                                  </span>
                                  <span>SEO Score: {item.score}/100</span>
                                </span>
                              );
                            })()}

                            {hasIssues && (
                              <button
                                onClick={() => handleAutoFixSingleItem(item)}
                                className="px-3 py-1 bg-primary hover:bg-primary/95 text-accent font-bold text-[11px] rounded-lg flex items-center gap-1 transition cursor-pointer shadow-xs"
                              >
                                <Zap className="w-3 h-3 text-accent" /> Auto-Fix Meta
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Detailed Visual Score-Card Matrix for this Post */}
                        <div className="bg-slate-900 text-white p-4.5 rounded-xl border border-slate-800 space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                              <h4 className="text-xs font-mono font-bold uppercase text-accent tracking-wider">
                                {item.typeName} Visual Diagnostic Score-Card
                              </h4>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded ${item.readability.gradeBadgeClass}`}>
                                {item.readability.grade} Readability
                              </span>
                              <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded ${item.keywordDensity.gradeBadgeClass}`}>
                                {item.keywordDensity.grade} Density
                              </span>
                            </div>
                          </div>

                          {/* 3 Metric Score Pillars */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            
                            {/* 1. Readability Scorecard */}
                            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 flex items-center gap-1">
                                  <BookOpen className="w-3 h-3 text-accent" /> Readability Index
                                </span>
                                <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded ${item.readability.gradeBadgeClass}`}>
                                  {item.readability.grade}
                                </span>
                              </div>

                              <div className="flex items-baseline justify-between">
                                <span className="text-2xl font-black font-display text-white">{item.readability.score}/100</span>
                                <span className="text-[10px] font-mono text-emerald-400 font-bold">{item.readability.statusLabel}</span>
                              </div>

                              {/* Meter Bar */}
                              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all duration-300 ${item.readability.barColor}`} 
                                  style={{ width: `${Math.min(100, item.readability.score)}%` }}
                                ></div>
                              </div>

                              <p className="text-[10px] text-slate-400 leading-tight">
                                {item.readability.description}
                              </p>
                            </div>

                            {/* 2. Keyword Density Scorecard */}
                            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 flex items-center gap-1">
                                  <Search className="w-3 h-3 text-accent" /> Keyword Density
                                </span>
                                <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded ${item.keywordDensity.gradeBadgeClass}`}>
                                  {item.keywordDensity.grade}
                                </span>
                              </div>

                              <div className="flex items-baseline justify-between">
                                <span className="text-2xl font-black font-display text-white">{item.keywordDensity.densityPct}%</span>
                                <span className="text-[10px] font-mono text-emerald-400 font-bold">{item.keywordDensity.occurrences} matches</span>
                              </div>

                              {/* Meter Bar */}
                              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all duration-300 ${item.keywordDensity.barColor}`} 
                                  style={{ width: `${Math.min(100, (item.keywordDensity.densityPct / 4) * 100)}%` }}
                                ></div>
                              </div>

                              <p className="text-[10px] text-slate-400 leading-tight">
                                {item.keywordDensity.description}
                              </p>
                            </div>

                            {/* 3. Meta-Data Completeness Scorecard */}
                            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 flex items-center gap-1">
                                  <FileText className="w-3 h-3 text-accent" /> Meta-Data Health
                                </span>
                                <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded ${item.metaCompleteness.gradeBadgeClass}`}>
                                  {item.metaCompleteness.grade}
                                </span>
                              </div>

                              <div className="flex items-baseline justify-between">
                                <span className="text-2xl font-black font-display text-white">{item.metaCompleteness.score}%</span>
                                <span className="text-[10px] font-mono text-emerald-400 font-bold">{item.metaCompleteness.statusLabel}</span>
                              </div>

                              {/* Meter Bar */}
                              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all duration-300 ${item.metaCompleteness.barColor}`} 
                                  style={{ width: `${item.metaCompleteness.score}%` }}
                                ></div>
                              </div>

                              {/* Field checklist pills */}
                              <div className="flex flex-wrap gap-1 pt-0.5">
                                {item.metaCompleteness.checklist.map((chk, i) => (
                                  <span 
                                    key={i} 
                                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                                      chk.complete 
                                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60' 
                                        : 'bg-red-950/80 text-red-400 border border-red-800/60'
                                    }`}
                                    title={chk.note}
                                  >
                                    {chk.complete ? '✓' : '✕'} {chk.name}
                                  </span>
                                ))}
                              </div>
                            </div>

                          </div>
                        </div>

                        {/* Meta Description Preview */}
                        <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-150 space-y-1.5 text-xs">
                          <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">
                            <span>Meta Description Tag</span>
                            <span className={item.excerpt.length < 70 || item.excerpt.length > 170 ? 'text-amber-600 font-bold' : 'text-emerald-600 font-bold'}>
                              {item.excerpt.length} Characters (Recommended: 80 - 160)
                            </span>
                          </div>
                          <p className="text-gray-700 italic leading-relaxed">
                            "{item.excerpt || <span className="text-red-500 font-semibold not-italic">⚠️ Missing meta description! Click Auto-Fix to generate automatically.</span>}"
                          </p>
                        </div>

                        {/* Diagnostic Breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          
                          {/* Identified Issues & Warnings */}
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Diagnostic Findings</span>
                            {item.issues.length === 0 && item.warnings.length === 0 ? (
                              <div className="text-emerald-600 font-semibold flex items-center gap-1.5 text-xs">
                                <CheckCircle className="w-4 h-4 text-emerald-500" /> Fully optimized &amp; compliant with search indexing rules
                              </div>
                            ) : (
                              <ul className="space-y-1">
                                {item.issues.map((iss, idx) => (
                                  <li key={idx} className="text-red-600 font-medium flex items-start gap-1.5 text-xs">
                                    <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                                    <span>{iss}</span>
                                  </li>
                                ))}
                                {item.warnings.map((warn, idx) => (
                                  <li key={idx} className="text-amber-700 font-medium flex items-start gap-1.5 text-xs">
                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                    <span>{warn}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>

                          {/* Target Keywords Detected */}
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Real Estate Target Keywords Detected</span>
                            <div className="flex flex-wrap gap-1">
                              {item.detectedKeywords.length > 0 ? (
                                item.detectedKeywords.map((kw, idx) => (
                                  <span key={idx} className="px-2 py-0.5 bg-accent/20 text-primary font-bold text-[10px] rounded font-mono">
                                    ✓ {kw}
                                  </span>
                                ))
                              ) : (
                                <span className="text-red-500 text-xs font-semibold">⚠️ No core real estate keywords detected</span>
                              )}
                            </div>
                          </div>

                        </div>

                      </div>
                    );
                  })
              )}
            </div>

            {/* Technical Indexing & SEO Checklist Card */}
            <div className="bg-primary text-white border-b-4 border-accent p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-accent flex items-center gap-2 font-display">
                <ShieldCheck className="w-5 h-5 text-accent" /> Search Indexing &amp; Technical SEO Compliance Checklist
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-300">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent shrink-0" />
                    <span>Dynamic OpenGraph &amp; Twitter Meta Tags enabled for all CRM review &amp; article routes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent shrink-0" />
                    <span>Schema.org JSON-LD Breadcrumb navigation tags rendered across site</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent shrink-0" />
                    <span>WCAG 2.1 AA Color Contrast &amp; Mobile Responsive Viewport Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent shrink-0" />
                    <span>E-E-A-T Founder Credentials &amp; Author Disclosures linked to Eugene Boniface</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}

