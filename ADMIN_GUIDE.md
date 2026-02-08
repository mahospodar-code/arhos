# ARHOS Atelier - Admin Guide

Tento návod slúži na správu obsahu webstránky ARHOS Atelier. Všetky zmeny je možné vykonávať priamo cez webové rozhranie GitHub, bez nutnosti programovania.

## 1. Kde sa nachádza obsah?

Všetky texty a dáta o projektoch sú uložené v jednom súbore:
`src/data/translations.ts`

Všetky obrázky (fotky projektov, logá) sú uložené v priečinku:
`public/images/`

---

## 2. Ako pridať nový projekt

Pre pridanie nového projektu musíte upraviť súbor `translations.ts` a nahrať fotku.

### Krok 1: Nahratie fotky
1. Otvorte priečinok `public/images/` na GitHube.
2. Kliknite na **Add file** > **Upload files**.
3. Presuňte tam vašu novú fotku (napr. `projekt_novy_dom.jpg`).
4. Kliknite na zelené tlačidlo **Commit changes**.

### Krok 2: Úprava dát
1. Otvorte súbor `src/data/translations.ts`.
2. Kliknite na ikonu ceruzky (Edit file).
3. Nájdite sekciu `projects` a v nej `items`. Vyzerá to takto:

```typescript
items: [
    {
        id: 1,
        title: 'Vila pod Hradom',
        location: 'Bratislava',
        category: 'Rezidenčné',
        image: '/images/project_vila_bratislava.jpg' // Cesta k fotke ktorú ste nahrali
    },
    // ... ďalšie projekty
]
```

4. Skopírujte celý blok jedného projektu (od `{` po `},`) a vložte ho na začiatok alebo koniec zoznamu.
5. Upravte údaje:
   - **id**: Musí byť unikátne číslo (napr. ak posledný bol 6, dajte 7).
   - **title**: Názov projektu.
   - **location**: Lokácia.
   - **category**: Kategória (použite presne: 'Rezidenčné', 'Interiér', alebo 'Komerčné').
   - **image**: Názov súboru fotky, ktorú ste nahrali v Kroku 1 (vždy musí začínať `/images/`).

6. **Dôležité**: Toto musíte urobiť dvakrát - raz pre sekciu `sk` (Slovenčina) a raz pre sekciu `en` (Angličtina), ktorá je nižšie v tom istom súbore.

7. Kliknite na **Commit changes** (uložiť).

---

## 3. Ako meniť texty na stránke

Ak chcete zmeniť napríklad nadpis v Manifeste alebo kontaktné údaje:

1. Otvorte `src/data/translations.ts`.
2. Nájdite text, ktorý chcete zmeniť. Súbor je rozdelený na `sk` a `en`.

Príklad zmeny kontaktu:
```typescript
contact: {
    headline: 'Vybudujme niečo originálne a trvalé.', // Tu prepíšte text
    email: 'novy.email@arhos.sk',
    // ...
}
```

3. Uložte zmeny cez **Commit changes**.

---

## 4. Ako zmeniť poradie projektov

Poradie, v akom sú projekty zapísané v súbore `translations.ts` (v zozname `items`), určuje ich poradie na stránke.
Jednoducho presuňte celý blok `{ ... }` konkrétneho projektu na iné miesto v zozname.

## 5. Dôležité pravidlá pre obrázky

- **Formát**: Používajte `.jpg` pre fotky a `.png` alebo `.svg` pre grafiku.
- **Veľkosť**: Snažte sa, aby fotky nemali viac ako 300-500kb. Obrovské fotky spomalia stránku.
- **Pomer strán**: Ideálny pomer pre projekty je 4:3 (na šírku), ale stránka sa prispôsobí aj iným.

---

*Tip: Ak si nie ste istí, vždy sa pozrite, ako sú zapísané existujúce veci a len ich skopírujte a upravte.*
