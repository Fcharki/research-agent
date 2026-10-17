export default function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-2 px-4 py-6 sm:flex-row sm:items-center sm:px-6">
        <p className="text-sm text-ink">
          Research Agent, evidence-backed answers from the open web.
        </p>
        <p className="label-mono text-muted">
          Sources cited, never invented
        </p>
      </div>
    </footer>
  );
}
