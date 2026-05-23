"use client";
import React, { useState, useEffect } from "react";
import type { Order, LineItem, TransportType, OrderGoodsStatus, OrderInvoiceStatus } from "@/lib/types";
import { useData } from "@/context/DataProvider";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { LineItemsEditor } from "@/components/ui/LineItemsEditor";
import { formatAUD } from "@/lib/format";
import { lineItemsTotal, lineItemsCost } from "@/lib/calc";
import {
  ORDER_GOODS_STATUSES,
  ORDER_INVOICE_STATUSES,
  TRANSPORT_TYPES,
  getFiscalYear,
} from "@/lib/constants";

interface OrderModalProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
}

function emptyOrder(): Omit<Order, "id"> {
  const now = new Date().toISOString();
  return {
    ref: `#O${Date.now().toString().slice(-4)}`,
    customerId: "",
    goodsStatus: "Pending",
    invoiceStatus: "Need to Invoice",
    transportType: "Agent Sea",
    fy: getFiscalYear(now),
    orderedAt: now.slice(0, 10),
    lineItems: [],
    transportCost: 0,
    amountReceived: 0,
    comments: "",
  };
}

export function OrderModal({ open, onClose, order }: OrderModalProps) {
  const { customers, addOrder, updateOrder } = useData();
  const isEdit = order !== null;

  const [form, setForm] = useState<Omit<Order, "id">>(emptyOrder());

  useEffect(() => {
    if (open) {
      if (order) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _id, ...rest } = order;
        setForm(rest);
      } else {
        setForm(emptyOrder());
      }
    }
  }, [open, order]);

  function handleSubmit() {
    if (!form.customerId) return alert("Please select a customer");
    const withFy = { ...form, fy: getFiscalYear(form.orderedAt) };
    if (isEdit && order) {
      updateOrder({ ...withFy, id: order.id });
    } else {
      addOrder({ ...withFy, id: crypto.randomUUID() });
    }
    onClose();
  }

  const customerOptions = customers.map((c) => ({ value: c.id, label: c.company }));
  const goodsStatusOptions = ORDER_GOODS_STATUSES.map((s) => ({ value: s, label: s }));
  const invoiceStatusOptions = ORDER_INVOICE_STATUSES.map((s) => ({ value: s, label: s }));
  const transportOptions = TRANSPORT_TYPES.map((t) => ({ value: t, label: t }));

  const revenue = lineItemsTotal(form.lineItems);
  const cost = lineItemsCost(form.lineItems) + (form.transportCost ?? 0);
  const expectedProfit = revenue - cost;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? `Edit Order ${order?.ref}` : "New Order"}
      size="xl"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>
            {isEdit ? "Save Changes" : "Create Order"}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Row 1: ref, customer, date */}
        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Order Number"
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
          <Input
            label="Date Ordered"
            name="orderedAt"
            type="date"
            value={form.orderedAt?.slice(0, 10) ?? ""}
            onChange={(e) => setForm({ ...form, orderedAt: e.target.value })}
          />
        </div>

        {/* Row 2: goods status, invoice status, transport type */}
        <div className="grid grid-cols-3 gap-4">
          <Select
            label="Goods Status"
            name="goodsStatus"
            value={form.goodsStatus}
            onChange={(e) => setForm({ ...form, goodsStatus: e.target.value as OrderGoodsStatus })}
            options={goodsStatusOptions}
          />
          <Select
            label="Invoice Status"
            name="invoiceStatus"
            value={form.invoiceStatus}
            onChange={(e) => setForm({ ...form, invoiceStatus: e.target.value as OrderInvoiceStatus })}
            options={invoiceStatusOptions}
          />
          <Select
            label="Transport Type"
            name="transportType"
            value={form.transportType}
            onChange={(e) => setForm({ ...form, transportType: e.target.value as TransportType })}
            options={transportOptions}
          />
        </div>

        {/* Transport cost + amount received */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Transport Cost (AUD)"
            name="transportCost"
            type="number"
            min={0}
            step={0.01}
            value={form.transportCost ?? 0}
            onChange={(e) => setForm({ ...form, transportCost: Number(e.target.value) })}
          />
          <Input
            label="Amount Received (AUD)"
            name="amountReceived"
            type="number"
            min={0}
            step={0.01}
            value={form.amountReceived ?? 0}
            onChange={(e) => setForm({ ...form, amountReceived: Number(e.target.value) })}
          />
        </div>

        {/* Tracking numbers */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Tracking: Agent to K2"
            name="trackingAgentToK2"
            value={form.trackingAgentToK2 ?? ""}
            onChange={(e) => setForm({ ...form, trackingAgentToK2: e.target.value })}
          />
          <Input
            label="Tracking: K2 to Customer"
            name="trackingK2ToCustomer"
            value={form.trackingK2ToCustomer ?? ""}
            onChange={(e) => setForm({ ...form, trackingK2ToCustomer: e.target.value })}
          />
        </div>

        {/* Line Items */}
        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-2">Line Items</label>
          <LineItemsEditor
            items={form.lineItems}
            onChange={(items: LineItem[]) => setForm({ ...form, lineItems: items })}
            showCost
          />
        </div>

        {/* Profit summary */}
        <div
          className="rounded-[var(--radius-sm)] p-4 border"
          style={{
            background: expectedProfit >= 0 ? "var(--green-soft)" : "var(--red-soft)",
            borderColor: expectedProfit >= 0 ? "var(--green)" : "var(--red)",
          }}
        >
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-[var(--text-muted)] text-xs mb-1">Revenue</p>
              <p className="font-semibold" style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>
                {formatAUD(revenue)}
              </p>
            </div>
            <div>
              <p className="text-[var(--text-muted)] text-xs mb-1">Total Cost</p>
              <p className="font-semibold" style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>
                {formatAUD(cost)}
              </p>
            </div>
            <div>
              <p className="text-[var(--text-muted)] text-xs mb-1">Expected Profit</p>
              <p
                className="font-semibold text-lg"
                style={{
                  fontFamily: "var(--font-dm-mono, monospace)",
                  color: expectedProfit >= 0 ? "var(--green)" : "var(--red)",
                }}
              >
                {formatAUD(expectedProfit)}
              </p>
            </div>
          </div>
        </div>

        {/* Comments */}
        <Textarea
          label="Comments"
          name="comments"
          value={form.comments ?? ""}
          onChange={(e) => setForm({ ...form, comments: e.target.value })}
          rows={3}
        />
      </div>
    </Modal>
  );
}
