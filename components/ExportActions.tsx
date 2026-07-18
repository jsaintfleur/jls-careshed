"use client";

export function ExportActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => window.print()}
        className="ds-focus-ring rounded-lg bg-[var(--accent-600)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-700)]"
      >
        Download county brief
      </button>
      <a
        href="/data/ranked-counties.csv"
        download
        className="ds-focus-ring rounded-lg border border-[var(--border-default)] bg-[var(--bg-panel)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--bg-inset)]"
      >
        Export ranked CSV
      </a>
    </div>
  );
}
