import type { Source } from "@/app/lib/api";

interface SourcesProps {
  sources: Source[];
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function dedupe(sources: Source[]): Source[] {
  const seen = new Set<string>();

  return sources.filter((source) => {
    if (!source.url || seen.has(source.url)) {
      return false;
    }
    seen.add(source.url);
    return true;
  });
}

export default function Sources({ sources }: SourcesProps) {
  const unique = dedupe(sources);

  if (unique.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="label-mono text-muted">
          Sources · {String(unique.length).padStart(2, "0")}
        </h2>
        <span className="h-px flex-1 bg-line" />
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {unique.map((source, index) => (
          <li key={`${source.url}-${index}`}>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col border border-line bg-surface p-4 transition-shadow hover:shadow-hard-accent"
            >
              <span className="label-mono text-accent">
                [{index + 1}] {hostname(source.url)}
              </span>
              <span className="mt-2 line-clamp-2 font-display text-base font-medium leading-snug text-ink">
                {source.title || source.url}
              </span>
              {source.snippet && (
                <span className="mt-2 line-clamp-3 text-sm leading-6 text-muted">
                  {source.snippet}
                </span>
              )}
              <span
                aria-hidden
                className="mt-auto pt-3 text-sm text-accent opacity-0 transition-opacity group-hover:opacity-100"
              >
                Open source →
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
