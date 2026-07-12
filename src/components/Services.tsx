import { Arrow, Container, Reveal, SectionHead } from './ui';

type Service = {
  n: string;
  title: string;
  tagline: string;
  text: string;
  items: string[];
  cta: string;
  featured?: boolean;
};

const SERVICES: Service[] = [
  {
    n: '01',
    title: 'Architektonická štúdia',
    tagline: 'Základ, na ktorom stojí všetko ostatné.',
    text: 'Preveríme pozemok a reguláciu, navrhneme koncept, dispozície a hmotu domu. Svoj budúci dom uvidíte skôr, než miniete prvé euro na stavbe.',
    items: [
      'Koncept a osadenie na pozemok',
      'Dispozície a prevádzkové väzby',
      'Vizualizácie exteriéru',
      'Rámcový odhad investície',
    ],
    cta: 'Chcem štúdiu',
  },
  {
    n: '02',
    title: 'Kompletný projekt domu',
    tagline: 'Jeden partner od zámeru po stavbu.',
    text: 'Od štúdie cez projekt pre stavebné povolenie až po realizačný projekt. Inžiniering a komunikáciu s úradmi vybavíme za vás.',
    items: [
      'Projekt pre stavebné povolenie',
      'Inžiniering a povolenia',
      'Realizačný projekt a detaily',
      'Výkaz výmer pre presné ceny',
    ],
    cta: 'Chcem projekt domu',
    featured: true,
  },
  {
    n: '03',
    title: 'Interiér a atypický detail',
    tagline: 'Priestor dotiahnutý do poslednej škáry.',
    text: 'Dispozícia, materiály, svetlo a nábytok na mieru. Výkresy, podľa ktorých stolár presne vie, čo vyrobiť.',
    items: [
      'Dispozičné a materiálové riešenie',
      'Vizualizácie interiéru',
      'Výkresy atypického nábytku',
      'Výber svietidiel a zariadenia',
    ],
    cta: 'Chcem interiér',
  },
];

export default function Services() {
  return (
    <section id="sluzby" className="scroll-mt-20 py-24 md:py-32">
      <Container>
        <SectionHead index="02" label="Služby" title="Tri spôsoby, ako začať." />
        <div className="mt-16 grid border-t border-line md:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.n} delay={i * 110} className="flex">
              <article
                className={`flex flex-1 flex-col border-b border-line py-10 md:border-b-0 md:px-9 md:py-12 ${
                  i > 0 ? 'md:border-l' : 'md:pl-0'
                } ${i === SERVICES.length - 1 ? 'md:pr-0' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className="serif-accent text-4xl text-acc">{s.n}.</span>
                  {s.featured && (
                    <span className="bg-acc px-2.5 py-1.5 font-disp text-[10px] uppercase tracking-[0.2em] text-paper">
                      Najžiadanejšie
                    </span>
                  )}
                </div>
                <h3 className="mt-6 font-disp text-2xl tracking-tight">{s.title}</h3>
                <p className="serif-accent mt-2 text-[17px] text-mut">{s.tagline}</p>
                <p className="mt-5 text-[15px] leading-relaxed text-mut">{s.text}</p>
                <ul className="mt-7 mb-8">
                  {s.items.map((it) => (
                    <li
                      key={it}
                      className="flex items-start gap-3 border-t border-line py-3 text-[14px]"
                    >
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-acc" aria-hidden />
                      {it}
                    </li>
                  ))}
                </ul>
                <a
                  href="#kontakt"
                  className="group mt-auto inline-flex items-center gap-3 font-disp text-[12.5px] uppercase tracking-[0.18em] transition-colors hover:text-acc"
                >
                  {s.cta}
                  <Arrow className="transition-transform duration-300 group-hover:translate-x-1.5" />
                </a>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="label mt-12 flex items-center gap-3">
            <span className="h-1.5 w-1.5 bg-acc" aria-hidden />
            Ku každej službe: autorský dozor a konzultácie počas výstavby
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
