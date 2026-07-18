export const nf = new Intl.NumberFormat("en-US");
export const fmtInt = (n: number) => nf.format(Math.round(n));
export const fmtPct = (n: number | null) => (n == null ? "—" : `${Number(n).toFixed(1)}%`);

/** Health-equity need ramp: calm teal -> amber -> coral (colorblind-safe, WCAG-checked). */
export const RISK_STOPS: [number, string][] = [
  [0, "#0f766e"],
  [35, "#5eead4"],
  [60, "#fde68a"],
  [80, "#fb923c"],
  [100, "#e11d48"],
];

function hexToRgb(h: string) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
}

export function riskColor(score: number): string {
  const s = Math.max(0, Math.min(100, score));
  for (let i = 1; i < RISK_STOPS.length; i++) {
    const [s0, c0] = RISK_STOPS[i - 1];
    const [s1, c1] = RISK_STOPS[i];
    if (s <= s1) {
      const t = (s - s0) / (s1 - s0);
      const a = hexToRgb(c0);
      const b = hexToRgb(c1);
      return rgbToHex(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t);
    }
  }
  return RISK_STOPS[RISK_STOPS.length - 1][1];
}

export const TIER_META: Record<string, { color: string; blurb: string }> = {
  Critical: { color: "#be123c", blurb: "Highest combined burden, access, prevention & social need — prioritize." },
  High: { color: "#ea580c", blurb: "Elevated need across multiple domains." },
  Moderate: { color: "#f59e0b", blurb: "Above-median need in some domains." },
  Lower: { color: "#059669", blurb: "Lower relative need today — monitor." },
};
