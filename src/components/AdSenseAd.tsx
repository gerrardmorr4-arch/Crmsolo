import React, { useEffect, useState, useRef } from 'react';
import { getAdSenseSettings } from '../lib/storage';
import { AdSenseSettings, AdSenseSlotSettings } from '../types';
import { ExternalLink, Sparkles } from 'lucide-react';

// Global error shield to intercept and prevent AdSense "No slot size for availableWidth=0" crashes
if (typeof window !== 'undefined') {
  try {
    // 1. Intercept uncaught window errors for adsbygoogle
    window.addEventListener(
      'error',
      (event) => {
        const msg = event?.message || event?.error?.message || '';
        if (
          msg.includes('adsbygoogle') ||
          msg.includes('availableWidth=0') ||
          msg.includes('No slot size')
        ) {
          console.warn('[AdSense Shield] Intercepted & suppressed AdSense layout error:', msg);
          event.preventDefault();
          event.stopImmediatePropagation();
          return true;
        }
      },
      true
    );

    // 2. Wrap window.adsbygoogle.push in a try...catch guard
    const wrapPush = (originalPush: Function) => {
      if ((originalPush as any).__shield_wrapped) return originalPush;
      
      const safePush = function (this: any, ...args: any[]) {
        try {
          return originalPush.apply(this, args);
        } catch (err: any) {
          const errMsg = err?.message || String(err);
          if (errMsg.includes('availableWidth=0') || errMsg.includes('No slot size')) {
            console.warn('[AdSense Shield] Safely caught availableWidth=0 push error:', err);
            return;
          }
          console.warn('[AdSense Shield] Safely caught AdSense push exception:', err);
        }
      };
      (safePush as any).__shield_wrapped = true;
      return safePush;
    };

    const globalWin = window as any;
    let currentAdsArray = globalWin.adsbygoogle || [];

    if (currentAdsArray && typeof currentAdsArray.push === 'function') {
      currentAdsArray.push = wrapPush(currentAdsArray.push);
    }

    Object.defineProperty(globalWin, 'adsbygoogle', {
      get() {
        return currentAdsArray;
      },
      set(val) {
        if (val && typeof val.push === 'function') {
          val.push = wrapPush(val.push);
        }
        currentAdsArray = val;
      },
      configurable: true,
      enumerable: true
    });
  } catch (e) {
    console.warn('[AdSense Shield] Unable to install global error shield:', e);
  }
}

interface AdSenseAdProps {
  slot: 'headerBanner' | 'sidebarAd' | 'inContentAd' | 'footerBanner';
  className?: string;
}

export default function AdSenseAd({ slot, className = '' }: AdSenseAdProps) {
  const [settings, setSettings] = useState<AdSenseSettings | null>(null);
  const [isElementVisible, setIsElementVisible] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const codeContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Read from storage
    try {
      const stored = getAdSenseSettings();
      setSettings(stored);
    } catch (e) {
      console.error('Failed to load AdSense settings', e);
    }

    // Optional: listen to custom events if admin updates live
    const handleSettingsUpdate = () => {
      try {
        const stored = getAdSenseSettings();
        setSettings(stored);
      } catch (e) {}
    };

    window.addEventListener('crmsolo_adsense_updated', handleSettingsUpdate);
    return () => {
      window.removeEventListener('crmsolo_adsense_updated', handleSettingsUpdate);
    };
  }, []);

  const slotSettings: AdSenseSlotSettings | undefined = settings?.[slot];

  // Track layout visibility & width
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !slotSettings?.enabled || !settings?.globalEnabled) {
      setIsElementVisible(false);
      return;
    }

    const checkVisibility = () => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      const isHidden = style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0';

      // Mark visible only if it actually has width > 0 and is not hidden by parents
      if (rect.width > 0 && !isHidden) {
        setIsElementVisible(true);
      } else {
        setIsElementVisible(false);
      }
    };

    // Run initial check
    checkVisibility();

    // Use ResizeObserver for responsive changes
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        checkVisibility();
      });
      resizeObserver.observe(el);
    }

    // Fallback: check on window resize
    window.addEventListener('resize', checkVisibility);

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', checkVisibility);
    };
  }, [slotSettings?.enabled, settings?.globalEnabled]);

  // Script injection runner for custom AdSense code
  useEffect(() => {
    if (isElementVisible && codeContainerRef.current && slotSettings?.code && slotSettings?.enabled) {
      const container = codeContainerRef.current;
      const rect = container.getBoundingClientRect();

      // Guard: do not inject if container width is zero
      if (rect.width === 0) {
        return;
      }

      container.innerHTML = slotSettings.code;
      const scripts = container.querySelectorAll('script');

      scripts.forEach((oldScript) => {
        const newScript = document.createElement('script');
        for (let i = 0; i < oldScript.attributes.length; i++) {
          const attr = oldScript.attributes[i];
          newScript.setAttribute(attr.name, attr.value);
        }

        let content = oldScript.textContent || '';
        if (content.includes('adsbygoogle') || content.includes('push')) {
          content = `try { ${content} } catch(err) { console.warn('[AdSense] Handled inline push error:', err); }`;
        }
        newScript.textContent = content;

        requestAnimationFrame(() => {
          if (oldScript.parentNode) {
            oldScript.parentNode.replaceChild(newScript, oldScript);
          }
        });
      });
    }
  }, [isElementVisible, slotSettings?.code, slotSettings?.enabled]);

  if (!settings || !settings.globalEnabled) {
    return null;
  }

  if (!slotSettings || !slotSettings.enabled) {
    return null;
  }

  // Helper to render dimensions based on slot type for beautiful design placeholders
  const getSlotDimensions = () => {
    switch (slot) {
      case 'headerBanner':
      case 'footerBanner':
        return 'w-full min-w-[280px] max-w-[728px] min-h-[90px]';
      case 'sidebarAd':
        return 'w-full min-w-[250px] max-w-[300px] min-h-[250px]';
      case 'inContentAd':
        return 'w-full min-w-[280px] min-h-[120px]';
    }
  };

  const getSlotLabel = () => {
    switch (slot) {
      case 'headerBanner':
        return 'Header Leaderboard (728x90)';
      case 'footerBanner':
        return 'Footer Leaderboard (728x90)';
      case 'sidebarAd':
        return 'Sidebar Banner (300x250)';
      case 'inContentAd':
        return 'Article In-Content Ad';
    }
  };

  const dimensionsClass = getSlotDimensions();

  // Return container element with active observation
  return (
    <div 
      ref={containerRef}
      style={{ minWidth: '250px', width: '100%' }}
      className={`flex flex-col items-center justify-center my-6 gap-1 ${dimensionsClass} ${className}`}
    >
      {isElementVisible && (
        <>
          {/* Custom HTML Code from AdSense Panel */}
          {slotSettings.code && slotSettings.code.trim() ? (
            <div className="w-full flex flex-col items-center justify-center gap-1">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-gray-400">
                Advertisement &middot; Google AdSense
              </span>
              <div 
                ref={codeContainerRef}
                style={{ minWidth: '250px', width: '100%' }}
                className="overflow-hidden rounded-xs border border-gray-100 bg-gray-50 flex items-center justify-center"
              />
            </div>
          ) : slotSettings.fallbackImage && slotSettings.fallbackImage.trim() ? (
            /* Fallback Affiliate Image Link */
            <div className="w-full flex flex-col items-center justify-center gap-1">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-gray-400">
                Sponsored Link &middot; Partner Offer
              </span>
              <a 
                href={slotSettings.fallbackLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="group block w-full relative overflow-hidden rounded-xs border border-accent/20 bg-primary shadow-xs transition hover:border-accent hover:shadow-md cursor-pointer"
              >
                <img 
                  src={slotSettings.fallbackImage} 
                  alt="Sponsor Advertisement" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-102 max-h-[160px] md:max-h-[200px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent flex flex-col justify-end p-4 text-left">
                  <span className="text-[9px] text-accent font-black uppercase tracking-widest bg-primary/80 px-1.5 py-0.5 rounded-full w-max mb-1.5 border border-accent/25">
                    Sponsor Ad
                  </span>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-white text-xs font-black uppercase tracking-wider group-hover:text-accent transition">
                      Exclusive Tool Partner Deals
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-accent shrink-0" />
                  </div>
                </div>
              </a>
            </div>
          ) : (
            /* Fallback beautiful mockup design if AdSense is active but no custom code is defined yet */
            <div className="w-full h-full bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-dashed border-primary/10 rounded-xs p-4 flex flex-col items-center justify-center text-center gap-2">
              <div className="flex items-center gap-1.5 text-primary">
                <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">{getSlotLabel()}</span>
              </div>
              <p className="text-[10px] text-gray-400 max-w-[280px] font-sans font-semibold leading-tight">
                AdSense is enabled. Paste your ad unit code or slot link in the Admin Portal settings tab to start displaying ads!
              </p>
              <span className="text-[8px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-xs border border-gray-200">
                Pub-ID: {settings.publisherId}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

