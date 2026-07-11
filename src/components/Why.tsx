import { Container, Reveal, SectionHead } from './ui';

const REASONS = [
  {
    n: '01',
    title: 'Katalógový projekt nepozná váš pozemok.',
    text: 'Orientácia na svetové strany, svah, výhľady, susedia aj regulácia obce — návrh tvoríme od miesta, nie od šablóny. Preto dom sadne presne tam, kde stojí.',
  },
  {
    n: '02',
    title: 'Najdrahšie sú zmeny počas stavby.',
    text: 'Precízna dokumentácia a premyslený detail znamenajú menej prekvapení na stavbe, menej naviac-prác a rozpočet pod kontrolou od začiatku.',
  },
  {
    n: '03',
    title: 'Úrady vedia zdržať aj o mesiace.',
    text: 'Inžiniering preberáme za vás — od vyjadrení správcov sietí po právoplatné stavebné povolenie. Vy riešite bývanie, nie byrokraciu.',
  },
];

export default function Why() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <SectionHead
          index="01"
          label="Prečo ARHOS"
          title={
            <>
              Dobrý dom nevzniká na stavbe.{' '}
              <span className="serif-accent text-acc">Vzniká v návrhu.</span>
            </>
          }
        />
        <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
          {REASONS.map((r, i) => (
            <Reveal key={r.n} delay={i * 110}>
              <div className="border-l border-line pl-7">
                <span className="serif-accent text-3xl text-acc">n°{r.n}</span>
                <h3 className="mt-5 font-disp text-xl font-semibold leading-snug">{r.title}</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-mut">{r.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
