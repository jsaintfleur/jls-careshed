export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-[var(--border-default)] bg-[var(--bg-panel)]">
      <div className="mx-auto max-w-7xl px-6 py-10 text-sm text-ink-muted">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <p className="font-semibold text-ink">CareShed</p>
            <p className="mt-1.5 leading-relaxed">
              A portfolio project by Jean-Luc Saint-Fleur. Health-equity and care-access intelligence
              for population-health and payer strategy, built on public data.
            </p>
          </div>
          <div className="text-xs leading-relaxed">
            <p className="font-semibold uppercase tracking-wide text-ink-soft">Data source</p>
            <p className="mt-1.5">
              CDC PLACES — Local Data for Better Health, County Data (swc5-untb). Public domain.
              <br />Model-based small-area estimates; see Methodology for limits.
            </p>
          </div>
        </div>
        <p className="mt-8 border-t border-[var(--border-subtle)] pt-5 text-xs text-ink-faint">
          Demonstration analytics on public data. Not medical, clinical, or policy advice.
        </p>
      </div>
    </footer>
  );
}
