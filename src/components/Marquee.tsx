const ITEMS = [
  'Rodinné domy',
  'Interiéry',
  'Rekonštrukcie',
  'Architektonické štúdie',
  'Realizačné projekty',
  'Inžiniering a povolenia',
  'Autorský dozor',
];

export default function Marquee() {
  return (
    <div aria-hidden className="overflow-hidden bg-ink py-4 text-paper">
      <div className="marquee-track">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {ITEMS.map((it) => (
              <span
                key={it}
                className="flex items-center gap-7 pr-7 font-disp text-[12px] uppercase tracking-[0.3em] whitespace-nowrap"
              >
                <span>{it}</span>
                <span className="text-[8px] text-acc">◆</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
