"use client";
import React, { useState, useEffect } from "react";
import type { Quote, LineItem } from "@/lib/types";
import { useData } from "@/context/DataProvider";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { LineItemsEditor } from "@/components/ui/LineItemsEditor";
import { QUOTE_STATUSES } from "@/lib/constants";

interface QuoteModalProps {
  open: boolean;
  onClose: () => void;
  quote: Quote | null; // null = create mode
}

const DEFAULT_COMMENTS =
  "Please note all prices include sea freight. Please allow up to 60 days from time of purchase.";

function emptyQuote(): Omit<Quote, "id"> {
  return {
    ref: `#Q${Date.now().toString().slice(-4)}`,
    customerId: "",
    status: "Draft",
    issuedAt: new Date().toISOString().slice(0, 10),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    lineItems: [],
    freightCost: 0,
    comments: DEFAULT_COMMENTS,
  };
}

export function QuoteModal({ open, onClose, quote }: QuoteModalProps) {
  const { customers, addQuote, updateQuote } = useData();
  const isEdit = quote !== null;

  const [form, setForm] = useState<Omit<Quote, "id">>(emptyQuote());

  useEffect(() => {
    if (open) {
      if (quote) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _id, ...rest } = quote;
        setForm(rest);
      } else {
        setForm(emptyQuote());
      }
    }
  }, [open, quote]);

  function handleSubmit() {
    if (!form.customerId) return alert("Please select a customer");
    if (isEdit && quote) {
      updateQuote({ ...form, id: quote.id });
    } else {
      addQuote({ ...form, id: crypto.randomUUID() });
    }
    onClose();
  }

  const customerOptions = customers.map((c) => ({ value: c.id, label: c.company }));
  const statusOptions = QUOTE_STATUSES.map((s) => ({ value: s, label: s }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? `Edit Quote ${quote?.ref}` : "New Quote"}
      size="xl"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>
            {isEdit ? "Save Changes" : "Create Quote"}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Row 1: ref, customer, status */}
        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Quote Number"
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
            label="Status"
            name="status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as Quote["status"] })}
            options={statusOptions}
          />
        </div>

        {/* Row 2: dates, freight */}
        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Issue Date"
            name="issuedAt"
            type="date"
            value={form.issuedAt?.slice(0, 10) ?? ""}
            onChange={(e) => setForm({ ...form, issuedAt: e.target.value })}
          />
          <Input
            label="Valid Until"
            name="validUntil"
            type="date"
            value={form.validUntil?.slice(0, 10) ?? ""}
            onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
          />
          <Input
            label="Freight Cost (AUD)"
            name="freightCost"
            type="number"
            min={0}
            step={0.01}
            value={form.freightCost ?? 0}
            onChange={(e) => setForm({ ...form, freightCost: Number(e.target.value) })}
          />
        </div>

        {/* Line Items */}
        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-2">Line Items</label>
          <LineItemsEditor
            items={form.lineItems}
            onChange={(items: LineItem[]) => setForm({ ...form, lineItems: items })}
          />
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
