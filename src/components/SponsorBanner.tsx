import React, { useEffect, useState, useRef } from 'react';
import { getSponsorAdSettings } from '../lib/storage';
import { SponsorAdSettings, SponsorSlotSettings } from '../types';
import { ExternalLink } from 'lucide-react';

interface SponsorBannerProps {
  slot: 'headerBanner' | 'sidebarAd' | 'inContentAd' | 'footerBanner';
  className?: string;
}

export default function SponsorBanner({ slot, className = '' }: SponsorBannerProps) {
  const [settings, setSettings] = useState<SponsorAdSettings | null>(null);
  const [isElementVisible, setIsElementVisible] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      setSettings(getSponsorAdSettings());
    } catch (e) {
      console.error('Failed to load sponsor banner settings', e);
    }

    const handleSettingsUpdate = () => {
      try {
        setSettings(getSponsorAdSettings());
      } catch (e) {}
    };

    window.addEventListener('crmsolo_sponsor_updated', handleSettingsUpdate);
    return () => {
      window.removeEventListener('crmsolo_sponsor_updated', handleSettingsUpdate);
    };
  }, []);

  const slotSettings: SponsorSlotSettings | undefined = settings?.[slot];

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

      setIsElementVisible(rect.width > 0 && !isHidden);
    };

    checkVisibility();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        checkVisibility();
      });
      resizeObserver.observe(el);
    }

    window.addEventListener('resize', checkVisibility);

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', checkVisibility);
    };
  }, [slotSettings?.enabled, settings?.globalEnabled]);

  if (!settings || !settings.globalEnabled) {
    return null;
  }

  if (!slotSettings || !slotSettings.enabled) {
    return null;
  }

  if (!slotSettings.fallbackImage || !slotSettings.fallbackImage.trim()) {
    return null;
  }

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

  const dimensionsClass = getSlotDimensions();

  return (
    <div
      ref={containerRef}
      style={{ minWidth: '250px', width: '100%' }}
      className={`flex flex-col items-center justify-center my-6 gap-1 ${dimensionsClass} ${className}`}
    >
      {isElementVisible && (
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
      )}
    </div>
  );
}
