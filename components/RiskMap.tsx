"use client";

import { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { RISK_STOPS } from "@/lib/format";
import { ErrorState, Skeleton } from "@/lib/design/primitives";

type Mode = "equity_score" | "access_gap" | "provider_gap";
type CountyProps = Record<string, any>;

const MODES: { key: Mode; label: string }[] = [
  { key: "equity_score", label: "Health-equity need" },
  { key: "access_gap", label: "Access gap" },
  { key: "provider_gap", label: "Provider shortage" },
];

export function RiskMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const selectedRef = useRef<CountyProps | null>(null);
  const [mode, setMode] = useState<Mode>("equity_score");
  const [mapEnabled, setMapEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<CountyProps | null>(null);

  const chooseCounty = (county: CountyProps | null) => {
    selectedRef.current = county;
    setSelected(county);
  };

  useEffect(() => {
    if (!mapEnabled) return;
    let cancelled = false;
    (async () => {
      try {
        const maplibregl = (await import("maplibre-gl")).default;
        if (cancelled || !containerRef.current) return;

        const map = new maplibregl.Map({
          container: containerRef.current,
          style: {
            version: 8,
            sources: {},
            layers: [{ id: "bg", type: "background", paint: { "background-color": mapBg() } }],
          },
          center: [-96, 38],
          zoom: 3.3,
          attributionControl: false,
        });
        mapRef.current = map;
        map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

        map.on("load", () => {
          map.addSource("counties", { type: "geojson", data: "/data/counties.geojson" });
          map.addLayer({
            id: "counties-fill",
            type: "fill",
            source: "counties",
            paint: { "fill-color": colorExpr("equity_score"), "fill-opacity": 0.85 },
          });
          map.addLayer({
            id: "counties-line",
            type: "line",
            source: "counties",
            paint: { "line-color": mapLine(), "line-width": 0.2, "line-opacity": 0.55 },
          });
          map.addLayer({
            id: "counties-hover",
            type: "line",
            source: "counties",
            paint: { "line-color": "#0f172a", "line-width": 1.5 },
            filter: ["==", "fips", ""],
          });

          const popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false });
          map.on("mousemove", "counties-fill", (e: any) => {
            const f = e.features?.[0];
            if (!f) return;
            map.getCanvas().style.cursor = "pointer";
            map.setFilter("counties-hover", ["==", "fips", f.properties.fips]);
            const p = f.properties;
            popup
              .setLngLat(e.lngLat)
              .setHTML(
                `<div style="font-size:12px;line-height:1.5">
                   <div style="font-weight:600;color:#0f172a">${p.locationname}, ${p.stateabbr}</div>
                   <div style="margin-top:6px">Equity need <b>${p.equity_score}</b> · <b>${p.tier}</b></div>
                   <div style="color:#64748b">Diabetes ${fmt(p.DIABETES)} · Uninsured ${fmt(p.ACCESS2)} · HPSA ${score(p.provider_raw)}</div>
                 </div>`
              )
              .addTo(map);
          });
          map.on("click", "counties-fill", (e: any) => {
            const f = e.features?.[0];
            if (!f) return;
            chooseCounty(f.properties);
            map.setFilter("counties-hover", ["==", "fips", f.properties.fips]);
          });
          map.on("mouseleave", "counties-fill", () => {
            map.getCanvas().style.cursor = "";
            if (!selectedRef.current) map.setFilter("counties-hover", ["==", "fips", ""]);
            popup.remove();
          });

          setReady(true);
        });

        const observer = new MutationObserver(() => {
          if (map.getLayer("bg")) map.setPaintProperty("bg", "background-color", mapBg());
          if (map.getLayer("counties-line")) map.setPaintProperty("counties-line", "line-color", mapLine());
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

        map.on("error", (e: any) => {
          if (e?.error?.message && !/glyph/i.test(e.error.message)) setError(e.error.message);
        });
        map.once("remove", () => observer.disconnect());
      } catch (err: any) {
        setError(err?.message ?? "Failed to load map");
      }
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
    };
  }, [mapEnabled]);

  useEffect(() => {
    const map = mapRef.current;
    if (map && ready && map.getLayer("counties-fill")) {
      map.setPaintProperty("counties-fill", "fill-color", colorExpr(mode));
    }
  }, [mode, ready]);

  const resetView = () => {
    const map = mapRef.current;
    chooseCounty(null);
    if (map?.getLayer("counties-hover")) map.setFilter("counties-hover", ["==", "fips", ""]);
    map?.easeTo({ center: [-96, 38], zoom: 3.3, duration: 650 });
  };

  if (!mapEnabled) {
    return (
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-panel)] p-6 shadow-[var(--shadow-1)]">
          <div className="grid min-h-[360px] place-items-center rounded-lg border border-dashed border-[var(--border-default)] bg-[var(--bg-inset)] p-8 text-center">
            <div className="max-w-lg">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent-text)]">Interactive county map</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--text-primary)]">Load the county drill-down when you need the spatial view.</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--text-tertiary)]">
                The ranked table below is available immediately. Loading the map brings in the full county geometry, hover cards, provider-shortage layer, and click-to-drill profile.
              </p>
              <button
                type="button"
                onClick={() => setMapEnabled(true)}
                className="ds-focus-ring mt-5 rounded-lg bg-[var(--accent-600)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-700)]"
              >
                Load interactive map
              </button>
            </div>
          </div>
          <MapLegend />
        </div>
        <CountyProfile county={null} />
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="relative overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--bg-panel)] shadow-[var(--shadow-1)]">
      <div
        className="absolute left-3 top-3 z-10 flex flex-wrap gap-1 rounded-lg border border-[var(--border-default)] bg-[var(--bg-panel)]/95 p-1 shadow-[var(--shadow-1)] backdrop-blur"
        role="group"
        aria-label="Map metric"
      >
        {MODES.map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            aria-pressed={mode === m.key}
            className={`ds-focus-ring rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === m.key ? "bg-[var(--accent-600)] text-white" : "text-[var(--text-secondary)] hover:bg-[var(--bg-inset)]"
            }`}
          >
            {m.label}
          </button>
        ))}
        <button
          type="button"
          onClick={resetView}
          className="ds-focus-ring rounded-md px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition hover:bg-[var(--bg-inset)]"
        >
          Reset view
        </button>
      </div>

      <div
        ref={containerRef}
        role="application"
        aria-label={`Choropleth map of US counties by ${mode === "equity_score" ? "health-equity need" : "care-access gap"}. A ranked table of highest-need counties is provided below for non-visual access.`}
        className="h-[560px] w-full bg-[var(--bg-inset)]"
      />
      {!ready && !error ? (
        <div className="absolute inset-0 grid place-items-center bg-[var(--bg-panel)]/70 backdrop-blur-sm">
          <div className="w-72 space-y-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
      ) : null}
      {error ? (
        <div className="absolute inset-x-4 bottom-4">
          <ErrorState title="Map failed to load">{error}</ErrorState>
        </div>
      ) : null}
        <div className="px-4 pb-4">
          <MapLegend />
          <p className="mt-3 text-xs leading-5 text-[var(--text-tertiary)]">
            Map colors show relative need from lower to higher. Brand green is reserved for app chrome; the map keeps a colorblind-safer sequential scale.
          </p>
        </div>
      </div>
      <CountyProfile county={selected} />
    </div>
  );
}

function colorExpr(field: Mode): any {
  const stops = RISK_STOPS.flatMap(([v, c]) => [v, c]);
  const value =
    field === "access_gap"
      ? ["*", ["coalesce", ["get", "p_access"], 0], 100]
      : field === "provider_gap"
        ? ["*", ["coalesce", ["get", "p_provider"], 0], 100]
      : ["coalesce", ["get", "equity_score"], 0];
  return ["interpolate", ["linear"], value, ...stops];
}

function fmt(v: any) {
  return v == null ? "—" : `${Number(v).toFixed(1)}%`;
}

function score(v: any) {
  return v == null ? "—" : Number(v).toFixed(0);
}

function mapBg() {
  return document.documentElement.classList.contains("dark") ? "#111827" : "#eef2f4";
}

function mapLine() {
  return document.documentElement.classList.contains("dark") ? "#334155" : "#ffffff";
}

function MapLegend() {
  return (
    <div className="mt-3 flex items-center gap-3 text-xs text-[var(--text-tertiary)]">
      <span>Lower need</span>
      <div
        className="h-2.5 flex-1 rounded-full"
        style={{ background: `linear-gradient(90deg, ${RISK_STOPS.map(([, c]) => c).join(",")})` }}
        aria-hidden
      />
      <span>Higher need</span>
    </div>
  );
}

function CountyProfile({ county }: { county: CountyProps | null }) {
  const domains = county
    ? [
        ["Chronic burden", county.p_burden],
        ["Care access gap", county.p_access],
        ["Provider shortage", county.p_provider],
        ["Prevention gap", county.p_prevention],
        ["Social vulnerability", county.p_social],
      ]
    : [];
  return (
    <aside id="county-profile" className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-panel)] p-5 shadow-[var(--shadow-1)]">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent-text)]">County profile</p>
      {county ? (
        <>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            {county.locationname}, {county.stateabbr}
          </h3>
          <p className="mt-1 text-sm text-[var(--text-tertiary)]">
            Score <b className="tabular-nums text-[var(--text-primary)]">{county.equity_score}</b> · {county.tier} need
          </p>
          <div className="mt-5 space-y-3">
            {domains.map(([label, value]) => (
              <div key={label as string}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="font-medium text-[var(--text-secondary)]">{label}</span>
                  <span className="tabular-nums text-[var(--text-tertiary)]">{Math.round(Number(value ?? 0) * 100)}th pct.</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[var(--bg-inset)]">
                  <div className="h-full rounded-full bg-[var(--accent-600)]" style={{ width: `${Number(value ?? 0) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <Metric label="Diabetes" value={fmt(county.DIABETES)} />
            <Metric label="Uninsured" value={fmt(county.ACCESS2)} />
            <Metric label="HPSA score" value={score(county.provider_raw)} />
            <Metric label="Designations" value={score(county.provider_designations)} />
          </dl>
          <p className="mt-4 rounded-lg border border-[var(--accent-border)] bg-[var(--accent-badge-bg)] p-3 text-xs leading-5 text-[var(--text-secondary)]">
            So what? Use this profile to decide whether a county needs network expansion, mobile-clinic outreach, prevention investment, or deeper local validation before funding.
          </p>
          <p className="mt-3 text-xs leading-5 text-[var(--text-tertiary)]">
            PLACES values are modeled estimates. HRSA shortage data is joined by county name and state from the dashboard CSV; validate local boundaries before operational use.
          </p>
        </>
      ) : (
        <div className="mt-4 rounded-lg border border-dashed border-[var(--border-default)] bg-[var(--bg-inset)] p-5 text-sm leading-6 text-[var(--text-tertiary)]">
          Click a county on the map to see the five-domain decomposition and a one-page brief target. The ranked table below remains the keyboard-accessible fallback.
        </div>
      )}
    </aside>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[var(--bg-inset)] p-3">
      <dt className="text-xs text-[var(--text-tertiary)]">{label}</dt>
      <dd className="mt-1 font-semibold tabular-nums text-[var(--text-primary)]">{value}</dd>
    </div>
  );
}
