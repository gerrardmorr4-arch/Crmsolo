import React, { useState, useRef } from 'react';
import { Download, Copy, Check, Share2, Sparkles, Image, ExternalLink, Hash, Bookmark } from 'lucide-react';

export default function PinterestKitSection() {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<'navy' | 'emerald' | 'amber' | 'dark'>('navy');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const targetSite = 'https://crmsolo.com';

  const pinTemplates = [
    {
      id: 'pin-1',
      badge: 'CRM COMPARISON',
      title: 'Top 5 Real Estate CRMs for Solo Agents (2026 Comparison)',
      subtitle: 'Compare Pipedrive, Streak, and Follow Up Boss side-by-side.',
      destinationUrl: `${targetSite}/reviews`,
      description: 'Stop overpaying for bloated enterprise CRMs. Compare Pipedrive, Streak, and Follow Up Boss side-by-side. Save 10+ hours a week with automated speed-to-lead follow-ups and custom pipeline tracking! #RealEstateCRM #RealtorTools #RealEstateMarketing #SoloAgent #Pipedrive #FollowUpBoss',
      tags: ['#RealEstateCRM', '#RealtorTools', '#Pipedrive', '#FollowUpBoss', '#SoloRealtor']
    },
    {
      id: 'pin-2',
      badge: 'FREE INTERACTIVE TOOL',
      title: 'How Much Time & Money Is Your Real Estate CRM Costing You?',
      subtitle: 'Calculate your commission recovery value in under 60 seconds.',
      destinationUrl: `${targetSite}/calculator`,
      description: 'Calculate your annual commission recovery value and weekly time saved in under 60 seconds! Free interactive CRM ROI savings calculator built specifically for independent real estate brokers and solo agents. #RealtorROI #RealEstateTech #CRMCalculator #RealEstateLeadGen #RealtorLife',
      tags: ['#RealtorROI', '#RealEstateTech', '#CRMCalculator', '#LeadGen', '#RealtorLife']
    },
    {
      id: 'pin-3',
      badge: '25-30 SEO HACKS',
      title: '25-30 Proven Real Estate CRM & Pinterest Traffic Hacks (2026 SEO Playbook)',
      subtitle: 'Turn Google SEO and Pinterest impressions into active home buyers.',
      destinationUrl: `${targetSite}/blog/25-30-real-estate-crm-pinterest-traffic-hacks-seo-playbook`,
      description: 'Discover 25-30 actionable SEO and Pinterest lead generation strategies for solo realtors. Learn how to structure visual pipelines, automate open house follow-ups, and convert Pinterest impressions into buyer consultations. #RealEstateSEO #PinterestForRealtors #LeadGeneration #RealEstateMarketing #RealtorAutomation',
      tags: ['#RealEstateSEO', '#PinterestForRealtors', '#LeadGen', '#RealtorMarketing', '#Automation']
    },
    {
      id: 'pin-4',
      badge: 'PIPEDRIVE VS FOLLOW UP BOSS',
      title: 'Pipedrive vs Follow Up Boss: Which CRM Wins for Solo Realtors?',
      subtitle: 'Head-to-head review: speed-to-lead and highest return on investment.',
      destinationUrl: `${targetSite}/comparison/pipedrive-vs-followupboss-for-solo-realtors`,
      description: 'Pipedrive vs Follow Up Boss head-to-head review. Which CRM gives solo agents the fastest speed-to-lead and highest return on investment? Read the unbiased breakdown before buying. #PipedriveVsFollowUpBoss #RealtorCRM #RealEstateSoftware #AgentTools',
      tags: ['#PipedriveVsFollowUpBoss', '#RealtorCRM', '#RealEstateSoftware', '#AgentTools']
    },
    {
      id: 'pin-5',
      badge: 'FREE GMAIL WORKFLOW',
      title: 'Run Your Entire Real Estate Business Inside Gmail (Streak CRM Setup)',
      subtitle: 'Manage buyers, listing pipelines, and escrow dates right inside your inbox.',
      destinationUrl: `${targetSite}/reviews/streak-for-real-estate-agents`,
      description: 'How to manage real estate buyers, listing pipelines, and escrow dates directly inside your Gmail inbox for $0/mo. Step-by-step Streak CRM guide for solo real estate agents. #StreakCRM #GmailForRealtors #FreeRealtorCRM #RealEstateProductivity',
      tags: ['#StreakCRM', '#GmailForRealtors', '#FreeRealtorCRM', '#RealEstateProductivity']
    }
  ];

  const keywords2530 = [
    'real estate crm for solo agents', 'pipedrive real estate setup', 'follow up boss review',
    'streak crm for realtors', 'best crm for independent real estate brokers', 'real estate lead generation',
    'realtor marketing tips 2026', 'real estate automation tools', 'open house follow up email templates',
    'speed to lead real estate', 'real estate crm ROI calculator', 'buyer pipeline template',
    'seller listing presentation crm', 'real estate text automations', 'pinterest for realtors',
    'real estate seo guide', 'real estate email marketing', 'crm feature comparison',
    'solo realtor workflow', 'real estate escrow tracking', 'real estate tech stack 2026',
    'lead conversion rate real estate', 'zillow lead automation', 'realtor productivity hacks',
    'real estate sphere of influence newsletter'
  ];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(label);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownloadFile = (format: 'txt' | 'md' = 'txt') => {
    window.open(`/api/download-pinterest-kit?format=${format}`, '_blank');
  };

  const generateAndDownloadImage = (pin: typeof pinTemplates[0]) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1500; // Standard Pinterest 2:3 ratio
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Theme Background Colors
    let bgGrad;
    if (selectedTheme === 'navy') {
      bgGrad = ctx.createLinearGradient(0, 0, 1000, 1500);
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(1, '#1e293b');
    } else if (selectedTheme === 'emerald') {
      bgGrad = ctx.createLinearGradient(0, 0, 1000, 1500);
      bgGrad.addColorStop(0, '#064e3b');
      bgGrad.addColorStop(1, '#022c22');
    } else if (selectedTheme === 'amber') {
      bgGrad = ctx.createLinearGradient(0, 0, 1000, 1500);
      bgGrad.addColorStop(0, '#78350f');
      bgGrad.addColorStop(1, '#451a03');
    } else {
      bgGrad = ctx.createLinearGradient(0, 0, 1000, 1500);
      bgGrad.addColorStop(0, '#111827');
      bgGrad.addColorStop(1, '#030712');
    }

    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1000, 1500);

    // Decorative Geometric Accents
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, 920, 1420);

    // Header Badge
    ctx.fillStyle = '#f59e0b'; // Amber Gold
    ctx.beginPath();
    ctx.roundRect(80, 100, 420, 60, 30);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 26px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(pin.badge.toUpperCase(), 290, 138);

    // Main Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 54px serif';
    ctx.textAlign = 'left';

    // Wrap Title lines
    const words = pin.title.split(' ');
    let line = '';
    let y = 280;
    const maxWidth = 840;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, 80, y);
        line = words[n] + ' ';
        y += 70;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 80, y);

    // Subtitle
    y += 80;
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'normal 32px sans-serif';
    const subWords = pin.subtitle.split(' ');
    let subLine = '';
    for (let n = 0; n < subWords.length; n++) {
      const testLine = subLine + subWords[n] + ' ';
      if (ctx.measureText(testLine).width > maxWidth && n > 0) {
        ctx.fillText(subLine, 80, y);
        subLine = subWords[n] + ' ';
        y += 48;
      } else {
        subLine = testLine;
      }
    }
    ctx.fillText(subLine, 80, y);

    // Feature Card Overlay Box
    y += 80;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(80, y, 840, 360, 24);
    ctx.fill();
    ctx.stroke();

    // Feature Card Content
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('CRMSOLO 2026 INSIGHTS', 120, y + 60);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('• 100% Free Unbiased Solo Realtor Reviews', 120, y + 130);
    ctx.fillText('• Speed-to-Lead Automation Checklists', 120, y + 200);
    ctx.fillText('• Interactive Commission ROI Calculator', 120, y + 270);

    // Call to Action Box (Bottom)
    ctx.fillStyle = '#2563eb'; // Vivid Blue
    ctx.beginPath();
    ctx.roundRect(80, 1260, 840, 110, 24);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 38px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CLICK HERE TO READ FULL GUIDE & USE TOOL', 500, 1330);

    // Footer Domain
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('crmsolo.com • The Solo Agent Tech Authority', 500, 1420);

    // Download PNG
    const link = document.createElement('a');
    link.download = `pinterest-pin-${pin.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div id="pinterest-traffic-kit" className="my-10 bg-slate-900 text-white p-6 sm:p-8 md:p-10 rounded-3xl shadow-xl border border-slate-800 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-800 pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Pinterest &amp; Google SEO Traffic Engine
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            Downloadable Pinterest Viral Pin &amp; SEO Kit
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            Copy and paste these pre-formatted 2026 Pinterest Pin headlines, descriptions, and long-tail SEO hashtags to generate instant clicks, impressions, and referral traffic to CRMSolo.
          </p>
        </div>

        {/* Download Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => handleDownloadFile('txt')}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition cursor-pointer"
          >
            <Download className="w-4 h-4" /> Download .TXT Kit
          </button>
          <button
            onClick={() => handleDownloadFile('md')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 border border-slate-700 transition cursor-pointer"
          >
            <Download className="w-4 h-4" /> Download .MD Kit
          </button>
        </div>
      </div>

      {/* Theme Selector for Pinterest Image Generator */}
      <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <Image className="w-4 h-4 text-amber-400" />
          <span>Pin Graphic Generator Theme:</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedTheme('navy')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${selectedTheme === 'navy' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            Midnight Navy
          </button>
          <button
            onClick={() => setSelectedTheme('emerald')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${selectedTheme === 'emerald' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            Emerald Agent
          </button>
          <button
            onClick={() => setSelectedTheme('amber')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${selectedTheme === 'amber' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            Gold Luxury
          </button>
          <button
            onClick={() => setSelectedTheme('dark')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${selectedTheme === 'dark' ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            Deep Black
          </button>
        </div>
      </div>

      {/* Pin Templates List */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-amber-400" /> 5 Pre-Formatted High-Converting Pin Posts
        </h3>

        <div className="grid grid-cols-1 gap-6">
          {pinTemplates.map((pin) => (
            <div key={pin.id} className="bg-slate-950 p-5 sm:p-6 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition space-y-4">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-md font-extrabold uppercase tracking-wide">
                  {pin.badge}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => generateAndDownloadImage(pin)}
                    className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    title="Generate high-resolution 1000x1500 Pinterest graphic"
                  >
                    <Image className="w-3.5 h-3.5" /> Download Pin Image (.PNG)
                  </button>
                  <button
                    onClick={() => handleCopy(`${pin.title}\n\n${pin.description}\n\nURL: ${pin.destinationUrl}`, pin.id)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copiedIndex === pin.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedIndex === pin.id ? 'Copied All!' : 'Copy Pin Draft'}
                  </button>
                </div>
              </div>

              {/* Pin Title */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Pin Title (Copy &amp; Paste)</label>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex justify-between items-center gap-3">
                  <span className="font-bold text-sm text-white">{pin.title}</span>
                  <button
                    onClick={() => handleCopy(pin.title, `${pin.id}-title`)}
                    className="shrink-0 p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition"
                    title="Copy Title"
                  >
                    {copiedIndex === `${pin.id}-title` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Target Destination URL */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Destination URL</label>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex justify-between items-center gap-3">
                  <span className="text-xs font-mono text-amber-300 truncate">{pin.destinationUrl}</span>
                  <button
                    onClick={() => handleCopy(pin.destinationUrl, `${pin.id}-url`)}
                    className="shrink-0 p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition"
                    title="Copy Target Link"
                  >
                    {copiedIndex === `${pin.id}-url` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Pin Description + SEO Hashtags</label>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex justify-between items-start gap-3">
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{pin.description}</p>
                  <button
                    onClick={() => handleCopy(pin.description, `${pin.id}-desc`)}
                    className="shrink-0 p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition mt-0.5"
                    title="Copy Description"
                  >
                    {copiedIndex === `${pin.id}-desc` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* 25-30 SEO Keywords Block */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Hash className="w-4 h-4 text-amber-400" /> 25-30 Google &amp; Pinterest SEO Keyword Tags
          </div>
          <button
            onClick={() => handleCopy(keywords2530.join(', '), 'keywords-block')}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            {copiedIndex === 'keywords-block' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedIndex === 'keywords-block' ? 'Copied Keywords!' : 'Copy All 25-30 Keywords'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {keywords2530.map((kw, idx) => (
            <span key={idx} className="bg-slate-900 text-slate-300 border border-slate-800 text-[11px] px-2.5 py-1 rounded-md font-mono">
              {kw}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}
