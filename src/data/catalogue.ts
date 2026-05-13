export type MockupType =
  | "bottle"
  | "cap"
  | "pen"
  | "tote"
  | "giftbox"
  | "sports-bottle"
  | "staff-pack"
  | "event-pack";

export type AccentColor = "cyan" | "violet";

export interface CatalogueProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  bestFor: string;
  popularWith: string;
  typicalQuantities: string;
  mockupType: MockupType;
  ctaLabel: string;
  accent: AccentColor;
}

export interface CatalogueBundle {
  name: string;
  items: string[];
  description: string;
  accent: AccentColor;
}

export const filterCategories: string[] = [
  "All",
  "Drinkware",
  "Apparel",
  "Office",
  "Bags",
  "Gift Packs",
  "Sports Clubs",
  "Events",
];

export const catalogueProducts: CatalogueProduct[] = [
  {
    id: "bottle",
    name: "Matte Drink Bottle",
    category: "Drinkware",
    description:
      "A premium everyday bottle for staff, clients, gyms, clubs and events. Available in a range of matte finishes with your logo or brand colours.",
    bestFor: "Staff gifts, sports teams, client packs",
    popularWith: "Construction, real estate, healthcare, sports clubs",
    typicalQuantities: "25 to 250+",
    mockupType: "bottle",
    ctaLabel: "Ask about this",
    accent: "cyan",
  },
  {
    id: "cap",
    name: "Custom Cap",
    category: "Apparel",
    description:
      "Simple, wearable merch for teams, site crews, clubs and local campaigns. Embroidered or printed with your logo on the front panel.",
    bestFor: "Sports clubs, staff uniforms, events",
    popularWith: "Construction, trades, clubs, gyms",
    typicalQuantities: "30 to 300+",
    mockupType: "cap",
    ctaLabel: "Ask about this",
    accent: "violet",
  },
  {
    id: "pen",
    name: "Branded Pen",
    category: "Office",
    description:
      "A low-cost everyday item that keeps your name on desks and counters. A reliable option for client packs, events and reception areas.",
    bestFor: "Offices, events, reception desks, client packs",
    popularWith: "Legal, finance, healthcare, real estate",
    typicalQuantities: "100 to 1000+",
    mockupType: "pen",
    ctaLabel: "Ask about this",
    accent: "cyan",
  },
  {
    id: "tote",
    name: "Tote Bag",
    category: "Bags",
    description:
      "Useful event and retail merch with a large branding area. A practical option for welcome packs, open homes and community events.",
    bestFor: "Events, welcome packs, clinics, open homes",
    popularWith: "Healthcare, real estate, retail, community events",
    typicalQuantities: "50 to 500+",
    mockupType: "tote",
    ctaLabel: "Ask about this",
    accent: "violet",
  },
  {
    id: "giftbox",
    name: "Corporate Gift Box",
    category: "Gift Packs",
    description:
      "A curated branded gift set for clients, staff or event guests. Personalised around your brand and matched to your budget.",
    bestFor: "Client gifts, staff onboarding, premium events",
    popularWith: "Finance, legal, real estate, professional services",
    typicalQuantities: "10 to 150+",
    mockupType: "giftbox",
    ctaLabel: "Ask about this",
    accent: "cyan",
  },
  {
    id: "sports-bottle",
    name: "Sports Club Bottle Pack",
    category: "Sports Clubs",
    description:
      "Practical branded bottles for players, coaches and supporters. An example concept. Quantities and product options are matched to your club.",
    bestFor: "Clubs, teams, training days, fundraisers",
    popularWith: "Football clubs, gyms, schools, local teams",
    typicalQuantities: "30 to 300+",
    mockupType: "sports-bottle",
    ctaLabel: "Ask about this",
    accent: "violet",
  },
  {
    id: "staff-pack",
    name: "Staff Welcome Pack",
    category: "Gift Packs",
    description:
      "A branded bundle for onboarding new staff or refreshing team gear. We can curate product combinations around your brand identity.",
    bestFor: "New hires, office teams, remote staff",
    popularWith: "Professional services, clinics, finance, construction",
    typicalQuantities: "10 to 100+",
    mockupType: "staff-pack",
    ctaLabel: "Ask about this",
    accent: "cyan",
  },
  {
    id: "event-pack",
    name: "Event Giveaway Pack",
    category: "Events",
    description:
      "A simple branded pack for expos, open days, launches and community events. Example concepts only. We customise these around your audience.",
    bestFor: "Events, trade shows, open homes, activations",
    popularWith: "Real estate, healthcare, councils, clubs",
    typicalQuantities: "50 to 500+",
    mockupType: "event-pack",
    ctaLabel: "Ask about this",
    accent: "violet",
  },
];

export const catalogueBundles: CatalogueBundle[] = [
  {
    name: "Staff Starter Pack",
    items: ["Drink Bottle", "Cap", "Pen", "Tote Bag"],
    description:
      "A practical branded bundle for staff gifts, onboarding or team rewards. Curated product options matched to your brand.",
    accent: "cyan",
  },
  {
    name: "Sports Club Pack",
    items: ["Drink Bottle", "Cap", "Training Shirt", "Supporter Merch"],
    description:
      "Popular branded items for clubs and teams. Typical quantities vary by item. Ask us for a personalised club quote.",
    accent: "violet",
  },
  {
    name: "Client Gift Pack",
    items: ["Drink Bottle", "Notebook", "Pen", "Gift Box"],
    description:
      "A premium client gift set for settlements, milestones or seasonal gifts. Packaging and products matched to your budget.",
    accent: "cyan",
  },
  {
    name: "Event Giveaway Pack",
    items: ["Tote Bag", "Pen", "Drink Bottle", "Flyer Insert"],
    description:
      "A classic event pack for expos, open homes and activations. Available in small or large runs.",
    accent: "violet",
  },
  {
    name: "Construction Team Pack",
    items: ["Drink Bottle", "Cap", "Cooler Bag", "Branded Workwear"],
    description:
      "Site-friendly branded gear for crews, supervisors and trade teams. Practical products that get used every day.",
    accent: "cyan",
  },
];
