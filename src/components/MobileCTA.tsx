import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PhoneIcon } from './ui';
import { SITE } from '../data/site';

/** Mobilná lišta s CTA — skryje sa, keď je na obrazovke kontaktná sekcia. */
export default function MobileCTA() {
  const [hidden, setHidden] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setHidden(false);
    const el = document.getElementById('kontakt');
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setHidden(e.isIntersecting), {
      threshold: 0.12,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [pathname]);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 md:hidden ${
        hidden ? 'translate-y-full' : ''
      }`}
    >
      <div className="grid grid-cols-2 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
        <a
          href={SITE.phoneHref}
          className="flex items-center justify-center gap-2.5 py-4 font-disp text-[12px] uppercase tracking-[0.15em] text-ink"
        >
          <PhoneIcon /> Zavolať
        </a>
        <Link
          to="/#kontakt"
          className="flex items-center justify-center gap-2.5 bg-ink py-4 font-disp text-[12px] uppercase tracking-[0.15em] text-paper"
        >
          Konzultácia
        </Link>
      </div>
    </div>
  );
}
