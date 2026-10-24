import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import ConsentBanner from "@/components/ConsentBanner";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const siteUrl = "https://novamerchau.com";

const frequentlyAskedQuestions = [
  {
    question: "Is there a minimum order quantity?",
    answer:
      "It depends on the product and decoration method. Tell us what you have in mind and we will explain the applicable options before you commit.",
  },
  {
    question: "What affects the price?",
    answer:
      "Product choice, quantities, branding method, number of print positions and delivery requirements all shape the final quote.",
  },
  {
    question: "Can you match our brand colours?",
    answer:
      "We can review your artwork and recommend appropriate product colours and branding methods. Exact colour matching depends on the material and production process.",
  },
  {
    question: "Can we order several products together?",
    answer:
      "Yes. A mixed pack can be a practical way to cover uniforms, gifts, events or a campaign in one brief.",
  },
  {
    question: "Do you deliver Australia-wide?",
    answer:
      "Yes. NovaMerch is Newcastle-based and works with businesses, clubs and teams around Australia.",
  },
];

export const metadata: Metadata = {
  title: "Custom Branded Merchandise Australia | NovaMerch Newcastle",
  description:
    "Premium custom branded merchandise for Australian businesses, sports clubs and teams. Newcastle-based, shipping Australia-wide. Bottles, caps, apparel, pens, tote bags, corporate gifts and event packs.",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  keywords: [
    "branded merchandise Australia",
    "custom merch Australia",
    "promotional products Australia",
    "branded merchandise Newcastle",
    "branded water bottles",
    "custom caps",
    "corporate gifts Australia",
    "sports club merchandise",
  ],
  openGraph: {
    title: "NovaMerch | Branded Merchandise Australia",
    description:
      "Premium custom branded merchandise for Australian businesses, sports clubs and teams. Newcastle-based, shipping Australia-wide. Bottles, caps, apparel, pens, tote bags, corporate gifts and event packs.",
    url: siteUrl,
    siteName: "NovaMerch",
    type: "website",
    locale: "en_AU",
    images: [{ url: "/products-showcase.png", width: 1100, height: 1430, alt: "NovaMerch branded merchandise collection" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NovaMerch | Branded Merchandise Australia",
    description: "Custom branded apparel, promotional products and corporate gifts for Australian businesses, clubs and teams.",
    images: ["/products-showcase.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.variable} ${inter.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${siteUrl}/#organization`,
                  name: "NovaMerch",
                  url: `${siteUrl}/`,
                  areaServed: ["Newcastle", "New South Wales", "Australia"],
                  description: "Custom branded merchandise for Australian businesses, sports clubs and teams.",
                  email: "support@novamerchau.com",
                  sameAs: [
                    "https://www.facebook.com/profile.php?id=61595025208241",
                    "https://www.instagram.com/novamerch.au/",
                    "https://www.linkedin.com/company/novamerch-au/",
                  ],
                  contactPoint: {
                    "@type": "ContactPoint",
                    contactType: "sales",
                    email: "support@novamerchau.com",
                    telephone: "+61422518149",
                    availableLanguage: "en",
                  },
                  telephone: "+61422518149",
                  taxID: "60917373894",
                  knowsAbout: ["Custom apparel", "Promotional products", "Branded merchandise", "Corporate gifts", "Sports club merchandise"],
                },
                {
                  "@type": "WebSite",
                  "@id": `${siteUrl}/#website`,
                  name: "NovaMerch",
                  url: `${siteUrl}/`,
                  inLanguage: "en-AU",
                  publisher: { "@id": `${siteUrl}/#organization` },
                },
                {
                  "@type": "FAQPage",
                  "@id": `${siteUrl}/#faq`,
                  mainEntity: frequentlyAskedQuestions.map(({ question, answer }) => ({
                    "@type": "Question",
                    name: question,
                    acceptedAnswer: { "@type": "Answer", text: answer },
                  })),
                },
              ],
            }),
          }}
        />
        {children}
        <ConsentBanner />
      </body>
    </html>
  );
}
