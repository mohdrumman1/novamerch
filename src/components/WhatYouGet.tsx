"use client";

import React, { useEffect, useRef } from "react";

const items = [
  {
    number: "01",
    title: "3 branded product ideas",
    description:
      "We choose practical merch options based on your audience, budget and quantity — no scrolling through endless catalogues.",
    accent: "var(--cyan)",
    accentRgb: "0,207,255",
  },
  {
    number: "02",
    title: "Mockups using your logo",
    description:
      "See what your brand could look like on caps, hoodies, bottles, bags or other items before you commit to anything.",
    accent: "var(--violet)",
    accentRgb: "139,92,246",
  },
  {
    number: "03",
    title: "Rough pricing guidance",
    description:
      "Get a clear price range before you commit. No surprises. We match options to your budget from the start.",
    accent: "var(--cyan)",
    accentRgb: "0,207,255",
  },
  {
    number: "04",
    title: "Supplier handling done for you",
    description:
      "We deal with sourcing, production options and supplier communication so you don't have to.",
    accent: "var(--violet)",
    accentRgb: "139,92,246",
  },
];

export default function WhatYouGet() {
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
      { threshold: 0.08 }
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
        {/* Label */}
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
          Free Mockup Pack
        </p>

        {/* Heading */}
        <h2
          className="anim-fade-up"
          style={{
            fontFamily: "var(--font-syne)",
            fontWeight: 800,
            fontSize: "clamp(2rem, 4vw, 3.25rem)",
            lineHeight: 1.08,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
            marginBottom: "0.875rem",
            animationDelay: "0.08s",
          }}
        >
          What You Get
        </h2>

        <p
          className="anim-fade-up"
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "1rem",
            color: "var(--text-secondary)",
            lineHeight: 1.7,
            maxWidth: "520px",
            marginBottom: "3.5rem",
            animationDelay: "0.14s",
          }}
        >
          Send your logo and a few details. We&apos;ll handle the rest and come back to you with a free mockup pack within 24–48 hours.
        </p>

        {/* Cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {items.map((item, i) => (
            <div
              key={item.number}
              className="anim-fade-up glass"
              style={{
                borderRadius: "16px",
                padding: "2rem",
                borderTop: `3px solid ${item.accent}`,
                borderLeft: "1px solid rgba(255,255,255,0.08)",
                borderRight: "1px solid rgba(255,255,255,0.08)",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                transition: "box-shadow 0.3s, transform 0.3s",
                animationDelay: `${i * 0.08}s`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 32px rgba(${item.accentRgb},0.1)`;
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-syne)",
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  color: item.accent,
                  letterSpacing: "0.1em",
                  display: "block",
                  marginBottom: "0.875rem",
                }}
              >
                {item.number}
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-syne)",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "var(--text-primary)",
                  marginBottom: "0.6rem",
                  lineHeight: 1.3,
                  letterSpacing: "-0.01em",
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.65,
                }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div
          className="anim-fade-up"
          style={{
            marginTop: "3.5rem",
            paddingTop: "2.5rem",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "1rem",
            animationDelay: "0.5s",
          }}
        >
          <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            No upfront cost. No obligation. Just a clear starting point for your branded merchandise.
          </p>
          <a
            href="#quote"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily: "var(--font-syne)",
              fontWeight: 700,
              fontSize: "0.9rem",
              color: "var(--cyan)",
              textDecoration: "none",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.75")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
          >
            Get My Free Mockup Pack
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
