import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useBlog } from '../hooks/useBlog';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

interface BlogSectionProps {
  limit?: number; // How many posts to show
}

export function BlogSection({ limit }: BlogSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const { blogPosts, loading } = useBlog();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const posts = language === 'en' ? blogPosts.en : blogPosts.sk;
  // Sort by date descending
  const sortedPosts = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const displayPosts = limit ? sortedPosts.slice(0, limit) : sortedPosts;

  useLayoutEffect(() => {
    if (loading || displayPosts.length === 0) return;

    const section = sectionRef.current;
    const header = headerRef.current;
    const grid = gridRef.current;
    if (!section || !header || !grid) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        header,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: header,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards animation
      const cards = grid.querySelectorAll('.blog-card');
      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            delay: index * 0.1,
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, [loading, displayPosts.length]);

  if (loading || displayPosts.length === 0) return null;

  return (
    <section ref={sectionRef} id="blog" className="relative w-full bg-white py-[10vh] px-6 lg:px-[6vw]">
      {/* Header */}
      <div ref={headerRef} className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6">
        <h2 className="font-display font-bold text-[clamp(32px,4vw,48px)] text-arhos-black">
          {language === 'en' ? 'Journal & Process' : 'Magazín & Proces'}
        </h2>
        {limit && (
          <button 
            onClick={() => navigate('/blog')}
            className="text-arhos-terracotta font-sans font-medium text-sm hover:underline"
          >
            {language === 'en' ? 'View all articles →' : 'Zobraziť všetky články →'}
          </button>
        )}
      </div>

      {/* Grid */}
      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[clamp(24px,2.5vw,40px)]">
        {displayPosts.map((post) => (
          <article
            key={post.id}
            onClick={() => navigate(`/blog/${post.slug}`)}
            className="blog-card group cursor-pointer flex flex-col h-full"
          >
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden mb-5">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 font-sans text-xs font-semibold text-arhos-black">
                {new Date(post.date).toLocaleDateString(language === 'en' ? 'en-US' : 'sk-SK', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow">
              <h3 className="font-display font-bold text-xl text-arhos-black mb-3 group-hover:text-arhos-terracotta transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="font-sans text-arhos-gray text-sm line-clamp-3 mb-4 flex-grow">
                {post.content.split('\n')[0]} {/* Show first paragraph as excerpt */}
              </p>
              <div className="font-sans text-xs font-bold text-arhos-black uppercase tracking-wider group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                {language === 'en' ? 'Read article' : 'Čítať článok'} <span className="text-arhos-terracotta">→</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
