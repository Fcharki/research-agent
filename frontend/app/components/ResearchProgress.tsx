import type { AgentStep } from "@/app/lib/api";

interface ResearchProgressProps {
  loading: boolean;
  steps: AgentStep[];
}

const TOOL_LABELS: Record<string, string> = {
  search_web: "Searching the web",
  fetch_page: "Reading a page",
};

function describeStep(step: AgentStep): string {
  const label = TOOL_LABELS[step.tool] ?? step.tool;

  const query = step.arguments?.query;
  const url = step.arguments?.url;

  if (typeof query === "string" && query) {
    return `${label}: ${query}`;
  }

  if (typeof url === "string" && url) {
    return `${label}: ${url}`;
  }

  return label;
}

export default function ResearchProgress({
  loading,
  steps,
}: ResearchProgressProps) {
  if (!loading && steps.length === 0) {
    return null;
  }

  return (
    <section
      aria-live="polite"
      className="border border-line bg-surface shadow-hard"
    >
      <header className="flex items-center gap-3 border-b border-line px-4 py-3">
        {loading ? (
          <span
            aria-hidden
            className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-accent/30 border-t-accent"
          />
        ) : (
          <span className="flex h-4 w-4 items-center justify-center rounded-[3px] bg-success text-[10px] text-on-accent">
            ✓
          </span>
        )}
        <h2 className="label-mono text-ink">
          {loading ? "Agent is working…" : "Agent activity"}
        </h2>
      </header>

      {steps.length > 0 && (
        <ol className="divide-y divide-line">
          {steps.map((step, index) => (
            <li
              key={index}
              className="flex items-start gap-3 px-4 py-3 text-sm"
            >
              <span className="mt-0.5 w-8 shrink-0 font-mono text-xs text-accent">
                {String(step.iteration).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="font-medium text-ink">{step.tool}</p>
                <p className="mt-0.5 break-words text-muted">
                  {describeStep(step)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}

      {loading && steps.length === 0 && (
        <p className="px-4 py-4 text-sm text-muted">
          Searching for sources and reading pages. This can take a moment.
        </p>
      )}
    </section>
  );
}
