import { getSummary } from "@/lib/data";
import { fmtInt } from "@/lib/format";
import { KpiCard } from "@/components/KpiCard";
import { RiskMap } from "@/components/RiskMap";
import { ArchetypeLegend } from "@/components/ArchetypeLegend";
import { TopTracksTable } from "@/components/TopTracksTable";
import Link from "next/link";

export default function OverviewPage() {
  const s = getSummary();
  const freshness = new Date(s.generated_utc).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const states = Object.entries(s.state_avg_equity).slice(0, 8);
  const maxState = Math.max(...states.map(([, v]) => v));

  return (
    <div className="mx-auto max-w-7xl px-6">
      <section className="pt-14 pb-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">
          Population Health · Health Equity
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Mapping America&apos;s care-access deserts.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
          CareShed scores every U.S. county on health-equity need — combining chronic-disease burden,
          care access, prevention gaps, and social vulnerability into one transparent index, so scarce
          resources reach the communities that need them most.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
          <Link
            href="/methodology"
            className="rounded-lg bg-brand-700 px-4 py-2 font-medium text-white transition-colors hover:bg-brand-800"
          >
            How the index works
          </Link>
          <span className="inline-flex items-center gap-1.5 text-ink-muted">
            <span className="h-2 w-2 rounded-full bg-brand-500" />
            Data current as of {freshness}
          </span>
        </div>
      </section>

      <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Counties scored" value={fmtInt(s.counties_scored)} sub="US counties" hint="Counties with a computable health-equity score from CDC PLACES." />
        <KpiCard label="Population covered" value={fmtInt(s.population_covered)} sub="residents" hint="Total population across scored counties." />
        <KpiCard label="Critical-need counties" value={fmtInt(s.tier_counts.Critical)} sub="top-decile need" hint="Counties in the highest health-equity-need tier." />
        <KpiCard label="States (highest need)" value={states[0] ? states[0][0] : "—"} sub={`avg score ${states[0] ? states[0][1] : ""}`} hint="State with the highest average county health-equity need." />
      </section>

      <section className="mt-12">
        <div className="mb-4">
          <h2 className="text-xl font-semibold tracking-tight text-ink">Health-equity need map</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Toggle between overall equity need and the care-access gap. Hover a county for detail.
          </p>
        </div>
        <RiskMap />
        <div className="mt-6">
          <ArchetypeLegend counts={s.tier_counts} />
        </div>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="rounded-xl border border-slate-200 bg-panel p-6 shadow-card">
          <h2 className="text-lg font-semibold tracking-tight text-ink">Highest-need states</h2>
          <p className="mt-1 text-sm text-ink-muted">Mean county health-equity score.</p>
          <div className="mt-5 space-y-3">
            {states.map(([name, v]) => (
              <div key={name} className="flex items-center gap-3">
                <span className="w-12 shrink-0 text-sm font-medium text-ink-soft">{name}</span>
                <div className="h-6 flex-1 overflow-hidden rounded bg-slate-100">
                  <div
                    className="flex h-full items-center justify-end rounded bg-brand-600 pr-2 text-xs font-medium text-white"
                    style={{ width: `${(v / maxState) * 100}%` }}
                  >
                    {v}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold tracking-tight text-ink">Highest-need counties</h2>
          <TopTracksTable rows={s.top_need_counties} />
        </div>
      </section>

      <section className="mt-12 rounded-xl border border-amber-200 bg-amber-50/70 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-800">
          What is computed vs. proposed
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-amber-900/90">
          Every number here is computed from CDC PLACES public data. This v1 index blends four domains —
          chronic burden, care access, prevention gaps, and social vulnerability. The full CareShed model
          adds HRSA provider-shortage areas (careshed access), Census ACS social vulnerability, and a
          CDC-WONDER-validated explainable risk model with SHAP explanations; those are labeled as planned
          enhancements, not shown here as results.
        </p>
      </section>
    </div>
  );
}
