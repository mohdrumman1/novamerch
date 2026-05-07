"use client";

import { useEffect, useRef } from "react";

export default function ShortlistCTA() {
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
      { threshold: 0.2 }
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
      <div
        style={{
          maxWidth: "64rem",
          margin: "0 auto",
          background: "linear-gradient(135deg, rgba(0,207,255,0.08) 0%, rgba(139,92,246,0.1) 100%)",
          border: "1px solid rgba(0,207,255,0.15)",
          borderRadius: "24px",
          padding: "clamp(2.5rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient glow orbs */}
        <div
          style={{
            position: "absolute",
            top: "-30%",
            left: "-10%",
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(0,207,255,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-30%",
            right: "-10%",
            width: "350px",
            height: "350px",
            background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

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
            position: "relative",
          }}
        >
          005 / Free Shortlist
        </p>

        <h2
          className="anim-fade-up"
          style={{
            fontFamily: "var(--font-syne)",
            fontWeight: 800,
            fontSize: "clamp(1.75rem, 4vw, 3.25rem)",
            lineHeight: 1.1,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
            marginBottom: "1.25rem",
            position: "relative",
            animationDelay: "0.08s",
          }}
        >
          Not sure what to order?
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, var(--cyan) 0%, var(--violet) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Start with a free merch shortlist.
          </span>
        </h2>

        <p
          className="anim-fade-up"
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "1rem",
            color: "var(--text-secondary)",
            lineHeight: 1.7,
            maxWidth: "520px",
            margin: "0 auto 2.5rem",
            position: "relative",
            animationDelay: "0.16s",
          }}
        >
          Send us your logo, business type and rough budget. We&apos;ll suggest 3–5 branded product ideas that suit your audience, quantity and price range.
        </p>

        <div
          className="anim-fade-up"
          style={{ position: "relative", animationDelay: "0.24s" }}
        >
          <a
            href="#quote"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#fff",
              color: "#060C18",
              fontFamily: "var(--font-syne)",
              fontWeight: 700,
              fontSize: "0.95rem",
              padding: "1rem 2.25rem",
              borderRadius: "9999px",
              textDecoration: "none",
              transition: "opacity 0.2s, transform 0.2s",
              boxShadow: "0 0 40px rgba(0,207,255,0.2)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "0.9";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "1";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            Request My Free Shortlist
          </a>
          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "0.8rem",
              color: "var(--text-secondary)",
              marginTop: "1rem",
            }}
          >
            No commitment. No upfront cost.
          </p>
        </div>
      </div>
    </section>
  );
}
