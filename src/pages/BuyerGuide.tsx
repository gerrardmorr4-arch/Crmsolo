import React, { useState } from 'react';
import { CRMGuide } from '../types';
import { 
  BookOpen, 
  Search, 
  Clock, 
  User, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  HelpCircle, 
  ChevronRight,
  Filter
} from 'lucide-react';

interface BuyerGuidePageProps {
  guides: CRMGuide[];
  onSelectGuide: (slug: string) => void;
  onNavigateToDirectory: () => void;
}

export const BuyerGuide: React.FC<BuyerGuidePageProps> = ({
  guides,
  onSelectGuide,
  onNavigateToDirectory
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Buyer\'s Guide', 'Pricing & ROI', 'CRM Selection', 'Lead Generation', 'Pipeline Management', 'Workbooks', 'New Agents'];

  const filteredGuides = guides.filter((guide) => {
    if (selectedCategory !== 'All' && guide.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = guide.title.toLowerCase().includes(q);
      const matchExcerpt = guide.excerpt.toLowerCase().includes(q);
      const matchContent = guide.content.toLowerCase().includes(q);
      return matchTitle || matchExcerpt || matchContent;
    }
    return true;
  });

  return (
    <div className="min-vh-100 bg-slate-50/50 pb-20">
      {/* Header */}
      <section 
        id="buyers-guide-hero"
        className="bg-white border-b border-slate-200 py-10 sm:py-14"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4">
            <span className="hover:text-slate-800 cursor-pointer">Home</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-slate-900">CRM Buyer's Guides & Frameworks</span>
          </nav>

          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>Real Estate Software Knowledge Base</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Real Estate CRM Buyer's Guides & Decision Frameworks
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Step-by-step procurement checklists, speed-to-lead automation blueprints, pricing audits, and migration roadmaps for independent real estate practitioners.
            </p>
          </div>
        </div>
      </section>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Featured Ultimate Guide Banner */}
        {selectedCategory === 'All' && !searchQuery && (
          <div 
            id="featured-ultimate-guide-banner"
            className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 mb-10 shadow-lg border border-slate-800 cursor-pointer hover:border-emerald-500/50 transition duration-300"
            onClick={() => onSelectGuide('ultimate-real-estate-crm-buyers-guide-2026')}
          >
            <div className="max-w-3xl space-y-4">
              <span className="inline-block px-3 py-1 bg-emerald-500 text-slate-950 font-bold text-xs rounded-full">
                Featured 2026 Master Guide
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                The Ultimate Real Estate CRM Buyer's Guide (2026 Edition)
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Discover the 5 pillars of real estate software evaluation, pricing models, deployment options, and speed-to-lead benchmarks to choose the exact right platform for your business.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Eugene Boniface (Chief Analyst)</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>12 min read</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <article
              key={guide.id}
              id={`guide-card-${guide.id}`}
              onClick={() => onSelectGuide(guide.slug)}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-emerald-500/50 transition-all duration-200 cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    {guide.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{guide.readTime}</span>
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition">
                  {guide.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {guide.excerpt}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">By {guide.author}</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1 group-hover:translate-x-0.5 transition">
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Directory CTA */}
        <div className="mt-16 bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900">
            Ready to evaluate CRM tools with live pricing and filters?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Browse our complete 2026 directory with side-by-side comparison tables, verified user reviews, and instant feature search.
          </p>
          <button
            id="guide-hub-open-directory-cta"
            onClick={onNavigateToDirectory}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs sm:text-sm shadow-md transition"
          >
            Explore 2026 CRM Directory
          </button>
        </div>
      </div>
    </div>
  );
};
