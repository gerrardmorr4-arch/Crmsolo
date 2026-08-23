import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Mail, BookOpen, Calculator, Layers, Info, Check, Sparkles, Star, ChevronRight, ChevronUp, ChevronDown, Lock, Search, FileText, ArrowRight, Award, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getAdSenseSettings, getReviews, getComparisons, getGuides, getBlogPosts } from '../lib/storage';
import AdSenseAd from './AdSenseAd';
import JoinAgentNewsletter from './JoinAgentNewsletter';
import NavSearchBar from './NavSearchBar';
import PrintFooter from './PrintFooter';

interface LayoutProps {
  children: React.ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
  stickyCta?: {
    text: string;
    linkText: string;
    onLinkClick: () => void;
    rating?: number;
    ratingLabel?: string;
  } | null;
}

export default function Layout({ children, currentPath, onNavigate, stickyCta = null }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolledPast, setScrolledPast] = useState(false);
  const [ctaCollapsed, setCtaCollapsed] = useState(false);

  // Dynamic Breadcrumbs computation based on currentPath
  const breadcrumbs = React.useMemo(() => {
    if (!currentPath || currentPath === '/') return [];

    const crumbs: { label: string; path: string }[] = [
      { label: 'Home', path: '/' }
    ];

    const segments = currentPath.split('/').filter(Boolean);
    if (segments.length === 0) return [];

    const firstSeg = segments[0];

    if (firstSeg === 'directory' || firstSeg === 'category') {
      crumbs.push({ label: 'Software Directory', path: '/directory' });
    } else if (firstSeg === 'buyer-guide' || firstSeg === 'buyers-guide') {
      crumbs.push({ label: "Buyer's Guide Hub", path: '/buyer-guide' });
    } else if (firstSeg === 'reviews') {
      crumbs.push({ label: 'CRM Reviews', path: '/reviews' });
      if (segments[1]) {
        const reviews = getReviews();
        const review = reviews.find(r => r.slug === segments[1]);
        crumbs.push({
          label: review ? review.name : segments[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          path: `/reviews/${segments[1]}`
        });
      }
    } else if (firstSeg === 'compare') {
      crumbs.push({ label: 'Comparisons', path: '/compare' });
      if (segments[1]) {
        const comparisons = getComparisons();
        const comp = comparisons.find(c => c.slug === segments[1]);
        crumbs.push({
          label: comp ? comp.title : segments[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          path: `/compare/${segments[1]}`
        });
      }
    } else if (firstSeg === 'guides') {
      crumbs.push({ label: 'Guides & Workbooks', path: '/guides' });
      if (segments[1]) {
        const guides = getGuides();
        const guide = guides.find(g => g.slug === segments[1]);
        crumbs.push({
          label: guide ? guide.title : segments[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          path: `/guides/${segments[1]}`
        });
      }
    } else if (firstSeg === 'blog') {
      crumbs.push({ label: 'Blog', path: '/blog' });
      if (segments[1]) {
        const blogs = getBlogPosts();
        const blog = blogs.find(b => b.slug === segments[1]);
        crumbs.push({
          label: blog ? blog.title : segments[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          path: `/blog/${segments[1]}`
        });
      }
    } else if (firstSeg === 'calculator') {
      crumbs.push({ label: 'ROI Calculator', path: '/calculator' });
    } else if (firstSeg === 'about') {
      crumbs.push({ label: 'About CRMsolo', path: '/about' });
    } else if (firstSeg === 'admin') {
      crumbs.push({ label: 'Admin Portal', path: '/admin' });
    } else if (firstSeg === 'contact') {
      crumbs.push({ label: 'Contact Us', path: '/contact' });
    } else if (firstSeg === 'privacy-policy') {
      crumbs.push({ label: 'Privacy Policy', path: '/privacy-policy' });
    } else if (firstSeg === 'affiliate-disclosure') {
      crumbs.push({ label: 'Affiliate Disclosure', path: '/affiliate-disclosure' });
    } else {
      crumbs.push({
        label: firstSeg.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        path: `/${firstSeg}`
      });
    }

    return crumbs;
  }, [currentPath]);

  // Load and inject Google AdSense headScript dynamically when enabled
  useEffect(() => {
    try {
      const stored = getAdSenseSettings();
      if (stored && stored.globalEnabled && stored.headScript) {
        // Extract src or script parameters if the user pasted <script src="..."></script>
        const parser = new DOMParser();
        const doc = parser.parseFromString(stored.headScript, 'text/html');
        const scriptElement = doc.querySelector('script');
        
        if (scriptElement) {
          const src = scriptElement.getAttribute('src');
          if (src) {
            const existing = document.querySelector(`script[src="${src}"]`);
            if (!existing) {
              const script = document.createElement('script');
              script.src = src;
              script.async = true;
              script.crossOrigin = 'anonymous';
              
              // Forward any custom attributes like data-ad-client, client, etc.
              for (let i = 0; i < scriptElement.attributes.length; i++) {
                const attr = scriptElement.attributes[i];
                if (attr.name !== 'src' && attr.name !== 'async') {
                  script.setAttribute(attr.name, attr.value);
                }
              }
              document.head.appendChild(script);
            }
          }
        }
      }
    } catch (e) {
      console.error('Failed to inject Google AdSense script:', e);
    }
  }, [currentPath]);

  // Reset collapse state when sticky CTA content changes so new offers start visible
  useEffect(() => {
    setCtaCollapsed(false);
  }, [stickyCta?.text]);


  // Scroll listener for the sticky CTA bar on long review pages
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setScrolledPast(true);
      } else {
        setScrolledPast(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'CRM Directory', path: '/directory', icon: Award },
    { name: 'Buyer\'s Guides', path: '/buyer-guide', icon: BookOpen },
    { name: 'ROI Calculator', path: '/calculator', icon: Calculator },
    { name: 'Feature Checklist', path: '/checklist', icon: Check },
    { name: 'CRM Reviews', path: '/reviews', icon: Star },
    { name: 'Comparisons', path: '/compare', icon: Layers },
    { name: 'Blog', path: '/blog', icon: Info },
    { name: 'Admin Portal', path: '/admin', icon: Lock },
    { name: 'About', path: '/about', icon: Info },
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.25;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent shrink-0" />
        );
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(
          <div key={i} className="relative inline-block shrink-0">
            <Star className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
              <Star className="w-3.5 h-3.5 fill-accent text-accent shrink-0" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star key={i} className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        );
      }
    }
    return (
      <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5 stars`}>
        {stars}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-offwhite flex flex-col text-nearblack selection:bg-accent selection:text-primary">
      
      {/* Top Banner Disclaimer */}
      <div className="bg-primary/95 text-gray-300 py-2.5 px-4 border-b border-white/5 text-xs no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div>
            <span className="font-semibold text-accent inline-flex items-center gap-1 mr-1">
              <Sparkles className="w-3.5 h-3.5" /> E-E-A-T Certified Real Estate Resource:
            </span>
            We test every CRM independently. CRMsolo may earn affiliate commissions when you sign up.
          </div>
          <button
            onClick={() => onNavigate('/admin')}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/20 hover:bg-accent/30 text-accent font-bold text-[11px] rounded-full border border-accent/40 transition cursor-pointer shrink-0"
          >
            <Lock className="w-3 h-3 text-accent" /> Admin Portal (Access Key)
          </button>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b-4 border-primary shadow-xs transition-all no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div 
            onClick={() => { onNavigate('/'); setMobileMenuOpen(false); }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-primary flex items-center justify-center text-accent font-black text-xl shadow-sm group-hover:scale-105 transition-transform duration-150 rounded-xs">
              CS
            </div>
            <div>
              <span className="text-2xl font-black tracking-tighter text-primary font-display block leading-none">
                CRM<span className="text-accent">SOLO</span>
              </span>
              <span className="text-[8px] text-gray-500 font-mono tracking-widest uppercase block mt-1 font-bold">
                FOR INDEPENDENT REALTORS
              </span>
            </div>
          </div>

          {/* Desktop Nav links */}
          <nav className="hidden lg:flex items-center gap-3">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path || currentPath.startsWith(link.path + '/');
              return (
                <button
                  key={link.path}
                  onClick={() => onNavigate(link.path)}
                  className={`px-3 py-2 text-xs font-black uppercase tracking-widest transition-all cursor-pointer border-b-2 ${
                    isActive
                      ? 'text-primary border-accent'
                      : 'text-gray-500 hover:text-primary border-transparent'
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
          </nav>

          {/* Global Fuzzy Search Bar */}
          <NavSearchBar onNavigate={onNavigate} className="mx-2 md:mx-4" />

          {/* Quick CTA */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => onNavigate('/calculator')}
              className="px-5 py-3 bg-accent hover:bg-accent/90 text-primary font-black text-xs uppercase tracking-widest rounded-xs shadow-sm transition duration-150 active:scale-95 cursor-pointer"
            >
              Test Calculator &rarr;
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-xl transition focus:outline-none cursor-pointer"
            aria-label="Open Mobile Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Off-Canvas Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex justify-end no-print">
            {/* Dark Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
              aria-hidden="true"
            />

            {/* Off-Canvas Drawer Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 230 }}
              className="relative w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 font-sans border-l border-gray-200"
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-gray-200 bg-primary text-white flex items-center justify-between shrink-0">
                <div 
                  onClick={() => { onNavigate('/'); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <div className="w-9 h-9 bg-accent text-primary font-black text-base flex items-center justify-center rounded-xs shadow-xs font-display">
                    CS
                  </div>
                  <div>
                    <span className="text-xl font-black tracking-tighter text-white font-display block leading-none">
                      CRM<span className="text-accent">SOLO</span>
                    </span>
                    <span className="text-[7.5pt] text-gray-300 font-mono tracking-widest uppercase block mt-1 font-bold">
                      SOLO REALTOR HUB
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
                  aria-label="Close Navigation Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body - Scrollable */}
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 font-sans">
                {/* Search Bar */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block font-mono">
                    Search Platform
                  </span>
                  <NavSearchBar onNavigate={(p) => { onNavigate(p); setMobileMenuOpen(false); }} className="w-full" />
                </div>

                {/* Navigation Links */}
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 font-mono">
                    Navigation Menu
                  </span>
                  {navLinks.map((link) => {
                    const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
                    const Icon = link.icon;
                    return (
                      <button
                        key={link.path}
                        onClick={() => {
                          onNavigate(link.path);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left text-xs font-bold tracking-wide transition cursor-pointer ${
                          isActive
                            ? 'bg-primary text-white shadow-xs'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-accent' : 'text-gray-400'}`} />
                          <span>{link.name}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 ${isActive ? 'text-accent' : 'text-gray-300'}`} />
                      </button>
                    );
                  })}
                </div>

                {/* Quick Tools & Feature Highlight */}
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black text-primary font-display uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-accent" /> Essential Solo Tools
                  </div>
                  <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                    Simulate net commission growth with our free 2026 Solo Realtor ROI Calculator.
                  </p>
                  <button
                    onClick={() => {
                      onNavigate('/calculator');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 bg-accent hover:bg-accent/90 text-primary font-black text-xs uppercase tracking-wider rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
                  >
                    <Calculator className="w-4 h-4" /> Launch ROI Calculator
                  </button>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-gray-200 bg-gray-50 text-[10px] text-gray-500 font-mono flex items-center justify-between shrink-0">
                <span>&copy; {new Date().getFullYear()} CRMsolo</span>
                <button
                  onClick={() => {
                    onNavigate('/admin');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-1 text-primary hover:text-accent font-bold transition cursor-pointer"
                >
                  <Lock className="w-3 h-3" /> Admin Portal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dynamic Breadcrumb Navigation Bar */}
      {breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="bg-gray-100/90 border-b border-gray-200/80 py-2.5 px-4 sm:px-6 lg:px-8 text-xs text-gray-500 font-medium transition-all">
          <div className="max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto whitespace-nowrap no-scrollbar">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              const isHome = idx === 0;

              return (
                <React.Fragment key={crumb.path + idx}>
                  {idx > 0 && (
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  )}
                  {isLast ? (
                    <span 
                      className="text-primary font-bold truncate max-w-[280px] sm:max-w-md md:max-w-lg font-display" 
                      aria-current="page"
                      title={crumb.label}
                    >
                      {crumb.label}
                    </span>
                  ) : (
                    <button
                      onClick={() => onNavigate(crumb.path)}
                      className="hover:text-primary transition flex items-center gap-1 cursor-pointer hover:underline text-gray-600 font-semibold"
                    >
                      {isHome && <Home className="w-3.5 h-3.5 text-accent" />}
                      <span>{crumb.label}</span>
                    </button>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </nav>
      )}

      {/* Main Content Stage */}
      <main className="flex-grow">
        <AdSenseAd slot="headerBanner" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6" />
        {children}
      </main>

      {/* Sticky mini-CTA bar */}
      <AnimatePresence>
        {stickyCta && scrolledPast && (
          !ctaCollapsed ? (
            <motion.div 
              key="expanded-cta"
              layoutId="sticky-cta-container"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="fixed bottom-0 inset-x-0 bg-primary/95 text-white py-4 px-4 shadow-2xl z-40 border-t border-white/5 backdrop-blur-md"
            >
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
                  <div className="flex items-center justify-between sm:justify-start gap-2">
                    <span className="bg-accent/20 text-accent text-[9px] font-black px-2 py-0.5 rounded-full uppercase border border-accent/20 tracking-widest whitespace-nowrap">
                      Editor's Recommendation
                    </span>
                    
                    {/* Mobile collapse button */}
                    <button
                      onClick={() => setCtaCollapsed(true)}
                      className="md:hidden p-1.5 bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white rounded-xs transition cursor-pointer flex items-center justify-center border border-white/10"
                      aria-label="Collapse banner"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Text and Star Rating Container */}
                  <div className="space-y-1">
                    <p className="text-sm text-gray-100 font-bold font-sans leading-tight">
                      {stickyCta.text}
                    </p>
                    {stickyCta.rating && (
                      <div className="flex items-center gap-3">
                        {renderStars(stickyCta.rating)}
                        {stickyCta.ratingLabel && (
                          <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase font-bold bg-white/5 px-1.5 py-0.5 rounded-xs">
                            {stickyCta.ratingLabel}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Link & Controls Container */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  <button
                    onClick={stickyCta.onLinkClick}
                    className="w-full md:w-auto px-5 py-2.5 bg-accent hover:bg-accent/90 text-primary font-black text-xs uppercase tracking-widest rounded-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    {stickyCta.linkText} <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Desktop collapse button */}
                  <button
                    onClick={() => setCtaCollapsed(true)}
                    className="hidden md:flex items-center justify-center w-8 h-8 bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white border border-white/10 rounded-xs transition cursor-pointer"
                    title="Collapse Recommendation"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Collapsed mini floating card (Highly visible, keeps star rating, non-blocking on mobile) */
            <motion.div
              key="collapsed-cta"
              layoutId="sticky-cta-container"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              onClick={() => setCtaCollapsed(false)}
              className="fixed bottom-4 right-4 bg-primary/95 text-white p-3.5 shadow-2xl z-40 rounded-xs border border-accent/30 cursor-pointer flex flex-col gap-1.5 max-w-[280px] hover:scale-102 hover:border-accent/60 transition-all active:scale-98 backdrop-blur-md"
            >
              <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-1">
                <span className="text-[9px] font-black text-accent uppercase tracking-widest">
                  ★ RECOMMENDED
                </span>
                <div className="flex items-center gap-1">
                  <ChevronUp className="w-3.5 h-3.5 text-accent animate-pulse" />
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-[11px] font-black uppercase tracking-wider text-gray-100 flex items-center gap-1">
                  {stickyCta.linkText}
                </div>
                {stickyCta.rating && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="flex items-center">
                      <Star className="w-3 h-3 fill-accent text-accent shrink-0" />
                      <span className="text-[10px] font-mono font-bold text-accent ml-1">
                        {Math.round(stickyCta.rating * 10) / 10}/5
                      </span>
                    </div>
                    {stickyCta.ratingLabel && (
                      <span className="text-[9px] text-gray-400 font-mono">
                        ({stickyCta.ratingLabel})
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )
        )}
      </AnimatePresence>

      {/* Footer Leaderboard Google AdSense Slot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6 no-print">
        <AdSenseAd slot="footerBanner" className="w-full" />
      </div>

      {/* Join Agent Newsletter Section */}
      <JoinAgentNewsletter source="Footer Newsletter" className="no-print" />

      {/* Footer */}
      <footer className="bg-primary text-gray-400 py-16 px-4 border-t-4 border-primary font-sans text-xs no-print">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-white/5">
          
          <div className="md:col-span-4 space-y-3">
            <span className="text-2xl font-black font-display text-white tracking-tighter block leading-none">
              CRM<span className="text-accent">SOLO</span>
            </span>
            <p className="leading-relaxed">
              CRMsolo is the premier independent resource focused purely on solo real estate practitioners. Founded by Eugene Boniface, we build tools, review CRM software packages, and write guides that help realtors cut through marketing jargon.
            </p>
            <div className="pt-2 text-[11px] text-gray-400 space-y-1 font-mono">
              <p>📍 Avenida de Esteiro 161 Ferrol, Spain</p>
              <p>✉️ <a href="mailto:Eugeneboniface4@yahoo.com" className="text-accent hover:underline">Eugeneboniface4@yahoo.com</a></p>
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <h4 className="text-white font-black tracking-widest uppercase text-[10px] border-l-2 border-accent pl-2">Quick Tools</h4>
            <ul className="space-y-1.5 pt-1">
              <li><button onClick={() => onNavigate('/calculator')} className="hover:text-white transition">ROI Calculator</button></li>
              <li><button onClick={() => onNavigate('/checklist')} className="hover:text-white transition">Feature Checklist</button></li>
              <li><button onClick={() => onNavigate('/compare/best-crm-for-solo-real-estate-agents')} className="hover:text-white transition">Solo Pillar comparison</button></li>
              <li><button onClick={() => onNavigate('/about')} className="hover:text-white transition">E-E-A-T Methodology</button></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-2">
            <h4 className="text-white font-black tracking-widest uppercase text-[10px] border-l-2 border-accent pl-2">Independently Reviewed</h4>
            <ul className="space-y-1.5 pt-1">
              <li><button onClick={() => onNavigate('/reviews/pipedrive-for-real-estate-agents')} className="hover:text-white transition">Pipedrive Review</button></li>
              <li><button onClick={() => onNavigate('/reviews/streak-for-real-estate-agents')} className="hover:text-white transition">Streak Review</button></li>
              <li><button onClick={() => onNavigate('/reviews/followupboss-for-real-estate-agents')} className="hover:text-white transition">Follow Up Boss Review</button></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-2">
            <h4 className="text-white font-black tracking-widest uppercase text-[10px] border-l-2 border-accent pl-2">Legal & Admin</h4>
            <ul className="space-y-1.5 pt-1">
              <li><button onClick={() => onNavigate('/admin')} className="text-accent font-bold hover:underline flex items-center gap-1"><Lock className="w-3 h-3" /> Admin Portal</button></li>
              <li><button onClick={() => onNavigate('/privacy-policy')} className="hover:text-white transition">Privacy Policy</button></li>
              <li><button onClick={() => onNavigate('/affiliate-disclosure')} className="hover:text-white transition">Affiliate Disclosure</button></li>
              <li><button onClick={() => onNavigate('/contact')} className="hover:text-white transition">Contact Us</button></li>
            </ul>
          </div>

        </div>

        {/* Final Disclaimer Block */}
        <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-gray-500">
          <div>
            <p>&copy; {new Date().getFullYear()} CRMsolo (crmsolo.online). All rights reserved.</p>
            <p className="mt-1 max-w-2xl leading-normal text-[11px]">
              Disclaimer: The ratings, calculations, and recommendations provided by CRMsolo are based on mathematical assumptions and user inputs. Actual results vary by local property market, agent performance, lead quality, and daily usage. CRMsolo operates independently and receives monetary referral compensation from reviewed software programs via affiliate integrations.
            </p>
          </div>
          <div className="flex gap-4 shrink-0 text-gray-400">
            <button onClick={() => onNavigate('/')} className="hover:text-white">Home</button>
          </div>
        </div>
      </footer>

      {/* Printer-Friendly Footer (Visible on printouts) */}
      <div className="px-6">
        <PrintFooter currentPath={currentPath} />
      </div>

    </div>
  );
}
