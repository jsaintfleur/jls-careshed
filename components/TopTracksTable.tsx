import { TIER_META, fmtPct } from "@/lib/format";
import type { Summary } from "@/lib/types";

export function TopTracksTable({ rows }: { rows: Summary["top_need_counties"] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--bg-panel)] shadow-[var(--shadow-1)]">
      <table className="w-full text-sm">
        <caption className="sr-only">
          Highest health-equity-need counties with state, tier, equity score, diabetes prevalence, uninsured rate, and provider shortage score.
        </caption>
        <thead>
          <tr className="border-b border-[var(--border-default)] bg-[var(--bg-inset)] text-left text-xs uppercase tracking-wide text-[var(--text-tertiary)]">
            <th scope="col" className="px-4 py-2.5 font-medium">County</th>
            <th scope="col" className="px-4 py-2.5 font-medium">Tier</th>
            <th scope="col" className="px-4 py-2.5 text-right font-medium">Equity need</th>
            <th scope="col" className="px-4 py-2.5 text-right font-medium">Diabetes</th>
            <th scope="col" className="px-4 py-2.5 text-right font-medium">Uninsured</th>
            <th scope="col" className="px-4 py-2.5 text-right font-medium">HPSA</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-inset)]">
              <td className="px-4 py-2.5 font-medium text-[var(--text-primary)]">
                {r.county}, {r.state}
              </td>
              <td className="px-4 py-2.5">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{ background: `${TIER_META[r.tier].color}18`, color: TIER_META[r.tier].color }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: TIER_META[r.tier].color }} />
                  {r.tier}
                </span>
              </td>
              <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-[var(--text-primary)]">{r.equity_score}</td>
              <td className="px-4 py-2.5 text-right tabular-nums text-[var(--text-secondary)]">{fmtPct(r.diabetes)}</td>
              <td className="px-4 py-2.5 text-right tabular-nums text-[var(--text-secondary)]">{fmtPct(r.uninsured)}</td>
              <td className="px-4 py-2.5 text-right tabular-nums text-[var(--text-secondary)]">{r.provider_shortage ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
