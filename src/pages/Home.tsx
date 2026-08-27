import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CRMReview, CRMGuide, BlogPost } from '../types';
import { useSEO } from '../lib/seo';
import ROICalculator from '../components/ROICalculator';
import { ArrowRight, Calculator, CheckCircle2, ChevronRight, ChevronLeft, HelpCircle, ShieldAlert, Sparkles, Star, TrendingUp, Zap, Download, Copy, Clock } from 'lucide-react';
import NewsletterSignup from '../components/NewsletterSignup';
import FAQSection from '../components/FAQSection';
import CRMNewsSection from '../components/CRMNewsSection';
import AgentTestimonials from '../components/AgentTestimonials';
import VideoTestimonials from '../components/VideoTestimonials';
import AgentProfileQuiz from '../components/AgentProfileQuiz';
import AdSenseAd from '../components/AdSenseAd';
import faqData from '../data/faqs.json';
import { automationBlueprints } from '../data/blueprintsData';

interface HomeProps {
  reviews: CRMReview[];
  guides: CRMGuide[];
  blogs: BlogPost[];
  onNavigate: (path: string) => void;
}

export default function Home({ reviews, guides, blogs, onNavigate }: HomeProps) {
  useSEO({
    title: 'Expert CRM Reviews for Solo Real Estate Agents',
    description: 'Compare Pipedrive, Streak, and Follow Up Boss. Find the absolute best CRM for independent realtors with our independent reviews and ROI calculator.',
    keywords: ['real estate crm', 'solo real estate agent crm', 'pipedrive vs streak', 'follow up boss', 'realtor tool'],
    ogType: 'website',
    faqSchema: faqData.map(f => ({ question: f.question, answer: f.answer.replace(/\*\*/g, '') }))
  });

  // Grab the primary 3 CRMs
  const pipedrive = reviews.find(r => r.id === 'pipedrive');
  const streak = reviews.find(r => r.id === 'streak');
  const followupboss = reviews.find(r => r.id === 'followupboss');

  // Interactive mobile swiper state
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const cards = [
    {
      item: pipedrive,
      badge: "Editor's Pick",
      badgeClass: "bg-primary text-accent",
      borderClass: "border-l-primary",
      logoBg: "bg-primary/5 text-primary"
    },
    {
      item: streak,
      badge: "Best Free Tier",
      badgeClass: "bg-accent text-primary",
      borderClass: "border-l-accent",
      logoBg: "bg-accent/5 text-accent"
    },
    {
      item: followupboss,
      badge: "Best for Leads",
      badgeClass: "bg-gray-500 text-white",
      borderClass: "border-l-gray-400",
      logoBg: "bg-gray-50 text-gray-600"
    }
  ].filter(c => c.item !== undefined);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && activeCardIndex < cards.length - 1) {
      setActiveCardIndex(prev => prev + 1);
    } else if (isRightSwipe && activeCardIndex > 0) {
      setActiveCardIndex(prev => prev - 1);
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. Hero Section */}
      <section className="bg-primary text-white py-24 px-4 md:px-8 relative overflow-hidden">
        {/* Background decorative spheres */}
        <div className="absolute right-0 top-0 -mr-24 -mt-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/4 bottom-0 -ml-24 -mb-24 w-80 h-80 bg-accent/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block bg-accent text-primary text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-xs"
          >
            Built Exclusively for Solo Real Estate Agents
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-7xl font-black font-display uppercase tracking-tighter leading-[0.9] text-white"
          >
            STOP WASTING HOURS ON SPREADSHEETS. CHOOSE THE <span className="text-accent">RIGHT CRM</span>.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto font-sans leading-relaxed"
          >
            No administrative staff? No IT team? CRMsolo provides honest, no-fluff reviews and a free dynamic ROI calculator to help you close more deals this year.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4"
          >
            <button
              onClick={() => {
                const element = document.getElementById('roi-calc-section');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-4 bg-accent hover:bg-accent/90 text-primary font-black uppercase tracking-widest text-xs rounded-xs shadow-md transition duration-150 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calculator className="w-4 h-4" /> Try Free CRM ROI Calculator
            </button>
            <button
              onClick={() => onNavigate('/compare/best-crm-for-solo-real-estate-agents')}
              className="w-full sm:w-auto px-6 py-4 bg-white/10 hover:bg-white/15 border-2 border-white/20 text-white font-black uppercase tracking-widest text-xs rounded-xs transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              See Solo Pillar Comparison <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. Three-Card Quick Comparison Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-block bg-primary text-accent text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-xs">
            Curated Selection
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-primary font-display uppercase tracking-tighter">
            WHICH CRM FITS YOUR BUSINESS STYLE?
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
            We analyzed dozens of solutions to select the top three most reliable systems for independent, solo producers.
          </p>
        </div>

        {/* Desktop View: Clean Grid Layout */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {/* Card 1: Pipedrive */}
          {pipedrive && (
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-6 flex flex-col justify-between shadow-xs relative rounded-xs border border-gray-100 border-l-4 border-l-primary"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-3xl p-2 bg-primary/5 rounded-xs text-primary">{pipedrive.logo}</span>
                  <span className="text-[10px] bg-primary text-accent font-black uppercase tracking-widest px-2.5 py-1 rounded-xs">
                    Editor's Pick
                  </span>
                </div>
                <h3 className="text-xl font-black text-primary font-display uppercase tracking-tight">{pipedrive.name}</h3>
                <p className="text-gray-500 text-xs font-sans leading-relaxed">
                  {pipedrive.oneLinePitch}
                </p>
                <div className="text-xs space-y-1.5 text-gray-600 font-medium pt-2">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success" /> Best For: {pipedrive.bestFor}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success" /> Price: From ${pipedrive.pricingTiers[0].price}/mo
                  </div>
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => onNavigate(`/reviews/${pipedrive.slug}`)}
                  className="text-xs font-black uppercase tracking-widest text-primary hover:text-accent transition-colors"
                >
                  Read full review &rarr;
                </button>
                <span className="text-xs font-mono font-black text-primary px-2.5 py-1 bg-gray-50 rounded-xs border border-gray-100">
                  ★ {pipedrive.overallScore}
                </span>
              </div>
            </motion.div>
          )}

          {/* Card 2: Streak */}
          {streak && (
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-6 flex flex-col justify-between shadow-xs relative rounded-xs border border-gray-100 border-l-4 border-l-accent"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-3xl p-2 bg-accent/5 rounded-xs text-accent">{streak.logo}</span>
                  <span className="text-[10px] bg-accent text-primary font-black uppercase tracking-widest px-2.5 py-1 rounded-xs">
                    Best Free Tier
                  </span>
                </div>
                <h3 className="text-xl font-black text-primary font-display uppercase tracking-tight">{streak.name}</h3>
                <p className="text-gray-500 text-xs font-sans leading-relaxed">
                  {streak.oneLinePitch}
                </p>
                <div className="text-xs space-y-1.5 text-gray-600 font-medium pt-2">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success" /> Best For: {streak.bestFor}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success" /> Price: $0 (Permanent free option)
                  </div>
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => onNavigate(`/reviews/${streak.slug}`)}
                  className="text-xs font-black uppercase tracking-widest text-primary hover:text-accent transition-colors"
                >
                  Read full review &rarr;
                </button>
                <span className="text-xs font-mono font-black text-primary px-2.5 py-1 bg-gray-50 rounded-xs border border-gray-100">
                  ★ {streak.overallScore}
                </span>
              </div>
            </motion.div>
          )}

          {/* Card 3: Follow Up Boss */}
          {followupboss && (
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-6 flex flex-col justify-between shadow-xs relative rounded-xs border border-gray-100 border-l-4 border-l-gray-400"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-3xl p-2 bg-gray-50 rounded-xs text-gray-600">{followupboss.logo}</span>
                  <span className="text-[10px] bg-gray-500 text-white font-black uppercase tracking-widest px-2.5 py-1 rounded-xs">
                    Best for Leads
                  </span>
                </div>
                <h3 className="text-xl font-black text-primary font-display uppercase tracking-tight">{followupboss.name}</h3>
                <p className="text-gray-500 text-xs font-sans leading-relaxed">
                  {followupboss.oneLinePitch}
                </p>
                <div className="text-xs space-y-1.5 text-gray-600 font-medium pt-2">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success" /> Best For: {followupboss.bestFor}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success" /> Price: From ${followupboss.pricingTiers[0].price}/mo
                  </div>
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => onNavigate(`/reviews/${followupboss.slug}`)}
                  className="text-xs font-black uppercase tracking-widest text-primary hover:text-accent transition-colors"
                >
                  Read full review &rarr;
                </button>
                <span className="text-xs font-mono font-black text-primary px-2.5 py-1 bg-gray-50 rounded-xs border border-gray-100">
                  ★ {followupboss.overallScore}
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Mobile View: High-Fidelity Touch-Swipe Carousel */}
        {cards.length > 0 && (
          <div className="block md:hidden space-y-5">
            <div 
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="bg-white p-6 flex flex-col justify-between shadow-xs relative rounded-xs border border-gray-100 border-l-4 min-h-[360px]"
              style={{ borderLeftColor: cards[activeCardIndex].item?.id === 'pipedrive' ? '#111111' : cards[activeCardIndex].item?.id === 'hubspot' ? '#E2B13C' : '#9CA3AF' }}
            >
              {/* Previous/Next visual chevron overlays */}
              {activeCardIndex > 0 && (
                <button 
                  onClick={() => setActiveCardIndex(prev => prev - 1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white rounded-full border border-gray-200 shadow-sm z-20 text-primary active:scale-90 transition cursor-pointer"
                  aria-label="Previous Option"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              {activeCardIndex < cards.length - 1 && (
                <button 
                  onClick={() => setActiveCardIndex(prev => prev + 1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white rounded-full border border-gray-200 shadow-sm z-20 text-primary active:scale-90 transition cursor-pointer"
                  aria-label="Next Option"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {/* Slide content wrapper with transition effect */}
              <motion.div
                key={activeCardIndex}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                className="space-y-4 flex flex-col justify-between h-full"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className={`text-3xl p-2 rounded-xs ${cards[activeCardIndex].logoBg}`}>
                      {cards[activeCardIndex].item?.logo}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-xs ${cards[activeCardIndex].badgeClass}`}>
                      {cards[activeCardIndex].badge}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-black text-primary font-display uppercase tracking-tight">
                    {cards[activeCardIndex].item?.name}
                  </h3>
                  
                  <p className="text-gray-500 text-xs font-sans leading-relaxed">
                    {cards[activeCardIndex].item?.oneLinePitch}
                  </p>
                  
                  <div className="text-xs space-y-1.5 text-gray-600 font-medium pt-2">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-success" /> <strong>Best For:</strong> {cards[activeCardIndex].item?.bestFor}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-success" /> <strong>Price:</strong> {cards[activeCardIndex].item?.id === 'hubspot' ? '$0 (Permanent free option)' : `From $${cards[activeCardIndex].item?.pricingTiers[0].price}/mo`}
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => onNavigate(`/reviews/${cards[activeCardIndex].item?.slug}`)}
                    className="text-xs font-black uppercase tracking-widest text-primary hover:text-accent transition-colors"
                  >
                    Read full review &rarr;
                  </button>
                  <span className="text-xs font-mono font-black text-primary px-2.5 py-1 bg-gray-50 rounded-xs border border-gray-100">
                    ★ {cards[activeCardIndex].item?.overallScore}
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Pagination dots & touch feedback prompt */}
            <div className="flex flex-col items-center justify-center gap-2">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-gray-400">
                ← Swipe card to compare CRMs →
              </span>
              <div className="flex items-center gap-2">
                {cards.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveCardIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-200 ${
                      idx === activeCardIndex ? 'w-6 bg-primary' : 'w-2 bg-gray-200'
                    }`}
                    aria-label={`Go to CRM ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Google AdSense Sponsored Unit */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSenseAd slot="inContentAd" className="w-full" />
      </div>

      {/* Interactive Agent Profile Matchmaker Quiz */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AgentProfileQuiz reviews={reviews} onNavigate={onNavigate} />
      </section>

      {/* Interactive Feature Checklist Promo */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border-2 border-primary rounded-xs p-8 md:p-12 relative overflow-hidden shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-accent/5 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="space-y-4 max-w-2xl">
            <div className="inline-block bg-accent text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xs">
              New Dynamic Tool
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-primary font-display uppercase tracking-tighter leading-none">
              CRM FEATURE CHECKLIST MATCHMAKER
            </h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Don't pay for bloated software you don't need. Choose the exact tools important to your business—such as <strong>two-way email sync, custom property fields, calendar booking links, or mobile voice notes</strong>—and find your exact visual match.
            </p>
            
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-[9px] bg-primary/5 text-primary border border-primary/10 font-bold uppercase tracking-wider px-2.5 py-1 rounded-xs">✓ Gmail Sync</span>
              <span className="text-[9px] bg-primary/5 text-primary border border-primary/10 font-bold uppercase tracking-wider px-2.5 py-1 rounded-xs">✓ Escrow Checklists</span>
              <span className="text-[9px] bg-primary/5 text-primary border border-primary/10 font-bold uppercase tracking-wider px-2.5 py-1 rounded-xs">✓ E-Signatures</span>
              <span className="text-[9px] bg-primary/5 text-primary border border-primary/10 font-bold uppercase tracking-wider px-2.5 py-1 rounded-xs">✓ Permanent Free Plan</span>
            </div>
          </div>
          
          <div className="w-full md:w-auto shrink-0">
            <button
              onClick={() => onNavigate('/checklist')}
              className="w-full md:w-auto px-8 py-5 bg-primary hover:bg-primary/95 text-accent font-black uppercase tracking-widest text-xs rounded-xs shadow-md transition duration-150 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              Configure Your Checklist <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Real Estate Automation Blueprints Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-primary pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-accent text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-xs mb-2">
              <Zap className="w-3 h-3 fill-primary" /> Turnkey Systems
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-primary font-display uppercase tracking-tight">
              SOLO AGENT CRM AUTOMATION BLUEPRINTS
            </h2>
            <p className="text-gray-500 text-sm max-w-2xl mt-1">
              Tested webhook workflows, 2-minute speed-to-lead scripts, and escrow Kanban boards you can deploy into your CRM today.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/blueprints')}
            className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-primary hover:text-accent transition cursor-pointer shrink-0"
          >
            Explore All 6 Blueprints <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {automationBlueprints.slice(0, 3).map((bp) => (
            <div
              key={bp.id}
              onClick={() => onNavigate(`/blueprints/${bp.slug}`)}
              className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-accent hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 group text-left"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-primary/5 text-primary">
                    {bp.category}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {bp.timeToDeploy}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-primary font-display group-hover:text-accent transition-colors leading-snug">
                  {bp.title}
                </h3>

                <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                  {bp.summary}
                </p>

                <div className="pt-2">
                  <div className="text-[11px] text-gray-600 font-semibold bg-gray-50 p-2.5 rounded-lg border border-gray-100 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-accent shrink-0" />
                    <span className="truncate">{bp.roiImpact}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-gray-400 font-mono">
                  {bp.steps.length} Steps • Ready Scripts
                </span>
                <span className="font-black uppercase tracking-wider text-primary group-hover:text-accent flex items-center gap-1 text-[11px]">
                  Launch Blueprint <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Planning Tools & Project Management Directory Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-slate-900 text-white rounded-2xl p-8 md:p-12 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                5,973+ Tools Indexed Across 22 Categories
              </div>
              <h2 className="text-3xl md:text-5xl font-black font-display uppercase tracking-tight text-white">
                PLANNING TOOLS &amp; SOFTWARE DIRECTORY
              </h2>
              <p className="text-slate-300 text-sm md:text-base max-w-2xl mt-2 leading-relaxed">
                Objective benchmark reviews, feature scoring, and GEO compliance for Agile (193), Time Tracking (754), Project Management (899), Gantt Charts (147), and Job Costing (173).
              </p>
            </div>

            <button
              onClick={() => onNavigate('/planning-tools')}
              className="px-6 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl transition duration-150 active:scale-95 flex items-center gap-2 shrink-0 cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              Explore All 22 Categories <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Category Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-8">
            {[
              { name: 'Project Management', count: 899, slug: 'project-management' },
              { name: 'Time Tracking', count: 754, slug: 'time-tracking' },
              { name: 'Task Management', count: 673, slug: 'task-management' },
              { name: 'Time and Expenses', count: 357, slug: 'time-and-expenses' },
              { name: 'Project Planning', count: 313, slug: 'project-planning' },
              { name: 'Project Tracking', count: 305, slug: 'project-tracking' },
              { name: 'PPM', count: 285, slug: 'project-portfolio-management' },
              { name: 'Strategic Planning', count: 240, slug: 'strategic-planning' },
              { name: 'PSA', count: 239, slug: 'professional-services-automation' },
              { name: 'Agile Management', count: 193, slug: 'agile-project-management' },
              { name: 'IT Project Mgmt', count: 173, slug: 'it-project-management' },
              { name: 'Job Costing', count: 173, slug: 'job-costing' }
            ].map((cat, idx) => (
              <div
                key={idx}
                onClick={() => onNavigate(`/planning-tools/${cat.slug}`)}
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-400/50 p-3.5 rounded-xl transition-all cursor-pointer group"
              >
                <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition-colors line-clamp-1">
                  {cat.name}
                </div>
                <div className="text-[11px] font-extrabold text-emerald-400 mt-1">
                  ({cat.count})
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ROI Calculator Embedded Showcase */}
      <section id="roi-calc-section" className="bg-gray-100/50 border-y border-gray-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <div className="inline-block bg-accent text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-xs">
              Live ROI Estimator Tool
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-primary font-display uppercase tracking-tighter">
              CALCULATE YOUR CRM RETURN ON INVESTMENT
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
              Enter your monthly leads, current response time, and commission variables. See exactly how much revenue a proper CRM will recover.
            </p>
          </div>

          <ROICalculator reviews={reviews} onNavigateToCRM={(slug) => onNavigate(`/reviews/${slug}`)} />
        </div>
      </section>

      {/* 4. Latest Reviews & Comparison Duels */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Latest Guides/Articles (Col span 7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex justify-between items-center border-b-2 border-primary pb-3">
              <h3 className="text-2xl font-black text-primary font-display uppercase tracking-tighter">LATEST GUIDES &amp; HANDBOOKS</h3>
              <button 
                onClick={() => onNavigate('/guides')}
                className="text-xs font-black uppercase tracking-widest text-accent hover:underline flex items-center gap-1"
              >
                All Guides <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {guides.slice(0, 3).map((guide) => (
                <div 
                  key={guide.id}
                  onClick={() => onNavigate(`/guides/${guide.slug}`)}
                  className="p-5 bg-white border-l-4 border-l-primary shadow-xs cursor-pointer hover:shadow-sm transition flex flex-col justify-between space-y-3 rounded-xs"
                >
                  <div className="space-y-2">
                    <span className="inline-block bg-primary/10 text-primary font-black uppercase tracking-wider text-[8px] px-2 py-0.5 rounded-xs">
                      {guide.category}
                    </span>
                    <h4 className="text-lg font-black text-primary leading-tight font-display uppercase tracking-tight group-hover:text-accent">
                      {guide.title}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {guide.excerpt}
                    </p>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    <span>By {guide.author}</span>
                    <span>{guide.readTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Side-by-Side Comparisons Column (Col span 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex justify-between items-center border-b-2 border-primary pb-3">
              <h3 className="text-2xl font-black text-primary font-display uppercase tracking-tighter">HEAD-TO-HEAD DUELS</h3>
              <button 
                onClick={() => onNavigate('/compare')}
                className="text-xs font-black uppercase tracking-widest text-accent hover:underline flex items-center gap-1"
              >
                All Duels <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white rounded-xs border-2 border-primary p-5 space-y-4 shadow-sm">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                We pit the giants together across customized solo agent criteria.
              </p>
              
              <div className="divide-y divide-gray-100">
                {reviews.map((crmA, idx) => {
                  return reviews.slice(idx + 1).map((crmB) => {
                    const slug = `${crmA.id}-vs-${crmB.id}`;
                    return (
                      <div 
                        key={slug} 
                        onClick={() => onNavigate(`/compare/${slug}`)}
                        className="py-3.5 hover:bg-gray-50 cursor-pointer px-2 flex justify-between items-center transition"
                      >
                        <div>
                          <strong className="text-sm font-black text-primary font-display uppercase tracking-tight">
                            {crmA.name} <span className="text-xs font-normal text-gray-400 lowercase">vs</span> {crmB.name}
                          </strong>
                          <span className="text-[10px] text-gray-400 block mt-0.5">Direct comparison breakdown</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    );
                  });
                })}
              </div>

              <button
                onClick={() => onNavigate('/compare/best-crm-for-solo-real-estate-agents')}
                className="w-full py-3 bg-primary hover:bg-primary/95 text-white text-xs font-black uppercase tracking-widest rounded-xs text-center shadow-xs block transition cursor-pointer"
              >
                Read 2026 Pillar Hub Comparison &rarr;
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Real Estate Agent Video Testimonials Section */}
      <VideoTestimonials />

      {/* What Agents Are Saying Testimonial Carousel */}
      <AgentTestimonials />

      {/* CRM Industry News & Grounding Section */}
      <CRMNewsSection />

      {/* FAQ Hub Section */}
      <FAQSection />

      {/* Newsletter Signup Block */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <NewsletterSignup />
      </section>

      {/* 5. Trust Section (Methodology summary + Disclosure) */}
      <section className="bg-white border-y border-gray-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#F8F9FA] p-8 border-l-4 border-accent shadow-sm rounded-xs">
          
          <div className="md:col-span-4 flex justify-center">
            <div className="w-24 h-24 bg-primary text-accent flex items-center justify-center text-4xl rounded-xs">
              ⚖️
            </div>
          </div>

          <div className="md:col-span-8 space-y-4">
            <div className="inline-block bg-primary text-accent text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-xs">
              Trust &amp; Transparency
            </div>
            <h3 className="text-2xl font-black text-primary font-display uppercase tracking-tighter">
              The CRMsolo Review Methodology
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              We do not copy-paste features or compile reviews with AI generators. Our team creates real test accounts and configures active listing pipelines from an independent solo agent perspective. We score systems based on mobile speed, easy custom property fields, email sync reliability, and cost-per-feature value.
            </p>
            <div className="flex gap-6 pt-2">
              <button
                onClick={() => onNavigate('/about')}
                className="text-xs font-black uppercase tracking-widest text-accent hover:underline cursor-pointer"
              >
                Read scoring methodology &rarr;
              </button>
              <button
                onClick={() => onNavigate('/affiliate-disclosure')}
                className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                Affiliate disclosure
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
