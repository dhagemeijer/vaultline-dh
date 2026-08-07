export type IdeaStatus = "idee" | "gepland" | "in ontwikkeling" | "gebouwd";
export type IdeaPhase = "fase 1 — dashboard" | "fase 2 — signalen" | "fase 3 — bot" | "later";

export interface Idea {
  title: string;
  description: string;
  phase: IdeaPhase;
  status: IdeaStatus;
}

// Bewerk deze lijst om ideeën toe te voegen, aan te passen of de status te
// wijzigen. De /ideeen-pagina van het dashboard toont deze lijst direct.
export const ideas: Idea[] = [
  {
    title: "Historische snapshots",
    description:
      "Periodiek (bv. elk uur) de walletwaarde opslaan zodat de ontwikkelingsgrafiek echte data toont in plaats van placeholder-data.",
    phase: "fase 1 — dashboard",
    status: "gepland",
  },
  {
    title: "Klikbaar assetoverzicht",
    description:
      "Op een asset in het overzicht klikken toont de actuele/gedetailleerde stand van die ene asset.",
    phase: "fase 1 — dashboard",
    status: "gepland",
  },
  {
    title: "Eigen koop/verkoop-signalen",
    description:
      "Indicatoren (bv. RSI, moving averages) die koop/verkoop-suggesties tonen op het dashboard. Jij voert nog steeds zelf uit.",
    phase: "fase 2 — signalen",
    status: "idee",
  },
  {
    title: "Wallet-splitsing: lange termijn vs 'meespelen'",
    description:
      "Een deel van de wallet voor lange termijn investeringen, een deel om mee te 'spelen' met daytrading en meer risico.",
    phase: "fase 3 — bot",
    status: "idee",
  },
  {
    title: "10%-bufferregel bij verkoop",
    description:
      "Bij elke verkoop 10% van de opbrengst in de wallet laten staan als buffer/saldo voor nieuwe investeringen.",
    phase: "fase 3 — bot",
    status: "idee",
  },
  {
    title: "Login voor jezelf",
    description:
      "Eén beveiligde toegang (gebruiker dennis) met wachtwoord dat je zelf aanmaakt bij de eerste keer inloggen. Draait op Upstash Redis via de Vercel Marketplace. Eerder gebouwd maar teruggedraaid vanwege deploy-problemen met de bestandsstructuur (map met vierkante haken bracht GitHub's webuploader in de war); opnieuw oppakken zodra het project via git/GitHub Desktop gepusht kan worden.",
    phase: "fase 1 — dashboard",
    status: "idee",
  },
  {
    title: "Instelbare prijs-alerts per coin",
    description:
      "Zelf een alert instellen op een specifieke coin, die een melding geeft zodra deze een door jou opgegeven waarde bereikt.",
    phase: "fase 1 — dashboard",
    status: "idee",
  },
  {
    title: "Automatische marge / stop-loss",
    description:
      "Crypto standaard laten verkopen als de koers onder een bepaald niveau of percentage zakt. Fase 1 bouwt eerst alleen de mélding hiervoor.",
    phase: "fase 3 — bot",
    status: "idee",
  },
  {
    title: "Spraakbediening",
    description: "Met het dashboard kunnen communiceren via spraak in plaats van alleen tekst/klik.",
    phase: "later",
    status: "idee",
  },
];
