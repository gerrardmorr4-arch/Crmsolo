import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, HelpCircle, ChevronDown, Sparkles, Filter, Maximize2, Minimize2 } from 'lucide-react';
import faqData from '../data/faqs.json';
import Markdown from './Markdown';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function FAQSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  // Store expanded FAQ IDs in a set to support multiple/single expanded items or Expand All
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(['why-solo-agents-need-different-crm']) // Default open first item
  );

  // Extract all unique categories
  const categories = useMemo(() => {
    const list = new Set<string>();
    faqData.forEach((item: FAQItem) => {
      if (item.category) list.add(item.category);
    });
    return ['All', ...Array.from(list)];
  }, []);

  // Filter FAQs based on search query and category
  const filteredFAQs = useMemo(() => {
    return (faqData as FAQItem[]).filter((faq) => {
      const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
      const matchesSearch = 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const isAllExpanded = useMemo(() => {
    if (filteredFAQs.length === 0) return false;
    return filteredFAQs.every(faq => expandedIds.has(faq.id));
  }, [filteredFAQs, expandedIds]);

  const toggleExpandAll = () => {
    if (isAllExpanded) {
      setExpandedIds(new Set());
    } else {
      setExpandedIds(new Set(filteredFAQs.map(f => f.id)));
    }
  };

  return (
    <section id="faq-section" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* FAQ Header */}
      <div className="text-center space-y-3">
        <div className="inline-block bg-[#F8F9FA] border border-gray-200 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-xs">
          Interactive FAQ Accordion
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-primary font-display uppercase tracking-tighter flex items-center justify-center gap-2">
          SOLO AGENT CRM QUESTIONS ANSWERED <Sparkles className="w-5 h-5 text-accent" />
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
          Unbiased answers to the most common queries independent realtors have when buying, configuring, or switching CRM pipelines.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 border border-gray-100 shadow-sm rounded-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Search field */}
          <div className="md:col-span-5 relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              id="faq-search-input"
              type="text"
              placeholder="Search questions or keywords..."
              className="w-full bg-[#F8F9FA] border border-gray-200 rounded-xs pl-10 pr-4 py-2.5 text-xs text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-sans transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Quick Filter Select / Tabs */}
          <div className="md:col-span-7 flex flex-wrap gap-1.5 justify-start md:justify-end">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`faq-cat-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-xs border transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-primary border-primary text-accent shadow-xs'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400 hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Toolbar: Expand/Collapse All Toggle & Results Count */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500 font-sans">
          <span className="text-[11px] font-semibold">
            Showing <strong className="text-primary font-black">{filteredFAQs.length}</strong> questions
          </span>

          <button
            id="faq-expand-all-toggle"
            onClick={toggleExpandAll}
            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-primary hover:text-accent bg-[#F8F9FA] border border-gray-200 px-3 py-1.5 rounded-xs transition cursor-pointer"
          >
            {isAllExpanded ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-accent" />
                <span>Collapse All</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-accent" />
                <span>Expand All</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Accordion List */}
      <div id="faq-accordion-container" className="space-y-3.5">
        <AnimatePresence initial={false}>
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq) => {
              const isOpen = expandedIds.has(faq.id);
              return (
                <div 
                  id={`faq-item-${faq.id}`}
                  key={faq.id}
                  className={`bg-white border-2 rounded-xs transition-colors duration-150 ${
                    isOpen ? 'border-primary shadow-sm' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  {/* Collapsible Trigger Head */}
                  <button
                    id={`faq-trigger-${faq.id}`}
                    onClick={() => toggleExpand(faq.id)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 cursor-pointer"
                    aria-expanded={isOpen}
                    aria-controls={`faq-content-${faq.id}`}
                  >
                    <div className="flex items-start gap-3">
                      <HelpCircle className={`w-5 h-5 shrink-0 mt-0.5 transition-colors ${
                        isOpen ? 'text-accent' : 'text-gray-400'
                      }`} />
                      <div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-primary/45 block mb-0.5">
                          {faq.category}
                        </span>
                        <h4 className="text-sm md:text-base font-black text-primary font-display uppercase tracking-tight">
                          {faq.question}
                        </h4>
                      </div>
                    </div>
                    
                    <span className={`p-1 bg-gray-50 border border-gray-200 rounded-full transition-transform duration-200 text-primary ${
                      isOpen ? 'rotate-180 bg-accent/10 border-accent/20 text-accent' : ''
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  {/* Collapsible Content */}
                  <motion.div
                    id={`faq-content-${faq.id}`}
                    initial={false}
                    animate={{
                      height: isOpen ? 'auto' : 0,
                      opacity: isOpen ? 1 : 0
                    }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-2 pl-12 text-xs md:text-sm text-gray-600 font-sans leading-relaxed border-t border-dashed border-gray-100">
                      <Markdown content={faq.answer} />
                    </div>
                  </motion.div>
                </div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white border border-dashed border-gray-200 rounded-xs space-y-3"
            >
              <HelpCircle className="w-8 h-8 text-gray-300 mx-auto" />
              <p className="text-gray-500 font-bold text-sm">No matching questions found.</p>
              <button
                id="faq-reset-filters-btn"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="text-xs font-black text-accent uppercase tracking-widest hover:underline cursor-pointer"
              >
                Reset Search Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </section>
  );
}
