"use client";
import React, { useState, useEffect } from "react";
import type { Shipment, ShipmentItem, ShipmentStatus, ShippingMethod } from "@/lib/types";
import { useData } from "@/context/DataProvider";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { SHIPMENT_STATUSES, SHIPPING_METHODS } from "@/lib/constants";
import { PlusIcon, TrashIcon } from "@/components/icons";

interface ShipmentModalProps {
  open: boolean;
  onClose: () => void;
  shipment: Shipment | null;
}

function emptyShipment(): Omit<Shipment, "id"> {
  return {
    ref: `#SHP-${Date.now().toString().slice(-4)}`,
    customerId: "",
    status: "In Transit",
    shippingMethod: "Agent Sea",
    items: [],
    notes: "",
  };
}

export function ShipmentModal({ open, onClose, shipment }: ShipmentModalProps) {
  const { customers, orders, addShipment, updateShipment } = useData();
  const isEdit = shipment !== null;

  const [form, setForm] = useState<Omit<Shipment, "id">>(emptyShipment());
  const [newItemDesc, setNewItemDesc] = useState("");
  const [newItemQty, setNewItemQty] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState("");

  useEffect(() => {
    if (open) {
      if (shipment) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _id, ...rest } = shipment;
        setForm(rest);
        setSelectedOrderId(rest.orderId ?? "");
      } else {
        setForm(emptyShipment());
        setSelectedOrderId("");
        setNewItemDesc("");
        setNewItemQty(1);
      }
    }
  }, [open, shipment]);

  function addItem() {
    if (!newItemDesc.trim()) return;
    const item: ShipmentItem = { description: newItemDesc.trim(), qty: newItemQty };
    setForm((prev) => ({ ...prev, items: [...prev.items, item] }));
    setNewItemDesc("");
    setNewItemQty(1);
  }

  function removeItem(index: number) {
    setForm((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  }

  function addAllFromOrder() {
    if (!selectedOrderId) return;
    const order = orders.find((o) => o.id === selectedOrderId);
    if (!order) return;
    const orderItems: ShipmentItem[] = order.lineItems.map((li) => ({
      description: li.description,
      qty: li.qty,
      orderId: order.id,
    }));
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, ...orderItems],
      orderId: selectedOrderId,
      customerId: order.customerId,
    }));
  }

  function handleSubmit() {
    if (!form.customerId) return alert("Please select a customer");
    const withOrder = { ...form, orderId: selectedOrderId || undefined };
    if (isEdit && shipment) {
      updateShipment({ ...withOrder, id: shipment.id });
    } else {
      addShipment({ ...withOrder, id: crypto.randomUUID() });
    }
    onClose();
  }

  const customerOptions = customers.map((c) => ({ value: c.id, label: c.company }));
  const statusOptions = SHIPMENT_STATUSES.map((s) => ({ value: s, label: s }));
  const methodOptions = SHIPPING_METHODS.map((m) => ({ value: m, label: m }));
  const orderOptions = [
    { value: "", label: "None" },
    ...orders.map((o) => ({ value: o.id, label: o.ref })),
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? `Edit Shipment ${shipment?.ref}` : "New Shipment"}
      size="xl"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>
            {isEdit ? "Save Changes" : "Create Shipment"}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Row 1 */}
        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Shipment Number"
            name="ref"
            value={form.ref}
            onChange={(e) => setForm({ ...form, ref: e.target.value })}
          />
          <Select
            label="Customer"
            name="customerId"
            value={form.customerId}
            onChange={(e) => setForm({ ...form, customerId: e.target.value })}
            options={customerOptions}
            placeholder="Select customer..."
          />
          <Select
            label="Shipping Method"
            name="shippingMethod"
            value={form.shippingMethod}
            onChange={(e) => setForm({ ...form, shippingMethod: e.target.value as ShippingMethod })}
            options={methodOptions}
          />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-3 gap-4">
          <Select
            label="Status"
            name="status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as ShipmentStatus })}
            options={statusOptions}
          />
          <Input
            label="Date Shipped"
            name="shippedAt"
            type="date"
            value={form.shippedAt?.slice(0, 10) ?? ""}
            onChange={(e) => setForm({ ...form, shippedAt: e.target.value })}
          />
          <Input
            label="Expected Arrival"
            name="expectedArrival"
            type="date"
            value={form.expectedArrival?.slice(0, 10) ?? ""}
            onChange={(e) => setForm({ ...form, expectedArrival: e.target.value })}
          />
        </div>

        {/* Tracking */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Agent to K2 Tracking"
            name="trackingAgentToK2"
            value={form.trackingAgentToK2 ?? ""}
            onChange={(e) => setForm({ ...form, trackingAgentToK2: e.target.value })}
          />
          <Input
            label="Supplier to Agent Tracking"
            name="trackingSupplierToAgent"
            value={form.trackingSupplierToAgent ?? ""}
            onChange={(e) => setForm({ ...form, trackingSupplierToAgent: e.target.value })}
          />
        </div>

        {/* Link order and add items */}
        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-2">Packing List Items</label>
          <div className="flex gap-3 mb-3">
            <select
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
              className="flex-1 px-3 py-2 text-sm rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] focus:outline-none cursor-pointer"
            >
              {orderOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <Button variant="subtle" size="sm" onClick={addAllFromOrder} disabled={!selectedOrderId}>
              Add All from Order
            </Button>
          </div>

          {/* Items list */}
          <div className="rounded-[var(--radius-sm)] border border-[var(--border)] overflow-hidden mb-3">
            {form.items.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-[var(--text-muted)]">
                No items in packing list yet.
              </div>
            ) : (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr style={{ background: "var(--surface-2)" }}>
                    <th className="px-3 py-2 text-left text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">Qty</th>
                    <th className="px-3 py-2 text-left text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">Description</th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {form.items.map((item, index) => (
                    <tr key={index} className="border-t border-[var(--border)]">
                      <td className="px-3 py-2 font-mono text-sm w-16">{item.qty}</td>
                      <td className="px-3 py-2">{item.description}</td>
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => removeItem(index)}
                          className="p-1 rounded hover:bg-[var(--red-soft)] text-[var(--text-muted)] hover:text-[var(--red)] transition-colors cursor-pointer border-0 bg-transparent"
                        >
                          <TrashIcon size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Add item manually */}
          <div className="flex gap-2">
            <input
              type="number"
              min={1}
              value={newItemQty}
              onChange={(e) => setNewItemQty(Number(e.target.value))}
              className="w-20 px-2 py-2 text-sm rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] focus:outline-none text-center"
            />
            <input
              type="text"
              value={newItemDesc}
              onChange={(e) => setNewItemDesc(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") addItem(); }}
              placeholder="Item description"
              className="flex-1 px-3 py-2 text-sm rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] focus:outline-none"
            />
            <Button variant="subtle" size="sm" onClick={addItem}>
              <PlusIcon size={14} /> Add
            </Button>
          </div>
        </div>

        {/* Notes */}
        <Textarea
          label="Notes"
          name="notes"
          value={form.notes ?? ""}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          rows={2}
        />
      </div>
    </Modal>
  );
}
