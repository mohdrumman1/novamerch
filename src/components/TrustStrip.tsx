const items = [
  "Drink Bottles",
  "Caps & Apparel",
  "Pens & Stationery",
  "Tote Bags",
  "Corporate Gifts",
  "Event Packs",
  "Sports Club Merch",
  "Custom Sourcing",
];

export default function TrustStrip() {
  const repeated = [...items, ...items];

  return (
    <section
      style={{
        background: "var(--bg-mid)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        padding: "1.75rem 0",
        overflow: "hidden",
      }}
    >
      {/* Label */}
      <p
        className="text-center mb-5"
        style={{
          fontFamily: "var(--font-dm-sans)",
          fontSize: "0.7rem",
          fontWeight: 500,
          color: "var(--text-muted)",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        For Newcastle businesses, clubs and teams
      </p>

      {/* Marquee */}
      <div style={{ overflow: "hidden" }}>
        <div className="marquee-track">
          {repeated.map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-6 px-6"
              style={{
                fontFamily: "var(--font-syne)",
                fontWeight: 700,
                fontSize: "1rem",
                color: "var(--text-secondary)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              {item}
              <span
                style={{
                  display: "inline-block",
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "var(--cyan)",
                  opacity: 0.5,
                  flexShrink: 0,
                }}
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
