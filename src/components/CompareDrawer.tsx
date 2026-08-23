import React, { useState } from 'react';
import { CRMReview } from '../types';
import { X, Check, ArrowRight, ExternalLink, SlidersHorizontal } from 'lucide-react';

interface CompareDrawerProps {
  selectedCrms: CRMReview[];
  onRemove: (crmId: string) => void;
  onClear: () => void;
  onNavigateToReview: (slug: string) => void;
}

export const CompareDrawer: React.FC<CompareDrawerProps> = ({
  selectedCrms,
  onRemove,
  onClear,
  onNavigateToReview
}) => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  if (selectedCrms.length === 0) return null;

  return (
    <>
      {/* Floating Bottom Bar */}
      <div 
        id="compare-tray"
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-4xl bg-slate-900/95 text-white rounded-2xl shadow-2xl backdrop-blur-md border border-slate-700 px-4 py-3 sm:px-6 sm:py-4 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs">
              {selectedCrms.length}
            </span>
            <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-xs sm:max-w-md">
              {selectedCrms.map((crm) => (
                <div 
                  key={crm.id} 
                  className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-lg pl-2 pr-1.5 py-1 text-xs whitespace-nowrap"
                >
                  <span className="text-sm">{crm.logo}</span>
                  <span className="font-medium text-slate-200">{crm.name}</span>
                  <button 
                    id={`remove-compare-${crm.id}`}
                    onClick={() => onRemove(crm.id)}
                    className="text-slate-400 hover:text-rose-400 p-0.5 rounded transition"
                    title={`Remove ${crm.name}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              id="clear-compare-tray"
              onClick={onClear}
              className="text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1.5 rounded transition"
            >
              Clear All
            </button>

            <button
              id="open-side-by-side-matrix"
              onClick={() => setIsOpenModal(true)}
              className="flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md hover:shadow-emerald-500/20 transition active:scale-95"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Compare Side-by-Side</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Modal */}
      {isOpenModal && (
        <div 
          id="compare-modal-backdrop"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={() => setIsOpenModal(false)}
        >
          <div 
            id="compare-modal-content"
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[90vh] overflow-y-auto p-4 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Side-by-Side CRM Comparison
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Direct evaluation of pricing, core features, rating metrics, and agent fit.
                </p>
              </div>
              <button
                id="close-compare-modal"
                onClick={() => setIsOpenModal(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4 text-xs uppercase font-semibold text-slate-400 w-44 bg-slate-50">
                      Product
                    </th>
                    {selectedCrms.map((crm) => (
                      <th key={crm.id} className="py-3 px-4 min-w-[200px] text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-3xl mb-1">{crm.logo}</span>
                          <h4 className="font-bold text-slate-900 text-base">{crm.name}</h4>
                          {crm.categoryBadge && (
                            <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded-full">
                              {crm.categoryBadge}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {/* Overall Score */}
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-700 bg-slate-50">
                      Overall Score
                    </td>
                    {selectedCrms.map((crm) => (
                      <td key={crm.id} className="py-3 px-4 text-center">
                        <div className="inline-flex items-baseline gap-1 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl text-emerald-900 font-bold">
                          <span className="text-lg">{crm.overallScore}</span>
                          <span className="text-xs text-emerald-600">/ 10</span>
                        </div>
                        {crm.recommendationRate && (
                          <p className="text-[11px] text-slate-500 mt-1">
                            {crm.recommendationRate}% user recommendation
                          </p>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Starting Price */}
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-700 bg-slate-50">
                      Starting Price
                    </td>
                    {selectedCrms.map((crm) => (
                      <td key={crm.id} className="py-3 px-4 text-center font-medium text-slate-800">
                        {crm.startingPrice === 0 ? (
                          <span className="inline-block px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-xs">
                            Free Tier Available
                          </span>
                        ) : (
                          <span className="text-base font-bold text-slate-900">
                            ${crm.startingPrice}
                            <span className="text-xs font-normal text-slate-500"> /mo</span>
                          </span>
                        )}
                        <p className="text-xs text-slate-500 mt-0.5">
                          {crm.freeTrialDays ? `${crm.freeTrialDays}-Day Free Trial` : 'Direct Setup'}
                        </p>
                      </td>
                    ))}
                  </tr>

                  {/* Best For */}
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-700 bg-slate-50">
                      Best For
                    </td>
                    {selectedCrms.map((crm) => (
                      <td key={crm.id} className="py-3 px-4 text-center text-xs text-slate-600">
                        {crm.bestFor}
                      </td>
                    ))}
                  </tr>

                  {/* Rating Breakdown */}
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-700 bg-slate-50">
                      Ease of Use
                    </td>
                    {selectedCrms.map((crm) => (
                      <td key={crm.id} className="py-3 px-4 text-center font-semibold text-slate-800">
                        {crm.ratingBreakdown.easeOfUse} / 10
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-700 bg-slate-50">
                      Real Estate Fit
                    </td>
                    {selectedCrms.map((crm) => (
                      <td key={crm.id} className="py-3 px-4 text-center font-semibold text-slate-800">
                        {crm.ratingBreakdown.realEstateFeatures} / 10
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-700 bg-slate-50">
                      Mobile App
                    </td>
                    {selectedCrms.map((crm) => (
                      <td key={crm.id} className="py-3 px-4 text-center font-semibold text-slate-800">
                        {crm.ratingBreakdown.mobileApp} / 10
                      </td>
                    ))}
                  </tr>

                  {/* Key Features */}
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-700 bg-slate-50 align-top">
                      Key Capabilities
                    </td>
                    {selectedCrms.map((crm) => (
                      <td key={crm.id} className="py-3 px-4 text-xs text-slate-600 align-top">
                        <ul className="space-y-1.5 text-left">
                          {(crm.featuresList || crm.pricingTiers[0]?.features || []).slice(0, 5).map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>

                  {/* Actions */}
                  <tr>
                    <td className="py-4 px-4 font-semibold text-slate-700 bg-slate-50">
                      Take Action
                    </td>
                    {selectedCrms.map((crm) => (
                      <td key={crm.id} className="py-4 px-4 text-center">
                        <div className="flex flex-col gap-2">
                          <a
                            id={`matrix-affiliate-${crm.id}`}
                            href={crm.affiliateLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-3 rounded-xl text-xs shadow-sm transition"
                          >
                            <span>Visit Site</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            id={`matrix-read-review-${crm.id}`}
                            onClick={() => {
                              setIsOpenModal(false);
                              onNavigateToReview(crm.slug);
                            }}
                            className="text-xs font-semibold text-slate-700 hover:text-emerald-700 py-1"
                          >
                            Read Full Review
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
