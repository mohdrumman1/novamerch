"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";

type Product = {
  icon: React.ReactNode;
  name: string;
  description: string;
  accent: string;
};

const products: Product[] = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3h6v2c1.5.7 3 2.3 3 4v11a2 2 0 01-2 2H8a2 2 0 01-2-2V9c0-1.7 1.5-3.3 3-4V3z" />
        <line x1="6" y1="13" x2="18" y2="13" />
      </svg>
    ),
    name: "Drink Bottles",
    description: "Insulated stainless bottles and reusable drink bottles. A daily-use product that keeps your brand front of mind.",
    accent: "var(--cyan)",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 7L18 3h-4a2 2 0 01-4 0H6L4 7l4 2v11h8V9l4-2z" />
      </svg>
    ),
    name: "Caps & Apparel",
    description: "Embroidered caps, printed tees, hoodies and vests. Suited to sports teams, tradies and corporate use.",
    accent: "var(--violet)",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3l4 4L7 21H3v-4L17 3z" />
        <path d="M14.5 5.5l4 4" />
      </svg>
    ),
    name: "Pens & Office Merch",
    description: "Branded pens, notebooks and desk accessories. Works well for client gifts and conference packs.",
    accent: "var(--cyan)",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="7" width="16" height="14" rx="2" />
        <path d="M8 7V5a4 4 0 018 0v2" />
      </svg>
    ),
    name: "Tote Bags",
    description: "Cotton and non-woven tote bags with your branding. Useful for events, retail, markets and staff packs.",
    accent: "var(--violet)",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="9" width="18" height="12" rx="1" />
        <rect x="3" y="6" width="18" height="3" rx="1" />
        <path d="M12 6V21" />
        <path d="M12 6c0-1.5-2.5-4-4-3a2 2 0 000 3h4z" />
        <path d="M12 6c0-1.5 2.5-4 4-3a2 2 0 010 3h-4z" />
      </svg>
    ),
    name: "Corporate Gift Packs",
    description: "Curated branded gift sets for clients, new starters and team rewards. Matched to your budget.",
    accent: "var(--cyan)",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L3 7v5c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V7L12 2z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    name: "Sports Club Merch",
    description: "Caps, bottles, bags and apparel for clubs and teams. For training gear, sponsor giveaways and club merchandise.",
    accent: "var(--violet)",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    name: "Event Packs",
    description: "Branded merchandise bundles for launches, conferences, markets and community events.",
    accent: "var(--cyan)",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-5-5" />
        <path d="M8 11h6M11 8v6" />
      </svg>
    ),
    name: "Custom Product Sourcing",
    description: "Can't find what you need? We can source almost any branded product. Tell us what you have in mind.",
    accent: "var(--violet)",
  },
];

export default function Products() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll<HTMLElement>(".anim-fade-up");
    if (!els) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) (entry.target as HTMLElement).classList.add("visible");
        });
      },
      { threshold: 0.06 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="products"
      ref={sectionRef}
      style={{
        background: "var(--bg)",
        padding: "7rem 1.5rem",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>

        {/* Header - text left, bottle image right */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 mb-14">
          <div className="flex-1">
            <p
              className="anim-fade-up"
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "0.72rem",
                fontWeight: 500,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--cyan)",
                marginBottom: "1.25rem",
              }}
            >
              003 / Products
            </p>

            <h2
              className="anim-fade-up"
              style={{
                fontFamily: "var(--font-syne)",
                fontWeight: 800,
                fontSize: "clamp(2.2rem, 4.5vw, 3.75rem)",
                lineHeight: 1.08,
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
                marginBottom: "1rem",
                animationDelay: "0.08s",
              }}
            >
              A full merch system<br />for your business.
            </h2>

            <p
              className="anim-fade-up"
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "1rem",
                color: "var(--text-secondary)",
                maxWidth: "500px",
                lineHeight: 1.7,
                animationDelay: "0.16s",
              }}
            >
              Curated product options across all major categories, carefully sourced and managed for you.
            </p>
          </div>

          {/* Bottle image - desktop only */}
          <div
            className="hidden lg:flex anim-fade-up items-center justify-center shrink-0"
            style={{ position: "relative", animationDelay: "0.24s" }}
          >
            {/* Ambient glow behind the card */}
            <div
              style={{
                position: "absolute",
                inset: -80,
                background: "radial-gradient(circle, rgba(0,207,255,0.12) 0%, transparent 65%)",
                pointerEvents: "none",
              }}
            />
            {/* Product card frame */}
            <div
              style={{
                width: 200,
                height: 260,
                borderRadius: 20,
                overflow: "hidden",
                background: "#0E1B2E",
                border: "1px solid rgba(0,207,255,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,207,255,0.06)",
                position: "relative",
                zIndex: 1,
                transform: "rotate(-2deg)",
              }}
            >
              <Image
                src="/bottle2.png"
                alt="Branded drink bottle"
                width={180}
                height={240}
                style={{ objectFit: "contain", width: "90%", height: "90%" }}
              />
            </div>
          </div>
        </div>

        {/* Product grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {products.map((product, i) => {
            const isCyan = product.accent === "var(--cyan)";
            const glowRgb = isCyan ? "0,207,255" : "139,92,246";
            return (
              <div
                key={product.name}
                className="anim-fade-up glass"
                style={{
                  borderRadius: "16px",
                  padding: "1.75rem",
                  borderTop: `3px solid ${product.accent}`,
                  borderLeft: "1px solid rgba(255,255,255,0.08)",
                  borderRight: "1px solid rgba(255,255,255,0.08)",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  transition: "box-shadow 0.3s, transform 0.3s",
                  cursor: "default",
                  animationDelay: `${i * 0.07}s`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 32px rgba(${glowRgb},0.12)`;
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                {/* Icon container */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `rgba(${glowRgb}, 0.1)`,
                    border: `1px solid rgba(${glowRgb}, 0.2)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: product.accent,
                    marginBottom: "1rem",
                  }}
                >
                  {product.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-syne)",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "var(--text-primary)",
                    marginBottom: "0.5rem",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {product.name}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.65,
                  }}
                >
                  {product.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div
          className="anim-fade-up"
          style={{ marginTop: "3rem", textAlign: "center", animationDelay: "0.6s" }}
        >
          <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
            Looking for something specific? We can source almost anything with your branding.
          </p>
          <a
            href="#quote"
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 600,
              fontSize: "0.875rem",
              color: "var(--cyan)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.75")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
          >
            Ask about a custom product
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2 6.5h9M7.5 3l3.5 3.5L7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
