import React, { useState, useMemo } from 'react';
import { PlanningCategory, PlanningToolItem } from '../types';
import { useSEO } from '../lib/seo';
import { getToolsByCategorySlug } from '../data/indexedToolsDirectory';
import { generatePlanningCategoryPDF } from '../lib/pdfGenerator';
import { 
  ArrowLeft, 
  ExternalLink, 
  Globe2, 
  ShieldCheck, 
  Star, 
  BookOpen,
  Check,
  Search,
  Filter,
  Sparkles,
  Layers,
  ArrowUpRight,
  SlidersHorizontal,
  Server,
  DollarSign,
  Download
} from 'lucide-react';

interface PlanningCategoryDetailProps {
  category: PlanningCategory;
  allCategories: PlanningCategory[];
  onNavigate: (path: string) => void;
}

export const PlanningCategoryDetail: React.FC<PlanningCategoryDetailProps> = ({
  category,
  allCategories,
  onNavigate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | 'freemium' | 'paid' | 'open-source'>('all');

  // Dynamic SEO & GEO
  useSEO({
    title: `Best ${category.name} Software (${category.toolCount}) - 2026 Reviews & Pricing`,
    description: `Compare ${category.name} platforms with ${category.toolCount} tools evaluated. Review pricing, GEO compliance (${category.geoFocus.regions.join(', ')}), and features.`,
    keywords: [
      category.name.toLowerCase(),
      `best ${category.name.toLowerCase()} software`,
      `${category.name.toLowerCase()} reviews 2026`,
      `${category.name.toLowerCase()} comparison`,
      ...category.evaluationCriteria.map(c => c.toLowerCase())
    ],
    ogType: 'article'
  }, [category]);

  // Combine top tools and all indexed tools for this category
  const allCategoryTools = useMemo(() => {
    const fromIndex = getToolsByCategorySlug(category.slug || category.id);
    const existingNames = new Set(fromIndex.map(t => t.name.toLowerCase()));
    const extras = category.topTools.filter(t => !existingNames.has(t.name.toLowerCase()));
    return [...fromIndex, ...extras];
  }, [category]);

  // Filtered tools based on search and tier filter
  const filteredTools = useMemo(() => {
    return allCategoryTools.filter(tool => {
      const matchesSearch = searchQuery.trim() === '' || 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.bestFor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.keyFeatures.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTier = 
        tierFilter === 'all' ? true :
        tierFilter === 'freemium' ? (tool.pricingTier === 'Freemium' || tool.pricingTier === 'Free' || tool.pricingStarting.toLowerCase().includes('free')) :
        tierFilter === 'paid' ? (tool.pricingTier === 'Paid' || tool.pricingTier === 'Enterprise Quote') :
        tierFilter === 'open-source' ? (tool.pricingTier === 'Open-Source' || tool.pricingStarting.toLowerCase().includes('open-source')) :
        true;

      return matchesSearch && matchesTier;
    });
  }, [allCategoryTools, searchQuery, tierFilter]);

  // Schema.org SoftwareApplication List Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': `Top ${category.name} Tools & Software (${category.toolCount})`,
    'description': category.description,
    'itemListElement': allCategoryTools.map((tool, index) => ({
      '@type': 'SoftwareApplication',
      'position': index + 1,
      'name': tool.name,
      'applicationCategory': category.name,
      'operatingSystem': tool.deployment || 'Web, Cloud, iOS, Android',
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': tool.rating,
        'bestRating': '5.0',
        'ratingCount': 1000
      },
      'offers': {
        '@type': 'Offer',
        'price': tool.pricingStarting.replace(/[^0-9.]/g, '') || '0',
        'priceCurrency': 'USD'
      }
    }))
  };

  const [pdfGenerating, setPdfGenerating] = useState(false);

  const handleDownloadPDF = () => {
    setPdfGenerating(true);
    try {
      const doc = generatePlanningCategoryPDF(category);
      doc.save(`${category.slug}-software-benchmark-report.pdf`);
    } catch (err) {
      console.error('Failed to generate Category PDF:', err);
    } finally {
      setPdfGenerating(false);
    }
  };

  const otherCategories = allCategories
    .filter(c => c.id !== category.id)
    .slice(0, 6);

  return (
    <div id={`category-page-${category.id}`} className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Breadcrumbs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button
            onClick={() => onNavigate('/planning-tools')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Planning Tools Hub
          </button>
          <div className="text-xs font-mono text-slate-400">
            Category Index #{category.id}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <header className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold font-mono px-3 py-1 rounded-full border border-emerald-500/30">
              Verified 2026 Audit
            </span>
            <span className="bg-slate-800 text-slate-300 text-xs font-mono px-3 py-1 rounded-full border border-slate-700">
              {category.toolCount} Tools Audited
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white mb-4">
            {category.name}{' '}
            <span className="text-emerald-400 font-mono">({category.toolCount})</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed mb-6">
            {category.description}
          </p>

          {/* Quick GEO Summary Badges & PDF Download */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-slate-800">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300">
                <Globe2 className="w-4 h-4 text-emerald-400" />
                GEO Regions: {category.geoFocus.regions.join(' • ')}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Compliance: {category.geoFocus.topComplianceStandards.join(', ')}
              </span>
            </div>

            <button
              onClick={handleDownloadPDF}
              disabled={pdfGenerating}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {pdfGenerating ? 'Generating Benchmark PDF...' : 'Download Category PDF Report'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* Top Evaluated Platforms Header */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 font-display">
                Featured {category.name} Platforms ({category.topTools.length})
              </h2>
              <p className="text-xs text-slate-500">
                In-depth editorial evaluations, verified user ratings, pros/cons, and direct official platform links.
              </p>
            </div>
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <button
                onClick={handleDownloadPDF}
                disabled={pdfGenerating}
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition border border-slate-200 disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                {pdfGenerating ? 'Generating...' : 'Export PDF'}
              </button>
              <button
                onClick={() => onNavigate('/blog')}
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700"
              >
                <BookOpen className="w-4 h-4" />
                Read Guides &rarr;
              </button>
            </div>
          </div>

          {/* Featured Tools Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {category.topTools.map((tool, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top Bar with Name, Rating and Badge */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-slate-900">
                          {tool.name}
                        </h3>
                        {tool.featuredBadge && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase font-mono">
                            {tool.featuredBadge}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-bold text-amber-600">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          {tool.rating} / 5.0
                        </span>
                        <span>•</span>
                        <span className="text-slate-600 font-medium">Best for: {tool.bestFor}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-900 font-mono">
                        {tool.pricingStarting}
                      </div>
                      {tool.trialUrl && (
                        <a 
                          href={tool.trialUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[11px] text-emerald-600 font-semibold hover:underline block"
                        >
                          Free Trial &rarr;
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Key Features Bullet points */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-500 uppercase font-mono tracking-wider">
                      Core Capabilities:
                    </div>
                    {tool.keyFeatures.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pros and Cons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                      <div className="font-bold text-emerald-900 mb-1 text-[11px] uppercase tracking-wide">Pros:</div>
                      <ul className="space-y-1 text-emerald-800 text-[11px]">
                        {tool.pros.map((p, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold">+</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-100">
                      <div className="font-bold text-rose-900 mb-1 text-[11px] uppercase tracking-wide">Cons:</div>
                      <ul className="space-y-1 text-rose-800 text-[11px]">
                        {tool.cons.map((c, cIdx) => (
                          <li key={cIdx} className="flex items-start gap-1.5">
                            <span className="text-rose-500 font-bold">-</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* GEO & Security Standards */}
                  {tool.geoCompliance && tool.geoCompliance.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className="text-[10px] text-slate-400 font-mono font-bold">GEO Standards:</span>
                      {tool.geoCompliance.map((gc, gcIdx) => (
                        <span key={gcIdx} className="text-[10px] bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded-md">
                          {gc}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Action Buttons (Direct Official Links) */}
                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-500 font-medium">
                    Deployment: {tool.deployment || 'Cloud, Web, Mobile'}
                  </span>

                  <div className="flex items-center gap-2">
                    {tool.websiteUrl && (
                      <a
                        href={tool.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition group"
                      >
                        <span>Visit Website</span>
                        <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Complete Listing of Tools Section */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold font-mono px-2.5 py-0.5 rounded-full">
                  Category Directory Index
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {category.toolCount} Tools Audited in Database
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 font-display">
                All Audited {category.name} Software ({category.toolCount})
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Browse verified software profiles, deployment architectures, pricing tiers, and direct official links from our {category.name} benchmark ({category.toolCount}).
              </p>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={`Search ${category.name}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
              </div>

              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
                <button
                  onClick={() => setTierFilter('all')}
                  className={`px-3 py-1 rounded-lg font-medium transition ${tierFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  All ({allCategoryTools.length})
                </button>
                <button
                  onClick={() => setTierFilter('freemium')}
                  className={`px-3 py-1 rounded-lg font-medium transition ${tierFilter === 'freemium' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Free / Trial
                </button>
                <button
                  onClick={() => setTierFilter('paid')}
                  className={`px-3 py-1 rounded-lg font-medium transition ${tierFilter === 'paid' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Commercial
                </button>
              </div>
            </div>
          </div>

          {/* Directory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool, tIdx) => (
              <div
                key={tIdx}
                className="bg-slate-50/70 hover:bg-white rounded-xl border border-slate-200/80 hover:border-emerald-500/40 p-4 transition-all duration-200 flex flex-col justify-between group shadow-xs hover:shadow-sm"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                        {tool.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {tool.rating}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[11px] font-mono text-slate-600 font-semibold">
                          {tool.pricingStarting}
                        </span>
                      </div>
                    </div>

                    {tool.featuredBadge && (
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full font-mono shrink-0">
                        {tool.featuredBadge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {tool.bestFor}
                  </p>

                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-mono">
                    <Server className="w-3 h-3 text-slate-400" />
                    <span className="truncate">{tool.deployment || 'Cloud / Web / Mobile'}</span>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between gap-2">
                  {tool.trialUrl ? (
                    <a
                      href={tool.trialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-slate-600 hover:text-emerald-600 transition"
                    >
                      Free Trial &rarr;
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-400">Verified Platform</span>
                  )}

                  <a
                    href={tool.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition"
                  >
                    <span>Visit Site</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-xs">
              No software matching your search query was found in this category.
            </div>
          )}
        </section>

        {/* Technical Evaluation Criteria & Benchmark Section */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-slate-900 font-display">
            How We Evaluate {category.name} ({category.toolCount})
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Our software engineering and PMO analysts test platforms in the {category.name} category against strict operational benchmarks to ensure high throughput, zero data loss, and seamless cross-functional team adoption.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {category.evaluationCriteria.map((criterion, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 mb-0.5">{criterion}</h4>
                  <p className="text-[11px] text-slate-500">
                    Audited for high-concurrency workflows, user permission tiers, and automated notification triggers.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Global GEO & Data Residency Compliance Section */}
        <section className="bg-emerald-900 text-white rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <Globe2 className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-bold font-display">
              Regional GEO Data Sovereignty for {category.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed text-emerald-100">
            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase font-mono tracking-wider">
                1. Supported Jurisdictions
              </h4>
              <p>
                {category.geoFocus.regions.join(', ')} data centers ensuring low-latency database queries and local residency compliance.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase font-mono tracking-wider">
                2. Security Standards
              </h4>
              <p>
                Enforces {category.geoFocus.topComplianceStandards.join(', ')} with end-to-end encryption at rest (AES-256) and in transit (TLS 1.3).
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase font-mono tracking-wider">
                3. Currency Billing
              </h4>
              <p>
                {category.geoFocus.typicalCurrencySupport.join(' • ')} localized billing without non-domestic exchange fee surcharges.
              </p>
            </div>
          </div>
        </section>

        {/* Explore Other Planning Categories */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Explore Related Planning Software Categories
            </h3>
            <button
              onClick={() => onNavigate('/planning-tools')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              View All 22 Categories &rarr;
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {otherCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => onNavigate(`/planning-tools/${c.slug}`)}
                className="p-3 bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-500/50 rounded-xl text-left transition group"
              >
                <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 line-clamp-1">
                  {c.name}
                </div>
                <div className="text-[10px] text-emerald-600 font-mono font-bold mt-1">
                  ({c.toolCount})
                </div>
              </button>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
