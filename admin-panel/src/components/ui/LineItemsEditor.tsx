"use client";
import React from "react";
import type { LineItem } from "@/lib/types";
import { formatAUD } from "@/lib/format";
import { Button } from "./Button";
import { PlusIcon, TrashIcon } from "@/components/icons";

interface LineItemsEditorProps {
  items: LineItem[];
  onChange: (items: LineItem[]) => void;
  showCost?: boolean; // show cost per unit column (for orders)
}

export function LineItemsEditor({ items, onChange, showCost = false }: LineItemsEditorProps) {
  function addItem() {
    const newItem: LineItem = {
      id: crypto.randomUUID(),
      description: "",
      qty: 1,
      unitPrice: 0,
      costPerUnit: showCost ? 0 : undefined,
    };
    onChange([...items, newItem]);
  }

  function removeItem(id: string) {
    onChange(items.filter((item) => item.id !== id));
  }

  function updateItem(id: string, field: keyof LineItem, value: string | number) {
    onChange(
      items.map((item) =>
        item.id === id ? { ...item, [field]: field === "description" ? value : Number(value) } : item
      )
    );
  }

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
  const gst = subtotal * 0.1;
  const total = subtotal + gst;

  return (
    <div>
      <div className="overflow-x-auto rounded-[var(--radius-sm)] border border-[var(--border)] mb-3">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr style={{ background: "var(--surface-2)" }}>
              <th className="px-3 py-2 text-left text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">Qty</th>
              <th className="px-3 py-2 text-left text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">Description</th>
              <th className="px-3 py-2 text-right text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">Unit Price</th>
              {showCost && (
                <th className="px-3 py-2 text-right text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">Cost/Unit</th>
              )}
              <th className="px-3 py-2 text-right text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">Line Total</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={showCost ? 6 : 5} className="px-3 py-4 text-center text-[var(--text-muted)] text-sm">
                  No items yet. Click &ldquo;Add Item&rdquo; to start.
                </td>
              </tr>
            )}
            {items.map((item) => (
              <tr key={item.id} className="border-t border-[var(--border)]">
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={1}
                    value={item.qty}
                    onChange={(e) => updateItem(item.id, "qty", e.target.value)}
                    className="w-16 px-2 py-1 rounded border border-[var(--border)] text-sm text-center bg-[var(--surface)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    placeholder="Item description"
                    className="w-full px-2 py-1 rounded border border-[var(--border)] text-sm bg-[var(--surface)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={item.unitPrice}
                    onChange={(e) => updateItem(item.id, "unitPrice", e.target.value)}
                    className="w-24 px-2 py-1 rounded border border-[var(--border)] text-sm text-right bg-[var(--surface)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                  />
                </td>
                {showCost && (
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={item.costPerUnit ?? 0}
                      onChange={(e) => updateItem(item.id, "costPerUnit", e.target.value)}
                      className="w-24 px-2 py-1 rounded border border-[var(--border)] text-sm text-right bg-[var(--surface)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                    />
                  </td>
                )}
                <td className="px-3 py-2 text-right font-[var(--font-dm-mono,monospace)] text-sm">
                  {formatAUD(item.qty * item.unitPrice)}
                </td>
                <td className="px-3 py-2 text-center">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 rounded hover:bg-[var(--red-soft)] text-[var(--text-muted)] hover:text-[var(--red)] transition-colors cursor-pointer border-0 bg-transparent"
                  >
                    <TrashIcon size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="subtle" size="sm" onClick={addItem}>
          <PlusIcon size={14} />
          Add Item
        </Button>

        <div className="text-right space-y-1">
          <div className="text-xs text-[var(--text-muted)]">
            Subtotal: <span className="font-[var(--font-dm-mono,monospace)] text-[var(--text)]">{formatAUD(subtotal)}</span>
          </div>
          <div className="text-xs text-[var(--text-muted)]">
            GST (10%): <span className="font-[var(--font-dm-mono,monospace)] text-[var(--text)]">{formatAUD(gst)}</span>
          </div>
          <div className="text-sm font-semibold text-[var(--text)]">
            Total: <span className="font-[var(--font-dm-mono,monospace)]">{formatAUD(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
