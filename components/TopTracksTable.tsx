import { TIER_META, fmtPct } from "@/lib/format";
import type { Summary } from "@/lib/types";

export function TopTracksTable({ rows }: { rows: Summary["top_need_counties"] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-panel shadow-card">
      <table className="w-full text-sm">
        <caption className="sr-only">
          Highest health-equity-need counties with state, tier, equity score, diabetes prevalence, and uninsured rate.
        </caption>
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-ink-muted">
            <th scope="col" className="px-4 py-2.5 font-medium">County</th>
            <th scope="col" className="px-4 py-2.5 font-medium">Tier</th>
            <th scope="col" className="px-4 py-2.5 text-right font-medium">Equity need</th>
            <th scope="col" className="px-4 py-2.5 text-right font-medium">Diabetes</th>
            <th scope="col" className="px-4 py-2.5 text-right font-medium">Uninsured</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
              <td className="px-4 py-2.5 font-medium text-ink">
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
              <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-ink">{r.equity_score}</td>
              <td className="px-4 py-2.5 text-right tabular-nums text-ink-soft">{fmtPct(r.diabetes)}</td>
              <td className="px-4 py-2.5 text-right tabular-nums text-ink-soft">{fmtPct(r.uninsured)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
