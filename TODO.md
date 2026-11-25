# TODO — nog in te vullen

Alles wat in `brand.md` tussen [haken] staat, is hier verzameld. Zoek in het thema op `[` om de plekken terug te vinden.

## Teksten en gegevens van de maker
- [ ] **Voornaam** van de kunstenaar (Over-pagina: "Ik ben [voornaam] Sutarwaty")
- [ ] **Aantal jaren** dat ze schildert (Over-pagina: "[aantal] jaar")
- [ ] **Eén persoonlijke zin**: achtergrond, inspiratie, waarom ze schildert (Over-pagina)
- [ ] **Plaats** voor bezoek op afspraak (FAQ-vraag 2: "op afspraak in [plaats]")
- [ ] **Opdrachtwerk ja of nee** (FAQ-vraag 5: "[Ja/Nee — invullen]")
- [ ] **Verzendtarief EU** (Verzending & retour: "€[25]") en hetzelfde bedrag in Shopify verzendzones
- [ ] **Echt citaat** van de kunstenaar voor de homepage. Nu staat de missie uit brand.md erin (Homepage → Citaat).
- [ ] **WhatsApp-nummer** (Themainstellingen → Contact en social, formaat `31612345678`). Tot die tijd verschijnen de WhatsApp-knoppen niet.
- [ ] **KVK-nummer** (Themainstellingen → Bedrijfsgegevens)

## Per werk (Collectie I)
- [ ] **Jaar** van elk werk (metafield `artwork.year`). In de CSV is dit leeg.
- [x] Maat van het werk: **29,5 × 21 cm** (liggend) ingevuld voor Wervelingen, Mozaïek, Zonnegeel, Regenboogstroom, Stilleven op geel en Drie gezichten. Controleer of dat voor al deze zes klopt.
- [ ] **Maat van het werk** voor Tuin in bloei, de vaas en de nog niet gefotografeerde werken (Avondbos, Kustlijn, Huis in het groen). In de CSV staan placeholders zoals `[30 × 40] cm`.
- [ ] **Lijst door de koper laten kiezen (later):** nu staat bij de zes liggende werken de lijst van de foto (42 × 32 cm, zwart met passe-partout). Wil je lijsten als keuze aanbieden, dan wordt dat een productoptie (varianten met een meerprijs). Dat verandert de prijsberekening en de winkelmand, dus eerst overleggen.
- [ ] **Oriëntatie** (staand / liggend / vierkant) per werk. In de CSV is dit leeg. Nodig voor het filter op oriëntatie.
- [ ] **Lijst** controleren (nr. 8 en 9 staan als "Ongelijst" uit brand.md; dat lijkt "zonder lijst" te betekenen).
- [ ] **Gewicht en verpakkingsmaten** per werk (voor verzendtarieven)
- [ ] **Prijzen controleren** (CSV: €245 en €210 volgens brand.md)
- [ ] Werken van **concept naar actief** zetten zodra de foto's erin staan

## Foto's (mappen in `photos/` zijn nog leeg)
- [ ] 10 werken: `sutarwaty-<handle>-01.jpg` (frontaal) t/m `-06.jpg` (interieur). Zet 06 als tweede afbeelding in Shopify.
- [ ] `photos/hero/`: interieurfoto met schilderij voor de homepage (2400 × 1400 px aanbevolen) + alt-tekst invullen
- [ ] `photos/atelier/`: atelier- en portretfoto's (homepage, Over-pagina, maker-strook op productpagina)
- [ ] 6 afbeeldingen voor de Instagram-strook
- [ ] Logo-afbeelding (optioneel; anders tekstlogo), favicon en deelafbeelding (1200 × 630)

## Nog te fotograferen
- [ ] **Avondbos, Kustlijn en Huis in het groen** staan wel in `products.csv`, maar zijn niet in de preview omdat er nog geen foto's van zijn. Zodra ze er zijn, voeg ik ze toe.
- [ ] Hero, atelierbeeld en Instagram-strook in de preview gebruiken nu echte schilderijen in een getekende kamer. Vervang ze door echte foto's (kamer, atelier, Instagram) in de thema-editor.

## Hero-galerijwand
- [ ] Vul bij **elk werk** het metafield *Maat werk* in (bijvoorbeeld `29,5 × 21 cm`), anders verschijnt het werk niet op de galerijwand. Controleer ook *Maat met lijst* en *Lijst*.

## Archief (later)
- [ ] Bloemen op donkerblauw doek (2009): status Verkocht of Niet te koop, tag `archief`
- [ ] Theepot op groen (doek): idem

## Shopify-instellingen (zie README)
- [ ] Partners-account en development store, daarna de echte winkel
- [ ] 7 metafield-definities aanmaken (vóór het importeren van `products.csv`)
- [ ] Collecties: Collectie I, Uitgelicht, Archief (template `collection.archief`)
- [ ] Pagina's `over`, `contact`, `faq`, `verzending-retour` met de juiste thema-templates
- [ ] Menu's `main-menu` en footermenu's koppelen
- [ ] Shopify Payments (iDEAL, Bancontact), PayPal
- [ ] Verzendzones Nederland (gratis) en EU (vast tarief)
- [ ] Gast afrekenen toestaan (Instellingen → Kassa → Klantaccounts)
- [ ] Beleidspagina's (retour, privacy, voorwaarden, verzending) en btw-tarief controleren
- [ ] Search & Discovery: filters op beschikbaarheid, prijs, maat en oriëntatie
- [ ] Lighthouse draaien op mobiel (Performance ≥ 85, Accessibility ≥ 95, SEO ≥ 95)
- [ ] Testen op 375 / 768 / 1280 / 1600 px, inclusief de cart drawer op mobiel
