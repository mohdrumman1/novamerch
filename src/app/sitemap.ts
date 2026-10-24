import type { MetadataRoute } from "next";

const siteUrl = "https://novamerchau.com";
const productSlugs = ["custom-drink-bottles", "embroidered-caps", "custom-hoodies", "branded-polos", "branded-workwear", "promotional-pens", "branded-tote-bags", "corporate-gifts"];
const industrySlugs = ["construction-trades", "gyms-fitness", "corporate", "real-estate", "schools-events"];

export const dynamic = "force-static";
export const revalidate = false;

export default function sitemap(): MetadataRoute.Sitemap {
  // Fixed dates: bump a page's entry only on a material content change.
  const now = new Date("2026-10-24");

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/sports-clubs`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/products`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/mockup-builder`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/free-mockup`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...productSlugs.map((slug) => ({ url: `${siteUrl}/products/${slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...industrySlugs.map((slug) => ({ url: `${siteUrl}/industries/${slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
    {
      url: `${siteUrl}/solutions/custom-merchandise-newcastle/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/guides/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/guides/club-merch-ordering-checklist/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/guides/embroidery-vs-screen-printing-vs-dtf/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/privacy/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
