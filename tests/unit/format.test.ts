import { describe, it, expect } from "vitest";
import { riskColor, RISK_STOPS, TIER_META, fmtInt, fmtPct } from "@/lib/format";

describe("riskColor", () => {
  it("returns exact stop colors at anchors", () => {
    expect(riskColor(0).toLowerCase()).toBe(RISK_STOPS[0][1].toLowerCase());
    expect(riskColor(100).toLowerCase()).toBe(RISK_STOPS[RISK_STOPS.length - 1][1].toLowerCase());
  });
  it("clamps out-of-range input", () => {
    expect(riskColor(-20)).toBe(riskColor(0));
    expect(riskColor(200)).toBe(riskColor(100));
  });
  it("produces valid hex for interpolated values", () => {
    for (const s of [12, 47, 73, 91]) expect(riskColor(s)).toMatch(/^#[0-9a-f]{6}$/i);
  });
  it("moves warmer from low to high (red channel non-decreasing)", () => {
    const red = (h: string) => parseInt(h.slice(1, 3), 16);
    expect(red(riskColor(95))).toBeGreaterThan(red(riskColor(5)));
  });
});

describe("tier metadata", () => {
  it("defines all four tiers with color + blurb", () => {
    for (const t of ["Critical", "High", "Moderate", "Lower"]) {
      expect(TIER_META[t]?.color).toMatch(/^#[0-9a-f]{6}$/i);
      expect(TIER_META[t]?.blurb.length).toBeGreaterThan(10);
    }
  });
});

describe("formatters", () => {
  it("formats integers and percents", () => {
    expect(fmtInt(334914852)).toBe("334,914,852");
    expect(fmtPct(18)).toBe("18.0%");
    expect(fmtPct(null)).toBe("—");
  });
});
