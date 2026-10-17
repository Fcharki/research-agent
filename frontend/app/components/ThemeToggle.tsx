"use client";

function toggleTheme() {
  const root = document.documentElement;
  const next = !root.classList.contains("dark");

  root.classList.toggle("dark", next);
  root.style.colorScheme = next ? "dark" : "light";

  try {
    window.localStorage.setItem("theme", next ? "dark" : "light");
  } catch {
    // Storage may be unavailable (private mode); ignore.
  }
}

export default function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-line text-muted transition-colors hover:border-accent hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {/* Sun (light mode) */}
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        className="h-4 w-4 dark:hidden"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>

      {/* Moon (dark mode) */}
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        className="hidden h-4 w-4 dark:block"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
    </button>
  );
}
