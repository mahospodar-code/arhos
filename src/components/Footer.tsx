import { Link } from 'react-router-dom';
import { Container, Logo } from './ui';
import { SITE } from '../data/site';

const NAV = [
  { label: 'Projekty', hash: 'projekty' },
  { label: 'Služby', hash: 'sluzby' },
  { label: 'Proces', hash: 'proces' },
  { label: 'Ateliér', hash: 'atelier' },
  { label: 'Kontakt', hash: 'kontakt' },
];

export default function Footer() {
  return (
    <footer className="border-t border-paper/10 bg-ink pb-28 text-paper md:pb-10">
      <Container className="pt-16">
        <div className="grid grid-cols-12 gap-y-12">
          <div className="col-span-12 md:col-span-4">
            <Link to="/" aria-label="ARHOS ateliér — domov">
              <Logo />
            </Link>
            <p className="mt-6 max-w-[36ch] text-[14px] leading-relaxed text-paper/55">
              Architektonický ateliér pre rodinné domy, interiéry a rekonštrukcie.
            </p>
          </div>
          <div className="col-span-6 md:col-span-3 md:col-start-6">
            <h4 className="label-paper mb-5">Menu</h4>
            <ul className="space-y-3">
              {NAV.map((n) => (
                <li key={n.hash}>
                  <a
                    href={`/#${n.hash}`}
                    className="font-disp text-[14px] text-paper/75 transition-colors hover:text-acc"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-6 md:col-span-4 md:col-start-9">
            <h4 className="label-paper mb-5">Kontakt</h4>
            <ul className="space-y-3 text-[14px] text-paper/75">
              <li>
                <a href={SITE.phoneHref} className="transition-colors hover:text-acc">
                  {SITE.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-acc">
                  {SITE.email}
                </a>
              </li>
              <li className="text-paper/55">{SITE.cities}</li>
              <li className="flex gap-6 pt-2">
                <a
                  href={SITE.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-acc"
                >
                  Instagram ↗
                </a>
                <a
                  href={SITE.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-acc"
                >
                  Facebook ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          aria-hidden
          className="wordmark-outline mt-16 select-none text-center font-disp text-[clamp(4.5rem,16.5vw,15rem)] font-bold leading-[0.85] tracking-[0.03em]"
        >
          ARHOS
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-paper/10 pt-6 md:flex-row md:items-center">
          <p className="label-paper !tracking-[0.18em]">
            © 2026 ARHOS ateliér — všetky práva vyhradené
          </p>
          <p className="label-paper !tracking-[0.18em]">Ochrana súkromia</p>
        </div>
      </Container>
    </footer>
  );
}
