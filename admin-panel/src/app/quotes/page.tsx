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
import { quoteTotal } from "@/lib/calc";
import { QUOTE_STATUS_TONE } from "@/lib/status";
import { QUOTE_STATUSES } from "@/lib/constants";
import type { Quote } from "@/lib/types";
import { QuoteModal } from "@/components/modals/QuoteModal";
import { PlusIcon, EditIcon, TrashIcon } from "@/components/icons";

const QUOTE_SOURCES = ["Mockup Builder", "Manual", "Email Inquiry"] as const;

const SOURCE_BADGE_STYLE: Record<string, React.CSSProperties> = {
  "Mockup Builder": { background: "rgba(6, 182, 212, 0.12)", color: "#0e7490", border: "1px solid rgba(6, 182, 212, 0.3)" },
  "Manual":         { background: "rgba(100, 116, 139, 0.12)", color: "#475569", border: "1px solid rgba(100, 116, 139, 0.3)" },
  "Email Inquiry":  { background: "rgba(168, 85, 247, 0.12)", color: "#7e22ce", border: "1px solid rgba(168, 85, 247, 0.3)" },
};

function SourceBadge({ source }: { source?: string }) {
  if (!source) return null;
  const style = SOURCE_BADGE_STYLE[source] ?? SOURCE_BADGE_STYLE["Manual"];
  return (
    <span
      style={{
        ...style,
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {source}
    </span>
  );
}

export default function QuotesPage() {
  const { quotes, getCustomer, deleteQuote, addOrder } = useData();
  const [statusFilter, setStatusFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = quotes.filter((q) => {
    const matchStatus = statusFilter === "All" || q.status === statusFilter;
    const matchSource = sourceFilter === "All" || (q.source ?? "Manual") === sourceFilter;
    const customer = getCustomer(q.customerId);
    const matchSearch =
      !search ||
      q.ref.toLowerCase().includes(search.toLowerCase()) ||
      (customer?.company ?? "").toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSource && matchSearch;
  });

  const columns = [
    { key: "ref", header: "Quote #", sortable: true },
    {
      key: "customerId",
      header: "Customer",
      render: (row: Quote) => getCustomer(row.customerId)?.company ?? row.customerId,
    },
    {
      key: "issuedAt",
      header: "Date",
      render: (row: Quote) => formatDate(row.issuedAt),
    },
    {
      key: "validUntil",
      header: "Valid Until",
      render: (row: Quote) => formatDate(row.validUntil),
    },
    {
      key: "total",
      header: "Total",
      align: "right" as const,
      render: (row: Quote) => (
        <span style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>
          {formatAUD(quoteTotal(row))}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: Quote) => <Badge label={row.status} tone={QUOTE_STATUS_TONE[row.status]} />,
    },
    {
      key: "source",
      header: "Source",
      render: (row: Quote) => <SourceBadge source={row.source ?? "Manual"} />,
    },
    {
      key: "actions",
      header: "",
      align: "right" as const,
      render: (row: Quote) => (
        <div className="flex items-center gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
          <Button variant="subtle" size="compact" onClick={() => setEditingQuote(row)}>
            <EditIcon size={13} /> Edit
          </Button>
          {row.status !== "Accepted" && (
            <Button
              variant="ghost"
              size="compact"
              onClick={() => {
                const now = new Date();
                const month = now.getMonth() + 1; // 1-indexed
                const year = now.getFullYear();
                const fy = month >= 7
                  ? `FY${year}/${String(year + 1).slice(2)}`
                  : `FY${year - 1}/${String(year).slice(2)}`;
                const order = {
                  id: crypto.randomUUID(),
                  ref: `#O${Date.now().toString().slice(-4)}`,
                  customerId: row.customerId,
                  quoteId: row.id,
                  goodsStatus: "Pending" as const,
                  invoiceStatus: "Need to Invoice" as const,
                  transportType: "Agent Sea" as const,
                  fy,
                  orderedAt: now.toISOString(),
                  lineItems: row.lineItems,
                };
                addOrder(order);
                alert(`Order created from ${row.ref}`);
              }}
              style={{ color: "var(--green)", background: "var(--green-soft)" }}
            >
              Convert to Order
            </Button>
          )}
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
        title="Quotes"
        actions={
          <Button variant="primary" onClick={() => setCreating(true)}>
            <PlusIcon size={16} /> New Quote
          </Button>
        }
      />

      <div className="bg-[var(--surface)] rounded-[var(--radius)] border border-[var(--border)] p-5">
        <FilterBar
          search={{ value: search, onChange: setSearch, placeholder: "Search quotes..." }}
          filters={[
            {
              label: "Status",
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { value: "All", label: "All Quotes" },
                ...QUOTE_STATUSES.map((s) => ({ value: s, label: s })),
              ],
            },
            {
              label: "Source",
              value: sourceFilter,
              onChange: setSourceFilter,
              options: [
                { value: "All", label: "All Sources" },
                ...QUOTE_SOURCES.map((s) => ({ value: s, label: s })),
              ],
            },
          ]}
        />
        <Table
          columns={columns}
          rows={filtered}
          onRowClick={(row) => setEditingQuote(row)}
          emptyTitle="No quotes found"
          emptyDescription="Create your first quote to get started."
        />
      </div>

      <QuoteModal
        open={creating || editingQuote !== null}
        onClose={() => { setCreating(false); setEditingQuote(null); }}
        quote={editingQuote}
      />

      <ConfirmDialog
        open={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={() => { if (deletingId) { deleteQuote(deletingId); setDeletingId(null); } }}
        title="Delete Quote"
        message="Are you sure you want to delete this quote? This cannot be undone."
      />
    </div>
  );
}
