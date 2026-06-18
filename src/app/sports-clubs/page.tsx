"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { catalogueProducts, type AccentColor, type MockupType } from "@/data/catalogue";

const mockupImages: Record<MockupType, string> = {
  bottle: "/bottle-mockup.png",
  cap: "/cap-mockup.png",
  pen: "/pen-mockup.png",
  tote: "/tote-mockup.png",
  giftbox: "/giftbox-mockup.png",
  "sports-bottle": "/sports-bottle-mockup.png",
  "staff-pack": "/staff-pack-mockup.png",
  "event-pack": "/event-pack-mockup.png",
};

function accentVar(a: AccentColor) {
  return a === "cyan" ? "var(--cyan)" : "var(--violet)";
}

function accentRgb(a: AccentColor) {
  return a === "cyan" ? "0,207,255" : "139,92,246";
}

/* ── Reusable mockup image ── */
function ProductMockup({ type, accent, src }: { type: MockupType; accent: AccentColor; src?: string }) {
  const rgb = accentRgb(accent);
  return (
    <div style={{ width: "100%", height: "250px", position: "relative", borderRadius: 10, overflow: "hidden", background: `radial-gradient(circle at center,rgba(${rgb},0.06) 0%,transparent 70%)`, marginBottom: "1.25rem" }}>
      <Image src={src ?? mockupImages[type]} alt={type} fill style={{ objectFit: "contain" }} sizes="280px" />
    </div>
  );
}

/* ── Section: Hero ── */
function SportsHero() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const els = ref.current?.querySelectorAll<HTMLElement>(".anim-fade-up, .anim-fade-in");
    if (!els) return;
    const ob = new IntersectionObserver((e) => e.forEach((en) => { if (en.isIntersecting) (en.target as HTMLElement).classList.add("visible"); }), { threshold: 0.06 });
    els.forEach((el) => ob.observe(el));
    return () => ob.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        background: "#060C18",
        padding: "9rem 1.5rem 6rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Hero background image */}
      <Image
        src="/sports-clubs-hero-bg.png"
        alt=""
        fill
        style={{ objectFit: "cover", opacity: 0.3 }}
        priority
      />
      {/* Dark gradient overlay so text stays legible */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(6,12,24,0.9) 0%, rgba(10,21,37,0.75) 60%, rgba(13,27,42,0.85) 100%)", pointerEvents: "none" }} />
      {/* Ambient glow orbs */}
      <div style={{ position: "absolute", top: "-15%", left: "-10%", width: 600, height: 600, background: "radial-gradient(circle, rgba(0,207,255,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: 500, height: 500, background: "radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 65%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "72rem", margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
        {/* Tag */}
        <div
          className="anim-fade-up"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(0,207,255,0.08)", border: "1px solid rgba(0,207,255,0.2)", borderRadius: "9999px", padding: "0.35rem 1rem", marginBottom: "2rem" }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--cyan)", display: "inline-block" }} />
          <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.78rem", fontWeight: 500, color: "var(--cyan)", letterSpacing: "0.06em" }}>
            Sports Clubs &amp; Teams
          </span>
        </div>

        <h1
          className="anim-fade-up"
          style={{
            fontFamily: "var(--font-syne)",
            fontWeight: 800,
            fontSize: "clamp(2.4rem, 5.5vw, 5rem)",
            lineHeight: 1.05,
            color: "var(--text-primary)",
            letterSpacing: "-0.025em",
            maxWidth: "820px",
            marginBottom: "1.5rem",
            animationDelay: "0.08s",
          }}
        >
          Merch Your Club Will{" "}
          <br />
          <span style={{ background: "linear-gradient(135deg, var(--cyan) 0%, var(--violet) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Actually Use
          </span>
        </h1>

        <p
          className="anim-fade-up"
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "clamp(1rem, 2vw, 1.15rem)",
            color: "var(--text-secondary)",
            lineHeight: 1.7,
            maxWidth: "560px",
            marginBottom: "2.5rem",
            animationDelay: "0.16s",
          }}
        >
          Caps, drink bottles, hoodies, supporter packs and sponsor merch, all branded with your club&apos;s logo and colours. Carefully sourced and personalised around your budget.
        </p>

        <div
          className="anim-fade-up"
          style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "2.5rem", animationDelay: "0.24s" }}
        >
          <Link
            href="/#quote"
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "var(--cyan)",
              color: "#060C18",
              fontFamily: "var(--font-syne)",
              fontWeight: 700,
              fontSize: "0.95rem",
              padding: "1rem 2rem",
              borderRadius: "9999px",
              textDecoration: "none",
              transition: "background 0.2s, transform 0.2s",
              boxShadow: "0 0 32px rgba(0,207,255,0.35)",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#00b8e6"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--cyan)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
          >
            Get a Club Merch Quote
          </Link>
          <a
            href="#club-products"
            style={{
              display: "inline-flex",
              alignItems: "center",
              color: "var(--text-primary)",
              fontFamily: "var(--font-syne)",
              fontWeight: 600,
              fontSize: "0.95rem",
              padding: "1rem 2rem",
              borderRadius: "9999px",
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.04)",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)")}
          >
            View Products
          </a>
        </div>

        <p
          className="anim-fade-up"
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "0.82rem",
            color: "var(--text-muted)",
            animationDelay: "0.32s",
          }}
        >
          No upfront cost &nbsp;·&nbsp; No minimums &nbsp;·&nbsp; Newcastle-based &nbsp;·&nbsp; Ships Australia-wide
        </p>
      </div>
    </section>
  );
}

/* ── Section: Why Clubs Choose NovaMerch ── */
function ClubBenefits() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const els = ref.current?.querySelectorAll<HTMLElement>(".anim-fade-up");
    if (!els) return;
    const ob = new IntersectionObserver((e) => e.forEach((en) => { if (en.isIntersecting) (en.target as HTMLElement).classList.add("visible"); }), { threshold: 0.06 });
    els.forEach((el) => ob.observe(el));
    return () => ob.disconnect();
  }, []);

  const benefits = [
    { title: "No Minimums", body: "Need 10 caps or 500 bottles? We work with your quantity, not the other way around.", accent: "cyan" as AccentColor, icon: "01" },
    { title: "Club Colours & Logos", body: "We match your club's branding exactly: right colours, right placement, right finish.", accent: "violet" as AccentColor, icon: "02" },
    { title: "Budget-Friendly Options", body: "From small fundraising runs to full-season merch orders, we find curated product options that fit.", accent: "cyan" as AccentColor, icon: "03" },
    { title: "One Point of Contact", body: "We handle artwork, sourcing and supplier communication. You just approve and order.", accent: "violet" as AccentColor, icon: "04" },
  ];

  return (
    <section
      ref={ref}
      style={{ background: "var(--bg-mid)", padding: "6rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <p className="anim-fade-up" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--cyan)", marginBottom: "1.25rem" }}>
          Why NovaMerch
        </p>
        <h2 className="anim-fade-up" style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3.25rem)", lineHeight: 1.08, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: "3rem", animationDelay: "0.08s" }}>
          Simple, Affordable Club Merch
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
          {benefits.map((b, i) => {
            const rgb = accentRgb(b.accent);
            const color = accentVar(b.accent);
            return (
              <div
                key={b.title}
                className="anim-fade-up glass"
                style={{
                  borderRadius: 16,
                  padding: "1.75rem",
                  borderTop: `3px solid ${color}`,
                  borderLeft: "1px solid rgba(255,255,255,0.08)",
                  borderRight: "1px solid rgba(255,255,255,0.08)",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  transition: "box-shadow 0.3s, transform 0.3s",
                  animationDelay: `${i * 0.08}s`,
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 0 32px rgba(${rgb},0.12)`; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `rgba(${rgb},0.1)`, border: `1px solid rgba(${rgb},0.2)`, display: "flex", alignItems: "center", justifyContent: "center", color, fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "0.8rem", marginBottom: "1rem" }}>
                  {b.icon}
                </div>
                <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", letterSpacing: "-0.01em", marginBottom: "0.5rem" }}>{b.title}</h3>
                <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>{b.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Section: Club Products ── */
type LocalProduct = {
  id: string;
  name: string;
  category: string;
  description: string;
  bestFor: string;
  typicalQuantities: string;
  mockupType: MockupType;
  accent: AccentColor;
};

function ClubProducts() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const els = ref.current?.querySelectorAll<HTMLElement>(".anim-fade-up");
    if (!els) return;
    const ob = new IntersectionObserver((e) => e.forEach((en) => { if (en.isIntersecting) (en.target as HTMLElement).classList.add("visible"); }), { threshold: 0.06 });
    els.forEach((el) => ob.observe(el));
    return () => ob.disconnect();
  }, []);

  const localImages: Record<string, string> = {
    hoodie: "/hoodie-mockup.png",
    supporter: "/supporter-merch.png",
    "event-pack": "/event-pack-sports.png",
  };

  const sportsIds = ["sports-bottle", "cap", "tote", "event-pack"];
  const fromCatalogue: LocalProduct[] = catalogueProducts
    .filter((p) => sportsIds.includes(p.id))
    .map((p) => ({ id: p.id, name: p.name, category: p.category, description: p.description, bestFor: p.bestFor, typicalQuantities: p.typicalQuantities, mockupType: p.mockupType, accent: p.accent }));

  const local: LocalProduct[] = [
    {
      id: "hoodie",
      name: "Club Hoodie",
      category: "Apparel",
      description: "Team hoodies, training tops and supporter apparel with your club logo embroidered or printed on the chest or back.",
      bestFor: "Club training, supporters, events",
      typicalQuantities: "20 to 200+",
      mockupType: "staff-pack",
      accent: "violet",
    },
    {
      id: "supporter",
      name: "Supporter Merchandise",
      category: "Events",
      description: "Scarves, pins, stickers and supporter items that fans actually buy. Example concepts. We match these to your club colours and audience.",
      bestFor: "Membership drives, game days, fundraisers",
      typicalQuantities: "50 to 500+",
      mockupType: "event-pack",
      accent: "cyan",
    },
  ];

  const products = [...fromCatalogue, ...local];

  return (
    <section
      id="club-products"
      ref={ref}
      style={{ background: "var(--bg)", padding: "6rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <p className="anim-fade-up" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--cyan)", marginBottom: "1.25rem" }}>
          Club Products
        </p>
        <h2 className="anim-fade-up" style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3.25rem)", lineHeight: 1.08, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: "1rem", animationDelay: "0.08s" }}>
          What We Make for Sports Clubs
        </h2>
        <p className="anim-fade-up" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "1rem", color: "var(--text-secondary)", maxWidth: "520px", lineHeight: 1.7, marginBottom: "3rem", animationDelay: "0.16s" }}>
          Example concepts only. Colours, quantities and mockups are all customised around your club&apos;s brand after your brief is confirmed.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
          {products.map((p, i) => {
            const rgb = accentRgb(p.accent);
            const color = accentVar(p.accent);
            return (
              <div
                key={p.id}
                className="anim-fade-up glass"
                style={{
                  borderRadius: 16,
                  padding: "1.75rem",
                  borderTop: `3px solid ${color}`,
                  borderLeft: "1px solid rgba(255,255,255,0.08)",
                  borderRight: "1px solid rgba(255,255,255,0.08)",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  transition: "box-shadow 0.3s, transform 0.3s",
                  animationDelay: `${i * 0.07}s`,
                  display: "flex",
                  flexDirection: "column",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 0 32px rgba(${rgb},0.12)`; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
              >
                <ProductMockup type={p.mockupType} accent={p.accent} src={localImages[p.id]} />
                <span style={{ display: "inline-block", fontFamily: "var(--font-dm-sans)", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color, background: `rgba(${rgb},0.1)`, border: `1px solid rgba(${rgb},0.2)`, borderRadius: "9999px", padding: "0.18rem 0.65rem", marginBottom: "0.75rem", width: "fit-content" }}>
                  {p.category}
                </span>
                <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", letterSpacing: "-0.01em", marginBottom: "0.5rem" }}>{p.name}</h3>
                <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.83rem", color: "var(--text-secondary)", lineHeight: 1.65, flex: 1, marginBottom: "1rem" }}>{p.description}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "1.25rem" }}>
                  <div>
                    <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.72rem", fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Best for </span>
                    <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.8rem", color: "var(--text-secondary)" }}>{p.bestFor}</span>
                  </div>
                  <div>
                    <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.72rem", fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Typical qty </span>
                    <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.8rem", color: "var(--text-secondary)" }}>{p.typicalQuantities}</span>
                  </div>
                </div>
                <Link
                  href="/#quote"
                  style={{ fontFamily: "var(--font-syne)", fontWeight: 600, fontSize: "0.85rem", color, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem", transition: "opacity 0.2s" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.75")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                >
                  Ask about this
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5h9M7.5 3l3.5 3.5L7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Section: Club Pack Ideas ── */
function ClubPacks() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const els = ref.current?.querySelectorAll<HTMLElement>(".anim-fade-up");
    if (!els) return;
    const ob = new IntersectionObserver((e) => e.forEach((en) => { if (en.isIntersecting) (en.target as HTMLElement).classList.add("visible"); }), { threshold: 0.06 });
    els.forEach((el) => ob.observe(el));
    return () => ob.disconnect();
  }, []);

  const packImages: Record<string, string> = {
    "Training Day Pack": "/training-day.png",
    "Club Fundraising Bundle": "/fundraising.png",
    "Sponsor Welcome Kit": "/sponsor-kit.png",
  };

  const packs = [
    {
      num: "01",
      name: "Training Day Pack",
      items: ["Drink Bottle", "Cap", "Drawstring Bag"],
      description: "Perfect for pre-season, club days or team events. Everything your players need in one order, branded with your club logo.",
      accent: "cyan" as AccentColor,
    },
    {
      num: "02",
      name: "Club Fundraising Bundle",
      items: ["Caps", "Supporter Merch", "Drink Bottles"],
      description: "Low minimum quantities, good value. Ideal for fundraising drives or membership sign-up gifts. We can match these to your club colours.",
      accent: "violet" as AccentColor,
    },
    {
      num: "03",
      name: "Sponsor Welcome Kit",
      items: ["Premium Gift Box", "Branded Pen", "Drink Bottle", "Cap"],
      description: "Show sponsors you're professional. A curated presentation pack they'll keep and use, matched to your budget.",
      accent: "cyan" as AccentColor,
    },
  ];

  return (
    <section
      ref={ref}
      style={{ background: "var(--bg-mid)", padding: "6rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <p className="anim-fade-up" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--cyan)", marginBottom: "1.25rem" }}>
          Club Packs
        </p>
        <h2 className="anim-fade-up" style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3.25rem)", lineHeight: 1.08, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: "3rem", animationDelay: "0.08s" }}>
          Popular Club Packs
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {packs.map((pack, i) => {
            const rgb = accentRgb(pack.accent);
            const color = accentVar(pack.accent);
            return (
              <div
                key={pack.name}
                className="anim-fade-up glass"
                style={{
                  borderRadius: 16,
                  padding: "2rem 2.25rem",
                  borderLeft: `4px solid ${color}`,
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  borderRight: "1px solid rgba(255,255,255,0.08)",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1.5rem",
                  alignItems: "flex-start",
                  transition: "box-shadow 0.3s, transform 0.3s",
                  animationDelay: `${i * 0.1}s`,
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 0 32px rgba(${rgb},0.1)`; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
              >
                {/* Number */}
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `rgba(${rgb},0.1)`, border: `1px solid rgba(${rgb},0.2)`, display: "flex", alignItems: "center", justifyContent: "center", color, fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "0.85rem", flexShrink: 0 }}>
                  {pack.num}
                </div>
                {/* Info */}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "1.05rem", color: "var(--text-primary)", marginBottom: "0.75rem" }}>{pack.name}</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.875rem" }}>
                    {pack.items.map((item) => (
                      <span key={item} style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.72rem", fontWeight: 500, color, background: `rgba(${rgb},0.08)`, border: `1px solid rgba(${rgb},0.2)`, borderRadius: "9999px", padding: "0.2rem 0.7rem" }}>{item}</span>
                    ))}
                  </div>
                  <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.65, maxWidth: 520, marginBottom: "1rem" }}>{pack.description}</p>
                  <Link
                    href="/#quote"
                    style={{ fontFamily: "var(--font-syne)", fontWeight: 600, fontSize: "0.85rem", color, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem", transition: "opacity 0.2s" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.75")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                  >
                    Ask about this pack
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5h9M7.5 3l3.5 3.5L7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </Link>
                </div>
                {/* Pack image, desktop only */}
                {packImages[pack.name] && (
                  <div
                    className="hidden lg:block shrink-0"
                    style={{ width: 180, height: 140, position: "relative", borderRadius: 10, overflow: "hidden", background: `radial-gradient(circle at center,rgba(${rgb},0.06) 0%,transparent 70%)` }}
                  >
                    <Image src={packImages[pack.name]} alt={pack.name} fill style={{ objectFit: "contain" }} sizes="180px" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Section: How It Works for Clubs ── */
function ClubProcess() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const els = ref.current?.querySelectorAll<HTMLElement>(".anim-fade-up");
    if (!els) return;
    const ob = new IntersectionObserver((e) => e.forEach((en) => { if (en.isIntersecting) (en.target as HTMLElement).classList.add("visible"); }), { threshold: 0.06 });
    els.forEach((el) => ob.observe(el));
    return () => ob.disconnect();
  }, []);

  const steps = [
    { num: "1", title: "Send your club logo", body: "Drop us your logo file or point us to your club's socials. Any format works. We'll handle the rest." },
    { num: "2", title: "Tell us your budget and quantities", body: "Whether it's 20 caps or 200 bottles, let us know what you're planning and we'll find curated product options." },
    { num: "3", title: "Get 3 merch mockups", body: "We'll come back with branded product ideas and rough pricing matched to your club's budget and season schedule." },
    { num: "4", title: "Order only what works", body: "No obligation. If the options suit your club, we'll move to production. No pressure, no upfront costs." },
  ];

  return (
    <section
      ref={ref}
      style={{ background: "var(--bg)", padding: "6rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <p className="anim-fade-up" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--cyan)", marginBottom: "1.25rem" }}>
          How It Works
        </p>
        <h2 className="anim-fade-up" style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3.25rem)", lineHeight: 1.08, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: "3.5rem", animationDelay: "0.08s" }}>
          How It Works for Clubs
        </h2>

        {/* Steps */}
        <div style={{ position: "relative" }}>
          {/* Connecting line (desktop) */}
          <div className="hidden md:block" style={{ position: "absolute", top: 24, left: "calc(12.5% - 1px)", right: "calc(12.5% - 1px)", height: 1, background: "linear-gradient(90deg, transparent, rgba(0,207,255,0.25) 20%, rgba(139,92,246,0.25) 80%, transparent)", zIndex: 0 }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem", position: "relative", zIndex: 1 }}>
            {steps.map((step, i) => (
              <div key={step.num} className="anim-fade-up" style={{ textAlign: "center", animationDelay: `${i * 0.1}s` }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--bg)", border: "2px solid rgba(0,207,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "0.9rem", color: "var(--cyan)" }}>
                  {step.num}
                </div>
                <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: "0.625rem", letterSpacing: "-0.01em" }}>{step.title}</h3>
                <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.83rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Section: Sports CTA ── */
function SportsCTA() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const els = ref.current?.querySelectorAll<HTMLElement>(".anim-fade-up");
    if (!els) return;
    const ob = new IntersectionObserver((e) => e.forEach((en) => { if (en.isIntersecting) (en.target as HTMLElement).classList.add("visible"); }), { threshold: 0.2 });
    els.forEach((el) => ob.observe(el));
    return () => ob.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{ background: "var(--bg)", padding: "6rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div
        style={{
          maxWidth: "64rem",
          margin: "0 auto",
          background: "linear-gradient(135deg, rgba(0,207,255,0.08) 0%, rgba(139,92,246,0.1) 100%)",
          border: "1px solid rgba(0,207,255,0.15)",
          borderRadius: 24,
          padding: "clamp(2.5rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: "-30%", left: "-10%", width: 400, height: 400, background: "radial-gradient(circle, rgba(0,207,255,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-30%", right: "-10%", width: 350, height: 350, background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        <p className="anim-fade-up" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--cyan)", marginBottom: "1.25rem", position: "relative" }}>
          Free Mockup Pack
        </p>
        <h2 className="anim-fade-up" style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(1.75rem, 4vw, 3.25rem)", lineHeight: 1.1, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: "1.25rem", position: "relative", animationDelay: "0.08s" }}>
          Ready to Gear Up Your Club?
          <br />
          <span style={{ background: "linear-gradient(135deg, var(--cyan) 0%, var(--violet) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Start with a Free Mockup Pack
          </span>
        </h2>
        <p className="anim-fade-up" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 2.5rem", position: "relative", animationDelay: "0.16s" }}>
          Send us your club logo and we&apos;ll create 3 branded product ideas with rough pricing, matched to your team&apos;s budget and season schedule.
        </p>
        <div className="anim-fade-up" style={{ position: "relative", animationDelay: "0.24s" }}>
          <Link
            href="/#quote"
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#fff", color: "#060C18", fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "0.95rem", padding: "1rem 2.25rem", borderRadius: "9999px", textDecoration: "none", transition: "opacity 0.2s, transform 0.2s", boxShadow: "0 0 40px rgba(0,207,255,0.2)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.9"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
          >
            Get My Free Club Merch Quote
          </Link>
          <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "1rem" }}>
            Newcastle-based. Working with clubs across Australia.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── Page export ── */
export default function SportsClubsPage() {
  return (
    <main>
      <Nav />
      <SportsHero />
      <ClubBenefits />
      <ClubProducts />
      <ClubPacks />
      <ClubProcess />
      <SportsCTA />
      <Footer />
    </main>
  );
}
