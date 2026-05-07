"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";

const useCases: { label: string; description: string; accent: string; icon: React.ReactNode }[] = [
  {
    label: "On the desk",
    description:
      "A branded pen, notebook or gift pack that sits in a client's office and keeps your name in the room long after the meeting ends.",
    accent: "var(--cyan)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    label: "At the gym",
    description:
      "An insulated drink bottle or kit bag that goes wherever your team goes. A daily-use item that earns its place.",
    accent: "var(--violet)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 12h12" />
        <rect x="4" y="9.5" width="2" height="5" rx="1" />
        <rect x="18" y="9.5" width="2" height="5" rx="1" />
        <rect x="2" y="10.5" width="2" height="3" rx="0.5" />
        <rect x="20" y="10.5" width="2" height="3" rx="0.5" />
      </svg>
    ),
  },
  {
    label: "On the job site",
    description:
      "A cap or work shirt that shows up at every site, making your crew instantly recognisable and your brand part of the build.",
    accent: "var(--cyan)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 18h20M4 18c0-4.4 3.6-8 8-8s8 3.6 8 8" />
        <path d="M12 10V6M10 8h4" />
      </svg>
    ),
  },
  {
    label: "In the team kit bag",
    description:
      "Caps, bottles and apparel that become part of a sports club's identity, worn with pride at training, games and beyond.",
    accent: "var(--violet)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="8" width="18" height="13" rx="2" />
        <path d="M7 8V6a5 5 0 0110 0v2" />
        <path d="M12 12v5M9 14.5h6" />
      </svg>
    ),
  },
];

export default function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll<HTMLElement>(".anim-fade-up, .anim-slide-right");
    if (!els) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("visible");
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: "var(--bg)",
        padding: "7rem 1.5rem",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        {/* Header row: text left, bottle right */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8" style={{ marginBottom: "5rem" }}>
          <div className="flex-1">
            {/* Section label */}
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
              001 / Product Story
            </p>

            {/* Heading */}
            <h2
              className="anim-fade-up"
              style={{
                fontFamily: "var(--font-syne)",
                fontWeight: 800,
                fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
                lineHeight: 1.05,
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
                maxWidth: "700px",
                marginBottom: "1.5rem",
                animationDelay: "0.08s",
              }}
            >
              Merch that feels like{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, var(--cyan) 0%, var(--violet) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                part of your brand.
              </span>
            </h2>

            {/* Sub-copy */}
            <p
              className="anim-fade-up"
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "1.05rem",
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                maxWidth: "560px",
                animationDelay: "0.16s",
              }}
            >
              The right branded product does not just carry your logo. It earns a permanent spot in someone&apos;s daily life. Here is where great merch ends up.
            </p>
          </div>

          {/* Bottle image - desktop only */}
          <div
            className="hidden lg:flex anim-fade-up items-center justify-center shrink-0"
            style={{ position: "relative", animationDelay: "0.24s" }}
          >
            <div
              style={{
                position: "absolute",
                inset: -80,
                background: "radial-gradient(circle, rgba(0,207,255,0.1) 0%, transparent 65%)",
                pointerEvents: "none",
              }}
            />
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
                transform: "rotate(2deg)",
              }}
            >
              <Image
                src="/bottle.png"
                alt="Branded drink bottle"
                width={180}
                height={240}
                style={{ objectFit: "contain", width: "90%", height: "90%" }}
              />
            </div>
          </div>
        </div>

        {/* Use cases - editorial list */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "0",
          }}
        >
          {useCases.map((item, i) => (
            <div
              key={item.label}
              className="anim-slide-right"
              style={{
                padding: "2.5rem 2rem",
                borderLeft: `3px solid ${item.accent}`,
                animationDelay: `${i * 0.1}s`,
                transition: "background 0.25s",
              }}
              onMouseEnter={(e) => {
                const isCyan = item.accent === "var(--cyan)";
                (e.currentTarget as HTMLElement).style.background = isCyan
                  ? "rgba(0,207,255,0.04)"
                  : "rgba(139,92,246,0.04)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              {/* Icon */}
              <div
                style={{
                  color: item.accent,
                  marginBottom: "1rem",
                  opacity: 0.8,
                }}
              >
                {item.icon}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-syne)",
                  fontWeight: 700,
                  fontSize: "1.3rem",
                  color: "var(--text-primary)",
                  marginBottom: "0.75rem",
                  letterSpacing: "-0.01em",
                }}
              >
                {item.label}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.65,
                }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
