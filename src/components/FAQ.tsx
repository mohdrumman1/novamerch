"use client";

import { useState, useEffect, useRef } from "react";

const faqs = [
  {
    question: "Do you have minimum order quantities?",
    answer:
      "No fixed minimums. Whether you need 5 items or 500, let us know what you are after and we will work with your quantity. Some products do have supplier minimums and we will flag those upfront.",
  },
  {
    question: "Can you help me choose products?",
    answer:
      "Yes, that is exactly what we do. Tell us your business type, rough budget and what you are trying to achieve. We will suggest 3 to 5 product options that suit your situation. No catalogues to scroll through.",
  },
  {
    question: "Can you work with sports clubs?",
    answer:
      "Absolutely. We work with sports clubs across Australia. Whether you need caps, water bottles, bags or apparel for your team, sponsors or members, we can put together a package that fits your club's budget and branding.",
  },
  {
    question: "What logo files do I need?",
    answer:
      "A vector file such as AI, EPS or PDF works best, but it is not always required. If you only have a JPEG or PNG, send it through and we will let you know if it will work for the product you have in mind.",
  },
  {
    question: "How long does it take?",
    answer:
      "Timeframes vary depending on the product and quantity. We will give you a rough indication when we send your product options. If you have a specific date you need them by, let us know early and we will work around it.",
  },
  {
    question: "Can you source products not listed on your site?",
    answer:
      "In most cases, yes. If you have a specific product in mind that is not shown here, send us a description or reference image. We will check whether it can be sourced and branded for you.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
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
      id="faq"
      ref={sectionRef}
      style={{
        background: "var(--bg)",
        padding: "7rem 1.5rem",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div style={{ maxWidth: "56rem", margin: "0 auto" }}>
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
          006 / FAQ
        </p>

        {/* Heading */}
        <h2
          className="anim-fade-up"
          style={{
            fontFamily: "var(--font-syne)",
            fontWeight: 800,
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            lineHeight: 1.08,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
            marginBottom: "3rem",
            animationDelay: "0.08s",
          }}
        >
          Common questions.
        </h2>

        {/* Accordion */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="anim-fade-up"
              style={{
                background: "var(--surface)",
                border: `1px solid ${open === i ? "rgba(0,207,255,0.25)" : "var(--surface-border)"}`,
                borderRadius: "14px",
                overflow: "hidden",
                transition: "border-color 0.2s",
                animationDelay: `${i * 0.06}s`,
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1.4rem 1.75rem",
                  textAlign: "left",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  gap: "1rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-syne)",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    color: "var(--text-primary)",
                    flex: 1,
                    lineHeight: 1.4,
                  }}
                >
                  {faq.question}
                </span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  style={{
                    flexShrink: 0,
                    color: "var(--cyan)",
                    transform: open === i ? "rotate(180deg)" : "rotate(0)",
                    transition: "transform 0.25s",
                  }}
                >
                  <path
                    d="M4.5 6.75l4.5 4.5 4.5-4.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {open === i && (
                <div style={{ padding: "0 1.75rem 1.4rem" }}>
                  <p
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: "0.88rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.7,
                    }}
                  >
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div
          className="anim-fade-up"
          style={{
            marginTop: "3rem",
            paddingTop: "2.5rem",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            gap: "1rem",
            textAlign: "center",
            animationDelay: "0.4s",
          }}
        >
          <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Still have a question? We&apos;re happy to help.
          </p>
          <a
            href="#quote"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily: "var(--font-syne)",
              fontWeight: 700,
              fontSize: "0.875rem",
              color: "var(--cyan)",
              textDecoration: "none",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.75")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
          >
            Send us a message
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
