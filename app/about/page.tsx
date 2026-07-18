export const metadata = { title: "About — CareShed" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-8 pt-14">
      <h1 className="text-3xl font-semibold tracking-tight text-ink">About CareShed</h1>

      <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-ink-soft">
        <p>
          Chronic-disease burden and the supply of care are spatially mismatched. Leaders in population health,
          public health, and payer strategy need one defensible view that combines <em>how sick a community is</em>,{" "}
          <em>how hard care is to reach</em>, and <em>how much social disadvantage compounds both</em> — so scarce
          resources reach the places that need them most.
        </p>
        <p>
          CareShed turns authoritative CDC data into a transparent, county-level health-equity score and a ranked,
          explainable list of highest-need counties — with every number traceable to its source and every limitation
          stated plainly.
        </p>

        <h2 className="pt-4 text-xl font-semibold tracking-tight text-ink">Who it&apos;s for</h2>
        <p>
          Population-health strategists, payer network and market analysts, hospital community-benefit and CHNA teams,
          public-health epidemiologists, and health-equity officers.
        </p>

        <h2 className="pt-4 text-xl font-semibold tracking-tight text-ink">About the author</h2>
        <p>
          CareShed is part of a five-product data portfolio by <b>Jean-Luc Saint-Fleur</b>, spanning housing,
          financial services, healthcare, retail, and transportation &amp; climate. Each product pairs a real business
          problem, credible public data, a defensible analytical method, and an executive-ready interface — and is
          honest about what the data can and cannot support.
        </p>

        <div className="mt-6 rounded-xl border border-slate-200 bg-panel p-5 text-sm">
          <p className="font-semibold text-ink">Built with</p>
          <p className="mt-1.5 text-ink-muted">
            Next.js 15 · TypeScript · Tailwind CSS · MapLibre GL · Python (Pandas) · CDC PLACES. Deployed on Vercel.
          </p>
        </div>
      </div>
    </div>
  );
}
