import { useState, useEffect } from 'react';
import { CalculatorInputs, CalculatorResults, CRMReview } from '../types';
import { Sparkles, ArrowRight, Info, Share2, Copy, Check, DollarSign, Clock, HelpCircle, Flame, Download, FileSpreadsheet } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateROICalculatorPDF } from '../lib/pdfGenerator';

interface ROICalculatorProps {
  reviews: CRMReview[];
  onNavigateToCRM?: (slug: string) => void;
  compactMode?: boolean;
}

export default function ROICalculator({ reviews, onNavigateToCRM, compactMode = false }: ROICalculatorProps) {
  // Get active CRM standard prices (annual basis)
  const getCrmAnnualPrice = (id: string): number => {
    const crm = reviews.find(r => r.id === id);
    if (!crm) return 0;
    // Use the middle tier as standard representational price
    const tier = crm.pricingTiers[1] || crm.pricingTiers[0];
    return tier ? tier.price * 12 : 0;
  };

  // State for inputs
  const [inputs, setInputs] = useState<CalculatorInputs>({
    leadsPerMonth: 20,
    responseTime: 'few-hours',
    commissionPerDeal: 6000,
    currentCloseRate: 3,
    hoursSpentOnAdmin: 6,
    timeValuePerHour: 50,
    currentToolSpend: 0,
  });

  const [shareCopied, setShareCopied] = useState(false);
  const [resultsCopied, setResultsCopied] = useState(false);
  const [showFootnote, setShowFootnote] = useState(false);

  // Load inputs from URL query params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const leads = params.get('leads');
    const response = params.get('response');
    const commission = params.get('commission');
    const rate = params.get('rate');
    const admin = params.get('admin');
    const value = params.get('value');
    const spend = params.get('spend');

    if (leads || response || commission || rate || admin || value || spend) {
      setInputs({
        leadsPerMonth: leads ? Math.min(100, Math.max(1, parseInt(leads))) : 20,
        responseTime: (response as any) || 'few-hours',
        commissionPerDeal: commission ? parseInt(commission) : 6000,
        currentCloseRate: rate ? Math.min(15, Math.max(1, parseFloat(rate))) : 3,
        hoursSpentOnAdmin: admin ? Math.min(25, Math.max(0, parseInt(admin))) : 6,
        timeValuePerHour: value ? parseInt(value) : 50,
        currentToolSpend: spend ? parseInt(spend) : 0,
      });
    }
  }, []);

  // Recalculate results live
  const calculateResults = (): CalculatorResults => {
    // Step 1: Multiplier
    let multiplier = 1.0;
    if (inputs.responseTime === 'within-1-hour') multiplier = 1.3;
    if (inputs.responseTime === 'few-hours') multiplier = 1.6;
    if (inputs.responseTime === 'next-day') multiplier = 2.1;

    let improvedCloseRate = inputs.currentCloseRate * multiplier;
    if (improvedCloseRate > 20) improvedCloseRate = 20; // Cap at 20%

    const additionalDealsPerYear = ((improvedCloseRate - inputs.currentCloseRate) / 100) * inputs.leadsPerMonth * 12;

    // Step 2: Revenue
    const additionalAnnualRevenue = additionalDealsPerYear * inputs.commissionPerDeal;

    // Step 3: Time savings (Assume 60% automated)
    const hoursSavedPerWeek = inputs.hoursSpentOnAdmin * 0.6;
    const annualValueTimeSaved = hoursSavedPerWeek * 52 * inputs.timeValuePerHour;

    // Step 4: Total Gain
    const totalAnnualGain = additionalAnnualRevenue + annualValueTimeSaved;

    // Step 5: Recommendations
    const currentAnnualSpend = inputs.currentToolSpend * 12;

    const recommendations = ['pipedrive', 'streak', 'followupboss'].map(id => {
      const crm = reviews.find(r => r.id === id);
      const crmName = crm?.name || id;
      const annualCost = getCrmAnnualPrice(id);
      const netRoi = totalAnnualGain - (annualCost - currentAnnualSpend);

      // Rule-based Recommendation
      let isBestFit = false;
      let reason = '';

      if (id === 'streak' && (inputs.currentToolSpend === 0 || inputs.leadsPerMonth <= 15)) {
        isBestFit = true;
        reason = 'Gmail-native workflows and cost-sensitivity make Streak\'s free or cheap Solo plan a perfect start.';
      } else if (id === 'followupboss' && inputs.leadsPerMonth > 15 && inputs.hoursSpentOnAdmin >= 6) {
        isBestFit = true;
        reason = 'High monthly lead volume and nurture needs perfectly justify Follow Up Boss\'s elite conversion tools.';
      } else if (id === 'pipedrive' && inputs.leadsPerMonth > 15 && inputs.hoursSpentOnAdmin < 6) {
        isBestFit = true;
        reason = 'Active listing/buyer deals benefit most from Pipedrive\'s visual Kanban card mapping.';
      }

      return {
        crmName,
        netRoi,
        annualCost,
        isBestFit,
        reason: reason || `${crmName} offers robust standard lead pipelines.`,
        affiliateLink: crm?.affiliateLink || '#',
      };
    });

    // Ensure we have exactly one highest priority "isBestFit" or fallback to highest Net ROI
    const hasBestFit = recommendations.some(r => r.isBestFit);
    if (!hasBestFit) {
      let maxRoiIdx = 0;
      recommendations.forEach((rec, idx) => {
        if (rec.netRoi > recommendations[maxRoiIdx].netRoi) {
          maxRoiIdx = idx;
        }
      });
      recommendations[maxRoiIdx].isBestFit = true;
    } else {
      // Just in case multiple triggered, prioritize based on specific constraints
      const bestFitsCount = recommendations.filter(r => r.isBestFit).length;
      if (bestFitsCount > 1) {
        // Fallback: make highest netRoi of the best fits the singular winner
        let highestFitIdx = -1;
        recommendations.forEach((rec, idx) => {
          if (rec.isBestFit) {
            if (highestFitIdx === -1 || rec.netRoi > recommendations[highestFitIdx].netRoi) {
              highestFitIdx = idx;
            }
          }
        });
        recommendations.forEach((rec, idx) => {
          rec.isBestFit = idx === highestFitIdx;
        });
      }
    }

    // Sort so best fit/highest Net ROI is highlighted nicely
    return {
      improvedCloseRate,
      additionalDealsPerYear,
      additionalAnnualRevenue,
      hoursSavedPerWeek,
      annualValueTimeSaved,
      totalAnnualGain,
      recommendations: recommendations.sort((a, b) => b.netRoi - a.netRoi),
    };
  };

  const results = calculateResults();
  const recommendedCrm = results.recommendations.find(r => r.isBestFit) || results.recommendations[0];

  // Copy shareable link
  const handleCopyLink = () => {
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('leads', inputs.leadsPerMonth.toString());
    url.searchParams.set('response', inputs.responseTime);
    url.searchParams.set('commission', inputs.commissionPerDeal.toString());
    url.searchParams.set('rate', inputs.currentCloseRate.toString());
    url.searchParams.set('admin', inputs.hoursSpentOnAdmin.toString());
    url.searchParams.set('value', inputs.timeValuePerHour.toString());
    url.searchParams.set('spend', inputs.currentToolSpend.toString());

    navigator.clipboard.writeText(url.toString()).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    });
  };

  // Copy structured results to clipboard for emails/reports
  const handleCopyResults = () => {
    const formatResponseTime = (val: string) => {
      switch (val) {
        case 'under-5': return 'Under 5 Minutes';
        case 'within-1-hour': return 'Within 1 Hour';
        case 'few-hours': return 'A Few Hours';
        case 'next-day': return 'Next Day or Later';
        default: return val;
      }
    };

    const netRoiText = results.recommendations.map(r => 
      `* ${r.crmName}: Net ROI of +$${Math.round(r.netRoi).toLocaleString('en-US')}/yr (Cost: $${Math.round(r.annualCost / 12)}/mo)`
    ).join('\n');

    const reportText = `==================================================
SOLO CRM ROI EVALUATION REPORT & ESTIMATE
==================================================
Estimated Annual ROI Benefit: $${Math.round(results.totalAnnualGain).toLocaleString('en-US')} / year

--- INPUT PARAMETERS ---
* Average Monthly Leads: ${inputs.leadsPerMonth} leads
* Current Lead Response Time: ${formatResponseTime(inputs.responseTime)}
* Average Commission per Deal: $${inputs.commissionPerDeal.toLocaleString('en-US')}
* Current Close Rate: ${inputs.currentCloseRate}%
* Manual Follow-up / Admin: ${inputs.hoursSpentOnAdmin} hrs/week
* Agent Hourly Value Rate: $${inputs.timeValuePerHour}/hr
* Current Tool Spend: $${inputs.currentToolSpend}/mo ($${(inputs.currentToolSpend * 12).toLocaleString('en-US')}/yr)

--- ESTIMATED PERFORMANCE LIFT ---
* Improved Close Rate: ${results.improvedCloseRate.toFixed(1)}% (approx. ${((results.improvedCloseRate / inputs.currentCloseRate)).toFixed(1)}x conversion lift)
* Additional Deals Closed: +${results.additionalDealsPerYear.toFixed(1)} closed escrows / year
* New Gross Commission Revenue: +$${Math.round(results.additionalAnnualRevenue).toLocaleString('en-US')} / year
* Administrative Time Reclaimed: ${results.hoursSavedPerWeek.toFixed(1)} hours / week
* Annual Value of Reclaimed Time: $${Math.round(results.annualValueTimeSaved).toLocaleString('en-US')} / year
* Total Performance Gain: +$${Math.round(results.totalAnnualGain).toLocaleString('en-US')} / year

--- RECOMMENDATION & ANALYSIS ---
* Best Match CRM: ${recommendedCrm.crmName}
* Fit Logic: ${recommendedCrm.reason}
* Est. CRM Subscription: $${Math.round(recommendedCrm.annualCost / 12)} / month (billed annually)
* Projected Net ROI: +$${Math.round(recommendedCrm.netRoi).toLocaleString('en-US')} / year (includes subscription offset)

--- COMPARATIVE CRM CHOICES ---
${netRoiText}

Generated by CRMsolo Evaluation Engine (https://crmsolo.com)
==================================================`;

    navigator.clipboard.writeText(reportText).then(() => {
      setResultsCopied(true);
      setTimeout(() => setResultsCopied(false), 2000);
    });
  };

  const [pdfGenerating, setPdfGenerating] = useState(false);

  const handleDownloadPDF = () => {
    setPdfGenerating(true);
    try {
      const doc = generateROICalculatorPDF({
        monthlyLeads: inputs.leadsPerMonth,
        responseTime: inputs.responseTime,
        currentCloseRate: inputs.currentCloseRate,
        avgCommission: inputs.commissionPerDeal,
        hourlyValue: inputs.timeValuePerHour,
        hoursSpentOnAdmin: inputs.hoursSpentOnAdmin,
        currentToolSpend: inputs.currentToolSpend,
        totalAnnualGain: results.totalAnnualGain,
        improvedCloseRate: results.improvedCloseRate,
        additionalDealsPerYear: results.additionalDealsPerYear,
        additionalAnnualRevenue: results.additionalAnnualRevenue,
        hoursSavedPerWeek: results.hoursSavedPerWeek,
        annualValueTimeSaved: results.annualValueTimeSaved,
        recommendations: results.recommendations
      });
      doc.save(`real-estate-crm-roi-forecast-${Math.round(results.totalAnnualGain)}.pdf`);
    } catch (err) {
      console.error('Failed to generate ROI PDF:', err);
    } finally {
      setPdfGenerating(false);
    }
  };

  return (
    <div id="roi-calculator" className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Inputs */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xs shadow-sm border-2 border-primary space-y-6">
          <h3 className="font-display text-xl font-black uppercase tracking-tight text-primary flex items-center gap-2 border-b-2 border-primary pb-3">
            <Flame className="w-5 h-5 text-accent" />
            Your Current Numbers
          </h3>
          
          {/* Slider 1: Leads */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label className="text-gray-600 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
                Average leads per month
                <span className="group relative inline-flex items-center cursor-help">
                  <HelpCircle className="w-3.5 h-3.5 text-gray-400 hover:text-primary transition" />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 bg-slate-900 text-white text-[11px] font-normal leading-relaxed rounded-md shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-30 font-sans normal-case tracking-normal border border-slate-700">
                    <span className="font-bold text-emerald-400 block mb-0.5">Monthly Inbound Volume:</span>
                    Total potential buyer and seller inquiries received. Higher lead counts multiply the gross revenue impact of even subtle close-rate improvements.
                  </span>
                </span>
              </label>
              <span className="font-mono font-black text-xs text-white px-2.5 py-1 bg-primary rounded-xs border border-primary">
                {inputs.leadsPerMonth} leads
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={inputs.leadsPerMonth}
              onChange={(e) => setInputs({ ...inputs, leadsPerMonth: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-100 rounded-xs appearance-none cursor-pointer accent-accent"
            />
            <div className="flex justify-between text-[11px] text-gray-400 font-mono font-bold">
              <span>1</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>

          {/* Dropdown 2: Response Time */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
              Current lead response time
              <span className="group relative inline-flex items-center cursor-help">
                <HelpCircle className="w-3.5 h-3.5 text-gray-400 hover:text-primary transition" />
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-2.5 bg-slate-900 text-white text-[11px] font-normal leading-relaxed rounded-md shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-30 font-sans normal-case tracking-normal border border-slate-700">
                  <span className="font-bold text-amber-400 block mb-0.5">Speed-to-Lead Multiplier:</span>
                  Leads contacted within 5 minutes convert at up to <strong>21x higher rates</strong> than those contacted next-day. Faster automated CRM speed yields up to a <strong>2.1x conversion lift</strong>, directly boosting closed deals and commission checks.
                </span>
              </span>
            </label>
            <select
              value={inputs.responseTime}
              onChange={(e: any) => setInputs({ ...inputs, responseTime: e.target.value })}
              className="w-full px-3 py-3 bg-[#F8F9FA] border-2 border-primary rounded-xs text-primary font-black text-xs uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white cursor-pointer"
            >
              <option value="under-5">⚡ Under 5 Minutes (Best Case)</option>
              <option value="within-1-hour">⌛ Within 1 Hour</option>
              <option value="few-hours">🕒 A few hours</option>
              <option value="next-day">💤 Next day or later</option>
            </select>
          </div>

          {/* Slider 3: Close Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label className="text-gray-600 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
                Current close rate (leads &rarr; closed)
                <span className="group relative inline-flex items-center cursor-help">
                  <HelpCircle className="w-3.5 h-3.5 text-gray-400 hover:text-primary transition" />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 bg-slate-900 text-white text-[11px] font-normal leading-relaxed rounded-md shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-30 font-sans normal-case tracking-normal border border-slate-700">
                    <span className="font-bold text-emerald-400 block mb-0.5">Baseline Conversion Rate:</span>
                    The percentage of total leads that successfully convert into closed transactions today (industry baseline average is 2–4%).
                  </span>
                </span>
              </label>
              <span className="font-mono font-black text-xs text-white px-2.5 py-1 bg-primary rounded-xs border border-primary">
                {inputs.currentCloseRate}%
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="0.5"
              value={inputs.currentCloseRate}
              onChange={(e) => setInputs({ ...inputs, currentCloseRate: parseFloat(e.target.value) })}
              className="w-full h-2 bg-gray-100 rounded-xs appearance-none cursor-pointer accent-accent"
            />
            <div className="flex justify-between text-[11px] text-gray-400 font-mono font-bold">
              <span>1%</span>
              <span>8%</span>
              <span>15%</span>
            </div>
          </div>

          {/* Grid: Commission & Time Value */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-600 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
                Avg. Commission
                <span className="group relative inline-flex items-center cursor-help">
                  <HelpCircle className="w-3.5 h-3.5 text-gray-400 hover:text-primary transition" />
                  <span className="absolute bottom-full left-0 mb-2 w-60 p-2.5 bg-slate-900 text-white text-[11px] font-normal leading-relaxed rounded-md shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-30 font-sans normal-case tracking-normal border border-slate-700">
                    <span className="font-bold text-emerald-400 block mb-0.5">Gross Commission Income (GCI):</span>
                    Your average net commission per closed escrow. Used directly to calculate the dollar value of each newly gained transaction.
                  </span>
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-black text-sm">$</span>
                <input
                  type="number"
                  value={inputs.commissionPerDeal}
                  onChange={(e) => setInputs({ ...inputs, commissionPerDeal: parseInt(e.target.value) || 0 })}
                  className="w-full pl-7 pr-3 py-3 bg-[#F8F9FA] border-2 border-primary rounded-xs text-primary font-mono font-black focus:outline-none focus:ring-2 focus:ring-accent text-sm focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-600 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
                Your Hourly Value
                <span className="group relative inline-flex items-center cursor-help">
                  <HelpCircle className="w-3.5 h-3.5 text-gray-400 hover:text-primary transition" />
                  <span className="absolute bottom-full right-0 mb-2 w-60 p-2.5 bg-slate-900 text-white text-[11px] font-normal leading-relaxed rounded-md shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-30 font-sans normal-case tracking-normal border border-slate-700">
                    <span className="font-bold text-amber-400 block mb-0.5">Opportunity Cost / Hour:</span>
                    The value of your time spent on high-leverage activities (showing homes, prospecting) vs. low-value repetitive admin.
                  </span>
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-black text-sm">$</span>
                <input
                  type="number"
                  value={inputs.timeValuePerHour}
                  onChange={(e) => setInputs({ ...inputs, timeValuePerHour: parseInt(e.target.value) || 0 })}
                  className="w-full pl-7 pr-3 py-3 bg-[#F8F9FA] border-2 border-primary rounded-xs text-primary font-mono font-black focus:outline-none focus:ring-2 focus:ring-accent text-sm focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Slider 4: Admin Hours */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label className="text-gray-600 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
                Manual follow-up/admin (hrs/wk)
                <span className="group relative inline-flex items-center cursor-help">
                  <HelpCircle className="w-3.5 h-3.5 text-gray-400 hover:text-primary transition" />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 bg-slate-900 text-white text-[11px] font-normal leading-relaxed rounded-md shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-30 font-sans normal-case tracking-normal border border-slate-700">
                    <span className="font-bold text-amber-400 block mb-0.5">Automated Time Savings:</span>
                    Hours per week currently lost to manual typing, spreadsheets, and reminders. An automated CRM eliminates up to 60% of this overhead.
                  </span>
                </span>
              </label>
              <span className="font-mono font-black text-xs text-white px-2.5 py-1 bg-primary rounded-xs border border-primary">
                {inputs.hoursSpentOnAdmin} hrs
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              value={inputs.hoursSpentOnAdmin}
              onChange={(e) => setInputs({ ...inputs, hoursSpentOnAdmin: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-100 rounded-xs appearance-none cursor-pointer accent-accent"
            />
            <div className="flex justify-between text-[11px] text-gray-400 font-mono font-bold">
              <span>0 hrs</span>
              <span>12 hrs</span>
              <span>25 hrs</span>
            </div>
          </div>

          {/* Input: Current Tool Spend */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <label className="text-sm text-gray-600 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
              Current monthly spend on CRM/tools ($)
              <span className="group relative inline-flex items-center cursor-help">
                <HelpCircle className="w-3.5 h-3.5 text-gray-400 hover:text-primary transition" />
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 bg-slate-900 text-white text-[11px] font-normal leading-relaxed rounded-md shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-30 font-sans normal-case tracking-normal border border-slate-700">
                  <span className="font-bold text-emerald-400 block mb-0.5">Cost Baseline:</span>
                  What you already spend on subscriptions monthly. This is deducted to calculate true <strong>Net ROI</strong> after subscription upgrades.
                </span>
              </span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-black text-sm">$</span>
              <input
                type="number"
                value={inputs.currentToolSpend}
                onChange={(e) => setInputs({ ...inputs, currentToolSpend: parseInt(e.target.value) || 0 })}
                className="w-full pl-7 pr-3 py-3 bg-[#F8F9FA] border-2 border-primary rounded-xs text-primary font-mono font-black focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white"
                placeholder="0"
              />
            </div>
          </div>

          {/* Share & Download Actions */}
          <div className="space-y-2.5">
            <button
              onClick={handleDownloadPDF}
              disabled={pdfGenerating}
              className="w-full flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-widest text-white bg-emerald-700 hover:bg-emerald-600 border-2 border-emerald-800 rounded-xs transition duration-150 active:scale-98 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {pdfGenerating ? 'Generating PDF...' : 'Download PDF Report'}
            </button>

            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-black uppercase tracking-widest text-primary bg-gray-50 hover:bg-gray-100 border-2 border-primary rounded-xs transition duration-150 active:scale-98 cursor-pointer"
            >
              {shareCopied ? (
                <>
                  <Check className="w-4 h-4 text-success" />
                  Copied parameters link!
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  Share these specific results
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right column: Interactive Outputs */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main big numbers card */}
          <div className="bg-primary text-white p-6 md:p-8 rounded-xs border-b-8 border-accent relative overflow-hidden shadow-md">
            <div className="absolute right-0 top-0 -mr-12 -mt-12 w-48 h-48 bg-accent/15 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3 relative z-10">
              <span className="inline-block bg-accent text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xs">
                Estimated Annual ROI Value
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadPDF}
                  disabled={pdfGenerating}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 hover:text-white border border-emerald-400/30 rounded-xs text-[10px] font-black uppercase tracking-widest transition duration-150 cursor-pointer active:scale-95 disabled:opacity-50"
                  title="Download full PDF evaluation report"
                >
                  <Download className="w-3.5 h-3.5" />
                  {pdfGenerating ? 'Generating...' : 'Download PDF'}
                </button>
                <button
                  onClick={handleCopyResults}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-accent hover:text-white border border-white/10 hover:border-white/25 rounded-xs text-[10px] font-black uppercase tracking-widest transition duration-150 cursor-pointer active:scale-95"
                  title="Copy full ROI evaluation to clipboard"
                >
                  {resultsCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-success animate-pulse" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Text
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black text-accent mt-2 font-display uppercase tracking-tighter leading-none">
              ${results.totalAnnualGain.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </h2>
            <p className="text-gray-300 text-xs mt-3 leading-relaxed">
              Based on your response time improvement and automated administrative hours saved.
            </p>

            {/* Stat breakdowns */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 text-center">
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider block">Improved Close Rate</span>
                <span className="text-white font-black text-xl block font-mono mt-1">
                  {results.improvedCloseRate.toFixed(1)}%
                </span>
                <span className="text-[10px] text-accent font-bold">({((results.improvedCloseRate / inputs.currentCloseRate)).toFixed(1)}x lift)</span>
              </div>
              
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider block">Extra Deals/Yr</span>
                <span className="text-success font-black text-xl block font-mono mt-1">
                  +{results.additionalDealsPerYear.toFixed(1)}
                </span>
                <span className="text-[10px] text-gray-400">closed escrows</span>
              </div>

              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider block">Revenue Value</span>
                <span className="text-white font-black text-xl block font-mono mt-1">
                  ${results.additionalAnnualRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </span>
                <span className="text-[10px] text-gray-400">commission</span>
              </div>

              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider block">Time Saved/Wk</span>
                <span className="text-accent font-black text-xl block font-mono mt-1">
                  {results.hoursSavedPerWeek.toFixed(1)} hrs
                </span>
                <span className="text-[10px] text-gray-400">(${results.annualValueTimeSaved.toLocaleString('en-US', { maximumFractionDigits: 0 })}/yr value)</span>
              </div>
            </div>

            {/* Integrated Expandable Footnote for Results Panel */}
            <div className="mt-6 pt-5 border-t border-white/10 text-left">
              <button
                onClick={() => setShowFootnote(!showFootnote)}
                className="w-full flex items-center justify-between text-xs font-bold text-gray-300 hover:text-accent transition duration-150 cursor-pointer uppercase tracking-wider"
              >
                <span className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  How we calculated this
                </span>
                <span className="font-mono text-[9px] bg-white/10 hover:bg-white/25 px-2 py-0.5 rounded-xs text-white transition">
                  {showFootnote ? 'HIDE ▲' : 'EXPAND ▼'}
                </span>
              </button>
              
              <AnimatePresence initial={false}>
                {showFootnote && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-xs text-[11px] text-gray-300 space-y-3 leading-relaxed font-sans">
                      <p>
                        <strong>Lead Response Math:</strong> Based on real estate benchmarks, immediate response (under 5m) is set as the 1.0x baseline (3.0% close rate). Waiting 1 hour lowers conversion multiplier to 0.77x (representing 1.3x potential lift if restored); waiting a few hours lowers to 0.62x (1.6x lift); and waiting next-day lowers to 0.47x (2.1x lift). Improved close rate is realistically capped at 20%.
                      </p>
                      <p>
                        <strong>Admin Savings:</strong> Automated real estate follow-up workflows are assumed to eliminate 60% of manual administrative tasks. The weekly saved hours are multiplied by 52 weeks and your self-declared hourly rate to calculate the annual value of saved time.
                      </p>
                      <p>
                        <strong>Affiliate Transparency:</strong> CRMsolo may receive advertising or affiliate referral compensation from qualifying signups or trials. Our math models, calculations, and visual CRM recommendations remain completely unbiased, derived algorithmically and identically for Pipedrive, HubSpot, and Zoho CRM.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* CRM Highlight Recommendation Card */}
          <div className="bg-white border-2 border-accent border-l-8 border-l-accent p-6 rounded-xs shadow-sm relative">
            <div className="absolute top-0 right-6 -translate-y-1/2 bg-accent text-primary text-[10px] font-black font-display uppercase tracking-widest px-3.5 py-1.5 rounded-xs flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Best Solo Match
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-2">
              <div>
                <h4 className="text-2xl font-black text-primary font-display uppercase tracking-tight flex items-center gap-2">
                  Recommend: {recommendedCrm.crmName}
                </h4>
                <p className="text-gray-600 text-sm mt-1 leading-relaxed font-medium">
                  {recommendedCrm.reason}
                </p>
                <div className="mt-3 flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <span>
                    Est. Cost: <strong className="text-primary font-mono text-sm">${(recommendedCrm.annualCost / 12).toFixed(0)}/mo</strong>
                  </span>
                  <span className="text-success">
                    Net ROI: +${recommendedCrm.netRoi.toLocaleString('en-US', { maximumFractionDigits: 0 })}/yr
                  </span>
                </div>
              </div>
              
              <a
                href={recommendedCrm.affiliateLink}
                target="_blank"
                referrerPolicy="no-referrer"
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-accent hover:bg-accent/90 text-primary font-black uppercase tracking-widest text-xs rounded-xs shadow-sm transition duration-150 active:scale-95 text-center cursor-pointer"
              >
                Start Free Trial &rarr;
              </a>
            </div>
          </div>

          {/* CRM Comparison Strip below */}
          <div className="bg-white p-5 rounded-xs border-2 border-primary shadow-sm space-y-4">
            <h5 className="text-xs font-black text-primary tracking-widest uppercase border-b-2 border-primary pb-1.5">
              How all choices compare with your metrics
            </h5>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {results.recommendations.map((rec) => {
                const isWinner = rec.isBestFit;
                return (
                  <div 
                    key={rec.crmName}
                    className={`p-4 rounded-xs border-l-4 border-2 transition ${
                      isWinner 
                        ? 'bg-accent/5 border-accent border-l-accent' 
                        : 'bg-[#F8F9FA] border-gray-100 border-l-primary hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-black text-primary text-sm font-display uppercase tracking-tight">{rec.crmName}</span>
                      {isWinner && <span className="text-[9px] bg-accent text-primary font-black px-1.5 py-0.5 rounded-xs">FIT</span>}
                    </div>
                    <div className="mt-2 text-xs text-gray-500 font-medium">
                      Net ROI: <strong className="text-success font-mono font-bold">+${rec.netRoi.toLocaleString('en-US', { maximumFractionDigits: 0 })}/yr</strong>
                    </div>
                    <div className="mt-1 text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                      Cost: ${(rec.annualCost / 12).toFixed(0)}/mo
                    </div>
                    <button 
                      onClick={() => {
                        const slug = rec.crmName.toLowerCase().includes('pipedrive') ? 'pipedrive-for-real-estate-agents' :
                                     rec.crmName.toLowerCase().includes('hubspot') ? 'hubspot-for-real-estate-agents' :
                                     'zoho-crm-for-real-estate-agents';
                        if (onNavigateToCRM) onNavigateToCRM(slug);
                      }}
                      className="mt-4 w-full text-left text-[10px] text-accent font-black uppercase tracking-widest hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      Read review &rarr;
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
