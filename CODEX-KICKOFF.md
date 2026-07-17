# CareShed Kickoff

## Expected Work Package

Copy `project-3-careshed.md` into this repo root as:

```text
WORKPACKAGE.md
```

## Kickoff Command

```text
Read WORKPACKAGE.md — the full package for CareShed, a care-access-desert map + health-equity composite index + explainable
county risk model. Execute CS-01 → CS-14 in order.

Pipeline: ingest CDC PLACES (county swc5-untb + tract cwsq-ngmh), HRSA shortage areas, County Health Rankings (carry the
NON-COMMERCIAL + attribution license flag prominently), Census ACS 5-year (CENSUS_API_KEY), and CDC WONDER as the independent
model target. Build: the Health-Equity composite index with weight sensitivity; an explainable gradient-boosted classifier
predicting high chronic-disease-mortality counties with SHAP outputs and calibration; and k-means/HDBSCAN county archetypes.
Handle PLACES long→wide, ACS MOE, and WONDER <10 suppression honestly.

App: Landing, Executive Overview (national bivariate choropleth hero, MapLibre), County/Tract Profile with SHAP waterfall,
Equity Explorer / Archetypes, Methodology & Data, About. CareShed emerald #059669 + clinical teal→amber diverging equity scale.
Frame all model metrics as measured-on-real-data, never asserted. Commit per ticket; pause for GitHub/Vercel credentials.
Confirm plan, then start CS-01.
```
