import { CRMReview, CRMComparison } from '../types';
import { Check, X, ShieldAlert, Award, Star, HelpCircle, ArrowUpRight, ArrowRight, Sparkles, AlertCircle, ChevronRight, Download, Printer } from 'lucide-react';
import NewsletterSignup from '../components/NewsletterSignup';
import { useSEO } from '../lib/seo';
import AdSenseAd from '../components/AdSenseAd';

interface ComparisonDetailProps {
  comparisonSlug: string | null;
  comparisons: CRMComparison[];
  reviews: CRMReview[];
  onNavigate: (path: string) => void;
}

export default function ComparisonDetail({ comparisonSlug, comparisons, reviews, onNavigate }: ComparisonDetailProps) {
  const isPillarPage = !comparisonSlug || comparisonSlug === 'best-crm-for-solo-real-estate-agents';
  const currentComp = comparisons.find(c => c.slug === comparisonSlug);

  const seoTitle = isPillarPage 
    ? 'Best CRM for Solo Real Estate Agents (Pipedrive vs Streak vs Follow Up Boss)' 
    : currentComp 
      ? currentComp.title 
      : 'CRM Comparison Hub';

  const seoDescription = isPillarPage 
    ? 'Compare the only 3 platforms that deserve your attention as a solo agent: Pipedrive, Streak, and Follow Up Boss. Head-to-head scorecards and verdicts.' 
    : currentComp 
      ? currentComp.verdictSummary 
      : 'In-depth real estate CRM comparison matrix.';

  const seoKeywords = isPillarPage
    ? ['best real estate crm', 'pipedrive vs streak', 'streak vs followupboss', 'solo agent crm comparison']
    : currentComp
      ? [currentComp.crmAId, currentComp.crmBId, `${currentComp.crmAId} vs ${currentComp.crmBId}`, 'crm comparison']
      : ['real estate crm comparison'];

  const comparisonFaqs = isPillarPage ? [
    {
      question: "Which CRM is best overall for a solo real estate agent?",
      answer: "Pipedrive is our top overall pick (9.2/10) for solo agents due to its intuitive visual pipeline and affordable starting cost ($14/mo). For Gmail-native power users, Streak is the best free option ($0/mo), while Follow Up Boss ($69/mo) leads for high-volume lead converting."
    },
    {
      question: "What is the most affordable real estate CRM?",
      answer: "Streak CRM offers a generous free tier directly inside Gmail. Pipedrive is the most cost-effective standalone CRM starting at $14/month."
    },
    {
      question: "Do solo agents need a complex CRM system?",
      answer: "No. Solo agents without dedicated administrative staff often get overwhelmed by complex enterprise CRMs. Visual CRMs like Pipedrive or Streak require less than 10 minutes a day of maintenance."
    }
  ] : currentComp ? [
    {
      question: `Which CRM is better: ${currentComp.title}?`,
      answer: currentComp.verdictSummary
    }
  ] : [];

  useSEO({
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
    ogType: 'article',
    category: 'CRM Comparisons',
    faqSchema: comparisonFaqs
  }, [comparisonSlug, currentComp]);
  
  // Find reviews
  const pipedrive = reviews.find(r => r.id === 'pipedrive');
  const streak = reviews.find(r => r.id === 'streak');
  const followupboss = reviews.find(r => r.id === 'followupboss');

  // Master criteria for the Pillar Comparison Page
  const pillarCriteria = [
    {
      category: 'Overall Score',
      pipedrive: '★ 9.2/10',
      streak: '★ 9.0/10',
      followupboss: '★ 8.8/10',
      winner: 'Pipedrive',
      badge: 'Editor\'s Choice'
    },
    {
      category: 'Starting Price',
      pipedrive: '$14/mo',
      streak: '$0/mo (Free)',
      followupboss: '$69/mo',
      winner: 'Streak',
      badge: 'Unbeatable Entry'
    },
    {
      category: 'Setup Difficulty',
      pipedrive: '⚡ Extremely Easy (15 min)',
      streak: '📥 Super Simple (Inside Gmail)',
      followupboss: '🕒 Moderate (Imports contacts)',
      winner: 'Streak',
      badge: 'Inbox Native'
    },
    {
      category: 'Email Logging Sync',
      pipedrive: 'Advanced tier ($29)',
      streak: 'Included on Free tier',
      followupboss: 'Standard on all plans',
      winner: 'Streak',
      badge: 'Ultimate Tracking'
    },
    {
      category: 'Mobile Transaction UI',
      pipedrive: 'Best-in-class Kanban pipeline',
      streak: 'Good (Inside Gmail app)',
      followupboss: 'Excellent (Premium call logs)',
      winner: 'Pipedrive',
      badge: 'Showings Approved'
    },
    {
      category: 'Automation Power',
      pipedrive: 'Good linear recipes',
      streak: 'Mail merge templates',
      followupboss: 'Elite automated action plans',
      winner: 'Follow Up Boss',
      badge: 'Lead Nurturing'
    },
  ];

  // If no specific comparison slug is passed, OR the user is on the master pillar page
  if (isPillarPage) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Pillar Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 border border-accent/25 text-primary text-xs font-bold rounded-full uppercase">
              <Sparkles className="w-3.5 h-3.5 text-accent" /> 2026 Master Comparison Hub
            </span>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary text-accent hover:bg-primary/90 font-black text-xs uppercase tracking-widest rounded-full shadow-xs cursor-pointer transition active:scale-95"
              title="Generate a printer-friendly summary PDF of selected CRMs"
            >
              <Printer className="w-3.5 h-3.5 text-accent" /> Download Comparison (PDF)
            </button>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-primary font-display tracking-tight leading-tight">
            Best CRM for Solo Real Estate Agents (Pipedrive vs Streak vs Follow Up Boss)
          </h1>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            As a solo agent, you are running a complete business from your phone. You need a system that minimizes administrative overhead, logs calls without manual entries, and schedules showings instantly. Here is our direct head-to-head comparison of the only 3 platforms that deserve your attention.
          </p>
        </div>

        {/* 1. Quick Badges Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-5 border-t-4 border-t-blue-600 border-x border-b border-gray-100 shadow-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-full uppercase">Editor's Pick</span>
              <span className="text-sm font-mono font-bold text-gray-500">9.2 / 10</span>
            </div>
            <h3 className="font-display font-bold text-lg text-primary">Pipedrive CRM</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Best for agents who want simple, beautiful visual pipelines to manage listing transactions with zero configurations.
            </p>
            <button onClick={() => onNavigate('/reviews/pipedrive-for-real-estate-agents')} className="text-xs font-bold text-blue-600 hover:underline pt-2 block">
              Read Pipedrive review &rarr;
            </button>
          </div>

          <div className="bg-white rounded-2xl p-5 border-t-4 border-t-orange-500 border-x border-b border-gray-100 shadow-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] bg-orange-50 text-orange-600 font-bold px-2 py-0.5 rounded-full uppercase">Best Budget/Free</span>
              <span className="text-sm font-mono font-bold text-gray-500">9.0 / 10</span>
            </div>
            <h3 className="font-display font-bold text-lg text-primary">Streak CRM</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Best for newly licensed agents who want elite email tracking, pipelines built inside Gmail, and zero subscription overhead.
            </p>
            <button onClick={() => onNavigate('/reviews/streak-for-real-estate-agents')} className="text-xs font-bold text-orange-600 hover:underline pt-2 block">
              Read Streak review &rarr;
            </button>
          </div>

          <div className="bg-white rounded-2xl p-5 border-t-4 border-t-yellow-500 border-x border-b border-gray-100 shadow-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] bg-yellow-50 text-yellow-600 font-bold px-2 py-0.5 rounded-full uppercase">Best for Leads</span>
              <span className="text-sm font-mono font-bold text-gray-500">8.8 / 10</span>
            </div>
            <h3 className="font-display font-bold text-lg text-primary">Follow Up Boss</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Best for tech-savvy brokers who want elite call/text dialers, fast contact lookup, and professional lead source integrations.
            </p>
            <button onClick={() => onNavigate('/reviews/followupboss-for-real-estate-agents')} className="text-xs font-bold text-yellow-600 hover:underline pt-2 block">
              Read Follow Up Boss review &rarr;
            </button>
          </div>
        </div>

        {/* 2. Direct Comparison Matrix Table (Responsive: grid on mobile) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <h2 className="text-xl font-bold text-primary font-display">
              Feature-by-Feature Matrix
            </h2>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto border border-gray-100 rounded-3xl shadow-xs bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-primary text-white font-display">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold tracking-wider uppercase">Key Criteria</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold tracking-wider uppercase">Pipedrive</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold tracking-wider uppercase">Streak</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold tracking-wider uppercase">Follow Up Boss</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold tracking-wider uppercase text-accent">Winner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {pillarCriteria.map((crit, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary">{crit.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">{crit.pipedrive}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">{crit.streak}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">{crit.followupboss}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-primary">
                      <span className="inline-flex items-center gap-1 text-success">
                        <Check className="w-3.5 h-3.5 text-success" />
                        {crit.winner}
                      </span>
                      <span className="block text-[9px] text-gray-400 font-medium font-sans mt-0.5">({crit.badge})</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Accordion/Card Stack View */}
          <div className="block md:hidden space-y-4">
            {pillarCriteria.map((crit, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                  <h4 className="font-bold text-sm text-primary">{crit.category}</h4>
                  <span className="text-[10px] bg-accent/25 text-primary font-bold px-2 py-0.5 rounded">
                    Winner: {crit.winner}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <span className="text-[10px] text-gray-400 block mb-0.5">Pipedrive</span>
                    <span className="font-medium text-gray-700 block text-[11px]">{crit.pipedrive}</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <span className="text-[10px] text-gray-400 block mb-0.5">Streak</span>
                    <span className="font-medium text-gray-700 block text-[11px]">{crit.streak}</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <span className="text-[10px] text-gray-400 block mb-0.5">FUB</span>
                    <span className="font-medium text-gray-700 block text-[11px]">{crit.followupboss}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic AdSense In-Content Slot */}
        <AdSenseAd slot="inContentAd" className="w-full my-6" />

        {/* 3. Reusable comparison slug references linking to individual head-to-heads */}
        <div className="bg-gray-100/50 p-6 rounded-2xl border border-gray-200 space-y-4">
          <h3 className="text-md font-bold text-primary font-display">Deep-Dive Side-by-Side Duels</h3>
          <p className="text-xs text-gray-500">
            Need to evaluate two specific systems? Jump directly into our comprehensive head-to-head showdown reviews:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {comparisons.map(comp => (
              <div 
                key={comp.id} 
                onClick={() => onNavigate(`/compare/${comp.slug}`)}
                className="bg-white p-4 rounded-xl border border-gray-100 hover:border-accent hover:shadow-sm cursor-pointer transition flex items-center justify-between"
              >
                <div>
                  <strong className="text-xs text-primary font-display block">{comp.title.replace(' (2026)', '')}</strong>
                  <span className="text-[10px] text-gray-400 mt-0.5 block">Category winner walk-throughs</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  }

  // Head-to-Head Duel Detail view (State 3)
  if (!currentComp) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <AlertCircle className="w-12 h-12 text-accent mx-auto" />
        <h2 className="text-2xl font-bold text-primary font-display">Comparison Page Not Found</h2>
        <p className="text-gray-500 text-sm">The comparison slug you requested does not exist or has been modified in the CMS.</p>
        <button onClick={() => onNavigate('/compare')} className="px-4 py-2 bg-primary text-white font-bold rounded-xl text-xs">
          Return to comparisons matrix
        </button>
      </div>
    );
  }

  // Find actual CRMs in review records
  const crmA = reviews.find(r => r.id === currentComp.crmAId);
  const crmB = reviews.find(r => r.id === currentComp.crmBId);

  if (!crmA || !crmB) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-2xl font-bold text-primary font-display">Data Sync Error</h2>
        <p className="text-gray-500 text-sm">This comparison refers to CRM records ({currentComp.crmAId} and {currentComp.crmBId}) that are missing from the review CMS database.</p>
        <button onClick={() => onNavigate('/')} className="px-4 py-2 bg-primary text-white font-bold rounded-xl text-xs">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* 1. Duel Header Box */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xs text-center space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-accent/15 text-primary text-[10px] font-bold rounded-full uppercase">
            ⚔️ Side-by-Side Showdown
          </span>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary text-accent hover:bg-primary/90 font-black text-[10px] uppercase tracking-widest rounded-full shadow-xs cursor-pointer transition active:scale-95"
            title="Generate a printer-friendly summary PDF of selected CRMs"
          >
            <Printer className="w-3.5 h-3.5 text-accent" /> Download Comparison (PDF)
          </button>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-primary font-display leading-tight">
          {currentComp.title}
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed max-w-2xl mx-auto">
          We pit {crmA.name} and {crmB.name} directly together across customized categories crucial to a solo real estate broker.
        </p>

        {/* Duel VS layout */}
        <div className="flex items-center justify-center gap-4 md:gap-8 pt-4">
          <div 
            onClick={() => onNavigate(`/reviews/${crmA.slug}`)}
            className="p-4 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-2xl cursor-pointer text-center space-y-2 shrink-0 w-28 md:w-36 transition"
          >
            <span className="text-3xl block">{crmA.logo}</span>
            <strong className="text-sm text-primary block">{crmA.name}</strong>
            <span className="text-[10px] text-gray-400 font-semibold font-mono">★ {crmA.overallScore}/10</span>
          </div>

          <span className="text-lg font-mono font-bold text-gray-400 px-3 py-1.5 bg-gray-100 rounded-full">VS</span>

          <div 
            onClick={() => onNavigate(`/reviews/${crmB.slug}`)}
            className="p-4 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-2xl cursor-pointer text-center space-y-2 shrink-0 w-28 md:w-36 transition"
          >
            <span className="text-3xl block">{crmB.logo}</span>
            <strong className="text-sm text-primary block">{crmB.name}</strong>
            <span className="text-[10px] text-gray-400 font-semibold font-mono">★ {crmB.overallScore}/10</span>
          </div>
        </div>
      </div>

      {/* 2. Winner Category Cards */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-primary font-display flex items-center gap-2">
          🏆 Category-by-Category Winner Verdicts
        </h2>

        <div className="space-y-4">
          {Object.entries(currentComp.categoryWinners).map(([category, details]) => {
            const isWinnerA = details.winnerId === crmA.id;
            const isWinnerB = details.winnerId === crmB.id;
            const isDraw = details.winnerId === 'draw';
            
            const winnerName = isWinnerA ? crmA.name : isWinnerB ? crmB.name : 'Tie / Draw';
            const winnerLogo = isWinnerA ? crmA.logo : isWinnerB ? crmB.logo : '🤝';

            return (
              <div key={category} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-gray-50">
                  <h4 className="font-bold text-primary font-display">{category}</h4>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                    isDraw ? 'bg-gray-100 text-gray-600' : 'bg-success/10 text-success border border-success/20'
                  }`}>
                    <span>Winner: {winnerLogo} {winnerName}</span>
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed font-sans">
                  {details.reason}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic AdSense In-Content Slot */}
      <AdSenseAd slot="inContentAd" className="w-full" />

      {/* 3. Overall Verdict Banner */}
      <div className="bg-primary text-white p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-md">
        <div className="absolute right-0 top-0 -mr-12 -mt-12 w-48 h-48 bg-accent/15 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="space-y-3 relative z-10">
          <span className="text-accent text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 bg-accent/15 border border-accent/25 rounded-full">
            Our Hand-Tested Verdict Summary
          </span>
          <p className="text-gray-100 text-sm md:text-base leading-relaxed font-sans font-medium">
            {currentComp.verdictSummary}
          </p>
          
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <a
              href={crmA.affiliateLink}
              target="_blank"
              referrerPolicy="no-referrer"
              className="px-5 py-3 bg-accent hover:bg-accent/90 text-primary font-bold text-xs rounded-xl shadow-xs text-center flex items-center justify-center gap-1 cursor-pointer"
            >
              Try {crmA.name} Trial &rarr;
            </a>
            <a
              href={crmB.affiliateLink}
              target="_blank"
              referrerPolicy="no-referrer"
              className="px-5 py-3 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs rounded-xl shadow-xs text-center flex items-center justify-center gap-1 cursor-pointer"
            >
              Try {crmB.name} Trial &rarr;
            </a>
            <button
              onClick={() => onNavigate('/compare')}
              className="px-5 py-3 bg-transparent hover:underline text-gray-300 font-semibold text-xs text-center cursor-pointer"
            >
              Return to comparisons matrix
            </button>
          </div>
        </div>
      </div>

      {/* Newsletter Signup in Article Footer */}
      <div className="pt-6 border-t border-gray-100">
        <NewsletterSignup />
      </div>

    </article>
  );
}
