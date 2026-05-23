"use client";
import React, { useState } from "react";
import { useData } from "@/context/DataProvider";
import { PageHeader } from "@/components/layout/PageHeader";
import { Table } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FilterBar } from "@/components/ui/FilterBar";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { formatAUD, formatDate } from "@/lib/format";
import { lineItemsTotal, orderExpectedProfit } from "@/lib/calc";
import { ORDER_GOODS_STATUS_TONE, ORDER_INVOICE_STATUS_TONE } from "@/lib/status";
import { ORDER_GOODS_STATUSES, FY_ALL } from "@/lib/constants";
import type { Order } from "@/lib/types";
import { OrderModal } from "@/components/modals/OrderModal";
import { PlusIcon, EditIcon, TrashIcon } from "@/components/icons";

export default function OrdersPage() {
  const { orders, getCustomer, deleteOrder } = useData();
  const [goodsStatusFilter, setGoodsStatusFilter] = useState("All");
  const [fyFilter, setFyFilter] = useState(FY_ALL);
  const [search, setSearch] = useState("");
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fyOptions = [FY_ALL, ...Array.from(new Set(orders.map((o) => o.fy))).sort().reverse()];

  const filtered = orders.filter((o) => {
    const matchFy = fyFilter === FY_ALL || o.fy === fyFilter;
    const matchStatus = goodsStatusFilter === "All" || o.goodsStatus === goodsStatusFilter;
    const customer = getCustomer(o.customerId);
    const matchSearch =
      !search ||
      o.ref.toLowerCase().includes(search.toLowerCase()) ||
      (customer?.company ?? "").toLowerCase().includes(search.toLowerCase());
    return matchFy && matchStatus && matchSearch;
  });

  const profit = (row: Order) => orderExpectedProfit(row);

  const columns = [
    { key: "ref", header: "Order #", sortable: true },
    {
      key: "customerId",
      header: "Customer",
      render: (row: Order) => getCustomer(row.customerId)?.company ?? row.customerId,
    },
    {
      key: "orderedAt",
      header: "Date",
      render: (row: Order) => formatDate(row.orderedAt),
    },
    {
      key: "goodsStatus",
      header: "Goods Status",
      render: (row: Order) => <Badge label={row.goodsStatus} tone={ORDER_GOODS_STATUS_TONE[row.goodsStatus]} />,
    },
    {
      key: "invoiceStatus",
      header: "Invoice Status",
      render: (row: Order) => <Badge label={row.invoiceStatus} tone={ORDER_INVOICE_STATUS_TONE[row.invoiceStatus]} />,
    },
    {
      key: "transportType",
      header: "Transport",
      render: (row: Order) => (
        <span className="text-xs text-[var(--text-muted)]">{row.transportType}</span>
      ),
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
      key: "profit",
      header: "Profit",
      align: "right" as const,
      render: (row: Order) => {
        const p = profit(row);
        return (
          <span
            style={{
              fontFamily: "var(--font-dm-mono, monospace)",
              color: p >= 0 ? "var(--green)" : "var(--red)",
            }}
          >
            {formatAUD(p)}
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "",
      align: "right" as const,
      render: (row: Order) => (
        <div className="flex items-center gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
          <Button variant="subtle" size="compact" onClick={() => setEditingOrder(row)}>
            <EditIcon size={13} /> Edit
          </Button>
          <Button variant="danger" size="compact" onClick={() => setDeletingId(row.id)}>
            <TrashIcon size={13} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Orders"
        actions={
          <Button variant="primary" onClick={() => setCreating(true)}>
            <PlusIcon size={16} /> New Order
          </Button>
        }
      />

      <div className="bg-[var(--surface)] rounded-[var(--radius)] border border-[var(--border)] p-5">
        <FilterBar
          search={{ value: search, onChange: setSearch, placeholder: "Search orders..." }}
          filters={[
            {
              label: "FY",
              value: fyFilter,
              onChange: setFyFilter,
              options: fyOptions.map((f) => ({ value: f, label: f })),
            },
            {
              label: "Status",
              value: goodsStatusFilter,
              onChange: setGoodsStatusFilter,
              options: [
                { value: "All", label: "All Statuses" },
                ...ORDER_GOODS_STATUSES.map((s) => ({ value: s, label: s })),
              ],
            },
          ]}
        />
        <Table
          columns={columns}
          rows={filtered}
          onRowClick={(row) => setEditingOrder(row)}
          emptyTitle="No orders found"
          emptyDescription="Adjust filters or create a new order."
        />
      </div>

      <OrderModal
        open={creating || editingOrder !== null}
        onClose={() => { setCreating(false); setEditingOrder(null); }}
        order={editingOrder}
      />

      <ConfirmDialog
        open={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={() => { if (deletingId) { deleteOrder(deletingId); setDeletingId(null); } }}
        title="Delete Order"
        message="Are you sure you want to delete this order?"
      />
    </div>
  );
}
