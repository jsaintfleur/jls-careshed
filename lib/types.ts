export type Tier = "Critical" | "High" | "Moderate" | "Lower";

export interface Summary {
  generated_utc: string;
  geography: string;
  counties_scored: number;
  counties_mapped: number;
  population_covered: number;
  tier_counts: Record<Tier, number>;
  archetype_counts: Record<string, number>;
  state_avg_equity: Record<string, number>;
  weights: Record<string, number>;
  top_need_counties: {
    county: string;
    state: string;
    equity_score: number;
    tier: Tier;
    archetype: string;
    diabetes: number | null;
    uninsured: number | null;
  }[];
}

export interface SourcesMeta {
  sources: { name: string; id: string; license: string; url: string; role: string }[];
  computed_domains: string[];
  proposed_future_domains: string[];
  caveats: string[];
}
