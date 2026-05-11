"use client";

import { useEffect, useRef } from "react";

const steps = [
  {
    number: "01",
    title: "Send your logo",
    description: "Upload your logo or send us your website or social page. Any format works — we handle the artwork from there.",
  },
  {
    number: "02",
    title: "Tell us what you need",
    description: "Let us know your rough budget, quantity and who the merch is for. No firm commitment needed at this stage.",
  },
  {
    number: "03",
    title: "Get 3 mockup ideas",
    description: "We'll send back a simple shortlist with branded mockups and rough pricing, matched to your brief.",
  },
  {
    number: "04",
    title: "Order only if it makes sense",
    description: "No pressure. If you like the options, we'll finalise pricing and production. If not, no obligation.",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll<HTMLElement>(".anim-fade-up");
    if (!els) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("visible");
          }
        });
      },
      { threshold: 0.08 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="process"
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
          002 / How It Works
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
            marginBottom: "4rem",
            animationDelay: "0.08s",
          }}
        >
          How It Works
        </h2>

        {/* Steps with connecting line */}
        <div style={{ position: "relative" }}>
          {/* Desktop connecting line - sits behind the step circles */}
          <div
            className="hidden lg:block"
            style={{
              position: "absolute",
              top: 19,
              left: 0,
              right: 0,
              height: 1,
              background: "linear-gradient(to right, rgba(0,207,255,0.25), rgba(139,92,246,0.2), rgba(0,207,255,0.25))",
              pointerEvents: "none",
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className="anim-fade-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Step circle - bg matches section to "punch through" the connector line */}
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: "var(--bg-mid)",
                    border: "1.5px solid rgba(0,207,255,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-syne)",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    color: "var(--cyan)",
                    marginBottom: "1.25rem",
                    position: "relative",
                    zIndex: 1,
                    letterSpacing: "0.04em",
                    boxShadow: "0 0 16px rgba(0,207,255,0.15)",
                  }}
                >
                  {step.number}
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: "var(--font-syne)",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: "var(--text-primary)",
                    marginBottom: "0.6rem",
                    lineHeight: 1.35,
                  }}
                >
                  {step.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.65,
                  }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          className="anim-fade-up"
          style={{
            marginTop: "4rem",
            paddingTop: "3rem",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "1rem",
            animationDelay: "0.5s",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "0.9rem",
              color: "var(--text-secondary)",
            }}
          >
            Ready to get started? It takes about two minutes to send us your brief.
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
