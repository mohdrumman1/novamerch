"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";

const industryImages: Record<string, string> = {
  "Sports Clubs": "/sports-clubs.png",
  "Construction & Trades": "/construction.png",
  "Real Estate Agencies": "/real-estate.png",
  "Clinics, Schools & Local Businesses": "/clinic-business.png",
};

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
    description: "Club hoodies, caps, drink bottles, supporter merch, sponsor packs and fundraising ideas. We make sports club merchandise simple and affordable.",
    glow: "var(--cyan)",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 20h20M4 20V8l8-5 8 5v12M9 20v-5h6v5" />
      </svg>
    ),
    name: "Construction & Trades",
    description: "Branded caps, work shirts, bottles, hi-vis gear, site packs and client handover gifts. Keep your crew looking professional on every job.",
    glow: "var(--violet)",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12l9-9 9 9M5 10v10h5v-5h4v5h5V10" />
      </svg>
    ),
    name: "Real Estate Agencies",
    description: "Settlement gifts, open-home packs, notebooks, pens, bottles and local promo items. Stay front of mind with buyers, vendors and the community.",
    glow: "var(--cyan)",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    ),
    name: "Clinics, Schools & Local Businesses",
    description: "Staff merch, event giveaways, branded bags, pens, bottles and practical promotional products for everyday brand visibility across Australia.",
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
          Built for Local Teams, Clubs and Businesses
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
          Whether you run a local footy club, a real estate agency or a construction business, we&apos;ll suggest branded merch that suits your audience and budget anywhere in Australia.
        </p>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
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
                  position: "relative",
                  overflow: "hidden",
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
                {/* Low-opacity background image watermark */}
                {industryImages[ind.name] && (
                  <Image
                    src={industryImages[ind.name]}
                    alt=""
                    fill
                    style={{ objectFit: "cover", opacity: 0.12 }}
                    sizes="280px"
                  />
                )}
                {/* Content sits above the bg image */}
                <div style={{ position: "relative" }}>
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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
