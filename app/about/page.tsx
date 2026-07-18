export const metadata = { title: "About — CareShed" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 pb-12 pt-12">
      <p className="text-sm font-semibold uppercase tracking-wider text-[var(--accent-text)]">About CareShed</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">A county access screen for better health-resource decisions.</h1>

      <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-[var(--text-secondary)]">
        <p>
          Chronic-disease burden and the supply of care are often spatially mismatched. Leaders in population health,
          public health, and payer strategy need one defensible view that combines how sick a community is,
          how hard care is to reach, and how much social disadvantage compounds both, so scarce
          resources reach the places that need them most.
        </p>
        <p>
          CareShed turns authoritative CDC and HRSA public data into a transparent county score, a drill-down profile,
          and a ranked export that a stakeholder can bring into a network planning, community-benefit, or grantmaking meeting.
        </p>

        <h2 className="pt-4 text-xl font-semibold tracking-tight text-[var(--text-primary)]">Who it&apos;s for</h2>
        <p>
          Population-health strategists, payer network and market analysts, hospital community-benefit and CHNA teams,
          public-health epidemiologists, and health-equity officers.
        </p>

        <h2 className="pt-4 text-xl font-semibold tracking-tight text-[var(--text-primary)]">About the author</h2>
        <p>
          CareShed is part of a five-product data portfolio by <b>Jean-Luc Saint-Fleur</b>, spanning housing,
          financial services, healthcare, retail, and transportation &amp; climate. Each product pairs a real business
          problem, credible public data, a defensible analytical method, and an executive-ready interface — and is
          honest about what the data can and cannot support.
        </p>

        <div className="mt-6 rounded-xl border border-[var(--border-default)] bg-[var(--bg-panel)] p-5 text-sm">
          <p className="font-semibold text-[var(--text-primary)]">Built with</p>
          <p className="mt-1.5 text-[var(--text-tertiary)]">
            Next.js 15 · TypeScript · Tailwind CSS · MapLibre GL · Python (Pandas) · CDC PLACES · HRSA HPSA. Deployed on Vercel.
          </p>
        </div>
      </div>
    </div>
  );
}
