"use client";
import { PageHeader } from "@/components/layout/PageHeader";
import { useData } from "@/context/DataProvider";
export default function ApprovalsPage() {
  const { orders } = useData();
  return <div><PageHeader title="Artwork approvals" /><p className="mb-6 text-sm text-[var(--text-muted)]">Orders remain pending until a customer approves the artwork and specifications.</p><div className="space-y-3">{orders.map((order) => <div key={order.id} className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"><div><p className="font-semibold text-[var(--text)]">{order.ref}</p><p className="text-xs text-[var(--text-muted)]">{order.lineItems.length} line items · supplier release gated</p></div><span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-800">Pending approval</span></div>)}</div></div>;
}
