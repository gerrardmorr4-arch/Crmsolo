import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { automationBlueprints, AutomationBlueprint } from '../data/blueprintsData';
import { useSEO } from '../lib/seo';
import { 
  Zap, 
  CheckCircle2, 
  Copy, 
  Check, 
  Clock, 
  TrendingUp, 
  Share2, 
  Download, 
  Filter, 
  ArrowRight, 
  Sparkles, 
  ChevronRight, 
  Layers, 
  Mail, 
  MessageSquare, 
  Code, 
  HelpCircle,
  Award,
  BookOpen,
  ArrowUpRight
} from 'lucide-react';

interface BlueprintsPageProps {
  blueprintSlug?: string | null;
  onNavigate: (path: string) => void;
}

export default function BlueprintsPage({ blueprintSlug, onNavigate }: BlueprintsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeBlueprintId, setActiveBlueprintId] = useState<string>(
    blueprintSlug 
      ? automationBlueprints.find(b => b.slug === blueprintSlug || b.id === blueprintSlug)?.id || automationBlueprints[0].id
      : automationBlueprints[0].id
  );

  // Filter blueprints
  const categories = ['All', 'Speed-to-Lead', 'Listing & Escrow', 'Pinterest & Social', 'Client Retention', 'Lead Generation'];

  const filteredBlueprints = useMemo(() => {
    if (selectedCategory === 'All') return automationBlueprints;
    return automationBlueprints.filter(b => b.category === selectedCategory);
  }, [selectedCategory]);

  const activeBlueprint = useMemo(() => {
    return automationBlueprints.find(b => b.id === activeBlueprintId) || automationBlueprints[0];
  }, [activeBlueprintId]);

  // Handle SEO
  useSEO({
    title: activeBlueprint ? `${activeBlueprint.title} (Step-by-Step Blueprint)` : 'Real Estate CRM Automation Blueprints (2026)',
    description: activeBlueprint ? activeBlueprint.tagline : 'Actionable, step-by-step CRM automation workflows, speed-to-lead scripts, Kanban escrow tracking, and Pinterest traffic blueprints for solo realtors.',
    keywords: ['real estate crm blueprint', 'speed to lead automation', 'realtor workflow templates', 'pipedrive blueprint', 'follow up boss scripts', 'real estate lead funnel'],
    ogType: 'article'
  }, [activeBlueprintId]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleDownloadMarkdown = (blueprint: AutomationBlueprint) => {
    let md = `# ${blueprint.title}\n\n`;
    md += `**Tagline:** ${blueprint.tagline}\n`;
    md += `**Category:** ${blueprint.category} | **Difficulty:** ${blueprint.difficulty} | **Deploy Time:** ${blueprint.timeToDeploy}\n`;
    md += `**ROI Impact:** ${blueprint.roiImpact}\n\n`;
    md += `## Overview\n${blueprint.summary}\n\n`;
    md += `**Trigger Event:** ${blueprint.triggerEvent}\n\n`;
    md += `## Step-by-Step Implementation Steps\n\n`;
    blueprint.steps.forEach(s => {
      md += `### Step ${s.stepNumber}: ${s.title} (${s.timeframe})\n`;
      md += `- **Action:** ${s.action}\n`;
      md += `- **Recommended Tools:** ${s.tools.join(', ')}\n`;
      md += `- **Pro Tip:** ${s.proTip}\n`;
      if (s.templateSnippet) {
        md += `- **Sample Snippet:**\n\`\`\`\n${s.templateSnippet}\n\`\`\`\n`;
      }
      md += `\n`;
    });
    md += `## Copy-and-Paste Templates\n\n`;
    blueprint.copyableTemplates.forEach(t => {
      md += `### ${t.title} (${t.type.toUpperCase()})\n*${t.description}*\n\n\`\`\`\n${t.content}\n\`\`\`\n\n`;
    });
    md += `\n---\n*Exported from CRMsolo (https://crmsolo.online/blueprints)*\n`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${blueprint.slug}-blueprint.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      
      {/* Top Breadcrumb Header */}
      <div className="bg-primary text-white p-8 md:p-12 rounded-2xl shadow-xl relative overflow-hidden border-2 border-primary/20">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-accent/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 border border-accent/40 rounded-full text-accent font-mono text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 fill-accent" /> Actionable Solo Agent Systems
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-white uppercase">
            Real Estate CRM <span className="text-accent">Automation Blueprints</span>
          </h1>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            Eliminate lead leakage and save 10+ hours every week. Plug these battle-tested Zapier webhooks, 2-minute speed-to-lead scripts, escrow Kanban boards, and Pinterest traffic funnels directly into your CRM.
          </p>
        </div>
      </div>

      {/* Category Filter Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-gray-200">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? 'bg-primary text-accent shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid: Blueprint Selector Sidebar + Interactive Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Sidebar: Blueprint Cards */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-mono font-bold uppercase text-gray-500 tracking-wider flex items-center justify-between px-1">
            <span>Available Blueprints ({filteredBlueprints.length})</span>
            <Sparkles className="w-3.5 h-3.5 text-accent" />
          </div>

          <div className="space-y-3">
            {filteredBlueprints.map((bp) => {
              const isSelected = bp.id === activeBlueprint.id;
              return (
                <div
                  key={bp.id}
                  onClick={() => {
                    setActiveBlueprintId(bp.id);
                    window.history.pushState(null, '', `/blueprints/${bp.slug}`);
                  }}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-white border-accent shadow-md ring-2 ring-accent/20'
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {bp.category}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> {bp.timeToDeploy}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-primary font-display leading-snug">
                    {bp.title}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                    {bp.tagline}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                    <span className="font-medium truncate max-w-[180px]">
                      {bp.targetCrms.slice(0, 2).join(', ')}
                    </span>
                    <span className={`font-bold flex items-center gap-0.5 ${isSelected ? 'text-accent' : 'text-gray-400'}`}>
                      View System <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick ROI Cross-Link */}
          <div className="bg-gradient-to-br from-primary to-slate-900 text-white p-5 rounded-xl space-y-3 mt-6 border border-slate-700">
            <div className="w-8 h-8 rounded-lg bg-accent/20 text-accent flex items-center justify-center font-bold">
              $
            </div>
            <h4 className="text-sm font-black font-display text-white uppercase">
              Want to see your specific dollar savings?
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              Use our interactive commission & time-recovery calculator to model your exact deal volume.
            </p>
            <button
              onClick={() => onNavigate('/calculator')}
              className="w-full py-2 bg-accent hover:bg-accent/90 text-primary font-black text-xs uppercase tracking-wider rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              Launch ROI Calculator <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Area: Interactive Active Blueprint Breakdown */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm p-6 sm:p-8 space-y-8">
            
            {/* Header / Meta */}
            <div className="space-y-4 border-b border-gray-100 pb-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase px-2.5 py-1 bg-accent/15 text-primary rounded-md border border-accent/30">
                    {activeBlueprint.category}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md">
                    Difficulty: {activeBlueprint.difficulty}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {activeBlueprint.timeToDeploy}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadMarkdown(activeBlueprint)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition cursor-pointer"
                    title="Export Blueprint as Markdown file"
                  >
                    <Download className="w-3.5 h-3.5" /> Export Markdown
                  </button>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-primary font-display leading-tight">
                {activeBlueprint.title}
              </h2>

              <p className="text-gray-600 text-sm leading-relaxed">
                {activeBlueprint.summary}
              </p>

              {/* High-Impact Stat Callout */}
              <div className="p-3.5 bg-accent/10 border-l-4 border-accent rounded-r-lg flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-accent shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-primary">Expected Output: </span>
                  <span className="text-gray-800 font-medium">{activeBlueprint.roiImpact}</span>
                </div>
              </div>

              {/* Supported Tools */}
              <div className="flex items-center gap-2 pt-2 text-xs text-gray-500">
                <span className="font-bold uppercase tracking-wider text-[10px] text-gray-400">Tested With:</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeBlueprint.targetCrms.map((crm) => (
                    <span key={crm} className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-semibold text-[11px]">
                      {crm}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Trigger Event Banner */}
            <div className="bg-slate-900 text-white p-4 rounded-xl flex items-start gap-3 border border-slate-800">
              <Zap className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold block">
                  Automated Trigger Event
                </span>
                <span className="text-sm font-semibold text-gray-100">
                  {activeBlueprint.triggerEvent}
                </span>
              </div>
            </div>

            {/* Step-by-Step Implementation Pipeline */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black font-display text-primary uppercase tracking-wide flex items-center gap-2">
                  <Layers className="w-4 h-4 text-accent" /> Implementation Sequence
                </h3>
                <span className="text-xs text-gray-400 font-mono">
                  {activeBlueprint.steps.length} Steps
                </span>
              </div>

              <div className="space-y-4">
                {activeBlueprint.steps.map((step, idx) => (
                  <div 
                    key={step.stepNumber}
                    className="p-5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white hover:border-gray-300 transition space-y-3 relative"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-primary text-accent flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-xs">
                          {step.stepNumber}
                        </div>
                        <h4 className="text-sm font-bold text-primary font-display">
                          {step.title}
                        </h4>
                      </div>
                      <span className="text-[11px] font-mono font-semibold text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200 shrink-0">
                        {step.timeframe}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed pl-10">
                      {step.action}
                    </p>

                    {/* Step Tools & Pro Tip */}
                    <div className="pl-10 pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-t border-gray-100">
                      <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                        <span className="font-bold text-gray-400">Tools:</span>
                        <span>{step.tools.join(', ')}</span>
                      </div>
                      <div className="text-[11px] text-accent font-medium bg-accent/5 px-2 py-0.5 rounded border border-accent/20">
                        💡 <strong>Pro Tip:</strong> {step.proTip}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ready-to-Use Copyable Templates & Code Snippets */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black font-display text-primary uppercase tracking-wide flex items-center gap-2">
                  <Copy className="w-4 h-4 text-accent" /> Ready-to-Deploy Templates & Snippets
                </h3>
                <span className="text-xs text-gray-400 font-mono">1-Click Copy</span>
              </div>

              <div className="space-y-4">
                {activeBlueprint.copyableTemplates.map((template, idx) => {
                  const copyKey = `${activeBlueprint.id}-template-${idx}`;
                  const isCopied = copiedId === copyKey;

                  return (
                    <div key={idx} className="rounded-xl border border-gray-200 overflow-hidden bg-slate-950 text-slate-100">
                      <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-accent/20 text-accent border border-accent/30">
                            {template.type}
                          </span>
                          <span className="text-xs font-bold text-white">
                            {template.title}
                          </span>
                        </div>

                        <button
                          onClick={() => handleCopy(template.content, copyKey)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                            isCopied
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5" /> Copied to Clipboard!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Copy Template
                            </>
                          )}
                        </button>
                      </div>

                      <div className="p-4">
                        <p className="text-[11px] text-slate-400 mb-2 font-mono">
                          // {template.description}
                        </p>
                        <pre className="text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed overflow-x-auto selection:bg-accent selection:text-primary">
                          {template.content}
                        </pre>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Implementation FAQ */}
            {activeBlueprint.faq && activeBlueprint.faq.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-black font-display text-primary uppercase tracking-wide flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-accent" /> Workflow FAQ
                </h3>
                <div className="space-y-3">
                  {activeBlueprint.faq.map((faqItem, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-1 text-xs">
                      <div className="font-bold text-primary">
                        Q: {faqItem.q}
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {faqItem.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-gray-500">
                Need to compare software pricing for this workflow?
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => onNavigate('/directory')}
                  className="flex-1 sm:flex-none px-4 py-2 bg-primary hover:bg-primary/95 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition text-center cursor-pointer"
                >
                  Browse CRM Directory
                </button>
                <button
                  onClick={() => onNavigate('/buyer-guide')}
                  className="flex-1 sm:flex-none px-4 py-2 bg-accent hover:bg-accent/90 text-primary font-black text-xs uppercase tracking-wider rounded-lg transition text-center cursor-pointer"
                >
                  Buyer's Guide Hub
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
