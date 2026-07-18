import { TIER_META, fmtInt } from "@/lib/format";

export function ArchetypeLegend({ counts }: { counts: Record<string, number> }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {(["Critical", "High", "Moderate", "Lower"] as const).map((name) => {
        const meta = TIER_META[name];
        return (
          <div key={name} className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-panel)] p-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm" style={{ background: meta.color }} aria-hidden />
              <span className="text-sm font-semibold text-[var(--text-primary)]">{name} need</span>
              <span className="ml-auto text-sm tabular-nums text-[var(--text-tertiary)]">{fmtInt(counts[name] ?? 0)}</span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-tertiary)]">{meta.blurb}</p>
          </div>
        );
      })}
    </div>
  );
}
