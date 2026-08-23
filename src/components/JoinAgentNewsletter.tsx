import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Check, Sparkles, ShieldCheck, Award, Users, ArrowRight, Gift, AlertCircle, CheckCircle } from 'lucide-react';
import { addSubscriber, getSubscribers } from '../lib/storage';

interface JoinAgentNewsletterProps {
  className?: string;
  source?: string;
}

export default function JoinAgentNewsletter({ className = '', source = 'Footer Newsletter' }: JoinAgentNewsletterProps) {
  const [email, setEmail] = useState('');
  const [agentName, setAgentName] = useState('');
  const [agentType, setAgentType] = useState('Solo Agent');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'already_subscribed' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle newsletter subscription
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim().toLowerCase();
    
    // Basic email validation
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('submitting');

    try {
      // 1. Sync with storage helper
      addSubscriber(cleanEmail, agentName.trim() || undefined, source);

      // 2. Also ensure legacy crmsolo_subscribers format in localStorage is updated for AdminPortal tab
      const existingStr = localStorage.getItem('crmsolo_subscribers');
      const existing = existingStr ? JSON.parse(existingStr) : [];
      
      const isAlreadyInLegacy = existing.some((sub: any) => 
        (typeof sub === 'string' ? sub.toLowerCase() : sub.email?.toLowerCase()) === cleanEmail
      );

      if (!isAlreadyInLegacy) {
        existing.unshift({
          email: cleanEmail,
          name: agentName.trim() || undefined,
          agentType,
          dateSubscribed: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          status: 'Active'
        });
        localStorage.setItem('crmsolo_subscribers', JSON.stringify(existing));
      }

      setStatus('success');
      setEmail('');
      setAgentName('');

    } catch (err) {
      console.error('Error adding subscriber:', err);
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <section className={`bg-slate-950 text-white border-t-4 border-accent py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${className}`}>
      
      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10 space-y-8">
        
        {/* Top Header Badge */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-accent/15 border border-accent/30 text-accent text-[11px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            Solo Agent VIP Digest
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-display uppercase tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Join 1,420+ Real Estate Agents Getting Monthly CRM Benchmarks &amp; Deals
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Zero marketing fluff or lead spam. Receive exclusive CRM discount codes, software update alerts, and real estate workflow breakdowns delivered straight to your inbox.
          </p>
        </div>

        {/* Feature Value Props Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xs flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-xs bg-accent/20 text-accent flex items-center justify-center shrink-0">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Exclusive Discounts</h4>
              <p className="text-[11px] text-slate-400">Save up to 30% on top CRMs</p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xs flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-xs bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Solo Workflows</h4>
              <p className="text-[11px] text-slate-400">Real stage templates for solo brokers</p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xs flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-xs bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Zero Spam Guarantee</h4>
              <p className="text-[11px] text-slate-400">1-click unsubscribe anytime</p>
            </div>
          </div>
        </div>

        {/* Signup Form Box */}
        <div className="max-w-xl mx-auto bg-slate-900/90 border border-slate-800 p-6 sm:p-8 rounded-xs shadow-2xl relative">
          
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-6 space-y-4"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white font-display uppercase tracking-wide">
                    Welcome to the Solo Realtor VIP Digest!
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                    Your email has been added to our subscriber database. Keep an eye on your inbox for our latest CRM benchmark breakdown.
                  </p>
                </div>
                <button
                  onClick={() => setStatus('idle')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold rounded-xs transition cursor-pointer"
                >
                  Subscribe another email
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {status === 'error' && errorMessage && (
                  <div className="p-3 bg-red-500/20 border border-red-500/30 text-red-300 text-xs rounded-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Your Name <span className="text-slate-500 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={agentName}
                      onChange={(e) => setAgentName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xs text-white placeholder-slate-500 text-xs focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Agent Role
                    </label>
                    <select
                      value={agentType}
                      onChange={(e) => setAgentType(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xs text-white text-xs focus:outline-none focus:border-accent"
                    >
                      <option value="Solo Agent">Solo Agent</option>
                      <option value="Independent Broker">Independent Broker</option>
                      <option value="Small Team Lead">Small Team Lead</option>
                      <option value="New Realtor">New Realtor (&lt;1 Year)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Realtor Email Address <span className="text-accent">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="realtor@yourbrokerage.com"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xs text-white placeholder-slate-500 text-xs focus:outline-none focus:border-accent font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-3.5 bg-accent hover:bg-accent/90 text-slate-950 font-black uppercase tracking-widest text-xs rounded-xs transition duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98 disabled:opacity-50"
                >
                  {status === 'submitting' ? (
                    <span>Subscribing...</span>
                  ) : (
                    <>
                      <span>Join Agent Newsletter</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-mono pt-1">
                  <Users className="w-3 h-3 text-slate-400" />
                  <span>Captured directly in Admin Portal Subscriber database</span>
                </div>

              </form>
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}
