import Link from "next/link";
import { ideas, IdeaPhase, IdeaStatus } from "@/lib/ideas";

const PHASE_ORDER: IdeaPhase[] = ["fase 1 — dashboard", "fase 2 — signalen", "fase 3 — bot", "later"];

const STATUS_STYLES: Record<IdeaStatus, string> = {
  idee: "border-hairline text-parchment/60",
  gepland: "border-safe text-safe",
  "in ontwikkeling": "border-risky text-risky",
  gebouwd: "border-parchment text-parchment bg-parchment/5",
};

export default function IdeasPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-parchment/40">Vaultline</p>
        <div className="flex items-baseline justify-between">
          <h1 className="font-display text-2xl italic text-parchment">Ideeën &amp; roadmap</h1>
          <Link href="/" className="font-mono text-xs text-parchment/50 hover:text-parchment">
            ← dashboard
          </Link>
        </div>
      </header>

      <div className="flex flex-col gap-10">
        {PHASE_ORDER.map((phase) => {
          const phaseIdeas = ideas.filter((i) => i.phase === phase);
          if (phaseIdeas.length === 0) return null;
          return (
            <section key={phase}>
              <h2 className="mb-4 font-display text-lg text-parchment/90">{phase}</h2>
              <div className="flex flex-col gap-3">
                {phaseIdeas.map((idea) => (
                  <div key={idea.title} className="rounded-2xl border border-hairline bg-panel p-4 sm:p-5">
                    <div className="mb-1.5 flex items-start justify-between gap-3">
                      <h3 className="font-display text-base">{idea.title}</h3>
                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-0.5 font-mono text-xs ${STATUS_STYLES[idea.status]}`}
                      >
                        {idea.status}
                      </span>
                    </div>
                    <p className="text-sm text-parchment/70">{idea.description}</p>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
