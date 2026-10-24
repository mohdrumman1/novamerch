import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | NovaMerch",
  description: "How NovaMerch collects, uses and protects the information you send us when you request a quote or mockup.",
  alternates: { canonical: "/privacy/" },
};

const h2 = { fontFamily: "var(--font-syne)", color: "var(--text-primary)", marginTop: "2rem" } as const;

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main style={{ background: "#060c18", color: "var(--text-primary)", minHeight: "100vh", padding: "8rem 1.5rem 5rem" }}>
        <article className="nm-prose" style={{ maxWidth: "46rem", margin: "0 auto", lineHeight: 1.75, color: "var(--text-secondary)" }}>
          <h1 style={{ fontFamily: "var(--font-syne)", color: "var(--text-primary)" }}>Privacy Policy</h1>
          <p>Last updated 24 October 2026.</p>
          <p>NovaMerch is a Newcastle-based custom merchandise supplier. This page explains what we collect when you use this website and request a mockup or quote.</p>

          <h2 style={h2}>What we collect</h2>
          <p>When you submit the enquiry form we collect the details you give us: your name, business or club, email, phone, suburb, deadline, product interest, quantity, budget and message. We also record which page or campaign led you to the form (for example a link tagged with campaign information), the page you submitted from, and the time you agreed to be contacted.</p>
          <p>To remember where a visit came from, this site may store campaign details (such as UTM tags or advertising click identifiers) in your browser. These do not contain your name or contact details.</p>

          <h2 style={h2}>How we use it</h2>
          <p>We use your details to respond to your request, prepare mockups and quotes, manage your order and keep a record of our dealings with you. We use campaign details to understand which pages and channels bring genuine enquiries. We do not sell your information.</p>

          <h2 style={h2}>Marketing messages</h2>
          <p>Agreeing to be contacted about your request does not sign you up to a newsletter or promotional campaign. We will only send marketing to people who have separately asked for it, and every marketing message will include a way to unsubscribe.</p>

          <h2 style={h2}>Who handles your information</h2>
          <p>We keep enquiry and order records in our customer records system and use email delivery services to send confirmations and replies. Our website is hosted by cloud providers. These providers process information on our behalf to run those services. Some may store data outside Australia.</p>

          <h2 style={h2}>Keeping it secure</h2>
          <p>Enquiries are sent to our systems over an encrypted connection and access to our records is restricted to authorised people. No system is perfectly secure, so please do not send sensitive information such as payment card details through the enquiry form.</p>

          <h2 style={h2}>Access, correction and opting out</h2>
          <p>You can ask to see, correct or delete the information we hold about you, or opt out of contact, at any time by emailing <a href="mailto:support@novamerchau.com" style={{ color: "var(--cyan)" }}>support@novamerchau.com</a> or calling 0422 518 149. NovaMerch ABN 60 917 373 894. If you have a complaint about how we handle your information, contact us first. You may also contact the Office of the Australian Information Commissioner.</p>

          <h2 style={h2}>Changes</h2>
          <p>We may update this policy and will change the date above when we do.</p>
        </article>
      </main>
      <Footer />
    </>
  );
}
