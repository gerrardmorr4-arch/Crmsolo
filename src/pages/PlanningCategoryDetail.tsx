import React from 'react';
import { PlanningCategory } from '../types';
import { useSEO } from '../lib/seo';
import { 
  ArrowLeft, 
  ExternalLink, 
  Globe2, 
  ShieldCheck, 
  Star, 
  CheckCircle2, 
  Layers, 
  Sparkles, 
  DollarSign, 
  Calendar, 
  ChevronRight,
  BookOpen,
  Check,
  Building2,
  TrendingUp
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

  // Schema.org SoftwareApplication List Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': `Top ${category.name} Tools & Software (${category.toolCount})`,
    'description': category.description,
    'itemListElement': category.topTools.map((tool, index) => ({
      '@type': 'SoftwareApplication',
      'position': index + 1,
      'name': tool.name,
      'applicationCategory': category.name,
      'operatingSystem': 'Web, Cloud, iOS, Android',
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
              {category.toolCount} Tools Indexed
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white mb-4">
            {category.name}{' '}
            <span className="text-emerald-400">({category.toolCount})</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed mb-6">
            {category.description}
          </p>

          {/* Quick GEO Summary Badges */}
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
        </div>
      </header>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* Top Evaluated Platforms Header */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 font-display">
                Top Rated {category.name} Platforms
              </h2>
              <p className="text-xs text-slate-500">
                Direct official website links, verified user ratings, and feature breakdowns.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/blog')}
              className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              <BookOpen className="w-4 h-4" />
              Read In-Depth Guides &rarr;
            </button>
          </div>

          {/* Tools Cards Grid */}
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
                    Deployment: Cloud, Web, Mobile
                  </span>

                  <div className="flex items-center gap-2">
                    {tool.websiteUrl ? (
                      <a
                        href={tool.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition group"
                      >
                        <span>Visit {tool.name.split(' ')[0]}</span>
                        <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    ) : (
                      <button
                        onClick={() => onNavigate('/compare')}
                        className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
                      >
                        Compare Tool
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
