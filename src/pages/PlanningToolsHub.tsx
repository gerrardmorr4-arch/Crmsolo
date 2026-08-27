import React, { useState, useMemo } from 'react';
import { PLANNING_CATEGORIES, getTotalPlanningToolsCount } from '../data/planningToolsData';
import { useSEO } from '../lib/seo';
import { 
  CheckCircle2, 
  Layers, 
  Search, 
  ArrowRight, 
  Globe2, 
  ShieldCheck, 
  Sparkles, 
  Star, 
  Clock, 
  SlidersHorizontal,
  ChevronRight,
  BarChart3,
  Calendar,
  DollarSign,
  TrendingUp,
  Award
} from 'lucide-react';

interface PlanningToolsHubProps {
  onNavigate: (path: string) => void;
}

export const PlanningToolsHub: React.FC<PlanningToolsHubProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const totalTools = useMemo(() => getTotalPlanningToolsCount(), []);

  // SEO & GEO Optimization
  useSEO({
    title: `Best Planning Tools & Project Management Software Directory (${totalTools.toLocaleString()} Tools Indexed)`,
    description: `Explore 22 verified planning tool categories including Project Management (899), Time Tracking (754), Agile (193), and Gantt Charts (147). Global GEO compliance (US, UK, EU, CA, AU) and expert software ratings.`,
    keywords: [
      'planning tools',
      'project management software',
      'agile tools',
      'gantt chart software',
      'time tracking tools',
      'kanban boards',
      'job costing software',
      'ppm software',
      'task management'
    ],
    ogType: 'website'
  }, []);

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return PLANNING_CATEGORIES.filter((cat) => {
      // Search filter
      const matchesSearch = 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.topTools.some(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // Group tag filter
      if (selectedTag === 'all') return true;
      if (selectedTag === 'agile' && (cat.id.includes('agile') || cat.id === 'scrum' || cat.id === 'kanban-tools')) return true;
      if (selectedTag === 'scheduling' && (cat.id.includes('gantt') || cat.id.includes('scheduling') || cat.id.includes('planning') || cat.id === 'flowchart')) return true;
      if (selectedTag === 'financial' && (cat.id.includes('costing') || cat.id.includes('expenses') || cat.id.includes('professional-services'))) return true;
      if (selectedTag === 'time' && (cat.id.includes('time') || cat.id === 'task-management')) return true;
      if (selectedTag === 'product' && (cat.id.includes('product') || cat.id === 'pim' || cat.id === 'requirements-management')) return true;
      if (selectedTag === 'enterprise' && (cat.id.includes('portfolio') || cat.id === 'strategic-planning' || cat.id === 'it-project-management' || cat.id === 'project-management')) return true;

      return true;
    });
  }, [searchQuery, selectedTag]);

  // Schema.org Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': 'Directory of Top Planning Tools and Project Management Software',
    'description': `Comprehensive index and review benchmark of ${totalTools.toLocaleString()} planning software solutions across 22 specialized categories.`,
    'numberOfItems': PLANNING_CATEGORIES.length,
    'itemListElement': PLANNING_CATEGORIES.map((cat, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': `${cat.name} (${cat.toolCount})`,
      'url': `https://crmsolo.online/planning-tools/${cat.slug}`,
      'description': cat.tagline
    }))
  };

  return (
    <div id="planning-tools-hub" className="min-h-screen bg-slate-50">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>2026 Global Software Index • {totalTools.toLocaleString()} Tools Evaluated</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
            Planning Tools & Project Management Directory
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl leading-relaxed mb-8">
            Expert benchmarks, verified buyer reviews, and regional GEO compliance audits across all <strong>22 specialized planning software categories</strong>.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl pt-2 pb-6">
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">22</div>
              <div className="text-xs text-slate-300 mt-1">Specialized Categories</div>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4">
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400">{totalTools.toLocaleString()}</div>
              <div className="text-xs text-slate-300 mt-1">Verified Software Tools</div>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">100%</div>
              <div className="text-xs text-slate-300 mt-1">Unbiased Methodologies</div>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4">
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-400">5+</div>
              <div className="text-xs text-slate-300 mt-1">Global GEO Jurisdictions</div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mt-4">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search className="h-5 w-5" />
            </div>
            <input
              id="planning-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by category name, methodology, or tool (e.g. Agile, Gantt, Toggl, ClickUp)..."
              className="w-full pl-11 pr-4 py-3.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-sm shadow-inner"
            />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-thin">
          <button
            id="filter-tag-all"
            onClick={() => setSelectedTag('all')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
              selectedTag === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            All 22 Categories ({totalTools.toLocaleString()})
          </button>
          <button
            id="filter-tag-agile"
            onClick={() => setSelectedTag('agile')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
              selectedTag === 'agile'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Agile, Scrum & Kanban (404)
          </button>
          <button
            id="filter-tag-scheduling"
            onClick={() => setSelectedTag('scheduling')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
              selectedTag === 'scheduling'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Scheduling & Gantt (660)
          </button>
          <button
            id="filter-tag-time"
            onClick={() => setSelectedTag('time')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
              selectedTag === 'time'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Time & Tasks (1,784)
          </button>
          <button
            id="filter-tag-financial"
            onClick={() => setSelectedTag('financial')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
              selectedTag === 'financial'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Costing & PSA (769)
          </button>
          <button
            id="filter-tag-product"
            onClick={() => setSelectedTag('product')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
              selectedTag === 'product'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Product & Roadmaps (453)
          </button>
          <button
            id="filter-tag-enterprise"
            onClick={() => setSelectedTag('enterprise')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
              selectedTag === 'enterprise'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Enterprise & PPM (1,597)
          </button>
        </div>

        {/* Global GEO Banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-sm">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-emerald-950">
                Multi-Region GEO & Data Residency Benchmarking (US, UK, EU, CA, AU)
              </h2>
              <p className="text-xs text-emerald-800 mt-0.5 max-w-2xl">
                Every software category includes verified assessments for SOC 2 Type II, EU/UK GDPR sovereignty, Australian Privacy Principles, and local currency billing ($ USD, £ GBP, € EUR, A$ AUD).
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-white/80 px-3 py-1.5 rounded-lg border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Audited & Updated for 2026</span>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              id={`card-${category.id}`}
              onClick={() => onNavigate(`/planning-tools/${category.slug}`)}
              className="group bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-emerald-500/60 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Header with Title and Exact Bracket Number */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {category.name}{' '}
                    <span className="inline-block px-2.5 py-0.5 ml-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      ({category.toolCount})
                    </span>
                  </h3>
                </div>

                {/* Tagline */}
                <p className="text-xs font-medium text-emerald-700 mb-3 line-clamp-1">
                  {category.tagline}
                </p>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-5">
                  {category.description}
                </p>

                {/* Top Featured Tools Preview */}
                <div className="mb-4 pt-3 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Top Evaluated Software:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {category.topTools.map((tool, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-xs font-semibold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md border border-slate-200"
                      >
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        {tool.name.split(' ')[0]} ({tool.rating})
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <Globe2 className="w-3.5 h-3.5 text-slate-400" />
                  {category.geoFocus.regions[0].split('(')[0]}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
                  Explore {category.toolCount} Tools
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
            <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-base font-bold text-slate-800 mb-1">No matching categories found</h3>
            <p className="text-xs text-slate-500 mb-4">Try adjusting your search query or selecting "All 22 Categories".</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedTag('all'); }}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Global SEO / GEO Methodology Section */}
        <section className="mt-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="max-w-4xl">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
              Our 2026 Planning & Project Management Evaluation Methodology
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Our technical review board benchmarks all <strong>{totalTools.toLocaleString()} planning software platforms</strong> through objective, multi-factor testing. We measure core execution capabilities (Gantt calculation speed, WIP limit enforcement, sprint burndown accuracy) alongside regional regulatory compliance across the United States, Canada, the United Kingdom, the European Union, and Australia.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  1. Execution Precision
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We audit real-world calculation accuracy for Critical Path Method (CPM), Earned Value Management (EVM), and finite machine scheduling.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-cyan-600" />
                  2. Regional GEO Compliance
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every category reviews data residency options, GDPR/UK DPA sovereignty, and multi-currency billing in USD, EUR, GBP, CAD, and AUD.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  3. Total Cost & Lock-in
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We analyze hidden per-seat licensing tiers, guest account policies, and data export portability so buyers avoid vendor lock-in.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
