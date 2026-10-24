import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Custom Merchandise Guides | NovaMerch",
  description: "Practical guides for ordering custom merchandise: club checklists, decoration methods and more.",
  alternates: { canonical: "/guides/" },
};

const guides = [
  ["/guides/club-merch-ordering-checklist/", "Club merchandise ordering checklist", "Artwork, sizes, sponsors, budget and deadlines in one checklist."],
  ["/guides/embroidery-vs-screen-printing-vs-dtf/", "Embroidery vs screen printing vs DTF", "Which decoration method suits your logo, garment and quantity."],
];

export default function GuidesIndex() {
  return (
    <>
      <Nav />
      <main style={{ background: "#060c18", color: "var(--text-primary)", minHeight: "100vh", padding: "8rem 1.5rem 5rem" }}>
        <div style={{ maxWidth: "46rem", margin: "0 auto" }}>
          <h1 style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(2rem,5.5vw,3.2rem)" }}>Guides</h1>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {guides.map(([href, title, desc]) => (
              <li key={href} style={{ marginBottom: "1.5rem" }}>
                <Link href={href} style={{ color: "var(--cyan)", fontWeight: 700, fontSize: "1.2rem" }}>{title}</Link>
                <p style={{ margin: ".25rem 0 0", color: "var(--text-secondary)" }}>{desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
