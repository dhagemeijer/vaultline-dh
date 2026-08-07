import Link from "next/link";
import Image from "next/image";
import packageJson from "@/package.json";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mx-auto mt-16 max-w-5xl border-t border-hairline px-4 py-6 sm:px-6">
      <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-2 font-mono text-xs text-parchment/50">
          <Image src="/vaultline-monogram.png" alt="" width={40} height={40} className="h-4 w-4" aria-hidden="true" />
          <span>© {year} Dennis Hagemeijer · Vaultline</span>
        </div>
        <Link href="/changelog" className="font-mono text-xs text-parchment/40 underline hover:text-parchment/70">
          v{packageJson.version}
        </Link>
      </div>
    </footer>
  );
}
