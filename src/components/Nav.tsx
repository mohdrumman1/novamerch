"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const links = [
  { label: "Products", href: "/#products" },
  { label: "Catalogue", href: "/#catalogue" },
  { label: "Industries", href: "/#industries" },
  { label: "Sports Clubs", href: "/sports-clubs/" },
  { label: "Mockup Builder", href: "/mockup-builder" },
  { label: "How It Works", href: "/#process" },
  { label: "FAQ", href: "/#faq" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(6, 12, 24, 0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0" style={{ textDecoration: "none" }}>
          <Image
            src="/logo.svg"
            alt="NovaMerch"
            width={30}
            height={30}
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <span
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 700,
              fontSize: "1.05rem",
              color: "var(--text-primary)",
              letterSpacing: "0.02em",
            }}
          >
            NOVAMERCH
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => {
            const isPage = !l.href.startsWith("/#");
            return (
              <a
                key={l.href}
                href={l.href}
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: isPage ? "var(--violet)" : "var(--text-secondary)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = isPage ? "var(--violet)" : "var(--text-secondary)")
                }
              >
                {l.label}
              </a>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <Link
          href="/#quote"
          className="hidden md:inline-flex items-center"
          style={{
            fontFamily: "var(--font-syne)",
            fontWeight: 600,
            fontSize: "0.85rem",
            color: "var(--cyan)",
            border: "1px solid rgba(0,207,255,0.3)",
            padding: "0.5rem 1.25rem",
            borderRadius: "9999px",
            textDecoration: "none",
            transition: "background 0.2s, border-color 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(0,207,255,0.08)";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,207,255,0.6)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,207,255,0.3)";
          }}
        >
          Get a Quote
        </Link>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span
            className="block w-6 h-px transition-all duration-200"
            style={{
              background: "var(--text-primary)",
              transform: open ? "rotate(45deg) translate(3px, 3px)" : "none",
            }}
          />
          <span
            className="block w-6 h-px transition-all duration-200"
            style={{
              background: "var(--text-primary)",
              opacity: open ? 0 : 1,
            }}
          />
          <span
            className="block w-6 h-px transition-all duration-200"
            style={{
              background: "var(--text-primary)",
              transform: open ? "rotate(-45deg) translate(3px, -3px)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          style={{
            background: "rgba(6,12,24,0.97)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "1.5rem 1.5rem 2rem",
          }}
        >
          <nav className="flex flex-col gap-5 mb-6">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                style={{
                  fontFamily: "var(--font-syne)",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  color: "var(--text-primary)",
                  textDecoration: "none",
                }}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <Link
            href="/#quote"
            onClick={() => setOpen(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              background: "var(--blue)",
              color: "#fff",
              fontFamily: "var(--font-syne)",
              fontWeight: 700,
              fontSize: "0.95rem",
              padding: "0.875rem",
              borderRadius: "9999px",
              textDecoration: "none",
            }}
          >
            Get a Free Merch Quote
          </Link>
        </div>
      )}
    </header>
  );
}
