"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Mark } from "./Mark";

const LINKS = [
  { href: "/", label: "Kalkış" },
  { href: "/gecmis", label: "Varış" },
  { href: "/siralama", label: "Hatlar" },
];

/** Salon saati. Sunucuda boş kalır, aksi halde hidrasyon uyuşmuyor. */
function HallClock() {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const read = () =>
      setNow(
        new Intl.DateTimeFormat("tr", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date()),
      );
    read();
    const id = setInterval(read, 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="numeric hidden text-xs text-char-2 tabular-nums sm:block">
      {now ?? "--:--"}
    </span>
  );
}

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-seam/95">
      <nav className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="text-char">
            <Mark />
          </span>
          <span className="font-display text-[17px] font-bold tracking-tight">
            habyte
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-1">
          {LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`meta border-b-2 px-3 py-2.5 transition-colors ${
                  active
                    ? "border-amber text-amber"
                    : "border-transparent hover:text-char-2"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <span className="ml-2 hidden h-4 w-px bg-rule sm:block" />
        <HallClock />
      </nav>
    </header>
  );
}
