"use client";
import React from "react";
import type { Customer } from "@/lib/types";
import { useData } from "@/context/DataProvider";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { formatAUD, formatDate } from "@/lib/format";
import { lineItemsTotal, orderExpectedProfit } from "@/lib/calc";
import { ORDER_GOODS_STATUS_TONE } from "@/lib/status";

interface CustomerDetailModalProps {
  open: boolean;
  onClose: () => void;
  customer: Customer | null;
}

export function CustomerDetailModal({ open, onClose, customer }: CustomerDetailModalProps) {
  const { orders, invoices } = useData();

  if (!customer) return null;

  const customerOrders = orders.filter((o) => o.customerId === customer.id);
  const customerInvoices = invoices.filter((i) => i.customerId === customer.id);
  const totalRevenue = customerOrders.reduce((sum, o) => sum + lineItemsTotal(o.lineItems), 0);
  const totalProfit = customerOrders.reduce((sum, o) => sum + orderExpectedProfit(o), 0);
  const cashReceived = customerInvoices
    .filter((i) => i.status === "Paid")
    .reduce((sum, i) => sum + (i.amountReceived ?? i.total), 0);

  return (
    <Modal open={open} onClose={onClose} title={customer.company} size="xl">
      <div className="space-y-6">
        {/* Contact info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-[var(--text-muted)] text-xs uppercase tracking-wide mb-1">Contact</p>
            <p className="font-medium">{customer.name}</p>
          </div>
          <div>
            <p className="text-[var(--text-muted)] text-xs uppercase tracking-wide mb-1">Email</p>
            <p className="font-medium">{customer.email || "—"}</p>
          </div>
          <div>
            <p className="text-[var(--text-muted)] text-xs uppercase tracking-wide mb-1">Phone</p>
            <p className="font-medium">{customer.phone || "—"}</p>
          </div>
          <div>
            <p className="text-[var(--text-muted)] text-xs uppercase tracking-wide mb-1">ABN</p>
            <p className="font-medium">{customer.abn || "—"}</p>
          </div>
          {customer.billingAddress && (
            <div className="col-span-2">
              <p className="text-[var(--text-muted)] text-xs uppercase tracking-wide mb-1">Billing Address</p>
              <p className="font-medium">{customer.billingAddress}</p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Total Orders" value={String(customerOrders.length)} />
          <StatCard label="Total Revenue" value={formatAUD(totalRevenue)} />
          <StatCard
            label="Total Profit"
            value={formatAUD(totalProfit)}
            tone={totalProfit >= 0 ? "green" : "red"}
          />
        </div>

        <StatCard
          label="Cash Received"
          value={formatAUD(cashReceived)}
          tone="blue"
          accentColor="var(--blue)"
        />

        {/* Order history */}
        {customerOrders.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-[var(--text)] mb-3">Order History</h3>
            <div className="rounded-[var(--radius-sm)] border border-[var(--border)] overflow-hidden max-h-64 overflow-y-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="sticky top-0" style={{ background: "var(--surface-2)" }}>
                  <tr>
                    {["Order #", "Date", "Status", "Value", "Profit"].map((h) => (
                      <th key={h} className="px-3 py-2 text-left text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {customerOrders.map((order) => {
                    const profit = orderExpectedProfit(order);
                    return (
                      <tr key={order.id} className="border-t border-[var(--border)]">
                        <td className="px-3 py-2 font-medium">{order.ref}</td>
                        <td className="px-3 py-2 text-[var(--text-muted)]">{formatDate(order.orderedAt)}</td>
                        <td className="px-3 py-2">
                          <Badge label={order.goodsStatus} tone={ORDER_GOODS_STATUS_TONE[order.goodsStatus]} />
                        </td>
                        <td className="px-3 py-2 text-right" style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>
                          {formatAUD(lineItemsTotal(order.lineItems))}
                        </td>
                        <td
                          className="px-3 py-2 text-right"
                          style={{
                            fontFamily: "var(--font-dm-mono, monospace)",
                            color: profit >= 0 ? "var(--green)" : "var(--red)",
                          }}
                        >
                          {formatAUD(profit)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Notes */}
        {customer.notes && (
          <div>
            <p className="text-[var(--text-muted)] text-xs uppercase tracking-wide mb-1">Notes</p>
            <p className="text-sm text-[var(--text)]">{customer.notes}</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
