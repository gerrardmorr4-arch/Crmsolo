/**
 * Helper utility to dynamically inject SEO-friendly meta tags into the document head
 * based on the current page content. This is essential for search-engine-optimization,
 * social media sharing, and structured crawl previews.
 */

import { useEffect } from 'react';

export interface FAQItemSchema {
  question: string;
  answer: string;
}

export interface ProductReviewSchema {
  name: string;
  description: string;
  image?: string;
  ratingValue: number;
  reviewCount?: number;
  bestRating?: number;
  authorName?: string;
  price?: number | string;
  priceCurrency?: string;
}

export interface SEOOptions {
  title: string;
  description: string;
  keywords?: string[];
  ogType?: 'website' | 'article' | 'profile';
  ogImage?: string;
  canonicalUrl?: string;
  author?: string;
  publishDate?: string;
  category?: string;
  faqSchema?: FAQItemSchema[];
  productSchema?: ProductReviewSchema;
  jsonLdSchema?: object | object[];
  /**
   * Marks route-level fallback metadata from the app shell. Fallbacks rank below
   * page components so a page's own useSEO always wins regardless of the order
   * React flushes effects in.
   */
  fallback?: boolean;
}

/**
 * Tracks which kind of caller last set the document title. Reset on every
 * navigation so a new route's page component can claim the title even when the
 * previous page had already set one.
 */
const TITLE_PRIORITY_KEY = '__crmsoloTitlePriority';

export function resetSeoTitlePriority() {
  if (typeof window === 'undefined') return;
  (window as unknown as Record<string, unknown>)[TITLE_PRIORITY_KEY] = -1;
}

/**
 * Dynamically updates document metadata in the <head>
 */
export function updateMetaTags(options: SEOOptions) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const {
    title,
    description,
    keywords,
    ogType = 'website',
    ogImage = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80', // Beautiful high-quality fallback real estate image
    canonicalUrl,
    author,
    publishDate,
    category,
    faqSchema,
    productSchema,
    jsonLdSchema
  } = options;

  // Canonical root origin for CRMsolo production (guarantees www & http variations always report canonical)
  const CANONICAL_BASE = 'https://crmsolo.online';

  // Normalize canonical URL to strictly HTTPS and canonical domain (https://crmsolo.online)
  // Collapse duplicate slash/preview hosts and trailing slashes so that
  // /blog/ and /blog?utm=x resolve to the same single canonical URL.
  const normalizePath = (rawPath: string) => {
    let p = rawPath.split('?')[0].split('#')[0];
    if (!p.startsWith('/')) p = `/${p}`;
    if (p.length > 1) p = p.replace(/\/+$/, '');
    return p || '/';
  };

  let cleanCanonical = canonicalUrl;
  if (!cleanCanonical && typeof window !== 'undefined') {
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.endsWith('.run.app');
    const baseOrigin = isDev ? window.location.origin.replace(/^http:\/\//i, 'https://') : CANONICAL_BASE;
    cleanCanonical = `${baseOrigin}${normalizePath(window.location.pathname)}`;
  } else if (cleanCanonical) {
    cleanCanonical = cleanCanonical
      .replace(/^http:\/\//i, 'https://')
      .replace(/https:\/\/(www\.)?crmsolo\.(online|com)/i, CANONICAL_BASE);
  }

  // 1. Resolve precedence between the app-shell fallback and page components.
  // React flushes child effects before parent effects, so the route-level
  // fallback in App.tsx runs *after* the page component's useSEO. Without this
  // guard the fallback would overwrite every page's title, description and
  // canonical (which previously left 23 planning pages sharing one title).
  const isFallback = options.fallback === true;
  const priorityStore = window as unknown as Record<string, unknown>;
  const currentPriority = typeof priorityStore[TITLE_PRIORITY_KEY] === 'number'
    ? (priorityStore[TITLE_PRIORITY_KEY] as number)
    : -1;
  if (isFallback && currentPriority >= 1) {
    return;
  }
  priorityStore[TITLE_PRIORITY_KEY] = Math.max(currentPriority, isFallback ? 0 : 1);

  // 2. Update Title
  const siteSuffix = " | SoloAgent CRM Hub";
  const fullTitle = title.endsWith(siteSuffix) ? title : `${title}${siteSuffix}`;
  document.title = fullTitle;

  // Helper helper to get or create a meta tag
  const setMetaTag = (attributeName: string, attributeValue: string, content: string) => {
    let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attributeName, attributeValue);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // Helper to get or create a link tag
  const setLinkTag = (rel: string, href: string) => {
    let element = document.querySelector(`link[rel="${rel}"]`);
    if (!element) {
      element = document.createElement('link');
      element.setAttribute('rel', rel);
      document.head.appendChild(element);
    }
    element.setAttribute('href', href);
  };

  // 2. Standard Meta Tags
  setMetaTag('name', 'description', description);
  
  if (keywords && keywords.length > 0) {
    setMetaTag('name', 'keywords', keywords.join(', '));
  } else {
    // Fallback standard real estate SEO keywords
    setMetaTag('name', 'keywords', 'real estate crm, solo agent crm, pipedrive, streak, follow up boss, lead management, realtor productivity, local seo');
  }

  if (author) {
    setMetaTag('name', 'author', author);
  }

  // 3. Open Graph (Facebook / LinkedIn)
  setMetaTag('property', 'og:title', title);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:type', ogType);
  setMetaTag('property', 'og:url', cleanCanonical);
  setMetaTag('property', 'og:image', ogImage);
  setMetaTag('property', 'og:site_name', 'CRMsolo');

  // 4. Twitter Cards
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', title);
  setMetaTag('name', 'twitter:description', description);
  setMetaTag('name', 'twitter:image', ogImage);

  // 5. Canonical Link
  setLinkTag('canonical', cleanCanonical);

  // 6. Article specific metadata (if applicable)
  if (ogType === 'article') {
    if (publishDate) {
      try {
        setMetaTag('property', 'article:published_time', new Date(publishDate).toISOString());
      } catch (e) {
        // Safe fallback in case date string parsing fails
      }
    }
    if (category) {
      setMetaTag('property', 'article:section', category);
    }
    setMetaTag('property', 'article:tag', 'Real Estate Marketing');
  } else {
    // Remove article tags if not an article view to maintain valid markup
    const articlePubTime = document.querySelector('meta[property="article:published_time"]');
    if (articlePubTime) articlePubTime.remove();
    const articleSection = document.querySelector('meta[property="article:section"]');
    if (articleSection) articleSection.remove();
    const articleTag = document.querySelector('meta[property="article:tag"]');
    if (articleTag) articleTag.remove();
  }

  // 7. JSON-LD Structured Data Injection
  const schemas: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${CANONICAL_BASE}/#website`,
      'url': `${CANONICAL_BASE}/`,
      'name': 'CRMsolo',
      'description': 'The definitive real estate CRM evaluation platform and interactive ROI calculator for solo agents.',
      'publisher': { '@id': `${CANONICAL_BASE}/#organization` },
      'potentialAction': {
        '@type': 'SearchAction',
        'target': {
          '@type': 'EntryPoint',
          'urlTemplate': `${CANONICAL_BASE}/reviews?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${CANONICAL_BASE}/#organization`,
      'name': 'CRMsolo',
      'url': `${CANONICAL_BASE}/`,
      'logo': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80',
      'founder': {
        '@type': 'Person',
        'name': 'Eugene Boniface',
        'jobTitle': 'Chief Analyst & Real Estate Systems Strategist'
      }
    }
  ];

  // A. FAQPage Schema
  if (faqSchema && faqSchema.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqSchema.map((item) => ({
        '@type': 'Question',
        'name': item.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': item.answer
        }
      }))
    });
  }

  // B. Product & Review Schema
  if (productSchema) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': productSchema.name,
      'description': productSchema.description,
      'image': productSchema.image || ogImage,
      'review': {
        '@type': 'Review',
        'reviewRating': {
          '@type': 'Rating',
          'ratingValue': productSchema.ratingValue.toString(),
          'bestRating': (productSchema.bestRating || 10).toString()
        },
        'author': {
          '@type': 'Organization',
          'name': productSchema.authorName || 'CRMSolo Hub'
        }
      },
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': productSchema.ratingValue.toString(),
        'reviewCount': (productSchema.reviewCount || 1).toString(),
        'bestRating': (productSchema.bestRating || 10).toString()
      }
    });
  }

  // B2. Article Schema for editorial pages. Guide and blog detail pages pass
  // author/publishDate/category but previously emitted no Article markup, so
  // they were ineligible for article rich results.
  if (!jsonLdSchema && ogType === 'article' && (author || publishDate)) {
    const article: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': title,
      'description': description,
      'image': ogImage,
      'mainEntityOfPage': { '@type': 'WebPage', '@id': cleanCanonical },
      'publisher': { '@id': `${CANONICAL_BASE}/#organization` },
      'author': { '@type': 'Person', 'name': author || 'CRMsolo Evaluation Team' }
    };
    if (category) article.articleSection = category;
    if (publishDate) {
      const parsed = new Date(publishDate);
      article.datePublished = Number.isNaN(parsed.getTime())
        ? publishDate
        : parsed.toISOString();
    }
    schemas.push(article);
  }

  // C. Custom JSON-LD
  if (jsonLdSchema) {
    if (Array.isArray(jsonLdSchema)) {
      schemas.push(...jsonLdSchema);
    } else {
      schemas.push(jsonLdSchema);
    }
  }

  // Inject or clear JSON-LD script tag
  let jsonLdScript = document.getElementById('seo-json-ld');
  if (schemas.length > 0) {
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.setAttribute('type', 'application/ld+json');
      jsonLdScript.setAttribute('id', 'seo-json-ld');
      document.head.appendChild(jsonLdScript);
    }
    jsonLdScript.textContent = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas, null, 2);
  } else if (jsonLdScript) {
    // Reaches here only when no schema applies (e.g. the 404 page), which must
    // not carry an empty "[]" JSON-LD block.

    jsonLdScript.remove();
  }

  // Emit the effective metadata so the build-time prerenderer can persist the
  // final, post-override values into each route's static HTML.
  if (typeof window !== 'undefined' && typeof CustomEvent === 'function') {
    window.dispatchEvent(new CustomEvent('crmsolo:seo', {
      detail: {
        title: document.title,
        description,
        canonicalUrl: cleanCanonical,
        ogType,
        ogImage,
        keywords: keywords || [],
        jsonLd: schemas.length === 1 ? schemas[0] : schemas
      }
    }));
  }
}

/**
 * React hook to automatically sync page options to document metadata
 */
export function useSEO(options: SEOOptions, dependencies: any[] = []) {
  useEffect(() => {
    updateMetaTags(options);
    // The dependency list below intentionally mirrors the original hook; callers
    // pass the identity of the route's data so metadata refreshes on navigation.
  }, [options.title, options.description, options.canonicalUrl, options.ogImage, options.fallback, ...dependencies]);
}

