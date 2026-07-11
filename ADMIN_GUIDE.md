# ARHOS — správa obsahu (web v2)

Všetky zmeny sa robia úpravou súborov priamo na GitHube (ikona ceruzky → Commit changes).
Po commite do `main` sa web automaticky prebuildne a nasadí (~2–4 minúty).

## 1. Kde je obsah?

| Čo | Súbor |
|---|---|
| Projekty (názvy, fotky, popisy) | `src/data/projects.json` |
| Kontakty, telefón, e-mail, sociálne siete | `src/data/site.ts` |
| Texty sekcií (hero, služby, proces, FAQ…) | `src/components/*.tsx` |

## 2. Ako pridať nový projekt

1. Nahraj fotky na Cloudinary (účet `dm5dsjnjk`) a skopíruj si URL adresy fotiek.
2. Otvor `src/data/projects.json` a do poľa `"sk"` pridaj nový objekt (skopíruj existujúci a uprav):

```json
{
  "id": 3,
  "title": "Rodinný dom XY",
  "category": "Rezidenčné",
  "location": "Košice",
  "year": "2026",
  "cover": 0,
  "area": "175 m²",
  "images": [
    "https://res.cloudinary.com/dm5dsjnjk/image/upload/v.../fotka1.jpg",
    "https://res.cloudinary.com/dm5dsjnjk/image/upload/v.../fotka2.jpg"
  ],
  "description": "Popis projektu…"
}
```

- **id** — unikátne číslo (posledné +1). Detail bude na `/projekt/<id>`.
- **cover** — poradové číslo titulnej fotky v poli `images`, počíta sa od 0.
- Fotky vkladaj v plnej kvalite — web si sám pýta zmenšené verzie (Cloudinary transformácie).

3. Commit changes. Sitemap aj prerender sa aktualizujú automaticky — nič ďalšie netreba.

Poznámka: sekcia `"en"` v tom istom súbore sa momentálne nepoužíva (web je len po slovensky);
ak ju chceš udržiavať, uprav ju rovnako.

## 3. Ako zmeniť texty

Texty sekcií sú v `src/components/` (napr. `Hero.tsx`, `Services.tsx`, `Process.tsx`,
`Atelier.tsx` — FAQ, `Contact.tsx`). Prepíš text v úvodzovkách a commitni.
Ak si nie si istý, napíš Claudovi — úprava textu je otázka minúty.

## 4. Formulár a WhatsApp

- Formulár posiela dopyty cez Formspree (`src/data/site.ts` → `formspree`); notifikácie chodia na arhos.atelier@gmail.com.
- WhatsApp tlačidlo používa číslo v `site.ts` → `whatsapp`.

## 5. Čo už neexistuje (oproti v1)

- `/admin` rozhranie a `api/publish.js` boli odstránené — obsah sa spravuje priamo v repe (bezpečnejšie, menej údržby).
- Jazykový prepínač SK/EN a blog boli vypnuté; dáta blogu ostali len v histórii gitu.
