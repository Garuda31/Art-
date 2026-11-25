# Sutarwaty — Shopify-thema

Een custom Online Store 2.0-thema voor de webshop van Sutarwaty: een rustige, zakelijke online galerie voor originele acrylschilderijen. Alleen Liquid, HTML, CSS en een beetje vanilla JavaScript, zonder build-stap.

## Wat zit waarin

```
theme/        het complete Shopify-thema (dit upload je)
preview/      voorbeeldweergave (home, collectie, 8 productpagina's, winkelmand) met placeholder-kunst
photos/       jouw foto's per werk (zie brand.md, sectie 6)
products.csv  importbestand met de 10 werken van Collectie I
brand.md      huisstijl en teksten (bron voor de bouw)
TODO.md       alle placeholders die je nog moet invullen
```

> De `preview/`-pagina's zijn met de hand nagebouwd naast de Liquid-code. Ze geven een visueel beeld, maar de echte render zie je pas in Shopify (stap 1).

Voorbeeldweergave bekijken (vanuit de projectmap):

```powershell
python -m http.server 8765
```

Open daarna `http://localhost:8765/preview/index.html`. De winkelmand werkt in de preview met voorbeeldgegevens in je browser, zodat je het hele koopproces kunt uitproberen. Afrekenen gebeurt in de echte winkel.

---

## 1. Shopify opzetten en het thema bekijken

1. **Partners-account:** maak een gratis account op [partners.shopify.com](https://partners.shopify.com).
2. **Development store:** Partners → Stores → *Add store* → *Create development store*. Kies de optie om te testen en bouwen. Deze winkel is gratis en je kunt er geen echte bestellingen mee ontvangen.
3. **Node.js** (versie 20 of nieuwer) moet geïnstalleerd zijn: [nodejs.org](https://nodejs.org).
4. **Shopify CLI installeren:**

   ```powershell
   npm install -g @shopify/cli@latest
   ```

5. **Thema live bekijken** (vanuit de projectmap). De eerste keer vraagt de CLI om in te loggen in je browser:

   ```powershell
   shopify theme dev --path theme --store jouw-winkel.myshopify.com
   ```

   Je krijgt een lokale preview-URL (`http://127.0.0.1:9292`). Wijzigingen in de bestanden verschijnen direct.
6. **Thema uploaden** naar je winkel (als nieuw, nog niet gepubliceerd thema):

   ```powershell
   shopify theme push --path theme --unpublished --store jouw-winkel.myshopify.com
   ```

7. **Code controleren:**

   ```powershell
   shopify theme check --path theme
   ```

   Dit moet zonder errors draaien.

---

## 2. Metafields aanmaken (doe dit vóór het importeren)

Ga naar **Instellingen → Aangepaste gegevens → Producten → Definitie toevoegen**. Gebruik namespace `artwork` en de volgende sleutels:

| Naam | Namespace en sleutel | Type | Voorbeeld |
|---|---|---|---|
| Jaar | `artwork.year` | Geheel getal | 2024 |
| Techniek | `artwork.medium` | Tekst met één regel | Acryl op papier |
| Maat werk | `artwork.size_artwork` | Tekst met één regel | 30 × 40 cm |
| Maat met lijst | `artwork.size_framed` | Tekst met één regel | 40 × 50 cm |
| Lijst | `artwork.frame` | Tekst met één regel | Zwart, passe-partout |
| Verhaal | `artwork.story` | Tekst met meerdere regels | Korte tekst over het werk |
| Oriëntatie | `artwork.orientation` | Tekst met één regel | staand / liggend / vierkant |

Let op:
- Gebruik exact de sleutels hierboven. De namen in de CSV-kolomkoppen (Jaar, Techniek, …) mogen anders zijn, maar `product.metafields.artwork.…` moet kloppen.
- Zet bij **Maat werk**, **Maat met lijst** en **Oriëntatie** de optie *Gebruiken als filter* aan als je wilt filteren op formaat of oriëntatie (zie stap 5).
- Schrijf maten als `breedte × hoogte cm`. De sectie "Zo hangt het aan de muur" (schaalindicatie met bank-silhouet) staat niet meer op de productpagina, omdat de tweede foto al een interieur toont. Het bestand `theme/sections/scale-preview.liquid` blijft in het thema, voor het geval je hem later terug wilt zetten in `templates/product.json`.

## 3. Producten invoeren

1. **CSV importeren:** Producten → *Importeren* → kies `products.csv`. Alle werken komen binnen als **concept** (draft), met voorraad 1, de prijs, de tag `collectie-i` en de metafields. De bestandsnamen staan in de kolom `Handle`.
2. **Foto's toevoegen** per product (Producten → werk → Media). Bestandsnamen volgen `photos/<handle>/sutarwaty-<handle>-0X.jpg`:
   - `01` frontaal zonder lijst, `02` in lijst, `03–04` details, `05` zijkant, `06` interieur.
   - **Zet de interieurfoto (06) als tweede afbeelding.** Het thema toont de tweede foto als je met de muis over een werk gaat in de collectie. De eerste foto (01) is de hoofdafbeelding.
   - De alt-tekst maakt het thema zelf: *titel + "acryl schilderij van Sutarwaty"*.
3. **Metafields invullen:** de CSV vult techniek, lijst en verhaal. De maten staan als placeholder (`[30 × 40] cm`), het jaar en de oriëntatie zijn leeg. Vul deze per product in via het blok *Metafields* onderaan de productpagina in de admin.
4. **Publiceren:** zet een werk op *Actief* zodra foto's en maten kloppen.

**Verkocht en archief**
- Een werk is **verkocht** als de voorraad 0 is. Het blijft vindbaar met het label "Verkocht", zonder prijs, en staat onderaan in de collectie.
- Een werk dat **niet (meer) te koop** is, krijgt de producttag `archief`. Het toont dan "Niet te koop" en heeft geen koopknop.
- Archief later toevoegen: bloemen op donkerblauw doek (2009) en theepot op groen (doek).

## 4. Menu's, pagina's en collecties

**Collecties** (Producten → Collecties → *Collectie maken*):

| Titel | Handle | Soort | Voorwaarde |
|---|---|---|---|
| Collectie I — Kleur in beweging | `collectie-i` | Automatisch | Producttag is gelijk aan `collectie-i` |
| Uitgelicht | `uitgelicht` | Handmatig of automatisch | Kies 4–6 werken |
| Archief | `archief` | Automatisch | Producttag is gelijk aan `archief` |

Geef de collectie **Archief** in het veld *Thema-template* de waarde `collection.archief`. Daarmee toont elke kaart "Verkocht" of "Niet te koop" en nooit een prijs.

**Pagina's** (Online winkel → Pagina's → *Pagina toevoegen*). Kies bij *Thema-template* het genoemde template:

| Titel | Handle | Thema-template |
|---|---|---|
| Over Sutarwaty | `over` | `page.over` |
| Contact | `contact` | `page.contact` |
| Veelgestelde vragen | `faq` | `page.faq` |
| Verzending & retour | `verzending-retour` | `page.verzending` |

Voorwaarden en privacy maak je via de beleidspagina's (stap 6) of als gewone pagina's met de standaardtemplate.

**Menu's** (Online winkel → Navigatie):
- `main-menu` (hoofdmenu): Collectie → de collectie, Over → `/pages/over`, Contact → `/pages/contact`.
- Footer: een menu *Winkel* (Collectie, Archief) en een menu *Info* (Over, FAQ, Verzending & retour, Contact). Koppel ze in de thema-editor bij de Footer-sectie.
- Zonder menu's gebruikt het thema zelf de bovenstaande links met deze handles.

**Thema-editor** (Online winkel → Thema's → Aanpassen):
- *Themainstellingen:* logo (anders tekstlogo), favicon, deelafbeelding, WhatsApp-nummer, KVK-nummer, betaalicoontjes en het nieuwsbriefvenster.
- *Homepage:* hero-foto, atelierfoto, citaat en de zes Instagram-afbeeldingen.
- *Homepage-hero met galerijwand:* de hero toont 4 schilderijen naast elkaar in een kamer, op schaal. De knop "Andere schilderijen" kiest een nieuwe willekeurige selectie. De maten komen uit de metafields: **Maat werk** (verplicht, anders verschijnt het werk niet), **Maat met lijst** en **Lijst** (bepaalt de lijstkleur: "hout" = houten lijst, anders zwart). Kies de collectie en het aantal (2–5) in de sectie-instellingen. Elk schilderij is een link naar het werk.
- *Openingsanimatie* (Themainstellingen): een leeg scherm waarop de naam verschijnt en naar het logo in de header vliegt. Aan of uit te zetten. Standaard alleen op de homepage en één keer per bezoek. Wordt overgeslagen bij 'minder beweging' (toegankelijkheid) en bezoekers kunnen klikken om hem over te slaan. In de preview speel je hem opnieuw af met `?intro=1` achter de link.
- Op de collectiepagina stel je filters en sortering in via de app **Search & Discovery** (gratis, van Shopify).

## 5. Filters op formaat en oriëntatie

1. Installeer de app **Shopify Search & Discovery**.
2. Ga naar *Filters* → *Filter toevoegen* en voeg toe: *Beschikbaarheid*, *Prijs*, en de metafields *Maat werk* en *Oriëntatie*.
3. Het filterpaneel op de collectiepagina toont ze automatisch.

## 6. Betalingen, verzending en juridisch

**Betalingen** (Instellingen → Betalingen): activeer **Shopify Payments**. Daarmee zet je iDEAL, Bancontact, creditcard en wallets aan. PayPal activeer je apart onder *Aanvullende betaalmethoden*. Welke methoden beschikbaar zijn, hangt af van het land van je bedrijf en de goedkeuring door Shopify.

**Verzending** (Instellingen → Verzending en levering):
- Zone *Nederland*: tarief **€0** (gratis, verzekerd), levertijd 3–5 werkdagen.
- Zone *EU*: vast tarief **€[25]** (verzekerd). Vul het echte bedrag in.
- Zet het gewicht en de verpakking per werk in zodra je ze kent.

**Afrekenen als gast:** Instellingen → Kassa (Checkout) → *Klantaccounts*. Kies *Accounts zijn uitgeschakeld* of *Accounts zijn optioneel*. Dan kunnen kopers afrekenen zonder account. Dit thema heeft geen aparte account-pagina's.

**Juridische pagina's:** Instellingen → Beleid. Genereer of schrijf *Retourbeleid*, *Privacybeleid*, *Servicevoorwaarden* en *Verzendbeleid*. Ze verschijnen automatisch in de footer. Controleer de teksten en het btw-tarief voor kunst met je boekhouder.

---

## 7. Hoe het thema is opgebouwd

- **Teksten:** vaste interface-teksten staan in `theme/locales/nl.default.json`. Content (hero, FAQ, Over, …) staat als instelbare tekst in de thema-editor.
- **Huisstijl:** kleuren en fonts staan als CSS-variabelen in `snippets/css-variables.liquid`. Cormorant Garamond en Inter worden zelf gehost (`assets/*.woff2`).
- **Contrast:** voor leesbare tekst gebruikt het thema een donkerdere afgeleide van het steengrijs (`--color-stone-text`) en van het kurkuma (`--color-accent-deep`) voor hover en focus. Het originele steengrijs blijft voor lijnen.
- **JavaScript per sectie:** menu en fade-in (`theme.js`, overal), winkelmand (`cart.js`), galerij en lightbox (`product-gallery.js`), filters (`collection.js`), contact (`contact.js`) en het nieuwsbriefvenster (`newsletter-popup.js`).

## 8. Conversie-onderdelen

- **Koopknop met duidelijke status:** "In winkelmand" → "Toevoegen…" → "Toegevoegd ✓" → "Bekijk winkelmand". Elk werk is uniek, dus een tweede klik opent de winkelmand in plaats van nogmaals toe te voegen.
- **Cart drawer:** na het toevoegen schuift de winkelmand open, met subtotaal, "gratis verzekerde verzending", afrekenknop en betaalmethoden. Geen omweg via een aparte pagina.
- **Sticky koopbalk op mobiel:** titel, prijs en "In winkelmand" blijven in beeld zodra je voorbij de hoofdknop scrolt.
- **Snelle afrekenknop** (Shop Pay, Apple Pay, Google Pay) onder de koopknop op de productpagina en op de cartpagina. Verschijnt automatisch zodra die methoden in Shopify actief zijn. Uit te zetten in de thema-editor (sectie Productpagina).
- **Cartpagina:** afrekenknop met slotje, betaalicoontjes, 14 dagen bedenktijd, certificaat van echtheid, en een hulpblok met WhatsApp of e-mail.
- **Lege winkelmand** is geen doodlopende weg: er staan direct 2–3 beschikbare werken onder. Onder de regels op de cartpagina staat "Misschien ook mooi". Bron is de collectie `uitgelicht`, anders alle werken.
- **Eerlijke schaarste:** "Uniek origineel — 1 beschikbaar" overal waar een werk staat, zonder nep-timers.
- Werk verkocht terwijl iemand het toevoegt? De koper krijgt een heldere melding bij de knop.

## 9. Bekende beperkingen

- **Verkocht onderaan** werkt per pagina. De standaard is 48 werken per pagina. Heb je meer, dan kan een verkocht werk op de eerste pagina staan.
- **Zoeken** heeft geen voorspellende suggesties.
- **Menu's** tonen alleen het bovenste niveau (geen submenu's).
- **Het nieuwsbriefvenster** onthoudt per browser (localStorage) dat het getoond is.
- **Lighthouse** is niet gemeten door de bouwer. Draai het zelf op de preview-URL van `shopify theme dev` (Chrome → DevTools → Lighthouse, mobiel). Doelen: Performance ≥ 85, Accessibility ≥ 95, SEO ≥ 95.

## 10. Snelle controle na het uploaden

- Elk werk toont de juiste metafields, het label "Uniek origineel — 1 beschikbaar", of "Verkocht" bij voorraad 0.
- Toevoegen aan de winkelmand opent de drawer, ook op je telefoon.
- Je kunt als gast afrekenen en de betaalmethoden zijn zichtbaar.
- Test op 375, 768, 1280 en 1600 px.
