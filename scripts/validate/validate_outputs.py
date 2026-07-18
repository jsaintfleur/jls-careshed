#!/usr/bin/env python3
"""Data-contract validation gate for CareShed outputs. Fails (exit 1) on missing/malformed artifacts."""
from __future__ import annotations
import json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PROC = ROOT / "data" / "processed"
META = ROOT / "data" / "metadata"
PUBLIC = ROOT / "public" / "data"
errors: list[str] = []


def check(cond: bool, msg: str) -> None:
    if not cond:
        errors.append(msg)


def main() -> int:
    geo_p = PROC / "counties.geojson"
    sum_p = PROC / "summary.json"
    csv_p = PROC / "ranked-counties.csv"
    meta_p = META / "sources.json"
    check(geo_p.exists(), "counties.geojson missing (run `npm run data`)")
    check(sum_p.exists(), "summary.json missing (run `npm run data`)")
    check(csv_p.exists(), "ranked-counties.csv missing (run `npm run data`)")
    check(meta_p.exists(), "sources.json missing (run `npm run data`)")
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
        required = ("fips", "equity_score", "tier", "p_provider", "provider_raw", "provider_designations")
        if any(k not in p for k in required):
            bad += 1; continue
        es = p.get("equity_score")
        if es is None or not (0 <= es <= 100):
            bad += 1
        if p.get("p_provider") is None or not (0 <= p.get("p_provider") <= 1):
            bad += 1
        if p.get("provider_raw") is None or not (0 <= p.get("provider_raw") <= 26):
            bad += 1
        if p.get("tier") not in tiers:
            bad += 1
    check(bad == 0, f"{bad} features with missing/invalid fields")

    s = json.loads(sum_p.read_text())
    for k in ("counties_scored", "population_covered", "tier_counts", "top_need_counties", "weights", "hpsa_coverage"):
        check(k in s, f"summary.json missing key: {k}")
    check(sum(s["tier_counts"].values()) == s["counties_scored"], "tier counts do not sum to counties scored")
    check("provider" in s["weights"], "summary weights missing provider shortage domain")
    check(s["hpsa_coverage"]["scored_counties_with_active_hpsa"] > 0, "HPSA coverage did not match any scored counties")
    check(csv_p.read_text().splitlines()[0].startswith("fips,county,state,equity_score"), "ranked CSV header malformed")

    meta = json.loads(meta_p.read_text())
    check("Provider Shortage" in meta.get("computed_domains", []), "metadata does not mark Provider Shortage as computed")
    check("HRSA provider-shortage (careshed access)" not in meta.get("proposed_future_domains", []),
          "HRSA provider shortage is still labeled proposed")
    for public_name in ("counties.geojson", "summary.json", "sources.json", "ranked-counties.csv"):
        check((PUBLIC / public_name).exists(), f"public/data/{public_name} missing")

    if errors:
        print("VALIDATION FAILED:"); print("\n".join(f"  - {e}" for e in errors)); return 1
    print(f"VALIDATION PASSED — {len(feats)} counties mapped, all invariants hold.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
