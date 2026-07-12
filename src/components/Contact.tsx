import { useState, type ReactNode } from 'react';
import { Container, CTAButton, Reveal, SectionHead, WhatsAppIcon } from './ui';
import { SITE } from '../data/site';

const inputCls =
  'w-full border-b border-paper/25 bg-transparent py-3.5 text-paper placeholder:text-paper/35 transition-colors focus:border-acc focus:outline-none';

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="label-paper mb-1 block !text-[10px]">{label}</span>
      {children}
    </label>
  );
}

const PROMISES = [
  'Odpoveď do 24 hodín',
  'Úvodná konzultácia bez záväzkov',
  'Osobne v Michalovciach, Košiciach a Bratislave',
];

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(SITE.formspree, {
        method: 'POST',
        body: new FormData(e.currentTarget),
        headers: { Accept: 'application/json' },
      });
      setStatus(res.ok ? 'ok' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="kontakt" className="scroll-mt-20 bg-ink py-24 text-paper md:py-32">
      <Container>
        <SectionHead
          dark
          index="06"
          label="Kontakt"
          title={
            <>
              Povedzte nám o svojom <span className="serif-accent text-acc">zámere.</span>
            </>
          }
        />
        <div className="mt-16 grid grid-cols-12 gap-y-16 md:gap-x-10">
          <div className="col-span-12 lg:col-span-7">
            {status === 'ok' ? (
              <Reveal>
                <div className="border border-paper/15 p-10 md:p-14">
                  <p className="serif-accent text-4xl text-acc">Ďakujeme.</p>
                  <p className="mt-5 max-w-[46ch] text-paper/80">
                    Vaša správa je u nás. Ozveme sa najneskôr do 24 hodín a dohodneme si
                    nezáväznú konzultáciu.
                  </p>
                </div>
              </Reveal>
            ) : (
              <Reveal>
                <form onSubmit={onSubmit} className="grid gap-x-8 gap-y-7 md:grid-cols-2">
                  <Field label="Meno a priezvisko *">
                    <input name="name" required autoComplete="name" className={inputCls} placeholder="Jana Nováková" />
                  </Field>
                  <Field label="E-mail *">
                    <input
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className={inputCls}
                      placeholder="jana@email.sk"
                    />
                  </Field>
                  <Field label="Telefón">
                    <input
                      name="telefon"
                      type="tel"
                      autoComplete="tel"
                      className={inputCls}
                      placeholder="+421 ..."
                    />
                  </Field>
                  <Field label="Typ projektu">
                    <div className="relative">
                      <select
                        name="typ_projektu"
                        className={`${inputCls} cursor-pointer appearance-none pr-8 [&>option]:text-ink`}
                        defaultValue="Rodinný dom"
                      >
                        <option>Rodinný dom</option>
                        <option>Rekonštrukcia</option>
                        <option>Interiér</option>
                        <option>Komerčný priestor</option>
                        <option>Iné</option>
                      </select>
                      <svg
                        viewBox="0 0 16 16"
                        className="pointer-events-none absolute top-1/2 right-1 h-3 w-3 -translate-y-1/2 text-paper/50"
                        aria-hidden
                      >
                        <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                      </svg>
                    </div>
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="Správa *">
                      <textarea
                        name="message"
                        required
                        rows={4}
                        className={`${inputCls} resize-none`}
                        placeholder="Plánujem novostavbu v okrese Michalovce, pozemok už máme…"
                      />
                    </Field>
                    <p className="mt-2 text-[12.5px] text-paper/45">
                      Stručne: typ stavby, lokalita a fáza, v ktorej ste. O zvyšok sa postaráme.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-6 md:col-span-2">
                    <CTAButton disabled={status === 'sending'}>
                      {status === 'sending' ? 'Odosielam…' : 'Odoslať a prekonzultovať'}
                    </CTAButton>
                    {status === 'error' && (
                      <p role="alert" className="text-[14px] text-acc">
                        Nepodarilo sa odoslať. Skúste to znova, alebo napíšte priamo na{' '}
                        <a href={`mailto:${SITE.email}`} className="underline">
                          {SITE.email}
                        </a>
                        .
                      </p>
                    )}
                  </div>
                  <p className="text-[11.5px] text-paper/35 md:col-span-2">
                    Odoslaním súhlasíte so spracovaním údajov na účel odpovede na váš dopyt.
                  </p>
                </form>
              </Reveal>
            )}
          </div>

          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <Reveal delay={120}>
              <h3 className="label-paper">Radšej priamo?</h3>
              <a
                href={SITE.phoneHref}
                className="mt-5 block font-disp text-3xl tracking-tight transition-colors hover:text-acc"
              >
                {SITE.phoneDisplay}
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="mt-2 block text-paper/70 transition-colors hover:text-acc"
              >
                {SITE.email}
              </a>
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center gap-3 border border-paper/30 px-6 py-4 font-disp text-[12.5px] uppercase tracking-[0.16em] transition-colors hover:border-acc hover:text-acc"
              >
                <WhatsAppIcon /> Napíšte na WhatsApp
              </a>
              <ul className="mt-10">
                {PROMISES.map((p) => (
                  <li
                    key={p}
                    className="flex items-start gap-3 border-t border-paper/15 py-3.5 text-[14px] text-paper/80"
                  >
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-acc" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex gap-8">
                <a
                  href={SITE.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-paper transition-colors hover:!text-acc"
                >
                  Instagram ↗
                </a>
                <a
                  href={SITE.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-paper transition-colors hover:!text-acc"
                >
                  Facebook ↗
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
