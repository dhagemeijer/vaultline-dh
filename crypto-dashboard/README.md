# Crypto Wallet Dashboard — Fase 1

Persoonlijk dashboard voor je Bitvavo crypto-wallet. Live prijzen via de publieke
Bitvavo API (geen API-key nodig voor marktdata).

## Starten

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Wat zit er al in

- Walletoverzicht: coins, waarde, plus/min per positie (t.o.v. je aankoopprijs)
- Beschikbaar saldo
- Risicospreiding over 3 niveaus: risicovol / relatief veilig / stabiel
- Ontwikkeling van de wallet (uur/dag/week/maand-toggle)
- Grootste stijger/daler van vandaag
- Meldingen bij drempelwaarden (alleen visueel, geen automatische actie)

## Je eigen holdings invullen

Pas `lib/mockPortfolio.ts` aan met je eigen posities (coin, hoeveelheid,
gemiddelde aankoopprijs, risiconiveau) en je beschikbare saldo.

## Prijs-alerts instellen (belangrijk, na deployen)

Vanaf deze versie kun je op `/alerts` prijs-alerts instellen per coin, met
meldingen via het dashboard en/of echte push-notificaties. Om dit te laten
werken:

1. **Upstash Redis** — als je die al gekoppeld hebt (voor de eerdere
   login-poging), is dat voldoende; dezelfde database wordt nu gebruikt voor
   alerts, meldingen en push-abonnementen. Nog niet gekoppeld? Zie de
   instructies die je eerder kreeg (Vercel > Storage > Marketplace Database
   Storage > Upstash > Redis).
2. **VAPID-sleutels genereren** — draai lokaal (of vraag mij) `npx web-push
   generate-vapid-keys`. Voeg de twee gegenereerde sleutels toe als
   environment variables op Vercel:
   - `VAPID_PUBLIC_KEY`
   - `VAPID_PRIVATE_KEY`
   - `NEXT_PUBLIC_VAPID_PUBLIC_KEY` — dezelfde waarde als `VAPID_PUBLIC_KEY`
     (moet ook client-side beschikbaar zijn, vandaar de `NEXT_PUBLIC_`
     prefix)
3. **ALERTS_CRON_SECRET instellen** — een willekeurige string
   (`openssl rand -base64 24`) als environment variable, ter beveiliging van
   de check-route.
4. **Redeploy.**
5. **Externe cron-dienst koppelen** — Vercel's gratis plan staat geen
   cron vaker dan 1x/dag toe, dus gebruik een gratis externe dienst (bv.
   cron-job.org) om elke 15 minuten een GET-request te sturen naar:
   `https://<jouw-domein>/api/alerts/check`
   met header `Authorization: Bearer <ALERTS_CRON_SECRET>`.
6. Ga naar `/alerts`, maak een alert aan met kanaal "Push" of "Beide" — je
   browser vraagt dan om toestemming voor meldingen.

## Bekende beperkingen (bewust, voor fase 1)

- **Historische grafiek is placeholder-data.** Om de échte ontwikkeling van je
  wallet te tonen over uur/dag/week/maand moet er periodiek een "snapshot" van
  de walletwaarde worden opgeslagen (bv. elk uur, via een cron-job + database
  of simpele JSON-opslag). Dat bouwen we in een volgende stap.
- **Holdings zijn nu handmatig.** Om ze automatisch op te halen uit je Bitvavo
  account heb je een API-key + secret nodig (met alleen leesrechten aan te
  maken in je Bitvavo-instellingen). Dat koppelen we aan via een server-side
  API-route zodat de sleutel nooit in de browser komt.
- **Meldingen zijn alleen visueel.** Ze checken nog niet automatisch op de
  achtergrond (dat vraagt een server die continu draait) en sturen nog geen
  notificatie — dat is een logische volgende stap.

## Roadmap (uit onze ideeënlijst)

- Fase 2: eigen koop/verkoop-signalen (indicatoren) naast de huidige data
- Fase 3: geautomatiseerde bot via Bitvavo trading-API, inclusief:
  - core/satellite wallet-splitsing (lange termijn vs "meespelen")
  - 10%-bufferregel bij elke verkoop
  - automatische stop-loss bij drempelwaarden
- Later: spraakbediening op het dashboard
