"use client";

import Image from "next/image";

const navLinks = [
  { label: "Products", href: "#products" },
  { label: "Industries", href: "#industries" },
  { label: "How It Works", href: "#process" },
  { label: "FAQ", href: "#faq" },
  { label: "Get a Quote", href: "#quote" },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: "#040810",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "4rem 1.5rem 3rem",
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "3rem",
            marginBottom: "3rem",
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.875rem" }}>
              <Image
                src="/logo.svg"
                alt="NovaMerch"
                width={26}
                height={26}
                style={{ filter: "brightness(0) invert(1)" }}
              />
              <span
                style={{
                  fontFamily: "var(--font-syne)",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "var(--text-primary)",
                  letterSpacing: "0.06em",
                }}
              >
                NOVAMERCH
              </span>
            </div>
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "0.83rem",
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                maxWidth: "220px",
              }}
            >
              Newcastle-based branded merchandise for Australian businesses, sports clubs and local teams.
            </p>
          </div>

          {/* Links */}
          <div>
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "0.7rem",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase" as const,
                color: "var(--text-secondary)",
                marginBottom: "1.25rem",
              }}
            >
              Navigate
            </p>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.875rem" }}>
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "0.7rem",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase" as const,
                color: "var(--text-secondary)",
                marginBottom: "1.25rem",
              }}
            >
              Contact
            </p>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.875rem" }}>
              <a
                href="mailto:support@novamerchau.com"
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}
              >
                support@novamerchau.com
              </a>
              <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                Newcastle · Lake Macquarie<br />
                Hunter Valley · NSW, Australia
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            paddingTop: "2rem",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            flexDirection: "column" as const,
            gap: "0.5rem",
          }}
        >
          <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.75rem", color: "var(--text-muted)" }}>
            &copy; {new Date().getFullYear()} NovaMerch. All rights reserved.
          </p>
          <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Newcastle-based · Serving businesses across Australia
          </p>
        </div>
      </div>
    </footer>
  );
}
