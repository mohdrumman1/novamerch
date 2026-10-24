"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { analyticsConfigured, getConsent, loadAnalytics, setConsent } from "@/lib/analytics";

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!analyticsConfigured) return;
    const choice = getConsent();
    if (choice === "granted") loadAnalytics();
    if (choice === null) setVisible(true);
  }, []);

  if (!visible) return null;

  const choose = (value: "granted" | "denied") => {
    setConsent(value);
    setVisible(false);
  };

  const button = { padding: "0.6rem 1.1rem", borderRadius: 999, fontWeight: 700, cursor: "pointer", border: "1px solid rgba(255,255,255,.3)", fontSize: ".85rem" } as const;

  return (
    <div role="dialog" aria-label="Analytics consent" style={{ position: "fixed", left: 12, right: 12, bottom: 12, zIndex: 1000, background: "#0b1424", color: "#F4F7FB", border: "1px solid rgba(255,255,255,.18)", borderRadius: 14, padding: "1rem 1.1rem", display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center", justifyContent: "space-between", maxWidth: 720, margin: "0 auto" }}>
      <p style={{ margin: 0, fontSize: ".85rem", lineHeight: 1.5, flex: "1 1 320px" }}>
        We use analytics cookies to see which pages help people. No contact details are sent. <Link href="/privacy/" style={{ color: "#00CFFF" }}>Privacy policy</Link>
      </p>
      <div style={{ display: "flex", gap: ".5rem" }}>
        <button type="button" onClick={() => choose("denied")} style={{ ...button, background: "transparent", color: "#F4F7FB" }}>Decline</button>
        <button type="button" onClick={() => choose("granted")} style={{ ...button, background: "#00CFFF", color: "#06101D", border: "none" }}>Accept</button>
      </div>
    </div>
  );
}
