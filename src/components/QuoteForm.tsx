"use client";

import { useState, useEffect, useRef } from "react";

const productOptions = [
  "Drink Bottles",
  "Caps & Apparel",
  "Pens & Office Merch",
  "Tote Bags",
  "Corporate Gift Packs",
  "Sports Club Merch",
  "Event Packs",
  "Custom Product Sourcing",
  "Not sure yet, help me choose",
];

const budgetOptions = [
  "Under $500",
  "$500 – $1,000",
  "$1,000 – $2,500",
  "$2,500 – $5,000",
  "$5,000+",
  "Not sure yet",
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px",
  padding: "0.875rem 1rem",
  color: "var(--text-primary)",
  fontFamily: "var(--font-dm-sans)",
  fontSize: "0.9rem",
  outline: "none",
  transition: "border-color 0.2s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-dm-sans)",
  fontSize: "0.72rem",
  fontWeight: 500,
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
  color: "var(--text-secondary)",
  marginBottom: "0.5rem",
};

export default function QuoteForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [attribution, setAttribution] = useState({ source: "website", campaign: "direct", landingPage: "home" });
  const sectionRef = useRef<HTMLElement>(null);
  const requestIdRef = useRef<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setAttribution({
      source: params.get("utm_source") || params.get("source") || "website",
      campaign: params.get("utm_campaign") || params.get("campaign") || "direct",
      landingPage: window.location.pathname || "/",
    });
  }, []);

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      const form = e.currentTarget;
      const data = new FormData(form);
      if (!requestIdRef.current) requestIdRef.current = crypto.randomUUID();
      const res = await fetch("https://novamerch-admin.rumman-formaai.workers.dev/admin/api/public/lead-intake", {
        method: "POST",
        body: JSON.stringify({
          name: data.get("name"),
          company: data.get("company"),
          email: data.get("email"),
          phone: data.get("phone"),
          suburb: data.get("suburb"),
          neededBy: data.get("needed_by"),
          product: data.get("product"),
          quantity: data.get("quantity"),
          budget: data.get("budget"),
          message: data.get("message"),
          website: data.get("website"),
          source: data.get("source"),
          campaign: data.get("campaign"),
          landingPage: data.get("landing_page"),
          consent: data.get("contact_consent"),
          requestId: requestIdRef.current,
        }),
        headers: { "Content-Type": "application/json", Accept: "application/json" },
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const focusInput = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,207,255,0.5)";
  };
  const blurInput = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
  };

  return (
    <section
      id="quote"
      ref={sectionRef}
      style={{
        background: "var(--bg-mid)",
        padding: "7rem 1.5rem",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "4rem",
            alignItems: "start",
          }}
        >
          {/* Left: copy */}
          <div>
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
              007 / Get Started
            </p>

            <h2
              className="anim-fade-up"
              style={{
                fontFamily: "var(--font-syne)",
                fontWeight: 800,
                fontSize: "clamp(2rem, 4vw, 3.25rem)",
                lineHeight: 1.08,
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
                marginBottom: "1.25rem",
                animationDelay: "0.08s",
              }}
            >
              Request Your Free<br />3-Product Mockup Pack
            </h2>

            <p
              className="anim-fade-up"
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "0.95rem",
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                marginBottom: "2.5rem",
                animationDelay: "0.16s",
              }}
            >
              Send your logo and a few details. We&apos;ll come back with 3 branded product mockups and rough pricing, matched to your budget and use case. No upfront cost, no obligation.
            </p>

            <div
              className="anim-fade-up"
              style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2.5rem", animationDelay: "0.24s" }}
            >
              {[
                "Free mockups using your logo. No commitment required.",
                "3 product ideas matched to your budget and audience",
                "Newcastle-based, serving businesses across Australia",
              ].map((point) => (
                <div key={point} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      background: "rgba(0,207,255,0.12)",
                      border: "1px solid rgba(0,207,255,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: "2px",
                    }}
                  >
                    <svg width="9" height="9" fill="none" viewBox="0 0 9 9">
                      <path stroke="var(--cyan)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M1.5 4.5l2 2 4-4" />
                    </svg>
                  </div>
                  <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    {point}
                  </p>
                </div>
              ))}
            </div>

            <div
              className="anim-fade-up"
              style={{
                paddingTop: "1.5rem",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                animationDelay: "0.32s",
              }}
            >
              <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                Prefer to email directly?
              </p>
              <a
                href="mailto:support@novamerchau.com"
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}
              >
                support@novamerchau.com
              </a>
            </div>
          </div>

          {/* Right: form */}
          <div className="anim-fade-up" style={{ animationDelay: "0.2s" }}>
            {submitted ? (
              <div
                style={{
                  background: "var(--surface)",
                  border: "1px solid rgba(0,207,255,0.2)",
                  borderRadius: "20px",
                  padding: "3rem 2rem",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "rgba(0,207,255,0.1)",
                    border: "1px solid rgba(0,207,255,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem",
                  }}
                >
                  <svg width="22" height="22" fill="none" viewBox="0 0 22 22">
                    <path stroke="var(--cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4.5 11.5l4.5 4.5 9-9" />
                  </svg>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-syne)",
                    fontWeight: 700,
                    fontSize: "1.3rem",
                    color: "var(--text-primary)",
                    marginBottom: "0.75rem",
                  }}
                >
                  Request received.
                </h3>
                <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>
                  We&apos;ll be in touch with your 3 branded mockup ideas and rough pricing within 24–48 hours. If you have a logo file ready, reply to our confirmation email with it attached.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--surface-border)",
                  borderRadius: "20px",
                  padding: "2.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label style={labelStyle}>Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Jane Smith"
                      style={inputStyle}
                      onFocus={focusInput}
                      onBlur={blurInput}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Business or club *</label>
                    <input
                      type="text"
                      name="company"
                      required
                      placeholder="Newcastle FC"
                      style={inputStyle}
                      onFocus={focusInput}
                      onBlur={blurInput}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label style={labelStyle}>Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="jane@company.com"
                      style={inputStyle}
                      onFocus={focusInput}
                      onBlur={blurInput}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="0400 000 000"
                      style={inputStyle}
                      onFocus={focusInput}
                      onBlur={blurInput}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Website or social page</label>
                  <input
                    type="text"
                    name="website"
                    placeholder="e.g. instagram.com/yourclub"
                    style={inputStyle}
                    onFocus={focusInput}
                    onBlur={blurInput}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label style={labelStyle}>Suburb or delivery area</label>
                    <input
                      type="text"
                      name="suburb"
                      placeholder="e.g. Cooks Hill, Maitland"
                      style={inputStyle}
                      onFocus={focusInput}
                      onBlur={blurInput}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>When do you need it?</label>
                    <input
                      type="text"
                      name="needed_by"
                      placeholder="e.g. Before 15 November"
                      style={inputStyle}
                      onFocus={focusInput}
                      onBlur={blurInput}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>What type of merch are you interested in?</label>
                  <select
                    name="product"
                    style={{ ...inputStyle, cursor: "pointer" }}
                    onFocus={focusInput}
                    onBlur={blurInput}
                  >
                    {productOptions.map((opt) => (
                      <option key={opt} value={opt} style={{ background: "#0D1526" }}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label style={labelStyle}>Approx. quantity</label>
                    <input
                      type="text"
                      name="quantity"
                      placeholder="e.g. 50, 200+"
                      style={inputStyle}
                      onFocus={focusInput}
                      onBlur={blurInput}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Budget range</label>
                    <select
                      name="budget"
                      style={{ ...inputStyle, cursor: "pointer" }}
                      onFocus={focusInput}
                      onBlur={blurInput}
                    >
                      {budgetOptions.map((opt) => (
                        <option key={opt} value={opt} style={{ background: "#0D1526" }}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Anything else to add?</label>
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="Event date, specific requirements, logo details..."
                    style={{ ...inputStyle, resize: "none" }}
                    onFocus={focusInput}
                    onBlur={blurInput}
                  />
                  <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                    You can also reply to our confirmation email with your logo file attached.
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem" }}>
                  <input
                    type="checkbox"
                    name="contact_consent"
                    value="yes"
                    required
                    style={{ marginTop: "0.2rem", accentColor: "var(--cyan)" }}
                  />
                  <label style={{ ...labelStyle, textTransform: "none", letterSpacing: 0, fontSize: "0.78rem", lineHeight: 1.5, marginBottom: 0 }}>
                    I agree that NovaMerch may contact me about this request. I can opt out at any time. *
                  </label>
                </div>

                <input type="hidden" name="source" value={attribution.source} />
                <input type="hidden" name="campaign" value={attribution.campaign} />
                <input type="hidden" name="landing_page" value={attribution.landingPage} />
                <input type="hidden" name="pipeline_status" value="New" />
                <input type="hidden" name="_subject" value="NovaMerch mock-up pack request" />
                {/* Honeypot: genuine visitors never see or fill this field. */}
                <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: "none" }} />

                {error && (
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.85rem", color: "#f87171", marginBottom: "0.5rem" }}>
                      Something went wrong. Please email us directly.
                    </p>
                    <a
                      href="mailto:support@novamerchau.com"
                      style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.85rem", color: "var(--cyan)", textDecoration: "none" }}
                    >
                      support@novamerchau.com
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: "var(--blue)",
                    color: "#fff",
                    fontFamily: "var(--font-syne)",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    padding: "1rem",
                    borderRadius: "10px",
                    border: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.6 : 1,
                    transition: "background 0.2s, opacity 0.2s",
                    boxShadow: "0 0 24px rgba(59,130,246,0.3)",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) (e.currentTarget as HTMLElement).style.background = "#2563EB";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "var(--blue)";
                  }}
                >
                  {loading ? "Sending..." : "Request My Free Mockup Pack"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
