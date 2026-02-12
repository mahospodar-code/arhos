import { useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import { useLanguage } from '../context/LanguageContext';

export function ManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const { t } = useLanguage();

  // Load animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      // Headline lines stagger
      const lines = headlineRef.current?.querySelectorAll('.headline-line');
      if (lines) {
        tl.fromTo(
          lines,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out' }
        );
      }



      // CTA
      tl.fromTo(
        ctaRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
        '-=0.2'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [t]); // Re-run animation if language changes (text changes)

  // Scroll animation (Parallax / Fade out without pinning)
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Create a timeline that scrub-animates based on scroll position
      // removing "pin: true" allows natural scrolling
      gsap.to(headlineRef.current, {
        y: -100, // Move up slightly
        opacity: 0, // Fade out
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top", // Animate over the height of the section
          scrub: true,
        }
      });

      gsap.to(ctaRef.current, {
        y: -50,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "center top",
          scrub: true,
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero_architecture.jpg"
          alt="Architecture"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Headline */}
      <div ref={headlineRef} className="text-center z-10 relative">
        <h1 className="font-display font-medium text-white tracking-tight">
          {t.manifesto.headline.map((line, index) => (
            <span key={index} className="headline-line block text-[clamp(28px,5.5vw,64px)] leading-[1.2]">
              {line}
            </span>
          ))}
        </h1>
      </div>

      {/* CTA */}
      <button
        ref={ctaRef}
        onClick={scrollToProjects}
        className="mt-8 text-sm font-display font-medium text-white hover:text-white/80 transition-colors flex items-center gap-2 group z-10 relative"
      >
        {t.manifesto.cta}
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
    </section>
  );
}