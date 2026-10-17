import { Fragment } from "react";
import Link from "next/link";

const CAPABILITIES = [
  "Web search",
  "Page fetch",
  "Tool trace",
  "Numbered citations",
  "SQLite history",
];

const STATS = [
  { value: "02", label: "agent tools" },
  { value: "04", label: "max iterations" },
  { value: "100%", label: "cited claims" },
];

const FEATURES = [
  {
    title: "Live web search",
    description:
      "The agent queries the web in real time and reads promising pages to gather first-hand evidence.",
  },
  {
    title: "Cited reports",
    description:
      "Every claim is tied to numbered sources, so an answer can be traced back to the page it came from.",
  },
  {
    title: "Visible agent steps",
    description:
      "See which tools ran and what they searched for while the answer is being assembled.",
  },
];

const STEPS = [
  {
    title: "Ask a question",
    description: "Describe what you want to understand in a sentence or two.",
  },
  {
    title: "The agent investigates",
    description:
      "It searches, fetches pages, and weighs the evidence within a bounded loop.",
  },
  {
    title: "Read the report",
    description:
      "Get a concise answer with numbered citations and the full source list.",
  },
];

const TRACE = [
  { tag: "[1]", tool: "search_web", detail: '"retrieval augmented generation"' },
  { tag: "[2]", tool: "fetch_page", detail: "arxiv.org/abs/…" },
  { tag: "[3]", tool: "fetch_page", detail: "acm.org/doi/…" },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Hero — split layout */}
      <section className="relative overflow-hidden border-b border-line bg-grid">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-paper/10 via-paper/60 to-paper"
        />
        <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:items-center lg:py-28">
          <div className="lg:col-span-7">
            <p className="label-mono text-accent">Autonomous web research</p>

            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.04] tracking-tight text-ink sm:text-6xl">
              Ask once.
              <br />
              Get an answer with{" "}
              <span className="text-accent">receipts</span>.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-muted">
              The agent searches the web, reads the sources, and writes a
              concise report with numbered citations you can verify.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/research"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[4px] bg-accent px-6 text-sm font-semibold text-on-accent shadow-hard-accent transition-transform hover:-translate-y-0.5"
              >
                Start researching
                <span aria-hidden>→</span>
              </Link>
              <a
                href="#pipeline"
                className="inline-flex h-12 items-center justify-center rounded-[4px] border border-line bg-surface px-6 text-sm font-semibold text-ink transition-colors hover:border-accent"
              >
                See the pipeline
              </a>
            </div>

            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-6">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="label-mono text-muted">{stat.label}</dt>
                  <dd className="mt-1 font-display text-2xl font-semibold text-ink">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Agent trace preview */}
          <div className="lg:col-span-5">
            <div className="border border-line bg-surface shadow-hard">
              <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                <span className="h-2.5 w-2.5 rounded-full bg-line" />
                <span className="h-2.5 w-2.5 rounded-full bg-line" />
                <span className="label-mono ml-2 text-muted">agent.trace</span>
              </div>

              <div className="space-y-3 p-4 font-mono text-xs leading-relaxed">
                {TRACE.map((line) => (
                  <p key={line.tag} className="flex gap-2">
                    <span className="text-accent">{line.tag}</span>
                    <span className="text-ink">{line.tool}</span>
                    <span className="truncate text-muted">{line.detail}</span>
                  </p>
                ))}
                <div className="border-t border-line pt-3 text-muted">
                  <span className="text-success">report</span> → 3 sources
                  cited
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capability strip */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 sm:px-6">
          {CAPABILITIES.map((capability, index) => (
            <Fragment key={capability}>
              {index > 0 && <span className="label-mono text-line">/</span>}
              <span className="label-mono text-muted">{capability}</span>
            </Fragment>
          ))}
        </div>
      </section>

      {/* Capabilities as definition rows */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <p className="label-mono text-accent">Capabilities</p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          What the agent does
        </h2>

        <div className="mt-10 divide-y divide-line border-y border-line">
          {FEATURES.map((feature, index) => (
            <div
              key={feature.title}
              className="grid gap-3 py-6 sm:grid-cols-12 sm:gap-6"
            >
              <span className="font-mono text-sm text-accent sm:col-span-1">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-lg font-medium text-ink sm:col-span-3">
                {feature.title}
              </h3>
              <p className="text-sm leading-6 text-muted sm:col-span-8">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pipeline */}
      <section id="pipeline" className="border-y border-line bg-surface">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <p className="label-mono text-accent">Pipeline</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            From question to citations
          </h2>

          <ol className="mt-12 grid gap-10 sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.title}>
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-line font-mono text-sm text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="h-px flex-1 bg-line" />
                </div>
                <h3 className="mt-4 font-display text-lg font-medium text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Inverted CTA band */}
      <section className="bg-ink text-paper">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-4 py-14 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="font-display text-2xl font-semibold">
              Have a question worth investigating?
            </h2>
            <p className="mt-2 text-sm text-paper/70">
              Open the workspace and get a cited answer in seconds.
            </p>
          </div>
          <Link
            href="/research"
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-[4px] bg-accent px-6 text-sm font-semibold text-on-accent transition-transform hover:-translate-y-0.5"
          >
            Open research workspace →
          </Link>
        </div>
      </section>
    </div>
  );
}
