import { getSummary } from "@/lib/data";
import { fmtInt } from "@/lib/format";
import { KpiCard } from "@/components/KpiCard";
import { RiskMap } from "@/components/RiskMap";
import { ArchetypeLegend } from "@/components/ArchetypeLegend";
import { TopTracksTable } from "@/components/TopTracksTable";
import { ExportActions } from "@/components/ExportActions";
import { getSources } from "@/lib/data";
import Link from "next/link";

export default function OverviewPage() {
  const s = getSummary();
  const meta = getSources();
  const freshness = new Date(s.generated_utc).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const states = Object.entries(s.state_avg_equity).slice(0, 8);
  const maxState = Math.max(...states.map(([, v]) => v));
  const criticalCount = s.tier_counts.Critical;
  const hpsaShare = Math.round((s.hpsa_coverage.scored_counties_with_active_hpsa / s.counties_scored) * 100);
  const topCounty = s.top_need_counties[0];

  return (
    <div className="mx-auto max-w-7xl px-6 pb-12">
      <section className="grid gap-8 pb-8 pt-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--accent-text)]">
            Population health · provider access · county strategy
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Mapping America&apos;s care-access deserts.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--text-secondary)]">
            CareShed ranks U.S. counties by where disease burden, care access, provider shortage, prevention gaps, and social vulnerability converge.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
            <Link
              href="/methodology"
              className="ds-focus-ring rounded-lg bg-[var(--accent-600)] px-4 py-2 font-semibold text-white transition-colors hover:bg-[var(--accent-700)]"
            >
              How the index works
            </Link>
            <span className="inline-flex items-center gap-1.5 text-[var(--text-tertiary)]">
              <span className="h-2 w-2 rounded-full bg-[var(--accent-500)]" />
              Data rebuilt {freshness}
            </span>
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--chrome-border)] bg-[#0a0a0a] p-5 text-white shadow-[var(--shadow-2)]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent-300)]">Executive summary</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
            <li><b className="text-white">{fmtInt(criticalCount)} counties</b> sit in the critical tier; target them first for network adequacy review and community-benefit planning.</li>
            <li><b className="text-white">{topCounty.county}, {topCounty.state}</b> is the highest-need county; validate local access barriers before capital or outreach commitments.</li>
            <li><b className="text-white">{hpsaShare}%</b> of scored counties have at least one active HRSA shortage designation; provider supply is now computed, not proposed.</li>
            <li><b className="text-white">{fmtInt(s.counties_excluded_insufficient_data)}</b> counties are excluded for insufficient PLACES burden estimates; treat national totals as high-coverage, not complete.</li>
          </ul>
        </div>
      </section>

      <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Counties scored" value={fmtInt(s.counties_scored)} sub="of 3,143 county equivalents" hint="Counties with enough CDC PLACES data to compute burden and access. Excluded counties are reported separately." />
        <KpiCard label="Population covered" value={fmtInt(s.population_covered)} sub="residents" hint="Total population across scored counties, not a claim of program reach." />
        <KpiCard label="Critical-need counties" value={fmtInt(s.tier_counts.Critical)} sub="highest relative tier" hint="Counties in the highest health-equity-need tier after the five-domain score is ranked." />
        <KpiCard label="Active HPSA coverage" value={`${hpsaShare}%`} sub={`${fmtInt(s.hpsa_coverage.scored_counties_with_active_hpsa)} scored counties`} hint="Share of scored counties joined to at least one active HRSA provider-shortage designation." />
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="rounded-xl border border-[var(--accent-border)] bg-[var(--accent-badge-bg)] p-5">
          <h2 className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">So what should a strategist do first?</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            Start with critical counties where high burden and provider shortage overlap, then compare the county profile before deciding whether the response is network expansion, mobile access, prevention outreach, or deeper local validation.
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-panel)] p-5">
          <h2 className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">Export for the meeting</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-tertiary)]">Print a decision brief from the current page or download the ranked county list as CSV.</p>
          <div className="mt-4"><ExportActions /></div>
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-4">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">Health-equity need map</h2>
          <p className="mt-1 text-sm text-[var(--text-tertiary)]">
            Toggle the score layer, hover for quick detail, or click a county for the five-domain profile.
          </p>
        </div>
        <RiskMap />
        <div className="mt-6">
          <ArchetypeLegend counts={s.tier_counts} />
        </div>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-panel)] p-6 shadow-[var(--shadow-1)]">
          <h2 className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">Highest-need states</h2>
          <p className="mt-1 text-sm text-[var(--text-tertiary)]">Mean county health-equity score.</p>
          <div className="mt-5 space-y-3">
            {states.map(([name, v]) => (
              <div key={name} className="flex items-center gap-3">
                <span className="w-12 shrink-0 text-sm font-medium text-[var(--text-secondary)]">{name}</span>
                <div className="h-6 flex-1 overflow-hidden rounded bg-[var(--bg-inset)]">
                  <div
                    className="flex h-full items-center justify-end rounded bg-[var(--accent-600)] pr-2 text-xs font-medium text-white"
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
          <h2 className="mb-4 text-lg font-semibold tracking-tight text-[var(--text-primary)]">Highest-need counties</h2>
          <TopTracksTable rows={s.top_need_counties} />
        </div>
      </section>

      <section className="mt-12 grid gap-5 lg:grid-cols-3">
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-panel)] p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--accent-text)]">How to use this</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            For a population-health strategist: identify the critical counties, inspect the profile, then prioritize market work where burden and access gaps align.
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-panel)] p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--accent-text)]">Data freshness and coverage</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            CDC PLACES and HRSA HPSA are public, keyless sources. HRSA coverage joins {fmtInt(s.hpsa_coverage.active_designations)} active designations; {fmtInt(s.counties_excluded_insufficient_data)} counties remain excluded for insufficient PLACES burden data.
          </p>
        </div>
        <div className="rounded-xl border border-amber-300 bg-amber-50/80 p-6 dark:border-amber-700 dark:bg-amber-950/40">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200">Computed vs. proposed</h2>
          <p className="mt-2 text-sm leading-6 text-amber-950/90 dark:text-amber-100/90">
            Computed today: {meta.computed_domains.join(", ")}. Proposed, not scored here: {meta.proposed_future_domains.join("; ")}.
          </p>
        </div>
      </section>
    </div>
  );
}
