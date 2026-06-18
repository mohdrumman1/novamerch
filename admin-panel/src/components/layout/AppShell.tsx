"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { MobileTabBar } from "./MobileTabBar";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg)" }}>
      <Sidebar />
      <main
        className="flex-1 min-w-0 main-with-sidebar"
        style={{ padding: "32px", overflowX: "hidden" }}
      >
        {children}
      </main>
      <MobileTabBar />
    </div>
  );
}
