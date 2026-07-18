import {
  Badge,
  Button,
  Callout,
  Card,
  ChartShell,
  DataTable,
  EmptyState,
  ErrorState,
  FreshnessPill,
  Legend,
  MapShell,
  SectionHeader,
  Skeleton,
  SourceAttribution,
  StatCard,
  Tabs,
  ThemeToggle,
} from "@/lib/design/primitives";
import { chartTheme } from "@/lib/design/chartTheme";
import { mapTheme } from "@/lib/design/mapTheme";

const swatches = [
  { label: "Low", color: chartTheme.series[1] },
  { label: "Watch", color: chartTheme.series[2] },
  { label: "High", color: chartTheme.series[3] },
  { label: "Uncertainty", color: chartTheme.uncertainty },
];

export default function DesignPreviewPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-canvas)] px-6 py-10 text-[var(--text-primary)]">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="flex flex-col gap-4 border-b border-[var(--border-default)] pb-8 md:flex-row md:items-end md:justify-between">
          <SectionHeader eyebrow="UP-01 design system" title="Shared primitives preview">
            <p>
              This review route shows the shared tokens, primitives, chart language, and map shell in light and dark mode.
              Sample values here are only component examples.
            </p>
          </SectionHeader>
          <ThemeToggle />
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <StatCard
            label="Coverage indicator"
            value="92%"
            definition="Sample component value. Real app coverage must come from each data pipeline."
          >
            <div className="h-8 rounded-[var(--radius-md)] bg-gradient-to-r from-[var(--accent-200)] via-[var(--accent-500)] to-[var(--accent-800)]" />
          </StatCard>
          <StatCard
            label="Priority queue"
            value="18"
            definition="Sample count for layout testing, not a CareShed metric."
          />
          <StatCard
            label="Refresh status"
            value="30d"
            definition="Sample freshness label. Production apps must display source-specific freshness."
          >
            <FreshnessPill label="sample window" />
          </StatCard>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
          <Card>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge tone="accent">Accent</Badge>
              <Badge tone="success">Valid</Badge>
              <Badge tone="warning">Review</Badge>
              <Badge tone="danger">Blocked</Badge>
              <Badge tone="info">Context</Badge>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button>Primary action</Button>
              <Button variant="secondary">Secondary action</Button>
              <Button variant="ghost">Quiet action</Button>
            </div>
            <div className="mt-6 grid gap-3">
              <Callout tone="info" title="Business implication">
                Use callouts to translate a data point into a decision, with the source-backed number visible nearby.
              </Callout>
              <Callout tone="warning" title="Integrity guardrail">
                Proposed features and computed results remain visibly separate across every surface.
              </Callout>
            </div>
          </Card>

          <Tabs
            tabs={[
              {
                id: "loading",
                label: "Loading",
                content: (
                  <Card className="space-y-3">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-28 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </Card>
                ),
              },
              {
                id: "empty",
                label: "Empty",
                content: <EmptyState title="No matching places">Broaden filters or review the source table.</EmptyState>,
              },
              {
                id: "error",
                label: "Error",
                content: <ErrorState title="View unavailable">Keep the table fallback visible while the chart recovers.</ErrorState>,
              },
            ]}
          />
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <ChartShell title="Themed chart shell" description="Muted gridlines, tabular labels, and uncertainty styling.">
            <div className="flex h-48 items-end gap-3 border-b border-l border-[var(--border-subtle)] px-4 pb-3">
              {[42, 58, 35, 76, 64].map((height, index) => (
                <div
                  key={height}
                  className="w-full rounded-t-[var(--radius-sm)] bg-[var(--accent-600)]"
                  style={{ height: `${height}%`, opacity: 0.62 + index * 0.07 }}
                />
              ))}
            </div>
            <div className="mt-4">
              <Legend items={swatches} />
            </div>
          </ChartShell>

          <MapShell title="Themed map shell" description="Map controls, legends, and fallback states share the same tokens.">
            <div
              className="grid h-72 grid-cols-4 grid-rows-3 gap-1 p-3"
              style={{ background: mapTheme.light.background }}
            >
              {Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-[var(--radius-sm)] border border-white/70"
                  style={{ background: mapTheme.choroplethStops[index % mapTheme.choroplethStops.length][1] }}
                />
              ))}
            </div>
          </MapShell>
        </section>

        <section className="space-y-3">
          <DataTable
            caption="Design-system sample table"
            columns={["Primitive", "Purpose", "Guardrail"]}
            rows={[
              ["StatCard", "KPI and definition", "Use tabular figures"],
              ["ChartShell", "Accessible chart frame", "Keep table fallback"],
              ["SourceAttribution", "Source context", "Preserve license flags"],
            ]}
          />
          <SourceAttribution>
            Design-system sample content. Production sources remain owned by each app pipeline and validation gate.
          </SourceAttribution>
        </section>
      </div>
    </main>
  );
}
