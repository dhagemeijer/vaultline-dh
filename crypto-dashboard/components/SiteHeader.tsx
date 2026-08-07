import Link from "next/link";
import Image from "next/image";
import NotificationBell from "./NotificationBell";
import AlertsButton from "./AlertsButton";

export default function SiteHeader() {
  return (
    <div className="sticky top-0 z-50 bg-parchment shadow-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-[5px] py-[5px]">
        <Link href="/" aria-label="Vaultline — naar dashboard">
          <Image
            src="/vaultline-logo.png"
            alt="Vaultline — secure trading"
            width={368}
            height={171}
            className="h-16 w-auto sm:h-24"
            priority
          />
        </Link>
        <div className="flex items-center gap-1">
          <AlertsButton />
          <NotificationBell />
        </div>
      </div>
    </div>
  );
}
