"use client";

import { useState } from "react";

import Report from "@/app/components/Report";
import ResearchProgress from "@/app/components/ResearchProgress";
import SearchBox from "@/app/components/SearchBox";
import Sources from "@/app/components/Sources";
import { runResearch, type ResearchResult } from "@/app/lib/api";

export default function ResearchPage() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await runResearch(question.trim());
      setResult(data);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to complete research.",
      );
    } finally {
      setLoading(false);
    }
  }

  const hasOutput = loading || result !== null || error !== null;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-8">
        <p className="label-mono text-accent">Workspace</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink">
          Research workspace
        </h1>
        <p className="mt-3 max-w-xl text-muted">
          Ask a question. The agent searches the web, reads the sources, and
          returns a cited report.
        </p>
      </header>

      <SearchBox
        value={question}
        onChange={setQuestion}
        onSubmit={handleSubmit}
        loading={loading}
      />

      {error && (
        <div
          role="alert"
          className="mt-6 border-l-4 border-accent bg-accent-soft px-4 py-3 text-sm text-ink"
        >
          <strong className="font-semibold">Something went wrong.</strong>{" "}
          {error}
        </div>
      )}

      {hasOutput && (
        <div className="mt-10 space-y-10">
          <ResearchProgress
            loading={loading}
            steps={result?.steps ?? []}
          />

          {result && (
            <>
              <Report question={result.question} report={result.report} />
              <Sources sources={result.sources} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
