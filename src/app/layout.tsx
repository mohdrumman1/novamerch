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
        {children}
      </body>
    </html>
  );
}
