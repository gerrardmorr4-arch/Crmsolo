import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, Award, BookOpen, FileText, Layers, ChevronRight, CornerDownLeft, Sparkles } from 'lucide-react';
import { getReviews, getComparisons, getGuides, getBlogPosts } from '../lib/storage';
import { performFuzzySearch, SearchResultItem } from '../lib/fuzzySearch';

interface NavSearchBarProps {
  onNavigate: (path: string) => void;
  className?: string;
}

export default function NavSearchBar({ onNavigate, className = '' }: NavSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'review' | 'guide' | 'blog' | 'comparison'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Suggested popular searches for quick single-click queries
  const popularSearches = [
    'Pipedrive',
    'Follow Up Boss',
    'Streak',
    'SEO Guide',
    'Escrow Contingency',
    'Speed to Lead',
    'Open House'
  ];

  // Global hotkey: Ctrl+K or Cmd+K to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Retrieve storage data
  const reviews = useMemo(() => getReviews(), []);
  const comparisons = useMemo(() => getComparisons(), []);
  const guides = useMemo(() => getGuides(), []);
  const blogPosts = useMemo(() => getBlogPosts(), []);

  // Perform fuzzy search
  const allResults = useMemo(() => {
    return performFuzzySearch(searchQuery, reviews, comparisons, guides, blogPosts);
  }, [searchQuery, reviews, comparisons, guides, blogPosts]);

  // Filter results by active tab
  const filteredResults = useMemo(() => {
    if (activeFilter === 'all') return allResults;
    return allResults.filter((r) => r.type === activeFilter);
  }, [allResults, activeFilter]);

  // Reset selectedIndex when results or filter change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults, activeFilter]);

  // Keyboard navigation within search results
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isSearchOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (filteredResults.length > 0 ? (prev + 1) % filteredResults.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (filteredResults.length > 0 ? (prev - 1 + filteredResults.length) % filteredResults.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults.length > 0 && filteredResults[selectedIndex]) {
        const target = filteredResults[selectedIndex];
        onNavigate(target.path);
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    }
  };

  // Helper to highlight matching terms
  const renderHighlightedText = (text: string, query: string) => {
    if (!query.trim() || !text) return text;
    const tokens = query.trim().split(/\s+/).filter(Boolean);
    const pattern = new RegExp(`(${tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');

    const parts = text.split(pattern);
    return (
      <span>
        {parts.map((part, i) =>
          pattern.test(part) ? (
            <mark key={i} className="bg-amber-200/90 text-slate-950 font-bold px-0.5 rounded-xs">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  // Counts by type for tab badges
  const counts = useMemo(() => {
    return {
      all: allResults.length,
      review: allResults.filter((r) => r.type === 'review').length,
      guide: allResults.filter((r) => r.type === 'guide').length,
      blog: allResults.filter((r) => r.type === 'blog').length,
      comparison: allResults.filter((r) => r.type === 'comparison').length,
    };
  }, [allResults]);

  return (
    <div ref={containerRef} className={`relative flex-1 max-w-xs md:max-w-md ${className}`}>
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsSearchOpen(true);
          }}
          onFocus={() => setIsSearchOpen(true)}
          onKeyDown={handleInputKeyDown}
          placeholder="Fuzzy search titles, guides, posts..."
          className="w-full bg-gray-50 border border-gray-200 focus:border-accent focus:bg-white text-xs font-medium text-primary placeholder-gray-400 pl-9 pr-14 py-2 rounded-full transition outline-none shadow-2xs"
        />
        {searchQuery ? (
          <button
            onClick={() => {
              setSearchQuery('');
              setIsSearchOpen(false);
            }}
            className="absolute right-3 text-gray-400 hover:text-primary p-0.5 rounded-full cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <kbd className="hidden sm:inline-flex items-center gap-0.5 absolute right-3 text-[10px] font-mono text-gray-400 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded pointer-events-none">
            ⌘K
          </kbd>
        )}
      </div>

      {/* Popover Dropdown Panel */}
      {isSearchOpen && (
        <div className="absolute left-0 right-0 sm:left-auto sm:right-0 top-full mt-2 w-[340px] sm:w-[480px] md:w-[540px] bg-white rounded-2xl border border-gray-200 shadow-2xl z-50 overflow-hidden max-h-[80vh] flex flex-col animate-in fade-in slide-in-from-top-2 duration-150">
          
          {/* Header & Filter Tabs */}
          {searchQuery.trim().length > 0 ? (
            <div className="p-3 bg-slate-900 text-white border-b border-slate-800 space-y-2 shrink-0">
              <div className="flex items-center justify-between text-xs text-gray-300 font-mono">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  Fuzzy Results for <strong className="text-white font-bold">"{searchQuery}"</strong>
                </span>
                <span className="bg-accent text-slate-950 font-black px-2 py-0.5 rounded-full text-[10px]">
                  {allResults.length} found
                </span>
              </div>

              {/* Filter Tabs */}
              {allResults.length > 0 && (
                <div className="flex items-center gap-1 overflow-x-auto pt-1 no-scrollbar">
                  <button
                    onClick={() => setActiveFilter('all')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition whitespace-nowrap cursor-pointer ${
                      activeFilter === 'all'
                        ? 'bg-accent text-slate-950 shadow-xs'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    All ({counts.all})
                  </button>
                  <button
                    onClick={() => setActiveFilter('review')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition whitespace-nowrap cursor-pointer ${
                      activeFilter === 'review'
                        ? 'bg-accent text-slate-950 shadow-xs'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Reviews ({counts.review})
                  </button>
                  <button
                    onClick={() => setActiveFilter('guide')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition whitespace-nowrap cursor-pointer ${
                      activeFilter === 'guide'
                        ? 'bg-accent text-slate-950 shadow-xs'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Guides ({counts.guide})
                  </button>
                  <button
                    onClick={() => setActiveFilter('blog')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition whitespace-nowrap cursor-pointer ${
                      activeFilter === 'blog'
                        ? 'bg-accent text-slate-950 shadow-xs'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Blog ({counts.blog})
                  </button>
                  <button
                    onClick={() => setActiveFilter('comparison')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition whitespace-nowrap cursor-pointer ${
                      activeFilter === 'comparison'
                        ? 'bg-accent text-slate-950 shadow-xs'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Versus ({counts.comparison})
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500 font-mono shrink-0">
              <span className="flex items-center gap-1.5 font-bold text-primary">
                <Search className="w-3.5 h-3.5 text-accent" /> Title & Article Fuzzy Search
              </span>
              <span className="text-[10px] text-gray-400">Type to search 35+ articles</span>
            </div>
          )}

          {/* Results List or Empty State */}
          <div className="overflow-y-auto p-2 space-y-1.5 flex-1">
            {searchQuery.trim().length === 0 ? (
              /* Popular search suggestions when input is empty */
              <div className="p-3 space-y-3">
                <div className="text-[11px] font-mono text-gray-400 font-bold uppercase tracking-wider">
                  Popular Topics & Queries
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        setIsSearchOpen(true);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-accent/20 hover:text-primary text-gray-700 font-semibold text-xs rounded-lg transition border border-gray-200/80 cursor-pointer"
                    >
                      <Search className="w-3 h-3 text-gray-400" />
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            ) : filteredResults.length === 0 ? (
              /* No results state */
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                  <Search className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-primary">No matching titles or articles found</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Try searching for CRM names like "Pipedrive", keywords like "SEO" or "Escrow", or browse popular guides.
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap justify-center gap-1.5">
                  {popularSearches.slice(0, 4).map((term) => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-primary hover:text-white text-gray-600 font-mono text-[11px] rounded-md transition cursor-pointer"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Render Filtered Results */
              filteredResults.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                let Icon = BookOpen;
                if (item.type === 'review') Icon = Award;
                else if (item.type === 'blog') Icon = FileText;
                else if (item.type === 'comparison') Icon = Layers;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.path);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full text-left p-3 rounded-xl transition flex items-start justify-between group cursor-pointer border ${
                      isSelected
                        ? 'bg-primary/5 border-primary/20 shadow-2xs'
                        : 'bg-white border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="space-y-1 flex-1 pr-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                          <Icon className="w-3 h-3 text-accent" />
                          {item.typeLabel}
                        </span>

                        {item.badge && (
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        )}

                        {item.category && (
                          <span className="text-[10px] font-mono text-gray-400">
                            • {item.category}
                          </span>
                        )}
                      </div>

                      {/* Title with query highlight */}
                      <div className="font-bold text-xs text-primary group-hover:text-accent transition leading-snug">
                        {renderHighlightedText(item.title, searchQuery)}
                      </div>

                      {/* Subtitle / Excerpt */}
                      <p className="text-[11px] text-gray-500 line-clamp-1 leading-relaxed">
                        {renderHighlightedText(item.subtitle, searchQuery)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 pt-1">
                      {isSelected && (
                        <CornerDownLeft className="w-3.5 h-3.5 text-accent animate-pulse" />
                      )}
                      <ChevronRight className={`w-4 h-4 transition ${isSelected ? 'text-accent translate-x-0.5' : 'text-gray-300'}`} />
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer instruction */}
          {filteredResults.length > 0 && (
            <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-mono shrink-0">
              <span className="flex items-center gap-2">
                <span><kbd className="px-1 py-0.5 bg-white border rounded">↑</kbd> <kbd className="px-1 py-0.5 bg-white border rounded">↓</kbd> navigate</span>
                <span><kbd className="px-1 py-0.5 bg-white border rounded">↵</kbd> select</span>
              </span>
              <span>Showing {filteredResults.length} matches</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
