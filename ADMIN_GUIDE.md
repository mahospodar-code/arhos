# ARHOS — správa obsahu (web v2)

## 1. Projekty → cez /admin (odporúčané)

Choď na **arhos.sk/admin**, zadaj heslo (nastavené vo Vercel env `VITE_ADMIN_PASSWORD`).

- Úprava/pridanie/odstránenie projektu, nahratie fotiek (Cloudinary), zmena titulnej fotky, poradia
- Tlačidlo **Publikovať zmeny** commitne `src/data/projects.json` do GitHubu → Vercel automaticky prebuildne (~60 s)
- Pred prvým použitím musia byť vo Vercel Project Settings → Environment Variables nastavené:

| Premenná | Kde sa použije |
|---|---|
| `VITE_ADMIN_PASSWORD` | brána do `/admin` (klient) |
| `ADMIN_PASSWORD` | rovnaké heslo, overuje ho server (`api/publish.js`) |
| `GITHUB_TOKEN` | GitHub token s právom `repo`, ktorým sa commitne zmena |
| `GITHUB_REPO_OWNER` | `mahospodar-code` |
| `GITHUB_REPO_NAME` | `arhos` |
| `VITE_CLOUDINARY_CLOUD_NAME` | `dm5dsjnjk` |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | `arhos_unsigned` |

Bez `GITHUB_TOKEN`/`ADMIN_PASSWORD` vráti Publikovanie jasnú chybu (nespadne potichu).

## 2. Alebo priamo cez GitHub (pre väčšie zmeny)

Zmeny textov mimo projektov (hero, služby, proces, FAQ, kontakty) sa cez `/admin` nedajú meniť —
tie sú v kóde. Uprav priamo na GitHube (ikona ceruzky → Commit changes) a Vercel to prebuildne automaticky:

| Čo | Súbor |
|---|---|
| Projekty (aj ručne, bez /admin) | `src/data/projects.json` |
| Kontakty, telefón, e-mail, sociálne siete | `src/data/site.ts` |
| Texty sekcií (hero, služby, proces, FAQ…) | `src/components/*.tsx` |

Formát projektu v `projects.json`:

```json
{
  "id": 3,
  "title": "Rodinný dom XY",
  "category": "Rezidenčné",
  "location": "Košice",
  "year": "2026",
  "cover": 0,
  "area": "175 m²",
  "images": ["https://res.cloudinary.com/dm5dsjnjk/image/upload/v.../fotka1.jpg"],
  "description": "Popis projektu…"
}
```

- **id** — unikátne číslo. Detail bude na `/projekt/<id>`.
- **cover** — poradové číslo titulnej fotky v `images`, počíta sa od 0.

Alebo najjednoduchšie: napíš Claudovi, čo chceš zmeniť — hotové za pár minút.

## 3. Formulár a WhatsApp

- Formulár posiela dopyty cez Formspree (`src/data/site.ts` → `formspree`); notifikácie chodia na arhos.atelier@gmail.com.
- WhatsApp tlačidlo používa číslo v `site.ts` → `whatsapp`.
