# Changelog

Alle noemenswaardige wijzigingen aan het dashboard, nieuwste bovenaan.
Versienummering: x.y.z — x = major, y = nieuwe functionaliteit, z = bugfixes/kleine aanpassingen.

## 1.6.1 — 2026-08-07

- **Inter** toegevoegd als derde lettertype, specifiek voor lopende
  tekst/labels (`font-body`). Space Grotesk blijft voor koppen
  (`font-display`), JetBrains Mono voor cijfers/data (`font-mono`).

## 1.6.0 — 2026-08-07

- **Volledig donker thema**: warm-witte achtergrond vervangen door een
  bijna-zwarte (#0D0C0A) achtergrond met lichte tekst. Kaarten, hairlines,
  chart-tooltip en risicokleuren zijn allemaal bijgewerkt naar de donkere
  variant. De header blijft licht (voor logo-leesbaarheid), de rest van de
  pagina is donker.
- **Lettertype vernieuwd**: Space Grotesk voor koppen/labels, JetBrains
  Mono voor cijfers en data — professionelere, technischere uitstraling
  dan de vorige Georgia-serif. Geladen via `next/font/google` (zelf-gehost
  na build, geen doorlopende Google-afhankelijkheid voor bezoekers).
- **Gauges futuristischer**: tick-markeringen langs de boog, gloeiend
  naaldpunt, monospace cijferweergave. Rood (#C23B3B, iets levendiger dan
  het vorige #8B0000) is nu een bredere accentkleur, niet alleen voor
  negatieve waarden.
- Logo in de header flink vergroot: 5px padding op zowel mobiel als
  desktop, logo vult nu vrijwel de hele headerband.

## 1.5.0 — 2026-08-07

- **Dashboard-indeling herzien:**
  - Twee gauges bovenaan: winst/verlies sinds gisteren 00:00u (benaderd met
    24u-verandering, exacte 00:00u-snapshot volgt met historische opslag),
    en belegd-vs-saldo-verhouding. Plek voor een derde gauge is aangehouden
    voor later (`components/Gauge.tsx`, herbruikbaar).
  - Investeringen (holdings) en stijgers/dalers staan nu naast elkaar op
    desktop, onder elkaar op mobiel.
  - Risicospreiding is verplaatst naar helemaal onderaan de pagina.
- **Alerts-beheer verplaatst** naar een eigen knop in de header (naast de
  meldingenbel), die net als meldingen een sliding paneel opent vanaf
  rechts. Alerts aanmaken, bewerken (edit) en verwijderen (delete) kan nu
  direct vanuit dat paneel — de losse `/alerts`-pagina is vervallen.
  Nieuw: `components/AlertsButton.tsx`, `components/AlertsManagerPanel.tsx`.
- Oude `AlertsPanel`-kaart (met link naar `/alerts`) verwijderd; die
  functionaliteit zit nu volledig in het nieuwe paneel.

## 1.4.1 — 2026-08-07

- Header: verticale padding rond het logo verkleind naar 10px op desktop
  (20px blijft op mobiel), logo zelf groter.
- Footer: monogram groter, padding wat strakker.

## 1.4.0 — 2026-08-07

- **Instelbare prijs-alerts** toegevoegd op `/alerts`: per coin, drempel als
  bedrag of percentage (percentage rekent vanaf een vast referentiepunt op
  het moment van instellen), richting boven/onder, meldingskanaal
  dashboard/push/beide. Alerts blijven na afgaan actief en kunnen
  herhaaldelijk triggeren; zelf te pauzeren of verwijderen.
- **Meldingenbel** in de header: badge met aantal ongelezen meldingen, klik
  opent een paneel dat vanaf rechts inschuift. Elke melding heeft drie
  acties: naar de coin springen (scrollt naar die positie in het
  dashboard), snoozen (verbergen tot de alert opnieuw afgaat), of sluiten.
- **Echte push-notificaties** via de Web Push API: service worker
  (`public/sw.js`), VAPID-sleutels, en opslag van push-abonnementen in
  Upstash Redis. Werkt ook als de site niet open staat, inclusief op
  mobiel als de PWA is geïnstalleerd.
- **Achtergrondcheck** via `/api/alerts/check` (beveiligd met
  `ALERTS_CRON_SECRET`), bedoeld om elke 15 minuten aangeroepen te worden
  door een externe gratis cron-dienst (Vercel's Hobby-plan staat geen
  cron vaker dan 1x/dag toe).
- Nieuw: `lib/alerts-store.ts`, `lib/alert-checker.ts`,
  `lib/use-push-notifications.ts`, `app/alerts/`, `app/api/alerts/`,
  `app/api/notifications/`, `app/api/push/`, `public/sw.js`.
- Oude placeholder-alerts (statische `Alert`-type, `AlertsPanel` met
  hardcoded voorbeelddata) volledig vervangen door het echte systeem.
- Vereist: VAPID-sleutels en `ALERTS_CRON_SECRET` als nieuwe environment
  variables op Vercel, en een externe cron-koppeling (zie README).

## 1.3.2 — 2026-08-07

- Header is nu sticky (blijft zichtbaar bij scrollen) en het logo staat
  groter.
- Favicon/PWA-iconen opnieuw gegenereerd met minder witruimte rond het
  monogram, zodat de "V" op klein formaat duidelijker oogt.
- Footer is nu een volle zwarte band (i.p.v. een dunne rand), met een groter
  monogram, en toont "Vaultline" naast het jaartal in plaats van de naam.

## 1.3.1 — 2026-08-07

- Login (uit 1.3.0) teruggedraaid. De inhoudelijke code werkte, maar de
  bestandsstructuur — met name de map `app/api/auth/[...nextauth]/` — bleek
  niet goed te uploaden via GitHub's webinterface (vierkante haken in
  mapnamen breken de drag-and-drop uploader). Favicon/PWA-icoon uit 1.3.0
  blijven staan.
- Idee "Login voor jezelf" terug op de roadmap (`lib/ideas.ts`), met een
  notitie: opnieuw oppakken zodra het project via git of GitHub Desktop
  gepusht kan worden i.p.v. de webuploader.
- Verwijderd: `lib/auth-store.ts`, `lib/auth-options.ts`, `app/login/`,
  `app/api/auth/`, `middleware.ts`, `components/AuthProvider.tsx`,
  `.env.example`. Packages `next-auth`, `@upstash/redis`, `bcryptjs`
  verwijderd uit `package.json`.

## 1.3.0 — 2026-08-07

- Favicon en PWA-installatie-icoon toegevoegd op basis van het monogram
  (`public/manifest.json`, favicon- en apple-touch-icon-formaten). Bij
  "toevoegen aan beginscherm" op mobiel gebruikt de app nu naam en logo van
  Vaultline.
- ~~Login toegevoegd~~ — zie 1.3.1, teruggedraaid vanwege deploy-problemen.

## 1.2.0 — 2026-08-07

- Logo's verwerkt: gecombineerd logo bovenaan in een nieuwe donkere
  headerband op elke pagina (`components/SiteHeader.tsx`), monogram in de
  footer (`components/Footer.tsx`). Achtergrond van beide bestanden
  getransparant gemaakt.
- Dubbele "Vaultline"/paginanaam-labels opgeschoond nu het logo die rol
  overneemt.

## 1.1.0 — 2026-08-07

- Applicatienaam gekozen: **Vaultline**. Verwerkt in titel en metadata
  (logo volgt later, plek staat klaar in de footer).
- Footer toegevoegd op elke pagina: © jaartal, naam, "Vaultline", en het
  versienummer met link naar de changelog (verplaatst uit de header).
- Versienummer/changelog-link staat nu in de footer i.p.v. de dashboard-
  header.
- Changelog-pagina toegevoegd op `/changelog`, leest `CHANGELOG.md` uit het
  project en toont het huidige versienummer.
- Connectie-indicator toegevoegd naast "Bitvavo" in de header: groen
  (verbonden) / oranje (verbinden) / rood (niet verbonden), met tooltip.
  Nieuwe route `/api/status` pingt Bitvavo elke 30s.
- Marktbreed overzicht van grootste stijgers/dalers toegevoegd naast je
  eigen portfolio-bewegers (`fetchMarketMovers` in `lib/bitvavo.ts`).

## 1.0.1 — 2026-08-07

- Idee toegevoegd aan de roadmap: instelbare prijs-alerts per coin
  (`lib/ideas.ts`).

## 1.0.0 — 2026-08-07 — Fase 1

- Project gestart: Next.js + Tailwind, TypeScript.
- Live Bitvavo-koersen gekoppeld via de publieke `/v2/ticker/24h` endpoint
  (`lib/bitvavo.ts`), met graceful fallback als de API niet bereikbaar is.
- Componenten gebouwd:
  - `WalletSummary` — totale walletwaarde, dagverandering, beschikbaar saldo
  - `RiskSpectrum` — visuele meter met verdeling over 3 risiconiveaus
    (risicovol / relatief veilig / stabiel)
  - `HoldingsTable` — per coin: bezit, waarde, resultaat (plus/min), 24u-
    verandering, risicobadge
  - `PerformanceChart` — ontwikkeling van de wallet met uur/dag/week/maand-
    toggle (nog placeholder-data, zie "Bekende beperkingen" in README)
  - `TopMovers` — grootste stijger/daler van vandaag
  - `AlertsPanel` — visuele drempelmeldingen, geen automatische actie
- README met projectuitleg, bekende beperkingen en roadmap.
- Kleurenschema: licht/warm wit met zwarte tekst en donkerrood (#8b0000) als
  accentkleur, na mockup-review.
- Responsive gemaakt: holdings-tabel wordt op mobiel een gestapelde
  kaartenlijst, header en waardes schalen mee op kleine schermen.
- Echte holdings verwerkt: ETH en BAT, met gemiddelde aankoopprijs
  teruggerekend uit de Bitvavo-cijfers. Voorbeelddata (`mockPortfolio.ts`)
  vervangen door `lib/portfolio.ts`.
- Ideeën & roadmap-pagina toegevoegd op `/ideeen`, gegroepeerd per fase met
  statuslabels (`lib/ideas.ts`). Link staat in de dashboard-header.
- Dashboard live gezet op Vercel, gekoppeld aan GitHub
  (root directory: `crypto-dashboard`, framework preset: Next.js).
- Changelog toegevoegd (dit bestand).

## Ideeën die nog niet gebouwd zijn

Zie `/ideeen` in het dashboard zelf voor het volledige, actuele overzicht.
