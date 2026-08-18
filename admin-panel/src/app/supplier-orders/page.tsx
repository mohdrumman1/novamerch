"use client";
import React, { useState } from "react";
import { useData } from "@/context/DataProvider";
import { PageHeader } from "@/components/layout/PageHeader";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { FilterBar } from "@/components/ui/FilterBar";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { formatDate } from "@/lib/format";
import type { SupplierOrder, SupplierOrderItem } from "@/lib/types";
import { PlusIcon, EditIcon, TrashIcon } from "@/components/icons";

function formatAUD(amount: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function money(amount: number | undefined, format: (value: number) => string): string {
  return amount === undefined ? "Not recorded" : format(amount);
}

function optionalNumber(value: string): number | undefined {
  return value === "" ? undefined : Number(value);
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
    projectedCostAud: undefined,
    bookedPaymentAud: undefined,
    bookedPaymentDate: "",
    pendingBalanceUsd: undefined,
    pendingBalanceEstimatedAud: undefined,
    paymentStatus: undefined,
    relatedOrderId: undefined,
    relatedCustomerId: undefined,
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
  const {
    supplierOrders,
    customers,
    orders,
    addSupplierOrder,
    updateSupplierOrder,
    deleteSupplierOrder,
  } = useData();
  const [search, setSearch] = useState("");
  const [editingOrder, setEditingOrder] = useState<SupplierOrder | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<SupplierOrder, "id">>(emptyOrder());
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function closeForm() {
    if (saving) return;
    setCreating(false);
    setEditingOrder(null);
    setError(null);
  }

  function openCreate() {
    setForm(emptyOrder());
    setEditingOrder(null);
    setCreating(true);
    setError(null);
  }

  function openEdit(order: SupplierOrder) {
    const { id: _unused, ...rest } = order;
    void _unused;
    setForm(rest);
    setEditingOrder(order);
    setCreating(false);
    setError(null);
  }

  async function handleSubmit() {
    if (!form.supplierName.trim() || !form.orderNumber.trim()) {
      setError("Supplier name and order number are required.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      if (editingOrder) {
        await updateSupplierOrder({ ...form, id: editingOrder.id });
      } else {
        await addSupplierOrder({ ...form, id: crypto.randomUUID() });
      }
      setCreating(false);
      setEditingOrder(null);
    } catch {
      setError("Could not save supplier order. Nothing changed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deletingId) return;

    setDeleting(true);
    setError(null);
    try {
      await deleteSupplierOrder(deletingId);
      setDeletingId(null);
    } catch {
      setError("Could not delete supplier order. Nothing changed.");
    } finally {
      setDeleting(false);
    }
  }

  function updateItem(index: number, patch: Partial<SupplierOrderItem>) {
    const items = form.items.map((item, itemIndex) => (
      itemIndex === index ? { ...item, ...patch } : item
    ));
    setForm({ ...form, items });
  }

  function addItem() {
    setForm({ ...form, items: [...form.items, emptyItem()] });
  }

  function removeItem(index: number) {
    setForm({ ...form, items: form.items.filter((_, itemIndex) => itemIndex !== index) });
  }

  const customerName = (id: string | undefined) => customers.find((customer) => customer.id === id)?.name;
  const filtered = supplierOrders.filter((order) => {
    if (!search) return true;
    const query = search.toLowerCase();
    return (
      order.orderNumber.toLowerCase().includes(query) ||
      order.supplierName.toLowerCase().includes(query) ||
      (customerName(order.relatedCustomerId) ?? "").toLowerCase().includes(query)
    );
  });
  const orderOptions = orders
    .filter((order) => !form.relatedCustomerId || order.customerId === form.relatedCustomerId)
    .map((order) => ({ value: order.id, label: order.ref }));
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
              onClick={(event) => event.stopPropagation()}
              className="text-xs text-[var(--accent)] hover:underline"
              title="Open supplier link"
            >
              link ↗
            </a>
          )}
        </span>
      ),
    },
    {
      key: "relatedCustomerId",
      header: "Customer",
      render: (row: SupplierOrder) => customerName(row.relatedCustomerId) ?? "-",
    },
    {
      key: "projectedCostAud",
      header: "Projected Cost",
      align: "right" as const,
      render: (row: SupplierOrder) => money(row.projectedCostAud, formatAUD),
    },
    {
      key: "bookedPaymentAud",
      header: "Booked Payment",
      align: "right" as const,
      render: (row: SupplierOrder) => money(row.bookedPaymentAud, formatAUD),
    },
    {
      key: "pendingBalanceEstimatedAud",
      header: "Pending Balance",
      align: "right" as const,
      render: (row: SupplierOrder) => money(row.pendingBalanceEstimatedAud, formatAUD),
    },
    {
      key: "actions",
      header: "",
      align: "right" as const,
      render: (row: SupplierOrder) => (
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={(event) => {
              event.stopPropagation();
              openEdit(row);
            }}
            className="p-1.5 rounded hover:bg-[var(--surface-2)] text-[var(--text-muted)]"
            title="Edit"
          >
            <EditIcon size={16} />
          </button>
          <button
            onClick={(event) => {
              event.stopPropagation();
              setDeletingId(row.id);
              setError(null);
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

      {error && <p className="mb-4 text-sm text-[var(--red)]">{error}</p>}

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
        emptyDescription="Add a supplier order to keep purchase details, payments, and links in Airtable."
      />

      <ConfirmDialog
        open={deletingId !== null}
        title="Delete supplier order?"
        message="This will remove the supplier order record permanently."
        onConfirm={handleDelete}
        onClose={() => {
          if (!deleting) setDeletingId(null);
        }}
        loading={deleting}
      />

      <Modal
        open={isFormOpen}
        onClose={closeForm}
        title={editingOrder ? `Edit: ${editingOrder.supplierName} (${editingOrder.orderNumber})` : "Add Supplier Order"}
        size="xl"
        footer={
          <>
            <Button variant="ghost" onClick={closeForm} disabled={saving}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit} loading={saving}>
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
              onChange={(event) => setForm({ ...form, orderNumber: event.target.value })}
            />
            <Input
              label="Order Date"
              name="orderDate"
              type="date"
              value={form.orderDate}
              onChange={(event) => setForm({ ...form, orderDate: event.target.value })}
            />
            <Select
              label="Customer"
              name="relatedCustomerId"
              value={form.relatedCustomerId ?? ""}
              placeholder="No customer"
              options={customers.map((customer) => ({ value: customer.id, label: customer.name }))}
              onChange={(event) => setForm({
                ...form,
                relatedCustomerId: event.target.value || undefined,
                relatedOrderId: event.target.value === form.relatedCustomerId ? form.relatedOrderId : undefined,
              })}
            />
            <Select
              label="Related Order"
              name="relatedOrderId"
              value={form.relatedOrderId ?? ""}
              placeholder="No order"
              options={orderOptions}
              onChange={(event) => {
                const relatedOrder = orders.find((order) => order.id === event.target.value);
                setForm({
                  ...form,
                  relatedOrderId: relatedOrder?.id,
                  relatedCustomerId: relatedOrder?.customerId ?? form.relatedCustomerId,
                });
              }}
            />
          </div>

          <div>
            <p className="text-sm font-medium text-[var(--text)] mb-2">Supplier</p>
            <div className="grid grid-cols-3 gap-4 mb-3">
              <Input label="Supplier Name" name="supplierName" value={form.supplierName} onChange={(event) => setForm({ ...form, supplierName: event.target.value })} />
              <Input label="Contact Name" name="supplierContactName" value={form.supplierContactName ?? ""} onChange={(event) => setForm({ ...form, supplierContactName: event.target.value })} />
              <Input label="Store / Product URL" name="storeUrl" value={form.storeUrl ?? ""} onChange={(event) => setForm({ ...form, storeUrl: event.target.value })} />
              <Input label="Phone" name="supplierPhone" value={form.supplierPhone ?? ""} onChange={(event) => setForm({ ...form, supplierPhone: event.target.value })} />
              <Input label="Email" name="supplierEmail" value={form.supplierEmail ?? ""} onChange={(event) => setForm({ ...form, supplierEmail: event.target.value })} />
              <Input label="Address" name="supplierAddress" value={form.supplierAddress ?? ""} onChange={(event) => setForm({ ...form, supplierAddress: event.target.value })} />
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-[var(--text)] mb-2">Shipping</p>
            <div className="grid grid-cols-3 gap-4">
              <Input label="Ship From" name="shipFrom" value={form.shipFrom ?? ""} onChange={(event) => setForm({ ...form, shipFrom: event.target.value })} />
              <Input label="Shipping Method" name="shippingMethod" value={form.shippingMethod ?? ""} onChange={(event) => setForm({ ...form, shippingMethod: event.target.value })} />
              <Input label="Incoterms" name="incoterms" value={form.incoterms ?? ""} onChange={(event) => setForm({ ...form, incoterms: event.target.value })} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-[var(--text)]">Items</p>
              <Button variant="ghost" onClick={addItem} disabled={saving}>
                <PlusIcon size={14} /> Add Item
              </Button>
            </div>
            <div className="space-y-2">
              {form.items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-end border border-[var(--border)] rounded-[var(--radius-sm)] p-2">
                  <div className="col-span-5"><Input label={index === 0 ? "Product" : undefined} value={item.productName} onChange={(event) => updateItem(index, { productName: event.target.value })} /></div>
                  <div className="col-span-2"><Input label={index === 0 ? "Unit $" : undefined} type="number" min={0} step={0.01} value={item.unitPriceUsd} onChange={(event) => updateItem(index, { unitPriceUsd: Number(event.target.value) })} /></div>
                  <div className="col-span-2"><Input label={index === 0 ? "Qty" : undefined} type="number" min={0} value={item.qty} onChange={(event) => updateItem(index, { qty: Number(event.target.value) })} /></div>
                  <div className="col-span-2"><Input label={index === 0 ? "Line Total $" : undefined} type="number" min={0} step={0.01} value={item.totalUsd} onChange={(event) => updateItem(index, { totalUsd: Number(event.target.value) })} /></div>
                  <div className="col-span-1"><button onClick={() => removeItem(index)} disabled={saving} className="p-2 rounded hover:bg-[var(--surface-2)] text-[var(--red)] disabled:opacity-50" title="Remove item"><TrashIcon size={16} /></button></div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-[var(--text)] mb-2">Supplier Cost and Payment</p>
            <div className="grid grid-cols-3 gap-4 mb-3">
              <Input label="Item Subtotal (USD)" name="itemSubtotalUsd" type="number" min={0} step={0.01} value={form.itemSubtotalUsd} onChange={(event) => setForm({ ...form, itemSubtotalUsd: Number(event.target.value) })} />
              <Input label="Shipping Fee (USD)" name="shippingFeeUsd" type="number" min={0} step={0.01} value={form.shippingFeeUsd} onChange={(event) => setForm({ ...form, shippingFeeUsd: Number(event.target.value) })} />
              <Input label="Supplier Total (USD)" name="totalUsd" type="number" min={0} step={0.01} value={form.totalUsd} onChange={(event) => setForm({ ...form, totalUsd: Number(event.target.value) })} />
              <Input label="Projected Cost (AUD)" name="projectedCostAud" type="number" min={0} step={0.01} value={form.projectedCostAud ?? ""} onChange={(event) => setForm({ ...form, projectedCostAud: optionalNumber(event.target.value) })} />
              <Input label="Booked Payment (AUD)" name="bookedPaymentAud" type="number" min={0} step={0.01} value={form.bookedPaymentAud ?? ""} onChange={(event) => setForm({ ...form, bookedPaymentAud: optionalNumber(event.target.value) })} />
              <Input label="Booked Payment Date" name="bookedPaymentDate" type="date" value={form.bookedPaymentDate ?? ""} onChange={(event) => setForm({ ...form, bookedPaymentDate: event.target.value || undefined })} />
              <Input label="Pending Balance (USD)" name="pendingBalanceUsd" type="number" min={0} step={0.01} value={form.pendingBalanceUsd ?? ""} onChange={(event) => setForm({ ...form, pendingBalanceUsd: optionalNumber(event.target.value) })} />
              <Input label="Pending Balance Estimate (AUD)" name="pendingBalanceEstimatedAud" type="number" min={0} step={0.01} value={form.pendingBalanceEstimatedAud ?? ""} onChange={(event) => setForm({ ...form, pendingBalanceEstimatedAud: optionalNumber(event.target.value) })} />
              <Select label="Payment Status" name="paymentStatus" value={form.paymentStatus ?? ""} placeholder="Not recorded" options={[{ value: "Partially Paid", label: "Partially Paid" }, { value: "Paid", label: "Paid" }]} onChange={(event) => setForm({ ...form, paymentStatus: event.target.value === "Partially Paid" || event.target.value === "Paid" ? event.target.value : undefined })} />
            </div>
          </div>

          <Textarea label="Notes" name="notes" value={form.notes ?? ""} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
        </div>
      </Modal>
    </div>
  );
}
