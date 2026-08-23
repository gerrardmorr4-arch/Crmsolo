import React, { useState } from 'react';
import { Mail, CheckCircle, Sparkles } from 'lucide-react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError('Please provide your email address.');
      return;
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please provide a valid email address.');
      return;
    }

    try {
      // Fetch current subscribers
      const subStr = localStorage.getItem('crmsolo_subscribers');
      let subscribers: Array<{ email: string; dateSubscribed: string; status: string }> = [];
      
      if (subStr) {
        subscribers = JSON.parse(subStr);
      } else {
        // Fallback default subscribers in case not initialized
        subscribers = [
          { email: 'gerrardmorr4@gmail.com', dateSubscribed: 'Jul 20, 2026', status: 'Active' },
          { email: 'jenkins.realestate@gmail.com', dateSubscribed: 'Jul 18, 2026', status: 'Active' },
          { email: 'vance.luxury@realty.com', dateSubscribed: 'Jul 15, 2026', status: 'Active' },
        ];
      }

      // Check if already subscribed
      if (subscribers.some(s => s.email.toLowerCase() === trimmedEmail)) {
        setIsSubmitted(true);
        setEmail('');
        return;
      }

      // Add new subscriber
      const newSub = {
        email: trimmedEmail,
        dateSubscribed: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        status: 'Active'
      };

      const updated = [newSub, ...subscribers];
      localStorage.setItem('crmsolo_subscribers', JSON.stringify(updated));
      setIsSubmitted(true);
      setEmail('');
    } catch (e) {
      setError('Could not process subscription. Please try again.');
    }
  };

  return (
    <div id="newsletter-signup-container" className="bg-primary text-white p-8 rounded-3xl border-2 border-accent relative overflow-hidden shadow-md">
      {/* Background Decorative Blur */}
      <div className="absolute right-0 bottom-0 -mr-12 -mb-12 w-48 h-48 bg-accent/10 rounded-full blur-2xl pointer-events-none"></div>
      
      <div className="relative z-10 max-w-xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-1.5 bg-accent/15 border border-accent/25 px-3 py-1 rounded-full text-accent text-[10px] font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> FREE PLAYBOOK DOWNLOAD
        </div>

        <div className="space-y-2">
          <h3 className="text-xl md:text-3xl font-black font-display uppercase tracking-tight">
            Get the Solo Agent Pipeline Blueprint
          </h3>
          <p className="text-gray-300 text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
            Join other independent, high-producing solo realtors. Get low-frequency strategies, pricing traps to avoid, and custom workbook sheets directly in your inbox.
          </p>
        </div>

        {isSubmitted ? (
          <div className="py-4 space-y-2 animate-in fade-in duration-200">
            <div className="inline-flex items-center justify-center p-3 bg-accent/20 border border-accent/30 rounded-full">
              <CheckCircle className="w-6 h-6 text-accent" />
            </div>
            <h4 className="text-sm font-black uppercase tracking-wider text-accent">Subscription Successful!</h4>
            <p className="text-xs text-gray-400">
              Check your inbox. We just dispatched the 2026 CRM comparison workbook and PDF worksheet bundle.
            </p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="text-[10px] text-gray-500 hover:text-white underline block mx-auto pt-2 cursor-pointer"
            >
              Subscribe another email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <div className="relative flex-grow">
                <span className="absolute left-3.5 top-3.5 text-gray-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  placeholder="Enter your realtor email address..."
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 hover:bg-white/15 focus:bg-white focus:text-primary border border-white/20 focus:border-accent rounded-xl focus:outline-none text-xs font-semibold placeholder-gray-400 text-white transition"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-accent hover:bg-accent/90 text-primary font-black uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition duration-150 active:scale-95 shrink-0"
              >
                Get Blueprint
              </button>
            </div>
            {error && (
              <p className="text-red-400 text-[10px] font-mono font-semibold animate-shake">
                ⚠️ {error}
              </p>
            )}
          </form>
        )}

        <div className="text-[9px] text-gray-500 font-medium">
          Zero ads. Permanent unsubscribe with 1 click. We protect agent data integrity.
        </div>
      </div>
    </div>
  );
}
