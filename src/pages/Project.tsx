import { Link, useParams } from 'react-router-dom';
import { Arrow, Container, CTALink, Reveal } from '../components/ui';
import { areaLabel, cld, cover, projects } from '../data/site';
import { useMeta } from '../hooks/useMeta';

export default function ProjectPage() {
  const { id } = useParams();
  const idx = projects.findIndex((x) => String(x.id) === id);
  const p = idx >= 0 ? projects[idx] : undefined;

  useMeta(
    p
      ? {
          title: `${p.title} — ${p.location} | ARHOS ateliér`,
          description: `${p.description.replace(/\s+/g, ' ').slice(0, 152).trimEnd()}…`,
          path: `/projekt/${p.id}`,
          image: cld(cover(p), 1200),
        }
      : {
          title: 'Projekt sa nenašiel — ARHOS ateliér',
          description: 'Hľadaný projekt neexistuje. Pozrite si vybrané projekty ateliéru ARHOS.',
          path: '/',
        },
  );

  if (!p) {
    return (
      <Container className="pt-[160px] pb-24">
        <p className="label">Projekt sa nenašiel</p>
        <Link to="/" className="mt-6 inline-flex items-center gap-3 font-disp text-xl hover:text-acc">
          Späť na úvod <Arrow />
        </Link>
      </Container>
    );
  }

  const next = projects[(idx + 1) % projects.length];
  const gallery = p.images.filter((img) => img !== cover(p));
  const meta: [string, string][] = [
    ['Lokalita', p.location],
    ['Rok', p.year],
    ['Plocha', areaLabel(p) ?? '—'],
    ['Kategória', p.category],
  ];

  return (
    <article className="pt-[120px] md:pt-[150px]">
      <Container>
        <Reveal>
          <Link
            to="/#projekty"
            className="label group inline-flex items-center gap-3 transition-colors hover:!text-acc"
          >
            <Arrow className="rotate-180 transition-transform group-hover:-translate-x-1.5" />
            Všetky projekty
          </Link>
          <h1 className="mt-8 max-w-[18ch] font-disp text-[clamp(2.3rem,5.4vw,4.9rem)] font-medium leading-[1.02] tracking-[-0.02em]">
            {p.title}
          </h1>
        </Reveal>

        <Reveal className="mt-12">
          <dl className="grid grid-cols-2 border-y border-line md:grid-cols-4 md:divide-x md:divide-line">
            {meta.map(([k, v], i) => (
              <div key={k} className={`py-5 ${i > 0 ? 'md:pl-8' : ''}`}>
                <dt className="label">{k}</dt>
                <dd className="mt-2 font-disp text-lg font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal className="mt-12">
          <img
            src={cld(cover(p), 1600)}
            alt={`${p.title} — hlavný záber`}
            width={1600}
            height={900}
            fetchPriority="high"
            className="aspect-[16/9] w-full bg-paper2 object-cover"
          />
        </Reveal>

        <div className="mt-16 grid grid-cols-12 md:mt-24 md:gap-x-10">
          <div className="col-span-12 md:col-span-3">
            <Reveal>
              <span className="label">O projekte</span>
            </Reveal>
          </div>
          <div className="col-span-12 mt-6 md:col-span-8 md:mt-0">
            <Reveal>
              <p className="max-w-[70ch] text-[16.5px] leading-[1.85] text-ink/85 whitespace-pre-line">
                {p.description}
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-24 md:gap-8">
          {gallery.map((img, i) => {
            const wide = i % 5 === 4;
            return (
              <Reveal key={img} className={wide ? 'sm:col-span-2' : ''} delay={(i % 2) * 90}>
                <img
                  src={cld(img, wide ? 1600 : 1000)}
                  alt={`${p.title} — fotografia ${i + 2}`}
                  loading="lazy"
                  className={`w-full bg-paper2 object-cover ${wide ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}
                />
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-20 md:mt-28">
          <div className="flex flex-col items-start justify-between gap-8 border-t border-line py-14 md:flex-row md:items-center">
            <p className="serif-accent max-w-[24ch] text-3xl text-ink md:text-4xl">
              Predstavujete si niečo podobné?
            </p>
            <CTALink to="/#kontakt">Nezáväzná konzultácia</CTALink>
          </div>
        </Reveal>

        <Reveal>
          <Link
            to={`/projekt/${next.id}`}
            className="group flex items-baseline justify-between gap-6 border-t border-line py-10 md:py-14"
          >
            <span>
              <span className="label">Ďalší projekt</span>
              <span className="mt-3 block font-disp text-2xl font-medium tracking-tight transition-colors group-hover:text-acc md:text-4xl">
                {next.title}
              </span>
            </span>
            <Arrow className="shrink-0 text-2xl transition-transform duration-300 group-hover:translate-x-2 md:text-4xl" />
          </Link>
        </Reveal>
      </Container>
    </article>
  );
}
