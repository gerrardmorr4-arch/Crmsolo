import { useEffect, useState } from 'react';
import { CRMReview } from '../types';
import Markdown from './Markdown';
import { X, Printer, Shield, Star, Award, Check, Calendar, Globe, Sparkles, Download, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateReviewPDF } from '../lib/pdfGenerator';

interface ReviewPrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  crm: CRMReview;
}

export default function ReviewPrintPreviewModal({
  isOpen,
  onClose,
  crm
}: ReviewPrintPreviewModalProps) {
  // Add body class when preview is open to optimize print CSS
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('print-preview-active');
    } else {
      document.body.classList.remove('print-preview-active');
    }
    return () => {
      document.body.classList.remove('print-preview-active');
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const [downloading, setDownloading] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    setDownloading(true);
    try {
      const doc = generateReviewPDF(crm);
      doc.save(`${crm.slug}-crmsolo-review-evaluation.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setDownloading(false);
    }
  };

  if (!isOpen) return null;

  const todayStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print-preview-modal-wrapper">
          {/* Backdrop click to close */}
          <div 
            className="fixed inset-0 no-print cursor-pointer" 
            onClick={onClose} 
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2 }}
            className="relative bg-gray-100 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-white/20 z-10"
          >
            {/* Top Toolbar (Hidden during print) */}
            <div className="bg-primary text-white p-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 shrink-0 border-b border-white/10 no-print print-preview-toolbar">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/20 rounded-xl text-accent">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white font-display flex items-center gap-2">
                    Print Preview — {crm.name} Review
                  </h3>
                  <p className="text-[11px] text-gray-300">
                    Clean, stripped-down layout optimized for paper &amp; PDF export.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  disabled={downloading}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer transition active:scale-95 disabled:opacity-50"
                >
                  <Download className="w-4 h-4" /> {downloading ? 'Generating PDF...' : 'Download PDF'}
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3.5 py-2 bg-accent hover:bg-accent/90 text-primary font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer transition active:scale-95"
                >
                  <Printer className="w-4 h-4" /> Print
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
                  aria-label="Close Print Preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Document Area */}
            <div className="overflow-y-auto p-4 sm:p-8 space-y-6 flex-1 bg-gray-200/60 font-sans">
              
              {/* Paper Sheet Document */}
              <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-md border border-gray-200 max-w-3xl mx-auto space-y-8 text-primary print-preview-sheet font-sans">
                
                {/* 1. Official Report Header */}
                <div className="border-b-2 border-primary pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🏆</span>
                      <span className="text-xl font-black font-display tracking-tight text-primary">CRMsolo</span>
                      <span className="text-[9px] font-mono uppercase bg-accent text-primary px-2 py-0.5 font-bold rounded-xs">
                        Solo Realtor Intelligence
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-mono mt-1">
                      Independent CRM Evaluation Sheet • crmsolo.com/review/{crm.slug}
                    </p>
                  </div>
                  <div className="text-right sm:text-right space-y-0.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-success flex items-center sm:justify-end gap-1">
                      <Shield className="w-3 h-3 text-success" /> Verified Independent Report
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono">
                      Date Printed: {todayStr}
                    </div>
                  </div>
                </div>

                {/* 2. Hero Overview */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2 bg-white border border-gray-200 rounded-xl shadow-xs">{crm.logo}</span>
                      <div>
                        <h1 className="text-2xl font-black text-primary font-display">
                          {crm.name} CRM Review
                        </h1>
                        <p className="text-[11px] text-gray-500 font-mono flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" /> Tested &amp; Last Updated: {crm.lastUpdated}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-700 italic font-medium leading-relaxed">
                      "{crm.oneLinePitch}"
                    </p>

                    <div className="flex flex-wrap gap-2 text-[10px] font-bold text-gray-700 pt-1">
                      <span className="px-2.5 py-1 bg-white border border-gray-300 rounded-md flex items-center gap-1">
                        <Award className="w-3 h-3 text-accent" /> Best For: {crm.bestFor}
                      </span>
                    </div>
                  </div>

                  {/* Score badge */}
                  <div className="shrink-0 bg-white p-4 border-2 border-primary rounded-xl text-center min-w-[120px]">
                    <span className="text-[9px] font-black uppercase tracking-wider text-gray-500 block">Overall Score</span>
                    <span className="text-4xl font-black text-primary font-mono block my-0.5">{crm.overallScore}</span>
                    <span className="text-[9px] font-bold text-gray-400 block">Out of 10</span>
                    <div className="flex justify-center text-accent mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < Math.floor(crm.overallScore / 2) ? 'fill-accent text-accent' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Rating Breakdown Table */}
                <div className="space-y-3">
                  <h2 className="text-xs font-black uppercase tracking-widest text-primary border-b border-gray-200 pb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-accent" /> Evaluation Criteria Breakdown
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
                      <span className="text-[10px] font-bold text-gray-500 block">Ease of Use</span>
                      <span className="text-lg font-black font-mono text-primary">{crm.ratingBreakdown.easeOfUse} / 10</span>
                    </div>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
                      <span className="text-[10px] font-bold text-gray-500 block">Value for Money</span>
                      <span className="text-lg font-black font-mono text-primary">{crm.ratingBreakdown.valueForMoney} / 10</span>
                    </div>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
                      <span className="text-[10px] font-bold text-gray-500 block">Real Estate Fit</span>
                      <span className="text-lg font-black font-mono text-primary">{crm.ratingBreakdown.realEstateFeatures} / 10</span>
                    </div>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
                      <span className="text-[10px] font-bold text-gray-500 block">Mobile Speed</span>
                      <span className="text-lg font-black font-mono text-primary">{crm.ratingBreakdown.mobileApp} / 10</span>
                    </div>
                  </div>
                </div>

                {/* 4. Pros & Cons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                      <Check className="w-4 h-4 text-emerald-600" /> Key Strengths
                    </h3>
                    <ul className="space-y-1.5 text-xs text-emerald-950 font-medium">
                      {crm.pros.map((pro, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-red-50/50 border border-red-200 rounded-xl space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-red-800 flex items-center gap-1">
                      <X className="w-4 h-4 text-red-600" /> Key Limitations
                    </h3>
                    <ul className="space-y-1.5 text-xs text-red-950 font-medium">
                      {crm.cons.map((con, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-red-600 font-bold">•</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 5. Pricing Matrix */}
                <div className="space-y-3">
                  <h2 className="text-xs font-black uppercase tracking-widest text-primary border-b border-gray-200 pb-1">
                    Pricing Tiers Overview
                  </h2>
                  <div className="overflow-x-auto border border-gray-200 rounded-xl">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-100 text-gray-700 font-bold uppercase text-[9px] tracking-wider">
                          <th className="p-2.5 border-b border-gray-200">Tier Name</th>
                          <th className="p-2.5 border-b border-gray-200 text-right">Price</th>
                          <th className="p-2.5 border-b border-gray-200">Included Features</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 font-medium">
                        {crm.pricingTiers.map((tier) => (
                          <tr key={tier.name} className="hover:bg-gray-50">
                            <td className="p-2.5 font-bold text-primary">{tier.name}</td>
                            <td className="p-2.5 text-right font-mono font-bold text-primary">${tier.price}/mo</td>
                            <td className="p-2.5 text-gray-600 text-[11px]">{tier.features.join(' • ')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 6. In-Depth Editorial Walkthrough */}
                <div className="space-y-3">
                  <h2 className="text-xs font-black uppercase tracking-widest text-primary border-b border-gray-200 pb-1">
                    In-Depth Editorial Assessment
                  </h2>
                  <div className="text-xs text-gray-800 leading-relaxed font-sans prose prose-sm max-w-none">
                    <Markdown content={crm.detailedReview} />
                  </div>
                </div>

                {/* 7. Verdict Banner */}
                <div className="p-5 bg-gray-900 text-white rounded-xl space-y-2 border border-gray-800">
                  <span className="text-[9px] font-black uppercase tracking-widest text-accent block">
                    Final Evaluation Verdict
                  </span>
                  <p className="text-xs font-medium leading-relaxed italic text-gray-200">
                    "{crm.verdict}"
                  </p>
                </div>

                {/* 8. Report Footer Signoff */}
                <div className="pt-6 border-t border-gray-200 text-[9px] text-gray-400 font-mono flex flex-col sm:flex-row justify-between items-center gap-2">
                  <div>
                    © {new Date().getFullYear()} CRMsolo. Independent evaluation for solo real estate professionals.
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe className="w-3 h-3 text-gray-400" /> Visit crmsolo.com for live ROI calculators &amp; side-by-side duels.
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Footer Action Bar (Hidden during print) */}
            <div className="bg-white p-4 border-t border-gray-200 flex justify-between items-center no-print shrink-0">
              <span className="text-xs text-gray-500 font-medium hidden sm:inline">
                💡 Tip: Set margins to "Default" and background graphics "On" in your print dialog.
              </span>
              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-5 py-2 bg-accent hover:bg-accent/90 text-primary font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition active:scale-95"
                >
                  <Printer className="w-4 h-4" /> Print Document
                </button>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
