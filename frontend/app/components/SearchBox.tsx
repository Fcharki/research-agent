"use client";

import type { FormEvent, KeyboardEvent } from "react";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

const MIN_LENGTH = 3;

export default function SearchBox({
  value,
  onChange,
  onSubmit,
  loading,
}: SearchBoxProps) {
  const canSubmit = !loading && value.trim().length >= MIN_LENGTH;

  function submit() {
    if (canSubmit) {
      onSubmit();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      submit();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-line bg-surface shadow-hard transition-shadow focus-within:shadow-hard-accent"
    >
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="h-2 w-2 rounded-full bg-accent" />
        <span className="label-mono text-muted">New inquiry</span>
      </div>

      <label htmlFor="research-question" className="sr-only">
        Research question
      </label>
      <textarea
        id="research-question"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        rows={3}
        placeholder="What do you want to research? e.g. How do retrieval-augmented agents reduce hallucinations?"
        className="w-full resize-none bg-transparent px-4 py-4 text-base leading-7 text-ink outline-none placeholder:text-muted/70"
      />

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3">
        <p className="label-mono text-muted">
          {value.trim().length < MIN_LENGTH
            ? `Enter at least ${MIN_LENGTH} characters`
            : "Ctrl / ⌘ + Enter to submit"}
        </p>
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center gap-2 rounded-[4px] bg-accent px-5 py-2.5 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <span
                aria-hidden
                className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-on-accent/40 border-t-on-accent"
              />
              Researching…
            </>
          ) : (
            <>
              Start research
              <span aria-hidden>→</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
