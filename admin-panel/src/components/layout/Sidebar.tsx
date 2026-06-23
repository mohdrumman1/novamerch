"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";
import {
  DashboardIcon, QuotesIcon, OrdersIcon, InvoicesIcon,
  ShipmentsIcon, CustomersIcon, FinancialsIcon, GoodsIcon,
  MockupBuilderIcon, LogoutIcon
} from "@/components/icons";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Dashboard: DashboardIcon,
  Quotes: QuotesIcon,
  Orders: OrdersIcon,
  Invoices: InvoicesIcon,
  Shipments: ShipmentsIcon,
  Customers: CustomersIcon,
  Financials: FinancialsIcon,
  Goods: GoodsIcon,
  MockupBuilder: MockupBuilderIcon,
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex flex-col h-screen sticky top-0 shrink-0"
      style={{
        width: 225,
        background: "var(--sidebar-bg)",
        padding: "24px 16px",
        overflowY: "auto",
      }}
    >
      {/* Logo / Brand */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 240"
            fill="none"
            width={36}
            height={43}
            style={{ color: "var(--accent)", flexShrink: 0 }}
          >
            <rect x="10" y="10" width="180" height="180" stroke="currentColor" strokeWidth="14" fill="none"/>
            <path d="M48 48 L48 152 L72 152 L72 100 L128 152 L152 152 L152 48 L128 48 L128 100 L72 48 Z" fill="currentColor"/>
          </svg>
          <div>
            <div
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
                fontSize: "15px",
                letterSpacing: 0,
                color: "white",
                lineHeight: 1.1,
              }}
            >
              NovaMerch
            </div>
            <div
              style={{
                fontSize: "9px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
                fontFamily: "var(--font-mono)",
                marginTop: 2,
              }}
            >
              Admin Panel
            </div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map((item) => {
          const Icon = ICON_MAP[item.iconKey];
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium transition-colors no-underline"
              style={{
                background: isActive ? "var(--accent)" : "transparent",
                color: isActive ? "#0A0A0A" : "rgba(255,255,255,0.7)",
                fontWeight: isActive ? 600 : 400,
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              {Icon && <Icon size={18} />}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <form action="/admin/api/auth/logout" method="post" className="mt-4">
        <button
          className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm w-full border-0 cursor-pointer transition-colors"
          style={{ background: "transparent", color: "rgba(255,255,255,0.5)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,59,48,0.12)"; (e.currentTarget as HTMLElement).style.color = "var(--red)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}
        >
          <LogoutIcon size={18} />
          Logout
        </button>
      </form>
    </aside>
  );
}
