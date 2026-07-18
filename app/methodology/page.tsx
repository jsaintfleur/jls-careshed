import { getSources } from "@/lib/data";

export const metadata = { title: "Methodology & Data — CareShed" };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold tracking-tight text-ink">{title}</h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-ink-soft">{children}</div>
    </section>
  );
}

export default function MethodologyPage() {
  const meta = getSources();
  return (
    <div className="mx-auto max-w-3xl px-6 pb-8 pt-14">
      <h1 className="text-3xl font-semibold tracking-tight text-ink">Methodology &amp; Data</h1>
      <p className="mt-3 text-lg leading-relaxed text-ink-soft">
        CareShed is built to be auditable: every county score traces back to public CDC data through a
        reproducible pipeline. This page documents the sources, the index, and its limits.
      </p>

      <Section title="Data sources">
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-ink-muted">
                <th className="px-4 py-2.5 font-medium">Source</th>
                <th className="px-4 py-2.5 font-medium">Role</th>
                <th className="px-4 py-2.5 font-medium">License</th>
              </tr>
            </thead>
            <tbody>
              {meta.sources.map((s) => (
                <tr key={s.id} className="border-t border-slate-100">
                  <td className="px-4 py-2.5">
                    <a href={s.url} className="font-medium text-[var(--accent-text)] underline-offset-2 hover:underline" target="_blank" rel="noreferrer">
                      {s.name}
                    </a>
                    <span className="block text-xs text-ink-faint">{s.id}</span>
                  </td>
                  <td className="px-4 py-2.5 text-ink-soft">{s.role}</td>
                  <td className="px-4 py-2.5 text-ink-soft">{s.license}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Composite index construction">
        <p>The Health-Equity Need Score aggregates four percentile-normalized domains (higher = greater need):</p>
        <ol className="ml-5 list-decimal space-y-2">
          <li><b>Chronic burden (0.35)</b> — diabetes, high blood pressure, obesity, coronary heart disease, COPD, stroke.</li>
          <li><b>Access gap (0.30)</b> — uninsured rate, plus the shortfall in routine checkups and dental visits.</li>
          <li><b>Prevention gap (0.15)</b> — the unscreened share for cholesterol, colorectal cancer, and mammography.</li>
          <li><b>Social vulnerability (0.20)</b> — food and housing insecurity, transportation barriers, lack of social support.</li>
        </ol>
        <p>
          Each measure is oriented so higher means worse, converted to a percentile rank, averaged within its
          domain, then combined with a <b>weighted geometric mean</b> and re-ranked to a 0–100 score. Counties are
          tiered (Critical / High / Moderate / Lower) by score quantiles.
        </p>
      </Section>

      <Section title="Limitations (read before acting)">
        <ul className="ml-5 list-disc space-y-2">
          {meta.caveats.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
          <li><b>Model-based estimates.</b> PLACES values are modeled small-area estimates from survey data, not direct counts; confidence intervals widen for small populations.</li>
          <li><b>Weighting is a choice.</b> The domain weights are a documented v1 baseline; a sensitivity analysis and provider-shortage access data are the roadmap.</li>
          <li><b>Proposed enhancements not shown as results:</b> {meta.proposed_future_domains.join("; ")}.</li>
        </ul>
      </Section>

      <Section title="Reproducibility">
        <p>
          The pipeline is one command — <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[13px]">npm run data</code>{" "}
          (<code className="rounded bg-slate-100 px-1.5 py-0.5 text-[13px]">python3 scripts/build_index.py</code>) —
          pulling CDC PLACES, building the domains, computing the composite, and writing validated GeoJSON/JSON.
          No manual steps, no hand-edited numbers.
        </p>
      </Section>
    </div>
  );
}
