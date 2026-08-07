import Link from "next/link";
import Image from "next/image";
import packageJson from "@/package.json";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-hairline bg-ink">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 py-5 text-center sm:flex-row sm:justify-between sm:px-6 sm:py-4 sm:text-left">
        <div className="flex items-center gap-2.5 font-mono text-xs text-parchment/60">
          <Image src="/vaultline-monogram.png" alt="" width={40} height={40} className="h-9 w-9" aria-hidden="true" />
          <span>© {year} Vaultline</span>
        </div>
        <Link href="/changelog" className="font-mono text-xs text-parchment/50 underline hover:text-parchment/80">
          v{packageJson.version}
        </Link>
      </div>
    </footer>
  );
}
