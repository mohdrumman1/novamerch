import type { Metadata } from "next";
import GuideShell from "@/components/GuideShell";

const faqs: [string, string][] = [
  ["When should a club start ordering?", "Start well before the season so there is time for artwork approval, sizing and production. Share your key date early and we will tell you if it is realistic."],
  ["Do we need to collect sizes first?", "For apparel, yes. A size breakdown avoids reorders. Include junior sizes if you have junior teams."],
  ["Can sponsors go on the kit?", "Usually, yes. Confirm sponsor logos, placement and colours with each sponsor before artwork is finalised."],
];

export const metadata: Metadata = {
  title: "Club Merchandise Ordering Checklist: Artwork, Sizes, Sponsors and Deadlines | NovaMerch",
  description: "A practical checklist for sports clubs ordering training tees, caps, bottles and supporter gear: artwork, sizing, sponsors, budget and timing.",
  alternates: { canonical: "/guides/club-merch-ordering-checklist/" },
  openGraph: { type: "article", images: [{ url: "/products-showcase.png", width: 1100, height: 1430, alt: "NovaMerch branded merchandise concept" }] },
};

const h2 = { fontFamily: "var(--font-syne)", color: "var(--text-primary)", marginTop: "2.5rem" } as const;

export default function Page() {
  return (
    <GuideShell
      slug="club-merch-ordering-checklist"
      title="Club merchandise ordering checklist"
      description="A practical checklist for sports clubs ordering merchandise."
      answer="Before you order, lock down five things: who the merchandise is for, your logo and sponsor artwork, a size list, a per-item budget and your real deadline. With those, a supplier can quote accurately and avoid reorders."
      reviewed="2026-10-24"
      faqs={faqs}
    >
      <h2 style={h2}>1. Decide what you are buying and why</h2>
      <ul>
        <li>Players, coaches, volunteers, supporters, or fundraising stock?</li>
        <li>One core item (for example training tees) or a small range?</li>
        <li>Will the club sell items or give them to members?</li>
      </ul>
      <h2 style={h2}>2. Get the artwork ready</h2>
      <ul>
        <li>Club logo as a vector file if possible (.ai, .eps or .pdf).</li>
        <li>Club colours, ideally with reference codes.</li>
        <li>Sponsor logos with written approval for placement.</li>
        <li>Decide front, back and sleeve placements.</li>
      </ul>
      <h2 style={h2}>3. Collect sizes</h2>
      <ul>
        <li>Collect sizes per person before ordering.</li>
        <li>Include junior and womens sizes where needed.</li>
        <li>Allow a small spare allowance for late joiners, if budget allows.</li>
      </ul>
      <h2 style={h2}>4. Set the budget</h2>
      <ul>
        <li>Set a per-item budget and a total ceiling.</li>
        <li>Ask whether members pay, sponsors fund, or the club covers it.</li>
        <li>Remember that extra print positions and colours can add cost.</li>
      </ul>
      <h2 style={h2}>5. Fix the deadline</h2>
      <ul>
        <li>Work back from the first game or event, not forward from today.</li>
        <li>Leave time for artwork approval and delivery.</li>
        <li>Tell your supplier the date up front so they can say if it is realistic.</li>
      </ul>
      <h2 style={h2}>6. Approve before production</h2>
      <p>Check the mockup for spelling, logo placement, colours and sizes. Confirm the final spec in writing before production starts.</p>
      <h2 style={h2}>Want a head start?</h2>
      <p>Send your logo, quantity, budget and deadline. We will come back with three product ideas and rough pricing for your club.</p>
    </GuideShell>
  );
}
