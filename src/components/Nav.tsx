import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo, CTALink, Container } from './ui';
import { SITE } from '../data/site';

const LINKS = [
  { label: 'Projekty', hash: 'projekty' },
  { label: 'Služby', hash: 'sluzby' },
  { label: 'Proces', hash: 'proces' },
  { label: 'Ateliér', hash: 'atelier' },
  { label: 'Kontakt', hash: 'kontakt' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const home = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  const href = (hash: string) => (home ? `#${hash}` : `/#${hash}`);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        open
          ? 'bg-transparent text-paper'
          : scrolled
            ? 'border-b border-line bg-paper/85 text-ink backdrop-blur-md'
            : 'bg-transparent text-ink'
      }`}
    >
      <Container className="flex h-[76px] items-center justify-between">
        <Link
          to="/"
          aria-label="ARHOS ateliér — domov"
          onClick={() => setOpen(false)}
          className="relative z-[60]"
        >
          <Logo />
        </Link>

        <nav className="hidden items-center gap-9 lg:flex" aria-label="Hlavná navigácia">
          {LINKS.slice(0, 4).map((l) => (
            <a
              key={l.hash}
              href={href(l.hash)}
              className="font-disp text-[13px] uppercase tracking-[0.14em] transition-colors hover:text-acc"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-7 lg:flex">
          <a
            href={SITE.phoneHref}
            className="font-disp text-[13px] tracking-[0.06em] transition-colors hover:text-acc"
          >
            {SITE.phoneDisplay}
          </a>
          <CTALink to={home ? '#kontakt' : '/#kontakt'} small>
            Konzultácia
          </CTALink>
        </div>

        {/* mobil: hamburger */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? 'Zavrieť menu' : 'Otvoriť menu'}
          className="relative z-[60] flex h-11 w-11 cursor-pointer flex-col items-center justify-center gap-[7px] lg:hidden"
        >
          <span
            className={`block h-[2px] w-7 bg-current transition-transform duration-300 ${
              open ? 'translate-y-[4.5px] rotate-45' : ''
            }`}
          />
          <span
            className={`block h-[2px] w-7 bg-current transition-transform duration-300 ${
              open ? '-translate-y-[4.5px] -rotate-45' : ''
            }`}
          />
        </button>
      </Container>

      {/* mobilné menu */}
      <div
        className={`fixed inset-0 z-40 flex flex-col bg-ink text-paper transition-opacity duration-300 lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <Container className="flex h-full flex-col pt-[100px] pb-10">
          <nav className="flex flex-col gap-1" aria-label="Mobilná navigácia">
            {LINKS.map((l, i) => (
              <a
                key={l.hash}
                href={href(l.hash)}
                onClick={() => setOpen(false)}
                className="group flex items-baseline gap-4 border-b border-paper/10 py-5"
              >
                <span className="label-paper">0{i + 1}</span>
                <span className="font-disp text-3xl tracking-tight transition-colors group-hover:text-acc">
                  {l.label}
                </span>
              </a>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-3">
            <span className="label-paper">Ozvite sa</span>
            <a href={SITE.phoneHref} className="font-disp text-xl">
              {SITE.phoneDisplay}
            </a>
            <a href={`mailto:${SITE.email}`} className="font-disp text-lg text-paper/70">
              {SITE.email}
            </a>
            <span className="label-paper mt-4">{SITE.cities}</span>
          </div>
        </Container>
      </div>
    </header>
  );
}
