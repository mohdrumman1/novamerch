"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  filterCategories,
  catalogueProducts,
  type CatalogueProduct,
  type MockupType,
  type AccentColor,
} from "@/data/catalogue";

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

function ProductMockup({ type, accent }: { type: MockupType; accent: AccentColor }) {
  const rgb = accentRgb(accent);

  return (
    <div
      style={{
        width: "100%",
        height: "250px",
        position: "relative",
        borderRadius: "12px",
        overflow: "hidden",
        background: `radial-gradient(circle at center, rgba(${rgb},0.07) 0%, transparent 70%)`,
        marginBottom: "1.25rem",
      }}
    >
      <Image
        src={mockupImages[type]}
        alt={type}
        fill
        style={{ objectFit: "contain" }}
        sizes="280px"
      />
    </div>
  );
}

function ProductCard({ product, index }: { product: CatalogueProduct; index: number }) {
  const rgb = accentRgb(product.accent);
  const color = accentVar(product.accent);

  return (
    <div
      className="anim-fade-up glass"
      style={{
        borderRadius: "16px",
        padding: "1.75rem",
        borderTop: `3px solid ${color}`,
        borderLeft: "1px solid rgba(255,255,255,0.08)",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        transition: "box-shadow 0.3s, transform 0.3s",
        cursor: "default",
        animationDelay: `${index * 0.07}s`,
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 32px rgba(${rgb},0.12)`;
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      <ProductMockup type={product.mockupType} accent={product.accent} />

      {/* Category pill */}
      <span
        style={{
          display: "inline-block",
          fontFamily: "var(--font-dm-sans)",
          fontSize: "0.7rem",
          fontWeight: 500,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color,
          background: `rgba(${rgb},0.1)`,
          border: `1px solid rgba(${rgb},0.2)`,
          borderRadius: "9999px",
          padding: "0.18rem 0.65rem",
          marginBottom: "0.75rem",
          width: "fit-content",
        }}
      >
        {product.category}
      </span>

      <h3
        style={{
          fontFamily: "var(--font-syne)",
          fontWeight: 700,
          fontSize: "1rem",
          color: "var(--text-primary)",
          letterSpacing: "-0.01em",
          marginBottom: "0.5rem",
        }}
      >
        {product.name}
      </h3>

      <p
        style={{
          fontFamily: "var(--font-dm-sans)",
          fontSize: "0.83rem",
          color: "var(--text-secondary)",
          lineHeight: 1.65,
          marginBottom: "1rem",
          flex: 1,
        }}
      >
        {product.description}
      </p>

      {/* Meta */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "1.25rem" }}>
        <div>
          <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.72rem", fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Best for </span>
          <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.8rem", color: "var(--text-secondary)" }}>{product.bestFor}</span>
        </div>
        <div>
          <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.72rem", fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Typical qty </span>
          <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.8rem", color: "var(--text-secondary)" }}>{product.typicalQuantities}</span>
        </div>
        <div>
          <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.72rem", fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Customise </span>
          <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.8rem", color: "var(--text-secondary)" }}>Any size, colour, shape or design</span>
        </div>
      </div>

      {/* CTA link */}
      <Link
        href="/#quote"
        style={{
          fontFamily: "var(--font-syne)",
          fontWeight: 600,
          fontSize: "0.85rem",
          color,
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          transition: "opacity 0.2s",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.75")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
      >
        {product.ctaLabel}
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M2 6.5h9M7.5 3l3.5 3.5L7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}

export default function CatalogueSection() {
  const [activeFilter, setActiveFilter] = useState("All");
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

  const filtered =
    activeFilter === "All"
      ? catalogueProducts
      : catalogueProducts.filter((p) => p.category === activeFilter);

  return (
    <section
      id="catalogue"
      ref={sectionRef}
      style={{
        background: "var(--bg-mid)",
        padding: "7rem 1.5rem",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        {/* Header */}
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
          005 / Catalogue
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
          Merch Ideas for Your Brand
        </h2>

        <p
          className="anim-fade-up"
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "1rem",
            color: "var(--text-secondary)",
            maxWidth: "580px",
            lineHeight: 1.7,
            marginBottom: "1.5rem",
            animationDelay: "0.16s",
          }}
        >
          Explore branded product ideas for teams, clubs, events and client gifts. These are example concepts only. Every product can be fully customised around your brand.
        </p>

        <div
          className="anim-fade-up"
          style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2.5rem", animationDelay: "0.22s" }}
        >
          {["Any Size", "Any Colour", "Any Shape", "Any Design"].map((label) => (
            <span
              key={label}
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "0.72rem",
                fontWeight: 500,
                color: "var(--cyan)",
                background: "rgba(0,207,255,0.08)",
                border: "1px solid rgba(0,207,255,0.2)",
                borderRadius: "9999px",
                padding: "0.22rem 0.8rem",
              }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Filter tabs */}
        <div
          className="anim-fade-up"
          style={{
            display: "flex",
            gap: "0.5rem",
            overflowX: "auto",
            paddingBottom: "0.5rem",
            marginBottom: "2.5rem",
            scrollbarWidth: "none",
            animationDelay: "0.22s",
          }}
        >
          {filterCategories.map((cat) => {
            const isActive = cat === activeFilter;
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "0.8rem",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#060C18" : "var(--text-secondary)",
                  background: isActive ? "var(--cyan)" : "var(--surface)",
                  border: `1px solid ${isActive ? "var(--cyan)" : "var(--surface-border)"}`,
                  borderRadius: "9999px",
                  padding: "0.45rem 1.1rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,207,255,0.4)";
                    (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--surface-border)";
                    (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                  }
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Product grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* Footer note */}
        <div
          className="anim-fade-up"
          style={{ marginTop: "3rem", textAlign: "center", animationDelay: "0.5s" }}
        >
          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "0.85rem",
              color: "var(--text-secondary)",
              marginBottom: "0.75rem",
            }}
          >
            All products shown are example concepts. We&apos;ll match colours, quantities and mockups to your brand and budget.
          </p>
          <Link
            href="/#quote"
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
            Request a Personalised Catalogue
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2 6.5h9M7.5 3l3.5 3.5L7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
