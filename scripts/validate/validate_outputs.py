#!/usr/bin/env python3
"""Data-contract validation gate for CareShed outputs. Fails (exit 1) on missing/malformed artifacts."""
from __future__ import annotations
import json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PROC = ROOT / "data" / "processed"
errors: list[str] = []


def check(cond: bool, msg: str) -> None:
    if not cond:
        errors.append(msg)


def main() -> int:
    geo_p = PROC / "counties.geojson"
    sum_p = PROC / "summary.json"
    check(geo_p.exists(), "counties.geojson missing (run `npm run data`)")
    check(sum_p.exists(), "summary.json missing (run `npm run data`)")
    if errors:
        print("\n".join(errors)); return 1

    geo = json.loads(geo_p.read_text())
    check(geo.get("type") == "FeatureCollection", "geojson is not a FeatureCollection")
    feats = geo.get("features", [])
    check(len(feats) > 2500, f"expected >2500 counties, got {len(feats)}")

    tiers = {"Critical", "High", "Moderate", "Lower"}
    bad = 0
    for f in feats:
        p = f.get("properties", {})
        if "fips" not in p or "equity_score" not in p or "tier" not in p:
            bad += 1; continue
        es = p.get("equity_score")
        if es is None or not (0 <= es <= 100):
            bad += 1
        if p.get("tier") not in tiers:
            bad += 1
    check(bad == 0, f"{bad} features with missing/invalid fields")

    s = json.loads(sum_p.read_text())
    for k in ("counties_scored", "population_covered", "tier_counts", "top_need_counties"):
        check(k in s, f"summary.json missing key: {k}")
    check(sum(s["tier_counts"].values()) == s["counties_scored"], "tier counts do not sum to counties scored")

    if errors:
        print("VALIDATION FAILED:"); print("\n".join(f"  - {e}" for e in errors)); return 1
    print(f"VALIDATION PASSED — {len(feats)} counties mapped, all invariants hold.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
