import { useParams, useNavigate } from 'react-router-dom';
import { useBlog } from '../hooks/useBlog';
import { useLanguage } from '../context/LanguageContext';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

export function BlogPostRoute() {
  const { slug } = useParams<{ slug: string }>();
  const { blogPosts, loading } = useBlog();
  const { language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen bg-arhos-cream flex items-center justify-center">Loading...</div>;
  }

  const posts = language === 'en' ? blogPosts.en : blogPosts.sk;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-arhos-cream flex flex-col items-center justify-center">
        <h1 className="font-display text-4xl mb-4">Článok nenájdený</h1>
        <button onClick={() => navigate('/blog')} className="text-arhos-terracotta underline">Späť na blog</button>
      </div>
    );
  }

  // Format date
  const formattedDate = new Date(post.date).toLocaleDateString(language === 'en' ? 'en-US' : 'sk-SK', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <>
      <Helmet>
        <title>{post.title} | ARHOS ATELIER</title>
        <meta name="description" content={post.content.split('\n')[0].substring(0, 155)} />
        <meta name="keywords" content={post.seoKeywords} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.content.split('\n')[0].substring(0, 155)} />
        <meta property="og:image" content={`https://arhos.sk${post.coverImage}`} />
        <meta property="og:type" content="article" />
      </Helmet>

      <main className="min-h-screen bg-white pt-24 pb-20">
        <article className="max-w-3xl mx-auto px-6">
          {/* Back button */}
          <button 
            onClick={() => navigate('/blog')}
            className="font-sans text-sm text-arhos-gray hover:text-arhos-terracotta transition-colors mb-12 flex items-center gap-2"
          >
            ← {language === 'en' ? 'Back to Journal' : 'Späť na magazín'}
          </button>

          {/* Header */}
          <header className="mb-12">
            <div className="font-sans text-sm tracking-widest text-arhos-terracotta uppercase mb-4">
              {formattedDate}
            </div>
            <h1 className="font-display font-bold text-[clamp(32px,5vw,56px)] leading-[1.1] text-arhos-black mb-8">
              {post.title}
            </h1>
          </header>

          {/* Cover Image */}
          <figure className="mb-16 aspect-[16/9] overflow-hidden bg-arhos-cream">
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </figure>

          {/* Content */}
          <div className="font-sans text-arhos-gray text-lg leading-relaxed space-y-6 prose prose-lg prose-p:text-arhos-gray">
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <hr className="my-16 border-arhos-cream" />
          
          {/* Footer Navigation */}
          <div className="flex justify-center">
            <button 
              onClick={() => navigate('/blog')}
              className="px-8 py-4 bg-arhos-black text-white font-display font-medium uppercase tracking-widest hover:bg-arhos-terracotta transition-colors"
            >
              {language === 'en' ? 'More Articles' : 'Ďalšie články'}
            </button>
          </div>
        </article>
      </main>
    </>
  );
}
