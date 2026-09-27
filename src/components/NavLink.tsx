import React from 'react';

interface NavLinkProps {
  to: string;
  onNavigate: (path: string) => void;
  className?: string;
  children: React.ReactNode;
  /** Called after SPA navigation is triggered (e.g. to close a mobile menu). */
  afterNavigate?: () => void;
  'aria-label'?: string;
  title?: string;
}

/**
 * Internal navigation that is a real link.
 *
 * Renders an <a href> so crawlers can follow it without executing JavaScript,
 * then intercepts the click for SPA navigation. Use this for every internal
 * navigation instead of a button with an onClick: the app prerenders to static
 * HTML, and an onClick leaves the destination with no crawlable inbound link.
 * Modified clicks (new tab, middle click) fall through to the browser.
 */
export default function NavLink({
  to,
  onNavigate,
  className,
  children,
  afterNavigate,
  title,
  'aria-label': ariaLabel,
}: NavLinkProps) {
  return (
    <a
      href={to}
      className={className}
      title={title}
      aria-label={ariaLabel}
      onClick={(event) => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }
        event.preventDefault();
        onNavigate(to);
        afterNavigate?.();
      }}
    >
      {children}
    </a>
  );
}
