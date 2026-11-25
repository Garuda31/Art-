# Bouwprompt — Sutarwaty webshop (voor Claude Code)

> **Gebruik:** maak een lege projectmap, zet daar `brand.md` en de map `photos/` in, open Claude Code in die map en plak alles hieronder de streep in.

---

## Rol en doel

Je bent een ervaren Shopify-thema-ontwikkelaar en webdesigner. Bouw een **custom Shopify Online Store 2.0-thema** voor **Sutarwaty**: een webshop die originele, abstracte acrylschilderijen van één kunstenaar toont en verkoopt.

Het eindresultaat moet eruitzien als een **strakke, zakelijke online galerie**: rustig, veel witruimte, de kunst staat centraal. Het doel is **zoveel mogelijk verkopen (conversie)** zonder ooit goedkoop of schreeuwerig over te komen.

**Lees eerst `brand.md` helemaal.** Daar staan de huisstijl, alle teksten en de producten. Gebruik die gegevens letterlijk. Verzin geen feiten over de kunstenaar. Staat er iets tussen [haken], gebruik dan een nette placeholder en zet het op de TODO-lijst.

## Werkwijze

Werk in fases en stop na elke fase met een korte samenvatting: wat je hebt gedaan en wat ik moet controleren. Ga pas verder als ik "door" zeg.

- **Fase 0 — Plan:** lees `brand.md` en `photos/`. Geef de mappenstructuur van het thema, de lijst met sections/templates en de metafields. Stel maximaal 5 vragen als iets echt onduidelijk is.
- **Fase 1 — Basis:** thema-skelet, design tokens (CSS custom properties uit brand.md), fonts, header, footer, `settings_schema.json`, Nederlandse `locales/nl.default.json`.
- **Fase 2 — Collectie en product:** collectiepagina en productpagina (dit zijn de pagina's die verkopen).
- **Fase 3 — Home en contentpagina's:** homepage, Over, Archief, Contact, FAQ, Verzending & retour.
- **Fase 4 — Afronding:** winkelmand, 404, zoeken, toegankelijkheid, performance, SEO en de controlelijst onderaan.
- **Fase 5 — Overdracht:** README met installatie- en invoerinstructies.

## Techniek

- Shopify Online Store 2.0: JSON-templates, sections en blocks, volledig aanpasbaar in de thema-editor.
- Alleen Liquid, HTML, CSS en zo weinig mogelijk vanilla JavaScript (web components waar nodig). Geen jQuery, geen frameworks, geen build-stap nodig.
- Fonts via Shopify's font picker als dat kan, anders zelf gehoste Google Fonts (Cormorant Garamond, Inter) met `font-display: swap`.
- Ontwikkelen en testen met **Shopify CLI** (`shopify theme dev`) op een **gratis development store** via een Shopify Partners-account. Leg in de README stap voor stap uit hoe ik dat opzet.
- Kwaliteit: `shopify theme check` moet zonder errors draaien.

### Metafields (product, namespace `artwork`)
| Key | Type | Voorbeeld |
|---|---|---|
| `year` | integer | 2024 |
| `medium` | single_line_text | Acryl op papier |
| `size_artwork` | single_line_text | 30 × 40 cm |
| `size_framed` | single_line_text | 40 × 50 cm |
| `frame` | single_line_text | Zwart, passe-partout |
| `story` | multi_line_text | Korte tekst over het werk |
| `orientation` | single_line_text | staand / liggend / vierkant |

Een product is **verkocht** als de voorraad 0 is. Gebruik daarnaast een producttag `archief` voor werken die niet (meer) te koop zijn.

## Pagina's en sections

### Header
- Logo "SUTARWATY" als tekst (Cormorant, hoofdletters, gespatieerd) in het midden; optioneel te vervangen door een afbeelding via instellingen.
- Menu links: Collectie · Over · Contact. Rechts: zoeken, winkelmand met aantal.
- Sticky, wordt compact bij scrollen. Mobiel: hamburger met fullscreen menu.
- Optionele aankondigingsbalk: "Gratis verzekerde verzending binnen Nederland".

### Homepage (in deze volgorde, elk een losse section)
1. **Hero:** grote interieurfoto met een schilderij (`photos/hero/`), kop "Kleur als taal", subtekst, knop "Bekijk de collectie". Op mobiel staat de tekst onder de afbeelding.
2. **Uitgelichte werken:** 4–6 producten uit een kiesbare collectie, raster (desktop 3 kolommen, mobiel 2).
3. **Over de maker:** atelierfoto + 3 zinnen + link "Lees het verhaal".
4. **Vertrouwensbalk:** 4 punten met kleine lijn-iconen (zie brand.md).
5. **Citaat/statement:** één groot citaat van de kunstenaar (instelbaar).
6. **Nieuwsbrief:** Shopify-klantformulier, tekst uit brand.md.
7. **Instagram-strook:** 6 instelbare afbeeldingen met link naar @sutarwaty (geen externe app nodig).

### Collectiepagina
- Titel + korte intro van de collectie.
- Filters (Shopify Search & Discovery): beschikbaarheid, prijs, formaat/oriëntatie. Sorteren: uitgelicht, prijs, nieuwste.
- Productkaart: afbeelding met `object-fit: contain` op doekwit vlak (schilderij nooit bijsnijden), bij hover de tweede foto (interieur), titel, techniek + maat in steengrijs, prijs. Verkochte werken: label "Verkocht", prijs vervalt, kaart blijft klikbaar.
- Raster: desktop 3 kolommen, tablet 2, mobiel 2 (of 1 als instelling).

### Productpagina (belangrijkste pagina)
- **Links (60%):** galerij met grote foto's, klik = fullscreen lightbox met zoom/pinch; thumbnails eronder. Mobiel: swipe-carrousel met stippen.
- **Rechts (40%, sticky op desktop):**
  - Titel (Cormorant, groot), jaar
  - Techniek · maat werk · maat met lijst · lijst (uit metafields)
  - Prijs
  - Label "Uniek origineel — 1 beschikbaar" (of "Verkocht")
  - Knop **In winkelmand** (vol breed, inkt-zwart); bij verkocht: knop "Vraag naar vergelijkbaar werk" → contactpagina met producttitel als onderwerp
  - Direct onder de knop, klein: gratis verzekerde verzending (NL) · levertijd 3–5 werkdagen · 14 dagen bedenktijd · certificaat van echtheid
  - Knop **Stel een vraag**: WhatsApp-link met vooringevulde tekst "Hoi, ik heb een vraag over [titel]" + e-mail-link
  - Accordeons: "Over dit werk" (story), "Verzending & retour", "Verzorging"
- **Schaalindicatie:** een section "Zo hangt het aan de muur": het werk op schaal afgebeeld boven een simpele bank-silhouet (SVG), berekend uit `size_framed`/`size_artwork`. Dit helpt kopers de maat te begrijpen.
- **Onderaan:** "Meer uit deze collectie" (4 werken) + korte maker-strook.
- Structured data (JSON-LD `Product` + `VisualArtwork`), met beschikbaarheid.

### Overige pagina's (templates)
- **Over Sutarwaty:** groot portret/atelierbeeld, tekst uit brand.md, afbeeldingenstrook, knop naar de collectie.
- **Archief:** collectie-template zonder koopknoppen, met label "Verkocht" of "Niet te koop".
- **Contact:** formulier (naam, e-mail, onderwerp, bericht; onderwerp vooraf te vullen via URL-parameter), plus e-mail, WhatsApp, Instagram.
- **FAQ:** accordeon, vragen uit brand.md als blocks.
- **Verzending & retour:** tekst uit brand.md.
- **Winkelmand:** cart drawer (slide-in) + aparte cartpagina; vertrouwenspunten bij de afrekenknop; melding "Gratis verzending binnen Nederland".
- **404 en zoeken:** in dezelfde stijl.

### Footer
Vier kolommen: logo + tagline · Winkel (Collectie, Archief) · Info (Over, FAQ, Verzending & retour, Contact) · Nieuwsbrief. Onderste regel: © Sutarwaty, KVK [nummer], Voorwaarden, Privacy, betaalicoontjes (iDEAL, Bancontact, Visa/Mastercard, PayPal), Instagram.

## Conversie-eisen
- Afmetingen staan altijd zichtbaar bij de prijs.
- Maximaal 2 klikken van home naar winkelmand.
- Geen pop-up bij binnenkomst; nieuwsbriefvenster pas na 25 seconden of bij exit-intent, één keer per bezoeker (instelbaar en uit te zetten).
- Afrekenen als gast mogelijk (aangeven in README welke instelling dat is).
- Verkochte werken blijven vindbaar (sociaal bewijs) maar staan onderaan in de collectie.

## Kwaliteit
- **Mobile-first**; test op 375px, 768px, 1280px en 1600px.
- **Performance:** responsive images (`image_url` + `srcset`), lazy loading behalve de hero, geen layoutverschuivingen (afbeeldingen met vaste beeldverhouding), JS per section geladen. Lighthouse-doel mobiel: Performance ≥ 85, Accessibility ≥ 95, SEO ≥ 95.
- **Toegankelijkheid:** semantische HTML, alt-teksten (titel + "acryl schilderij van Sutarwaty"), zichtbare focus (accentkleur), toetsenbordbediening voor menu, lightbox en accordeons, contrast AA.
- **SEO:** nette title/meta per template, Open Graph-afbeeldingen, `lang="nl"`.
- Alle teksten in `locales/nl.default.json` of instelbaar in de editor, nergens hardcoded.

## Opleveren
1. Het complete thema in `/theme`.
2. `README.md` met:
   - Shopify Partners-account + development store aanmaken, Shopify CLI installeren, `shopify theme dev` en `shopify theme push`.
   - Metafield-definities aanmaken (Instellingen → Aangepaste gegevens), met de tabel hierboven.
   - Producten invoeren: een **CSV-bestand `products.csv`** voor de Shopify-productimport met de 10 werken uit brand.md (handle, titel, prijs, voorraad 1, tags), plus uitleg hoe ik de foto's en metafields toevoeg.
   - Menu's, pagina's en collecties ("Collectie I — Kleur in beweging", "Uitgelicht", "Archief") aanmaken.
   - Betalingen (Shopify Payments met iDEAL/Bancontact), verzendzones (NL gratis, EU vast tarief) en juridische pagina's instellen.
3. `TODO.md` met alle placeholders die ik nog moet invullen.

## Controlelijst (vink af in je laatste bericht)
- [ ] `shopify theme check` zonder errors
- [ ] Alle templates werken in de thema-editor en zijn aanpasbaar
- [ ] Productpagina toont metafields, verkocht-status en schaalindicatie correct
- [ ] Cart drawer werkt, ook op mobiel
- [ ] Getest op 375 / 768 / 1280 / 1600 px
- [ ] Geen hardcoded teksten
- [ ] README, products.csv en TODO.md aanwezig
