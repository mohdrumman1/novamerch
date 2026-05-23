"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardIcon, OrdersIcon, InvoicesIcon, CustomersIcon, GoodsIcon } from "@/components/icons";

const MOBILE_TABS = [
  { label: "Dashboard", href: "/dashboard", Icon: DashboardIcon },
  { label: "Orders", href: "/orders", Icon: OrdersIcon },
  { label: "Invoices", href: "/invoices", Icon: InvoicesIcon },
  { label: "Customers", href: "/customers", Icon: CustomersIcon },
  { label: "Goods", href: "/goods", Icon: GoodsIcon },
];

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex"
      style={{
        background: "var(--sidebar-bg)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        height: 64,
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {MOBILE_TABS.map(({ label, href, Icon }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center justify-center gap-1 no-underline transition-colors"
            style={{ color: isActive ? "var(--accent)" : "rgba(255,255,255,0.5)" }}
          >
            <Icon size={22} />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
