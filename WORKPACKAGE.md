# Project 3 — CareShed

**Mapping America's care-access deserts and scoring the equity gap, county by county.**

Portfolio owner: **Jean-Luc Saint-Fleur** · Role for this package: **Product Strategist + Analytics Lead**
Sector: **Healthcare / Public Health** · Status: **Implementation-ready specification** · Datasets verified **July 2026**

> **License flag (read first):** County Health Rankings & Roadmaps (CHR) is **free for personal / nonprofit / educational / research / public-health use WITH ATTRIBUTION, but COMMERCIAL USE IS PROHIBITED** (including AI training for commercial products). CareShed is a non-commercial portfolio artifact and uses CHR **with attribution** only. This flag is carried through the PRD, methodology page, and repo docs. All other datasets (CDC PLACES, HRSA, Census ACS, CDC WONDER) are public-domain / unrestricted.

---

## PART 1 — Product One-Pager

### The problem
Chronic-disease burden and provider supply are **spatially mismatched**. The counties with the highest diabetes, hypertension, COPD, and preventable-mortality burden are frequently the same counties with the fewest primary-care, dental, and mental-health providers — and the least transportation and insurance coverage to reach them. Leaders who allocate scarce care resources (clinics, telehealth, mobile units, FQHC partnerships, grant dollars) lack a **single defensible view** that combines **access + outcome burden + social vulnerability** at the county and tract grain.

### The product
CareShed is a **map-first analytics application** that fuses five authoritative public datasets into one **Health-Equity Index** and a set of **care-access desert** maps. It ranks and explains where the care gap is worst, predicts which counties carry the highest chronic-disease mortality risk (with transparent SHAP driver explanations), and segments the country into interpretable **county archetypes** to guide targeted intervention.

### Who it serves
Population-health strategists · payer network / market analysts · hospital community-benefit & CHNA teams · public-health epidemiologists · health-equity officers.

### The five decisions it supports
1. **Site & modality selection** — where to place or expand clinics, telehealth, mobile units, FQHC partnerships.
2. **Funding allocation** — where to steer intervention funding by **equity-adjusted need**.
3. **Population targeting** — which populations drive the gap, via archetype segmentation.
4. **Grant / CHNA justification** — defensible evidence for community-benefit and grant narratives.
5. **Payer network adequacy & market entry** — where networks are inadequate and where entry addresses real need.

### Target employers
CMS / CDC / HRSA, state health departments · payers (UnitedHealth/Optum, Elevance, Humana, CVS/Aetna, Centene) · IDNs (HCA, Ascension, Kaiser) · digital health (Oak Street, Cityblock, Included Health) · Deloitte / McKinsey health, Milliman, IQVIA, Definitive Healthcare.

### Why it's credible
- **Independent outcome label.** The predictive model's target is chronic-disease mortality from **CDC WONDER**, kept separate from PLACES prevalence features to avoid circularity.
- **Honest ML.** Train/test split, probability **calibration**, target **AUC ≥ 0.80**, and **SHAP** driver transparency — no black boxes.
- **Uncertainty is first-class.** Model-based estimate caveats, ACS margins of error (MOE), and WONDER suppression (<10) are propagated and disclosed, never hidden.
- **Weight honesty.** The composite index ships with a **weight sensitivity analysis** so users see how rankings move under alternative weightings.

### Visual identity
- **Map-first hero.** The national bivariate choropleth is the landing centerpiece.
- **Diverging equity scale:** clinical-calm **teal → amber** (low gap → high gap), with a muted **slate** neutral base and a **coral "critical desert"** accent for the worst-off counties.
- **Colorblind-safe** palette (verified against deuteranopia/protanopia/tritanopia); never color-only — pair hue with labels, patterns, and value text.
- Clean clinical aesthetic: generous whitespace, restrained type scale, high-contrast text (WCAG AA+), data-ink maximized.

### One-line positioning
*"CareShed turns five public health datasets into one honest, explainable map of where America's care gap is worst — and why."*

---

## PART 2 — Product Requirements Document (condensed-complete)

### 2.1 Vision & strategy
A defensible, explainable, map-first decision tool that unifies access, burden, and social vulnerability into an equity-adjusted view of care need, with transparent modeling and uncertainty. Portfolio goal: demonstrate geospatial analytics, composite-index design, explainable ML, and product judgment for health/public-health employers.

### 2.2 Goals & non-goals
**Goals:** national-to-tract equity view; care-desert identification; explainable mortality-risk model; archetype segmentation; rigorous, disclosed uncertainty.
**Non-goals:** individual-level or patient-level prediction; real-time clinical decision support; provider directory; commercial resale (barred by CHR license); causal claims (associational only).

### 2.3 Personas
1. **Priya — payer network analyst.** Needs county network-adequacy gaps vs. burden to prioritize contracting and market entry.
2. **Marcus — CHNA lead at an IDN.** Needs defensible, attributable evidence of unmet need for community-benefit reporting.
3. **Dr. Osei — public-health epidemiologist.** Needs transparent methodology, uncertainty, and validation before trusting rankings.
4. **Lena — health-equity officer at a state health dept.** Needs equity-adjusted prioritization and archetypes to steer grant funding.

### 2.4 Key user journeys
- Land on national map → identify worst-gap regions → drill to county → read SHAP drivers → export.
- Enter a county → view sub-index radial + desert flags → compare to state/national → justify a CHNA finding.
- Open Equity Explorer → filter archetypes → identify counties matching a target profile → shortlist for intervention.

### 2.5 Scope (v1) & release plan
v1 ships all six pages, the Health-Equity Index, desert maps, the mortality-risk model + SHAP, archetypes, and full methodology disclosure. Post-v1 stretch listed in §2.20.

### 2.6 Information architecture / pages
1. **Landing** — hero national bivariate choropleth, positioning, entry CTAs, license/attribution footer.
2. **Executive Overview** — national map, KPI cards, top/bottom counties, national distributions.
3. **County / Tract Profile** — drill-down: sub-index radial/bar breakdown, **SHAP waterfall**, desert flags, ACS context, WONDER outcome (with suppression notes), tract table.
4. **Equity Explorer / Archetypes** — cluster **scatter + map**, archetype cards, filterable TanStack table.
5. **Methodology & Data** — sources, licenses (CHR flag prominent), index formulas, weight sensitivity, model validation (AUC, calibration), MOE/suppression handling, limitations.
6. **About** — project intent, author, portfolio framing, honest-ML statement.

### 2.7 Functional requirements
- Render national county choropleth (bivariate burden × access) with tract drill-down where available.
- Compute and display Health-Equity Gap Index and sub-indices with weight controls.
- Serve per-county model probability + SHAP top drivers.
- Cluster counties into archetypes; render scatter + map + cards.
- Provide data-table fallback for every map (ARIA + downloadable).
- Export county/tract records as CSV/JSON.

### 2.8 Non-functional requirements
Performance (see §2.16), accessibility (§2.15), reproducibility (versioned data snapshots + pinned deps), transparency (every metric traceable to source + formula), and honest separation of **calculated findings** vs **proposed features**.

### 2.9 Data sources (verified July 2026)

| Source | What | Grain | License | Update | Notes |
|---|---|---|---|---|---|
| **CDC PLACES 2025** (County `swc5-untb`, Tract `cwsq-ngmh`) | 49 model-based health measures from 2022–2023 BRFSS | County (~3,144) + Tract (~83,522) | CDC open data (US Gov work, effectively public domain) | Annual | Model-based **estimates, not counts**; not for cross-release trends; CIs widen at tract level. Fields: LocationName, FIPS/GEOID, Measure, Data_Value, Low/High CI, Category, TotalPopulation, Geolocation. |
| **HRSA HPSA + MUA/P** (Data Warehouse bulk download) | Primary-care/dental/mental-health shortage areas, scores, provider ratios | Area/county w/ geometry | **Usage limitations: None** (unrestricted public) | Daily | Application-driven designations can **lag**; large boundary files. Fields: HPSA ID, discipline, designation type, HPSA score, designation population, provider-to-population ratio, status/date, FIPS, geometry. |
| **County Health Rankings 2025** (UW Pop Health Institute) | PCP ratio, uninsured %, preventable stays, behaviors, social/economic, environment | County | ⚠️ **Non-commercial only; attribution required** | Annual | See license flag. Used with attribution for non-commercial portfolio. |
| **Census ACS 5-Year** (API `2023/acs/acs5`) | B27001 insurance, B19013 income, B17001 poverty, DP05 race/ethnicity, B08201/B25044 vehicle availability | County + Tract | Public domain | Annual | **MOEs large at tract**; propagate MOE. |
| **CDC WONDER** Underlying Cause of Death | Chronic-disease mortality — **model TARGET** | County | Public; **data-use agreement**; **suppression <10** | Annual | Independent label to avoid circularity with PLACES. |

**Join keys:** 5-digit county **FIPS**; 11-digit tract **GEOID**.

### 2.10 KPI Dictionary

Each KPI is defined with name, definition, formula, source, grain, period, inclusion/exclusion, limitations, display format, and interpretation. All indices normalized so **higher = worse gap / greater need** unless noted.

---

**KPI 1 — CareShed Access Score**
- **Definition:** Composite of provider scarcity + transportation/insurance friction measuring how hard care is to reach.
- **Formula:** `Access = w1·norm(HPSA_score) + w2·norm(1 − PCP_per_100k) + w3·norm(pct_no_vehicle) + w4·norm(pct_uninsured)`; sub-weights sum to 1; each `norm` is min-max on 0–100 across counties.
- **Source:** HRSA (HPSA score, provider ratio), CHR/ACS (PCP ratio, uninsured), ACS B08201/B25044 (vehicle).
- **Grain:** County (tract where inputs available). **Period:** 2023–2025 releases.
- **Inclusion/exclusion:** US counties with non-null HPSA + ACS; exclude territories lacking HRSA coverage.
- **Limitations:** HPSA designation lag; uninsured/vehicle carry ACS MOE.
- **Display:** 0–100 score, teal→amber chip + value. **Interpretation:** higher = harder access.

**KPI 2 — Health-Equity Gap Index (headline)**
- **Definition:** Master composite combining Access, Burden, Social-Vulnerability, and Prevention-Gap sub-indices into a single equity-adjusted need score.
- **Formula:** `HEGI = wA·Access + wB·Burden + wS·SocialVuln + wP·PreventionGap`; default weights `wA=wB=wS=0.30, wP=0.10` (documented, adjustable, sensitivity-tested); each sub-index normalized 0–100.
- **Source:** all five datasets (composite).
- **Grain:** County (tract partial). **Period:** current releases.
- **Inclusion/exclusion:** counties with all four sub-indices computable; else flagged "partial."
- **Limitations:** weight subjectivity (mitigated by sensitivity analysis); inherits component uncertainty.
- **Display:** 0–100, headline KPI card + choropleth. **Interpretation:** higher = larger equity-adjusted care gap.

**KPI 3 — Preventable Burden Gap**
- **Definition:** Excess preventable chronic-disease burden relative to provider supply — burden that adequate access could plausibly mitigate.
- **Formula:** `PBG = norm(preventable_hospital_stays) + norm(chronic_prevalence_composite) − norm(provider_supply)`, rescaled 0–100. Chronic composite = mean of PLACES diabetes, hypertension, COPD, CHD prevalence (z-averaged).
- **Source:** CHR (preventable stays), PLACES (prevalence), HRSA/CHR (supply).
- **Grain:** County. **Period:** 2025 releases.
- **Inclusion/exclusion:** exclude counties missing preventable-stays (small-county suppression).
- **Limitations:** PLACES model-based; preventable stays are Medicare-population-derived.
- **Display:** 0–100 diverging bar. **Interpretation:** higher = more addressable unmet burden.

**KPI 4 — Desert Concentration**
- **Definition:** Share/intensity of a county's population living in care-access desert conditions.
- **Formula:** `DesertConc = pop_in_HPSA_tracts / total_pop`, weighted by HPSA severity tier; reported as % and 0–100 index.
- **Source:** HRSA HPSA geometry + designation population, ACS population.
- **Grain:** County (aggregated from tract/area). **Period:** current HRSA.
- **Inclusion/exclusion:** requires HPSA geometry join; unmatched areas flagged.
- **Limitations:** designation lag; boundary-to-population apportionment approximation.
- **Display:** % + coral "critical desert" flag ≥ threshold. **Interpretation:** higher = more residents in desert conditions.

**KPI 5 — Provider-to-Population Ratio**
- **Definition:** Primary-care providers per 100,000 residents (and its inverse population-per-provider).
- **Formula:** `PCP_per_100k = (PCP_count / population) × 100,000`; also `pop_per_PCP = population / PCP_count`.
- **Source:** CHR / HRSA provider counts, ACS/Census population.
- **Grain:** County. **Period:** 2025.
- **Inclusion/exclusion:** exclude counties with null provider counts.
- **Limitations:** counts may include non-practicing/administrative providers; no specialty granularity.
- **Display:** ratio value + benchmark bar vs. national median. **Interpretation:** lower per-100k = worse supply.

### 2.11 Required visualizations
- **National bivariate choropleth (hero)** — burden × access, 3×3 diverging matrix, coral critical-desert overlay.
- **County profile radial / bar sub-index breakdown** — Access/Burden/SocialVuln/PreventionGap contributions.
- **SHAP waterfall** (ECharts) — per-county model drivers.
- **Archetype scatter + cluster map** — clusters in feature space and geography.
- **KPI cards** — the five headline KPIs with value, trendless snapshot, source tooltip.

### 2.12 Model & analytics requirements
- **Supervised:** gradient-boosted classifier (LightGBM) predicting **high chronic-disease-mortality counties**; target from **CDC WONDER** (top-quartile age-adjusted mortality, suppression-aware). Features from HRSA/ACS/CHR + PLACES burden. **Target AUC ≥ 0.80**, with **calibration** (reliability curve, Brier score) and **SHAP** global + local explanations.
- **Composite index:** min-max/z-score normalization, weighted sub-indices, **weight sensitivity analysis** (rank-shift under alternative weight vectors; report Spearman stability).
- **Unsupervised:** k-means (with silhouette/elbow) and **HDBSCAN** for county archetypes; label archetypes descriptively.
- **Validation honesty:** stratified train/test split, no target leakage from PLACES prevalence into the WONDER label pipeline, calibration + SHAP shipped, MOE/suppression handled explicitly.

### 2.13 Uncertainty & data-quality handling
- **PLACES:** label as model-based estimates; surface CI (Low/High); never present as counts; never cross-release trend.
- **ACS MOE:** propagate MOE through derived rates; suppress or flag high-CV estimates at tract level.
- **WONDER suppression (<10):** exclude suppressed cells from label; document coverage; small counties may be "insufficient data."
- **Composite:** flag "partial index" when any sub-index missing; carry uncertainty band on HEGI where feasible.

### 2.14 Analytics / instrumentation
Privacy-light product analytics (page views, drill-downs, exports) via a self-hosted/consent-safe approach; no PII. Track methodology-page engagement as a trust signal.

### 2.15 Accessibility
- WCAG 2.1 AA target. Colorblind-safe diverging palette; never color-only encoding.
- **Map ARIA:** maps have accessible names/roles/descriptions; keyboard-navigable region selection.
- **Data-table fallback** for every map/chart (screen-reader accessible, downloadable).
- Focus-visible states, semantic headings, alt text, prefers-reduced-motion respected, AA contrast on teal/amber/slate/coral.

### 2.16 Performance
- Pre-simplify geometry (topology-aware) for web; serve vector tiles or simplified GeoJSON.
- Precompute indices/model outputs at build time → static JSON/Parquet; avoid client-side heavy compute.
- Code-split map bundle; lazy-load ECharts SHAP view; cache tiles; target LCP < 2.5s, interactive map < 3s on mid-tier hardware.

### 2.17 Testing
Unit (Vitest) for transforms/index math; component (RTL) for KPI cards, tables, fallbacks; E2E (Playwright) for drill-down and export flows; Python tests for ingestion/index/model reproducibility; visual/a11y checks (axe) in CI.

### 2.18 Deployment & docs
Vercel (Next.js 15) with GitHub Actions CI (lint, typecheck, test, build). Data pipeline runs offline (Python) producing versioned artifacts committed to `data/processed`. GitHub docs: README, METHODOLOGY, DATA_SOURCES (with CHR flag), MODEL_CARD, CONTRIBUTING, LICENSE/attribution.

### 2.19 Acceptance criteria (v1)
- All six pages live; hero bivariate map renders nationally with tract drill-down where available.
- Five headline KPIs computed, sourced, and displayed with tooltips.
- Model achieves AUC ≥ 0.80 on held-out test, ships calibration curve + Brier score + SHAP.
- Weight sensitivity analysis published on Methodology page.
- Every map has a passing a11y data-table fallback (axe clean).
- CHR non-commercial license + attribution shown on Methodology and footer.
- All KPIs trace to source + formula; PLACES/ACS/WONDER caveats visible.

### 2.20 Stretch (proposed — not v1 calculated findings)
Time-series once multiple comparable releases exist; travel-time isochrones (routing API) beyond vehicle proxy; scenario simulator ("add N clinics here"); Medicaid expansion overlay; telehealth broadband-access layer; state-level policy annotations.

### 2.21 Risks & mitigations

| Risk | Mitigation | Boundary |
|---|---|---|
| PLACES **model-based estimates** mistaken for counts | Explicit labels, CI display, methodology disclosure | Calculated: prevalence estimates; **not** direct counts |
| **WONDER suppression** biases label toward larger counties | Suppression-aware target, coverage reporting, "insufficient data" flags | Calculated: label where ≥10; small counties excluded |
| **CHR non-commercial license** | Prominent flag, attribution, non-commercial-only use, no AI-training reuse | Portfolio-only; **not** for commercial deployment |
| **ACS MOE** propagation error | Propagate MOE, suppress high-CV tract estimates, disclose | Calculated with uncertainty bands |
| Composite **weight subjectivity** | Sensitivity analysis, adjustable weights, documented defaults | Default weights **proposed**, not authoritative |
| Model **overf/leakage** | Train/test split, calibration, SHAP, PLACES-vs-WONDER separation | Associational, not causal |

---

## PART 3 — Codex Implementation Package

### 3.1 Repo
**`jls-careshed`** — Next.js 15 + Python analytics monorepo-lite (web app + `scripts/` pipeline + `notebooks/`).

### 3.2 Objective
Ship an implementation-ready, map-first, explainable equity-analytics app from five verified public datasets, with reproducible offline pipeline producing static web artifacts.

### 3.3 Architecture
- **Data layer (offline, Python 3.12):** ingest → transform → validate → export Parquet/GeoJSON/JSON into `data/processed`. Polars/Pandas + DuckDB + GeoPandas; scikit-learn/LightGBM + shap.
- **App layer (Next.js 15 App Router, TS strict):** reads static artifacts; MapLibre GL maps; Recharts + ECharts; TanStack Table; Radix/shadcn; Tailwind; Zod validation of loaded artifacts.
- **CI/CD:** GitHub Actions → Vercel.

### 3.4 Folder structure
```
jls-careshed/
├─ app/                      # Next.js App Router pages
│  ├─ page.tsx               # Landing (hero map)
│  ├─ overview/              # Executive Overview
│  ├─ profile/[fips]/        # County/Tract Profile (drill-down + SHAP)
│  ├─ explorer/              # Equity Explorer / Archetypes
│  ├─ methodology/           # Methodology & Data
│  └─ about/
├─ components/               # UI primitives (shadcn/Radix wrappers)
├─ features/                 # map, kpi, shap, archetypes, table modules
├─ lib/                      # data loaders, zod schemas, color scales, formatters
├─ data/
│  ├─ raw/                   # untracked large source dumps
│  ├─ processed/             # web artifacts (Parquet/GeoJSON/JSON)
│  └─ metadata/              # data dictionaries, source manifests, licenses
├─ scripts/
│  ├─ ingest/                # socrata_places, hrsa_bulk, acs_api, chr_bulk, wonder
│  ├─ transform/             # reshape, moe, index, model, geometry
│  └─ validate/              # schema + quality checks
├─ tests/                    # Vitest/RTL/Playwright + python tests
├─ notebooks/                # EDA, index sensitivity, model dev
├─ docs/                     # METHODOLOGY, DATA_SOURCES, MODEL_CARD
└─ .github/workflows/        # ci.yml, deploy.yml
```

### 3.5 Ingestion plan
- **PLACES (county + tract):** Socrata API (`swc5-untb`, `cwsq-ngmh`), paginated `$limit/$offset`, filter to needed measures; store raw Parquet.
- **HRSA HPSA + MUA/P:** bulk download from Data Warehouse; parse tabular + geometry (KML/SHP → GeoParquet via GeoPandas).
- **ACS 5-Year:** Census API (`2023/acs/acs5`) for B27001, B19013, B17001, DP05, B08201/B25044; pull estimate **and MOE**; county + tract.
- **CHR 2025:** bulk analytic file; **record attribution + non-commercial license in metadata**.
- **WONDER:** underlying-cause-of-death by county (chronic-disease ICD groups); API where feasible else documented manual export; honor DUA + suppression.

### 3.6 Transformation plan
- **PLACES long→wide:** pivot `Measure` → columns keyed by FIPS/GEOID; retain CI; tag as model-based.
- **MOE handling:** carry ACS MOE; compute CV; suppress/flag high-CV tract estimates; propagate MOE into derived rates.
- **WONDER suppression:** drop <10 cells; build top-quartile age-adjusted mortality **label**; document coverage.
- **Index build:** normalize (min-max + z-score variants); assemble four sub-indices; compute HEGI; run **weight sensitivity** (grid of weight vectors → Spearman rank stability), export sensitivity table.
- **Model:** feature matrix (exclude PLACES label leakage into WONDER target); stratified split; LightGBM; calibrate (isotonic/Platt); compute AUC + Brier + reliability; export **SHAP** values (global + per-county) to JSON.
- **Geometry simplification:** topology-aware simplify (mapshaper-style) county + tract; export simplified GeoJSON / vector-tile-ready.

### 3.7 Component list
KpiCard · BivariateChoropleth (MapLibre) · MapLegend (bivariate 3×3) · SubIndexRadial (Recharts) · ShapWaterfall (ECharts) · ArchetypeScatter · ArchetypeMap · DataTableFallback (TanStack + ARIA) · CountyHeader · DesertFlagBadge (coral) · WeightSensitivityChart · SourceTooltip · UncertaintyBadge · ExportButton · MethodologySection.

### 3.8 Page list
Landing · Executive Overview · County/Tract Profile (`/profile/[fips]`) · Equity Explorer/Archetypes · Methodology & Data · About.

### 3.9 API / route-handler needs
Primarily static artifact loads from `data/processed`. Optional route handlers: `GET /api/county/[fips]` (profile bundle), `GET /api/archetypes` (cluster assignments), `GET /api/export?fips=` (CSV/JSON). Zod-validate all payloads at the boundary.

### 3.10 Testing plan
Vitest (index math, normalizers, MOE propagation, color scale) · RTL (KpiCard, DataTableFallback, tooltips) · Playwright (landing→drill-down→SHAP→export) · Python (`pytest` for ingest schema, index reproducibility, model AUC threshold) · axe a11y in CI.

### 3.11 A11y checklist
Map ARIA name/role/desc · keyboard region selection · data-table fallback per map · AA contrast (teal/amber/slate/coral) · never color-only · focus-visible · alt text · reduced-motion · semantic headings.

### 3.12 Perf checklist
Simplified geometry · precomputed static artifacts · code-split map · lazy ECharts · tile caching · LCP < 2.5s · bundle budget enforced in CI.

### 3.13 Deploy checklist
Vercel project · env for Census API key · GitHub Actions: lint→typecheck→test→build · data artifacts committed & versioned · preview deploy per PR · production smoke test.

### 3.14 Git branch strategy
`main` (protected, deployable) · `dev` integration · feature branches `feat/cs-XX-slug` · PR + CI green + review before merge · conventional commits.

### 3.15 Commit plan
One ticket → one branch → conventional-commit-titled PR (see Part 4 messages). Squash-merge to `dev`, release-merge `dev`→`main`.

### 3.16 Definition of Done
Code + tests pass CI · a11y (axe) clean · artifact schemas Zod-validated · docs updated (METHODOLOGY/DATA_SOURCES/MODEL_CARD) · CHR license flag present · calculated-vs-proposed clearly separated · acceptance criteria met.

---

## PART 4 — Implementation Tickets

> Conventions: TypeScript strict, conventional commits, tests required, DoD per §3.16.

### CS-01 — Repo scaffold & tooling
- **Objective:** Initialize Next.js 15 App Router + TS strict, Tailwind, Radix/shadcn, ESLint/Prettier, Vitest/RTL/Playwright, GitHub Actions.
- **Files:** `package.json`, `tsconfig.json`, `tailwind.config.ts`, `.eslintrc`, `app/layout.tsx`, `.github/workflows/ci.yml`.
- **Dependencies:** none.
- **Instructions:** Scaffold app, folder structure per §3.4, base theme tokens (teal/amber/slate/coral), CI pipeline lint→typecheck→test→build.
- **Tests:** CI runs green on empty app; one smoke Vitest.
- **Acceptance:** `pnpm build` + CI pass; theme tokens defined.
- **Commit:** `chore: scaffold Next.js 15 app with strict TS, tailwind, CI`

### CS-02 — Python pipeline scaffold & metadata
- **Objective:** Set up `scripts/` pipeline env (Python 3.12, Polars/Pandas, DuckDB, GeoPandas, scikit-learn/LightGBM, shap) and `data/metadata` manifests incl. CHR license flag.
- **Files:** `scripts/`, `pyproject.toml`, `data/metadata/sources.json`, `docs/DATA_SOURCES.md`.
- **Dependencies:** CS-01.
- **Instructions:** Pin deps; write source manifest (URLs, licenses, grain, update cadence); prominently record CHR non-commercial flag.
- **Tests:** `pytest` imports + manifest schema check.
- **Acceptance:** manifest validates; CHR flag present.
- **Commit:** `chore(data): scaffold python pipeline and source metadata`

### CS-03 — Ingest PLACES (county + tract)
- **Objective:** Socrata ingestion of PLACES `swc5-untb` + `cwsq-ngmh`.
- **Files:** `scripts/ingest/socrata_places.py`, `data/raw/places/*`.
- **Dependencies:** CS-02.
- **Instructions:** Paginated pull, selected measures, retain CI + TotalPopulation + Geolocation; tag model-based.
- **Tests:** row-count > 0; FIPS/GEOID format checks.
- **Acceptance:** raw Parquet for county + tract written.
- **Commit:** `feat(ingest): add PLACES county and tract Socrata ingestion`

### CS-04 — Ingest HRSA, ACS, CHR, WONDER
- **Objective:** Remaining source ingestion.
- **Files:** `scripts/ingest/hrsa_bulk.py`, `acs_api.py`, `chr_bulk.py`, `wonder.py`.
- **Dependencies:** CS-02.
- **Instructions:** HRSA bulk + geometry→GeoParquet; ACS API pull estimate+MOE for listed tables; CHR analytic file (+attribution); WONDER chronic-death by county honoring suppression/DUA.
- **Tests:** each source non-empty; ACS MOE columns present; WONDER suppressed cells dropped.
- **Acceptance:** four raw datasets written with join keys.
- **Commit:** `feat(ingest): add HRSA, ACS, CHR, WONDER ingestion`

### CS-05 — Transform: reshape, MOE, suppression
- **Objective:** PLACES long→wide, ACS MOE propagation, WONDER label build.
- **Files:** `scripts/transform/reshape.py`, `moe.py`, `label.py`.
- **Dependencies:** CS-03, CS-04.
- **Instructions:** Pivot PLACES; compute CV + flag high-CV tracts; build top-quartile age-adjusted mortality label; join on FIPS/GEOID.
- **Tests:** unique-key integrity; MOE propagated; no suppressed cells in label.
- **Acceptance:** clean joined county + tract frames.
- **Commit:** `feat(transform): reshape PLACES, propagate MOE, build WONDER label`

### CS-06 — Composite index + weight sensitivity
- **Objective:** Build Access/Burden/SocialVuln/PreventionGap sub-indices, HEGI, and sensitivity analysis.
- **Files:** `scripts/transform/index.py`, `data/processed/index.parquet`, `data/processed/sensitivity.json`.
- **Dependencies:** CS-05.
- **Instructions:** Normalize (min-max + z-score); default weights per §2.10; grid weight vectors → Spearman rank stability; export index + sensitivity.
- **Tests:** indices bounded 0–100; sensitivity table present; deterministic given seed.
- **Acceptance:** HEGI + five KPIs computed and exported.
- **Commit:** `feat(index): build health-equity index with weight sensitivity`

### CS-07 — Model train + calibration + SHAP export
- **Objective:** LightGBM classifier, AUC ≥ 0.80, calibration, SHAP.
- **Files:** `scripts/transform/model.py`, `data/processed/model_scores.json`, `data/processed/shap/*.json`, `docs/MODEL_CARD.md`.
- **Dependencies:** CS-05, CS-06.
- **Instructions:** Stratified split; guard against PLACES→WONDER leakage; train + calibrate; export per-county probability + global/local SHAP; write model card (AUC, Brier, calibration, limitations).
- **Tests:** held-out AUC ≥ 0.80; calibration + Brier computed; SHAP files per county.
- **Acceptance:** model card complete; threshold met or documented.
- **Commit:** `feat(model): train calibrated GBM with SHAP driver export`

### CS-08 — Archetype clustering
- **Objective:** k-means + HDBSCAN county archetypes.
- **Files:** `scripts/transform/cluster.py`, `data/processed/archetypes.parquet`.
- **Dependencies:** CS-06.
- **Instructions:** Silhouette/elbow for k; run HDBSCAN; assign + descriptively label archetypes.
- **Tests:** every county assigned or flagged noise; cluster count in expected range.
- **Acceptance:** archetype assignments + labels exported.
- **Commit:** `feat(cluster): segment counties into archetypes`

### CS-09 — Geometry simplification & artifacts
- **Objective:** Web-ready simplified GeoJSON/vector tiles + validation.
- **Files:** `scripts/transform/geometry.py`, `scripts/validate/*`, `data/processed/geo/*`.
- **Dependencies:** CS-05.
- **Instructions:** Topology-aware simplify county + tract; join index/model/archetype fields; validate schemas.
- **Tests:** geometry valid; file size within budget; join keys intact.
- **Acceptance:** simplified geo artifacts pass validation.
- **Commit:** `feat(geo): simplify geometry and export web artifacts`

### CS-10 — App data layer & Zod schemas
- **Objective:** Loaders + Zod validation + color scales + formatters.
- **Files:** `lib/loaders.ts`, `lib/schemas.ts`, `lib/colors.ts`, `lib/format.ts`.
- **Dependencies:** CS-06..CS-09.
- **Instructions:** Typed loaders for artifacts; Zod-validate; bivariate teal→amber scale + coral accent (colorblind-safe).
- **Tests:** Vitest schema + color-scale unit tests.
- **Acceptance:** artifacts load and validate in app.
- **Commit:** `feat(lib): add typed loaders, zod schemas, equity color scale`

### CS-11 — Hero bivariate choropleth + KPI cards + Overview
- **Objective:** MapLibre bivariate national map, KPI cards, Executive Overview.
- **Files:** `features/map/BivariateChoropleth.tsx`, `features/kpi/KpiCard.tsx`, `app/page.tsx`, `app/overview/*`.
- **Dependencies:** CS-10.
- **Instructions:** 3×3 bivariate burden×access + coral critical-desert; five KPI cards with source tooltips; national distributions.
- **Tests:** RTL card render; Playwright map loads; axe clean.
- **Acceptance:** landing + overview render nationally.
- **Commit:** `feat(map): add hero bivariate choropleth and KPI overview`

### CS-12 — County/Tract Profile with SHAP
- **Objective:** Drill-down profile: radial sub-index, SHAP waterfall, desert flags, tract table.
- **Files:** `app/profile/[fips]/page.tsx`, `features/shap/ShapWaterfall.tsx`, `features/map/SubIndexRadial.tsx`.
- **Dependencies:** CS-11.
- **Instructions:** Load county bundle; ECharts SHAP waterfall; Recharts radial; DesertFlagBadge; TanStack tract table; uncertainty badges (PLACES/ACS/WONDER caveats).
- **Tests:** RTL profile; Playwright drill-down; a11y.
- **Acceptance:** profile renders with SHAP + caveats.
- **Commit:** `feat(profile): county drill-down with SHAP and sub-index breakdown`

### CS-13 — Equity Explorer / Archetypes + data-table fallbacks + export
- **Objective:** Archetype scatter + map, filterable table, map ARIA fallbacks, export.
- **Files:** `app/explorer/*`, `features/archetypes/*`, `features/map/DataTableFallback.tsx`, `features/kpi/ExportButton.tsx`.
- **Dependencies:** CS-11, CS-08.
- **Instructions:** Cluster scatter + map; archetype cards; TanStack filters; ARIA data-table fallback for every map; CSV/JSON export.
- **Tests:** RTL table filter; Playwright export; axe on fallbacks.
- **Acceptance:** explorer + fallbacks + export work.
- **Commit:** `feat(explorer): archetypes, table fallbacks, and export`

### CS-14 — Methodology, About, weight-sensitivity viz, license flag, docs
- **Objective:** Transparency pages + prominent CHR license/attribution + repo docs.
- **Files:** `app/methodology/*`, `app/about/*`, `features/index/WeightSensitivityChart.tsx`, `docs/METHODOLOGY.md`, `README.md`.
- **Dependencies:** CS-06, CS-07.
- **Instructions:** Publish formulas, weight sensitivity chart, model validation (AUC/calibration/Brier), MOE/suppression handling, **CHR non-commercial flag + attribution** in footer + methodology; calculated-vs-proposed separation.
- **Tests:** RTL renders; link/attribution presence test.
- **Acceptance:** methodology complete; license flag visible; acceptance criteria §2.19 met.
- **Commit:** `feat(docs): methodology, license flag, and weight sensitivity viz`

---

## PART 5 — Go-to-Market

### Recruiter description (2–3 sentences)
CareShed is a map-first health-equity analytics application that fuses five authoritative public datasets (CDC PLACES, HRSA HPSA, County Health Rankings, Census ACS, and CDC WONDER) into a single county- and tract-level Health-Equity Index and set of care-access "desert" maps. It pairs a composite index (with transparent weight-sensitivity analysis) with an explainable gradient-boosted model that predicts high chronic-disease-mortality counties — validated with train/test splits, calibration, and SHAP driver explanations. Built with Next.js 15, TypeScript, MapLibre GL, and a Python (Polars/DuckDB/GeoPandas/LightGBM) pipeline, it demonstrates end-to-end geospatial analytics, honest ML, and product judgment for healthcare and public-health decision-making.

### Resume bullets (honest, capability-framed)
- Designed and specified a geospatial health-equity analytics product that integrates five verified public datasets (CDC PLACES, HRSA, County Health Rankings, Census ACS, CDC WONDER) on county-FIPS and tract-GEOID join keys into a weighted composite Health-Equity Index with documented weight-sensitivity analysis.
- Engineered an explainable modeling approach — a calibrated LightGBM classifier targeting an independent CDC WONDER mortality label (kept separate from PLACES prevalence to avoid circularity), designed for AUC ≥ 0.80 with SHAP driver transparency and honest train/test validation.
- Built a map-first Next.js 15 / TypeScript / MapLibre GL interface with bivariate choropleths, SHAP waterfalls, and archetype clustering, including colorblind-safe design, ARIA data-table fallbacks, and explicit uncertainty handling (ACS MOE propagation, WONDER suppression, model-based-estimate caveats).

### LinkedIn launch post (~120–180 words)
Where is America's care gap worst — and why?

I built **CareShed** to answer that honestly. It maps care-access deserts and scores the equity gap county by county, fusing five public datasets: CDC PLACES, HRSA shortage areas, County Health Rankings, Census ACS, and CDC WONDER mortality.

The core is a composite **Health-Equity Index** (access + burden + social vulnerability + prevention gap) — and because index weights are always a judgment call, I ship a **weight-sensitivity analysis** so you can see how rankings shift.

For prediction, a calibrated gradient-boosted model flags high chronic-disease-mortality counties, using CDC WONDER as an **independent label** (kept separate from prevalence data to avoid circularity), with **SHAP** explaining every driver. No black boxes.

I treated uncertainty as first-class: ACS margins of error, WONDER suppression, and model-based-estimate caveats are all surfaced, not hidden.

Stack: Next.js 15, TypeScript, MapLibre GL, Python (Polars, DuckDB, GeoPandas, LightGBM, SHAP).

*Note: County Health Rankings used non-commercially, with attribution.*

#HealthEquity #PublicHealth #DataScience #Geospatial #ExplainableAI

---

*Data verified July 2026. CareShed is a non-commercial portfolio project. County Health Rankings & Roadmaps data used with attribution for non-commercial, educational/research purposes only; commercial use (including AI training for commercial products) is prohibited by its license. CDC PLACES, HRSA, Census ACS, and CDC WONDER are public-domain / unrestricted (WONDER subject to its data-use agreement and count suppression). All findings distinguish calculated results from proposed future features.*
