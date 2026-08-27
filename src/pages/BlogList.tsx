import { useState, useMemo } from 'react';
import { BlogPost } from '../types';
import Markdown from '../components/Markdown';
import { Calendar, User, FileText, ArrowLeft, ExternalLink, Tag, Clock, Search } from 'lucide-react';
import NewsletterSignup from '../components/NewsletterSignup';
import { useSEO } from '../lib/seo';
import AdSenseAd from '../components/AdSenseAd';
import PinterestKitSection from '../components/PinterestKitSection';

interface BlogListProps {
  blogSlug: string | null;
  blogs: BlogPost[];
  onNavigate: (path: string) => void;
}

export default function BlogList({ blogSlug, blogs, onNavigate }: BlogListProps) {
  const isListView = !blogSlug;
  const currentPost = blogs.find(b => b.slug === blogSlug || b.id === blogSlug);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = useMemo(() => {
    const cats = new Set(blogs.map(b => b.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter(blog => {
      const matchesCategory = selectedCategory === 'All' || blog.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = searchQuery === '' || 
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (blog.targetKeywords && blog.targetKeywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesCategory && matchesSearch;
    });
  }, [blogs, selectedCategory, searchQuery]);

  const seoTitle = isListView 
    ? 'Planning Software & Productivity Blog: In-Depth Reviews & Architecture Guides' 
    : currentPost 
      ? (currentPost.metaTitle || currentPost.title)
      : 'Software & Strategy Blog';

  const seoDescription = isListView 
    ? 'Comprehensive technical guides, vendor benchmarks, and tactical workflows for agile project management, Gantt charts, job costing, and time tracking.' 
    : currentPost 
      ? (currentPost.metaDescription || currentPost.excerpt)
      : 'In-depth software strategy and productivity benchmark reports.';

  const seoKeywords = isListView
    ? ['project management blog', 'agile tools benchmarks', 'gantt chart guides', 'software reviews', 'productivity workflows']
    : currentPost
      ? (currentPost.targetKeywords || [currentPost.category.toLowerCase(), `${currentPost.slug.replace(/-/g, ' ')}`])
      : ['software blog'];

  useSEO({
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
    ogType: 'article',
    category: currentPost?.category || 'Software Reviews',
    author: currentPost?.author || 'Editorial PMO Team',
    publishDate: currentPost?.publishDate
  }, [blogSlug, currentPost]);

  if (isListView) {
    return (
      <div id="blog-index-page" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        
        {/* Blog Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/10 text-accent font-mono text-xs rounded-full font-bold">
            <span>Verified Technical Analysis</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-primary font-display tracking-tight">
            Planning &amp; Enterprise Software Directory Blog
          </h1>
          <p className="text-gray-600 text-base max-w-2xl mx-auto leading-relaxed">
            In-depth architectural comparisons, benchmark data, and tactical implementation playbooks across 22 planning categories and 50+ enterprise platforms.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across 50+ articles by keyword, software name, or workflow..."
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2 pt-1 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-gray-500 font-mono px-1">
          <span>Showing {filteredBlogs.length} {filteredBlogs.length === 1 ? 'article' : 'articles'}</span>
          {selectedCategory !== 'All' && (
            <button 
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="text-accent hover:underline font-bold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBlogs.map((blog) => (
            <article 
              key={blog.id}
              onClick={() => onNavigate(`/blog/${blog.slug}`)}
              className="bg-white p-6 rounded-2xl border border-gray-200/80 hover:border-accent hover:shadow-md cursor-pointer transition flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 text-[11px]">
                  <span className="bg-primary/5 text-primary font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {blog.category}
                  </span>
                  <div className="flex items-center gap-3 text-gray-400 font-medium">
                    {blog.readTime && (
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" /> {blog.readTime}
                      </span>
                    )}
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" /> {blog.publishDate}
                    </span>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-primary font-display group-hover:text-accent transition-colors leading-snug">
                  {blog.title}
                </h2>

                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                  {blog.excerpt}
                </p>

                {blog.featuredTools && blog.featuredTools.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] uppercase font-bold text-gray-400 font-mono mr-1">Tools:</span>
                    {blog.featuredTools.map((t, idx) => (
                      <span key={idx} className="text-[11px] bg-gray-100 text-gray-800 font-medium px-2 py-0.5 rounded-md">
                        {t.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs text-accent font-bold">
                <span>Read Full Technical Guide &rarr;</span>
                <span className="text-gray-400 text-[11px] font-normal font-mono">By {blog.author}</span>
              </div>
            </article>
          ))}
        </div>

        {filteredBlogs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 space-y-3">
            <FileText className="w-10 h-10 text-gray-400 mx-auto" />
            <p className="text-base font-bold text-gray-800">No matching articles found</p>
            <p className="text-xs text-gray-500">Try adjusting your search query or choosing another category filter.</p>
          </div>
        )}

      </div>
    );
  }

  // Selected blog post detail
  if (!currentPost) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <FileText className="w-12 h-12 text-accent mx-auto" />
        <h2 className="text-2xl font-bold text-primary font-display">Article Not Found</h2>
        <p className="text-gray-500 text-sm">The article you requested could not be found or may have been updated.</p>
        <button onClick={() => onNavigate('/blog')} className="px-4 py-2 bg-primary text-white font-bold rounded-xl text-xs">
          Return to Blog Directory
        </button>
      </div>
    );
  }

  return (
    <article id="blog-article-detail" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Return button */}
      <button 
        onClick={() => onNavigate('/blog')}
        className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-primary cursor-pointer transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to All Articles ({blogs.length})
      </button>

      {/* Blog Detail Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs bg-primary/5 text-primary font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {currentPost.category}
          </span>
          {currentPost.readTime && (
            <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {currentPost.readTime}
            </span>
          )}
        </div>
        
        <h1 className="text-3xl md:text-5xl font-extrabold text-primary font-display leading-tight tracking-tight">
          {currentPost.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-2 pb-4 border-b border-gray-100 font-medium">
          <span className="flex items-center gap-1">
            <User className="w-4 h-4 text-gray-400" /> By {currentPost.author}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-gray-400" /> Published: {currentPost.publishDate}
          </span>
        </div>
      </header>

      {/* Featured Tools Quick-Access Banner with External Links */}
      {currentPost.featuredTools && currentPost.featuredTools.length > 0 && (
        <section className="bg-slate-900 text-white p-5 rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              Featured Platforms Evaluated in this Article:
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Direct Official Portals</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentPost.featuredTools.map((tool, idx) => (
              <a
                key={idx}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-slate-800 hover:bg-slate-700/90 border border-slate-700 rounded-xl transition group"
              >
                <div>
                  <div className="text-sm font-bold text-white group-hover:text-accent transition-colors flex items-center gap-1.5">
                    {tool.name}
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-accent" />
                  </div>
                  {tool.badge && (
                    <span className="text-[10px] text-emerald-400 font-mono font-medium">
                      {tool.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-300 group-hover:text-white font-semibold bg-slate-700/60 px-2.5 py-1 rounded-lg">
                  Visit &rarr;
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Blog content */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xs prose prose-slate max-w-none">
        <Markdown content={currentPost.content} />
      </div>

      {/* Target Keywords / SEO Tags */}
      {currentPost.targetKeywords && currentPost.targetKeywords.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 font-mono">
            <Tag className="w-3.5 h-3.5 text-accent" />
            <span>Target Topics &amp; Compliance Standards:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {currentPost.targetKeywords.map((kw, idx) => (
              <span key={idx} className="text-xs bg-white text-gray-700 px-2.5 py-1 rounded-lg border border-gray-200 font-medium">
                #{kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Downloadable Pinterest & SEO Viral Traffic Kit */}
      <PinterestKitSection />

      {/* Inline dynamic content ad block */}
      <AdSenseAd slot="inContentAd" className="w-full" />

      {/* Newsletter Signup in Article Footer */}
      <div className="pt-6 border-t border-gray-100">
        <NewsletterSignup />
      </div>

    </article>
  );
}
