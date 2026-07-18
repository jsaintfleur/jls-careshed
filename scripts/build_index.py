#!/usr/bin/env python3
"""
CareShed — data pipeline (v1, US county live demo)
==================================================
Builds a county-level Health-Equity & Access Gap Index from CDC PLACES (keyless, public),
mapped onto US counties, and exports validated GeoJSON/JSON the Next.js app consumes.

Sources (public domain, no API key required):
  - CDC PLACES County (2025 release) .... Socrata swc5-untb (data.cdc.gov)
  - US county boundaries (FIPS) ......... public cartographic-boundary GeoJSON

Method (documented in docs/METHODOLOGY.md):
  Four domains, percentile-normalized so higher = greater need, combined with a weighted
  geometric mean into a 0-100 Health-Equity Gap score:
    1. Chronic Burden      = diabetes, high BP, obesity, CHD, COPD, stroke
    2. Access Gap          = uninsured (ACCESS2), no routine checkup, no dental visit
    3. Prevention Gap      = unscreened: cholesterol, colorectal, mammography
    4. Social Vulnerability= food/housing insecurity, transport barriers, lack of support
  A burden x access 2x2 assigns each county a care archetype; counties are tiered by need.

Keyless demo. The full CareShed model adds HRSA provider-shortage (careshed access),
Census ACS social vulnerability, and a CDC-WONDER-validated explainable risk model; those
are documented as proposed enhancements and clearly not shown as results here.
"""
from __future__ import annotations
import json, time
from pathlib import Path
import numpy as np
import pandas as pd
import requests

ROOT = Path(__file__).resolve().parents[1]
PROC = ROOT / "data" / "processed"
META = ROOT / "data" / "metadata"
for d in (PROC, META):
    d.mkdir(parents=True, exist_ok=True)

PLACES = "https://data.cdc.gov/resource/swc5-untb.json"
COUNTIES_GEOJSON = "https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json"

# measureid -> (domain, invert?)  invert=True means "higher raw value is GOOD", so we flip to a gap.
MEASURES = {
    "DIABETES": ("burden", False), "BPHIGH": ("burden", False), "OBESITY": ("burden", False),
    "CHD": ("burden", False), "COPD": ("burden", False), "STROKE": ("burden", False),
    "ACCESS2": ("access", False), "CHECKUP": ("access", True), "DENTAL": ("access", True),
    "CHOLSCREEN": ("prevention", True), "COLON_SCREEN": ("prevention", True), "MAMMOUSE": ("prevention", True),
    "FOODINSECU": ("social", False), "HOUSINSECU": ("social", False),
    "LACKTRPT": ("social", False), "EMOTIONSPT": ("social", False),
}
DOMAIN_WEIGHTS = {"burden": 0.35, "access": 0.30, "prevention": 0.15, "social": 0.20}


def fetch_places() -> pd.DataFrame:
    print("[ingest] CDC PLACES county measures ...")
    ids = ",".join(f"'{m}'" for m in MEASURES)
    r = requests.get(PLACES, params={
        "$select": "locationid, locationname, stateabbr, measureid, data_value, data_value_type, totalpopulation, year",
        "$where": f"measureid in ({ids}) AND data_value IS NOT NULL",
        "$limit": 400000,
    }, timeout=180)
    r.raise_for_status()
    df = pd.DataFrame(r.json())
    df["data_value"] = pd.to_numeric(df["data_value"], errors="coerce")
    df["year"] = pd.to_numeric(df["year"], errors="coerce")
    df["totalpopulation"] = pd.to_numeric(df["totalpopulation"], errors="coerce")
    # Prefer age-adjusted prevalence for cross-county comparability; else crude.
    df["adj"] = df["data_value_type"].str.contains("Age-adjusted", case=False, na=False).astype(int)
    df = (df.sort_values(["adj", "year"])
            .groupby(["locationid", "measureid"], as_index=False).last())
    print(f"  -> {df['locationid'].nunique()} counties, {len(df)} county-measure rows")
    return df


def fetch_counties() -> dict:
    print("[ingest] US county geometry ...")
    g = requests.get(COUNTIES_GEOJSON, timeout=120).json()
    print(f"  -> {len(g['features'])} county polygons")
    return g


def pct_rank(s: pd.Series) -> pd.Series:
    return s.rank(method="average", pct=True).clip(lower=0.01, upper=1.0)


def build() -> None:
    df = fetch_places()
    gj = fetch_counties()

    wide = df.pivot_table(index=["locationid", "locationname", "stateabbr", "totalpopulation"],
                          columns="measureid", values="data_value", aggfunc="last").reset_index()
    # Orient every measure so higher = worse (gap), inverting the "good" ones.
    for m, (dom, inv) in MEASURES.items():
        if m in wide.columns:
            wide[m] = (100 - wide[m]) if inv else wide[m]

    # Domain scores = mean of that domain's available measures, then percentile-normalized.
    domains = {}
    for dom in DOMAIN_WEIGHTS:
        cols = [m for m, (d, _) in MEASURES.items() if d == dom and m in wide.columns]
        wide[f"{dom}_raw"] = wide[cols].mean(axis=1)
        domains[dom] = f"p_{dom}"
        wide[f"p_{dom}"] = pct_rank(wide[f"{dom}_raw"])

    # Composite = weighted geometric mean over AVAILABLE domains (renormalized weights),
    # so a county missing one domain is still scored on the rest rather than dropped to NaN.
    num = pd.Series(0.0, index=wide.index)
    den = pd.Series(0.0, index=wide.index)
    for dom, w in DOMAIN_WEIGHTS.items():
        p = wide[f"p_{dom}"]
        m = p.notna()
        num.loc[m] += w * np.log(p[m])
        den.loc[m] += w
    wide["composite_pct"] = np.where(den > 0, np.exp(num / den.replace(0, np.nan)), np.nan)
    # The chronic-burden and access domains are mandatory for a headline score (they are the
    # core of health-equity need). Counties whose PLACES data suppresses burden are excluded as
    # "insufficient data" and reported, rather than ranked on partial domains.
    before = len(wide)
    wide = wide[wide["p_burden"].notna() & wide["p_access"].notna()].copy()
    excluded_insufficient = before - len(wide)
    if excluded_insufficient:
        print(f"  [note] excluded {excluded_insufficient} counties with insufficient data (no chronic-burden estimates)")
    wide["equity_score"] = (wide["composite_pct"].rank(pct=True) * 100).round(1)

    # Need tiers (quantiles) + burden x access 2x2 archetype.
    q = wide["equity_score"].quantile([0.5, 0.75, 0.9]).to_dict()
    wide["tier"] = np.select(
        [wide["equity_score"] >= q[0.9], wide["equity_score"] >= q[0.75], wide["equity_score"] >= q[0.5]],
        ["Critical", "High", "Moderate"], default="Lower")
    b_hi = wide["p_burden"] >= wide["p_burden"].median()
    a_hi = wide["p_access"] >= wide["p_access"].median()
    wide["archetype"] = np.select(
        [b_hi & a_hi, b_hi & ~a_hi, ~b_hi & a_hi],
        ["Burdened & under-served", "Burdened, better access", "Healthier, under-served"],
        default="Lower need")

    wide["fips"] = wide["locationid"].astype(str).str.zfill(5)
    by_fips = {r["fips"]: r for r in wide.to_dict("records")}

    fields = ["equity_score", "tier", "archetype", "locationname", "stateabbr", "totalpopulation",
              "burden_raw", "access_raw", "prevention_raw", "social_raw",
              "p_burden", "p_access", "p_prevention", "p_social",
              "DIABETES", "BPHIGH", "OBESITY", "ACCESS2"]
    feats = []
    for f in gj["features"]:
        fips = str(f.get("id", "")).zfill(5)
        if fips not in by_fips:
            continue
        row = by_fips[fips]
        props = {"fips": fips}
        for k in fields:
            v = row.get(k)
            if isinstance(v, float):
                v = None if (pd.isna(v) or np.isinf(v)) else round(v, 2)
            props[k] = v
        feats.append({"type": "Feature", "geometry": f["geometry"], "properties": props})
    (PROC / "counties.geojson").write_text(json.dumps({"type": "FeatureCollection", "features": feats}))

    top = wide.sort_values("equity_score", ascending=False).head(15)
    summary = {
        "generated_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "geography": "United States counties (CDC PLACES 2025 release)",
        "counties_scored": int(len(wide)),
        "counties_mapped": int(len(feats)),
        "counties_excluded_insufficient_data": int(excluded_insufficient),
        "population_covered": int(wide["totalpopulation"].sum()),
        "tier_counts": wide["tier"].value_counts().to_dict(),
        "archetype_counts": wide["archetype"].value_counts().to_dict(),
        "state_avg_equity": wide.groupby("stateabbr")["equity_score"].mean().round(1).sort_values(ascending=False).head(12).to_dict(),
        "weights": DOMAIN_WEIGHTS,
        "top_need_counties": [
            {"county": r["locationname"], "state": r["stateabbr"], "equity_score": r["equity_score"],
             "tier": r["tier"], "archetype": r["archetype"],
             "diabetes": r.get("DIABETES"), "uninsured": r.get("ACCESS2")}
            for r in top.to_dict("records")
        ],
    }
    (PROC / "summary.json").write_text(json.dumps(summary, indent=2, default=str))

    metadata = {
        "sources": [
            {"name": "CDC PLACES — County (2025 release)", "id": "swc5-untb",
             "license": "CDC open data / U.S. Government work (public domain)",
             "url": "https://data.cdc.gov/500-Cities-Places/PLACES-Local-Data-for-Better-Health-County-Data-20/swc5-untb",
             "role": "Chronic burden, access, prevention, and social-need measures (model-based small-area estimates)"},
            {"name": "US county cartographic boundaries (FIPS)", "id": "geojson-counties-fips",
             "license": "Public domain (U.S. Census cartographic boundaries)",
             "url": "https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json",
             "role": "County geometry + FIPS join spine"},
        ],
        "computed_domains": ["Chronic Burden", "Access Gap", "Prevention Gap", "Social Vulnerability"],
        "proposed_future_domains": ["HRSA provider-shortage (careshed access)", "Census ACS social vulnerability",
                                     "CDC WONDER-validated explainable risk model with SHAP"],
        "caveats": ["PLACES values are model-based small-area estimates, not direct counts.",
                    "Age-adjusted prevalence preferred for cross-county comparability where available."],
    }
    (META / "sources.json").write_text(json.dumps(metadata, indent=2))

    print(f"\n[done] scored {len(wide)} counties -> data/processed/counties.geojson")
    print("Tiers:", summary["tier_counts"])
    print("Top-need example:", summary["top_need_counties"][0])


if __name__ == "__main__":
    build()
