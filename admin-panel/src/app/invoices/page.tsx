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
import { INVOICE_STATUS_TONE } from "@/lib/status";
import { INVOICE_STATUSES, INVOICE_KINDS } from "@/lib/constants";
import type { Invoice } from "@/lib/types";
import { InvoiceModal } from "@/components/modals/InvoiceModal";
import { PlusIcon, EditIcon, TrashIcon } from "@/components/icons";

export default function InvoicesPage() {
  const { invoices, getCustomer, deleteInvoice } = useData();
  const [statusFilter, setStatusFilter] = useState("All");
  const [kindFilter, setKindFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Auto-derive overdue status for display (dueAt < today and not Paid)
  const today = new Date().toISOString().slice(0, 10);
  const enriched = invoices.map((inv) => ({
    ...inv,
    status:
      inv.status !== "Paid" && inv.dueAt < today && inv.status !== "Draft"
        ? ("Overdue" as Invoice["status"])
        : inv.status,
  }));

  const filtered = enriched.filter((inv) => {
    const matchStatus = statusFilter === "All" || inv.status === statusFilter;
    const matchKind = kindFilter === "All" || inv.kind === kindFilter;
    const customer = getCustomer(inv.customerId);
    const matchSearch =
      !search ||
      inv.ref.toLowerCase().includes(search.toLowerCase()) ||
      (customer?.company ?? "").toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchKind && matchSearch;
  });

  const columns = [
    { key: "ref", header: "Invoice #", sortable: true },
    {
      key: "customerId",
      header: "Customer",
      render: (row: Invoice) => getCustomer(row.customerId)?.company ?? row.customerId,
    },
    {
      key: "kind",
      header: "Type",
      render: (row: Invoice) => (
        <span className="text-xs text-[var(--text-muted)] font-medium">{row.kind}</span>
      ),
    },
    {
      key: "issuedAt",
      header: "Issued",
      render: (row: Invoice) => formatDate(row.issuedAt),
    },
    {
      key: "dueAt",
      header: "Due",
      render: (row: Invoice) => (
        <span style={{ color: row.dueAt < today && row.status !== "Paid" ? "var(--red)" : "inherit" }}>
          {formatDate(row.dueAt)}
        </span>
      ),
    },
    {
      key: "total",
      header: "Total",
      align: "right" as const,
      render: (row: Invoice) => (
        <span style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>{formatAUD(row.total)}</span>
      ),
    },
    {
      key: "amountReceived",
      header: "Received",
      align: "right" as const,
      render: (row: Invoice) => (
        <span style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>
          {formatAUD(row.amountReceived ?? 0)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: Invoice) => <Badge label={row.status} tone={INVOICE_STATUS_TONE[row.status]} />,
    },
    {
      key: "actions",
      header: "",
      align: "right" as const,
      render: (row: Invoice) => (
        <div className="flex items-center gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
          <Button variant="subtle" size="compact" onClick={() => setEditingInvoice(row)}>
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
        title="Invoices"
        actions={
          <Button variant="primary" onClick={() => setCreating(true)}>
            <PlusIcon size={16} /> New Invoice
          </Button>
        }
      />

      <div className="bg-[var(--surface)] rounded-[var(--radius)] border border-[var(--border)] p-5">
        <FilterBar
          search={{ value: search, onChange: setSearch, placeholder: "Search invoices..." }}
          filters={[
            {
              label: "Status",
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { value: "All", label: "All Statuses" },
                ...INVOICE_STATUSES.map((s) => ({ value: s, label: s })),
              ],
            },
            {
              label: "Kind",
              value: kindFilter,
              onChange: setKindFilter,
              options: [
                { value: "All", label: "All Types" },
                ...INVOICE_KINDS.map((k) => ({ value: k, label: k })),
              ],
            },
          ]}
        />
        <Table
          columns={columns}
          rows={filtered}
          onRowClick={(row) => setEditingInvoice(row)}
          emptyTitle="No invoices found"
          emptyDescription="Create your first invoice to get started."
        />
      </div>

      <InvoiceModal
        open={creating || editingInvoice !== null}
        onClose={() => { setCreating(false); setEditingInvoice(null); }}
        invoice={editingInvoice}
      />

      <ConfirmDialog
        open={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={() => { if (deletingId) { deleteInvoice(deletingId); setDeletingId(null); } }}
        title="Delete Invoice"
        message="Are you sure you want to delete this invoice?"
      />
    </div>
  );
}
