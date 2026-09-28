import NavLink from '../components/NavLink';
import React, { useState } from 'react';
import { Mail, Shield, ShieldCheck, Heart, User, Sparkles, Send, Check } from 'lucide-react';
import { useSEO } from '../lib/seo';

interface StaticPagesProps {
  pageType: 'about' | 'methodology' | 'contact' | 'privacy' | 'affiliate' | 'terms';
  onUpdateCMS: () => void;
  onNavigate: (path: string) => void;
}

export default function StaticPages({ pageType, onUpdateCMS, onNavigate }: StaticPagesProps) {
  // Derived from the route, not component state: each tab is its own indexable
  // URL, so its content has to be present in the prerendered HTML.
  const activeTab = pageType === 'methodology' ? 'methodology' : 'about';

  let seoTitle = 'About Us';
  let seoDescription = 'Learn more about our review methodology and team.';
  let seoKeywords = ['about crmsolo', 'crm reviewers', 'realtor tool reviews'];

  if (pageType === 'contact') {
    seoTitle = 'Contact Us';
    seoDescription = 'Get in touch with our team of CRM reviewers and brokers.';
    seoKeywords = ['contact crmsolo', 'realtor crm questions', 'advertise'];
  } else if (pageType === 'privacy') {
    seoTitle = 'Privacy Policy';
    seoDescription = 'Our clear, transparent commitments to protecting your personal data and privacy.';
    seoKeywords = ['privacy policy', 'data protection', 'GDPR compliance'];
  } else if (pageType === 'methodology') {
    seoTitle = 'Review Methodology & Editorial Standards';
    seoDescription = 'How CRMsolo evaluates real estate CRM software: the scoring criteria, the weighting, and what our ratings do and do not claim to be.';
    seoKeywords = ['crm review methodology', 'editorial standards', 'how we rate crm software'];
  } else if (pageType === 'terms') {
    seoTitle = 'Terms of Service';
    seoDescription = 'The terms governing your use of crmsolo.online, including our content, affiliate links, and limitations of liability.';
    seoKeywords = ['terms of service', 'website terms', 'affiliate links'];
  } else if (pageType === 'affiliate') {
    seoTitle = 'Affiliate & Advertising Disclosure';
    seoDescription = 'How we finance our reviews. Read our transparency and advertising standards.';
    seoKeywords = ['affiliate disclosure', 'honest advertising', 'referral links'];
  }

  useSEO({
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
    ogType: 'website'
  }, [pageType]);
  
  // Contact Form states
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('General Query');
  const [contactMessage, setContactMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactName && contactEmail && contactMessage) {
      setFormSubmitted(true);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }
  };

  if (pageType === 'about' || pageType === 'methodology') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        
        {/* Tab Buttons: separate indexable routes, so rendered as real links */}
        <div className="flex border-b border-gray-200">
          <NavLink
            to="/about"
            onNavigate={onNavigate}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition ${
              activeTab === 'about' ? 'border-accent text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            👤 About CRMsolo
          </NavLink>
          <NavLink
            to="/methodology"
            onNavigate={onNavigate}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition ${
              activeTab === 'methodology' ? 'border-accent text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            ⚖️ Scoring Methodology
          </NavLink>
        </div>

        {/* Tab 1: About */}
        {activeTab === 'about' && (
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold text-primary font-display">
                About CRMsolo &amp; Our Mission
              </h1>
              <p className="text-gray-400 text-xs font-mono">
                FOUNDED BY AN INDEPENDENT RESIDENTIAL BROKER FOR THE INDUSTRY
              </p>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">
              Real estate is a high-volume, personal relationship business. But when newly licensed or established solo agents look for software to manage their leads, they are met with bloated, confusing enterprise tools built for 50-person brokerages. These systems require full-time administrators to configure and cost hundreds of dollars a month.
            </p>

            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col md:flex-row gap-5 items-center">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-accent text-2xl font-black shrink-0 border border-accent/30 font-display">
                EB
              </div>
              <div className="space-y-1 text-center md:text-left">
                <h4 className="font-bold text-primary font-display text-base">Eugene Boniface, Founder &amp; Chief Analyst</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Eugene Boniface is an independent real estate technology practitioner and founder of CRMsolo. Based in Ferrol, Spain, Eugene reviews sales management tools, CRM automation platforms, and lead pipeline software to help solo brokers streamline daily workflows without corporate clutter.
                </p>
                <div className="pt-2 text-[11px] text-gray-500 font-mono flex flex-wrap justify-center md:justify-start gap-4">
                  <span>📍 Avenida de Esteiro 161, Ferrol, Spain</span>
                  <span>✉️ <a href="mailto:Eugeneboniface4@yahoo.com" className="text-accent hover:underline font-bold">Eugeneboniface4@yahoo.com</a></span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-display font-bold text-lg text-primary">Why independent agents trust CRMsolo:</h3>
              <ul className="space-y-2.5 text-xs text-gray-600">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span><strong>We research tools directly:</strong> We work from vendor documentation, published pricing, and hands-on use where we have it, rather than from second-hand summaries.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span><strong>Zero-Fluff scoring:</strong> We score based on mobile response lag, speed of custom property fields, and cost per feature.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span><strong>No gated calculators:</strong> Our ROI estimator works completely without requiring an email unlock.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Methodology */}
        {activeTab === 'methodology' && (
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
            <h1 className="text-3xl font-extrabold text-primary font-display">
              Scoring Methodology &amp; E-E-A-T Criteria
            </h1>
            
            <p className="text-gray-600 text-sm leading-relaxed">
              CRMsolo ratings are an editorial assessment, not a controlled or independently audited benchmark. We determine each 0-10 score by weighing four criteria for how well a tool fits a solo real estate agent:
            </p>

            <div className="divide-y divide-gray-100">
              <div className="py-4 space-y-1">
                <h3 className="font-display font-bold text-primary text-sm">1. Mobile Utility (30% Weight)</h3>
                <p className="text-xs text-gray-500">
                  Solo agents close deals on the move. We look at mobile app latency, offline note synchronization, and how many taps it takes to log a buyer call outcome.
                </p>
              </div>

              <div className="py-4 space-y-1">
                <h3 className="font-display font-bold text-primary text-sm">2. Real Estate Customization Fit (25% Weight)</h3>
                <p className="text-xs text-gray-500">
                  CRMs are built for corporate SaaS teams by default. We assess how easily you can add residential property variables (appraisal contingencies, MLS numbers, listing addresses) without paying for enterprise developer upgrades.
                </p>
              </div>

              <div className="py-4 space-y-1">
                <h3 className="font-display font-bold text-primary text-sm">3. Value for Money / Tier Transparency (25% Weight)</h3>
                <p className="text-xs text-gray-500">
                  We look at the exact cost of the email sync and automatic follow-up templates tiers. We highlight and warn agents against "pricing traps" where adding basic contact features triggers severe, unexpected price jumps.
                </p>
              </div>

              <div className="py-4 space-y-1">
                <h3 className="font-display font-bold text-primary text-sm">4. Ease of Daily Habit Formation (20% Weight)</h3>
                <p className="text-xs text-gray-500">
                  The best CRM is the one you actually use. We assess visual clutter, cognitive load, and whether updating deal boards feels intuitive or like tedious data-entry chores.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  if (pageType === 'contact') {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
          <div className="space-y-3 text-center">
            <h1 className="text-3xl font-extrabold text-primary font-display">Contact CRMsolo &amp; Founder</h1>
            <p className="text-gray-500 text-sm">Have a question about a review or a custom CRM suggestion? Get in touch with Eugene Boniface directly.</p>
            
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs text-gray-600 flex flex-col md:flex-row justify-around gap-2 font-mono">
              <div>📍 <strong>Address:</strong> Avenida de Esteiro 161 Ferrol, Spain</div>
              <div>✉️ <strong>Direct Email:</strong> <a href="mailto:Eugeneboniface4@yahoo.com" className="text-accent font-bold hover:underline">Eugeneboniface4@yahoo.com</a></div>
            </div>
          </div>

          {formSubmitted ? (
            <div className="p-6 bg-success/15 border border-success/30 rounded-2xl text-center space-y-3 animate-in zoom-in duration-150">
              <span className="text-4xl">📬</span>
              <h3 className="text-lg font-bold text-primary font-display">Message Sent Successfully!</h3>
              <p className="text-xs text-gray-600 max-w-sm mx-auto">
                Thank you for reaching out. Eugene reads every email and will get back to your broker address within 24 hours.
              </p>
              <button 
                onClick={() => setFormSubmitted(false)}
                className="px-4 py-2 bg-primary text-white font-bold text-xs rounded-xl"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 block">Your Name</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm bg-gray-50 focus:bg-white"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 block">Broker Email</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm bg-gray-50 focus:bg-white"
                    placeholder="john@realtor.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 block">Topic Subject</label>
                <select
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  className="w-full px-3 py-2.5 border rounded-xl text-sm bg-gray-50 focus:bg-white"
                >
                  <option value="General Query">General Query</option>
                  <option value="CRM Correction / Feedback">CRM Correction / Feedback</option>
                  <option value="Affiliate Partnership">Affiliate Partnership</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 block">Message Body</label>
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm bg-gray-50 focus:bg-white h-32"
                  placeholder="Tell us what is on your mind..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-accent hover:bg-accent/90 text-primary font-bold text-sm rounded-xl flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Send Broker Message &rarr;
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  if (pageType === 'privacy') {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6 text-sm text-gray-600 leading-relaxed">
          <h1 className="text-3xl font-extrabold text-primary font-display">Privacy Policy</h1>
          <p className="text-xs text-gray-400 font-mono">LAST UPDATED: JULY 2026</p>
          
          <p>
            Welcome to CRMsolo (crmsolo.online). Your privacy is of paramount importance to us. This Privacy Policy documents how we handle user-input variables inside our interactive tools, such as the CRM ROI Calculator, as well as general browser cookie logging.
          </p>

          <h3 className="font-display font-bold text-primary text-base mt-4">1. Calculator Inputs Anonymity</h3>
          <p>
            When you enter your average leads, commissions, wages, and tool spends in the CRM ROI Calculator, this data is computed completely on your client-side browser device. CRMsolo does not collect, log, or transmit these metrics to our server logs unless you explicitly request a shared URL.
          </p>

          <h3 className="font-display font-bold text-primary text-base mt-4">2. Cookies and Tracking</h3>
          <p>
            We integrate standard analytics scripts (such as Google Analytics 4) to monitor general site activity, calculator starts, and affiliate referral link click tracking. These analytics services do not collect personally identifiable broker details.
          </p>

          <h3 className="font-display font-bold text-primary text-base mt-4">3. Third-Party Referral Disclosures</h3>
          <p>
            Clicking on any CRM signup button routes you to our affiliate partner sites (Pipedrive, HubSpot, Zoho). These portals utilize standard partner tracking cookies to trace referral credits. Please review their independent privacy policy procedures.
          </p>
        </div>
      </div>
    );
  }

  if (pageType === 'affiliate') {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6 text-sm text-gray-600 leading-relaxed">
          <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
            <span className="text-2xl">🤝</span>
            <h1 className="text-3xl font-extrabold text-primary font-display">Affiliate Disclosure Statement</h1>
          </div>
          
          <p>
            In compliance with the Federal Trade Commission (FTC) guidelines, CRMsolo (crmsolo.online) maintains full disclosure and transparency regarding our monetization partners.
          </p>

          <h3 className="font-display font-bold text-primary text-base mt-4">Our Affiliate Partnerships</h3>
          <p>
            CRMsolo operates as an independent editorial review platform. To fund our research, server operations, and free diagnostic tools, we participate in several software referral programs:
          </p>

          <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-500">
            <li><strong>Pipedrive Partner Network:</strong> We receive compensation when you start a trial and subscribe.</li>
            <li><strong>HubSpot Affiliate Program:</strong> We receive commission splits when users transition to paid tiers.</li>
            <li><strong>Zoho Partner Alliance:</strong> We receive credits when brokers establish custom workspace databases.</li>
          </ul>

          <h3 className="font-display font-bold text-primary text-base mt-4">Why This Does Not Affect Rankings</h3>
          <p>
            Partnership status does not determine our scores. Overall ratings and scorecard breakdowns reflect the editorial judgement described on our methodology page, and the CRM ROI Calculator applies the same formulas and pricing tiers to every system regardless of who pays referral splits. We always warn readers of the "HubSpot professional trap" and openly document Zoho's setup complexity.
          </p>

          <div className="p-4 bg-accent/5 border border-accent/20 rounded-xl flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-accent shrink-0" />
            <span className="text-xs text-primary font-semibold">
              Thank you for supporting our research by choosing to click our tracking links!
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (pageType === 'terms') {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-5 text-xs text-gray-600 leading-relaxed">
          <h1 className="text-3xl font-extrabold text-primary font-display">Terms of Service</h1>
          <p className="text-gray-400 text-[11px] font-mono">LAST UPDATED: SEPTEMBER 2026</p>

          <p>
            These terms govern your use of crmsolo.online (the "site"). By using the site you accept them. If you do not accept them, please do not use the site.
          </p>

          <h3 className="font-display font-bold text-primary text-base mt-4">Content and accuracy</h3>
          <p>
            The site publishes editorial assessments of real estate software. Our ratings and comparisons reflect our own judgement against the criteria described on our{' '}
            <NavLink to="/methodology" onNavigate={onNavigate} className="text-accent font-bold hover:underline">methodology page</NavLink>. They are opinions, not statements of fact, and they are not a controlled or independently audited benchmark.
          </p>
          <p>
            Software pricing, features and terms change frequently and are set by the vendors, not by us. Information here may become out of date, and we do not warrant that it is accurate, complete or current. Always confirm pricing and feature availability with the vendor before purchasing.
          </p>

          <h3 className="font-display font-bold text-primary text-base mt-4">Affiliate links</h3>
          <p>
            Some outbound links are affiliate links, and we may earn a commission if you sign up through them. This does not change what you pay. See our{' '}
            <NavLink to="/affiliate-disclosure" onNavigate={onNavigate} className="text-accent font-bold hover:underline">affiliate disclosure</NavLink>{' '}
            for detail on how the site is funded.
          </p>

          <h3 className="font-display font-bold text-primary text-base mt-4">Third-party names</h3>
          <p>
            Product and company names mentioned on the site are trademarks of their respective owners. Their use here is for identification and editorial comment only, and does not imply any affiliation with or endorsement by those owners.
          </p>

          <h3 className="font-display font-bold text-primary text-base mt-4">Acceptable use</h3>
          <p>
            You may read, cite and link to the site. You may not scrape it at scale, republish substantial portions as your own, attempt to disrupt it, or use it in a way that breaks applicable law.
          </p>

          <h3 className="font-display font-bold text-primary text-base mt-4">Limitation of liability</h3>
          <p>
            The site is provided "as is" and without warranties of any kind. To the extent permitted by law, we are not liable for any loss arising from your use of the site or from decisions you make based on it, including software purchasing decisions. Nothing here limits liability that cannot lawfully be limited.
          </p>

          <h3 className="font-display font-bold text-primary text-base mt-4">Changes</h3>
          <p>
            We may update these terms. The current version is always the one published on this page.
          </p>

          <h3 className="font-display font-bold text-primary text-base mt-4">Contact</h3>
          <p>
            Questions about these terms: <a href="mailto:Eugeneboniface4@yahoo.com" className="text-accent font-bold hover:underline">Eugeneboniface4@yahoo.com</a>, or see our{' '}
            <NavLink to="/contact" onNavigate={onNavigate} className="text-accent font-bold hover:underline">contact page</NavLink>.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
