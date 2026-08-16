"use client";
import React, { useState } from "react";
import { useData } from "@/context/DataProvider";
import { PageHeader } from "@/components/layout/PageHeader";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { FilterBar } from "@/components/ui/FilterBar";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { formatDate } from "@/lib/format";
import type { SupplierOrder, SupplierOrderItem } from "@/lib/types";
import { PlusIcon, EditIcon, TrashIcon } from "@/components/icons";

function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function emptyOrder(): Omit<SupplierOrder, "id"> {
  return {
    orderNumber: "",
    orderDate: new Date().toISOString().slice(0, 10),
    supplierName: "",
    supplierContactName: "",
    supplierPhone: "",
    supplierEmail: "",
    supplierAddress: "",
    storeUrl: "",
    shipFrom: "",
    shippingMethod: "",
    incoterms: "",
    itemSubtotalUsd: 0,
    shippingFeeUsd: 0,
    totalUsd: 0,
    initialPaymentUsd: undefined,
    initialPaymentDate: "",
    balanceUsd: undefined,
    balanceStatus: "",
    relatedCustomer: "",
    items: [],
    notes: "",
  };
}

function emptyItem(): SupplierOrderItem {
  return {
    id: crypto.randomUUID(),
    productName: "",
    url: "",
    spec: "",
    unitPriceUsd: 0,
    qty: 0,
    totalUsd: 0,
  };
}

export default function SupplierOrdersPage() {
  const { supplierOrders, addSupplierOrder, updateSupplierOrder, deleteSupplierOrder } = useData();
  const [search, setSearch] = useState("");
  const [editingOrder, setEditingOrder] = useState<SupplierOrder | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<SupplierOrder, "id">>(emptyOrder());

  function openCreate() {
    setForm(emptyOrder());
    setEditingOrder(null);
    setCreating(true);
  }

  function openEdit(order: SupplierOrder) {
    const { id: _unused, ...rest } = order;
    void _unused;
    setForm(rest);
    setEditingOrder(order);
    setCreating(false);
  }

  function handleSubmit() {
    if (!form.supplierName.trim()) return alert("Supplier name is required");
    if (editingOrder) {
      updateSupplierOrder({ ...form, id: editingOrder.id });
    } else {
      addSupplierOrder({ ...form, id: crypto.randomUUID() });
    }
    setCreating(false);
    setEditingOrder(null);
  }

  function updateItem(index: number, patch: Partial<SupplierOrderItem>) {
    const items = form.items.map((it, i) => (i === index ? { ...it, ...patch } : it));
    setForm({ ...form, items });
  }

  function addItem() {
    setForm({ ...form, items: [...form.items, emptyItem()] });
  }

  function removeItem(index: number) {
    setForm({ ...form, items: form.items.filter((_, i) => i !== index) });
  }

  const filtered = supplierOrders.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(q) ||
      o.supplierName.toLowerCase().includes(q) ||
      (o.relatedCustomer ?? "").toLowerCase().includes(q)
    );
  });

  const isFormOpen = creating || editingOrder !== null;

  const columns = [
    { key: "orderNumber", header: "Order #", sortable: true },
    { key: "orderDate", header: "Date", sortable: true, render: (row: SupplierOrder) => formatDate(row.orderDate) },
    {
      key: "supplierName",
      header: "Supplier",
      sortable: true,
      render: (row: SupplierOrder) => (
        <span className="inline-flex items-center gap-2">
          {row.supplierName}
          {row.storeUrl && (
            <a
              href={row.storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-[var(--accent)] hover:underline"
              title="Open supplier link"
            >
              link ↗
            </a>
          )}
        </span>
      ),
    },
    { key: "relatedCustomer", header: "For Customer", render: (row: SupplierOrder) => row.relatedCustomer || "-" },
    { key: "totalUsd", header: "Total", align: "right" as const, render: (row: SupplierOrder) => formatUSD(row.totalUsd) },
    { key: "balanceUsd", header: "Balance Due", align: "right" as const, render: (row: SupplierOrder) => (row.balanceUsd ? formatUSD(row.balanceUsd) : "-") },
    {
      key: "actions",
      header: "",
      align: "right" as const,
      render: (row: SupplierOrder) => (
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEdit(row);
            }}
            className="p-1.5 rounded hover:bg-[var(--surface-2)] text-[var(--text-muted)]"
            title="Edit"
          >
            <EditIcon size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeletingId(row.id);
            }}
            className="p-1.5 rounded hover:bg-[var(--surface-2)] text-[var(--red)]"
            title="Delete"
          >
            <TrashIcon size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Supplier Orders"
        actions={
          <Button variant="primary" onClick={openCreate}>
            <PlusIcon size={16} /> Add Supplier Order
          </Button>
        }
      />

      <FilterBar
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Search by order #, supplier, or customer...",
        }}
      />

      <Table
        columns={columns}
        rows={filtered}
        onRowClick={openEdit}
        emptyTitle="No supplier orders yet"
        emptyDescription="Add a supplier order to keep purchase details, quotes, and contacts in one place."
      />

      <ConfirmDialog
        open={deletingId !== null}
        title="Delete supplier order?"
        message="This will remove the supplier order record permanently."
        onConfirm={() => {
          if (deletingId) deleteSupplierOrder(deletingId);
          setDeletingId(null);
        }}
        onClose={() => setDeletingId(null)}
      />

      <Modal
        open={isFormOpen}
        onClose={() => {
          setCreating(false);
          setEditingOrder(null);
        }}
        title={editingOrder ? `Edit: ${editingOrder.supplierName} (${editingOrder.orderNumber})` : "Add Supplier Order"}
        size="xl"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setCreating(false);
                setEditingOrder(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editingOrder ? "Save Changes" : "Add Supplier Order"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Order Number"
              name="orderNumber"
              value={form.orderNumber}
              onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
            />
            <Input
              label="Order Date"
              name="orderDate"
              type="date"
              value={form.orderDate}
              onChange={(e) => setForm({ ...form, orderDate: e.target.value })}
            />
            <Input
              label="For Customer (optional)"
              name="relatedCustomer"
              value={form.relatedCustomer ?? ""}
              onChange={(e) => setForm({ ...form, relatedCustomer: e.target.value })}
            />
          </div>

          <div>
            <p className="text-sm font-medium text-[var(--text)] mb-2">Supplier</p>
            <div className="grid grid-cols-3 gap-4 mb-3">
              <Input
                label="Supplier Name"
                name="supplierName"
                value={form.supplierName}
                onChange={(e) => setForm({ ...form, supplierName: e.target.value })}
              />
              <Input
                label="Contact Name"
                name="supplierContactName"
                value={form.supplierContactName ?? ""}
                onChange={(e) => setForm({ ...form, supplierContactName: e.target.value })}
              />
              <Input
                label="Store / Product URL"
                name="storeUrl"
                value={form.storeUrl ?? ""}
                onChange={(e) => setForm({ ...form, storeUrl: e.target.value })}
              />
              <Input
                label="Phone"
                name="supplierPhone"
                value={form.supplierPhone ?? ""}
                onChange={(e) => setForm({ ...form, supplierPhone: e.target.value })}
              />
              <Input
                label="Email"
                name="supplierEmail"
                value={form.supplierEmail ?? ""}
                onChange={(e) => setForm({ ...form, supplierEmail: e.target.value })}
              />
              <Input
                label="Address"
                name="supplierAddress"
                value={form.supplierAddress ?? ""}
                onChange={(e) => setForm({ ...form, supplierAddress: e.target.value })}
              />
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-[var(--text)] mb-2">Shipping</p>
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Ship From"
                name="shipFrom"
                value={form.shipFrom ?? ""}
                onChange={(e) => setForm({ ...form, shipFrom: e.target.value })}
              />
              <Input
                label="Shipping Method"
                name="shippingMethod"
                value={form.shippingMethod ?? ""}
                onChange={(e) => setForm({ ...form, shippingMethod: e.target.value })}
              />
              <Input
                label="Incoterms"
                name="incoterms"
                value={form.incoterms ?? ""}
                onChange={(e) => setForm({ ...form, incoterms: e.target.value })}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-[var(--text)]">Items</p>
              <Button variant="ghost" onClick={addItem}>
                <PlusIcon size={14} /> Add Item
              </Button>
            </div>
            <div className="space-y-2">
              {form.items.map((item, i) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-end border border-[var(--border)] rounded-[var(--radius-sm)] p-2">
                  <div className="col-span-5">
                    <Input
                      label={i === 0 ? "Product" : undefined}
                      value={item.productName}
                      onChange={(e) => updateItem(i, { productName: e.target.value })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      label={i === 0 ? "Unit $" : undefined}
                      type="number"
                      min={0}
                      step={0.01}
                      value={item.unitPriceUsd}
                      onChange={(e) => updateItem(i, { unitPriceUsd: Number(e.target.value) })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      label={i === 0 ? "Qty" : undefined}
                      type="number"
                      min={0}
                      value={item.qty}
                      onChange={(e) => updateItem(i, { qty: Number(e.target.value) })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      label={i === 0 ? "Line Total $" : undefined}
                      type="number"
                      min={0}
                      step={0.01}
                      value={item.totalUsd}
                      onChange={(e) => updateItem(i, { totalUsd: Number(e.target.value) })}
                    />
                  </div>
                  <div className="col-span-1">
                    <button
                      onClick={() => removeItem(i)}
                      className="p-2 rounded hover:bg-[var(--surface-2)] text-[var(--red)]"
                      title="Remove item"
                    >
                      <TrashIcon size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-[var(--text)] mb-2">Payment</p>
            <div className="grid grid-cols-3 gap-4 mb-3">
              <Input
                label="Item Subtotal (USD)"
                name="itemSubtotalUsd"
                type="number"
                min={0}
                step={0.01}
                value={form.itemSubtotalUsd}
                onChange={(e) => setForm({ ...form, itemSubtotalUsd: Number(e.target.value) })}
              />
              <Input
                label="Shipping Fee (USD)"
                name="shippingFeeUsd"
                type="number"
                min={0}
                step={0.01}
                value={form.shippingFeeUsd}
                onChange={(e) => setForm({ ...form, shippingFeeUsd: Number(e.target.value) })}
              />
              <Input
                label="Total (USD)"
                name="totalUsd"
                type="number"
                min={0}
                step={0.01}
                value={form.totalUsd}
                onChange={(e) => setForm({ ...form, totalUsd: Number(e.target.value) })}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Initial Payment (USD)"
                name="initialPaymentUsd"
                type="number"
                min={0}
                step={0.01}
                value={form.initialPaymentUsd ?? ""}
                onChange={(e) => setForm({ ...form, initialPaymentUsd: e.target.value === "" ? undefined : Number(e.target.value) })}
              />
              <Input
                label="Initial Payment Date"
                name="initialPaymentDate"
                type="date"
                value={form.initialPaymentDate ?? ""}
                onChange={(e) => setForm({ ...form, initialPaymentDate: e.target.value })}
              />
              <Input
                label="Balance Due (USD)"
                name="balanceUsd"
                type="number"
                min={0}
                step={0.01}
                value={form.balanceUsd ?? ""}
                onChange={(e) => setForm({ ...form, balanceUsd: e.target.value === "" ? undefined : Number(e.target.value) })}
              />
            </div>
            <Input
              label="Balance Status"
              name="balanceStatus"
              value={form.balanceStatus ?? ""}
              onChange={(e) => setForm({ ...form, balanceStatus: e.target.value })}
              className="mt-3"
            />
          </div>

          <Textarea
            label="Notes"
            name="notes"
            value={form.notes ?? ""}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>
      </Modal>
    </div>
  );
}
