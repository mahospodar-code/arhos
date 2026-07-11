import { Container, Reveal, SectionHead } from './ui';

const STEPS = [
  {
    n: '01',
    title: 'Úvodná konzultácia',
    text: 'Nezáväzne si povieme o vašom zámere, pozemku a rozpočte. Zistíte, čo je reálne a čo by sme vám odporučili.',
  },
  {
    n: '02',
    title: 'Architektonická štúdia',
    text: 'Koncept, dispozície a vizualizácie. Iterujeme, kým návrh nesedí vášmu životu aj rozpočtu.',
  },
  {
    n: '03',
    title: 'Povolenia a inžiniering',
    text: 'Pripravíme dokumentáciu a vybavíme vyjadrenia aj stavebné povolenie. Úrady sú naša práca, nie vaša.',
  },
  {
    n: '04',
    title: 'Realizačný projekt',
    text: 'Výkresy a detaily, podľa ktorých sa stavia bez dohadov — a výkaz výmer, s ktorým férovo porovnáte ponuky stavebníkov.',
  },
  {
    n: '05',
    title: 'Stavba a autorský dozor',
    text: 'Strážime, aby sa postavilo presne to, čo je navrhnuté. Kvalita, materiály a detail pod dohľadom architekta.',
  },
];

export default function Process() {
  return (
    <section id="proces" className="scroll-mt-20 py-24 md:py-32">
      <Container>
        <SectionHead
          index="04"
          label="Ako to prebieha"
          wide
          title={
            <>
              Päť krokov od zámeru <span className="serif-accent text-acc">k realizácii.</span>
            </>
          }
        />
        <div className="mt-16 grid gap-12 border-t border-line md:grid-cols-5 md:gap-8">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 90}>
              <div className="relative pt-8">
                {/* zárez na kótovacej čiare */}
                <span className="absolute top-0 left-0 h-4 w-px bg-ink/40" aria-hidden />
                <span className="serif-accent text-4xl text-acc">{s.n}</span>
                <h3 className="mt-4 font-disp text-[17px] font-semibold leading-snug">{s.title}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-mut">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="label mt-14 flex items-center gap-3">
            <span className="h-1.5 w-1.5 bg-acc" aria-hidden />
            Rozsah a cenu každej fázy poznáte vopred — žiadne prekvapenia
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
