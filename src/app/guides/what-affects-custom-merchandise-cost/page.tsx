import type { Metadata } from "next";
import GuideShell from "@/components/GuideShell";

const faqs: [string, string][] = [
  ["Can you give a price without my logo?", "We can give a rough range from the product, quantity and decoration method. A final quote needs your artwork so we can check colours and placements."],
  ["Does ordering more make each item cheaper?", "Often, yes, because setup costs are spread across more items. How much depends on the product and method, and we confirm it in your quote."],
  ["What are common hidden costs?", "Ask whether setup, artwork preparation, extra print positions, freight and GST are included in the figure you are comparing."],
];

export const metadata: Metadata = {
  title: "What Affects the Cost of Custom Merchandise? | NovaMerch",
  description: "The main factors that change the price of custom apparel, caps, bottles and gifts, and what to ask before you compare quotes.",
  alternates: { canonical: "/guides/what-affects-custom-merchandise-cost/" },
};

const h2 = { fontFamily: "var(--font-syne)", color: "var(--text-primary)", marginTop: "2.5rem" } as const;

export default function Page() {
  return (
    <GuideShell
      slug="what-affects-custom-merchandise-cost"
      title="What affects the cost of custom merchandise?"
      description="The main factors that change custom merchandise pricing."
      answer="Price is driven by the product itself, how many you order, the decoration method, the number of colours and print positions, setup, freight and your deadline. Comparing quotes only works if each one covers the same things."
      reviewed="2026-10-24"
      faqs={faqs}
    >
      <h2 style={h2}>The main cost drivers</h2>
      <ul>
        <li><strong>The product:</strong> material, brand and quality. A heavier garment or a stainless bottle costs more than a basic one.</li>
        <li><strong>Quantity:</strong> setup is spread across the run, so larger orders often cost less per item.</li>
        <li><strong>Decoration method:</strong> embroidery, screen print and DTF are priced differently and suit different logos.</li>
        <li><strong>Colours and print positions:</strong> more colours or more placements (chest, back, sleeve) add cost.</li>
        <li><strong>Setup and artwork:</strong> screens, stitch files and artwork preparation may be quoted separately.</li>
        <li><strong>Sizing and variations:</strong> many sizes or colourways can add handling.</li>
        <li><strong>Freight and delivery:</strong> location, volume and speed all matter.</li>
        <li><strong>Deadline:</strong> tight timelines can limit options or add cost.</li>
      </ul>
      <h2 style={h2}>How to compare quotes fairly</h2>
      <ul>
        <li>Same product, same quantity, same decoration, same placements.</li>
        <li>Check whether setup, artwork, freight and GST are included.</li>
        <li>Ask what colour-matching and proofing steps are included.</li>
        <li>Ask what happens if there is a problem with the finished order.</li>
      </ul>
      <h2 style={h2}>How to get an accurate quote quickly</h2>
      <p>Send your logo, the quantity you have in mind, your budget range and your deadline. With those four things a supplier can recommend suitable options and give a realistic starting price. We will not quote a number here, because a fair figure depends on your specific brief.</p>
    </GuideShell>
  );
}
