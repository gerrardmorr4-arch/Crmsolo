import React, { useState, useEffect } from 'react';
import { List, ChevronRight, ChevronDown, AlignLeft } from 'lucide-react';
import AdSenseAd from './AdSenseAd';

export interface TocItem {
  id: string;
  label: string;
  level?: number; // 1 = main section, 2 = sub-section, 3 = deep section
}

interface TableOfContentsProps {
  items: TocItem[];
  title?: string;
  showAd?: boolean;
}

export default function TableOfContents({
  items,
  title = 'Table of Contents',
  showAd = true
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!items || items.length === 0) return;

    // Set initial active ID to first item if none active
    if (!activeId && items[0]) {
      setActiveId(items[0].id);
    }

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      // Find the first intersecting section
      const visible = entries.find(entry => entry.isIntersecting);
      if (visible && visible.target.id) {
        setActiveId(visible.target.id);
      }
    };

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: '-80px 0px -55% 0px',
      threshold: 0.1
    });

    const observedElements: HTMLElement[] = [];
    items.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) {
        observer.observe(el);
        observedElements.push(el);
      }
    });

    return () => {
      observedElements.forEach(el => observer.unobserve(el));
      observer.disconnect();
    };
  }, [items]);

  const handleScrollTo = (id: string) => {
    setActiveId(id);
    setIsMobileOpen(false);

    // Try finding element directly by ID
    let el = document.getElementById(id);

    // If not found directly, try matching heading text
    if (!el) {
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4'));
      el = headings.find(h => {
        const txt = h.textContent || '';
        const slug = txt.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return slug === id;
      }) as HTMLElement | null;
    }

    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <>
      {/* Mobile Collapsible TOC Floating Bar */}
      <div className="lg:hidden bg-white border border-gray-200 rounded-2xl p-3 shadow-sm mb-6">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="w-full flex items-center justify-between text-xs font-bold text-primary cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <List className="w-4 h-4 text-accent" />
            <span className="uppercase tracking-wider font-display">{title}</span>
            <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {items.length} Sections
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isMobileOpen ? 'rotate-180' : ''}`} />
        </button>

        {isMobileOpen && (
          <nav className="mt-3 pt-3 border-t border-gray-100 space-y-1 max-h-60 overflow-y-auto">
            {items.map((item) => {
              const isActive = activeId === item.id;
              const level = item.level || 1;
              return (
                <button
                  key={item.id}
                  onClick={() => handleScrollTo(item.id)}
                  className={`w-full text-left text-xs py-1.5 px-2 rounded-lg flex items-center justify-between transition ${
                    isActive
                      ? 'bg-accent/15 text-primary font-bold border-l-2 border-accent'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  style={{ paddingLeft: `${(level - 1) * 12 + 8}px` }}
                >
                  <span className="truncate">{item.label}</span>
                  {isActive && <ChevronRight className="w-3 h-3 text-accent shrink-0" />}
                </button>
              );
            })}
          </nav>
        )}
      </div>

      {/* Desktop Sticky Sidebar TOC */}
      <aside className="hidden lg:block bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-4 sticky top-28">
        <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <List className="w-4 h-4 text-accent" />
            <h3 className="text-xs font-bold text-primary font-display uppercase tracking-wider">
              {title}
            </h3>
          </div>
          <span className="text-[10px] font-mono text-gray-400 font-semibold bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
            {items.length} Topics
          </span>
        </div>

        <nav className="space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
          {items.map((item) => {
            const isActive = activeId === item.id;
            const level = item.level || 1;

            return (
              <button
                key={item.id}
                onClick={() => handleScrollTo(item.id)}
                className={`w-full text-left text-xs transition duration-150 py-1.5 px-2.5 rounded-xl block cursor-pointer group ${
                  isActive
                    ? 'bg-accent/15 text-primary font-bold border-l-2 border-accent shadow-2xs'
                    : 'text-gray-500 hover:text-primary hover:bg-gray-50'
                }`}
                style={{ paddingLeft: level > 1 ? `${(level - 1) * 12 + 10}px` : undefined }}
              >
                <div className="flex items-center justify-between leading-snug">
                  <span className={`truncate ${isActive ? 'text-primary font-bold' : ''}`}>
                    {item.label}
                  </span>
                  {isActive ? (
                    <ChevronRight className="w-3.5 h-3.5 text-accent shrink-0 ml-1" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-gray-400 shrink-0 ml-1 opacity-0 group-hover:opacity-100 transition" />
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {showAd && (
          <div className="pt-3 border-t border-gray-100">
            <AdSenseAd slot="sidebarAd" className="w-full" />
          </div>
        )}
      </aside>
    </>
  );
}
