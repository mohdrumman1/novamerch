import type { Metadata } from "next";
import "./globals.css";
import { DataProvider } from "@/context/DataProvider";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "NovaMerch Admin",
  description: "NovaMerch internal admin panel",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <DataProvider>
          <AppShell>{children}</AppShell>
        </DataProvider>
      </body>
    </html>
  );
}
