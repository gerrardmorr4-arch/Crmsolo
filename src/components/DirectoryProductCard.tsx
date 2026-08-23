import React, { useState } from 'react';
import { CRMReview } from '../types';
import { 
  Star, 
  Check, 
  ExternalLink, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  ThumbsUp, 
  DollarSign, 
  ShieldCheck,
  CheckSquare,
  Square
} from 'lucide-react';

interface DirectoryProductCardProps {
  review: CRMReview;
  isSelectedForCompare: boolean;
  onToggleCompare: (crm: CRMReview) => void;
  onNavigateToReview: (slug: string) => void;
  rankIndex?: number;
}

export const DirectoryProductCard: React.FC<DirectoryProductCardProps> = ({
  review,
  isSelectedForCompare,
  onToggleCompare,
  onNavigateToReview,
  rankIndex
}) => {
  const [isExpandedSpecs, setIsExpandedSpecs] = useState(false);

  return (
    <article
      id={`directory-card-${review.id}`}
      className={`bg-white rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-md ${
        isSelectedForCompare
          ? 'border-emerald-500 ring-2 ring-emerald-500/20'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="p-5 sm:p-6">
        {/* Top Header: Badge, Compare Checkbox, Rank */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-2">
            {review.categoryBadge ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>{review.categoryBadge}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                Verified Listing
              </span>
            )}
            {typeof rankIndex === 'number' && (
              <span className="text-xs font-bold text-slate-400">
                #{rankIndex + 1} in Real Estate CRM
              </span>
            )}
          </div>

          {/* Compare Toggle */}
          <button
            id={`toggle-compare-${review.id}`}
            onClick={() => onToggleCompare(review)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition ${
              isSelectedForCompare
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {isSelectedForCompare ? (
              <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Square className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>{isSelectedForCompare ? 'Added to Compare' : 'Add to Compare'}</span>
          </button>
        </div>

        {/* Main Content Grid: Logo + Info + Pricing/CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Column 1: Logo & Basic Info (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-3xl sm:text-4xl shadow-inner shrink-0">
                {review.logo}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 hover:text-emerald-700 transition cursor-pointer"
                      onClick={() => onNavigateToReview(review.slug)}>
                    {review.name}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                    Updated {review.lastUpdated}
                  </span>
                </div>

                {/* Ratings & Score */}
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <div className="flex items-center gap-1 bg-emerald-600 text-white font-bold text-xs px-2 py-0.5 rounded-md">
                    <Star className="w-3 h-3 fill-white" />
                    <span>{review.overallScore}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    ({review.userRatingCount?.toLocaleString() || '1,400+'} user reviews)
                  </span>
                  {review.recommendationRate && (
                    <span className="flex items-center gap-1 text-xs text-emerald-700 font-medium">
                      <ThumbsUp className="w-3 h-3" />
                      <span>{review.recommendationRate}% Recommend</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Pitch & Best For */}
            <p className="text-sm text-slate-700 leading-relaxed">
              {review.oneLinePitch}
            </p>

            <div className="text-xs text-slate-600 bg-slate-50 border border-slate-150 rounded-xl px-3 py-2">
              <span className="font-semibold text-slate-900">Best for: </span>
              <span>{review.bestFor}</span>
            </div>

            {/* Key Features Pill Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(review.featuresList || review.pricingTiers[0]?.features || []).slice(0, 4).map((feat, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-slate-100 text-slate-700 font-medium"
                >
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>{feat}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Column 2: Pricing Summary & CTAs (lg:col-span-4) */}
          <div className="lg:col-span-4 bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between h-full space-y-4">
            <div>
              <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                Starting Price
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                {review.startingPrice === 0 ? (
                  <span className="text-xl font-bold text-emerald-700">
                    Free Tier Available
                  </span>
                ) : (
                  <>
                    <span className="text-2xl font-bold text-slate-900">
                      ${review.startingPrice || review.pricingTiers[0]?.price}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      /{review.pricingTiers[0]?.period || 'month'}
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {review.freeTrialDays ? `${review.freeTrialDays}-Day Free Trial` : 'Direct Plan'} • No contract
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2">
              <a
                id={`directory-cta-visit-${review.id}`}
                href={review.affiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm shadow-sm transition active:scale-95"
              >
                <span>Visit Official Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                id={`directory-read-review-${review.id}`}
                onClick={() => onNavigateToReview(review.slug)}
                className="w-full flex items-center justify-center gap-1 bg-white hover:bg-slate-100 text-slate-800 font-medium py-2 px-3 rounded-xl text-xs border border-slate-200 transition"
              >
                <span>Read Full In-Depth Review</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Quick Specs & Pros/Cons Dropdown */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <button
            id={`toggle-specs-${review.id}`}
            onClick={() => setIsExpandedSpecs(!isExpandedSpecs)}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-medium transition"
          >
            <span>{isExpandedSpecs ? 'Hide Quick Specs' : 'View Quick Ratings & Specs'}</span>
            {isExpandedSpecs ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {isExpandedSpecs && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl text-xs">
              <div>
                <h5 className="font-bold text-slate-900 mb-2">Category Score Breakdown</h5>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Ease of Use:</span>
                    <span className="font-semibold text-slate-900">{review.ratingBreakdown.easeOfUse}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Real Estate Features:</span>
                    <span className="font-semibold text-slate-900">{review.ratingBreakdown.realEstateFeatures}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Value for Money:</span>
                    <span className="font-semibold text-slate-900">{review.ratingBreakdown.valueForMoney}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Mobile App:</span>
                    <span className="font-semibold text-slate-900">{review.ratingBreakdown.mobileApp}/10</span>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 mb-2">Editor's Take</h5>
                <p className="text-slate-600 leading-relaxed line-clamp-4">
                  {review.verdict}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
