"use client";

import { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { RISK_STOPS } from "@/lib/format";

type Mode = "equity_score" | "access_gap";

const MODES: { key: Mode; label: string }[] = [
  { key: "equity_score", label: "Health-equity need" },
  { key: "access_gap", label: "Access gap" },
];

export function RiskMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const [mode, setMode] = useState<Mode>("equity_score");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
            layers: [{ id: "bg", type: "background", paint: { "background-color": "#eef2f4" } }],
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
            paint: { "line-color": "#ffffff", "line-width": 0.2, "line-opacity": 0.4 },
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
                   <div style="color:#64748b">Diabetes ${fmt(p.DIABETES)} · Uninsured ${fmt(p.ACCESS2)}</div>
                 </div>`
              )
              .addTo(map);
          });
          map.on("mouseleave", "counties-fill", () => {
            map.getCanvas().style.cursor = "";
            map.setFilter("counties-hover", ["==", "fips", ""]);
            popup.remove();
          });

          setReady(true);
        });

        map.on("error", (e: any) => {
          if (e?.error?.message && !/glyph/i.test(e.error.message)) setError(e.error.message);
        });
      } catch (err: any) {
        setError(err?.message ?? "Failed to load map");
      }
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (map && ready && map.getLayer("counties-fill")) {
      map.setPaintProperty("counties-fill", "fill-color", colorExpr(mode));
    }
  }, [mode, ready]);

  return (
    <div className="relative">
      <div
        className="absolute left-3 top-3 z-10 flex rounded-lg border border-slate-200 bg-white/95 p-0.5 shadow-card"
        role="group"
        aria-label="Map metric"
      >
        {MODES.map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            aria-pressed={mode === m.key}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === m.key ? "bg-brand-700 text-white" : "text-ink-soft hover:bg-slate-100"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div
        ref={containerRef}
        role="application"
        aria-label={`Choropleth map of US counties by ${mode === "equity_score" ? "health-equity need" : "care-access gap"}. A ranked table of highest-need counties is provided below for non-visual access.`}
        className="h-[560px] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
      />
      {error ? (
        <div className="absolute inset-x-0 bottom-3 mx-auto w-fit rounded-md bg-red-50 px-3 py-1.5 text-xs text-red-700">
          Map failed to load: {error}
        </div>
      ) : null}
      <MapLegend />
    </div>
  );
}

function colorExpr(field: Mode): any {
  const stops = RISK_STOPS.flatMap(([v, c]) => [v, c]);
  const value =
    field === "access_gap"
      ? ["*", ["coalesce", ["get", "p_access"], 0], 100]
      : ["coalesce", ["get", "equity_score"], 0];
  return ["interpolate", ["linear"], value, ...stops];
}

function fmt(v: any) {
  return v == null ? "—" : `${Number(v).toFixed(1)}%`;
}

function MapLegend() {
  return (
    <div className="mt-3 flex items-center gap-3 text-xs text-ink-muted">
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
