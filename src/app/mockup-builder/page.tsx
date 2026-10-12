import type { Metadata } from "next";
import { MockupBuilderClient } from "./client";

export const metadata: Metadata = {
  title: "Free Branded Merchandise Mockup Builder | NovaMerch",
  description:
    "Create a free branded merchandise mock-up for your Newcastle, Maitland or Australian business, club or event and request a practical quote.",
  alternates: { canonical: "/mockup-builder/" },
  openGraph: {
    title: "Free Branded Merchandise Mockup Builder | NovaMerch",
    description:
      "Create a free branded merchandise mock-up and request a practical quote from NovaMerch.",
    url: "https://novamerchau.com/mockup-builder/",
    type: "website",
  },
};

export default function MockupBuilderPage() {
  return <MockupBuilderClient />;
}
