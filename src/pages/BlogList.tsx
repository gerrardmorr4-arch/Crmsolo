import { BlogPost } from '../types';
import Markdown from '../components/Markdown';
import { Calendar, User, FileText, ArrowLeft } from 'lucide-react';
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
  const currentPost = blogs.find(b => b.slug === blogSlug);

  const seoTitle = isListView 
    ? 'Broker Notes & Industry Commentary' 
    : currentPost 
      ? currentPost.title 
      : 'CRM Blog';

  const seoDescription = isListView 
    ? 'Low-frequency updates on CRM software changes, commission rules, and independent agency statistics.' 
    : currentPost 
      ? currentPost.excerpt 
      : 'Broker notes and real estate strategy insights.';

  const seoKeywords = isListView
    ? ['broker notes', 'real estate crm blog', 'independent realtors commentary']
    : currentPost
      ? [currentPost.category.toLowerCase(), `${currentPost.slug.replace(/-/g, ' ')}`, 'real estate blog']
      : ['real estate blog'];

  useSEO({
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
    ogType: 'article',
    category: currentPost?.category || 'Productivity',
    author: currentPost?.author,
    publishDate: currentPost?.publishDate
  }, [blogSlug, currentPost]);

  if (isListView) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        
        {/* Blog Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold text-primary font-display tracking-tight">
            Broker Notes &amp; Industry Commentary
          </h1>
          <p className="text-gray-500 text-sm">
            Low-frequency updates on CRM software changes, commission rules, and independent agency statistics.
          </p>
        </div>

        {/* Blogs List */}
        <div className="space-y-6">
          {blogs.map((blog) => (
            <div 
              key={blog.id}
              onClick={() => onNavigate(`/blog/${blog.slug}`)}
              className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-accent hover:shadow-sm cursor-pointer transition flex flex-col md:flex-row justify-between gap-6"
            >
              <div className="space-y-3 flex-grow">
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="bg-primary/5 text-primary font-bold px-2 py-0.5 rounded-full uppercase">
                    {blog.category}
                  </span>
                  <span className="text-gray-400 font-medium font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {blog.publishDate}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-primary font-display leading-tight">
                  {blog.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {blog.excerpt}
                </p>
              </div>

              <div className="shrink-0 flex items-end md:items-center text-xs text-accent font-bold">
                Read Notes &rarr;
              </div>
            </div>
          ))}
        </div>

      </div>
    );
  }

  // Selected blog post detail
  if (!currentPost) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <FileText className="w-12 h-12 text-accent mx-auto" />
        <h2 className="text-2xl font-bold text-primary font-display">Notes Post Not Found</h2>
        <p className="text-gray-500 text-sm">The notes commentary article you requested does not exist or has been edited in the CMS.</p>
        <button onClick={() => onNavigate('/blog')} className="px-4 py-2 bg-primary text-white font-bold rounded-xl text-xs">
          Return to blog index
        </button>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Return button */}
      <button 
        onClick={() => onNavigate('/blog')}
        className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-primary cursor-pointer transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Return to blog index
      </button>

      {/* Blog Detail Header */}
      <div className="space-y-4">
        <span className="text-xs bg-primary/5 text-primary font-bold px-2.5 py-0.5 rounded-full uppercase">
          {currentPost.category}
        </span>
        
        <h1 className="text-3xl md:text-5xl font-extrabold text-primary font-display leading-tight tracking-tight">
          {currentPost.title}
        </h1>

        <div className="flex items-center gap-4 text-xs text-gray-400 pt-1 pb-4 border-b border-gray-100 font-medium">
          <span className="flex items-center gap-1">
            <User className="w-4 h-4" /> By {currentPost.author}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" /> Published: {currentPost.publishDate}
          </span>
        </div>
      </div>

      {/* Blog content */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xs">
        <Markdown content={currentPost.content} />
      </div>

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
