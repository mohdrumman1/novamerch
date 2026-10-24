import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { products } from "@/data/products";

const siteUrl = "https://novamerchau.com";

export function generateStaticParams() { return Object.keys(products).map((slug) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = products[slug];
  return product ? { title: `${product.name} Australia | NovaMerch`, description: product.summary.slice(0, 155), alternates: { canonical: `/products/${slug}/` } } : {};
}

const h2 = { fontFamily: "var(--font-syne)", fontSize: "1.5rem", margin: "3rem 0 1rem", color: "var(--text-primary)" } as const;
const p = { lineHeight: 1.75, maxWidth: 680 } as const;

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products[slug];
  if (!product) notFound();
  const url = `${siteUrl}/products/${slug}/`;
  const cta = `/free-mockup/?utm_source=product-page&utm_medium=website&utm_campaign=${slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "FAQPage", mainEntity: product.faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
        { "@type": "ListItem", position: 2, name: "Products", item: `${siteUrl}/products/` },
        { "@type": "ListItem", position: 3, name: product.name, item: url },
      ] },
    ],
  };
  return (
    <>
      <Nav />
      <main style={{ padding: "8rem 1.5rem 5rem", minHeight: "100vh", background: "#060c18", color: "var(--text-secondary)" }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <article style={{ maxWidth: 850, margin: "auto" }}>
          <p style={{ letterSpacing: ".12em", fontSize: ".75rem", fontWeight: 700 }}><Link href="/products/" style={{ color: "var(--cyan)" }}>PRODUCTS</Link></p>
          <h1 style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(2.2rem,7vw,4.5rem)", letterSpacing: "-.04em", lineHeight: 1, margin: "1.5rem 0", color: "var(--text-primary)" }}>{product.name}</h1>
          <p style={{ ...p, fontSize: "1.15rem", color: "var(--text-primary)" }}>{product.summary}</p>
          <p><Link href={cta} style={{ display: "inline-block", marginTop: 12, padding: "15px 22px", borderRadius: 99, background: "#00CFFF", color: "#06101D", fontWeight: 700, textDecoration: "none" }}>Get a free three-product mockup pack</Link></p>

          <h2 style={h2}>Best for</h2>
          <ul style={{ lineHeight: 1.9 }}>{product.bestFor.map((x) => <li key={x}>{x}</li>)}</ul>

          <h2 style={h2}>How to choose</h2>
          <dl style={{ ...p, margin: 0 }}>{product.choose.map(([t, d]) => <div key={t} style={{ marginBottom: "1rem" }}><dt style={{ fontWeight: 700, color: "var(--text-primary)" }}>{t}</dt><dd style={{ margin: 0 }}>{d}</dd></div>)}</dl>

          <h2 style={h2}>Decoration methods</h2>
          <ul style={{ lineHeight: 1.9 }}>{product.methods.map((x) => <li key={x}>{x}</li>)}</ul>
          <p style={p}>Not sure which suits your logo? Read <Link style={{ color: "var(--cyan)" }} href="/guides/embroidery-vs-screen-printing-vs-dtf/">embroidery vs screen printing vs DTF</Link>.</p>

          <h2 style={h2}>What to send us</h2>
          <ul style={{ lineHeight: 1.9 }}>{product.send.map((x) => <li key={x}>{x}</li>)}</ul>
          <p style={p}>Price, minimums and production timing depend on the product, decoration method, quantity and supplier availability. We confirm these in your quote before you commit. Colours are matched as closely as the material and process allow, and we confirm the result with you before production.</p>

          <h2 style={h2}>Questions</h2>
          {product.faqs.map(([q, a]) => <div key={q} style={{ marginBottom: "1.25rem" }}><h3 style={{ fontSize: "1.1rem", margin: "0 0 .35rem", color: "var(--text-primary)" }}>{q}</h3><p style={{ ...p, margin: 0 }}>{a}</p></div>)}

          <h2 style={h2}>Related products</h2>
          <ul style={{ lineHeight: 1.9 }}>{product.related.map((r) => <li key={r}><Link style={{ color: "var(--cyan)" }} href={`/products/${r}/`}>{products[r].name}</Link></li>)}</ul>
          <p style={p}>Based in Newcastle? See <Link style={{ color: "var(--cyan)" }} href="/solutions/custom-merchandise-newcastle/">custom merchandise in Newcastle</Link>.</p>
        </article>
      </main>
      <Footer />
    </>
  );
}
