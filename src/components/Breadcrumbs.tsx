import React, { useMemo } from 'react';
import { Home, ChevronRight } from 'lucide-react';
import { getReviews, getComparisons, getGuides, getBlogPosts } from '../lib/storage';
import { getPlanningCategoryBySlug } from '../data/planningToolsData';
import { automationBlueprints } from '../data/blueprintsData';

export interface BreadcrumbItem {
  label: string;
  path: string;
}

export interface BreadcrumbsProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  customCrumbs?: BreadcrumbItem[];
  className?: string;
  showJsonLd?: boolean;
}

/**
 * Resolves an array of semantic breadcrumb items based on the current URL pathname
 */
export function resolveBreadcrumbs(currentPath: string, customCrumbs?: BreadcrumbItem[]): BreadcrumbItem[] {
  if (customCrumbs && customCrumbs.length > 0) {
    return customCrumbs;
  }

  if (!currentPath || currentPath === '/') {
    return [];
  }

  const crumbs: BreadcrumbItem[] = [
    { label: 'Home', path: '/' }
  ];

  const segments = currentPath.split('/').filter(Boolean);
  if (segments.length === 0) return [];

  const [firstSeg, secondSeg, thirdSeg] = segments;

  switch (firstSeg) {
    case 'directory':
      crumbs.push({ label: 'Software Directory', path: '/directory' });
      break;

    case 'category':
      crumbs.push({ label: 'Software Directory', path: '/directory' });
      if (secondSeg) {
        const catName = secondSeg === 'crm' 
          ? 'Real Estate CRM' 
          : secondSeg.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        crumbs.push({ label: catName, path: `/category/${secondSeg}` });
      }
      break;

    case 'buyer-guide':
    case 'buyers-guide':
      crumbs.push({ label: "Buyer's Guide Hub", path: '/buyer-guide' });
      if (secondSeg) {
        crumbs.push({
          label: secondSeg.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          path: `/buyer-guide/${secondSeg}`
        });
      }
      break;

    case 'reviews':
      crumbs.push({ label: 'CRM Reviews', path: '/reviews' });
      if (secondSeg) {
        const reviews = getReviews();
        const review = reviews.find(r => r.slug === secondSeg || r.id === secondSeg);
        crumbs.push({
          label: review ? `${review.name} Review` : secondSeg.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          path: `/reviews/${secondSeg}`
        });
      }
      break;

    case 'compare':
      crumbs.push({ label: 'CRM Comparisons', path: '/compare' });
      if (secondSeg) {
        const comparisons = getComparisons();
        const comp = comparisons.find(c => c.slug === secondSeg || c.id === secondSeg);
        crumbs.push({
          label: comp ? comp.title : secondSeg.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          path: `/compare/${secondSeg}`
        });
      }
      break;

    case 'guides':
      crumbs.push({ label: 'Guides & Workbooks', path: '/guides' });
      if (secondSeg) {
        const guides = getGuides();
        const guide = guides.find(g => g.slug === secondSeg || g.id === secondSeg);
        crumbs.push({
          label: guide ? guide.title : secondSeg.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          path: `/guides/${secondSeg}`
        });
      }
      break;

    case 'blog':
      crumbs.push({ label: 'Blog & Articles', path: '/blog' });
      if (secondSeg) {
        const blogs = getBlogPosts();
        const blog = blogs.find(b => b.slug === secondSeg || b.id === secondSeg);
        crumbs.push({
          label: blog ? blog.title : secondSeg.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          path: `/blog/${secondSeg}`
        });
      }
      break;

    case 'blueprints':
      crumbs.push({ label: 'Automation Blueprints', path: '/blueprints' });
      if (secondSeg) {
        const blueprint = automationBlueprints.find(b => b.slug === secondSeg || b.id === secondSeg);
        crumbs.push({
          label: blueprint ? blueprint.title : secondSeg.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          path: `/blueprints/${secondSeg}`
        });
      }
      break;

    case 'planning-tools':
      crumbs.push({ label: 'Planning Tools Directory', path: '/planning-tools' });
      if (secondSeg) {
        const cat = getPlanningCategoryBySlug(secondSeg);
        crumbs.push({
          label: cat ? `${cat.name} (${cat.toolCount})` : secondSeg.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          path: `/planning-tools/${secondSeg}`
        });
      }
      break;

    case 'calculator':
      crumbs.push({ label: 'CRM ROI Calculator', path: '/calculator' });
      break;

    case 'checklist':
      crumbs.push({ label: 'Feature Checklist', path: '/checklist' });
      break;

    case 'about':
      crumbs.push({ label: 'About CRMsolo', path: '/about' });
      break;

    case 'contact':
      crumbs.push({ label: 'Contact Us', path: '/contact' });
      break;

    case 'privacy-policy':
      crumbs.push({ label: 'Privacy Policy', path: '/privacy-policy' });
      break;

    case 'affiliate-disclosure':
      crumbs.push({ label: 'Affiliate Disclosure', path: '/affiliate-disclosure' });
      break;

    case 'admin':
      crumbs.push({ label: 'Admin Portal', path: '/admin' });
      break;

    default:
      crumbs.push({
        label: firstSeg.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        path: `/${firstSeg}`
      });
      if (secondSeg) {
        crumbs.push({
          label: secondSeg.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          path: `/${firstSeg}/${secondSeg}`
        });
      }
      break;
  }

  return crumbs;
}

export default function Breadcrumbs({
  currentPath,
  onNavigate,
  customCrumbs,
  className = '',
  showJsonLd = true
}: BreadcrumbsProps) {
  const crumbs = useMemo(() => resolveBreadcrumbs(currentPath, customCrumbs), [currentPath, customCrumbs]);

  if (crumbs.length <= 1) {
    return null;
  }

  // Generate Google-compliant Schema.org BreadcrumbList JSON-LD
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://crmsolo.com';
  const breadcrumbListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': crumb.label,
      'item': `${origin}${crumb.path === '/' ? '' : crumb.path}`
    }))
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    // Allow default browser behavior for modifier keys (e.g. Cmd+Click or middle click for new tab)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <>
      {showJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbListJsonLd) }}
        />
      )}

      <nav
        id="semantic-breadcrumbs-nav"
        aria-label="Breadcrumb"
        className={`bg-slate-50/90 border-b border-slate-200/80 py-2.5 px-4 sm:px-6 lg:px-8 text-xs font-medium transition-all ${className}`}
      >
        <div className="max-w-7xl mx-auto flex items-center">
          <ol
            itemScope
            itemType="https://schema.org/BreadcrumbList"
            className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap no-scrollbar py-0.5"
          >
            {crumbs.map((crumb, idx) => {
              const isLast = idx === crumbs.length - 1;
              const isHome = idx === 0;

              return (
                <li
                  key={crumb.path + '-' + idx}
                  itemProp="itemListElement"
                  itemScope
                  itemType="https://schema.org/ListItem"
                  className="inline-flex items-center gap-1.5 shrink-0"
                >
                  {idx > 0 && (
                    <ChevronRight
                      aria-hidden="true"
                      className="w-3.5 h-3.5 text-slate-400 shrink-0 select-none"
                    />
                  )}

                  {isLast ? (
                    <span
                      aria-current="page"
                      itemProp="name"
                      title={crumb.label}
                      className="text-slate-900 font-bold truncate max-w-[240px] sm:max-w-xs md:max-w-md lg:max-w-lg font-display"
                    >
                      {crumb.label}
                    </span>
                  ) : (
                    <a
                      itemProp="item"
                      href={crumb.path}
                      onClick={(e) => handleLinkClick(e, crumb.path)}
                      className="inline-flex items-center gap-1 text-slate-600 hover:text-emerald-600 font-medium transition cursor-pointer hover:underline"
                    >
                      {isHome && (
                        <Home
                          aria-hidden="true"
                          className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-600 shrink-0"
                        />
                      )}
                      <span itemProp="name">{crumb.label}</span>
                    </a>
                  )}

                  <meta itemProp="position" content={String(idx + 1)} />
                </li>
              );
            })}
          </ol>
        </div>
      </nav>
    </>
  );
}
