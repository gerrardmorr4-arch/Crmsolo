import React, { useState, useMemo, useEffect } from 'react';
import { 
  Check, 
  X, 
  HelpCircle, 
  Award, 
  Sparkles, 
  ChevronRight, 
  Layers, 
  Mail, 
  Smartphone, 
  DollarSign, 
  FileCheck, 
  Zap, 
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCRMFilterPreferences } from '../lib/useCRMFilterPreferences';

export interface Feature {
  id: string;
  name: string;
  category: 'Sales & Pipelines' | 'Email & Outreach' | 'Workflows & Automation' | 'Schedulers & Signatures' | 'Mobile App & Fieldwork' | 'Cost & Budget';
  description: string;
  ratings: {
    pipedrive: number; // 0-10 rating
    streak: number; // 0-10 rating
    followupboss: number; // 0-10 rating
  };
  whyItMatters: string;
}

export const FEATURES_DATA: Feature[] = [
  // Category 1: Sales & Pipelines
  {
    id: 'kanban_pipeline',
    name: 'Visual Drag-and-Drop Pipeline',
    category: 'Sales & Pipelines',
    description: 'Visual stages representing buyer/seller status (e.g., Active Listing, Under Contract).',
    ratings: { pipedrive: 10, streak: 9, followupboss: 8 },
    whyItMatters: 'Enables you to see all active escrows and listing stages at a single glance with zero clicks.'
  },
  {
    id: 'multiple_pipelines',
    name: 'Multiple Pipelines',
    category: 'Sales & Pipelines',
    description: 'Ability to keep separate pipelines for buyers, listings, and rental deals.',
    ratings: { pipedrive: 9, streak: 6, followupboss: 10 },
    whyItMatters: 'Essential for tracking listings and active buyer escrows separately without mixing cards.'
  },
  {
    id: 'custom_property_fields',
    name: 'Custom Property Fields',
    category: 'Sales & Pipelines',
    description: 'Create custom fields for real estate specs: MLS #, Budget, contingency dates, etc.',
    ratings: { pipedrive: 10, streak: 7, followupboss: 10 },
    whyItMatters: 'Allows you to track appraisal deadlines, commission splits, and earnest money receipts directly.'
  },
  {
    id: 'required_fields',
    name: 'Stage-Change Checklist Enforcement',
    category: 'Sales & Pipelines',
    description: 'Force entry of specific data (e.g., contract price) before moving a card forward.',
    ratings: { pipedrive: 9, streak: 4, followupboss: 8 },
    whyItMatters: 'Guarantees you never forget to note escrow details or contract deadlines before closing.'
  },

  // Category 2: Email & Outreach
  {
    id: 'two_way_email_sync',
    name: 'Two-Way Email Sync (Gmail/Outlook)',
    category: 'Email & Outreach',
    description: 'Link your workspace inbox so emails to/from clients auto-log onto their timelines.',
    ratings: { pipedrive: 8, streak: 10, followupboss: 9 },
    whyItMatters: 'Saves hours of copy-pasting and ensures you have a single exact chronology of negotiations.'
  },
  {
    id: 'open_click_tracking',
    name: 'Email Open & Link Click Tracking',
    category: 'Email & Outreach',
    description: 'Get notified in real-time when clients read your emails or click property sheets.',
    ratings: { pipedrive: 9, streak: 10, followupboss: 9 },
    whyItMatters: 'Allows you to follow up with a warm client exactly when they are viewing your home flyers.'
  },
  {
    id: 'automated_sequences',
    name: 'Automated Follow-Up Sequences',
    category: 'Email & Outreach',
    description: 'Trigger sequences of emails over time to nurture unverified open house leads.',
    ratings: { pipedrive: 8, streak: 3, followupboss: 10 },
    whyItMatters: 'Nurtures cold leads on autopilot, keeping you top-of-mind without writing manual emails daily.'
  },
  {
    id: 'mass_email_newsletters',
    name: 'Native Bulk Newsletters',
    category: 'Email & Outreach',
    description: 'Draft and email bulk updates to your entire sphere directly from the CRM database.',
    ratings: { pipedrive: 2, streak: 5, followupboss: 8 },
    whyItMatters: 'Eliminates paying for a third-party newsletter builder (like Mailchimp) to mail your database.'
  },

  // Category 3: Workflows & Automation
  {
    id: 'api_webhooks',
    name: 'API Webhooks & Zapier Sync',
    category: 'Workflows & Automation',
    description: 'Connect third-party apps and capture real estate leads instantly via automated API webhooks and Zapier.',
    ratings: { pipedrive: 10, streak: 8, followupboss: 10 },
    whyItMatters: 'Automatically transfers new lead submissions from Facebook, Zillow, or landing pages into your CRM without manual data entry.'
  },
  {
    id: 'lead_routing',
    name: 'Instant Lead Routing & Auto-Assignment',
    category: 'Workflows & Automation',
    description: 'Rule-based lead distribution system that routes incoming inquiries by zip code, price point, or round-robin logic.',
    ratings: { pipedrive: 8, streak: 5, followupboss: 10 },
    whyItMatters: 'Triggers instant automated SMS and notifications, dramatically reducing lead response times.'
  },
  {
    id: 'task_automation',
    name: 'Simple Task Automations',
    category: 'Workflows & Automation',
    description: 'Automatically schedule follow-up tasks when deals enter new pipeline stages.',
    ratings: { pipedrive: 10, streak: 6, followupboss: 10 },
    whyItMatters: 'Instantly creates tasks (e.g., "Schedule Inspection") when a card is dragged to "Under Contract".'
  },
  {
    id: 'compliance_blueprints',
    name: 'Compliance Escrow Blueprints',
    category: 'Workflows & Automation',
    description: 'Rigid, secure step-by-step transaction pipelines to enforce local disclosure laws.',
    ratings: { pipedrive: 4, streak: 2, followupboss: 9 },
    whyItMatters: 'Acts like a digital escrow manager, protecting you from missing critical regulatory dates.'
  },
  {
    id: 'anniversary_triggers',
    name: 'Custom Workflow Triggers',
    category: 'Workflows & Automation',
    description: 'Trigger automations responding to dates, such as home buyer closing anniversaries.',
    ratings: { pipedrive: 9, streak: 4, followupboss: 10 },
    whyItMatters: 'Nurtures past clients for life automatically, driving future listing referrals with zero daily effort.'
  },

  // Category 4: Schedulers & Signatures
  {
    id: 'calendar_scheduler',
    name: 'Meeting Booking Link (Scheduler)',
    category: 'Schedulers & Signatures',
    description: 'Booking page where clients can select open time slots directly on your calendar.',
    ratings: { pipedrive: 9, streak: 4, followupboss: 8 },
    whyItMatters: 'Replaces Calendly. Eliminates back-and-forth texting to arrange property presentation slots.'
  },
  {
    id: 'builtin_signatures',
    name: 'Built-in E-Signatures',
    category: 'Schedulers & Signatures',
    description: 'Draft, send, and track legally binding contracts or listing agreements from the CRM.',
    ratings: { pipedrive: 9, streak: 3, followupboss: 6 },
    whyItMatters: 'Saves you from paying for secondary signing software just to complete client agreements.'
  },

  // Category 5: Mobile App & Fieldwork
  {
    id: 'speedy_mobile_app',
    name: 'Blazing-Fast Mobile Field App',
    category: 'Mobile App & Fieldwork',
    description: 'Fluid mobile application optimized for on-the-road mapping and client lookups.',
    ratings: { pipedrive: 10, streak: 8, followupboss: 10 },
    whyItMatters: 'Essential for looking up active lead phone numbers and lockbox notes while waiting at a property.'
  },
  {
    id: 'audio_notes_logging',
    name: 'Voice Note & Call Logging',
    category: 'Mobile App & Fieldwork',
    description: 'Record quick voice feedback and log call outcomes in two taps immediately after a showing.',
    ratings: { pipedrive: 10, streak: 6, followupboss: 10 },
    whyItMatters: 'Allows you to document showing objections while walking back to your car, before details fade.'
  },

  // Category 6: Cost & Budget
  {
    id: 'permanent_free_tier',
    name: 'Permanent Free Plan',
    category: 'Cost & Budget',
    description: 'A robust zero-dollar tier to organize your core database with no fixed monthly overhead.',
    ratings: { pipedrive: 0, streak: 10, followupboss: 0 },
    whyItMatters: 'Perfect for newly licensed real estate agents seeking zero cost until they close their first deals.'
  },
  {
    id: 'cheap_starter_tiers',
    name: 'Affordable Paid Growth Tiers (< $30/mo)',
    category: 'Cost & Budget',
    description: 'Paid plans packed with sequences and automations under thirty dollars a month.',
    ratings: { pipedrive: 9, streak: 10, followupboss: 3 },
    whyItMatters: 'Avoids the "HubSpot Trap", where basic automation upgrades jump immediately to $90/month.'
  }
];

export interface TechnicalTermInfo {
  term: string;
  shortLabel: string;
  definition: string;
  category: string;
  example: string;
}

export const TECHNICAL_TERMS_GLOSSARY: Record<string, TechnicalTermInfo> = {
  'api_webhooks': {
    term: 'API Webhooks & Zapier Sync',
    shortLabel: 'API Webhooks',
    definition: 'Real-time HTTP event notifications that push new leads from landing pages, Zillow, or Facebook Ads straight into your CRM instantly without manual entry.',
    category: 'Workflows & Automation',
    example: 'A buyer fills out a form on your website; webhooks instantly create a new contact card in your CRM in under 1 second.'
  },
  'lead_routing': {
    term: 'Lead Routing & Auto-Assignment',
    shortLabel: 'Lead Routing',
    definition: 'Automated distribution engine that assigns incoming leads to specific pipelines or agents based on zip code, price point, or round-robin availability.',
    category: 'Workflows & Automation',
    example: 'All leads over $1M auto-route to your Luxury Buyer pipeline and trigger an immediate text alert to your phone.'
  },
  'kanban_pipeline': {
    term: 'Kanban Drag-and-Drop Pipeline',
    shortLabel: 'Kanban Pipeline',
    definition: 'A visual card column layout showing active listings and buyer deals across sequential stages (e.g. Showing -> Offer -> Escrow -> Closed).',
    category: 'Sales & Pipelines',
    example: 'Drag a buyer card from "Property Viewing" to "Offer Submitted" with one click.'
  },
  'two_way_email_sync': {
    term: 'Two-Way Email Sync',
    shortLabel: 'Two-Way Sync',
    definition: 'Direct bidirectional integration with Gmail or Outlook that automatically logs all outgoing and incoming client emails onto their deal timeline.',
    category: 'Email & Outreach',
    example: 'Emailing a seller from your iPhone auto-appears in their CRM activity log.'
  },
  'stage_enforcement': {
    term: 'Stage-Change Checklist Enforcement',
    shortLabel: 'Stage Enforcement',
    definition: 'Strict workflow guardrails requiring specific data fields (like inspection dates or contract price) before a card can be moved to the next stage.',
    category: 'Sales & Pipelines',
    example: 'Prevents moving a deal to "Under Contract" until earnest money verification is recorded.'
  },
  'compliance_blueprints': {
    term: 'Compliance Escrow Blueprints',
    shortLabel: 'Compliance Blueprints',
    definition: 'Pre-configured regulatory checklists enforcing state disclosure forms, appraisal contingencies, and audit trails during escrow.',
    category: 'Workflows & Automation',
    example: 'Automatically flags missing lead-based paint disclosures before closing day.'
  },
  'automated_sequences': {
    term: 'Automated Drip Sequences',
    shortLabel: 'Drip Sequences',
    definition: 'Automated series of multi-step emails or SMS follow-ups delivered over time to nurture cold leads and open house visitors.',
    category: 'Email & Outreach',
    example: 'Sends a 5-part homebuyer guide over 14 days without manual writing.'
  },
  'pd_pipedrive': {
    term: 'Pipedrive CRM (PD)',
    shortLabel: 'Pipedrive (PD)',
    definition: 'Visual sales pipeline CRM known for fast deal card drag-and-drop, custom property fields, and activity automation.',
    category: 'CRM Platform',
    example: 'Scored 10/10 for visual escrow pipeline management.'
  },
  'st_streak': {
    term: 'Streak CRM (ST)',
    shortLabel: 'Streak (ST)',
    definition: 'Spreadsheet-style CRM that operates entirely inside Gmail without opening an external browser tab.',
    category: 'CRM Platform',
    example: 'Scored 10/10 for email tracking and Gmail integration.'
  },
  'fb_followupboss': {
    term: 'Follow Up Boss (FB)',
    shortLabel: 'Follow Up Boss (FB)',
    definition: 'Real estate-specific CRM platform engineered for team dialing, speed-to-lead routing, and automated lead aggregation.',
    category: 'CRM Platform',
    example: 'Scored 10/10 for phone call logging and lead routing speed.'
  }
};

export function HeaderTermTooltip({
  termKey,
  label,
  children,
  position = 'top'
}: {
  termKey?: string;
  label?: string;
  children?: React.ReactNode;
  position?: 'top' | 'bottom';
}) {
  const [isOpen, setIsOpen] = useState(false);
  const info = termKey ? TECHNICAL_TERMS_GLOSSARY[termKey] : null;

  const displayTerm = info ? info.term : (label || 'Technical Term');
  const displayDefinition = info 
    ? info.definition 
    : 'Hover over header labels and technical checklist items to inspect plain-English real estate CRM term definitions.';
  const displayCategory = info?.category || 'Glossary';
  const displayExample = info?.example;

  return (
    <span 
      className="relative inline-flex items-center gap-1 group/tooltip"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <span 
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        className="cursor-help border-b border-dashed border-primary/40 hover:border-accent hover:text-accent transition-colors"
      >
        {children || info?.shortLabel || displayTerm}
      </span>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        className="text-primary/70 hover:text-accent p-0.5 rounded-full transition cursor-help focus:outline-none"
        aria-label={`Tooltip for ${displayTerm}`}
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: position === 'top' ? 4 : -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: position === 'top' ? 4 : -4 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 w-72 md:w-80 p-3.5 bg-primary text-white text-xs rounded-xs shadow-2xl border-2 border-accent pointer-events-auto font-sans leading-normal ${
              position === 'top' 
                ? 'bottom-full mb-2 left-1/2 -translate-x-1/2' 
                : 'top-full mt-2 left-1/2 -translate-x-1/2'
            }`}
          >
            <div className="flex items-center justify-between border-b border-white/15 pb-2 mb-2">
              <span className="font-black uppercase tracking-wider text-[11px] text-accent font-display flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 fill-accent" /> {displayTerm}
              </span>
              <span className="text-[8px] bg-accent text-primary font-black px-1.5 py-0.5 rounded-xs uppercase font-mono">
                {displayCategory}
              </span>
            </div>
            <p className="text-[11px] text-gray-200 font-medium leading-relaxed">
              {displayDefinition}
            </p>
            {displayExample && (
              <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-gray-300 italic font-sans">
                <strong className="text-accent not-italic font-mono">Real World Example:</strong> "{displayExample}"
              </div>
            )}
            {/* Arrow */}
            <div 
              className={`absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-primary rotate-45 border-accent ${
                position === 'top' ? 'top-full -mt-1.5 border-r-2 border-b-2' : 'bottom-full -mb-1.5 border-l-2 border-t-2'
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

interface FeatureChecklistProps {
  onNavigateToCRM: (slug: string) => void;
  reviews: any[];
}

export default function FeatureChecklist({ onNavigateToCRM, reviews }: FeatureChecklistProps) {
  const { preferences, setPreferences } = useCRMFilterPreferences();

  const [selectedIds, setSelectedIds] = useState<string[]>(
    preferences.checklistSelectedIds && preferences.checklistSelectedIds.length > 0
      ? preferences.checklistSelectedIds
      : ['kanban_pipeline', 'two_way_email_sync', 'speedy_mobile_app', 'cheap_starter_tiers']
  );
  
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>(preferences.checklistCategoryFilter || 'All');
  const [searchQuery, setSearchQuery] = useState<string>(preferences.checklistSearchQuery || '');
  const [showExplanationId, setShowExplanationId] = useState<string | null>(null);

  // Sync state changes back to local storage preferences
  useEffect(() => {
    setPreferences({
      checklistSelectedIds: selectedIds,
      checklistCategoryFilter: activeCategoryFilter,
      checklistSearchQuery: searchQuery
    });
  }, [selectedIds, activeCategoryFilter, searchQuery, setPreferences]);

  // Unique categories
  const categories = useMemo(() => {
    return ['All', 'Sales & Pipelines', 'Email & Outreach', 'Workflows & Automation', 'Schedulers & Signatures', 'Mobile App & Fieldwork', 'Cost & Budget'];
  }, []);

  // Filter features
  const filteredFeatures = useMemo(() => {
    return FEATURES_DATA.filter(feature => {
      const matchesCategory = activeCategoryFilter === 'All' || feature.category === activeCategoryFilter;
      const matchesSearch = feature.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            feature.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            feature.whyItMatters.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategoryFilter, searchQuery]);

  // Toggle selection
  const handleToggleFeature = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  // Quick select actions
  const handleQuickSelect = (type: 'all' | 'clear' | 'core' | 'budget') => {
    if (type === 'all') {
      setSelectedIds(FEATURES_DATA.map(f => f.id));
    } else if (type === 'clear') {
      setSelectedIds([]);
    } else if (type === 'core') {
      setSelectedIds(['kanban_pipeline', 'custom_property_fields', 'two_way_email_sync', 'speedy_mobile_app']);
    } else if (type === 'budget') {
      setSelectedIds(['permanent_free_tier', 'cheap_starter_tiers', 'kanban_pipeline']);
    }
  };

  // Calculate dynamic scores and matches
  const matchResults = useMemo(() => {
    if (selectedIds.length === 0) {
      return [
        { id: 'pipedrive', name: 'Pipedrive', score: 0, percentage: 0, logo: '💼', slug: 'pipedrive-for-real-estate-agents', colorClass: 'border-l-primary', accentClass: 'bg-primary' },
        { id: 'streak', name: 'Streak CRM', score: 0, percentage: 0, logo: '📥', slug: 'streak-for-real-estate-agents', colorClass: 'border-l-accent', accentClass: 'bg-accent' },
        { id: 'followupboss', name: 'Follow Up Boss', score: 0, percentage: 0, logo: '🎯', slug: 'followupboss-for-real-estate-agents', colorClass: 'border-l-gray-400', accentClass: 'bg-gray-500' }
      ];
    }

    const selectedFeatures = FEATURES_DATA.filter(f => selectedIds.includes(f.id));
    const totalPossiblePoints = selectedFeatures.length * 10;

    const calculateCrmResults = (crmKey: 'pipedrive' | 'streak' | 'followupboss') => {
      const totalPoints = selectedFeatures.reduce((acc, f) => acc + f.ratings[crmKey], 0);
      const percentage = Math.round((totalPoints / totalPossiblePoints) * 100);
      return {
        points: totalPoints,
        percentage
      };
    };

    const pipedriveRes = calculateCrmResults('pipedrive');
    const streakRes = calculateCrmResults('streak');
    const followupbossRes = calculateCrmResults('followupboss');

    const results = [
      {
        id: 'pipedrive',
        name: 'Pipedrive',
        score: pipedriveRes.points,
        percentage: pipedriveRes.percentage,
        logo: '💼',
        slug: 'pipedrive-for-real-estate-agents',
        colorClass: 'border-l-primary',
        accentClass: 'bg-primary',
        reviewData: reviews.find(r => r.id === 'pipedrive')
      },
      {
        id: 'streak',
        name: 'Streak CRM',
        score: streakRes.points,
        percentage: streakRes.percentage,
        logo: '📥',
        slug: 'streak-for-real-estate-agents',
        colorClass: 'border-l-accent',
        accentClass: 'bg-accent',
        reviewData: reviews.find(r => r.id === 'streak')
      },
      {
        id: 'followupboss',
        name: 'Follow Up Boss',
        score: followupbossRes.points,
        percentage: followupbossRes.percentage,
        logo: '🎯',
        slug: 'followupboss-for-real-estate-agents',
        colorClass: 'border-l-gray-400',
        accentClass: 'bg-gray-500',
        reviewData: reviews.find(r => r.id === 'followupboss')
      }
    ];

    // Sort descending by match percentage
    return results.sort((a, b) => b.percentage - a.percentage);
  }, [selectedIds, reviews]);

  const winner = matchResults[0];

  // Map icons for category tabs
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Sales & Pipelines': return <Layers className="w-3.5 h-3.5" />;
      case 'Email & Outreach': return <Mail className="w-3.5 h-3.5" />;
      case 'Workflows & Automation': return <Zap className="w-3.5 h-3.5" />;
      case 'Schedulers & Signatures': return <FileCheck className="w-3.5 h-3.5" />;
      case 'Mobile App & Fieldwork': return <Smartphone className="w-3.5 h-3.5" />;
      case 'Cost & Budget': return <DollarSign className="w-3.5 h-3.5" />;
      default: return <Filter className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Upper Intro Banner */}
      <div className="bg-primary text-white py-16 px-4 md:px-8 relative overflow-hidden rounded-xs">
        <div className="absolute right-0 top-0 -mr-24 -mt-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-block bg-accent text-primary text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-xs">
            Interactive Agent Tools
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-display uppercase tracking-tighter leading-none text-white">
            CRM FEATURE CHECKLIST MATCHMAKER
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto text-sm leading-relaxed">
            Select the exact workflows and tools you need below. Our system matches your priorities against real testing scores to suggest the ideal platform for your business.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Checkbox Selector (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xs border-2 border-primary shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-primary pb-4">
            <div>
              <h2 className="text-xl font-black text-primary font-display uppercase tracking-tight">
                Select Your Requirements
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Check features that are non-negotiable for your day-to-day operations.
              </p>
            </div>
            
            {/* Selected Counter */}
            <span className="font-mono font-black text-xs text-white px-2.5 py-1 bg-primary rounded-xs border border-primary shrink-0 text-center">
              {selectedIds.length} Selected
            </span>
          </div>

          {/* Quick Select Buttons & Glossary Bar */}
          <div className="space-y-3 pt-1">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleQuickSelect('core')}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-primary font-black uppercase tracking-wider text-[10px] rounded-xs border border-gray-200 transition cursor-pointer"
              >
                ⭐ Core Real Estate Specs
              </button>
              <button
                onClick={() => handleQuickSelect('budget')}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-primary font-black uppercase tracking-wider text-[10px] rounded-xs border border-gray-200 transition cursor-pointer"
              >
                💰 Budget &amp; Free Nurture
              </button>
              <button
                onClick={() => handleQuickSelect('all')}
                className="px-3 py-1.5 bg-primary/5 hover:bg-primary/10 text-primary font-black uppercase tracking-wider text-[10px] rounded-xs border border-primary/25 transition cursor-pointer"
              >
                Select All
              </button>
              <button
                onClick={() => handleQuickSelect('clear')}
                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-black uppercase tracking-wider text-[10px] rounded-xs border border-red-200 transition cursor-pointer"
              >
                Clear All
              </button>
            </div>

            {/* Interactive Technical Terms Glossary Quick Bar */}
            <div className="p-3 bg-primary/5 border border-primary/15 rounded-xs space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-primary">
                <span className="flex items-center gap-1 text-accent">
                  <Sparkles className="w-3 h-3 fill-accent" /> Technical Terms Glossary
                </span>
                <span className="text-gray-400 font-mono text-[9px] font-normal">Hover terms for instant definition</span>
              </div>
              <div className="flex flex-wrap gap-2 text-[10px]">
                <HeaderTermTooltip termKey="api_webhooks" />
                <span className="text-gray-300">•</span>
                <HeaderTermTooltip termKey="lead_routing" />
                <span className="text-gray-300">•</span>
                <HeaderTermTooltip termKey="kanban_pipeline" />
                <span className="text-gray-300">•</span>
                <HeaderTermTooltip termKey="two_way_email_sync" />
                <span className="text-gray-300">•</span>
                <HeaderTermTooltip termKey="stage_enforcement" />
                <span className="text-gray-300">•</span>
                <HeaderTermTooltip termKey="compliance_blueprints" />
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search features (e.g. email, mobile, free, custom)..."
              className="w-full px-4 py-3 bg-[#F8F9FA] border-2 border-primary rounded-xs text-primary font-bold text-xs uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategoryFilter(cat)}
                className={`px-3 py-2 text-[10px] font-black uppercase tracking-wider rounded-xs border-2 transition flex items-center gap-1.5 cursor-pointer ${
                  activeCategoryFilter === cat
                    ? 'bg-primary text-accent border-primary'
                    : 'bg-white text-gray-500 hover:text-primary border-gray-100 hover:border-gray-300'
                }`}
              >
                {getCategoryIcon(cat)}
                {cat}
              </button>
            ))}
          </div>

          {/* Features Checklist List */}
          <div className="space-y-4 pt-2">
            {filteredFeatures.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-200 rounded-xs">
                <p className="text-sm text-gray-500 font-bold">No features match your current filter or search queries.</p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategoryFilter('All'); }}
                  className="mt-3 text-xs font-black uppercase tracking-widest text-accent hover:underline cursor-pointer"
                >
                  Reset filters &rarr;
                </button>
              </div>
            ) : (
              filteredFeatures.map((feature) => {
                const isChecked = selectedIds.includes(feature.id);
                const isExplanationOpen = showExplanationId === feature.id;
                
                return (
                  <div 
                    key={feature.id}
                    className={`p-4 border-2 rounded-xs transition-all flex flex-col gap-3 ${
                      isChecked 
                        ? 'bg-primary/5 border-primary shadow-xs' 
                        : 'bg-white border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Custom Large Checkbox */}
                      <button
                        onClick={() => handleToggleFeature(feature.id)}
                        className={`w-6 h-6 border-2 flex items-center justify-center shrink-0 rounded-xs transition cursor-pointer ${
                          isChecked 
                            ? 'bg-primary border-primary text-accent' 
                            : 'bg-white border-gray-300 hover:border-primary'
                        }`}
                        aria-label={`Toggle ${feature.name}`}
                      >
                        {isChecked && <Check className="w-4 h-4 stroke-[4]" />}
                      </button>

                      {/* Header and Details */}
                      <div className="flex-grow space-y-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <h3 
                            className="font-black text-primary text-sm font-display uppercase tracking-tight cursor-pointer hover:text-accent transition-colors"
                            onClick={() => handleToggleFeature(feature.id)}
                          >
                            {feature.name}
                          </h3>
                          {(() => {
                            const glossaryKeyMap: Record<string, string> = {
                              'api_webhooks': 'api_webhooks',
                              'lead_routing': 'lead_routing',
                              'kanban_pipeline': 'kanban_pipeline',
                              'two_way_email_sync': 'two_way_email_sync',
                              'required_fields': 'stage_enforcement',
                              'compliance_blueprints': 'compliance_blueprints',
                              'automated_sequences': 'automated_sequences'
                            };
                            const matchedKey = glossaryKeyMap[feature.id];
                            return matchedKey ? (
                              <HeaderTermTooltip termKey={matchedKey} />
                            ) : null;
                          })()}
                          <span className="text-[8px] bg-primary/10 text-primary font-black uppercase tracking-wider px-1.5 py-0.5 rounded-xs">
                            {feature.category}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed font-sans">
                          {feature.description}
                        </p>
                      </div>

                      {/* More info trigger */}
                      <button
                        onClick={() => setShowExplanationId(isExplanationOpen ? null : feature.id)}
                        className={`p-1.5 text-gray-400 hover:text-primary transition shrink-0 cursor-pointer ${
                          isExplanationOpen ? 'text-primary bg-gray-100 rounded-xs' : ''
                        }`}
                        title="Why does this matter?"
                      >
                        <HelpCircle className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Expandable Why It Matters block */}
                    {isExplanationOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-accent/5 border-l-4 border-l-accent p-3.5 rounded-xs text-xs space-y-2 text-primary overflow-hidden font-sans"
                      >
                        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wide text-[10px] text-accent">
                          <Sparkles className="w-3.5 h-3.5" /> Realtor Impact Value:
                        </div>
                        <p className="leading-relaxed font-medium">
                          {feature.whyItMatters}
                        </p>
                        
                        {/* Little score tags */}
                        <div className="pt-2 border-t border-accent/20 flex flex-wrap gap-4 text-[9px] uppercase font-bold tracking-wider text-gray-500">
                          <span>Pipedrive Grade: <strong className="text-primary">{feature.ratings.pipedrive}/10</strong></span>
                          <span>Streak Grade: <strong className="text-primary">{feature.ratings.streak}/10</strong></span>
                          <span>Follow Up Boss Grade: <strong className="text-primary">{feature.ratings.followupboss}/10</strong></span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Recommendation Board (5 cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          
          {/* Main Results Panel */}
          <div className="bg-primary text-white p-6 md:p-8 rounded-xs border-b-8 border-accent relative overflow-hidden shadow-md space-y-6">
            <div className="absolute right-0 top-0 -mr-12 -mt-12 w-48 h-48 bg-accent/15 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="space-y-2">
              <div className="inline-block bg-accent text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-xs">
                Matches Calibrated Live
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white font-display uppercase tracking-tighter leading-none">
                YOUR TOP CRM MATCH
              </h2>
            </div>

            {selectedIds.length === 0 ? (
              <div className="py-8 text-center text-gray-300 space-y-3">
                <span className="text-4xl block">📋</span>
                <p className="text-xs font-bold uppercase tracking-wider">
                  Check features on the left to compute matching recommendations.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Winner Card */}
                <div className="bg-white/5 border border-white/10 p-5 rounded-xs relative flex items-center justify-between">
                  <div className="space-y-1.5">
                    <span className="text-xs text-accent font-black uppercase tracking-widest flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 fill-accent" /> Recommended Winner
                    </span>
                    <h3 className="text-3xl font-black text-white font-display uppercase tracking-tight">
                      {winner.name}
                    </h3>
                    <p className="text-xs text-gray-300 font-sans leading-relaxed">
                      Matches {Math.round(winner.percentage)}% of your business requirements.
                    </p>
                  </div>
                  
                  <span className="text-4xl p-3 bg-white/10 rounded-xs">{winner.logo}</span>
                </div>

                {/* Score list with progress bars */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-black tracking-wider uppercase text-gray-400">
                    How all candidates match up:
                  </h4>
                  
                  <div className="space-y-3.5">
                    {matchResults.map((crm) => (
                      <div key={crm.id} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="flex items-center gap-1.5 font-display uppercase tracking-wider text-gray-200">
                            <span>{crm.logo}</span>
                            {crm.name}
                          </span>
                          <span className="font-mono text-accent font-black text-sm">
                            {crm.percentage}% Match
                          </span>
                        </div>
                        {/* Gauge bar */}
                        <div className="h-2 bg-white/10 rounded-xs overflow-hidden border border-white/5">
                          <motion.div 
                            className="h-full bg-accent"
                            initial={{ width: 0 }}
                            animate={{ width: `${crm.percentage}%` }}
                            transition={{ duration: 0.4 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Winner Call to Action */}
                <div className="pt-2">
                  <button
                    onClick={() => onNavigateToCRM(winner.slug)}
                    className="w-full py-4 bg-accent hover:bg-accent/90 text-primary font-black uppercase tracking-widest text-xs rounded-xs shadow-md transition duration-150 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Read Full {winner.name} Review <ArrowRight className="w-4 h-4" />
                  </button>
                  {(winner as any).reviewData && (
                    <a
                      href={(winner as any).reviewData.affiliateLink}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      className="mt-2.5 w-full py-3 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-[10px] uppercase tracking-wider rounded-xs flex items-center justify-center gap-1 hover:text-accent transition-colors cursor-pointer text-center"
                    >
                      Start Free Trial &rarr;
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Detailed Features Scorecard breakdown table */}
          {selectedIds.length > 0 && (
            <div className="bg-white p-5 rounded-xs border-2 border-primary shadow-sm space-y-4">
              <h3 className="text-sm font-black text-primary font-display uppercase tracking-tight border-b-2 border-primary pb-2.5">
                Feature Support Breakdown
              </h3>
              
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {FEATURES_DATA.filter(f => selectedIds.includes(f.id)).map((feature) => {
                  return (
                    <div key={feature.id} className="p-3 bg-gray-50 border border-gray-100 rounded-xs space-y-2 text-xs">
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-bold text-primary uppercase tracking-tight">{feature.name}</span>
                        <span className="text-[8px] bg-primary/5 text-primary font-black uppercase px-1 py-0.5 rounded-xs shrink-0">{feature.category}</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-[10px] pt-1.5 border-t border-gray-200/50">
                        {/* Pipedrive indicator */}
                        <div className="flex items-center gap-1 font-semibold text-gray-500">
                          <span>💼</span>
                          <HeaderTermTooltip termKey="pd_pipedrive">
                            <span className="truncate font-bold">PD:</span>
                          </HeaderTermTooltip>
                          <span className={`font-bold ml-auto font-mono ${
                            feature.ratings.pipedrive >= 8 
                              ? 'text-success' 
                              : feature.ratings.pipedrive >= 5 
                              ? 'text-accent' 
                              : 'text-red-500'
                          }`}>
                            {feature.ratings.pipedrive}/10
                          </span>
                        </div>

                        {/* Streak indicator */}
                        <div className="flex items-center gap-1 font-semibold text-gray-500">
                          <span>📥</span>
                          <HeaderTermTooltip termKey="st_streak">
                            <span className="truncate font-bold">ST:</span>
                          </HeaderTermTooltip>
                          <span className={`font-bold ml-auto font-mono ${
                            feature.ratings.streak >= 8 
                              ? 'text-success' 
                              : feature.ratings.streak >= 5 
                              ? 'text-accent' 
                              : 'text-red-500'
                          }`}>
                            {feature.ratings.streak}/10
                          </span>
                        </div>

                        {/* Follow Up Boss indicator */}
                        <div className="flex items-center gap-1 font-semibold text-gray-500">
                          <span>📞</span>
                          <HeaderTermTooltip termKey="fb_followupboss">
                            <span className="truncate font-bold">FB:</span>
                          </HeaderTermTooltip>
                          <span className={`font-bold ml-auto font-mono ${
                            feature.ratings.followupboss >= 8 
                              ? 'text-success' 
                              : feature.ratings.followupboss >= 5 
                              ? 'text-accent' 
                              : 'text-red-500'
                          }`}>
                            {feature.ratings.followupboss}/10
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-relaxed pt-1">
                ⚠️ PD = Pipedrive | ST = Streak | FB = Follow Up Boss. Grades based on solo-agent user testing of features vs pricing tiers.
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
