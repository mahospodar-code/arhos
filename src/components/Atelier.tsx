import { Container, Reveal, SectionHead } from './ui';

const VALUES = [
  'Logika dispozície',
  'Prirodzené svetlo',
  'Trvácne materiály',
  'Detail, ktorý cítiť',
];

const FAQ = [
  {
    q: 'Koľko stojí projekt rodinného domu?',
    a: 'Cena závisí od veľkosti a zložitosti zadania. Po úvodnej konzultácii dostanete konkrétnu ponuku s pevným rozsahom — vopred a bez záväzkov.',
  },
  {
    q: 'Ako dlho trvá návrh domu?',
    a: 'Štúdia obvykle niekoľko týždňov, kompletná dokumentácia s povoleniami niekoľko mesiacov. Presný harmonogram si povieme hneď na začiatku.',
  },
  {
    q: 'Vybavíte aj stavebné povolenie?',
    a: 'Áno. Inžiniering a komunikáciu s úradmi preberáme za vás — od vyjadrení správcov sietí až po právoplatné stavebné povolenie.',
  },
  {
    q: 'Navrhujete aj samostatné interiéry?',
    a: 'Áno, interiér riešime aj bez projektu domu — od dispozície cez materiály po výkresy atypického nábytku pre stolárov.',
  },
  {
    q: 'Kde pôsobíte?',
    a: 'Michalovce, Košice a Bratislava sú náš domáci región, po dohode pracujeme po celom Slovensku.',
  },
];

export default function Atelier() {
  return (
    <section id="atelier" className="scroll-mt-20 bg-paper2/50 py-24 md:py-32">
      <Container>
        <SectionHead
          index="05"
          label="Ateliér"
          title={
            <>
              Racionálna architektúra. Autentický interiér.{' '}
              <span className="serif-accent text-acc">Nadčasový dizajn.</span>
            </>
          }
        />
        <div className="mt-16 grid grid-cols-12 gap-y-14 md:gap-x-10">
          <div className="col-span-12 lg:col-span-5">
            <Reveal>
              <p className="max-w-[48ch] text-[16.5px] leading-relaxed text-ink/80">
                Sme architektonický ateliér pôsobiaci v Michalovciach, Košiciach a Bratislave.
                Uprednostňujeme overené princípy pred krátkodobým efektom — tvoríme architektúru
                postavenú na logike, trvácnych materiáloch a prirodzenom svetle.
              </p>
              <p className="serif-accent mt-6 text-xl text-ink">
                Kvalitný priestor nepotrebuje vysvetľovanie. Stačí v ňom byť.
              </p>
            </Reveal>
            <div className="mt-12">
              {VALUES.map((v, i) => (
                <Reveal key={v} delay={i * 80}>
                  <div className="flex items-baseline gap-5 border-t border-line py-4">
                    <span className="label">0{i + 1}</span>
                    <span className="font-disp text-lg">{v}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <Reveal>
              <h3 className="label mb-6">Časté otázky</h3>
            </Reveal>
            {FAQ.map((f, i) => (
              <Reveal key={f.q} delay={i * 60}>
                <details className="faq group border-t border-line">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5">
                    <span className="font-disp text-[16.5px]">{f.q}</span>
                    <span className="faq-x relative h-4 w-4 shrink-0 text-acc" aria-hidden>
                      <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-current" />
                      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
                    </span>
                  </summary>
                  <p className="max-w-[62ch] pb-6 text-[15px] leading-relaxed text-mut">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
