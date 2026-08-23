import { useState, useEffect } from 'react';
import { CRMGuide } from '../types';
import Markdown from '../components/Markdown';
import { BookOpen, User, Calendar, List, ChevronRight, HelpCircle, ArrowLeft, Filter, Download, DollarSign, Printer, Check } from 'lucide-react';
import NewsletterSignup from '../components/NewsletterSignup';
import { useSEO } from '../lib/seo';
import AdSenseAd from '../components/AdSenseAd';
import { useCRMFilterPreferences } from '../lib/useCRMFilterPreferences';
import TableOfContents, { TocItem } from '../components/TableOfContents';

interface GuideDetailProps {
  guideSlug: string | null;
  guides: CRMGuide[];
  onNavigate: (path: string) => void;
}

export default function GuideDetail({ guideSlug, guides, onNavigate }: GuideDetailProps) {
  const { preferences, setPreferences } = useCRMFilterPreferences();

  const [selectedStage, setSelectedStage] = useState<string>(preferences.selectedPlatform !== 'All' ? preferences.selectedPlatform : 'all');
  const [selectedCategory, setSelectedCategory] = useState<string>(preferences.selectedCategory !== 'All' ? preferences.selectedCategory : 'all');

  useEffect(() => {
    setPreferences({
      selectedPlatform: selectedStage !== 'all' ? selectedStage : 'All',
      selectedCategory: selectedCategory !== 'all' ? selectedCategory : 'All'
    });
  }, [selectedStage, selectedCategory, setPreferences]);

  const isListView = !guideSlug;
  const currentGuide = guides.find(g => g.slug === guideSlug);

  const seoTitle = isListView 
    ? 'Solo Realtor CRM Playbooks & Setup Guides' 
    : currentGuide 
      ? currentGuide.title 
      : 'CRM Playbooks';

  const seoDescription = isListView 
    ? 'Hands-on guidebooks and system configuration blueprints for solo brokers and new real estate agents. Step-by-step setup walkthroughs.' 
    : currentGuide 
      ? currentGuide.excerpt 
      : 'Step-by-step real estate CRM playbook.';

  const seoKeywords = isListView
    ? ['real estate guides', 'crm setup playbooks', 'realtor workflow blueprint']
    : currentGuide
      ? [currentGuide.category.toLowerCase(), `${currentGuide.slug.replace(/-/g, ' ')}`, 'crm playbook', 'real estate crm guide']
      : ['real estate guides'];

  useSEO({
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
    ogType: 'article',
    category: 'Product Guides'
  }, [guideSlug, currentGuide]);

  // If viewing list of all guides (State 1)

  if (isListView) {
    // Unique categories for filtering
    const categories = ['all', ...Array.from(new Set(guides.map(g => g.category)))];
    const stages = [
      { id: 'all', label: 'All Agent Stages' },
      { id: 'new-agent', label: 'New Agent (Year 1)' },
      { id: 'established-solo', label: 'Established Solo Broker' },
    ];

    // Filter logic
    const filteredGuides = guides.filter(guide => {
      const matchStage = selectedStage === 'all' || guide.agentStage === selectedStage || guide.agentStage === 'all';
      const matchCategory = selectedCategory === 'all' || guide.category === selectedCategory;
      return matchStage && matchCategory;
    });

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        
        {/* Guides List Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold text-primary font-display tracking-tight">
            Solo Realtor Guides &amp; Playbooks
          </h1>
          <p className="text-gray-500 text-sm">
            Practical strategies, system setup blueprints, and worksheets written for busy solo brokers. No marketing fluff.
          </p>
        </div>

        {/* Filters Panel */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 text-primary text-sm font-bold">
            <Filter className="w-4 h-4 text-accent" />
            <span>Search Taxonomy Filters:</span>
          </div>
          
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {/* Stage filter dropdown */}
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {stages.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>

            {/* Category Filter dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="all">All Categories</option>
              {categories.filter(c => c !== 'all').map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGuides.map((guide) => (
            <div 
              key={guide.id}
              onClick={() => onNavigate(`/guides/${guide.slug}`)}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-accent hover:shadow-md cursor-pointer transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="bg-accent/15 text-primary font-bold px-2.5 py-0.5 rounded-full uppercase">
                    {guide.category}
                  </span>
                  <span className="text-gray-400 font-medium">
                    {guide.readTime}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-primary font-display leading-snug">
                  {guide.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                  {guide.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
                <span className="font-medium flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> By {guide.author.split(' (')[0]}
                </span>
                <span className="text-accent font-bold flex items-center gap-0.5">
                  Read Book &rarr;
                </span>
              </div>
            </div>
          ))}

          {filteredGuides.length === 0 && (
            <div className="col-span-2 text-center p-12 bg-white rounded-2xl border border-gray-100">
              <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No guides matching those filters were found.</p>
              <button 
                onClick={() => { setSelectedStage('all'); setSelectedCategory('all'); }}
                className="mt-4 px-3 py-1.5 bg-primary text-white text-xs rounded-xl font-bold"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

      </div>
    );
  }

  // Guide Detail view (State 2)
  if (!currentGuide) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <HelpCircle className="w-12 h-12 text-accent mx-auto" />
        <h2 className="text-2xl font-bold text-primary font-display">Guide Handbook Not Found</h2>
        <p className="text-gray-500 text-sm">The playbook page you requested does not exist or has been modified in the CMS.</p>
        <button onClick={() => onNavigate('/guides')} className="px-4 py-2 bg-primary text-white font-bold rounded-xl text-xs">
          Return to guides directory
        </button>
      </div>
    );
  }

  // Auto-generate Table of Contents items from H2 and H3 headers
  const generateToc = (content: string): TocItem[] => {
    const lines = content.split('\n');
    const items: TocItem[] = [];

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
        const level = trimmed.startsWith('## ') ? 1 : 2;
        const label = trimmed.replace(/^###?\s+/, '');
        const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        items.push({ id, label, level });
      }
    });
    return items;
  };

  const tocItems = generateToc(currentGuide.content);

  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to export the PDF guide.');
      return;
    }

    const title = currentGuide.title;
    const contentHtml = `
      <html>
        <head>
          <title>${title} - CRMsolo Guide PDF</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Space+Grotesk:wght@700&display=swap');
            body {
              font-family: 'Inter', sans-serif;
              color: #111111;
              line-height: 1.6;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              border-bottom: 3px solid #111111;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .brand {
              font-family: 'Space Grotesk', sans-serif;
              font-size: 14px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #E2B13C;
              background: #111111;
              display: inline-block;
              padding: 4px 8px;
            }
            h1 {
              font-family: 'Space Grotesk', sans-serif;
              font-size: 28px;
              margin-top: 15px;
              margin-bottom: 10px;
              line-height: 1.2;
            }
            .meta {
              font-size: 11px;
              color: #666666;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            h2, h3 {
              font-family: 'Space Grotesk', sans-serif;
              border-bottom: 1px solid #eeeeee;
              padding-bottom: 8px;
              margin-top: 30px;
            }
            p, li {
              font-size: 13px;
            }
            ul {
              padding-left: 20px;
            }
            .footer {
              margin-top: 50px;
              border-top: 1px solid #eeeeee;
              padding-top: 15px;
              font-size: 10px;
              color: #888888;
              text-align: center;
            }
            @media print {
              .no-print { display: none; }
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="brand">CRMsolo Playbook Blueprint</div>
            <h1>${title}</h1>
            <div class="meta">By ${currentGuide.author} | Updated: ${currentGuide.lastUpdated} | Category: ${currentGuide.category}</div>
          </div>
          <div class="content">
            ${currentGuide.content
              .replace(/### (.*)/g, '<h3>$1</h3>')
              .replace(/## (.*)/g, '<h2>$1</h2>')
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>')
              .replace(/\n\n/g, '<p></p>')
              .replace(/\n\* (.*)/g, '<ul><li>$1</li></ul>')
              .replace(/<\/ul>\s*<ul>/g, '')}
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} CRMsolo (crmsolo.online). Strictly for independent realtor training.
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(contentHtml);
    printWindow.document.close();
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([currentGuide.content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${currentGuide.slug}-worksheet-blueprint.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Return button */}
      <button 
        onClick={() => onNavigate('/guides')}
        className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-primary cursor-pointer transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Return to guides directory
      </button>

      {/* Guide Header Block */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs bg-accent/15 text-primary font-bold px-2.5 py-0.5 rounded-full uppercase">
            {currentGuide.category}
          </span>
          <span className="text-xs text-gray-400 font-medium font-mono">
            {currentGuide.readTime}
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-primary font-display leading-tight tracking-tight">
          {currentGuide.title}
        </h1>

        <div className="flex items-center gap-4 text-xs text-gray-400 pt-1 pb-4 border-b border-gray-100 font-medium">
          <span className="flex items-center gap-1">
            <User className="w-4 h-4" /> By {currentGuide.author}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" /> Updated: {currentGuide.lastUpdated}
          </span>
        </div>
      </div>

      {/* Downloads Panel & CRM Price Overview */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <h3 className="text-sm font-bold text-primary font-display uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Download className="w-4 h-4 text-accent" /> Playbook Downloads
          </h3>
          <p className="text-xs text-gray-500 mb-4 leading-normal">
            Download this training guide as a vector-formatted PDF worksheet or clean offline markdown blueprint.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-primary hover:bg-primary/95 text-accent font-black text-[10px] uppercase tracking-widest rounded-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition"
            >
              <Printer className="w-3.5 h-3.5" /> Save as PDF Worksheet
            </button>
            <button
              onClick={handleDownloadMarkdown}
              className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold text-[10px] uppercase tracking-widest rounded-xs flex items-center gap-1.5 cursor-pointer border border-gray-100 transition"
            >
              <Download className="w-3.5 h-3.5" /> Download .MD File
            </button>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
          <h4 className="text-xs font-bold text-primary font-display uppercase tracking-wider flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-accent" /> Active CRM Price Index (2026)
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs border-b border-gray-200/50 pb-1.5">
              <span className="font-semibold text-primary">Pipedrive Essential:</span>
              <span className="font-mono text-gray-600 font-bold">$14.00 / month</span>
            </div>
            <div className="flex justify-between items-center text-xs border-b border-gray-200/50 pb-1.5">
              <span className="font-semibold text-primary">Zoho CRM Standard:</span>
              <span className="font-mono text-gray-600 font-bold">$14.00 / month</span>
            </div>
            <div className="flex justify-between items-center text-xs border-b border-gray-200/50 pb-1.5">
              <span className="font-semibold text-primary">HubSpot Starter plan:</span>
              <span className="font-mono text-gray-600 font-bold">$15.00 / month</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-primary">Zoho CRM Professional:</span>
              <span className="font-mono text-gray-600 font-bold">$23.00 / month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Layout Grid (Left: Contents Sidebar, Right: Body text) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Table of Contents Sidebar (Col span 4) */}
        {tocItems.length > 0 && (
          <div className="lg:col-span-4">
            <TableOfContents items={tocItems} title="Playbook Index" />
          </div>
        )}

        {/* Content Body (Col span 8 or 12) */}
        <div className={tocItems.length > 0 ? 'lg:col-span-8 space-y-8' : 'lg:col-span-12 space-y-8'}>
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xs">
            <Markdown content={currentGuide.content} />
          </div>

          {/* In-content Google AdSense Spot */}
          <AdSenseAd slot="inContentAd" className="w-full" />
        </div>

      </div>

      {/* Newsletter Signup in Article Footer */}
      <div className="pt-6 border-t border-gray-100">
        <NewsletterSignup />
      </div>

    </article>
  );
}
