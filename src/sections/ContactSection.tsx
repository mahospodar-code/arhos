import { useRef, useLayoutEffect, useState, type FormEvent } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-reveal',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [t]);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full bg-arhos-black text-white py-[15vh] px-6 lg:px-[12vw] overflow-hidden"
    >
      {/* Background SVG - Aligned with text */}
      <div className="absolute top-1/2 left-6 lg:left-[12vw] -translate-y-1/2 w-full lg:w-[45%] h-[80%] z-0 flex items-center justify-start opacity-10 pointer-events-none">
        <img
          src="/images/logo%20arhos-01.svg"
          alt=""
          className="w-full h-full object-contain object-left filter brightness-0 invert"
        />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
        {/* Contact Info */}
        <div>
          <h2 className="contact-reveal font-display font-bold text-[clamp(32px,4vw,56px)] leading-[1.1] mb-12">
            {t.contact.headline}
          </h2>

          <div className="contact-reveal space-y-8">
            <div>
              <p className="font-display text-sm text-white/50 mb-2 uppercase tracking-wider">Email</p>
              <a href={`mailto:${t.contact.email}`} className="font-sans text-xl lg:text-2xl hover:text-arhos-terracotta transition-colors">
                {t.contact.email}
              </a>
            </div>
            <div>
              <p className="font-display text-sm text-white/50 mb-2 uppercase tracking-wider">Telefón</p>
              <a href={`tel:${t.contact.phone.replace(/\s/g, '')}`} className="font-sans text-xl lg:text-2xl hover:text-arhos-terracotta transition-colors">
                {t.contact.phone}
              </a>
            </div>
            <div>
              <p className="font-display text-sm text-white/50 mb-2 uppercase tracking-wider">Adresa</p>
              <p className="font-sans text-xl lg:text-2xl">
                {t.contact.address}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-reveal bg-white/5 p-8 lg:p-10 backdrop-blur-sm mt-8 lg:mt-0">
          <form onSubmit={handleSubmit} className="space-y-5">
            <p className="font-sans text-white/80 text-sm leading-relaxed mb-6 italic">
              {t.contact.form.intro}
            </p>

            <div className="space-y-1.5">
              <label htmlFor="name" className="font-display text-xs text-white/60 ml-1 uppercase tracking-wider">{t.contact.form.name}</label>
              <Input
                id="name"
                placeholder={t.contact.form.name}
                required
                className="bg-transparent border-white/20 text-white placeholder:text-white/30 h-10 focus:border-arhos-terracotta focus:ring-0 rounded-none transition-colors"
                autoComplete="off"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="email" className="font-display text-xs text-white/60 ml-1 uppercase tracking-wider">{t.contact.form.email}</label>
              <Input
                id="email"
                type="email"
                placeholder="hello@example.com"
                required
                className="bg-transparent border-white/20 text-white placeholder:text-white/30 h-10 focus:border-arhos-terracotta focus:ring-0 rounded-none transition-colors"
                autoComplete="off"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="message" className="font-display text-xs text-white/60 ml-1 uppercase tracking-wider">{t.contact.form.message}</label>
              <Textarea
                id="message"
                placeholder={t.contact.form.message}
                required
                rows={6}
                className="bg-transparent border-white/20 text-white placeholder:text-white/30 resize-none focus:border-arhos-terracotta focus:ring-0 rounded-none transition-colors"
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitted}
              className="w-full bg-arhos-terracotta hover:bg-arhos-terracotta/90 text-white font-display font-medium h-12 rounded-none transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01] mt-2"
            >
              {isSubmitted ? t.contact.form.sent : t.contact.form.submit}
            </Button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="contact-reveal mt-32 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
        <p className="font-sans">&copy; {new Date().getFullYear()} ARHOS. {t.contact.footer.rights}</p>
        <div className="flex gap-6 font-sans">
          <a href="#" className="hover:text-white transition-colors">{t.contact.footer.privacy}</a>
        </div>
      </footer>
    </section>
  );
}