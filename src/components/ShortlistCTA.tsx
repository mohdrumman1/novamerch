"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

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
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient glow orbs */}
        <div style={{ position: "absolute", top: "-30%", left: "-10%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(0,207,255,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-30%", right: "-10%", width: "350px", height: "350px", background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Two-column layout: text left, image right */}
        <div className="flex flex-col lg:flex-row items-center gap-10" style={{ position: "relative" }}>
          {/* Text column */}
          <div className="flex-1">
            <p
              className="anim-fade-up"
              style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--cyan)", marginBottom: "1.25rem" }}
            >
              Free Mockup Pack
            </p>

            <h2
              className="anim-fade-up"
              style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(1.75rem, 4vw, 3.25rem)", lineHeight: 1.1, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: "1.25rem", animationDelay: "0.08s" }}
            >
              Want to See What Your Brand
              <br />
              <span style={{ background: "linear-gradient(135deg, var(--cyan) 0%, var(--violet) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Could Look Like?
              </span>
            </h2>

            <p
              className="anim-fade-up"
              style={{ fontFamily: "var(--font-dm-sans)", fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: "520px", marginBottom: "0.75rem", animationDelay: "0.16s" }}
            >
              Send us your logo and we&apos;ll create 3 quick merch mockups with rough pricing. No upfront cost and no obligation.
            </p>

            <p
              className="anim-fade-up"
              style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6, maxWidth: "460px", marginBottom: "2.5rem", animationDelay: "0.2s" }}
            >
              Not sure what to choose? We&apos;ll suggest the best options based on your budget and audience.
            </p>

            <div className="anim-fade-up" style={{ animationDelay: "0.28s" }}>
              <Link
                href="/#quote"
                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#fff", color: "#060C18", fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "0.95rem", padding: "1rem 2.25rem", borderRadius: "9999px", textDecoration: "none", transition: "opacity 0.2s, transform 0.2s", boxShadow: "0 0 40px rgba(0,207,255,0.2)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.9"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
              >
                Get My Free Mockup Pack
              </Link>
              <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "1rem" }}>
                Newcastle-based. We work with businesses, clubs and teams across Australia.
              </p>
            </div>
          </div>

          {/* Image column — desktop only */}
          <div
            className="hidden lg:block anim-fade-up shrink-0"
            style={{ animationDelay: "0.32s" }}
          >
            <div
              style={{
                width: 320,
                height: 220,
                position: "relative",
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid rgba(0,207,255,0.18)",
                boxShadow: "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,207,255,0.06)",
                transform: "rotate(2deg)",
              }}
            >
              <Image
                src="/mockup-pack-preview.png"
                alt="Sample merch mockup pack"
                fill
                style={{ objectFit: "cover" }}
                sizes="320px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
