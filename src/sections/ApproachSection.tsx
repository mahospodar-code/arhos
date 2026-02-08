import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export function ApproachSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useLanguage();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Title & Text animation
      gsap.fromTo(
        '.approach-text',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // List items animation
      gsap.fromTo(
        '.service-item',
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.services-list',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [t]);

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="approach"
      className="relative w-full bg-white py-[15vh] px-6 lg:px-[12vw]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-32">
        {/* Text Content */}
        <div className="flex flex-col justify-center">
          <h2 className="approach-text font-display font-bold text-[clamp(32px,4vw,48px)] text-arhos-black mb-8 leading-[1.1]">
            {t.approach.title}
          </h2>
          <p className="approach-text font-sans text-lg lg:text-xl text-arhos-gray leading-relaxed max-w-lg mb-12">
            {t.approach.description}
          </p>

          <div className="approach-text">
            <button
              onClick={scrollToContact}
              className="group inline-flex items-center gap-2 text-sm font-display font-medium text-arhos-black hover:text-arhos-terracotta transition-colors"
            >
              {t.approach.cta}
              <svg
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Services List */}
        <div className="services-list flex flex-col justify-center border-l border-arhos-black/10 pl-8 lg:pl-16">
          <ul className="space-y-6">
            {t.approach.services.map((service, index) => (
              <li
                key={index}
                className="service-item font-display text-xl lg:text-2xl text-arhos-black font-medium"
              >
                {service}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}