import type { Metadata } from "next";
import GuideShell from "@/components/GuideShell";

const faqs: [string, string][] = [
  ["Can you promise a delivery date?", "We confirm what is realistic for your specific order before you commit. Timing depends on stock, decoration, quantity and how quickly artwork is approved."],
  ["What slows an order down most?", "Late artwork approval, unconfirmed sizes and last-minute changes are the common causes."],
  ["Is there a faster option?", "Sometimes. Stocked items and simpler decoration are usually quicker. Tell us your deadline up front so we can say what is realistic."],
];

export const metadata: Metadata = {
  title: "How Long Does Custom Merchandise Take? A Practical Checklist | NovaMerch",
  description: "What decides production time for custom apparel, caps and bottles, and how to plan back from your deadline.",
  alternates: { canonical: "/guides/how-long-does-custom-merchandise-take/" },
};

const h2 = { fontFamily: "var(--font-syne)", color: "var(--text-primary)", marginTop: "2.5rem" } as const;

export default function Page() {
  return (
    <GuideShell
      slug="how-long-does-custom-merchandise-take"
      title="How long does custom merchandise take?"
      description="What decides production time and how to plan back from your deadline."
      answer="It depends on whether the product is in stock, the decoration method, the quantity, how fast artwork is approved and the delivery location. The safest approach is to work back from your deadline and share it with your supplier at the start."
      reviewed="2026-10-24"
      faqs={faqs}
    >
      <h2 style={h2}>What decides the timeline</h2>
      <ul>
        <li><strong>Stock:</strong> items in stock are quicker than items that must be made or ordered in.</li>
        <li><strong>Decoration method:</strong> embroidery, print and engraving each have their own steps.</li>
        <li><strong>Quantity:</strong> larger runs take longer to produce.</li>
        <li><strong>Artwork approval:</strong> production normally starts after you approve the mockup, so a slow approval slows everything.</li>
        <li><strong>Sizes and details:</strong> unconfirmed sizes or names hold up apparel orders.</li>
        <li><strong>Delivery:</strong> distance, freight method and number of delivery points.</li>
        <li><strong>Busy periods:</strong> pre-season, end of year and event peaks.</li>
      </ul>
      <h2 style={h2}>A planning checklist</h2>
      <ol>
        <li>Start from the date you need the items in hand, not the date you order.</li>
        <li>Allow time for artwork review and your approval.</li>
        <li>Confirm sizes and quantities before ordering.</li>
        <li>Allow for freight, especially outside Newcastle.</li>
        <li>Add a buffer for anything that can go wrong.</li>
        <li>Tell your supplier the deadline at the start so they can say whether it is realistic.</li>
      </ol>
      <h2 style={h2}>Why we do not quote a fixed number here</h2>
      <p>Honest timing depends on your product and method. We confirm a realistic timeline for your order before you commit.</p>
    </GuideShell>
  );
}
