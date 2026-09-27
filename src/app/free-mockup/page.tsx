import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import QuoteForm from "@/components/QuoteForm";

export const metadata: Metadata = {
  title: "Free Custom Merch Mock-up | NovaMerch Newcastle & Maitland",
  description:
    "Request a free three-product branded merchandise mock-up for your Newcastle, Maitland or Hunter business, club or event.",
  alternates: { canonical: "/free-mockup/" },
  openGraph: {
    title: "Get a free custom merch mock-up | NovaMerch",
    description: "Send your logo and brief. NovaMerch will return three practical product ideas with rough pricing.",
    url: "https://novamerchau.com/free-mockup/",
    type: "website",
  },
};

export default function FreeMockupPage() {
  return (
    <main>
      <Nav />
      <section style={{ background: "#060C18", padding: "9rem 1.5rem 2rem", textAlign: "center" }}>
        <p style={{ color: "var(--cyan)", fontFamily: "var(--font-dm-sans)", fontSize: "0.75rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>
          Newcastle · Maitland · Hunter
        </p>
        <h1 style={{ color: "var(--text-primary)", fontFamily: "var(--font-syne)", fontSize: "clamp(2.2rem, 5vw, 4rem)", lineHeight: 1.05, margin: "1rem auto", maxWidth: "780px" }}>
          Get three practical merch ideas for your brand.
        </h1>
        <p style={{ color: "var(--text-secondary)", fontFamily: "var(--font-dm-sans)", lineHeight: 1.7, maxWidth: "620px", margin: "0 auto" }}>
          Send your logo, audience and rough quantity. We&apos;ll return a free mock-up pack with product ideas and rough pricing. No upfront cost and no obligation.
        </p>
      </section>
      <QuoteForm />
      <Footer />
    </main>
  );
}
