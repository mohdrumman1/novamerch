import Link from "next/link";
import type { ReactNode } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const siteUrl = "https://novamerchau.com";

interface GuideShellProps {
  slug: string;
  title: string;
  description: string;
  answer: string;
  reviewed: string;
  faqs?: [string, string][];
  children: ReactNode;
}

export default function GuideShell({ slug, title, description, answer, reviewed, faqs = [], children }: GuideShellProps) {
  const url = `${siteUrl}/guides/${slug}/`;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Article",
      headline: title,
      description,
      mainEntityOfPage: url,
      dateModified: reviewed,
      author: { "@id": `${siteUrl}/#organization` },
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: "en-AU",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
        { "@type": "ListItem", position: 2, name: "Guides", item: `${siteUrl}/guides/` },
        { "@type": "ListItem", position: 3, name: title, item: url },
      ],
    },
  ];
  if (faqs.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    });
  }
  return (
    <>
      <Nav />
      <main className="nm-hero-glow" style={{ background: "#060c18", color: "var(--text-primary)", minHeight: "100vh", padding: "8rem 1.5rem 5rem" }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }} />
        <article className="nm-prose" style={{ maxWidth: "46rem", margin: "0 auto", lineHeight: 1.75, color: "var(--text-secondary)" }}>
          <p className="nm-eyebrow"><Link href="/guides/" style={{ color: "inherit" }}>Guides</Link></p>
          <h1 style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(2rem,5.5vw,3.2rem)", lineHeight: 1.08, color: "var(--text-primary)", margin: "0 0 1.25rem" }}>{title.split(" ").slice(0, -1).join(" ")} <span className="nm-accent">{title.split(" ").slice(-1)}</span></h1>
          <p style={{ fontSize: "1.15rem", color: "var(--text-primary)" }}>{answer}</p>
          {children}
          {faqs.length > 0 && (
            <section>
              <h2 style={{ fontFamily: "var(--font-syne)", color: "var(--text-primary)", marginTop: "2.5rem" }}>Common questions</h2>
              {faqs.map(([q, a]) => (
                <div key={q} className="nm-faq-item"><h3>{q}</h3><p>{a}</p></div>
              ))}
            </section>
          )}
          <p style={{ marginTop: "2.5rem" }}>
            <Link className="nm-cta" href={`/free-mockup/?utm_source=guide&utm_medium=website&utm_campaign=${slug}`}>
              Get a free three-product mockup pack
            </Link>
          </p>
          <p style={{ fontSize: ".85rem" }}>General guidance by the NovaMerch team. Last reviewed {reviewed}. Prices, minimums and timing are confirmed per quote.</p>
        </article>
      </main>
      <Footer />
    </>
  );
}
