"use client";
import React, { useState } from "react";
import { useData } from "@/context/DataProvider";
import { PageHeader } from "@/components/layout/PageHeader";
import { Table } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FilterBar } from "@/components/ui/FilterBar";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { formatDate } from "@/lib/format";
import { SHIPMENT_STATUS_TONE } from "@/lib/status";
import { SHIPMENT_STATUSES, SHIPPING_METHODS } from "@/lib/constants";
import type { Shipment } from "@/lib/types";
import { ShipmentModal } from "@/components/modals/ShipmentModal";
import { PlusIcon, EditIcon, TrashIcon, CheckIcon } from "@/components/icons";

const SHIPPING_METHOD_COLORS: Record<string, { bg: string; color: string }> = {
  "Agent Sea": { bg: "#E3F2FD", color: "#1976D2" },
  "Agent Air": { bg: "#FFF3E0", color: "#F57C00" },
  "Supplier Air": { bg: "#F3E5F5", color: "#7B1FA2" },
};

export default function ShipmentsPage() {
  const { shipments, getCustomer, updateShipment, deleteShipment } = useData();
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = shipments.filter((s) => {
    const matchStatus = statusFilter === "All" || s.status === statusFilter;
    const matchMethod = methodFilter === "All" || s.shippingMethod === methodFilter;
    const customer = getCustomer(s.customerId);
    const matchSearch =
      !search ||
      s.ref.toLowerCase().includes(search.toLowerCase()) ||
      (s.trackingAgentToK2 ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (customer?.company ?? "").toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchMethod && matchSearch;
  });

  function markArrived(shipment: Shipment) {
    updateShipment({
      ...shipment,
      status: "Arrived",
      arrivedAt: new Date().toISOString().slice(0, 10),
    });
  }

  const columns = [
    { key: "ref", header: "Shipment #", sortable: true },
    {
      key: "trackingAgentToK2",
      header: "Agent Tracking",
      render: (row: Shipment) => (
        <span
          className="text-sm font-semibold"
          style={{ fontFamily: "var(--font-dm-mono, monospace)" }}
        >
          {row.trackingAgentToK2 ?? "N/A"}
        </span>
      ),
    },
    {
      key: "shippingMethod",
      header: "Method",
      render: (row: Shipment) => {
        const colors = SHIPPING_METHOD_COLORS[row.shippingMethod] ?? { bg: "var(--surface-2)", color: "var(--text-muted)" };
        return (
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            style={{ background: colors.bg, color: colors.color }}
          >
            {row.shippingMethod}
          </span>
        );
      },
    },
    {
      key: "shippedAt",
      header: "Shipped",
      render: (row: Shipment) => formatDate(row.shippedAt),
    },
    {
      key: "expectedArrival",
      header: "ETA",
      render: (row: Shipment) => formatDate(row.expectedArrival),
    },
    {
      key: "status",
      header: "Status",
      render: (row: Shipment) => <Badge label={row.status} tone={SHIPMENT_STATUS_TONE[row.status]} />,
    },
    {
      key: "customerId",
      header: "Customer",
      render: (row: Shipment) => getCustomer(row.customerId)?.company ?? row.customerId,
    },
    {
      key: "items",
      header: "Items",
      align: "center" as const,
      render: (row: Shipment) => (
        <span className="text-sm text-[var(--text-muted)]">{row.items.length}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right" as const,
      render: (row: Shipment) => (
        <div className="flex items-center gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
          <Button variant="subtle" size="compact" onClick={() => setEditingShipment(row)}>
            <EditIcon size={13} /> Edit
          </Button>
          {row.status === "In Transit" && (
            <Button
              variant="ghost"
              size="compact"
              onClick={() => markArrived(row)}
              style={{ color: "var(--green)", background: "var(--green-soft)" }}
            >
              <CheckIcon size={13} /> Mark Arrived
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
        title="Shipments"
        actions={
          <Button variant="primary" onClick={() => setCreating(true)}>
            <PlusIcon size={16} /> New Shipment
          </Button>
        }
      />

      <div className="bg-[var(--surface)] rounded-[var(--radius)] border border-[var(--border)] p-5">
        <FilterBar
          search={{ value: search, onChange: setSearch, placeholder: "Search shipments..." }}
          filters={[
            {
              label: "Status",
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { value: "All", label: "All Statuses" },
                ...SHIPMENT_STATUSES.map((s) => ({ value: s, label: s })),
              ],
            },
            {
              label: "Method",
              value: methodFilter,
              onChange: setMethodFilter,
              options: [
                { value: "All", label: "All Methods" },
                ...SHIPPING_METHODS.map((m) => ({ value: m, label: m })),
              ],
            },
          ]}
        />
        <Table
          columns={columns}
          rows={filtered}
          onRowClick={(row) => setEditingShipment(row)}
          emptyTitle="No shipments found"
          emptyDescription="Create a shipment to track your deliveries."
        />
      </div>

      <ShipmentModal
        open={creating || editingShipment !== null}
        onClose={() => { setCreating(false); setEditingShipment(null); }}
        shipment={editingShipment}
      />

      <ConfirmDialog
        open={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={() => { if (deletingId) { deleteShipment(deletingId); setDeletingId(null); } }}
        title="Delete Shipment"
        message="Are you sure you want to delete this shipment?"
      />
    </div>
  );
}
