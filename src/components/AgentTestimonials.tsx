import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ClipboardCheck, ArrowUpRight } from 'lucide-react';

/**
 * Editorial findings, not testimonials. Every strength and trade-off below is
 * taken from CRMSolo's own published review of the platform, so the section
 * describes documented product behaviour instead of attributing quotes to
 * customers who were never interviewed.
 */
interface EditorialFinding {
  id: string;
  crmName: string;
  slug: string;
  score: number;
  priceLabel: string;
  bestFor: string;
  strengths: string[];
  tradeOffs: string[];
  bgColor: string;
  textColor: string;
}

const FINDINGS: EditorialFinding[] = [
  {
    id: 'pipedrive',
    crmName: 'Pipedrive',
    slug: 'pipedrive-for-real-estate-agents',
    score: 9.2,
    priceLabel: 'from $14/mo',
    bestFor: 'Visual pipelines & habit-forming deal management',
    strengths: [
      'The clean, visual layout maps perfectly to real estate pipeline stages (e.g. Active Listing, Under Contract, Closing).',
      'The mobile app is blazing fast — upload photo showing notes or schedule next check-in while sitting in your car.',
      'Extremely custom-field-friendly: we added fields for listing date, contract expiration, and loan condition deadlines in under 2 minutes.',
      'No clunky legacy enterprise bloat. It gets out of your way.'
    ],
    tradeOffs: [
      'There is no permanent free tier — after the 14-day trial, you must subscribe.',
      'To get automated email follow-up templates, you must pay for the Advanced plan ($29/mo).',
      'No native client-portal options, meaning you cannot share a direct deal checklist with your buyer.'
    ],
    bgColor: 'bg-primary/5',
    textColor: 'text-primary'
  },
  {
    id: 'streak',
    crmName: 'Streak',
    slug: 'streak-for-real-estate-agents',
    score: 9.0,
    priceLabel: 'free tier',
    bestFor: 'Gmail-native workflow and zero-friction inbox organization',
    strengths: [
      'No separate web browser tab required — it lives entirely inside your standard Gmail inbox layout.',
      'Unmatched ease of use: looks and feels like a beautiful spreadsheet layered on top of your email threads.',
      'The Free tier is highly capable, letting you track unlimited deals and log emails with zero friction.',
      'Excellent email open tracking tells you exactly who is reading your property sheets and when.'
    ],
    tradeOffs: [
      'Completely dependent on Google Workspace ecosystem — if you use Outlook, Safari Mail, or Apple Mail, Streak is unusable.',
      'Does not have a robust built-in meeting scheduler link, requiring you to use third-party tools like Calendly.',
      "The mobile app relies on Gmail's native UI, which can feel less robust for advanced on-the-road CRM features."
    ],
    bgColor: 'bg-accent/10',
    textColor: 'text-accent'
  },
  {
    id: 'followupboss',
    crmName: 'Follow Up Boss',
    slug: 'followupboss-for-real-estate-agents',
    score: 9.5,
    priceLabel: 'from $69/mo',
    bestFor: 'Active lead conversion & high-volume lead follow-up',
    strengths: [
      'Highly specialized for real estate out-of-the-box — hooks into the major portals and local listing services instantly with zero setup.',
      'Action Plans are the best automated follow-up sequences in the industry, letting you nurture incoming leads on day one.',
      'The mobile app is a powerhouse: dial contacts, send texts, log call recordings, and view listings in real-time.',
      'Exceptional customer support team that understands the real estate transaction cycle inside and out.'
    ],
    tradeOffs: [
      'No free tier — after the 14-day trial, the entry price is $69/mo, which is high for brand new agents on a strict budget.',
      'Pricing can escalate quickly if you add assistants or want the built-in dialer plan.',
      "Does not have a strict, visual stage-change checklist enforcement tool like Pipedrive's deal-stage locks."
    ],
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800'
  },
  {
    id: 'wise-agent',
    crmName: 'Wise Agent',
    slug: 'wise-agent-crm-for-real-estate',
    score: 8.9,
    priceLabel: 'flat $49/mo',
    bestFor: 'Transaction checklists & built-in marketing tools at a flat price',
    strengths: [
      'Flat pricing ($49/mo) includes transaction management, lead automation, and landing page creation with no hidden upcharges.',
      'Native real estate date calculators automatically calculate closing deadlines and commission splits.',
      'All-in-one scope means fewer separate subscriptions for a solo agent to manage.'
    ],
    tradeOffs: [
      'The user interface feels slightly dated compared to modern sleek SaaS tools like Pipedrive.',
      'The mobile app is functional but lacks the fluid animations and polished swipe gestures of Follow Up Boss.'
    ],
    bgColor: 'bg-primary/5',
    textColor: 'text-primary'
  },
  {
    id: 'copper',
    crmName: 'Copper CRM',
    slug: 'copper-crm-for-real-estate-agents',
    score: 9.1,
    priceLabel: 'from $29/mo',
    bestFor: 'Google Workspace power users & automated contact scraping',
    strengths: [
      'Officially endorsed by Google: integrates so deeply into Gmail that you never have to leave your inbox to manage buyers.',
      'Scrapes contact phone numbers, email addresses, and company details automatically, eliminating manual data entry.'
    ],
    tradeOffs: [
      'Completely useless if your agency uses Microsoft Outlook or Office 365.',
      'Starting price of $29/mo is higher than Streak, and the Starter tier limits you to 2,500 contacts.'
    ],
    bgColor: 'bg-accent/10',
    textColor: 'text-accent'
  }
];

export default function AgentTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopAutoPlay = () => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
  };

  useEffect(() => {
    stopAutoPlay();
    if (isAutoPlaying) {
      autoPlayTimerRef.current = setInterval(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev === FINDINGS.length - 1 ? 0 : prev + 1));
      }, 8000);
    }
    return stopAutoPlay;
  }, [currentIndex, isAutoPlaying]);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? FINDINGS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === FINDINGS.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const current = FINDINGS[currentIndex];

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? 100 : -100, opacity: 0 })
  };

  return (
    <section
      id="editorial-findings"
      className="bg-white border-y border-gray-100 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      onMouseEnter={stopAutoPlay}
      onMouseLeave={() => setIsAutoPlaying((v) => v)}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-xs">
            <ClipboardCheck className="w-3.5 h-3.5 text-accent" />
            CRMSolo Editorial Findings
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-primary font-display uppercase tracking-tighter">
            WHAT OUR REVIEWS FOUND
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
            Strengths and trade-offs taken directly from our published reviews of each platform. These are editorial
            assessments of documented product behaviour — not customer testimonials.
          </p>
        </div>

        <div className="relative min-h-[460px] md:min-h-[380px] bg-gray-50 border-2 border-primary/10 rounded-xs p-6 sm:p-10 flex flex-col justify-between shadow-xs">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="space-y-5 select-none relative z-10"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${current.bgColor} ${current.textColor} border-current/10`}>
                    {current.crmName}
                  </span>
                  <span className="text-xs font-mono font-black text-primary">
                    {current.score.toFixed(1)} / 10 editorial score
                  </span>
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                    {current.priceLabel}
                  </span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5 text-left">
                <div>
                  <h3 className="text-[10px] font-mono uppercase tracking-widest font-black text-emerald-700 mb-2">
                    What works
                  </h3>
                  <ul className="space-y-1.5">
                    {current.strengths.map((item, i) => (
                      <li key={i} className="text-sm text-primary leading-snug flex gap-2">
                        <span className="text-emerald-600 shrink-0 font-bold">+</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-[10px] font-mono uppercase tracking-widest font-black text-amber-700 mb-2">
                    Trade-offs
                  </h3>
                  <ul className="space-y-1.5">
                    {current.tradeOffs.map((item, i) => (
                      <li key={i} className="text-sm text-gray-600 leading-snug flex gap-2">
                        <span className="text-amber-600 shrink-0 font-bold">&minus;</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-200/60">
                <span className="text-[10px] font-mono uppercase font-black text-gray-400 bg-gray-200/50 px-2 py-1 rounded-xs">
                  Best for: {current.bestFor}
                </span>
                <a
                  href={`/reviews/${current.slug}`}
                  className="inline-flex items-center gap-1 text-[10px] font-mono uppercase font-black text-primary hover:text-accent transition shrink-0"
                >
                  Read full review
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-6 right-auto z-20">
            <button
              onClick={handlePrev}
              className="w-10 h-10 bg-white hover:bg-gray-100 text-primary border border-gray-200 hover:border-gray-400 rounded-full flex items-center justify-center shadow-md transition active:scale-95 cursor-pointer"
              aria-label="Previous finding"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 -right-4 sm:-right-6 left-auto z-20">
            <button
              onClick={handleNext}
              className="w-10 h-10 bg-white hover:bg-gray-100 text-primary border border-gray-200 hover:border-gray-400 rounded-full flex items-center justify-center shadow-md transition active:scale-95 cursor-pointer"
              aria-label="Next finding"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 mt-8">
          <div className="flex gap-2">
            {FINDINGS.map((finding, idx) => (
              <button
                key={finding.id}
                onClick={() => handleDotClick(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-8 bg-accent' : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to finding ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="text-[10px] font-mono uppercase font-bold text-gray-400 hover:text-gray-600 transition tracking-widest bg-gray-100 px-2 py-0.5 rounded-xs"
          >
            {isAutoPlaying ? '⏸ PAUSE AUTO' : '▶ PLAY AUTO'}
          </button>
        </div>
      </div>
    </section>
  );
}
