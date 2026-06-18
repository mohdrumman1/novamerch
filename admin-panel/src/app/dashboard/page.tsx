"use client";
import React, { useState } from "react";
import { useData } from "@/context/DataProvider";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Table } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { formatAUD, formatDate } from "@/lib/format";
import { lineItemsTotal, lineItemsCost } from "@/lib/calc";
import { FY_ALL } from "@/lib/constants";
import { ORDER_GOODS_STATUS_TONE } from "@/lib/status";
import type { Order } from "@/lib/types";

export default function DashboardPage() {
  const { orders, invoices, quotes, customers, shipments } = useData();
  const [fy, setFy] = useState<string>(FY_ALL);

  // FY filter options
  const fyOptions = [FY_ALL, ...Array.from(new Set(orders.map((o) => o.fy))).sort().reverse()];

  // Filter orders by FY
  const filteredOrders = fy === FY_ALL ? orders : orders.filter((o) => o.fy === fy);

  // ── Expected Financial ──────────────────────────────────────────────────
  const expectedRevenue = filteredOrders.reduce((sum, o) => sum + lineItemsTotal(o.lineItems), 0);
  const totalCosts = filteredOrders.reduce(
    (sum, o) => sum + lineItemsCost(o.lineItems) + (o.transportCost ?? 0),
    0
  );
  const expectedProfit = expectedRevenue - totalCosts;
  const profitMargin = expectedRevenue > 0 ? (expectedProfit / expectedRevenue) * 100 : 0;

  // ── Actual Cash Flow ────────────────────────────────────────────────────
  // cashReceived: sum order.amountReceived directly (not from invoices)
  const cashReceived = filteredOrders.reduce((sum, o) => sum + (o.amountReceived ?? 0), 0);
  // costsPaid: all orders in FY (not just completed)
  const costsPaid = filteredOrders.reduce(
    (sum, o) => sum + lineItemsCost(o.lineItems) + (o.transportCost ?? 0),
    0
  );
  // outstanding: ALL-TIME, floor at 0 per order
  const outstandingInvoices = orders.reduce(
    (sum, o) => sum + Math.max(0, lineItemsTotal(o.lineItems) - (o.amountReceived ?? 0)),
    0
  );

  // ── Pipeline ────────────────────────────────────────────────────────────
  const pendingOrdersValue = orders
    .filter((o) => o.goodsStatus === "Pending")
    .reduce((sum, o) => sum + lineItemsTotal(o.lineItems), 0);
  const inTransitCount = orders.filter((o) => o.goodsStatus === "In Transit").length;
  const inTransitCost = orders
    .filter((o) => o.goodsStatus === "In Transit")
    .reduce((sum, o) => sum + lineItemsCost(o.lineItems) + (o.transportCost ?? 0), 0);

  // ── Recent Orders ───────────────────────────────────────────────────────
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime())
    .slice(0, 6);

  // ── Operations stats ────────────────────────────────────────────────────
  const totalOrders = filteredOrders.length;
  const orderedCount = filteredOrders.filter((o) => o.goodsStatus === "Ordered").length;
  const inTransitOrders = filteredOrders.filter((o) => o.goodsStatus === "In Transit").length;
  const completedOrders = filteredOrders.filter((o) => o.goodsStatus === "Completed").length;
  // readyToInvoice: ALL-TIME, no FY filter
  const readyToInvoice = orders.filter((o) => o.invoiceStatus === "Need to Invoice").length;
  const totalInvoices = invoices.length;
  const totalQuotes = quotes.length;
  const activeShipments = shipments.filter((s) => s.status === "In Transit").length;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        actions={
          <div className="flex items-center gap-3">
            <select
              value={fy}
              onChange={(e) => setFy(e.target.value)}
              className="px-3 py-2 text-sm rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] focus:outline-none cursor-pointer"
            >
              {fyOptions.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        }
      />

      {/* Expected Financial Performance */}
      <section className="mb-8">
        <p
          className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-3 font-semibold"
          style={{ fontFamily: "var(--font-dm-mono, monospace)" }}
        >
          Expected Financial Performance
        </p>
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))" }}>
          <StatCard label="Expected Revenue" value={formatAUD(expectedRevenue)} />
          <StatCard label="Total Costs" value={formatAUD(totalCosts)} tone="red" />
          <StatCard
            label="Expected Profit"
            value={formatAUD(expectedProfit)}
            tone={expectedProfit >= 0 ? "green" : "red"}
          />
          <StatCard
            label="Profit Margin"
            value={`${profitMargin.toFixed(1)}%`}
            tone={profitMargin >= 20 ? "green" : profitMargin >= 10 ? "orange" : "red"}
          />
        </div>
      </section>

      {/* Actual Cash Flow */}
      <section className="mb-8">
        <p
          className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-3 font-semibold"
          style={{ fontFamily: "var(--font-dm-mono, monospace)" }}
        >
          Actual Cash Flow
        </p>
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))" }}>
          <StatCard label="Cash Received" value={formatAUD(cashReceived)} tone="green" />
          <StatCard label="Costs Paid" value={formatAUD(costsPaid)} tone="red" />
          <StatCard
            label="Outstanding Invoices"
            value={formatAUD(outstandingInvoices)}
            tone="orange"
            accentColor="#FF9800"
          />
          <StatCard
            label="Actual Profit Today"
            value={formatAUD(cashReceived - costsPaid)}
            tone={cashReceived - costsPaid >= 0 ? "green" : "red"}
          />
        </div>
      </section>

      {/* Pipeline */}
      <section className="mb-8">
        <p
          className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-3 font-semibold"
          style={{ fontFamily: "var(--font-dm-mono, monospace)" }}
        >
          Pipeline
        </p>
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))" }}>
          <StatCard label="Pending Orders Value" value={formatAUD(pendingOrdersValue)} accentColor="#999" />
          <StatCard label="In Transit Cost" value={formatAUD(inTransitCost)} tone="blue" accentColor="var(--blue)" />
          <StatCard label="In Transit Orders" value={String(inTransitCount)} tone="blue" accentColor="var(--blue)" />
        </div>
      </section>

      {/* Recent Orders */}
      <section className="mb-8">
        <div className="bg-[var(--surface)] rounded-[var(--radius)] border border-[var(--border)] p-5">
          <h2 className="text-base font-semibold text-[var(--text)] mb-4">Recent Orders</h2>
          <RecentOrdersTable orders={recentOrders} />
        </div>
      </section>

      {/* Operations */}
      <section>
        <p
          className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-3 font-semibold"
          style={{ fontFamily: "var(--font-dm-mono, monospace)" }}
        >
          Operations
        </p>
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))" }}>
          <StatCard label="Total Orders" value={String(totalOrders)} />
          <StatCard label="Ordered" value={String(orderedCount)} tone="orange" />
          <StatCard label="In Transit" value={String(inTransitOrders)} tone="blue" />
          <StatCard label="Completed" value={String(completedOrders)} tone="green" />
          <StatCard label="Ready to Invoice" value={String(readyToInvoice)} tone="blue" />
          <StatCard label="Total Invoices" value={String(totalInvoices)} />
          <StatCard label="Total Quotes" value={String(totalQuotes)} />
          <StatCard label="Active Shipments" value={String(activeShipments)} tone="blue" />
          <StatCard label="Total Customers" value={String(customers.length)} />
        </div>
      </section>
    </div>
  );
}

// Sub-component to avoid inline column renders at the top level referencing useData
function RecentOrdersTable({ orders }: { orders: Order[] }) {
  const { getCustomer } = useData();

  const columns = [
    { key: "ref", header: "Order #", sortable: true },
    {
      key: "customerId",
      header: "Customer",
      render: (row: Order) => getCustomer(row.customerId)?.company ?? row.customerId,
    },
    {
      key: "total",
      header: "Value",
      align: "right" as const,
      render: (row: Order) => (
        <span style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>
          {formatAUD(lineItemsTotal(row.lineItems))}
        </span>
      ),
    },
    {
      key: "goodsStatus",
      header: "Status",
      render: (row: Order) => (
        <Badge label={row.goodsStatus} tone={ORDER_GOODS_STATUS_TONE[row.goodsStatus]} />
      ),
    },
    {
      key: "orderedAt",
      header: "Date",
      render: (row: Order) => formatDate(row.orderedAt),
    },
  ];

  return <Table columns={columns} rows={orders} emptyTitle="No orders yet" />;
}
