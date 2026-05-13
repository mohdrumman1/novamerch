"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { catalogueBundles, type AccentColor } from "@/data/catalogue";

const bundleImages: Record<string, string> = {
  "Staff Starter Pack": "/staff-starter.png",
  "Sports Club Pack": "/sports-club.png",
  "Client Gift Pack": "/client-gift.png",
  "Event Giveaway Pack": "/event-giveaway.png",
  "Construction Team Pack": "/construction-team.png",
};

function accentVar(a: AccentColor) {
  return a === "cyan" ? "var(--cyan)" : "var(--violet)";
}

function accentRgb(a: AccentColor) {
  return a === "cyan" ? "0,207,255" : "139,92,246";
}

export default function CatalogueBundles() {
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
      ref={sectionRef}
      style={{
        background: "var(--bg)",
        padding: "6rem 1.5rem",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
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
          006 / Bundles
        </p>

        <h2
          className="anim-fade-up"
          style={{
            fontFamily: "var(--font-syne)",
            fontWeight: 800,
            fontSize: "clamp(2rem, 4vw, 3.25rem)",
            lineHeight: 1.08,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
            marginBottom: "1rem",
            animationDelay: "0.08s",
          }}
        >
          Ready-Made Merch Bundles
        </h2>

        <p
          className="anim-fade-up"
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "1rem",
            color: "var(--text-secondary)",
            maxWidth: "500px",
            lineHeight: 1.7,
            marginBottom: "1.5rem",
            animationDelay: "0.16s",
          }}
        >
          Not sure where to start? These popular product combinations work for most budgets and audiences.
        </p>

        <div
          className="anim-fade-up"
          style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "3rem", animationDelay: "0.22s" }}
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {catalogueBundles.map((bundle, i) => {
            const color = accentVar(bundle.accent);
            const rgb = accentRgb(bundle.accent);
            return (
              <div
                key={bundle.name}
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
                  animationDelay: `${i * 0.08}s`,
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
                {/* Bundle image */}
                {bundleImages[bundle.name] && (
                  <div
                    style={{
                      width: "100%",
                      height: "250px",
                      position: "relative",
                      borderRadius: "10px",
                      overflow: "hidden",
                      marginBottom: "1.25rem",
                      background: `radial-gradient(circle at center, rgba(${rgb},0.07) 0%, transparent 70%)`,
                    }}
                  >
                    <Image
                      src={bundleImages[bundle.name]}
                      alt={bundle.name}
                      fill
                      style={{ objectFit: "contain" }}
                      sizes="280px"
                    />
                  </div>
                )}

                <h3
                  style={{
                    fontFamily: "var(--font-syne)",
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    color: "var(--text-primary)",
                    letterSpacing: "-0.01em",
                    marginBottom: "0.875rem",
                  }}
                >
                  {bundle.name}
                </h3>

                {/* Item pills */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.4rem",
                    marginBottom: "1rem",
                  }}
                >
                  {bundle.items.map((item) => (
                    <span
                      key={item}
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontSize: "0.72rem",
                        fontWeight: 500,
                        color,
                        background: `rgba(${rgb},0.08)`,
                        border: `1px solid rgba(${rgb},0.2)`,
                        borderRadius: "9999px",
                        padding: "0.2rem 0.7rem",
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <p
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: "0.83rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.65,
                    flex: 1,
                    marginBottom: "0.875rem",
                  }}
                >
                  {bundle.description}
                </p>

                <p
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    marginBottom: "1.25rem",
                  }}
                >
                  Any size · Any colour · Any shape · Any design
                </p>

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
                  Ask about this pack
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M2 6.5h9M7.5 3l3.5 3.5L7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
