import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
      <p className="label-mono text-accent">Error 404</p>
      <span className="mt-4 font-display text-[7rem] font-semibold leading-none tracking-tight text-ink sm:text-[9rem]">
        4<span className="text-accent">0</span>4
      </span>
      <h1 className="mt-6 font-display text-2xl font-semibold text-ink">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-3 max-w-md text-muted">
        The page may have been moved or never existed. Head back home or start a
        new research task instead.
      </p>
      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-[4px] bg-accent px-5 text-sm font-semibold text-on-accent shadow-hard-accent transition-transform hover:-translate-y-0.5"
        >
          Back to home
        </Link>
        <Link
          href="/research"
          className="inline-flex h-11 items-center justify-center rounded-[4px] border border-line bg-surface px-5 text-sm font-semibold text-ink transition-colors hover:border-accent"
        >
          Start research
        </Link>
      </div>
    </section>
  );
}
