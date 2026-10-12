import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sports Club Merchandise Newcastle & Australia | NovaMerch",
  description:
    "Custom club merchandise for Newcastle, Maitland and Australian sports clubs: apparel, caps, bottles, supporter packs and sponsor merch with a free quote.",
  alternates: { canonical: "/sports-clubs/" },
  openGraph: {
    title: "Sports Club Merchandise Newcastle & Australia | NovaMerch",
    description:
      "Custom club merchandise for Newcastle, Maitland and Australian sports clubs, with practical product options and a free quote.",
    url: "https://novamerchau.com/sports-clubs/",
    type: "website",
  },
};

export default function SportsClubsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
