import type { Metadata } from "next";
import GuideShell from "@/components/GuideShell";

const faqs: [string, string][] = [
  ["Which method is cheapest?", "It depends on quantity and number of colours. Screen printing usually becomes more economical as quantity grows, while DTF and digital methods suit small runs and multi-colour artwork. We confirm cost per option in your quote."],
  ["Which lasts longest?", "Embroidery is generally very durable. Screen printing is durable on suitable fabrics. DTF durability depends on the film, the garment and how it is washed."],
  ["Can any logo be embroidered?", "Most can, but very fine detail, small text and gradients may need simplifying."],
];

export const metadata: Metadata = {
  title: "Embroidery vs Screen Printing vs DTF: Which Suits Your Logo? | NovaMerch",
  description: "A plain-English comparison of embroidery, screen printing and DTF for custom clothing, caps and merchandise, and how to choose for your logo and quantity.",
  alternates: { canonical: "/guides/embroidery-vs-screen-printing-vs-dtf/" },
  openGraph: { type: "article", images: [{ url: "/products-showcase.png", width: 1100, height: 1430, alt: "NovaMerch branded merchandise concept" }] },
};

const h2 = { fontFamily: "var(--font-syne)", color: "var(--text-primary)", marginTop: "2.5rem" } as const;

export default function Page() {
  return (
    <GuideShell
      slug="embroidery-vs-screen-printing-vs-dtf"
      title="Embroidery vs screen printing vs DTF: which suits your logo?"
      description="A plain-English comparison of embroidery, screen printing and DTF."
      answer="Choose embroidery for small, simple logos on polos and caps. Choose screen printing for bold artwork in larger runs. Choose DTF for detailed or multi-colour artwork, especially in smaller quantities."
      reviewed="2026-10-24"
      faqs={faqs}
    >
      <h2 style={h2}>The short comparison</h2>
      <ul>
        <li><strong>Embroidery:</strong> logo is stitched into the fabric. Textured, premium look. Best for chest logos and caps. Struggles with fine detail and gradients.</li>
        <li><strong>Screen printing:</strong> ink is pressed through a stencil, one colour at a time. Strong, bold colour. Good value in bigger runs. Each extra colour adds setup.</li>
        <li><strong>DTF (direct to film):</strong> artwork is printed onto film and heat-pressed on. Handles photos, gradients and many colours. Useful for small or mixed runs.</li>
      </ul>
      <h2 style={h2}>How to choose</h2>
      <p><strong>Look at the logo.</strong> Few flat colours suit screen printing or embroidery. Many colours, gradients or fine lines point to DTF or a simplified embroidery version.</p>
      <p><strong>Look at the garment.</strong> Caps and polos usually suit embroidery. T-shirts and hoodies suit print. Some performance fabrics need specific methods, so check before you commit.</p>
      <p><strong>Look at the quantity.</strong> Setup costs are spread across the run. Small runs often suit DTF or digital methods. Larger runs often favour screen printing. Always compare quotes for your actual quantity.</p>
      <p><strong>Think about use.</strong> Workwear that is washed hard needs a durable finish. Event giveaways may not.</p>
      <h2 style={h2}>A note on colour</h2>
      <p>Brand colours can look slightly different across fabric, thread and ink. We work from your colour references and confirm the closest achievable result on each product and method before production. If a colour is critical, ask about a sample first.</p>
      <h2 style={h2}>Preparing your logo</h2>
      <p>Send a vector file (.ai, .eps or .pdf) if you have one. A clear PNG is fine to start. If your logo has tiny text or fine detail, tell us where it will be used and we can advise on simplifying it.</p>
    </GuideShell>
  );
}
