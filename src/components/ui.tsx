import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

/* ---------- dekor: zrno papiera + zvislé vodiace linky výkresu ---------- */

const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.72'/></svg>\")";

export function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] opacity-[0.05] mix-blend-multiply"
      style={{ backgroundImage: NOISE }}
    />
  );
}

export function GridGuides() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 hidden md:block">
      <div className="mx-auto grid h-full max-w-[1440px] grid-cols-4 px-6 lg:px-12">
        <div className="border-l border-ink/[0.05]" />
        <div className="border-l border-ink/[0.05]" />
        <div className="border-l border-ink/[0.05]" />
        <div className="border-x border-ink/[0.05]" />
      </div>
    </div>
  );
}

/* ---------- reveal pri skrolovaní ---------- */

export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`reveal ${inView ? 'is-in' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

/* ---------- hlavička sekcie v štýle titulného bloku výkresu ---------- */

export function SectionHead({
  index,
  label,
  title,
  dark = false,
  wide = false,
}: {
  index: string;
  label: string;
  title?: ReactNode;
  dark?: boolean;
  wide?: boolean;
}) {
  return (
    <Reveal>
      <div
        className={`flex items-baseline justify-between border-t pt-5 ${
          dark ? 'border-paper/15' : 'border-line'
        }`}
      >
        <span className={dark ? 'label-paper' : 'label'}>{label}</span>
        <span className={dark ? 'label-paper' : 'label'}>[ {index} ]</span>
      </div>
      {title && (
        <h2
          className={`mt-10 font-disp text-[clamp(2.1rem,4.6vw,4.3rem)] font-medium leading-[1.04] tracking-[-0.02em] ${
            wide ? 'md:whitespace-nowrap' : 'max-w-[24ch]'
          } ${dark ? 'text-paper' : 'text-ink'}`}
        >
          {title}
        </h2>
      )}
    </Reveal>
  );
}

/* ---------- ikony ---------- */

export const Arrow = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={`h-[1em] w-[1em] ${className}`} aria-hidden>
    <path d="M3 12h17m0 0-6.5-6.5M20 12l-6.5 6.5" stroke="currentColor" strokeWidth="1.7" />
  </svg>
);

export const PhoneIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={`h-[1.1em] w-[1.1em] ${className}`} aria-hidden>
    <path
      d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);

export const WhatsAppIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`h-[1.15em] w-[1.15em] ${className}`} aria-hidden>
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 1 1-4.2 15.3l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8Zm-3.1 4c-.2 0-.5 0-.7.3-.2.3-.9.9-.9 2.1 0 1.3.9 2.5 1 2.7.1.2 1.8 2.9 4.5 4 2.2.9 2.7.7 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3l-1.7-.8c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.4-3c-.1-.2 0-.4.1-.5l.5-.6c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5L10 8.2c-.2-.4-.4-.4-.6-.4h-.5Z" />
  </svg>
);

/* ---------- logo ---------- */

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 151.44 183.76"
        className="h-8 w-auto shrink-0"
        fill="currentColor"
        aria-hidden="true"
      >
        <rect x="0.12" y="164.09" width="151.19" height="19.52" />
        <polygon points="151.19 144.93 122.95 144.89 75.79 54.42 75.72 54.29 28.49 144.89 0.25 144.93 75.72 0.32 151.19 144.93" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-disp text-[17px] font-bold tracking-[0.22em]">ARHOS</span>
        <span className="mt-[5px] font-disp text-[8.5px] tracking-[0.58em] opacity-60">
          ATELIÉR
        </span>
      </span>
    </span>
  );
}

/* ---------- CTA tlačidlá ---------- */

const btnBase =
  'group inline-flex cursor-pointer items-center justify-center gap-3 px-7 py-4 font-disp text-[12.5px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300';

const btnVariants = {
  ink: 'bg-ink text-paper hover:bg-acc',
  paper: 'bg-paper text-ink hover:bg-acc hover:text-paper',
  ghost: 'border border-ink/30 text-ink hover:border-acc hover:text-acc',
  ghostPaper: 'border border-paper/30 text-paper hover:border-acc hover:text-acc',
} as const;

export function CTALink({
  to,
  children,
  variant = 'ink',
  className = '',
  small = false,
}: {
  to: string;
  children: ReactNode;
  variant?: keyof typeof btnVariants;
  className?: string;
  small?: boolean;
}) {
  const cls = `${btnBase} ${btnVariants[variant]} ${small ? '!px-5 !py-3' : ''} ${className}`;
  const arrow = <Arrow className="transition-transform duration-300 group-hover:translate-x-1.5" />;
  if (to.startsWith('#')) {
    return (
      <a href={to} className={cls}>
        {children} {arrow}
      </a>
    );
  }
  return (
    <Link to={to} className={cls}>
      {children} {arrow}
    </Link>
  );
}

export function CTAButton({
  children,
  variant = 'paper',
  disabled = false,
}: {
  children: ReactNode;
  variant?: keyof typeof btnVariants;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`${btnBase} ${btnVariants[variant]} disabled:cursor-wait disabled:opacity-60`}
    >
      {children}
      <Arrow className="transition-transform duration-300 group-hover:translate-x-1.5" />
    </button>
  );
}

/* ---------- kontajner ---------- */

export function Container({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto max-w-[1440px] px-6 lg:px-12 ${className}`}>{children}</div>;
}
