"use client";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative w-full h-screen min-h-[600px] overflow-hidden flex items-end"
      style={{ background: "linear-gradient(135deg, #060C18 0%, #0D1526 100%)" }}
    >
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      >
        <source src="/videos/novamerch-hero-loop2.mp4" type="video/mp4" />
      </video>

      {/* Dark gradient overlay - heavier at bottom for text legibility */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, #060C18 0%, rgba(6,12,24,0.72) 22%, rgba(6,12,24,0.12) 48%, rgba(6,12,24,0.04) 100%)",
          zIndex: 1,
        }}
      />

      {/* Ambient glow orbs */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "20%",
          left: "10%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(0,207,255,0.07) 0%, transparent 70%)",
          zIndex: 1,
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: "30%",
          right: "5%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)",
          zIndex: 1,
        }}
      />


      {/* CTAs and trust line: bottom-left, overlaid on video */}
      <div
        className="relative w-full max-w-7xl mx-auto px-6 pb-20 md:pb-24"
        style={{ zIndex: 2 }}
      >
        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row gap-4"
          style={{
            animation: "heroReveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both",
          }}
        >
          <a
            href="#quote"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--cyan)",
              color: "#060C18",
              fontFamily: "var(--font-syne)",
              fontWeight: 700,
              fontSize: "0.95rem",
              padding: "1rem 2rem",
              borderRadius: "9999px",
              textDecoration: "none",
              transition: "background 0.2s, transform 0.2s",
              boxShadow: "0 0 32px rgba(0,207,255,0.35)",
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
            Get My Free Mockup Pack
          </a>
          <a
            href="#products"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              color: "var(--text-primary)",
              fontFamily: "var(--font-syne)",
              fontWeight: 600,
              fontSize: "0.95rem",
              padding: "1rem 2rem",
              borderRadius: "9999px",
              border: "1px solid rgba(255,255,255,0.14)",
              textDecoration: "none",
              transition: "background 0.2s, border-color 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,207,255,0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.14)";
            }}
          >
            See Product Ideas
          </a>
        </div>

        {/* Trust points */}
        <p
          style={{
            marginTop: "1.25rem",
            fontSize: "0.78rem",
            color: "var(--text-secondary)",
            fontFamily: "var(--font-dm-sans)",
            letterSpacing: "0.04em",
            animation: "heroReveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.65s both",
          }}
        >
          No upfront cost · No obligation · Newcastle-based, Australia-wide · We handle sourcing, mockups and supplier communication
        </p>
      </div>

      {/* Scroll chevron */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        style={{ zIndex: 2 }}
        aria-hidden="true"
      >
        <span
          style={{
            width: "1px",
            height: "32px",
            background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.3))",
            display: "block",
          }}
        />
        <svg
          width="16"
          height="10"
          viewBox="0 0 16 10"
          fill="none"
          style={{ animation: "chevronBounce 1.8s ease-in-out infinite" }}
        >
          <path
            d="M1 1L8 8L15 1"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}
