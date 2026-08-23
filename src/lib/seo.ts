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

  // Normalize canonical URL to HTTPS and strip trailing hash/search if needed
  let cleanCanonical = canonicalUrl;
  if (!cleanCanonical && typeof window !== 'undefined') {
    const origin = window.location.origin.replace(/^http:\/\//i, 'https://');
    cleanCanonical = `${origin}${window.location.pathname}`;
  } else if (cleanCanonical) {
    cleanCanonical = cleanCanonical.replace(/^http:\/\//i, 'https://');
  }

  // 1. Update Title
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
  const schemas: object[] = [];

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
    jsonLdScript.remove();
  }
}

/**
 * React hook to automatically sync page options to document metadata
 */
export function useSEO(options: SEOOptions, dependencies: any[] = []) {
  useEffect(() => {
    updateMetaTags(options);
  }, [options.title, options.description, options.canonicalUrl, options.ogImage, ...dependencies]);
}

