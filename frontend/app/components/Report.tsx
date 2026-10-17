import type { ReactNode } from "react";

interface ReportProps {
  question: string;
  report: string;
}

const CITATION_SPLIT = /(\[\d+\])/g;
const CITATION_MARKER = /^\[\d+\]$/;

function renderParagraph(text: string, key: number): ReactNode {
  const parts = text.split(CITATION_SPLIT);

  return (
    <p key={key} className="text-[15px] leading-7 text-ink/90">
      {parts.map((part, index) =>
        CITATION_MARKER.test(part) ? (
          <span
            key={index}
            className="mx-0.5 inline-block rounded-[3px] bg-accent-soft px-1.5 font-mono text-xs font-semibold text-accent-ink"
          >
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </p>
  );
}

export default function Report({ question, report }: ReportProps) {
  const paragraphs = report
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <article className="relative border border-line bg-surface p-6 shadow-hard sm:p-9">
      <span aria-hidden className="absolute inset-y-0 left-0 w-1.5 bg-accent" />

      <header className="border-b border-line pb-5">
        <p className="label-mono text-accent">Research report</p>
        <h2 className="mt-2 font-display text-2xl leading-snug text-ink">
          {question}
        </h2>
      </header>

      <div className="mt-6 space-y-5">
        {paragraphs.length > 0 ? (
          paragraphs.map(renderParagraph)
        ) : (
          <p className="text-muted">
            The agent did not return any report content.
          </p>
        )}
      </div>
    </article>
  );
}
