import fs from "fs";
import path from "path";
import Link from "next/link";
import packageJson from "@/package.json";

function renderChangelog(markdown: string) {
  const lines = markdown.split("\n");
  const blocks: JSX.Element[] = [];
  let listItems: string[] = [];

  const flushList = (key: string) => {
    if (listItems.length > 0) {
      blocks.push(
        <ul key={key} className="mb-4 ml-4 list-disc space-y-1 text-sm text-parchment/70">
          {listItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, idx) => {
    if (line.startsWith("## ")) {
      flushList(`ul-${idx}`);
      blocks.push(
        <h2 key={idx} className="mb-3 mt-8 font-display text-lg text-parchment first:mt-0">
          {line.replace(/^##\s*/, "")}
        </h2>
      );
    } else if (line.startsWith("# ")) {
      // top-level title, skip (page already has its own heading)
    } else if (line.trim().startsWith("- ")) {
      listItems.push(line.trim().replace(/^-\s*/, "").replace(/`/g, ""));
    } else if (line.trim().length > 0) {
      flushList(`ul-${idx}`);
      blocks.push(
        <p key={idx} className="mb-3 text-sm text-parchment/60">
          {line.trim()}
        </p>
      );
    }
  });
  flushList("ul-end");

  return blocks;
}

export default function ChangelogPage() {
  const filePath = path.join(process.cwd(), "CHANGELOG.md");
  const markdown = fs.readFileSync(filePath, "utf-8");
  const blocks = renderChangelog(markdown);

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-parchment/40">Vaultline</p>
        <div className="flex items-baseline justify-between">
          <h1 className="font-display text-2xl italic text-parchment">Changelog</h1>
          <Link href="/" className="font-mono text-xs text-parchment/50 hover:text-parchment">
            ← dashboard
          </Link>
        </div>
        <p className="mt-1 font-mono text-xs text-parchment/40">Huidige versie: {packageJson.version}</p>
      </header>

      <div>{blocks}</div>
    </main>
  );
}
