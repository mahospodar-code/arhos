import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useLanguage } from '../context/LanguageContext';

interface NavigationProps {
  onCloseProject?: () => void;
}

export function Navigation({ onCloseProject }: NavigationProps) {
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    // Initial animation
    const ctx = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.3, ease: 'power3.out' }
      );
    }, navRef); // Add scope

    return () => {
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      gsap.fromTo(
        mobileMenuRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileMenuOpen]);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    if (onCloseProject) onCloseProject(); // Close project detail if open

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-[102] transition-all duration-500 bg-arhos-cream/90 backdrop-blur-sm"
    >
      <div className="w-full px-6 lg:px-12 py-5 flex items-center justify-between relative z-[101]">
        {/* Logo */}
        <button
          onClick={() => {
            setIsMobileMenuOpen(false);
            if (onCloseProject) onCloseProject(); // Close project detail if open

            const manifesto = document.getElementById('manifesto');
            if (manifesto) {
              manifesto.scrollIntoView({ behavior: 'smooth' });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="group transition-opacity hover:opacity-100"
        >
          <img
            src="/images/logo-arhos.png"
            alt="ARHOS"
            className="h-8 md:h-10 w-auto transition-all duration-300 filter grayscale brightness-0 hover:filter-none hover:grayscale-0 hover:brightness-100"
          />
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection('projects')}
            className="text-sm font-display font-medium text-arhos-black hover:text-arhos-terracotta transition-colors relative group"
          >
            {t.nav.projects}
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-arhos-terracotta transition-all duration-300 group-hover:w-full" />
          </button>
          <button
            onClick={() => scrollToSection('approach')}
            className="text-sm font-display font-medium text-arhos-black hover:text-arhos-terracotta transition-colors relative group"
          >
            {t.nav.studio}
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-arhos-terracotta transition-all duration-300 group-hover:w-full" />
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="text-sm font-display font-medium text-arhos-black hover:text-arhos-terracotta transition-colors relative group"
          >
            {t.nav.contact}
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-arhos-terracotta transition-all duration-300 group-hover:w-full" />
          </button>

          {/* Language Switcher */}
          <div className="flex items-center gap-2 ml-4 border-l border-arhos-black/20 pl-6">
            <button
              onClick={() => setLanguage('sk')}
              className={`text-sm font-display transition-colors ${language === 'sk' ? 'font-bold text-arhos-black' : 'font-medium text-arhos-gray hover:text-arhos-black'}`}
            >
              SK
            </button>
            <span className="text-arhos-black/40 text-xs">|</span>
            <button
              onClick={() => setLanguage('en')}
              className={`text-sm font-display transition-colors ${language === 'en' ? 'font-bold text-arhos-black' : 'font-medium text-arhos-gray hover:text-arhos-black'}`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-arhos-black"
        >
          <div className="w-6 h-5 relative flex flex-col justify-between">
            <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-0 bg-arhos-cream/90 backdrop-blur-sm z-[90] flex flex-col items-center justify-center md:hidden pt-20"
        >
          <div className="flex flex-col gap-6 text-center">
            <button
              onClick={() => scrollToSection('projects')}
              className="text-lg font-display font-medium text-arhos-black hover:text-arhos-terracotta transition-colors uppercase tracking-widest"
            >
              {t.nav.projects || 'Projekty'}
            </button>
            <button
              onClick={() => scrollToSection('approach')}
              className="text-lg font-display font-medium text-arhos-black hover:text-arhos-terracotta transition-colors uppercase tracking-widest"
            >
              {t.nav.studio || 'Ateliér'}
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-lg font-display font-medium text-arhos-black hover:text-arhos-terracotta transition-colors uppercase tracking-widest"
            >
              {t.nav.contact || 'Kontakt'}
            </button>

            {/* Mobile Language Switcher */}
            <div className="flex items-center justify-center gap-4 mt-8 pt-8 border-t border-arhos-black/10 w-24 mx-auto">
              <button
                onClick={() => { setLanguage('sk'); setIsMobileMenuOpen(false); }}
                className={`text-sm font-display transition-colors ${language === 'sk' ? 'font-bold text-arhos-black' : 'font-medium text-arhos-gray'}`}
              >
                SK
              </button>
              <span className="text-arhos-black/40 text-xs">|</span>
              <button
                onClick={() => { setLanguage('en'); setIsMobileMenuOpen(false); }}
                className={`text-sm font-display transition-colors ${language === 'en' ? 'font-bold text-arhos-black' : 'font-medium text-arhos-gray'}`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}