import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Novamerch | Branded Merchandise for Newcastle and Sydney Businesses",
  description:
    "Custom branded merchandise for businesses and sports clubs across Newcastle and Sydney. Hoodies, caps, drink bottles, bags and more. Free mockups in 24 hours.",
  metadataBase: new URL("https://novamerchau.com"),
  openGraph: {
    title: "Novamerch | Branded Merchandise for Newcastle and Sydney Businesses",
    description:
      "Custom branded merchandise for businesses and sports clubs. Free mockups in 24 hours. Source direct, better prices.",
    url: "https://novamerchau.com",
    siteName: "Novamerch",
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
