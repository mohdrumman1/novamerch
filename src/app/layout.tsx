import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "NovaMerch | Branded Merchandise Newcastle",
  description:
    "Custom branded merchandise for Newcastle businesses, sports clubs and teams. Bottles, caps, pens, apparel, tote bags and corporate gift ideas.",
  metadataBase: new URL("https://novamerchau.com"),
  keywords: [
    "branded merchandise Newcastle",
    "custom merch Newcastle",
    "promotional products Newcastle",
    "branded water bottles",
    "custom caps",
    "corporate gifts Newcastle",
    "sports club merchandise",
  ],
  openGraph: {
    title: "NovaMerch | Branded Merchandise Newcastle",
    description:
      "Custom branded merchandise for Newcastle businesses, sports clubs and teams. Bottles, caps, pens, apparel, tote bags and corporate gift ideas.",
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
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
