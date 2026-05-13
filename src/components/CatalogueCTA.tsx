"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function CatalogueCTA() {
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
      { threshold: 0.15 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: "var(--bg-mid)",
        padding: "5rem 1.5rem",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          gap: "3rem",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left */}
        <div style={{ flex: "1 1 340px" }}>
          <p
            className="anim-fade-up"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "0.72rem",
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--cyan)",
              marginBottom: "1rem",
            }}
          >
            Free Mockups
          </p>
          <h2
            className="anim-fade-up"
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 800,
              fontSize: "clamp(1.75rem, 3.5vw, 2.6rem)",
              lineHeight: 1.1,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              marginBottom: "1rem",
              animationDelay: "0.08s",
            }}
          >
            Want to see these with your logo?
          </h2>
          <p
            className="anim-fade-up"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "1rem",
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              maxWidth: "460px",
              animationDelay: "0.16s",
            }}
          >
            Send us your logo, colours and rough budget. We&apos;ll create a personalised merch shortlist with example mockups for your business.
          </p>
        </div>

        {/* Right */}
        <div
          className="anim-fade-up"
          style={{ flexShrink: 0, animationDelay: "0.24s", textAlign: "center" }}
        >
          <Link
            href="/#quote"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--cyan)",
              color: "#060C18",
              fontFamily: "var(--font-syne)",
              fontWeight: 700,
              fontSize: "0.95rem",
              padding: "1rem 2.5rem",
              borderRadius: "9999px",
              textDecoration: "none",
              transition: "background 0.2s, transform 0.2s",
              boxShadow: "0 0 32px rgba(0,207,255,0.3)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#00b8e6";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--cyan)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            Request My Free Catalogue
          </Link>
          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              marginTop: "0.875rem",
            }}
          >
            No cost, no commitment.
          </p>
        </div>
      </div>
    </section>
  );
}
