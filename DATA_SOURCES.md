# Data Sources & Licensing

CareShed uses only public data. Figures are computed by `scripts/build_index.py`; none are hand-entered.

## Sources used in the v1 live demo (no API key required)

### 1. CDC PLACES — County Data (2025 release) — `swc5-untb`
- **Publisher:** Centers for Disease Control and Prevention (data.cdc.gov)
- **URL:** https://data.cdc.gov/500-Cities-Places/PLACES-Local-Data-for-Better-Health-County-Data-20/swc5-untb
- **License:** CDC open data — U.S. Government work, effectively public domain.
- **Role:** Chronic-disease burden, care access, prevention, and health-related social-need measures.
- **Known limits:** Model-based small-area estimates from BRFSS survey data — not direct counts; confidence
  intervals widen for small populations; not designed for cross-release trend comparison.

### 2. U.S. County Cartographic Boundaries (FIPS)
- **Publisher:** U.S. Census Bureau cartographic boundaries (public mirror)
- **URL:** https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json
- **License:** Public domain (U.S. Census).
- **Role:** County geometry and the 5-digit FIPS join spine.

## Proposed additional domains (not shown in the UI as results)

These strengthen the full CareShed model and are documented as planned enhancements:

| Source | Role | License note |
|--------|------|--------------|
| HRSA shortage areas | Provider-scarcity "careshed" access layer | Public (HRSA: "Usage limitations: None") |
| Census ACS 5-Year | Social-vulnerability + coverage detail | Public domain. **Requires a free Census API key.** |
| County Health Rankings | Clinical-care benchmark | **Non-commercial, attribution required** — fine for a portfolio with citation; not for commercial use. |
| CDC WONDER mortality | Independent outcome label to validate an explainable model | Public, subject to a data-use agreement; suppresses counts < 10. |

## Attribution

Produced by Jean-Luc Saint-Fleur for a professional portfolio. Nothing here is medical, clinical, or policy
advice. If County Health Rankings data is enabled, it must be attributed and not used commercially.
