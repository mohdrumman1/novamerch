"use client";

export default function HeroContent() {
  return (
    <section
      id="home"
      style={{
        background: "linear-gradient(180deg, #060C18 0%, var(--bg-mid) 100%)",
        padding: "5rem 1.5rem 4rem",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        {/* Location tag */}
        <div
          className="inline-flex items-center gap-2"
          style={{ marginBottom: "1.5rem" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--cyan)" }}
          />
          <span
            style={{
              color: "var(--cyan)",
              fontSize: "0.75rem",
              fontFamily: "var(--font-dm-sans)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            Newcastle · NSW
          </span>
        </div>

        {/* Main headline */}
        <h1
          style={{
            fontFamily: "var(--font-syne)",
            fontWeight: 800,
            fontSize: "clamp(2.4rem, 5.5vw, 5rem)",
            lineHeight: 1.04,
            color: "var(--text-primary)",
            letterSpacing: "-0.03em",
            maxWidth: "820px",
            marginBottom: "1.5rem",
          }}
        >
          Get a Free{" "}
          <span
            style={{
              background: "linear-gradient(135deg, var(--cyan) 0%, var(--violet) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            3-Product Merch
          </span>
          {" "}Mockup Pack
        </h1>

        {/* Subheadline */}
        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "clamp(1rem, 1.8vw, 1.2rem)",
            color: "var(--text-secondary)",
            lineHeight: 1.65,
            maxWidth: "600px",
            marginBottom: "0.875rem",
          }}
        >
          Send us your logo and we&apos;ll create 3 branded product ideas with rough pricing, matched to your budget, quantity and use case.
        </p>

        {/* Supporting audience line */}
        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "0.85rem",
            color: "var(--text-muted)",
            lineHeight: 1.6,
            maxWidth: "560px",
          }}
        >
          Perfect for sports clubs, construction teams, real estate agencies, schools, clinics and local businesses across Australia.
        </p>
      </div>
    </section>
  );
}
