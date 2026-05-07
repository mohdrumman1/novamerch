"use client";

import React, { useEffect, useRef } from "react";

type Industry = {
  icon: React.ReactNode;
  name: string;
  description: string;
  glow: string;
};

const industries: Industry[] = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 21h8M12 17v4" />
        <path d="M7 4h10v7a5 5 0 01-10 0V4z" />
        <path d="M7 4H3v2a5 5 0 004 4.9" />
        <path d="M17 4h4v2a5 5 0 01-4 4.9" />
      </svg>
    ),
    name: "Sports Clubs",
    description: "Caps, bottles, bags and apparel for football, cricket, netball and more. Great for member packs and sponsor giveaways.",
    glow: "var(--cyan)",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 20h20M4 20V8l8-5 8 5v12M9 20v-5h6v5" />
      </svg>
    ),
    name: "Construction Companies",
    description: "Branded workwear, water bottles and site gear. Keep your crew looking professional on every job.",
    glow: "var(--violet)",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12l9-9 9 9M5 10v10h5v-5h4v5h5V10" />
      </svg>
    ),
    name: "Real Estate Agencies",
    description: "Branded gifts for open homes, settlement days and client thank-yous. Stay front of mind with buyers and vendors.",
    glow: "var(--cyan)",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M12 12v4M10 14h4" />
      </svg>
    ),
    name: "Legal & Finance Firms",
    description: "Polished stationery, corporate gift packs and client welcome kits that reflect your firm's standards.",
    glow: "var(--violet)",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    ),
    name: "Healthcare Clinics",
    description: "Branded pens, notepads and bags for clinics, allied health practices and medical teams.",
    glow: "var(--cyan)",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
    name: "Finance & Accounting",
    description: "Refined branded merchandise for client meetings, onboarding kits and team recognition.",
    glow: "var(--violet)",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
      </svg>
    ),
    name: "Local Events",
    description: "Event packs, branded giveaways and promotional items for markets, launches and community events.",
    glow: "var(--cyan)",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    name: "Corporate Teams",
    description: "New starter kits, team gifting and branded merchandise programs for organisations of all sizes.",
    glow: "var(--violet)",
  },
];

export default function Industries() {
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
      id="industries"
      ref={sectionRef}
      style={{
        background: "var(--bg-mid)",
        padding: "7rem 1.5rem",
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
          004 / Industries
        </p>

        {/* Heading */}
        <h2
          className="anim-fade-up"
          style={{
            fontFamily: "var(--font-syne)",
            fontWeight: 800,
            fontSize: "clamp(2.2rem, 4.5vw, 3.75rem)",
            lineHeight: 1.08,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
            maxWidth: "640px",
            marginBottom: "1rem",
            animationDelay: "0.08s",
          }}
        >
          Made for the businesses that move Newcastle.
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
            animationDelay: "0.16s",
          }}
        >
          Whether you run a local footy club or a law firm, we can suggest products that suit your audience and budget.
        </p>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {industries.map((ind, i) => {
            const isCyan = ind.glow === "var(--cyan)";
            const glowRgb = isCyan ? "0,207,255" : "139,92,246";
            return (
              <div
                key={ind.name}
                className="anim-fade-up glass"
                style={{
                  borderRadius: "16px",
                  padding: "1.75rem",
                  transition: "box-shadow 0.3s, transform 0.3s",
                  cursor: "default",
                  animationDelay: `${i * 0.07}s`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 28px rgba(${glowRgb},0.1)`;
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
                    color: ind.glow,
                    marginBottom: "0.875rem",
                  }}
                >
                  {ind.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-syne)",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: "var(--text-primary)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {ind.name}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: "0.83rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.65,
                  }}
                >
                  {ind.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
