import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import ReviewDetail from './pages/ReviewDetail';
import ComparisonDetail from './pages/ComparisonDetail';
import GuideDetail from './pages/GuideDetail';
import BlogList from './pages/BlogList';
import StaticPages from './pages/StaticPages';
import ROICalculator from './components/ROICalculator';
import FeatureChecklist from './components/FeatureChecklist';
import AdminPortal from './pages/AdminPortal';
import { Directory } from './pages/Directory';
import { BuyerGuide } from './pages/BuyerGuide';
import ErrorBoundary from './components/ErrorBoundary';
import { useSEO } from './lib/seo';


import { getReviews, getComparisons, getGuides, getBlogPosts } from './lib/storage';
import { CRMReview, CRMComparison, CRMGuide, BlogPost } from './types';
import { Calculator, Eye, HelpCircle, ArrowRight, Award } from 'lucide-react';

export default function App() {
  // Routing state
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);

  // Dynamic CMS state loaded from storage
  const [reviews, setReviews] = useState<CRMReview[]>(getReviews());
  const [comparisons, setComparisons] = useState<CRMComparison[]>(getComparisons());
  const [guides, setGuides] = useState<CRMGuide[]>(getGuides());
  const [blogs, setBlogs] = useState<BlogPost[]>(getBlogPosts());

  // Set meta tags for non-page-component routes and global fallbacks
  let topTitle = 'Best Real Estate CRM Software Directory (2026 Reviews & Pricing)';
  let topDescription = 'Browse, compare, and filter top Real Estate Customer Relationship Management (CRM) tools. Read verified buyer reviews, pricing models, and feature checklists.';
  let topKeywords = ['real estate crm', 'real estate software directory', 'realtor crm reviews', 'crm pricing', 'pipedrive', 'follow up boss', 'streak'];

  if (currentPath === '/directory' || currentPath === '/category/crm') {
    topTitle = 'Best Real Estate CRM Software Directory (2026 Reviews & Pricing)';
    topDescription = 'Explore top verified real estate CRM software with side-by-side comparison tables, filter by price and deployment, and read expert ratings.';
    topKeywords = ['best real estate crm', 'real estate crm directory', 'realtor software comparison', 'getapp real estate crm'];
  } else if (currentPath === '/buyer-guide' || currentPath === '/buyers-guide') {
    topTitle = "Real Estate CRM Buyer's Guides & Frameworks (2026)";
    topDescription = "In-depth procurement guides, pricing audits, speed-to-lead automation workflows, and CRM checklists for independent agents.";
    topKeywords = ['crm buyer guide', 'real estate software guide', 'crm pricing evaluation', 'speed to lead automation'];
  } else if (currentPath === '/calculator') {
    topTitle = 'CRM ROI Savings Calculator for Solo Realtors';
    topDescription = 'Calculate exactly how many weekly hours you can save and your deal recovery value by automating workflows in Pipedrive, Streak, or Follow Up Boss.';
    topKeywords = ['crm calculator', 'realtor roi calculator', 'real estate automation savings'];
  } else if (currentPath === '/checklist') {
    topTitle = 'Solo Agent CRM Feature Checklist';
    topDescription = 'Interactive feature comparisons checklist specifically for independent real estate brokers. Filter by Pipedrive, Streak, and Follow Up Boss.';
    topKeywords = ['crm feature checklist', 'solo realtor crm comparison', 'realtor tools grid'];
  } else if (currentPath === '/reviews') {
    topTitle = 'Tested CRM Reviews for Solo Realtors';
    topDescription = 'Read our honest verdicts and hands-on reviews of Pipedrive, Streak, Follow Up Boss, Copper, and Wise Agent.';
    topKeywords = ['tested crm reviews', 'honest crm review', 'pipedrive review', 'streak review', 'follow up boss review'];
  }

  useSEO({
    title: topTitle,
    description: topDescription,
    keywords: topKeywords,
    ogType: 'website'
  }, [currentPath]);

  // Intercept browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Custom navigation handler
  const handleNavigate = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  // Callback to reload data when the CMS dashboard modifies the local storage database
  const reloadCmsData = () => {
    setReviews(getReviews());
    setComparisons(getComparisons());
    setGuides(getGuides());
    setBlogs(getBlogPosts());
  };

  // Determine custom sticky CTAs based on currentPath
  const getStickyCta = () => {
    if (currentPath.includes('/reviews/pipedrive-for-real-estate-agents')) {
      const pipedrive = reviews.find(r => r.id === 'pipedrive');
      const score = pipedrive ? pipedrive.overallScore : 9.2;
      return {
        text: "Pipedrive's visual pipelines help solo agents close more deals.",
        linkText: "See Pipedrive Pricing",
        rating: score / 2,
        ratingLabel: `${score}/10 Score`,
        onLinkClick: () => {
          if (pipedrive) window.open(pipedrive.affiliateLink, '_blank', 'referrer');
        }
      };
    }
    if (currentPath.includes('/reviews/streak-for-real-estate-agents')) {
      const streak = reviews.find(r => r.id === 'streak');
      const score = streak ? streak.overallScore : 8.8;
      return {
        text: "Evaluate Streak's permanent free tier to organize your sphere right inside Gmail.",
        linkText: "Get Streak Free",
        rating: score / 2,
        ratingLabel: `${score}/10 Score`,
        onLinkClick: () => {
          if (streak) window.open(streak.affiliateLink, '_blank', 'referrer');
        }
      };
    }
    if (currentPath.includes('/reviews/followupboss-for-real-estate-agents')) {
      const followupboss = reviews.find(r => r.id === 'followupboss');
      const score = followupboss ? followupboss.overallScore : 9.4;
      return {
        text: "Activate Follow Up Boss for industry-leading lead conversion tools.",
        linkText: "Get Follow Up Boss Trial",
        rating: score / 2,
        ratingLabel: `${score}/10 Score`,
        onLinkClick: () => {
          if (followupboss) window.open(followupboss.affiliateLink, '_blank', 'referrer');
        }
      };
    }
    if (currentPath.includes('/compare/best-crm-for-solo-real-estate-agents') || currentPath.includes('/compare/pipedrive-vs-streak')) {
      return {
        text: "Ready to test Pipedrive vs Streak with your local market leads?",
        linkText: "Launch ROI Calculator",
        rating: 4.9,
        ratingLabel: "4.9/5 Agent Rating",
        onLinkClick: () => handleNavigate('/calculator')
      };
    }
    return null;
  };

  // Routing Logic
  const renderContent = () => {
    // 1. Home
    if (currentPath === '/' || currentPath === '/index.html') {
      return (
        <Home 
          reviews={reviews} 
          guides={guides} 
          blogs={blogs} 
          onNavigate={handleNavigate} 
        />
      );
    }

    // 2. Calculator Page (standalone viewport)
    if (currentPath === '/calculator') {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12 space-y-8">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-accent text-xs font-bold tracking-wider uppercase px-3 py-1 bg-accent/10 border border-accent/25 rounded-full inline-block">
              Full Calculator Interface
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-primary font-display tracking-tight uppercase">
              CRM ROI & Revenue Recovery Calculator
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm leading-relaxed">
              Adjust your monthly lead volume, average deal commissions, lead response times, and administrative hours to calculate projected annual revenue gains and identify your optimal real estate CRM.
            </p>
          </div>
          <ROICalculator reviews={reviews} onNavigateToCRM={(slug) => handleNavigate(`/reviews/${slug}`)} />
        </div>
      );
    }

    // 2.5 Checklist Page
    if (currentPath === '/checklist') {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <FeatureChecklist reviews={reviews} onNavigateToCRM={(slug) => handleNavigate(`/reviews/${slug}`)} />
        </div>
      );
    }

    // 2.8 Admin CMS & Settings Portal
    if (currentPath === '/admin' || currentPath === '/settings') {
      return (
        <AdminPortal onUpdateCMS={reloadCmsData} onNavigate={handleNavigate} />
      );
    }

    // 2.9 GetApp-Style Software Directory Page
    if (currentPath === '/directory' || currentPath === '/category/crm' || currentPath === '/category') {
      return (
        <Directory 
          reviews={reviews}
          onNavigateToReview={(slug) => handleNavigate(`/reviews/${slug}`)}
          onNavigateToGuide={(slug) => handleNavigate(`/guides/${slug}`)}
          onNavigateToComparisons={() => handleNavigate('/compare')}
        />
      );
    }

    // 2.95 Buyer's Guide & Frameworks Hub
    if (currentPath === '/buyer-guide' || currentPath === '/buyers-guide') {
      return (
        <BuyerGuide 
          guides={guides}
          onSelectGuide={(slug) => handleNavigate(`/guides/${slug}`)}
          onNavigateToDirectory={() => handleNavigate('/directory')}
        />
      );
    }

    // 3. Reviews list & details
    if (currentPath === '/reviews') {
      return (
        <Directory 
          reviews={reviews}
          onNavigateToReview={(slug) => handleNavigate(`/reviews/${slug}`)}
          onNavigateToGuide={(slug) => handleNavigate(`/guides/${slug}`)}
          onNavigateToComparisons={() => handleNavigate('/compare')}
        />
      );
    }

    if (currentPath.startsWith('/reviews/')) {
      const slug = currentPath.replace('/reviews/', '');
      const selectedCrm = reviews.find(r => r.slug === slug || r.id === slug || r.slug.includes(slug) || slug.includes(r.id));
      if (selectedCrm) {
        return <ReviewDetail crm={selectedCrm} onNavigate={handleNavigate} />;
      }
    }

    // 4. Comparisons list & details
    if (currentPath === '/compare' || currentPath === '/comparisons' || currentPath.startsWith('/compare/') || currentPath.startsWith('/comparison/')) {
      const rawSlug = currentPath.replace('/compare/', '').replace('/comparison/', '').replace('/compare', '').replace('/comparisons', '');
      const slug = rawSlug && rawSlug !== '' ? rawSlug : null;
      return (
        <ComparisonDetail 
          comparisonSlug={slug}
          comparisons={comparisons}
          reviews={reviews}
          onNavigate={handleNavigate}
        />
      );
    }

    // 5. Guides list & details
    if (currentPath === '/guides' || currentPath.startsWith('/guides/') || currentPath === '/guide' || currentPath.startsWith('/guide/')) {
      const rawSlug = currentPath.replace('/guides/', '').replace('/guide/', '').replace('/guides', '').replace('/guide', '');
      const slug = rawSlug && rawSlug !== '' ? rawSlug : null;
      return (
        <GuideDetail 
          guideSlug={slug}
          guides={guides}
          onNavigate={handleNavigate}
        />
      );
    }

    // 6. Blog List & details
    if (currentPath === '/blog' || currentPath.startsWith('/blog/')) {
      const slug = currentPath === '/blog' ? null : currentPath.replace('/blog/', '');
      return (
        <BlogList 
          blogSlug={slug}
          blogs={blogs}
          onNavigate={handleNavigate}
        />
      );
    }

    // 7. Static Pages
    if (currentPath === '/about') {
      return <StaticPages pageType="about" onUpdateCMS={reloadCmsData} />;
    }
    if (currentPath === '/contact') {
      return <StaticPages pageType="contact" onUpdateCMS={reloadCmsData} />;
    }
    if (currentPath === '/privacy-policy' || currentPath === '/privacy') {
      return <StaticPages pageType="privacy" onUpdateCMS={reloadCmsData} />;
    }
    if (currentPath === '/affiliate-disclosure' || currentPath === '/affiliate') {
      return <StaticPages pageType="affiliate" onUpdateCMS={reloadCmsData} />;
    }

    // 404 Fallback
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <span className="text-5xl">🧭</span>
        <h2 className="text-2xl font-bold text-primary font-display">Page Not Found</h2>
        <p className="text-gray-500 text-sm">We couldn't locate the directory or file slug you requested. Let's return to safety.</p>
        <button 
          onClick={() => handleNavigate('/')}
          className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl"
        >
          Return to home page
        </button>
      </div>
    );
  };

  return (
    <Layout 
      currentPath={currentPath} 
      onNavigate={handleNavigate}
      stickyCta={getStickyCta()}
    >
      <ErrorBoundary key={currentPath} onReset={reloadCmsData} onNavigateHome={() => handleNavigate('/')}>
        {renderContent()}
      </ErrorBoundary>
    </Layout>
  );
}
