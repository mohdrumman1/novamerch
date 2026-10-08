import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "NovaMerch | Branded Merchandise Australia",
  description:
    "Premium custom branded merchandise for Australian businesses, sports clubs and teams. Newcastle-based, shipping Australia-wide. Bottles, caps, apparel, pens, tote bags, corporate gifts and event packs.",
  metadataBase: new URL("https://novamerchau.com"),
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
    url: "https://novamerchau.com",
    siteName: "NovaMerch",
    type: "website",
  },
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
                  "@id": "https://novamerchau.com/#organization",
                  name: "NovaMerch",
                  url: "https://novamerchau.com/",
                  areaServed: ["Newcastle", "Maitland", "New South Wales", "Australia"],
                  description: "Custom branded merchandise for Australian businesses, sports clubs and teams.",
                },
                {
                  "@type": "WebSite",
                  "@id": "https://novamerchau.com/#website",
                  name: "NovaMerch",
                  url: "https://novamerchau.com/",
                  publisher: { "@id": "https://novamerchau.com/#organization" },
                },
                {
                  "@type": "FAQPage",
                  mainEntity: [
                    ["Do you have minimum order quantities?", "No fixed minimums. Some products have supplier minimums, which NovaMerch flags upfront."],
                    ["Can you help me choose products?", "Yes. NovaMerch suggests product options based on business type, budget and purpose."],
                    ["Can you work with sports clubs?", "Yes. NovaMerch supplies branded merchandise for clubs, teams, sponsors and members."],
                    ["What logo files do I need?", "Vector files such as AI, EPS or PDF work best, but JPEG or PNG files can also be reviewed."],
                    ["How long does it take?", "Timeframes vary by product and quantity. NovaMerch provides an indication with the product options and confirms dates after supplier checks."],
                  ].map(([name, text]) => ({
                    "@type": "Question",
                    name,
                    acceptedAnswer: { "@type": "Answer", text },
                  })),
                },
              ],
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
