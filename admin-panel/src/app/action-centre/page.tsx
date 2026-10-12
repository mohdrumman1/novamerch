"use client";
import { PageHeader } from "@/components/layout/PageHeader";
import { useData } from "@/context/DataProvider";

export default function ActionCentrePage() {
  const { orders, quotes, shipments } = useData();
  const cards = [
    ["Quotes awaiting approval", quotes.filter((q) => q.status === "Sent").length, "/quotes"],
    ["Orders awaiting supplier release", orders.filter((o) => o.goodsStatus === "Pending").length, "/orders"],
    ["Orders running late", orders.filter((o) => o.goodsStatus === "In Transit").length, "/orders"],
    ["Active shipments", shipments.filter((s) => s.status === "In Transit").length, "/shipments"],
  ] as const;
  return <div><PageHeader title="Action Centre" />
    <p className="mb-6 text-sm text-[var(--text-muted)]">Work requiring attention across quotes, approvals, fulfilment, and customer service.</p>
    <div className="grid gap-4 md:grid-cols-2">
      {cards.map(([label, count, href]) => <a key={label} href={href} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 hover:border-[var(--accent)] transition-colors"><p className="text-sm text-[var(--text-muted)]">{label}</p><p className="mt-3 text-3xl font-semibold text-[var(--text)]">{count}</p><p className="mt-2 text-xs text-[var(--text-muted)]">Open queue →</p></a>)}
    </div>
  </div>;
}
