import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const pageUrl = "https://novamerchau.com/case-studies/cooks-hill-united/";

export const metadata: Metadata = {
  title: "Cooks Hill United FC Training Tee Project | NovaMerch",
  description:
    "See how NovaMerch supplied 570 custom training tees for Cooks Hill United Football Club, a Newcastle sports-club merchandise project.",
  alternates: { canonical: "/case-studies/cooks-hill-united/" },
  openGraph: {
    title: "Cooks Hill United FC Training Tee Project | NovaMerch",
    description:
      "A factual NovaMerch case study: 570 custom training tees for Cooks Hill United Football Club.",
    url: pageUrl,
    type: "article",
    images: [
      {
        url: "/case-studies/cooks-hill-united-training-tees.png",
        width: 1080,
        height: 1080,
        alt: "Cooks Hill United Football Club custom training tees supplied by NovaMerch",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cooks Hill United FC Training Tee Project | NovaMerch",
    description: "570 custom training tees supplied for Cooks Hill United Football Club.",
    images: ["/case-studies/cooks-hill-united-training-tees.png"],
  },
};

const projectFacts = [
  ["Organisation", "Cooks Hill United Football Club"],
  ["Project", "Custom training tees"],
  ["Quantity supplied", "570 tees"],
  ["Service", "Custom branded sports-club merchandise"],
];

export default function CooksHillUnitedCaseStudy() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${pageUrl}#article`,
    headline: "Cooks Hill United FC Training Tee Project",
    description:
      "NovaMerch supplied 570 custom training tees for Cooks Hill United Football Club.",
    mainEntityOfPage: pageUrl,
    author: { "@id": "https://novamerchau.com/#organization" },
    publisher: { "@id": "https://novamerchau.com/#organization" },
    about: ["Custom sports-club merchandise", "Custom training tees", "Newcastle sports clubs"],
    inLanguage: "en-AU",
  };

  return (
    <main style={{ background: "#060c18", color: "var(--text-primary)", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <Nav />

      <section style={{ position: "relative", overflow: "hidden", padding: "9rem 1.5rem 5rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <Image src="/sports-clubs-hero-bg.png" alt="" fill priority style={{ objectFit: "cover", opacity: 0.2 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(6,12,24,0.96), rgba(6,12,24,0.78))" }} />
        <div style={{ maxWidth: "72rem", margin: "0 auto", position: "relative" }}>
          <p style={{ color: "var(--cyan)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
            Sports-club project
          </p>
          <h1 style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(2.8rem, 7vw, 5.8rem)", lineHeight: 0.98, letterSpacing: "-0.05em", maxWidth: "900px", margin: 0 }}>
            Cooks Hill United FC<br />
            <span style={{ color: "var(--cyan)" }}>570 custom training tees.</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "clamp(1rem, 2vw, 1.2rem)", lineHeight: 1.7, maxWidth: "650px", margin: "2rem 0 0" }}>
            NovaMerch supplied a 570-tee custom training apparel order for Cooks Hill United Football Club. This project demonstrates the scale of club merchandise we can help coordinate for local teams.
          </p>
        </div>
      </section>

      <section style={{ padding: "5rem 1.5rem", background: "#0a1525" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "3rem", alignItems: "center" }}>
          <figure style={{ margin: 0, borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)", background: "#02060b" }}>
            <Image
              src="/case-studies/cooks-hill-united-training-tees.png"
              alt="Cooks Hill United Football Club custom training tees supplied by NovaMerch"
              width={1080}
              height={1080}
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ display: "block", width: "100%", height: "auto" }}
            />
            <figcaption style={{ padding: "0.9rem 1rem", color: "var(--text-secondary)", fontSize: "0.78rem", lineHeight: 1.5 }}>
              Cooks Hill United Football Club custom training tee project.
            </figcaption>
          </figure>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "1.25rem" }}>
            {projectFacts.map(([label, value]) => (
              <div key={label} style={{ padding: "1.5rem", background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "14px" }}>
                <p style={{ color: "var(--cyan)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 0.65rem" }}>{label}</p>
                <p style={{ fontFamily: "var(--font-syne)", fontSize: "1.15rem", fontWeight: 700, lineHeight: 1.3, margin: 0 }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "6rem 1.5rem", background: "#060c18" }}>
        <div style={{ maxWidth: "52rem", margin: "0 auto" }}>
          <p style={{ color: "var(--cyan)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "1.25rem" }}>What clubs can take from this</p>
          <h2 style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(2.1rem, 5vw, 4rem)", lineHeight: 1, letterSpacing: "-0.045em", margin: "0 0 1.75rem" }}>A clear brief is the foundation of a smoother club order.</h2>
          <div style={{ display: "grid", gap: "1rem" }}>
            {[
              "Plan quantities early, especially when ordering for multiple teams or age groups.",
              "Share current logos, colours and intended use so the product options fit the club.",
              "Review the mock-up and order details before production begins.",
            ].map((item, index) => (
              <div key={item} style={{ display: "flex", gap: "1rem", alignItems: "flex-start", padding: "1.25rem 0", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <span style={{ color: "var(--cyan)", fontFamily: "var(--font-syne)", fontWeight: 800 }}>{String(index + 1).padStart(2, "0")}</span>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "5rem 1.5rem", background: "linear-gradient(135deg, #00b8d4, #007da3)", color: "#06111d" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto", display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ maxWidth: "600px" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", margin: "0 0 1rem" }}>Planning club merch?</p>
            <h2 style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(2rem, 4vw, 3.4rem)", letterSpacing: "-0.045em", lineHeight: 1, margin: 0 }}>Start with a free three-product mock-up.</h2>
          </div>
          <Link href="/free-mockup/?utm_source=case-study&utm_medium=website&utm_campaign=cooks-hill-united" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#06111d", color: "#fff", borderRadius: "999px", padding: "1rem 1.5rem", fontWeight: 800, textDecoration: "none", whiteSpace: "nowrap" }}>
            Request a free mock-up
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
