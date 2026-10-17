"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import ThemeToggle from "./ThemeToggle";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/research", label: "Research" },
] as const;

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-[3px] bg-accent font-mono text-xs font-bold text-on-accent">
            RA
          </span>
          <span className="font-display text-base font-semibold tracking-tight">
            Research Agent
          </span>
        </Link>

        <div className="flex items-center gap-1.5">
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-[4px] px-3 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-accent-soft text-accent-ink"
                      : "text-muted hover:bg-elevated hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <span aria-hidden className="mx-1 h-5 w-px bg-line" />

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
