import { CRMReview, CRMComparison, CRMGuide, BlogPost } from '../types';

export interface SearchResultItem {
  id: string;
  type: 'review' | 'comparison' | 'guide' | 'blog';
  typeLabel: string;
  title: string;
  subtitle: string;
  badge?: string;
  badgeColor?: string;
  category?: string;
  slug: string;
  path: string;
  score: number;
  matchedField: 'title' | 'excerpt' | 'category' | 'content';
}

/**
 * Levenshtein distance calculation for fuzzy matching strings and typo tolerance.
 */
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Calculates a fuzzy match score (0 to 100) for a query string against target text.
 */
export function fuzzyMatchScore(query: string, targetText: string): number {
  if (!query || !targetText) return 0;

  const q = query.trim().toLowerCase();
  const t = targetText.trim().toLowerCase();

  if (!q || !t) return 0;

  // Exact full match
  if (t === q) return 100;

  // Starts with
  if (t.startsWith(q)) return 90 + Math.min(10, (q.length / t.length) * 10);

  // Contains exact substring
  if (t.includes(q)) return 75 + Math.min(10, (q.length / t.length) * 10);

  // Token matching & fuzzy token distance
  const qTokens = q.split(/[\s\-_]+/).filter(Boolean);
  const tTokens = t.split(/[\s\-_]+/).filter(Boolean);

  if (qTokens.length === 0) return 0;

  let totalScore = 0;

  for (const qTok of qTokens) {
    let maxTokScore = 0;

    for (const tTok of tTokens) {
      if (tTok === qTok) {
        maxTokScore = Math.max(maxTokScore, 100);
      } else if (tTok.startsWith(qTok)) {
        maxTokScore = Math.max(maxTokScore, 85);
      } else if (tTok.includes(qTok)) {
        maxTokScore = Math.max(maxTokScore, 70);
      } else if (qTok.includes(tTok)) {
        maxTokScore = Math.max(maxTokScore, 60);
      } else {
        // Levenshtein fuzzy distance for typos
        if (qTok.length >= 3) {
          const dist = levenshteinDistance(qTok, tTok);
          const maxLen = Math.max(qTok.length, tTok.length);
          const similarity = (maxLen - dist) / maxLen;

          if (dist <= 2 && similarity >= 0.55) {
            maxTokScore = Math.max(maxTokScore, Math.round(similarity * 55));
          }
        }
      }
    }

    if (maxTokScore === 0) {
      // Query token couldn't be matched in target
      return 0;
    }

    totalScore += maxTokScore;
  }

  return Math.round(totalScore / qTokens.length);
}

/**
 * Searches through all reviews, comparisons, guides, and blog posts prioritizing title matches.
 */
export function performFuzzySearch(
  query: string,
  reviews: CRMReview[],
  comparisons: CRMComparison[],
  guides: CRMGuide[],
  blogPosts: BlogPost[]
): SearchResultItem[] {
  if (!query || query.trim().length === 0) return [];

  const results: SearchResultItem[] = [];

  // 1. Search Reviews
  reviews.forEach((r) => {
    const titleScore = fuzzyMatchScore(query, r.name) * 3.0; // 3x title priority
    const pitchScore = fuzzyMatchScore(query, r.oneLinePitch) * 1.5;
    const bestForScore = fuzzyMatchScore(query, r.bestFor) * 1.2;
    const verdictScore = fuzzyMatchScore(query, r.verdict) * 0.8;

    const maxScore = Math.max(titleScore, pitchScore, bestForScore, verdictScore);

    if (maxScore > 20) {
      let matchedField: 'title' | 'excerpt' | 'category' | 'content' = 'title';
      if (titleScore < maxScore) {
        if (pitchScore === maxScore) matchedField = 'excerpt';
        else if (bestForScore === maxScore) matchedField = 'category';
        else matchedField = 'content';
      }

      results.push({
        id: `review-${r.id}`,
        type: 'review',
        typeLabel: 'CRM Review',
        title: r.name,
        subtitle: r.oneLinePitch,
        badge: `${r.overallScore}/10 Score`,
        badgeColor: 'bg-primary text-accent font-mono',
        category: r.bestFor,
        slug: r.slug,
        path: `/reviews/${r.slug}`,
        score: maxScore,
        matchedField
      });
    }
  });

  // 2. Search Comparisons
  comparisons.forEach((c) => {
    const titleScore = fuzzyMatchScore(query, c.title) * 3.0;
    const summaryScore = fuzzyMatchScore(query, c.verdictSummary) * 1.5;

    const maxScore = Math.max(titleScore, summaryScore);

    if (maxScore > 20) {
      results.push({
        id: `comparison-${c.id}`,
        type: 'comparison',
        typeLabel: 'Comparison',
        title: c.title,
        subtitle: c.verdictSummary,
        badge: 'VS Match',
        badgeColor: 'bg-accent/20 text-primary border border-accent/40 font-mono',
        slug: c.slug,
        path: `/compare/${c.slug}`,
        score: maxScore,
        matchedField: titleScore >= summaryScore ? 'title' : 'excerpt'
      });
    }
  });

  // 3. Search Guides
  guides.forEach((g) => {
    const titleScore = fuzzyMatchScore(query, g.title) * 3.0;
    const excerptScore = fuzzyMatchScore(query, g.excerpt) * 1.5;
    const categoryScore = fuzzyMatchScore(query, g.category) * 1.8;
    const contentScore = fuzzyMatchScore(query, g.content) * 0.7;

    const maxScore = Math.max(titleScore, excerptScore, categoryScore, contentScore);

    if (maxScore > 20) {
      let matchedField: 'title' | 'excerpt' | 'category' | 'content' = 'title';
      if (titleScore < maxScore) {
        if (categoryScore === maxScore) matchedField = 'category';
        else if (excerptScore === maxScore) matchedField = 'excerpt';
        else matchedField = 'content';
      }

      results.push({
        id: `guide-${g.id}`,
        type: 'guide',
        typeLabel: 'Guide & Workbook',
        title: g.title,
        subtitle: g.excerpt,
        badge: g.readTime || 'Guide',
        badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono',
        category: g.category,
        slug: g.slug,
        path: `/guides/${g.slug}`,
        score: maxScore,
        matchedField
      });
    }
  });

  // 4. Search Blog Posts
  blogPosts.forEach((b) => {
    const titleScore = fuzzyMatchScore(query, b.title) * 3.0;
    const excerptScore = fuzzyMatchScore(query, b.excerpt) * 1.5;
    const categoryScore = fuzzyMatchScore(query, b.category) * 1.8;
    const contentScore = fuzzyMatchScore(query, b.content) * 0.7;

    const maxScore = Math.max(titleScore, excerptScore, categoryScore, contentScore);

    if (maxScore > 20) {
      let matchedField: 'title' | 'excerpt' | 'category' | 'content' = 'title';
      if (titleScore < maxScore) {
        if (categoryScore === maxScore) matchedField = 'category';
        else if (excerptScore === maxScore) matchedField = 'excerpt';
        else matchedField = 'content';
      }

      results.push({
        id: `blog-${b.id}`,
        type: 'blog',
        typeLabel: 'Blog Article',
        title: b.title,
        subtitle: b.excerpt,
        badge: `${Math.max(2, Math.ceil(b.content.split(/\s+/).length / 200))} min read`,
        badgeColor: 'bg-blue-100 text-blue-800 border border-blue-200 font-mono',
        category: b.category,
        slug: b.slug,
        path: `/blog/${b.slug}`,
        score: maxScore,
        matchedField
      });
    }
  });

  // Sort by score descending
  return results.sort((a, b) => b.score - a.score);
}
