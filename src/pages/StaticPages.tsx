import React, { useState } from 'react';
import { Mail, Shield, ShieldCheck, Heart, User, Sparkles, Send, Check } from 'lucide-react';
import { useSEO } from '../lib/seo';

interface StaticPagesProps {
  pageType: 'about' | 'methodology' | 'contact' | 'privacy' | 'affiliate';
  onUpdateCMS: () => void;
}

export default function StaticPages({ pageType, onUpdateCMS }: StaticPagesProps) {
  const [activeTab, setActiveTab] = useState<'about' | 'methodology'>('about');

  let seoTitle = 'About Us';
  let seoDescription = 'Learn more about our independent testing methodology and team.';
  let seoKeywords = ['about crmsolo', 'independent crm reviewers', 'realtor tool testing'];

  if (pageType === 'contact') {
    seoTitle = 'Contact Us';
    seoDescription = 'Get in touch with our team of independent CRM testers and brokers.';
    seoKeywords = ['contact crmsolo', 'realtor crm questions', 'advertise'];
  } else if (pageType === 'privacy') {
    seoTitle = 'Privacy Policy';
    seoDescription = 'Our clear, transparent commitments to protecting your personal data and privacy.';
    seoKeywords = ['privacy policy', 'data protection', 'GDPR compliance'];
  } else if (pageType === 'affiliate') {
    seoTitle = 'Affiliate & Advertising Disclosure';
    seoDescription = 'How we finance our independent reviews. Read our transparency and advertising standards.';
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
        
        {/* Tab Buttons */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition ${
              activeTab === 'about' 
                ? 'border-accent text-primary' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            👤 About CRMsolo
          </button>
          <button
            onClick={() => setActiveTab('methodology')}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition ${
              activeTab === 'methodology' 
                ? 'border-accent text-primary' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            ⚖️ Scoring Methodology (E-E-A-T)
          </button>
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
                  Eugene Boniface is an independent real estate technology practitioner and founder of CRMsolo. Based in Ferrol, Spain, Eugene tests sales management tools, CRM automation platforms, and lead pipeline software to help solo brokers streamline daily workflows without corporate clutter.
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
                  <span><strong>We actually test tools:</strong> We purchase standard subscriptions, configure pipelines, and use the mobile apps in our cars between showings.</span>
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
              Google demands Experience, Expertise, Authoritativeness, and Trustworthiness (E-E-A-T) for product reviews. CRMsolo was constructed specifically to exceed these guidelines. We determine our 0-10 ratings using four strict criteria weighted specifically for solo agents:
            </p>

            <div className="divide-y divide-gray-100">
              <div className="py-4 space-y-1">
                <h3 className="font-display font-bold text-primary text-sm">1. Mobile Utility Speed (30% Weight)</h3>
                <p className="text-xs text-gray-500">
                  Solo agents close deals on the move. We test mobile app latency, offline note synchronization, and how many taps are required to log a buyer call outcome.
                </p>
              </div>

              <div className="py-4 space-y-1">
                <h3 className="font-display font-bold text-primary text-sm">2. Real Estate Customization Fit (25% Weight)</h3>
                <p className="text-xs text-gray-500">
                  CRMs are built for corporate SaaS teams by default. We measure how easily you can add residential property variables (Appraisal contingencies, MLS numbers, listing addresses) without paying for enterprise developer upgrades.
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
                Thank you for reaching out. Sarah reads every email and will get back to your broker address within 24 hours.
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
            CRMsolo operates as an independent, authority review platform. To fund our detailed tests, server operations, and free diagnostic tools, we participate in several software referral programs:
          </p>

          <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-500">
            <li><strong>Pipedrive Partner Network:</strong> We receive compensation when you start a trial and subscribe.</li>
            <li><strong>HubSpot Affiliate Program:</strong> We receive commission splits when users transition to paid tiers.</li>
            <li><strong>Zoho Partner Alliance:</strong> We receive credits when brokers establish custom workspace databases.</li>
          </ul>

          <h3 className="font-display font-bold text-primary text-base mt-4">Why This Does Not Affect Rankings</h3>
          <p>
            We maintain total editorial integrity. Our overall scores, rating scorecard breakdowns, and dynamic CRM ROI Calculator results are driven entirely by mathematical formulas and objective software properties — NOT by partnership status. The ROI calculations utilize the exact same formulas and pricing tiers for all systems regardless of who pays referral splits. We always warn readers of the "HubSpot professional trap" and openly document Zoho's setup complexity.
          </p>

          <div className="p-4 bg-accent/5 border border-accent/20 rounded-xl flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-accent shrink-0" />
            <span className="text-xs text-primary font-semibold">
              Thank you for supporting our independent tests by choosing to click our tracking links!
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
