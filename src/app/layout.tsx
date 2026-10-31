import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Instrument_Serif, DM_Mono } from "next/font/google";
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

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const siteUrl = "https://novamerchau.com";

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
      <body className={`${plusJakarta.variable} ${inter.variable} ${instrumentSerif.variable} ${dmMono.variable} antialiased`}>
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
