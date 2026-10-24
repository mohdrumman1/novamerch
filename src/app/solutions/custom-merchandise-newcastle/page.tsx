import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const pageUrl = "https://novamerchau.com/solutions/custom-merchandise-newcastle/";
const cta = "/free-mockup/?utm_source=newcastle-page&utm_medium=website&utm_campaign=custom-merchandise-newcastle";

export const metadata: Metadata = {
  title: "Custom Merchandise Newcastle NSW | NovaMerch",
  description:
    "Newcastle-based custom merchandise for businesses, sports clubs and teams. Request a free three-product mockup pack with rough pricing. Delivery across Australia.",
  alternates: { canonical: "/solutions/custom-merchandise-newcastle/" },
  openGraph: {
    title: "Custom Merchandise Newcastle NSW | NovaMerch",
    description: "Custom branded merchandise for Newcastle businesses and clubs. Free three-product mockup pack.",
    url: pageUrl,
    type: "website",
    locale: "en_AU",
  },
};

const faqs = [
  {
    q: "Who does NovaMerch supply custom merchandise to in Newcastle?",
    a: "NovaMerch is based in Newcastle and works with local businesses, sports clubs, gyms, trades and event organisers. We have also supplied clubs outside Newcastle, because we deliver across Australia.",
  },
  {
    q: "How do I get started?",
    a: "Send your logo, your rough quantity, your budget and your deadline through the free mockup form. We review the brief and reply with three product ideas and rough pricing. There is no commitment.",
  },
  {
    q: "Is there a minimum order quantity?",
    a: "Minimums vary by product and decoration method. Tell us the quantity you have in mind and we will confirm suitable options before you commit.",
  },
  {
    q: "Can you match our brand colours?",
    a: "We work from your logo and colour references and confirm the closest achievable result on each product and decoration method before production. Exact matches depend on the material and process.",
  },
  {
    q: "How long does custom merchandise take?",
    a: "It depends on the product, the decoration method, the quantity and the artwork approval. Tell us your deadline in the form and we will say whether it is realistic before you order.",
  },
  {
    q: "Do you deliver outside Newcastle?",
    a: "Yes. NovaMerch is Newcastle-based and delivers across Australia.",
  },
];

const products = [
  ["Custom drink bottles", "/products/custom-drink-bottles/"],
  ["Embroidered caps", "/products/embroidered-caps/"],
  ["Custom hoodies", "/products/custom-hoodies/"],
  ["Branded polos", "/products/branded-polos/"],
  ["Branded workwear", "/products/branded-workwear/"],
  ["Corporate gifts", "/products/corporate-gifts/"],
];

const audiences = [
  ["Sports clubs", "/sports-clubs/", "Training tees, caps, bottles and supporter gear for clubs and associations."],
  ["Trades and construction", "/industries/construction-trades/", "Uniform polos, workwear, caps and bottles for crews."],
  ["Gyms and fitness", "/industries/gyms-fitness/", "Staff tees and member merchandise."],
  ["Corporate teams", "/industries/corporate/", "Onboarding packs, event drops and client gifts."],
];

const steps = [
  "Send your logo, quantity, budget and deadline.",
  "We review the brief and reply with three product ideas, mockups and rough pricing.",
  "You choose, and we confirm artwork, colours and decoration method before production.",
  "Your order is produced and delivered, in Newcastle or anywhere in Australia.",
];

export default function NewcastleMerchandisePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        name: "Custom branded merchandise",
        serviceType: "Custom branded merchandise and promotional products",
        provider: { "@id": "https://novamerchau.com/#organization" },
        areaServed: [
          { "@type": "City", name: "Newcastle" },
          { "@type": "Country", name: "Australia" },
        ],
        url: pageUrl,
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://novamerchau.com/" },
          { "@type": "ListItem", position: 2, name: "Custom merchandise Newcastle", item: pageUrl },
        ],
      },
    ],
  };

  const wrap = { maxWidth: "52rem", margin: "0 auto" } as const;
  const h2 = { fontFamily: "var(--font-syne)", fontSize: "1.6rem", fontWeight: 700, margin: "0 0 1rem" } as const;
  const body = { color: "var(--text-secondary)", lineHeight: 1.75, fontSize: "1rem" } as const;
  const link = { color: "var(--cyan)", fontWeight: 700, textDecoration: "none" } as const;

  return (
    <>
      <Nav />
      <main style={{ background: "#060c18", color: "var(--text-primary)", minHeight: "100vh", padding: "8rem 1.5rem 5rem" }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <div style={wrap}>
          <h1 style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(2.2rem,6vw,3.6rem)", lineHeight: 1.05, margin: "0 0 1.25rem" }}>
            Custom merchandise in Newcastle
          </h1>
          <p style={{ ...body, fontSize: "1.15rem", color: "var(--text-primary)" }}>
            NovaMerch is a Newcastle-based custom merchandise supplier for businesses, sports clubs and teams. Send us your logo, quantity and deadline and we will reply with three product ideas and rough pricing, free and with no commitment. We deliver across Australia.
          </p>
          <p style={{ margin: "1.75rem 0 3rem" }}>
            <Link href={cta} style={{ display: "inline-flex", background: "#00CFFF", color: "#06101D", padding: "1rem 1.5rem", borderRadius: 999, fontWeight: 800, textDecoration: "none" }}>
              Get my free mockup pack
            </Link>
          </p>

          <section style={{ marginBottom: "3rem" }}>
            <h2 style={h2}>What we supply</h2>
            <p style={body}>
              Drink bottles, caps, apparel, polos, workwear, pens, tote bags, corporate gift packs and event packs, plus custom sourcing when you need something specific. See the detail for each:
            </p>
            <ul style={{ ...body, paddingLeft: "1.25rem" }}>
              {products.map(([name, href]) => (
                <li key={href}><Link href={href} style={link}>{name}</Link></li>
              ))}
            </ul>
          </section>

          <section style={{ marginBottom: "3rem" }}>
            <h2 style={h2}>Who we work with</h2>
            <ul style={{ ...body, paddingLeft: "1.25rem" }}>
              {audiences.map(([name, href, desc]) => (
                <li key={href}><Link href={href} style={link}>{name}</Link>. {desc}</li>
              ))}
            </ul>
          </section>

          <section style={{ marginBottom: "3rem" }}>
            <h2 style={h2}>Local project: 570 training tees for Cooks Hill United FC</h2>
            <p style={body}>
              We supplied 570 custom training tees for Cooks Hill United Football Club in Newcastle. Read the <Link href="/case-studies/cooks-hill-united/" style={link}>full project summary</Link>.
            </p>
          </section>

          <section style={{ marginBottom: "3rem" }}>
            <h2 style={h2}>How it works</h2>
            <ol style={{ ...body, paddingLeft: "1.25rem" }}>
              {steps.map((s) => <li key={s}>{s}</li>)}
            </ol>
          </section>

          <section style={{ marginBottom: "3rem" }}>
            <h2 style={h2}>Newcastle merchandise questions</h2>
            {faqs.map((f) => (
              <div key={f.q} style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.1rem", margin: "0 0 .4rem" }}>{f.q}</h3>
                <p style={{ ...body, margin: 0 }}>{f.a}</p>
              </div>
            ))}
          </section>

          <p style={body}>
            Ready to start? <Link href={cta} style={link}>Request your free three-product mockup pack</Link>.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
