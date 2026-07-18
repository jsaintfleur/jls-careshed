import { getSources } from "@/lib/data";

export const metadata = { title: "Methodology & Data — CareShed" };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">{title}</h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-[var(--text-secondary)]">{children}</div>
    </section>
  );
}

export default function MethodologyPage() {
  const meta = getSources();
  return (
    <div className="mx-auto max-w-4xl px-6 pb-12 pt-12">
      <p className="text-sm font-semibold uppercase tracking-wider text-[var(--accent-text)]">Methodology and data</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">A defensible screen for county access investment.</h1>
      <p className="mt-3 max-w-3xl text-lg leading-relaxed text-[var(--text-secondary)]">
        CareShed is designed for strategy conversations where leaders need a ranked list, a clear reason why each place appears, and plain limits before they act.
      </p>

      <Section title="Data sources">
        <div className="overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--bg-panel)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--bg-inset)] text-left text-xs uppercase tracking-wide text-[var(--text-tertiary)]">
                <th className="px-4 py-2.5 font-medium">Source</th>
                <th className="px-4 py-2.5 font-medium">Role</th>
                <th className="px-4 py-2.5 font-medium">License</th>
              </tr>
            </thead>
            <tbody>
              {meta.sources.map((s) => (
                <tr key={s.id} className="border-t border-[var(--border-subtle)]">
                  <td className="px-4 py-2.5">
                    <a href={s.url} className="font-medium text-[var(--accent-text)] underline-offset-2 hover:underline" target="_blank" rel="noreferrer">
                      {s.name}
                    </a>
                    <span className="block text-xs text-[var(--text-tertiary)]">{s.id}</span>
                  </td>
                  <td className="px-4 py-2.5 text-[var(--text-secondary)]">{s.role}</td>
                  <td className="px-4 py-2.5 text-[var(--text-secondary)]">{s.license}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Composite index construction">
        <p>The Health-Equity Need Score aggregates five percentile-normalized domains. Higher always means greater relative need.</p>
        <ol className="ml-5 list-decimal space-y-2">
          <li><b>Chronic burden (0.30)</b> — diabetes, high blood pressure, obesity, coronary heart disease, COPD, stroke.</li>
          <li><b>Care access gap (0.22)</b> — uninsured rate, plus the shortfall in routine checkups and dental visits.</li>
          <li><b>Provider shortage (0.18)</b> — HRSA HPSA shortage score, using the highest active county-level designation signal.</li>
          <li><b>Prevention gap (0.12)</b> — the unscreened share for cholesterol, colorectal cancer, and mammography.</li>
          <li><b>Social vulnerability (0.18)</b> — food and housing insecurity, transportation barriers, lack of social support.</li>
        </ol>
        <p>
          Each measure is oriented so higher means worse, converted to a percentile rank, averaged within its
          domain, then combined with a <b>weighted geometric mean</b> and re-ranked to a 0-100 score. Counties are
          tiered (Critical / High / Moderate / Lower) by score quantiles.
        </p>
      </Section>

      <Section title="What to trust, and what to verify locally">
        <ul className="ml-5 list-disc space-y-2">
          {meta.caveats.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
          <li><b>Model-based estimates.</b> PLACES values are modeled small-area estimates from survey data, not direct counts; confidence intervals widen for small populations.</li>
          <li><b>Weighting is a choice.</b> The domain weights are a documented v1 baseline; a sensitivity analysis remains a proposed enhancement.</li>
          <li><b>Proposed enhancements not shown as results:</b> {meta.proposed_future_domains.join("; ")}.</li>
        </ul>
      </Section>

      <Section title="Reproducibility">
        <p>
          The pipeline is one command — <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[13px]">npm run data</code>{" "}
          (<code className="rounded bg-[var(--bg-inset)] px-1.5 py-0.5 text-[13px]">python3 scripts/build_index.py</code>) —
          pulling CDC PLACES and HRSA HPSA, building the domains, computing the composite, and writing validated GeoJSON/JSON/CSV.
          No manual steps, no hand-edited numbers.
        </p>
      </Section>
    </div>
  );
}
