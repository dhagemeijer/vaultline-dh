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
