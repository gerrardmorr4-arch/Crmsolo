import { useState } from 'react';
import { CRMReview } from '../types';
import Markdown from '../components/Markdown';
import { Check, X, Star, Calendar, DollarSign, ArrowUpRight, Shield, Award, Sparkles, Printer, HelpCircle, ChevronDown } from 'lucide-react';
import NewsletterSignup from '../components/NewsletterSignup';
import { useSEO } from '../lib/seo';
import AdSenseAd from '../components/AdSenseAd';
import ReviewPrintPreviewModal from '../components/ReviewPrintPreviewModal';
import TableOfContents, { TocItem } from '../components/TableOfContents';

interface ReviewDetailProps {
  crm: CRMReview;
  onNavigate: (path: string) => void;
}

export default function ReviewDetail({ crm, onNavigate }: ReviewDetailProps) {
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Generate review-specific FAQs for display and JSON-LD schema
  const reviewFaqs = [
    {
      question: `Is ${crm.name} recommended for a solo real estate agent?`,
      answer: `${crm.name} is rated ${crm.overallScore}/10 on CRMSolo. It is specifically best for ${crm.bestFor.toLowerCase()}. Verdict summary: "${crm.verdict}"`
    },
    {
      question: `How much does ${crm.name} cost for real estate agents?`,
      answer: `${crm.name} pricing tiers range from $${crm.pricingTiers[0]?.price ?? 0}/month to $${crm.pricingTiers[crm.pricingTiers.length - 1]?.price ?? 0}/month. The standard starting plan (${crm.pricingTiers[0]?.name ?? 'Starter'}) is $${crm.pricingTiers[0]?.price ?? 0}/mo per user.`
    },
    {
      question: `What are the top pros and cons of ${crm.name}?`,
      answer: `Top Pros: ${crm.pros.slice(0, 2).join(' ')} Limitations: ${crm.cons.slice(0, 2).join(' ')}`
    },
    {
      question: `How well does ${crm.name} work on mobile devices?`,
      answer: `${crm.name} scores ${crm.ratingBreakdown.mobileApp}/10 for mobile app functionality. Solo realtors can log showing notes, call buyers, and track deal stages directly from their smartphone.`
    },
    {
      question: `Does ${crm.name} offer a free trial or money-back guarantee?`,
      answer: `Yes, ${crm.name} offers a free trial or money-back guarantee period so solo real estate agents can test the interface and pipeline setup before committing.`
    }
  ];

  useSEO({
    title: `${crm.name} CRM Review: Real Estate Agent Verdict`,
    description: `Our hands-on independent review of ${crm.name} for solo real estate agents. Rated ${crm.overallScore}/10. ${crm.oneLinePitch}`,
    keywords: [crm.name.toLowerCase(), `${crm.name.toLowerCase()} crm`, `${crm.name.toLowerCase()} review`, 'real estate crm', 'solo realtor crm'],
    ogType: 'article',
    category: 'CRM Comparisons',
    faqSchema: reviewFaqs,
    productSchema: {
      name: `${crm.name} Real Estate CRM`,
      description: crm.oneLinePitch,
      ratingValue: crm.overallScore,
      bestRating: 10,
      authorName: 'CRMSolo Independent Testing Team'
    }
  }, [crm.id, crm.slug]);

  // Extract markdown headers inside detailedReview for TOC navigation
  const extractMarkdownHeaders = (content: string): TocItem[] => {
    if (!content) return [];
    const lines = content.split('\n');
    const items: TocItem[] = [];
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
        const level = trimmed.startsWith('## ') ? 2 : 3;
        const label = trimmed.replace(/^###?\s+/, '');
        const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        items.push({ id, label, level });
      }
    });
    return items;
  };

  const detailedHeaders = extractMarkdownHeaders(crm.detailedReview);

  const tocItems: TocItem[] = [
    { id: 'overview', label: 'Overview & Score', level: 1 },
    { id: 'scorecard', label: 'Criteria Scorecard', level: 1 },
    { id: 'pros-cons', label: 'Pros & Cons', level: 1 },
    { id: 'detailed-review', label: 'In-Depth Walkthrough', level: 1 },
    ...detailedHeaders,
    { id: 'pricing-tiers', label: 'Pricing Options & Tiers', level: 1 },
    { id: 'review-faqs', label: 'Frequently Asked Questions', level: 1 },
    { id: 'verdict', label: 'Final Verdict', level: 1 },
  ];

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* 1. Header Hero Panel */}
      <div id="overview" className="scroll-mt-28 bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xs flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl p-3 bg-gray-50 border border-gray-100 rounded-2xl shadow-xs">{crm.logo}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-primary font-display">
                {crm.name} Review
              </h1>
              <p className="text-xs text-gray-400 font-mono flex items-center gap-1 mt-1">
                <Calendar className="w-3.5 h-3.5" /> Tested &amp; Last Updated: {crm.lastUpdated}
              </p>
            </div>
          </div>
          <p className="text-gray-500 font-medium text-sm md:text-base leading-relaxed">
            "{crm.oneLinePitch}"
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="text-xs font-bold text-primary px-3 py-1 bg-primary/5 rounded-full flex items-center gap-1 border border-primary/5">
              <Award className="w-3.5 h-3.5 text-accent" /> Best for: {crm.bestFor}
            </span>
            <span className="text-xs font-bold text-gray-500 px-3 py-1 bg-gray-100 rounded-full flex items-center gap-1 border border-gray-200">
              <Shield className="w-3.5 h-3.5 text-success" /> Independently Verified
            </span>
            <button
              onClick={() => setIsPrintPreviewOpen(true)}
              className="text-xs font-bold text-primary px-3 py-1 bg-accent/15 hover:bg-accent/25 rounded-full flex items-center gap-1.5 border border-accent/40 transition cursor-pointer active:scale-95"
            >
              <Printer className="w-3.5 h-3.5 text-accent" /> Print Preview &amp; PDF
            </button>
          </div>
        </div>

        {/* Score Board */}
        <div className="w-full md:w-auto shrink-0 flex flex-col items-center p-6 bg-gray-50/50 border border-gray-100 rounded-2xl">
          <span className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">CRMsolo Score</span>
          <span className="text-5xl font-black text-primary font-mono mt-1">
            {crm.overallScore}
          </span>
          <span className="text-[10px] text-gray-400 font-semibold mt-1">out of 10</span>
          
          <div className="mt-4 flex gap-1 text-accent">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < Math.floor(crm.overallScore / 2) ? 'fill-accent text-accent' : 'text-gray-200'}`} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Article Grid: Sticky Sidebar + Detailed Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sticky Table of Contents Sidebar */}
        <div className="lg:col-span-4">
          <TableOfContents items={tocItems} title={`${crm.name} Navigation`} />
        </div>

        {/* Main Content Sections */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* 2. Rating Criteria Breakdown */}
          <div id="scorecard" className="scroll-mt-28 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-primary font-display">Review Criteria Scorecard</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Ease of Use', value: crm.ratingBreakdown.easeOfUse },
                { label: 'Value for Money', value: crm.ratingBreakdown.valueForMoney },
                { label: 'Real Estate Fit', value: crm.ratingBreakdown.realEstateFeatures },
                { label: 'Mobile App Speed', value: crm.ratingBreakdown.mobileApp },
              ].map((item) => (
                <div key={item.label} className="p-4 bg-gray-50/50 border border-gray-100 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs font-medium text-gray-500">
                    <span>{item.label}</span>
                    <span className="font-bold font-mono text-primary">{item.value}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-accent h-full rounded-full transition" 
                      style={{ width: `${item.value * 10}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Pros & Cons Grid */}
          <div id="pros-cons" className="scroll-mt-28 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pros card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
              <h3 className="text-md font-bold text-success font-display flex items-center gap-1.5">
                <Check className="w-5 h-5" /> What we love
              </h3>
              <ul className="space-y-3">
                {crm.pros.map((pro, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-start gap-2.5 leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-success/10 border border-success/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-success" />
                    </span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cons card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
              <h3 className="text-md font-bold text-red-600 font-display flex items-center gap-1.5">
                <X className="w-5 h-5" /> The limitations
              </h3>
              <ul className="space-y-3">
                {crm.cons.map((con, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-start gap-2.5 leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-red-50 border border-red-100 flex items-center justify-center shrink-0 mt-0.5">
                      <X className="w-3 h-3 text-red-600" />
                    </span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4. Detailed Editorial Review Section */}
          <div id="detailed-review" className="scroll-mt-28 bg-white p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
              <span className="text-xl">✍️</span>
              <h2 className="text-xl font-bold text-primary font-display">
                In-Depth Review Walkthrough
              </h2>
            </div>
            <Markdown content={crm.detailedReview} />
          </div>

          {/* 5. Pricing Options Grid */}
          <div id="pricing-tiers" className="scroll-mt-28 space-y-6">
            <div className="text-center md:text-left space-y-1">
              <h3 className="text-2xl font-bold text-primary font-display">Pricing Options &amp; Tiers</h3>
              <p className="text-gray-500 text-sm">
                What you actually pay. No sales calls or hidden commissions required to get started.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {crm.pricingTiers.map((tier, idx) => {
                const isMiddle = idx === 1; // Advanced / Standard / Starter middle tier represents sweet spot
                return (
                  <div 
                    key={tier.name}
                    className={`bg-white rounded-2xl p-6 border flex flex-col justify-between relative overflow-hidden transition duration-150 ${
                      isMiddle ? 'border-accent shadow-md shadow-accent/5 scale-102 z-10' : 'border-gray-100 shadow-xs'
                    }`}
                  >
                    {isMiddle && (
                      <div className="absolute top-0 right-6 -translate-y-1/2 bg-accent text-primary text-[9px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full border border-accent">
                        Solo Sweet Spot
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-bold text-primary font-display">{tier.name}</h4>
                        <div className="flex items-baseline mt-2">
                          <span className="text-3xl font-black font-mono text-primary">${tier.price}</span>
                          <span className="text-xs text-gray-400 ml-1">/ month</span>
                        </div>
                      </div>

                      <ul className="space-y-2.5 pt-4 border-t border-gray-50">
                        {tier.features.map((feat, fIdx) => (
                          <li key={fIdx} className="text-xs text-gray-500 flex items-start gap-1.5 leading-normal">
                            <Check className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-6 mt-6 border-t border-gray-50">
                      <a
                        href={crm.affiliateLink}
                        target="_blank"
                        referrerPolicy="no-referrer"
                        className={`w-full py-2.5 text-center text-xs font-bold rounded-xl block transition active:scale-95 ${
                          isMiddle 
                            ? 'bg-accent hover:bg-accent/90 text-primary' 
                            : 'bg-primary hover:bg-primary/95 text-white'
                        }`}
                      >
                        Select {tier.name} Tier &rarr;
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 6. Review Page FAQ Section (SEO Structured Data Enabled) */}
          <div id="review-faqs" className="scroll-mt-28 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
              <HelpCircle className="w-5 h-5 text-accent" />
              <div>
                <h3 className="text-xl font-bold text-primary font-display">
                  Frequently Asked Questions About {crm.name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Common queries answered for solo real estate agents considering {crm.name}.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {reviewFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-gray-100 rounded-2xl overflow-hidden transition duration-150"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full text-left p-4 bg-gray-50/50 hover:bg-gray-50 flex items-center justify-between gap-4 font-bold text-sm text-primary cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-accent' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="p-4 bg-white text-xs md:text-sm text-gray-600 leading-relaxed border-t border-gray-100 font-sans">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dynamic inline sponsor / article display ad */}
          <AdSenseAd slot="inContentAd" className="w-full" />

          {/* 7. Verdict Conclusion Banner */}
          <div id="verdict" className="scroll-mt-28 bg-primary text-white p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-md">
            <div className="absolute right-0 top-0 -mr-12 -mt-12 w-48 h-48 bg-accent/15 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="space-y-3 relative z-10">
              <span className="text-accent text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 bg-accent/15 border border-accent/25 rounded-full">
                Final Verdict Conclusion
              </span>
              <p className="text-gray-100 text-base font-medium leading-relaxed font-sans">
                "{crm.verdict}"
              </p>
              
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <a
                  href={crm.affiliateLink}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="px-6 py-3 bg-accent hover:bg-accent/90 text-primary font-bold text-xs rounded-xl shadow-sm text-center flex items-center justify-center gap-1 cursor-pointer"
                >
                  Start Your Free Trial with {crm.name} <ArrowUpRight className="w-4 h-4" />
                </a>
                <button
                  onClick={() => onNavigate('/calculator')}
                  className="px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs rounded-xl text-center cursor-pointer"
                >
                  Simulate Net ROI with This CRM
                </button>
                <button
                  onClick={() => setIsPrintPreviewOpen(true)}
                  className="px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs rounded-xl text-center cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4 text-accent" /> Print Review Sheet
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Newsletter Signup in Article Footer */}
      <div className="pt-6 border-t border-gray-100">
        <NewsletterSignup />
      </div>

      {/* Print Preview Modal */}
      <ReviewPrintPreviewModal
        isOpen={isPrintPreviewOpen}
        onClose={() => setIsPrintPreviewOpen(false)}
        crm={crm}
      />

    </article>
  );
}
