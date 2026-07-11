import { Reveal, CTALink, Container } from './ui';
import { projects } from '../data/site';

const heroImg = projects[0].images[1].replace(
  '/upload/',
  '/upload/f_auto,q_auto,w_1000,ar_4:5,c_fill,g_south/',
);

export default function Hero() {
  return (
    <section className="relative pt-[130px] pb-16 md:pt-[168px] md:pb-24">
      <Container>
        <div className="grid grid-cols-12 items-end gap-y-16 md:gap-x-10">
          <div className="col-span-12 lg:col-span-7">
            <Reveal>
              <p className="label flex items-center gap-4">
                <span className="inline-block h-px w-10 bg-acc" aria-hidden />
                Architektonický ateliér — Michalovce · Košice · Bratislava
              </p>
            </Reveal>
            <Reveal delay={90}>
              <h1 className="mt-8 font-disp text-[clamp(2.85rem,7vw,6.6rem)] font-medium leading-[0.98] tracking-[-0.025em]">
                Navrhujeme domy,
                <br />v ktorých sa žije{' '}
                <span className="serif-accent tracking-normal text-acc">ľahko.</span>
              </h1>
            </Reveal>
            <Reveal delay={180}>
              <p className="mt-9 max-w-[52ch] text-[17px] leading-relaxed text-mut">
                Racionálna architektúra a autentické interiéry — od prvej skice po kolaudáciu.
                Bez katalógových kompromisov a bez improvizácie na stavbe.
              </p>
            </Reveal>
            <Reveal delay={260}>
              <div className="mt-11 flex flex-wrap items-center gap-4">
                <CTALink to="#kontakt">Nezáväzná konzultácia</CTALink>
                <CTALink to="#projekty" variant="ghost">
                  Pozrieť projekty
                </CTALink>
              </div>
              <p className="label mt-7 !tracking-[0.18em]">
                Odpovieme do 24 hodín — a k ničomu vás to nezaväzuje
              </p>
            </Reveal>
          </div>

          <div className="col-span-12 sm:col-span-10 sm:col-start-2 lg:col-span-5 lg:col-start-8">
            <Reveal delay={220}>
              <figure className="relative">
                <span
                  aria-hidden
                  className="absolute -right-4 -bottom-4 h-full w-full border border-acc/60 md:-right-5 md:-bottom-5"
                />
                <img
                  src={heroImg}
                  alt="Rodinný dom HY v Michalovciach — návrh ateliéru ARHOS"
                  width={1000}
                  height={1250}
                  fetchPriority="high"
                  className="relative aspect-[4/5] w-full bg-paper2 object-cover"
                />
                <figcaption className="relative mt-5">
                  <div className="flex items-baseline justify-between">
                    <span className="label">Rodinný dom HY — Michalovce</span>
                    <span className="label">2026</span>
                  </div>
                  {/* kótovacia čiara ako na výkrese */}
                  <div className="mt-3 flex items-center gap-2 text-ink/40" aria-hidden>
                    <span className="h-3 w-px bg-current" />
                    <span className="h-px flex-1 bg-current" />
                    <span className="font-disp text-[10px] tracking-[0.25em]">190 M²</span>
                    <span className="h-px flex-1 bg-current" />
                    <span className="h-3 w-px bg-current" />
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
