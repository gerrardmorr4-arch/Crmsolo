import React, { useState, useMemo } from 'react';
import { CRMReview } from '../types';
import { DirectoryFilterSidebar, FilterState } from '../components/DirectoryFilterSidebar';
import { DirectoryProductCard } from '../components/DirectoryProductCard';
import { CompareDrawer } from '../components/CompareDrawer';
import NavLink from '../components/NavLink';
import { useSEO } from '../lib/seo';
import { 
  Building2, 
  Search, 
  ArrowUpDown, 
  Sparkles, 
  CheckCircle2, 
  BookOpen, 
  HelpCircle, 
  ChevronRight, 
  Layers, 
  SlidersHorizontal,
  ShieldCheck,
  Award,
  Calculator
} from 'lucide-react';

interface DirectoryPageProps {
  reviews: CRMReview[];
  onNavigateToReview: (slug: string) => void;
  onNavigateToGuide: (slug: string) => void;
  onNavigateToComparisons: () => void;
  onNavigate: (path: string) => void;
  /**
   * Snippet override for non-pillar routes that reuse this component (the
   * /reviews hub). Defaults to the solo-agent buyer-intent pillar copy.
   */
  seoTitle?: string;
  seoDescription?: string;
}

export const Directory: React.FC<DirectoryPageProps> = ({
  reviews,
  onNavigateToReview,
  onNavigateToGuide,
  onNavigateToComparisons,
  onNavigate,
  seoTitle,
  seoDescription
}) => {
  // Page-level metadata. This overrides the app-shell route fallback so the
  // pillar's snippet stays buyer-intent even if the fallback map changes.
  useSEO({
    title: seoTitle ?? 'Best CRM for Solo Real Estate Agents (2026 Picks)',
    description:
      seoDescription ??
      'Compare the best real estate CRM for a single agent. One-seat pricing, zero tech setup, no admin team needed. See 2026 picks and choose yours today.',
    keywords: [
      'best real estate crm for single agent',
      'best crm for solo real estate agent',
      'visual transaction pipeline for independent brokers',
      'crm without admin team',
      'one seat crm pricing',
      'independent broker crm comparison'
    ],
    ogType: 'website'
  }, [seoTitle, seoDescription]);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    pricingModel: 'all',
    maxStartingPrice: 300,
    minRating: 0,
    selectedFeatures: [],
    selectedDeployments: [],
    selectedAgents: [],
    searchQuery: ''
  });

  // Sort state
  const [sortBy, setSortBy] = useState<'score' | 'price-asc' | 'name'>('score');

  // Compare tray state
  const [selectedForCompare, setSelectedForCompare] = useState<CRMReview[]>([]);

  // Extract all unique features across all reviews
  const availableFeatures = useMemo(() => {
    const featSet = new Set<string>();
    reviews.forEach((r) => {
      if (r.featuresList) {
        r.featuresList.forEach((f) => featSet.add(f));
      }
      if (r.pricingTiers) {
        r.pricingTiers.forEach((t) => {
          t.features.forEach((f) => featSet.add(f));
        });
      }
    });
    return Array.from(featSet);
  }, [reviews]);

  // Filtered and Sorted products
  const filteredReviews = useMemo(() => {
    return reviews.filter((crm) => {
      // Search Query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = crm.name.toLowerCase().includes(query);
        const matchesPitch = crm.oneLinePitch.toLowerCase().includes(query);
        const matchesBestFor = crm.bestFor.toLowerCase().includes(query);
        if (!matchesName && !matchesPitch && !matchesBestFor) return false;
      }

      // Pricing Model
      if (filters.pricingModel !== 'all') {
        if (filters.pricingModel === 'free-tier') {
          const hasFree = crm.startingPrice === 0 || crm.pricingTiers.some((t) => t.price === 0);
          if (!hasFree) return false;
        } else if (filters.pricingModel === 'free-trial') {
          if (!crm.freeTrialDays || crm.freeTrialDays <= 0) return false;
        } else if (filters.pricingModel === 'paid-subscription') {
          if (crm.startingPrice === 0 && !crm.pricingTiers.some((t) => t.price > 0)) return false;
        }
      }

      // Max Starting Price
      const startPrice = crm.startingPrice ?? crm.pricingTiers[0]?.price ?? 0;
      if (startPrice > filters.maxStartingPrice) {
        return false;
      }

      // Minimum Rating
      if (crm.overallScore < filters.minRating) {
        return false;
      }

      // Features Match (must contain all selected features)
      if (filters.selectedFeatures.length > 0) {
        const allCrmFeatures = [
          ...(crm.featuresList || []),
          ...crm.pricingTiers.flatMap((t) => t.features)
        ];
        const hasAll = filters.selectedFeatures.every((reqFeat) =>
          allCrmFeatures.some((f) => f.toLowerCase().includes(reqFeat.toLowerCase()))
        );
        if (!hasAll) return false;
      }

      // Deployments Match
      if (filters.selectedDeployments.length > 0) {
        const crmDeps = crm.deployments || ['Web / Cloud', 'iOS App', 'Android App'];
        const hasDep = filters.selectedDeployments.some((reqDep) =>
          crmDeps.includes(reqDep)
        );
        if (!hasDep) return false;
      }

      // Target Agents Match
      if (filters.selectedAgents.length > 0) {
        const crmAgents = crm.targetAgents || ['Solo Agent'];
        const hasAgent = filters.selectedAgents.some((reqAgent) =>
          crmAgents.includes(reqAgent)
        );
        if (!hasAgent) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'score') return b.overallScore - a.overallScore;
      if (sortBy === 'price-asc') {
        const priceA = a.startingPrice ?? a.pricingTiers[0]?.price ?? 0;
        const priceB = b.startingPrice ?? b.pricingTiers[0]?.price ?? 0;
        return priceA - priceB;
      }
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [reviews, filters, sortBy]);

  // Toggle Compare Handler
  const handleToggleCompare = (crm: CRMReview) => {
    setSelectedForCompare((prev) => {
      const exists = prev.some((p) => p.id === crm.id);
      if (exists) {
        return prev.filter((p) => p.id !== crm.id);
      } else {
        if (prev.length >= 4) {
          alert('You can compare up to 4 CRM products simultaneously.');
          return prev;
        }
        return [...prev, crm];
      }
    });
  };

  const handleResetFilters = () => {
    setFilters({
      pricingModel: 'all',
      maxStartingPrice: 300,
      minRating: 0,
      selectedFeatures: [],
      selectedDeployments: [],
      selectedAgents: [],
      searchQuery: ''
    });
  };

  return (
    <div className="min-vh-100 bg-slate-50/50 pb-20">
      {/* Category Hero Header (GetApp style) */}
      <section 
        id="directory-category-hero"
        className="bg-white border-b border-slate-200 py-8 sm:py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4">
            <span className="hover:text-slate-800 cursor-pointer">Home</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="hover:text-slate-800 cursor-pointer">Customer Management</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-slate-900">Real Estate CRM Software</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                <span>2026 Solo Agent Buyer Evaluations • No Admin Team Required</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Best CRM for Solo Real Estate Agents: The 2026 Buyer Comparison
              </h1>

              <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                A Visual Transaction Pipeline Built for Independent Brokers and Single Agents
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                If you are a solo real estate agent, an independent broker, or a listing specialist with no administrative or IT team, this is the best real estate CRM for a single agent: a shortlist you can set up in one weekend and run from your phone. We ranked every one-seat platform on three buyer questions — one-seat monthly cost, speed-to-lead on a live inquiry, and whether a visual transaction pipeline actually moves a deal forward between showings. No enterprise bloat, no admin to configure it, no IT team to migrate your database. Here is the best CRM for a solo real estate agent in 2026.
              </p>

              {/* Trust & Methodology Badges */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{reviews.length} Evaluated Products</span>
                </span>
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Scored for Single-Seat Use</span>
                </span>
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>One-Seat Monthly Cost</span>
                </span>
              </div>
            </div>

            {/* Quick Buyer's Guide Callout Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md max-w-sm lg:w-80 shrink-0 border border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                <BookOpen className="w-4 h-4" />
                <span>Buyer's Resource</span>
              </div>
              <h2 className="text-base font-bold mb-1.5">Never Set Up a CRM Before?</h2>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                Read our in-depth 2026 Buyer's Guide to understand what to expect at one seat, how pricing structures differ, and the speed-to-lead benchmarks that matter.
              </p>
              <button
                id="hero-read-buyers-guide-cta"
                onClick={() => onNavigateToGuide('ultimate-real-estate-crm-buyers-guide-2026')}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
              >
                <span>Read Full Buyer's Guide</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Directory Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Search & Sort Controls Bar */}
        <div 
          id="directory-controls-bar"
          className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="directory-search-input"
              type="text"
              placeholder="Search software by name, feature, or keyword..."
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>

          {/* Sort Selector & Results Count */}
          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
              Showing <span className="font-bold text-slate-900">{filteredReviews.length}</span> of {reviews.length} CRMs
            </span>

            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <label htmlFor="sort-by-select" className="text-xs text-slate-500 font-medium">Sort by:</label>
              <select
                id="sort-by-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="score">Highest Overall Score</option>
                <option value="price-asc">Lowest Starting Price</option>
                <option value="name">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2-Column Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Faceted Filter Sidebar */}
          <div className="lg:col-span-4 sticky top-20">
            <DirectoryFilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              onReset={handleResetFilters}
              availableFeatures={availableFeatures}
              totalResultsCount={filteredReviews.length}
            />

            {/* Side-by-Side Comparison Hub Callout */}
            <div className="mt-6 bg-emerald-950 text-white rounded-2xl p-5 border border-emerald-900 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Head-to-Head Hub</span>
              </div>
              <h4 className="font-bold text-sm mb-1">Pre-Built CRM Comparisons</h4>
              <p className="text-xs text-emerald-200/80 mb-3">
                See detailed breakdowns comparing Pipedrive, Streak, Follow Up Boss, Copper, and Wise Agent.
              </p>
              <button
                id="sidebar-view-all-comparisons"
                onClick={onNavigateToComparisons}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2 rounded-xl text-xs transition"
              >
                View Comparison Hub
              </button>
            </div>
          </div>

          {/* Right Column: Product Cards List */}
          <div className="lg:col-span-8 space-y-5">
            {filteredReviews.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl font-bold">
                  ?
                </div>
                <h4 className="text-lg font-bold text-slate-900">No CRM software matches your filters</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try clearing some of your feature criteria, adjusting the starting price slider, or searching for a different keyword.
                </p>
                <button
                  id="empty-state-reset-filters"
                  onClick={handleResetFilters}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl text-xs transition"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              filteredReviews.map((review, idx) => (
                <DirectoryProductCard
                  key={review.id}
                  review={review}
                  rankIndex={idx}
                  isSelectedForCompare={selectedForCompare.some((p) => p.id === review.id)}
                  onToggleCompare={handleToggleCompare}
                  onNavigateToReview={onNavigateToReview}
                />
              ))
            )}

            {/* Page-1 keyword block: buyer-intent questions this page answers */}
            <section
              id="directory-buyer-keywords"
              className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 sm:p-8 mt-12 space-y-6"
            >
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>What Solo Agents Ask Before Buying</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold">
                  How to Choose a Real Estate CRM for a Single Agent
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-emerald-300">
                    Best real estate CRM for a single agent without an admin team
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    You have no operations manager, so setup has to be near zero. We score each platform on how quickly one person can import a sphere, publish a pipeline, and send a first follow-up — with no consultant and no IT ticket.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-emerald-300">
                    Visual transaction pipeline for independent brokers
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    A drag-and-drop board from lead to closing beats a spreadsheet. Every listing or buyer deal moves one stage at a time, and stalled cards are obvious at a glance, even from your phone between showings.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-emerald-300">
                    One-seat CRM pricing and free tiers that stay free
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Solo agents pay per seat, not per enterprise licence. We list the real one-seat monthly price and flag which free plans quietly cap contacts or automation once your database grows.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-emerald-300">
                    Speed-to-lead automation for a solo listing specialist
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    With no team to pick up the phone, an instant auto-response is your only safety net. We compare the built-in text and email triggers each CRM fires the moment a new portal inquiry lands.
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-5">
                Not sure which tier pays for itself? Run the numbers with our{' '}
                <NavLink
                  to="/calculator"
                  onNavigate={onNavigate}
                  className="inline-flex items-center gap-1 font-semibold text-emerald-400 underline hover:text-emerald-300"
                >
                  <Calculator className="w-3.5 h-3.5" /> CRM ROI calculator for solo agents
                </NavLink>{' '}
                before you buy.
              </p>
            </section>

            {/* In-Directory SEO FAQ & Buyer Guide Section (GetApp style) */}
            <section 
              id="directory-category-faq"
              className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mt-12 space-y-6"
            >
              <div className="border-b border-slate-100 pb-4">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                  <HelpCircle className="w-4 h-4" />
                  <span>Frequently Asked Questions</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Real Estate CRM Pricing &amp; Buyer's FAQ for Solo Agents
                </h3>
              </div>

              <div className="space-y-4 text-sm text-slate-700">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="font-bold text-slate-900 mb-1">
                    What is the best CRM software for a brand new solo real estate agent?
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    For brand new agents with minimal initial budget, <strong>Streak CRM</strong> (free tier inside Gmail) or <strong>EngageBay</strong> provide immediate contact organization with zero overhead. Once closing 2-3 transactions per quarter, upgrading to <strong>Pipedrive ($14/mo)</strong> provides visual Kanban pipeline tracking that prevents client drop-off.
                  </p>
                </div>

                <div className="border-b border-slate-100 pb-3">
                  <h4 className="font-bold text-slate-900 mb-1">
                    What is the difference between a general CRM and a real estate CRM?
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    General CRMs (like Salesforce or standard HubSpot) use enterprise sales terms like "Accounts" and "Opportunities." Real estate CRMs (like Follow Up Boss, Wise Agent, and Real Geeks) come pre-built with listing reference numbers, closing condition timelines, buyer property preferences, and automated speed-to-lead text drips from portals like the major portals.
                  </p>
                </div>

                <div className="border-b border-slate-100 pb-3">
                  <h4 className="font-bold text-slate-900 mb-1">
                    How much does real estate CRM software typically cost?
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Solo agent pricing ranges from <strong>$0/month</strong> (Streak free tier, HubSpot free tools) to <strong>$14–$49/month</strong> for top visual pipelines (Pipedrive, Wise Agent, Copper). High-volume lead conversion engines with built-in dialers (Follow Up Boss) cost <strong>$69–$119/month</strong>, while full IDX home search website bundles (Real Geeks) cost <strong>$299/month</strong>.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 mb-1">
                    Can I export my contact database if I decide to switch CRMs later?
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Yes. All 10 platforms evaluated in our directory provide standard 1-click CSV contact and deal exports, ensuring you retain 100% ownership over your client relationship database.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Floating Side-by-Side Comparison Dock */}
      <CompareDrawer
        selectedCrms={selectedForCompare}
        onRemove={(id) => setSelectedForCompare((prev) => prev.filter((p) => p.id !== id))}
        onClear={() => setSelectedForCompare([])}
        onNavigateToReview={onNavigateToReview}
      />
    </div>
  );
};
