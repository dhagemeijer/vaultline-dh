import Link from "next/link";
import Image from "next/image";
import NotificationBell from "./NotificationBell";

export default function SiteHeader() {
  return (
    <div className="sticky top-0 z-50 bg-parchment shadow-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/" aria-label="Vaultline — naar dashboard">
          <Image
            src="/vaultline-logo.png"
            alt="Vaultline — secure trading"
            width={368}
            height={171}
            className="h-12 w-auto sm:h-16"
            priority
          />
        </Link>
        <NotificationBell />
      </div>
    </div>
  );
}
