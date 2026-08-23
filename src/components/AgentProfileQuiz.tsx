import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle2, 
  ExternalLink, 
  Award, 
  Zap, 
  TrendingUp, 
  Mail, 
  Kanban, 
  Smartphone, 
  Users, 
  Layers, 
  Target, 
  DollarSign,
  ShieldCheck,
  Star
} from 'lucide-react';
import { CRMReview } from '../types';

interface AgentProfileQuizProps {
  reviews: CRMReview[];
  onNavigate: (path: string) => void;
  className?: string;
}

// PIPEDRIVE REFERRAL LINK
const PIPEDRIVE_REFERRAL_URL = 'https://www.pipedrive.com/taf/WHY0MH';

export default function AgentProfileQuiz({ reviews, onNavigate, className = '' }: AgentProfileQuizProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [leadVolume, setLeadVolume] = useState<string>('');
  const [techStack, setTechStack] = useState<string>('');
  const [businessFocus, setBusinessFocus] = useState<string>('');
  const [showResult, setShowResult] = useState<boolean>(false);

  // Helper to grab specific review details
  const getReview = (id: string) => reviews.find(r => r.id === id);

  // Handle Option Select & Next Step
  const handleSelectLeadVolume = (value: string) => {
    setLeadVolume(value);
    setCurrentStep(2);
  };

  const handleSelectTechStack = (value: string) => {
    setTechStack(value);
    setCurrentStep(3);
  };

  const handleSelectBusinessFocus = (value: string) => {
    setBusinessFocus(value);
    setShowResult(true);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setLeadVolume('');
    setTechStack('');
    setBusinessFocus('');
    setShowResult(false);
  };

  // Calculate CRM Match Scores based on answers
  const calculateMatches = () => {
    let pipedriveScore = 0;
    let streakScore = 0;
    let followupbossScore = 0;

    const reasons: { [key: string]: string[] } = {
      pipedrive: [],
      streak: [],
      followupboss: []
    };

    // 1. Lead Volume Scoring
    if (leadVolume === '1-10') {
      streakScore += 4;
      pipedriveScore += 3;
      followupbossScore += 1;
      reasons.streak.push('Perfect for low-to-medium lead volume without bloated software overhead');
      reasons.pipedrive.push('Manageable for solo agents scaling up from spreadsheets');
    } else if (leadVolume === '11-35') {
      pipedriveScore += 5;
      streakScore += 2;
      followupbossScore += 3;
      reasons.pipedrive.push('Optimal volume for visual drag-and-drop pipeline stages');
      reasons.followupboss.push('Handles active lead routing effectively');
    } else if (leadVolume === '36+') {
      followupbossScore += 6;
      pipedriveScore += 3;
      streakScore += 1;
      reasons.followupboss.push('Built specifically for high lead volume & instant auto-responders');
      reasons.pipedrive.push('Supports multiple concurrent pipelines and custom automation filters');
    }

    // 2. Tech Stack & Environment Scoring
    if (techStack === 'gmail') {
      streakScore += 6;
      pipedriveScore += 2;
      followupbossScore += 1;
      reasons.streak.push('Operates 100% inside Google Workspace & Gmail without switching tabs');
      reasons.pipedrive.push('Offers full 2-way Gmail sync & calendar scheduling');
    } else if (techStack === 'kanban') {
      pipedriveScore += 6;
      streakScore += 2;
      followupbossScore += 2;
      reasons.pipedrive.push('Industry-best visual Kanban deal board with mobile app for on-the-go showings');
      reasons.followupboss.push('Provides stage tracking lists');
    } else if (techStack === 'portals') {
      followupbossScore += 6;
      pipedriveScore += 2;
      streakScore += 1;
      reasons.followupboss.push('Native integrations with Zillow, Realtor.com, Ylopo, and lead portals');
      reasons.pipedrive.push('Integrates with Zapier for portal lead ingestion');
    }

    // 3. Business Focus Scoring
    if (businessFocus === 'listing') {
      pipedriveScore += 5;
      streakScore += 3;
      followupbossScore += 2;
      reasons.pipedrive.push('Ideal for custom transaction milestones (Inspection, Appraisal, Escrow, Closing)');
    } else if (businessFocus === 'buyer') {
      followupbossScore += 5;
      pipedriveScore += 3;
      streakScore += 2;
      reasons.followupboss.push('Maximizes speed-to-lead for buyer inquiries and instant automated text sequences');
    } else if (businessFocus === 'minimalist') {
      streakScore += 5;
      pipedriveScore += 4;
      followupbossScore += 1;
      reasons.streak.push('Lowest cost barrier with a permanent free plan directly inside Chrome');
      reasons.pipedrive.push('Low starting tier ($14/mo) with zero bloated feature clutter');
    }

    // Convert raw points to Match Percentages
    const maxPossible = 17;
    const pipedrivePct = Math.min(99, Math.round((pipedriveScore / maxPossible) * 100) + 20);
    const streakPct = Math.min(98, Math.round((streakScore / maxPossible) * 100) + 18);
    const followupbossPct = Math.min(97, Math.round((followupbossScore / maxPossible) * 100) + 15);

    const matchResults = [
      { id: 'pipedrive', name: 'Pipedrive', percentage: pipedrivePct, score: pipedriveScore, reasons: reasons.pipedrive, review: getReview('pipedrive') },
      { id: 'streak', name: 'Streak for Gmail', percentage: streakPct, score: streakScore, reasons: reasons.streak, review: getReview('streak') },
      { id: 'followupboss', name: 'Follow Up Boss', percentage: followupbossPct, score: followupbossScore, reasons: reasons.followupboss, review: getReview('followupboss') }
    ].sort((a, b) => b.percentage - a.percentage);

    return matchResults;
  };

  const results = showResult ? calculateMatches() : [];
  const topMatch = results[0];

  return (
    <div className={`bg-slate-950 text-white rounded-xs border-2 border-primary/40 shadow-2xl relative overflow-hidden ${className}`}>
      
      {/* Background Decorative Lighting */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-accent/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-primary/30 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Container */}
      <div className="p-6 sm:p-10 relative z-10 max-w-4xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-accent/15 border border-accent/30 text-accent text-[11px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            Interactive Agent Profile Quiz
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-display uppercase tracking-tight text-white">
            Find Your Exact CRM Match in 30 Seconds
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Answer 3 quick questions about your monthly lead volume, tech stack, and primary workflow to receive an instant data-backed recommendation.
          </p>
        </div>

        {/* Progress Bar (Visible during quiz steps) */}
        {!showResult && (
          <div className="space-y-2 max-w-md mx-auto">
            <div className="flex justify-between items-center text-[11px] font-mono font-bold uppercase text-slate-400">
              <span>Step {currentStep} of 3</span>
              <span className="text-accent">{Math.round((currentStep / 3) * 100)}% Completed</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <motion.div 
                className="bg-accent h-full rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Quiz Step 1: Lead Volume */}
        <AnimatePresence mode="wait">
          {!showResult && currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6 max-w-2xl mx-auto"
            >
              <div className="text-center space-y-1">
                <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider block">Question 1</span>
                <h3 className="text-lg sm:text-xl font-bold text-white font-display uppercase tracking-tight">
                  What is your average monthly lead volume?
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => handleSelectLeadVolume('1-10')}
                  className="p-5 bg-slate-900 border-2 border-slate-800 hover:border-accent hover:bg-slate-800/90 rounded-xs text-left transition-all group cursor-pointer flex flex-col justify-between space-y-4"
                >
                  <div className="w-10 h-10 rounded-xs bg-slate-800 text-accent group-hover:bg-accent group-hover:text-slate-950 flex items-center justify-center font-black transition">
                    1
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-accent transition">1 – 10 Leads / Mo</div>
                    <div className="text-xs text-slate-400 mt-1">Selective solo flow, repeat &amp; referral clients</div>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectLeadVolume('11-35')}
                  className="p-5 bg-slate-900 border-2 border-slate-800 hover:border-accent hover:bg-slate-800/90 rounded-xs text-left transition-all group cursor-pointer flex flex-col justify-between space-y-4"
                >
                  <div className="w-10 h-10 rounded-xs bg-slate-800 text-accent group-hover:bg-accent group-hover:text-slate-950 flex items-center justify-center font-black transition">
                    2
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-accent transition">11 – 35 Leads / Mo</div>
                    <div className="text-xs text-slate-400 mt-1">Active solo listing specialist, open house leads</div>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectLeadVolume('36+')}
                  className="p-5 bg-slate-900 border-2 border-slate-800 hover:border-accent hover:bg-slate-800/90 rounded-xs text-left transition-all group cursor-pointer flex flex-col justify-between space-y-4"
                >
                  <div className="w-10 h-10 rounded-xs bg-slate-800 text-accent group-hover:bg-accent group-hover:text-slate-950 flex items-center justify-center font-black transition">
                    3
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-accent transition">36+ Leads / Mo</div>
                    <div className="text-xs text-slate-400 mt-1">High volume, Zillow/Realtor.com buyer leads</div>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* Quiz Step 2: Tech Stack */}
          {!showResult && currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6 max-w-2xl mx-auto"
            >
              <div className="text-center space-y-1">
                <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider block">Question 2</span>
                <h3 className="text-lg sm:text-xl font-bold text-white font-display uppercase tracking-tight">
                  What is your preferred daily tech stack &amp; environment?
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => handleSelectTechStack('gmail')}
                  className="p-5 bg-slate-900 border-2 border-slate-800 hover:border-accent hover:bg-slate-800/90 rounded-xs text-left transition-all group cursor-pointer flex flex-col justify-between space-y-4"
                >
                  <div className="w-10 h-10 rounded-xs bg-slate-800 text-accent group-hover:bg-accent group-hover:text-slate-950 flex items-center justify-center transition">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-accent transition">Google / Gmail Heavy</div>
                    <div className="text-xs text-slate-400 mt-1">Prefer working 100% inside Gmail without switching tabs</div>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectTechStack('kanban')}
                  className="p-5 bg-slate-900 border-2 border-slate-800 hover:border-accent hover:bg-slate-800/90 rounded-xs text-left transition-all group cursor-pointer flex flex-col justify-between space-y-4"
                >
                  <div className="w-10 h-10 rounded-xs bg-slate-800 text-accent group-hover:bg-accent group-hover:text-slate-950 flex items-center justify-center transition">
                    <Kanban className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-accent transition">Visual Board &amp; Mobile App</div>
                    <div className="text-xs text-slate-400 mt-1">Drag-and-drop deal board with smartphone app on showings</div>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectTechStack('portals')}
                  className="p-5 bg-slate-900 border-2 border-slate-800 hover:border-accent hover:bg-slate-800/90 rounded-xs text-left transition-all group cursor-pointer flex flex-col justify-between space-y-4"
                >
                  <div className="w-10 h-10 rounded-xs bg-slate-800 text-accent group-hover:bg-accent group-hover:text-slate-950 flex items-center justify-center transition">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-accent transition">Portal &amp; Lead Auto-Responder</div>
                    <div className="text-xs text-slate-400 mt-1">Instant Zillow/Realtor.com ingestion with automated SMS</div>
                  </div>
                </button>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Step 1
                </button>
              </div>
            </motion.div>
          )}

          {/* Quiz Step 3: Business Focus */}
          {!showResult && currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6 max-w-2xl mx-auto"
            >
              <div className="text-center space-y-1">
                <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider block">Question 3</span>
                <h3 className="text-lg sm:text-xl font-bold text-white font-display uppercase tracking-tight">
                  What is your primary operational focus &amp; priority?
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => handleSelectBusinessFocus('listing')}
                  className="p-5 bg-slate-900 border-2 border-slate-800 hover:border-accent hover:bg-slate-800/90 rounded-xs text-left transition-all group cursor-pointer flex flex-col justify-between space-y-4"
                >
                  <div className="w-10 h-10 rounded-xs bg-slate-800 text-accent group-hover:bg-accent group-hover:text-slate-950 flex items-center justify-center transition">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-accent transition">Listing &amp; Escrow Control</div>
                    <div className="text-xs text-slate-400 mt-1">Stage-by-stage transaction tracking &amp; activity reminders</div>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectBusinessFocus('buyer')}
                  className="p-5 bg-slate-900 border-2 border-slate-800 hover:border-accent hover:bg-slate-800/90 rounded-xs text-left transition-all group cursor-pointer flex flex-col justify-between space-y-4"
                >
                  <div className="w-10 h-10 rounded-xs bg-slate-800 text-accent group-hover:bg-accent group-hover:text-slate-950 flex items-center justify-center transition">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-accent transition">Speed-to-Lead &amp; Conversion</div>
                    <div className="text-xs text-slate-400 mt-1">Instantly text and follow up with buyer inquiries 24/7</div>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectBusinessFocus('minimalist')}
                  className="p-5 bg-slate-900 border-2 border-slate-800 hover:border-accent hover:bg-slate-800/90 rounded-xs text-left transition-all group cursor-pointer flex flex-col justify-between space-y-4"
                >
                  <div className="w-10 h-10 rounded-xs bg-slate-800 text-accent group-hover:bg-accent group-hover:text-slate-950 flex items-center justify-center transition">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-accent transition">Low Monthly Overhead</div>
                    <div className="text-xs text-slate-400 mt-1">Simple setup, budget-friendly starting tiers, zero fluff</div>
                  </div>
                </button>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Step 2
                </button>
              </div>
            </motion.div>
          )}

          {/* Quiz Results Card */}
          {showResult && topMatch && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Top Winner Card */}
              <div className="bg-slate-900 border-2 border-accent p-6 sm:p-8 rounded-xs space-y-6 relative shadow-xl">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 bg-accent text-slate-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-xs">
                      <Award className="w-3.5 h-3.5" /> Your #1 Recommended CRM Match
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-tight flex items-center gap-3 pt-1">
                      <span className="text-3xl">{topMatch.review?.logo || '💼'}</span>
                      {topMatch.name}
                    </h3>
                  </div>

                  {/* Match Score Badge */}
                  <div className="bg-slate-950 border border-slate-700 px-5 py-3 rounded-xs text-center shrink-0">
                    <div className="text-2xl font-black font-mono text-accent">
                      {topMatch.percentage}%
                    </div>
                    <div className="text-[9px] font-mono uppercase tracking-wider text-slate-400">
                      Match Score
                    </div>
                  </div>
                </div>

                {/* Pitch & Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono font-bold uppercase text-accent tracking-wider">
                      Why This Fits Your Agent Profile:
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {topMatch.review?.oneLinePitch}
                    </p>

                    <div className="space-y-2 pt-2">
                      {topMatch.reasons.map((reason, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                          <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-xs border border-slate-800 space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-mono">Overall Editor Score:</span>
                        <span className="text-accent font-bold font-mono">★ {topMatch.review?.overallScore || '9.2'} / 10</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-mono">Best For:</span>
                        <span className="text-white font-bold">{topMatch.review?.bestFor || 'Pipeline Management'}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-mono">Starting Price:</span>
                        <span className="text-white font-bold">
                          {topMatch.review?.pricingTiers?.[0]?.price === 0 ? 'Free Plan Available' : `From $${topMatch.review?.pricingTiers?.[0]?.price || 14}/mo`}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons for Top Match */}
                    <div className="space-y-2 pt-2">
                      {topMatch.id === 'pipedrive' ? (
                        <a
                          href={PIPEDRIVE_REFERRAL_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3.5 bg-accent hover:bg-accent/90 text-slate-950 font-black uppercase tracking-widest text-xs rounded-xs shadow-md transition duration-150 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Claim Exclusive Pipedrive Offer &amp; Free Trial</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      ) : (
                        <a
                          href={topMatch.review?.affiliateLink || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3.5 bg-accent hover:bg-accent/90 text-slate-950 font-black uppercase tracking-widest text-xs rounded-xs shadow-md transition duration-150 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Explore {topMatch.name} Official Site</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}

                      <button
                        onClick={() => onNavigate(`/reviews/${topMatch.review?.slug || 'pipedrive-for-real-estate-agents'}`)}
                        className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase tracking-wider rounded-xs transition cursor-pointer text-center"
                      >
                        Read Full Independent Review
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Runner-Up Options Breakdown */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
                  How Other CRM Options Ranked for You:
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {results.slice(1).map((crm) => (
                    <div key={crm.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xs space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="font-bold text-white text-sm flex items-center gap-2">
                            <span>{crm.review?.logo}</span>
                            {crm.name}
                          </div>
                          <span className="text-xs font-mono font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded-xs border border-slate-800">
                            {crm.percentage}% Match
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {crm.review?.oneLinePitch}
                        </p>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-slate-800/60">
                        {crm.id === 'pipedrive' ? (
                          <a
                            href={PIPEDRIVE_REFERRAL_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
                          >
                            Pipedrive Link <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <button
                            onClick={() => onNavigate(`/reviews/${crm.review?.slug}`)}
                            className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1"
                          >
                            View Review &rarr;
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reset / Retake Footer */}
              <div className="text-center pt-2">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-accent transition cursor-pointer py-2 px-4 bg-slate-900 border border-slate-800 rounded-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz &amp; Adjust Answers
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
