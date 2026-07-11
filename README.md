# ARHOS ateliér — www.arhos.sk

Web architektonického ateliéru ARHOS (v2). React 19 + Vite 7 + Tailwind CSS 4 + TypeScript, nasadené na Verceli.

## Vývoj

```bash
npm install
npm run dev        # http://localhost:5199
npm run build      # produkčný build + prerender (dist/)
npm run preview    # lokálny náhľad dist/
```

## Štruktúra

- `src/data/projects.json` — dáta projektov (názov, lokalita, fotky, popis, `cover` = index titulnej fotky)
- `src/data/site.ts` — kontakty, sociálne siete, Formspree endpoint
- `src/components/` — sekcie stránky (Hero, Služby, Projekty, Proces, Kontakt…)
- `src/pages/` — routy: `/` (Home) a `/projekt/:id` (detail projektu)
- `scripts/prerender.mjs` — postbuild: statické HTML pre každú routu (SEO/AI crawlery) + generuje `sitemap.xml`
- `vercel.json` — redirecty (arhos.sk→www, staré URL), SPA rewrite, security headers

Ako upravovať obsah bez programovania: pozri [ADMIN_GUIDE.md](ADMIN_GUIDE.md).

## Deploy

Push do `main` = automatický deploy na Vercel (build ~2–4 min vrátane prerenderu).
