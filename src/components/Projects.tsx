import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Arrow, Container, CTALink, Reveal, SectionHead } from './ui';
import { areaLabel, cld, cover, projects, type Project } from '../data/site';

function ProjectCard({
  p,
  ratio,
  w,
  idx,
}: {
  p: Project;
  ratio: string;
  w: number;
  idx: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const wrap = wrapRef.current;
    const pill = pillRef.current;
    if (!wrap || !pill) return;
    const r = wrap.getBoundingClientRect();
    pill.style.left = `${e.clientX - r.left}px`;
    pill.style.top = `${e.clientY - r.top}px`;
  };

  return (
    <Link to={`/projekt/${p.id}`} className="group block">
      <Reveal>
        <div
          ref={wrapRef}
          onMouseMove={onMove}
          className={`relative overflow-hidden bg-paper2 ${ratio}`}
        >
          <img
            src={cld(cover(p), w)}
            alt={`${p.title} — ${p.location}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.045]"
          />
          <span className="label absolute top-4 left-4 !text-paper mix-blend-difference">
            {idx}
          </span>
          <div
            ref={pillRef}
            aria-hidden
            className="pointer-events-none absolute hidden -translate-x-1/2 -translate-y-1/2 items-center gap-2 bg-acc px-4 py-2.5 font-disp text-[11px] uppercase tracking-[0.2em] text-paper opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:flex"
          >
            Pozrieť projekt <Arrow />
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-line pt-4">
          <h3 className="font-disp text-xl tracking-tight transition-colors group-hover:text-acc md:text-2xl">
            {p.title}
          </h3>
          <span className="label whitespace-nowrap">
            {p.location} · {p.year}
            {areaLabel(p) ? ` · ${areaLabel(p)}` : ''}
          </span>
        </div>
        <span className="label mt-1.5 block !text-[10px] !text-mut/80">{p.category}</span>
      </Reveal>
    </Link>
  );
}

export default function Projects() {
  return (
    <section id="projekty" className="scroll-mt-20 bg-paper2/50 py-24 md:py-32">
      <Container>
        <SectionHead index="03" label={`Vybrané projekty ( 0${projects.length} )`} />
        <div className="mt-14 grid grid-cols-12 gap-y-14 md:gap-x-10">
          <div className="col-span-12 md:col-span-7">
            <ProjectCard p={projects[0]} ratio="aspect-[4/3]" w={1200} idx="001" />
          </div>
          <div className="col-span-12 md:col-span-5 md:mt-28">
            <ProjectCard p={projects[1]} ratio="aspect-[4/5]" w={900} idx="002" />
          </div>
        </div>

        {/* dlaždica pre budúci projekt klienta */}
        <Reveal className="mt-16">
          <div className="flex flex-col items-start justify-between gap-8 border border-line p-9 md:flex-row md:items-center md:p-12">
            <div>
              <span className="label">Váš projekt — 003</span>
              <p className="serif-accent mt-4 text-3xl text-ink md:text-4xl">
                Tu môže stáť váš dom.
              </p>
            </div>
            <CTALink to="#kontakt" variant="ghost">
              Začnime štúdiou
            </CTALink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
