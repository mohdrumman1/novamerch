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
      <main style={{ background: "#060c18", color: "var(--text-primary)", minHeight: "100vh", padding: "8rem 1.5rem 5rem" }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }} />
        <article style={{ maxWidth: "46rem", margin: "0 auto", lineHeight: 1.75, color: "var(--text-secondary)" }}>
          <p style={{ fontSize: ".75rem", letterSpacing: ".12em", fontWeight: 700 }}><Link href="/guides/" style={{ color: "var(--cyan)" }}>GUIDES</Link></p>
          <h1 style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(2rem,5.5vw,3.2rem)", lineHeight: 1.08, color: "var(--text-primary)", margin: "0 0 1.25rem" }}>{title}</h1>
          <p style={{ fontSize: "1.15rem", color: "var(--text-primary)" }}>{answer}</p>
          {children}
          {faqs.length > 0 && (
            <section>
              <h2 style={{ fontFamily: "var(--font-syne)", color: "var(--text-primary)", marginTop: "2.5rem" }}>Common questions</h2>
              {faqs.map(([q, a]) => (
                <div key={q}><h3 style={{ color: "var(--text-primary)", fontSize: "1.1rem", marginBottom: ".3rem" }}>{q}</h3><p style={{ marginTop: 0 }}>{a}</p></div>
              ))}
            </section>
          )}
          <p style={{ marginTop: "2.5rem" }}>
            <Link href={`/free-mockup/?utm_source=guide&utm_medium=website&utm_campaign=${slug}`} style={{ display: "inline-flex", background: "#00CFFF", color: "#06101D", padding: "1rem 1.5rem", borderRadius: 999, fontWeight: 800, textDecoration: "none" }}>
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
