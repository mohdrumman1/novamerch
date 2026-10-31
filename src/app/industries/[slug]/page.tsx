import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";

const productLabels: Record<string, string> = {
  "custom-drink-bottles": "Custom drink bottles",
  "embroidered-caps": "Embroidered caps",
  "custom-hoodies": "Custom hoodies",
  "branded-polos": "Branded polos",
  "branded-workwear": "Branded workwear",
  "promotional-pens": "Promotional pens",
  "branded-tote-bags": "Branded tote bags",
  "corporate-gifts": "Corporate gifts",
};

const industryDetail: Record<string, { lead: string; products: string[]; questions: string[] }> = {
  "construction-trades": {
    lead: "Crews, subcontractors and site teams need merch that is practical first. Start with what people wear every day, then add caps and small items for clients and suppliers.",
    products: ["branded-workwear", "branded-polos", "embroidered-caps"],
    questions: ["How many people need a full kit, and how many only need a cap or polo?", "Where will the logo sit so it stays readable on the job?", "Do you need a reorder path for new starters?"],
  },
  "gyms-fitness": {
    lead: "Gyms and studios use merch for staff, members and launches. A small, consistent range usually works better than a long catalogue.",
    products: ["custom-hoodies", "custom-drink-bottles", "branded-tote-bags"],
    questions: ["Is this for staff, for members to buy, or both?", "Which one or two products suit your members best?", "Will you want to reorder once the first run is gone?"],
  },
  corporate: {
    lead: "Corporate teams order for onboarding, events, client thank-yous and staff uniforms. Matching the product to the moment matters more than the logo size.",
    products: ["corporate-gifts", "branded-polos", "promotional-pens"],
    questions: ["Who receives it, and what do you want them to do with it?", "What budget per person suits the occasion?", "When does it need to arrive?"],
  },
  "real-estate": {
    lead: "Agencies order apparel for agents and small gifts for clients, vendors and open homes. Keep the look consistent across both.",
    products: ["corporate-gifts", "branded-polos", "promotional-pens"],
    questions: ["Is this team apparel, client gifts, or both?", "How many agents and offices need to match?", "What should a gift feel like when it lands on a client's desk?"],
  },
  "schools-events": {
    lead: "Schools, clubs and event organisers usually work to a fixed date and a fixed budget. Decide the deadline and per-item budget first, then choose products.",
    products: ["branded-tote-bags", "custom-drink-bottles", "promotional-pens"],
    questions: ["What is the hard deadline, and what is the budget per item?", "How many people need one, and do sizes matter?", "Is this a one-off event or something you will reorder?"],
  },
};

const industries = {
  "construction-trades": { name: "Construction & trades", hook: "Look organised before you say a word.", body: "Workwear that survives the site, looks sharp in the ute and makes every crew member feel part of the same operation.", proof: ["Hard-wearing workwear", "Crew-ready quantities", "Logo placement that lasts"] },
  "gyms-fitness": { name: "Gyms & fitness", hook: "Turn members into walking billboards.", body: "Build a merch drop people actually want to wear: clean cuts, strong branding and products that keep your gym top of mind between sessions.", proof: ["Member-ready apparel", "Launch packs that sell", "Simple reorder support"] },
  corporate: { name: "Corporate teams", hook: "Make your brand feel bigger than it is.", body: "Onboarding kits, event drops and client gifts that feel considered - not another forgettable logo on a cheap giveaway.", proof: ["Premium first impressions", "Cohesive team kits", "Australia-wide delivery"] },
  "real-estate": { name: "Real estate", hook: "Win the listing before the listing.", body: "Brand-forward client gifts and team pieces that keep your agency in the room long after the inspection ends.", proof: ["Settlement gift ideas", "Agent-ready apparel", "Polished presentation"] },
  "schools-events": { name: "Schools & events", hook: "Give people something worth keeping.", body: "Useful packs, event merch and community-ready products built around your audience, your budget and your deadline.", proof: ["Easy bulk ordering", "Clear budget options", "Deadline-led sourcing"] },
} as const;

export function generateStaticParams() { return Object.keys(industries).map((slug) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const i = industries[slug as keyof typeof industries];

  return i
    ? {
        title: `Custom Merchandise for ${i.name} | NovaMerch`,
        description: i.body,
        alternates: { canonical: `/industries/${slug}/` },
        openGraph: {
          title: `Custom Merchandise for ${i.name} | NovaMerch`,
          description: i.body,
          url: `https://novamerchau.com/industries/${slug}/`,
          type: "website",
        },
      }
    : {};
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const i = industries[slug as keyof typeof industries]; if (!i) notFound(); const d = industryDetail[slug]; return <><Nav /><main style={{ minHeight: "100vh", background: "#060C18", color: "#F4F7FB", padding: "8rem 1.5rem 5rem", overflow: "hidden" }}><div style={{ maxWidth: 1120, margin: "auto" }}><p style={{ color: "#00CFFF", letterSpacing: ".16em", fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase" }}>NovaMerch / {i.name}</p><div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.15fr) minmax(280px,.85fr)", gap: "4rem", alignItems: "end", marginTop: "2rem" }}><div><h1 style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(2.4rem,6vw,5rem)", lineHeight: 1, letterSpacing: "-.05em", margin: 0 }}>Custom merchandise for {i.name.toLowerCase()}</h1><p style={{ color: "#00CFFF", fontSize: "1.3rem", fontWeight: 700, margin: "1.25rem 0 0" }}>{i.hook}</p><p style={{ color: "#AAB8CC", fontSize: "1.15rem", lineHeight: 1.7, maxWidth: 620, margin: "1rem 0 2rem" }}>{i.body}</p><Link href={`/?utm_source=industry&utm_campaign=${slug}#quote`} style={{ display: "inline-flex", background: "#00CFFF", color: "#06101D", padding: "1rem 1.5rem", borderRadius: 999, fontWeight: 800, textDecoration: "none" }}>Get my merch plan ↗</Link></div><div style={{ border: "1px solid rgba(255,255,255,.14)", borderRadius: 18, padding: "1.5rem", background: "linear-gradient(145deg,rgba(0,207,255,.12),rgba(139,92,246,.12))" }}><p style={{ color: "#AAB8CC", marginTop: 0 }}>The unfair advantage</p>{i.proof.map((p, n) => <div key={p} style={{ padding: "1.1rem 0", borderTop: "1px solid rgba(255,255,255,.12)", fontSize: "1.1rem", fontWeight: 700 }}><span style={{ color: n % 2 ? "#8B5CF6" : "#00CFFF", marginRight: 12 }}>0{n + 1}</span>{p}</div>)}</div></div><section style={{ marginTop: "4rem" }}><h2 style={{ fontFamily: "var(--font-syne)", fontSize: "1.8rem", margin: "0 0 1rem" }}>Where to start</h2><p style={{ color: "#AAB8CC", maxWidth: 700, lineHeight: 1.7 }}>{d.lead}</p><ul style={{ listStyle: "none", padding: 0, margin: "1.5rem 0 0", display: "grid", gap: ".75rem", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}>{d.products.map((slug) => <li key={slug}><Link href={`/products/${slug}/`} style={{ display: "block", border: "1px solid rgba(255,255,255,.14)", borderRadius: 14, padding: "1rem 1.1rem", color: "#F4F7FB", fontWeight: 700, textDecoration: "none" }}>{productLabels[slug]} →</Link></li>)}</ul></section><section style={{ marginTop: "3rem" }}><h2 style={{ fontFamily: "var(--font-syne)", fontSize: "1.8rem", margin: "0 0 1rem" }}>Questions to settle before you order</h2><ul style={{ color: "#AAB8CC", lineHeight: 1.8, maxWidth: 700, paddingLeft: "1.2rem" }}>{d.questions.map((q) => <li key={q}>{q}</li>)}</ul><p style={{ color: "#AAB8CC", maxWidth: 700, lineHeight: 1.7, marginTop: "1.5rem" }}>Read <Link href="/guides/what-affects-custom-merchandise-cost/" style={{ color: "#F4F7FB", fontWeight: 700 }}>what affects the cost of custom merchandise</Link> and <Link href="/guides/how-long-does-custom-merchandise-take/" style={{ color: "#F4F7FB", fontWeight: 700 }}>how long custom merchandise takes</Link> before you brief us. NovaMerch is based in Newcastle and delivers across Australia. See our <Link href="/solutions/custom-merchandise-newcastle/" style={{ color: "#F4F7FB", fontWeight: 700 }}>Newcastle custom merchandise page</Link>.</p></section><section style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,.12)" }}><p style={{ color: "#AAB8CC", maxWidth: 700, lineHeight: 1.7 }}>You bring the audience, quantity and deadline. We bring the shortlist, artwork direction and supplier wrangling - so you can approve with confidence and get on with the job.</p><Link href="/#products" style={{ color: "#F4F7FB", fontWeight: 700 }}>See product categories →</Link></section></div></main><Footer /></>; }
