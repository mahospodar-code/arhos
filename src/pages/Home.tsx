import { useMeta } from '../hooks/useMeta';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import Why from '../components/Why';
import Services from '../components/Services';
import Projects from '../components/Projects';
import Process from '../components/Process';
import QuoteBand from '../components/QuoteBand';
import Atelier from '../components/Atelier';
import Contact from '../components/Contact';

export default function Home() {
  useMeta({
    title:
      'ARHOS ateliér — Architekt Michalovce · Košice · Bratislava | Rodinné domy a interiéry',
    description:
      'Architektonický ateliér ARHOS navrhuje rodinné domy, interiéry a rekonštrukcie od štúdie po kolaudáciu. Vybavíme aj povolenia. Michalovce, Košice, Bratislava. Nezáväzná konzultácia — odpovieme do 24 hodín.',
    path: '/',
  });

  return (
    <>
      <Hero />
      <Marquee />
      <Why />
      <Services />
      <Projects />
      <Process />
      <QuoteBand />
      <Atelier />
      <Contact />
    </>
  );
}
