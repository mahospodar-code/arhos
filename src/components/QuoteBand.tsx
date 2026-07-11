import { Container, Reveal } from './ui';

export default function QuoteBand() {
  return (
    <section className="bg-ink py-24 text-paper md:py-36">
      <Container>
        <Reveal>
          <blockquote className="mx-auto max-w-[1050px] text-center">
            <p className="font-serif text-[clamp(1.85rem,4.3vw,3.8rem)] font-[420] leading-[1.18] [text-wrap:balance]">
              „Precízny návrh nie je <span className="text-acc">drahý</span>.
              <br className="hidden md:block" /> Drahé je platiť za{' '}
              <span className="text-acc">improvizáciu</span> na stavbe.“
            </p>
            <footer className="label-paper mt-10">— Manifest ateliéru ARHOS</footer>
          </blockquote>
        </Reveal>
      </Container>
    </section>
  );
}
