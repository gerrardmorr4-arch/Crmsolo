import React from 'react';
import { Filter, RotateCcw, Check, DollarSign, Smartphone, Star } from 'lucide-react';

export interface FilterState {
  pricingModel: 'all' | 'free-tier' | 'free-trial' | 'paid-subscription';
  maxStartingPrice: number; // 0 to 300+
  minRating: number; // 0, 8.5, 9.0, etc.
  selectedFeatures: string[];
  selectedDeployments: string[];
  selectedAgents: string[];
  searchQuery: string;
}

interface DirectoryFilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  availableFeatures: string[];
  totalResultsCount: number;
}

export const DirectoryFilterSidebar: React.FC<DirectoryFilterSidebarProps> = ({
  filters,
  onFilterChange,
  onReset,
  availableFeatures,
  totalResultsCount
}) => {
  const toggleFeature = (feature: string) => {
    const updated = filters.selectedFeatures.includes(feature)
      ? filters.selectedFeatures.filter((f) => f !== feature)
      : [...filters.selectedFeatures, feature];
    onFilterChange({ ...filters, selectedFeatures: updated });
  };

  const toggleDeployment = (dep: string) => {
    const updated = filters.selectedDeployments.includes(dep)
      ? filters.selectedDeployments.filter((d) => d !== dep)
      : [...filters.selectedDeployments, dep];
    onFilterChange({ ...filters, selectedDeployments: updated });
  };

  const toggleAgent = (agent: string) => {
    const updated = filters.selectedAgents.includes(agent)
      ? filters.selectedAgents.filter((a) => a !== agent)
      : [...filters.selectedAgents, agent];
    onFilterChange({ ...filters, selectedAgents: updated });
  };

  const isAnyFilterActive =
    filters.pricingModel !== 'all' ||
    filters.maxStartingPrice < 300 ||
    filters.minRating > 0 ||
    filters.selectedFeatures.length > 0 ||
    filters.selectedDeployments.length > 0 ||
    filters.selectedAgents.length > 0 ||
    filters.searchQuery.trim().length > 0;

  return (
    <aside 
      id="directory-filter-sidebar"
      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
          <Filter className="w-4 h-4 text-emerald-600" />
          <span>Filter Products</span>
          <span className="text-xs font-normal text-slate-500">
            ({totalResultsCount} found)
          </span>
        </div>
        {isAnyFilterActive && (
          <button
            id="reset-all-directory-filters"
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Pricing Model */}
      <div>
        <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2.5">
          Pricing Model
        </h4>
        <div className="space-y-1.5">
          {[
            { id: 'all', label: 'All Pricing Models' },
            { id: 'free-tier', label: 'Free Version Available' },
            { id: 'free-trial', label: 'Free Trial' },
            { id: 'paid-subscription', label: 'Paid Subscription' }
          ].map((item) => (
            <label
              key={item.id}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition ${
                filters.pricingModel === item.id
                  ? 'bg-emerald-50 text-emerald-950 font-semibold border border-emerald-200'
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span>{item.label}</span>
              <input
                type="radio"
                name="pricingModel"
                value={item.id}
                checked={filters.pricingModel === item.id}
                onChange={() => onFilterChange({ ...filters, pricingModel: item.id as any })}
                className="text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Starting Price Range */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
            Max Starting Price
          </h4>
          <span className="text-xs font-bold text-slate-900">
            {filters.maxStartingPrice >= 300 ? 'Any Budget' : `$${filters.maxStartingPrice}/mo`}
          </span>
        </div>
        <input
          id="price-range-slider"
          type="range"
          min="0"
          max="300"
          step="10"
          value={filters.maxStartingPrice}
          onChange={(e) =>
            onFilterChange({ ...filters, maxStartingPrice: Number(e.target.value) })
          }
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
        />
        <div className="flex justify-between text-[11px] text-slate-400 mt-1">
          <span>$0 (Free)</span>
          <span>$50/mo</span>
          <span>$100/mo</span>
          <span>$300+</span>
        </div>
      </div>

      {/* Minimum Score */}
      <div>
        <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2.5">
          Minimum Rating
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {[
            { score: 0, label: 'All' },
            { score: 8.5, label: '8.5+' },
            { score: 9.0, label: '9.0+' }
          ].map((item) => (
            <button
              key={item.score}
              type="button"
              onClick={() => onFilterChange({ ...filters, minRating: item.score })}
              className={`py-1.5 px-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1 transition ${
                filters.minRating === item.score
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {item.score > 0 && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Must-Have Features */}
      <div>
        <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2.5">
          Must-Have Features
        </h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {availableFeatures.slice(0, 10).map((feature) => {
            const isChecked = filters.selectedFeatures.includes(feature);
            return (
              <label
                key={feature}
                className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-slate-900 py-1"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleFeature(feature)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5 border-slate-300"
                />
                <span className={isChecked ? 'font-semibold text-slate-900' : ''}>
                  {feature}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Deployment & Platform */}
      <div>
        <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2.5">
          Deployment & Platform
        </h4>
        <div className="space-y-1.5">
          {['Web / Cloud', 'iOS App', 'Android App', 'Chrome Extension', 'Mac App'].map((dep) => {
            const isChecked = filters.selectedDeployments.includes(dep);
            return (
              <label
                key={dep}
                className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-slate-900 py-1"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleDeployment(dep)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5 border-slate-300"
                />
                <span className={isChecked ? 'font-semibold text-slate-900' : ''}>
                  {dep}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Agent Stage / Persona */}
      <div>
        <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2.5">
          Target Practitioner
        </h4>
        <div className="space-y-1.5">
          {['Solo Realtor', 'New Real Estate Agent', 'Independent Broker', 'High-Volume Lead Buyer', 'Google Workspace Realtor'].map((agent) => {
            const isChecked = filters.selectedAgents.includes(agent);
            return (
              <label
                key={agent}
                className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-slate-900 py-1"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleAgent(agent)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5 border-slate-300"
                />
                <span className={isChecked ? 'font-semibold text-slate-900' : ''}>
                  {agent}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
