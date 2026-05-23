"use client";
import React, { useState, useEffect } from "react";
import type { Invoice, InvoiceKind, InvoiceStatus, LineItem } from "@/lib/types";
import { useData } from "@/context/DataProvider";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { LineItemsEditor } from "@/components/ui/LineItemsEditor";
import { formatAUD } from "@/lib/format";
import { gstOf, depositSplit } from "@/lib/calc";
import { INVOICE_STATUSES, INVOICE_KINDS } from "@/lib/constants";

interface InvoiceModalProps {
  open: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

function emptyInvoice(): Omit<Invoice, "id"> {
  const now = new Date();
  const dueDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  return {
    ref: `#INV-${Date.now().toString().slice(-4)}`,
    customerId: "",
    kind: "Full",
    status: "Draft",
    issuedAt: now.toISOString().slice(0, 10),
    dueAt: dueDate.toISOString().slice(0, 10),
    subtotal: 0,
    gst: 0,
    total: 0,
    amountReceived: 0,
    lineItems: [],
    comments: "",
  };
}

export function InvoiceModal({ open, onClose, invoice }: InvoiceModalProps) {
  const { customers, orders, addInvoice, updateInvoice } = useData();
  const isEdit = invoice !== null;

  const [form, setForm] = useState<Omit<Invoice, "id">>(emptyInvoice());
  const [depositPct, setDepositPct] = useState(50);
  const [linkedOrderId, setLinkedOrderId] = useState("");
  const [createPair, setCreatePair] = useState(false);

  useEffect(() => {
    if (open) {
      if (invoice) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _id, ...rest } = invoice;
        setForm(rest);
        // Try to find linked order
        setLinkedOrderId(rest.orderId ?? "");
      } else {
        setForm(emptyInvoice());
        setDepositPct(50);
        setLinkedOrderId("");
        setCreatePair(false);
      }
    }
  }, [open, invoice]);

  // Recalculate totals from line items
  function handleLineItemsChange(items: LineItem[]) {
    const subtotal = items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
    const gst = gstOf(subtotal);
    const total = subtotal + gst;
    setForm((prev) => ({ ...prev, lineItems: items, subtotal, gst, total }));
  }

  // When kind changes to Deposit, apply deposit percentage to total
  function handleKindChange(kind: InvoiceKind) {
    if (kind === "Deposit" && form.subtotal > 0) {
      const { deposit } = depositSplit(form.subtotal, depositPct);
      const depositGst = gstOf(deposit);
      setForm((prev) => ({ ...prev, kind, subtotal: deposit, gst: depositGst, total: deposit + depositGst }));
    } else {
      setForm((prev) => ({ ...prev, kind }));
    }
  }

  function handleSubmit() {
    if (!form.customerId) return alert("Please select a customer");

    if (isEdit && invoice) {
      updateInvoice({ ...form, id: invoice.id });
    } else {
      const newId = crypto.randomUUID();

      if (form.kind === "Deposit" && createPair) {
        // Create paired Final invoice
        const finalId = crypto.randomUUID();
        const depositSubtotal = form.subtotal;
        const remaining = form.subtotal / (depositPct / 100) - depositSubtotal;
        const finalGst = gstOf(remaining);

        const depositInvoice: Invoice = {
          ...form,
          id: newId,
          pairedInvoiceId: finalId,
          ref: form.ref,
        };
        const finalInvoice: Invoice = {
          ...form,
          id: finalId,
          ref: form.ref.replace("Deposit", "Final").replace(/#INV-(\d+)/, "#INV-$1-Final"),
          kind: "Final",
          pairedInvoiceId: newId,
          subtotal: remaining,
          gst: finalGst,
          total: remaining + finalGst,
          status: "Draft",
        };
        addInvoice(depositInvoice);
        addInvoice(finalInvoice);
      } else {
        addInvoice({ ...form, id: newId });
      }
    }
    onClose();
  }

  const customerOptions = customers.map((c) => ({ value: c.id, label: c.company }));
  const statusOptions = INVOICE_STATUSES.map((s) => ({ value: s, label: s }));
  const kindOptions = INVOICE_KINDS.map((k) => ({ value: k, label: k }));
  const orderOptions = [
    { value: "", label: "None" },
    ...orders.map((o) => ({ value: o.id, label: o.ref })),
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? `Edit Invoice ${invoice?.ref}` : "New Invoice"}
      size="xl"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>
            {isEdit ? "Save Changes" : "Create Invoice"}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Row 1 */}
        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Invoice Number"
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
            label="Linked Order"
            name="orderId"
            value={linkedOrderId}
            onChange={(e) => {
              setLinkedOrderId(e.target.value);
              setForm({ ...form, orderId: e.target.value || undefined });
            }}
            options={orderOptions}
          />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-3 gap-4">
          <Select
            label="Kind"
            name="kind"
            value={form.kind}
            onChange={(e) => handleKindChange(e.target.value as InvoiceKind)}
            options={kindOptions}
          />
          <Select
            label="Status"
            name="status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as InvoiceStatus })}
            options={statusOptions}
          />
          {form.status === "Paid" && (
            <Input
              label="Date Paid"
              name="paidAt"
              type="date"
              value={form.paidAt?.slice(0, 10) ?? ""}
              onChange={(e) => setForm({ ...form, paidAt: e.target.value })}
            />
          )}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Issue Date"
            name="issuedAt"
            type="date"
            value={form.issuedAt?.slice(0, 10) ?? ""}
            onChange={(e) => setForm({ ...form, issuedAt: e.target.value })}
          />
          <Input
            label="Due Date"
            name="dueAt"
            type="date"
            value={form.dueAt?.slice(0, 10) ?? ""}
            onChange={(e) => setForm({ ...form, dueAt: e.target.value })}
          />
        </div>

        {/* Deposit options */}
        {form.kind === "Deposit" && !isEdit && (
          <div
            className="rounded-[var(--radius-sm)] p-3 border"
            style={{ background: "var(--blue-soft)", borderColor: "var(--blue)" }}
          >
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-[var(--text)]">
                Deposit Percentage:
              </label>
              <input
                type="number"
                min={1}
                max={99}
                value={depositPct}
                onChange={(e) => setDepositPct(Number(e.target.value))}
                className="w-20 px-2 py-1 text-sm rounded border border-[var(--border)] bg-[var(--surface)] focus:outline-none"
              />
              <span className="text-sm text-[var(--text-muted)]">%</span>
              <label className="flex items-center gap-2 text-sm cursor-pointer ml-auto">
                <input
                  type="checkbox"
                  checked={createPair}
                  onChange={(e) => setCreatePair(e.target.checked)}
                  className="cursor-pointer"
                />
                Auto-create paired Final invoice
              </label>
            </div>
          </div>
        )}

        {/* Line Items */}
        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-2">Line Items</label>
          <LineItemsEditor items={form.lineItems} onChange={handleLineItemsChange} />
        </div>

        {/* Amount received */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Amount Received (AUD)"
            name="amountReceived"
            type="number"
            min={0}
            step={0.01}
            value={form.amountReceived ?? 0}
            onChange={(e) => setForm({ ...form, amountReceived: Number(e.target.value) })}
          />
          <div className="flex flex-col justify-end pb-1">
            <p className="text-xs text-[var(--text-muted)]">Outstanding</p>
            <p className="text-lg font-semibold" style={{ fontFamily: "var(--font-dm-mono, monospace)", color: "var(--orange)" }}>
              {formatAUD(Math.max(0, form.total - (form.amountReceived ?? 0)))}
            </p>
          </div>
        </div>

        {/* Comments */}
        <Textarea
          label="Comments"
          name="comments"
          value={form.comments ?? ""}
          onChange={(e) => setForm({ ...form, comments: e.target.value })}
          rows={2}
        />
      </div>
    </Modal>
  );
}
