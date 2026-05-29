"use client";
import React, { useState } from "react";
import { useData } from "@/context/DataProvider";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs } from "@/components/ui/Tabs";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { FilterBar } from "@/components/ui/FilterBar";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { formatAUD } from "@/lib/format";
import { volWeight, chargeableWeight, getShippingRate } from "@/lib/calc";
import { GOOD_CATEGORIES } from "@/lib/constants";
import type { Good } from "@/lib/types";
import { PlusIcon, EditIcon, TrashIcon } from "@/components/icons";

const TABS = [
  { key: "catalogue", label: "Catalogue" },
  { key: "calculator", label: "Quote Calculator" },
];

function emptyGood(): Omit<Good, "id"> {
  return {
    sku: "",
    name: "",
    category: "Promotional",
    costUsd: 0,
    logoFee: 0,
    minQty: 24,
    widthCm: 0,
    lengthCm: 0,
    depthCm: 0,
    weightKg: 0,
    qtyPerCarton: 1,
  };
}

export default function GoodsPage() {
  const { goods, settings, addGood, updateGood, deleteGood } = useData();
  const [activeTab, setActiveTab] = useState("catalogue");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [editingGood, setEditingGood] = useState<Good | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Good, "id">>(emptyGood());

  function openCreate() {
    setForm(emptyGood());
    setEditingGood(null);
    setCreating(true);
  }

  function openEdit(good: Good) {
    const { id: _unused, ...rest } = good;
    void _unused;
    setForm(rest);
    setEditingGood(good);
    setCreating(false);
  }

  function handleSubmit() {
    if (!form.name.trim()) return alert("Product name is required");
    if (editingGood) {
      updateGood({ ...form, id: editingGood.id });
    } else {
      addGood({ ...form, id: crypto.randomUUID() });
    }
    setCreating(false);
    setEditingGood(null);
  }

  const filtered = goods.filter((g) => {
    const matchCat = categoryFilter === "All" || g.category === categoryFilter;
    const matchSearch =
      !search ||
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.sku.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const [inlineEdit, setInlineEdit] = useState<{ id: string; field: string; value: string } | null>(null);

  const costAud = (g: Good) => g.costUsd * settings.usdToAud;
  const volWt = (g: Good) => volWeight(g.widthCm, g.lengthCm, g.depthCm);

  const columns = [
    { key: "sku", header: "SKU", sortable: true },
    { key: "name", header: "Product Name", sortable: true },
    { key: "category", header: "Category" },
    {
      key: "costUsd",
      header: "Cost (AUD)",
      align: "right" as const,
      render: (row: Good) => {
        const isEditing = inlineEdit?.id === row.id && inlineEdit?.field === "costUsd";
        if (isEditing) {
          return (
            <input
              type="number"
              autoFocus
              defaultValue={row.costUsd}
              onBlur={(e) => {
                updateGood({ ...row, costUsd: Number(e.target.value) });
                setInlineEdit(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                if (e.key === "Escape") setInlineEdit(null);
              }}
              className="w-24 px-2 py-1 rounded border border-[var(--accent)] bg-[var(--surface)] text-sm text-right focus:outline-none"
              style={{ fontFamily: "var(--font-dm-mono, monospace)" }}
            />
          );
        }
        return (
          <span
            onClick={() => setInlineEdit({ id: row.id, field: "costUsd", value: String(row.costUsd) })}
            className="cursor-pointer hover:bg-[var(--surface-2)] px-1 py-0.5 rounded transition-colors"
            style={{ fontFamily: "var(--font-dm-mono, monospace)" }}
            title="Click to edit"
          >
            {formatAUD(costAud(row))}
          </span>
        );
      },
    },
    {
      key: "logoFee",
      header: "Logo Fee",
      align: "right" as const,
      render: (row: Good) => {
        const isEditing = inlineEdit?.id === row.id && inlineEdit?.field === "logoFee";
        if (isEditing) {
          return (
            <input
              type="number"
              autoFocus
              defaultValue={row.logoFee}
              onBlur={(e) => {
                updateGood({ ...row, logoFee: Number(e.target.value) });
                setInlineEdit(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                if (e.key === "Escape") setInlineEdit(null);
              }}
              className="w-24 px-2 py-1 rounded border border-[var(--accent)] bg-[var(--surface)] text-sm text-right focus:outline-none"
              style={{ fontFamily: "var(--font-dm-mono, monospace)" }}
            />
          );
        }
        return (
          <span
            onClick={() => setInlineEdit({ id: row.id, field: "logoFee", value: String(row.logoFee) })}
            className="cursor-pointer hover:bg-[var(--surface-2)] px-1 py-0.5 rounded transition-colors"
            style={{ fontFamily: "var(--font-dm-mono, monospace)" }}
            title="Click to edit"
          >
            {formatAUD(row.logoFee)}
          </span>
        );
      },
    },
    {
      key: "minQty",
      header: "Min Qty",
      align: "center" as const,
      render: (row: Good) => {
        const isEditing = inlineEdit?.id === row.id && inlineEdit?.field === "minQty";
        if (isEditing) {
          return (
            <input
              type="number"
              autoFocus
              defaultValue={row.minQty}
              onBlur={(e) => {
                updateGood({ ...row, minQty: Number(e.target.value) });
                setInlineEdit(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                if (e.key === "Escape") setInlineEdit(null);
              }}
              className="w-20 px-2 py-1 rounded border border-[var(--accent)] bg-[var(--surface)] text-sm text-center focus:outline-none"
              style={{ fontFamily: "var(--font-dm-mono, monospace)" }}
            />
          );
        }
        return (
          <span
            onClick={() => setInlineEdit({ id: row.id, field: "minQty", value: String(row.minQty) })}
            className="cursor-pointer hover:bg-[var(--surface-2)] px-1 py-0.5 rounded transition-colors"
            style={{ fontFamily: "var(--font-dm-mono, monospace)" }}
            title="Click to edit"
          >
            {row.minQty}
          </span>
        );
      },
    },
    {
      key: "weightKg",
      header: "Weight",
      align: "right" as const,
      render: (row: Good) => `${row.weightKg}kg`,
    },
    {
      key: "volWt",
      header: "Vol. Wt",
      align: "right" as const,
      render: (row: Good) => `${volWt(row).toFixed(2)}kg`,
    },
    {
      key: "qtyPerCarton",
      header: "Qty/CTN",
      align: "center" as const,
    },
    {
      key: "actions",
      header: "",
      align: "right" as const,
      render: (row: Good) => (
        <div
          className="flex items-center gap-2 justify-end"
          onClick={(e) => e.stopPropagation()}
        >
          <Button variant="subtle" size="compact" onClick={() => openEdit(row)}>
            <EditIcon size={13} /> Edit
          </Button>
          <Button
            variant="subtle"
            size="compact"
            onClick={() => {
              const { id: _unused, ...rest } = row;
              void _unused;
              addGood({
                ...rest,
                id: crypto.randomUUID(),
                name: `${row.name} (Copy)`,
                sku: `${row.sku}-2`,
              });
            }}
          >
            Copy
          </Button>
          <Button
            variant="danger"
            size="compact"
            onClick={() => setDeletingId(row.id)}
          >
            <TrashIcon size={13} />
          </Button>
        </div>
      ),
    },
  ];

  // ── Auto-calculated fields in form ────────────────────────────────────
  const formVolWt = volWeight(form.widthCm, form.lengthCm, form.depthCm);
  const formChargeWt = chargeableWeight(
    form.weightKg,
    form.widthCm,
    form.lengthCm,
    form.depthCm
  );
  const formCostAud = form.costUsd * settings.usdToAud;

  const seaRate = getShippingRate(formChargeWt, settings.seaRates);
  const airRate = getShippingRate(formChargeWt, settings.airRates);
  const seaShip = formChargeWt * seaRate * settings.usdToAud;
  const airShip = formChargeWt * airRate * settings.usdToAud;
  const seaTotal = formCostAud + form.logoFee + seaShip;
  const airTotal = formCostAud + form.logoFee + airShip;

  const isFormOpen = creating || editingGood !== null;

  return (
    <div>
      <PageHeader
        title="Goods"
        actions={
          activeTab === "catalogue" ? (
            <Button variant="primary" onClick={openCreate}>
              <PlusIcon size={16} /> Add Product
            </Button>
          ) : undefined
        }
      />

      <Tabs
        tabs={TABS}
        activeTab={activeTab}
        onChange={setActiveTab}
        className="mb-6 max-w-xs"
      />

      {activeTab === "catalogue" && (
        <div>
          {/* Stat cards */}
          <div
            className="grid gap-4 mb-5"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            }}
          >
            <div className="bg-[var(--surface)] rounded-[var(--radius)] border border-[var(--border)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Total Products
              </p>
              <p
                className="text-2xl font-semibold"
                style={{ fontFamily: "var(--font-dm-mono, monospace)" }}
              >
                {goods.length}
              </p>
            </div>
            <div className="bg-[var(--surface)] rounded-[var(--radius)] border border-[var(--border)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                USD/AUD Rate
              </p>
              <p
                className="text-2xl font-semibold"
                style={{ fontFamily: "var(--font-dm-mono, monospace)" }}
              >
                {settings.usdToAud.toFixed(2)}
              </p>
            </div>
            <div className="bg-[var(--surface)] rounded-[var(--radius)] border border-[var(--border)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Sea Rate (11kg+)
              </p>
              <p
                className="text-2xl font-semibold"
                style={{ fontFamily: "var(--font-dm-mono, monospace)" }}
              >
                ${settings.seaRates[0]?.rateUsdPerKg ?? "—"}/kg USD
              </p>
            </div>
            <div className="bg-[var(--surface)] rounded-[var(--radius)] border border-[var(--border)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Air Rate (11kg+)
              </p>
              <p
                className="text-2xl font-semibold"
                style={{ fontFamily: "var(--font-dm-mono, monospace)" }}
              >
                ${settings.airRates[0]?.rateUsdPerKg ?? "—"}/kg USD
              </p>
            </div>
          </div>

          <div className="bg-[var(--surface)] rounded-[var(--radius)] border border-[var(--border)] p-5">
            <FilterBar
              search={{
                value: search,
                onChange: setSearch,
                placeholder: "Search products...",
              }}
              filters={[
                {
                  label: "Category",
                  value: categoryFilter,
                  onChange: setCategoryFilter,
                  options: [
                    { value: "All", label: "All Categories" },
                    ...GOOD_CATEGORIES.map((c) => ({ value: c, label: c })),
                  ],
                },
              ]}
            />
            <Table
              columns={columns}
              rows={filtered}
              onRowClick={(row) => openEdit(row)}
              emptyTitle="No products found"
              emptyDescription="Add your first product to the catalogue."
            />
          </div>
        </div>
      )}

      {activeTab === "calculator" && <QuoteCalculator />}

      {/* Create / Edit Modal */}
      <Modal
        open={isFormOpen}
        onClose={() => {
          setCreating(false);
          setEditingGood(null);
        }}
        title={editingGood ? `Edit: ${editingGood.name}` : "Add Product"}
        size="xl"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setCreating(false);
                setEditingGood(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editingGood ? "Save Changes" : "Add Product"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="SKU"
              name="sku"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
            />
            <Input
              label="Product Name"
              name="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Select
              label="Category"
              name="category"
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value as Good["category"],
                })
              }
              options={GOOD_CATEGORIES.map((c) => ({ value: c, label: c }))}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Cost (USD)"
              name="costUsd"
              type="number"
              min={0}
              step={0.01}
              value={form.costUsd}
              onChange={(e) =>
                setForm({ ...form, costUsd: Number(e.target.value) })
              }
            />
            <Input
              label="Logo/Setup Fee (AUD)"
              name="logoFee"
              type="number"
              min={0}
              step={0.01}
              value={form.logoFee}
              onChange={(e) =>
                setForm({ ...form, logoFee: Number(e.target.value) })
              }
            />
            <Input
              label="Minimum Qty"
              name="minQty"
              type="number"
              min={1}
              value={form.minQty}
              onChange={(e) =>
                setForm({ ...form, minQty: Number(e.target.value) })
              }
            />
          </div>

          <div>
            <p className="text-sm font-medium text-[var(--text)] mb-2">
              Package Dimensions
            </p>
            <div className="grid grid-cols-5 gap-3">
              <Input
                label="Width (cm)"
                name="widthCm"
                type="number"
                min={0}
                step={0.1}
                value={form.widthCm}
                onChange={(e) =>
                  setForm({ ...form, widthCm: Number(e.target.value) })
                }
              />
              <Input
                label="Length (cm)"
                name="lengthCm"
                type="number"
                min={0}
                step={0.1}
                value={form.lengthCm}
                onChange={(e) =>
                  setForm({ ...form, lengthCm: Number(e.target.value) })
                }
              />
              <Input
                label="Depth (cm)"
                name="depthCm"
                type="number"
                min={0}
                step={0.1}
                value={form.depthCm}
                onChange={(e) =>
                  setForm({ ...form, depthCm: Number(e.target.value) })
                }
              />
              <Input
                label="Weight (kg)"
                name="weightKg"
                type="number"
                min={0}
                step={0.001}
                value={form.weightKg}
                onChange={(e) =>
                  setForm({ ...form, weightKg: Number(e.target.value) })
                }
              />
              <Input
                label="Qty/Carton"
                name="qtyPerCarton"
                type="number"
                min={1}
                value={form.qtyPerCarton}
                onChange={(e) =>
                  setForm({ ...form, qtyPerCarton: Number(e.target.value) })
                }
              />
            </div>
          </div>

          {/* Auto-calculated preview */}
          <div className="grid grid-cols-2 gap-4">
            <div
              className="rounded-[var(--radius-sm)] p-3 border border-[var(--border)]"
              style={{ background: "var(--green-soft)" }}
            >
              <p className="text-xs text-[var(--text-muted)] mb-2 font-semibold uppercase tracking-wide">
                Cost Preview (per unit, 1 CTN)
              </p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Cost AUD:</span>
                  <span
                    style={{ fontFamily: "var(--font-dm-mono, monospace)" }}
                  >
                    {formatAUD(formCostAud)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Vol. Weight:</span>
                  <span
                    style={{ fontFamily: "var(--font-dm-mono, monospace)" }}
                  >
                    {formVolWt.toFixed(3)}kg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">
                    Chargeable Wt:
                  </span>
                  <span
                    style={{ fontFamily: "var(--font-dm-mono, monospace)" }}
                  >
                    {formChargeWt.toFixed(3)}kg
                  </span>
                </div>
              </div>
            </div>
            <div
              className="rounded-[var(--radius-sm)] p-3 border border-[var(--border)]"
              style={{ background: "var(--blue-soft)" }}
            >
              <p className="text-xs text-[var(--text-muted)] mb-2 font-semibold uppercase tracking-wide">
                Estimated Total (1 CTN)
              </p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Sea Total:</span>
                  <span
                    style={{
                      fontFamily: "var(--font-dm-mono, monospace)",
                      color: "var(--blue)",
                    }}
                  >
                    {formatAUD(seaTotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Air Total:</span>
                  <span
                    style={{
                      fontFamily: "var(--font-dm-mono, monospace)",
                      color: "var(--orange)",
                    }}
                  >
                    {formatAUD(airTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) {
            deleteGood(deletingId);
            setDeletingId(null);
          }
        }}
        title="Delete Product"
        message="Are you sure you want to delete this product from the catalogue?"
      />
    </div>
  );
}

// ── Quote Calculator sub-component ─────────────────────────────────────────

function QuoteCalculator() {
  const { goods, settings } = useData();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [sellPrices, setSellPrices] = useState<Record<string, { sea: number; air: number }>>({});
  const [profitMargin, setProfitMargin] = useState(30);    // percent, e.g. 30
  const [shippingBuffer, setShippingBuffer] = useState(1.10);
  const [alibabaFee, setAlibabaFee] = useState(1.03);
  const [goodsBuffer, setGoodsBuffer] = useState(1.03);
  const [supplierFreight, setSupplierFreight] = useState(0);

  const marginFrac = profitMargin / 100;

  function setQty(id: string, qty: number) {
    setQuantities(prev => ({ ...prev, [id]: qty }));
    // Reset sell price override when qty changes
    setSellPrices(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function volWt(w: number, l: number, d: number): number {
    if (!w || !l || !d) return 0;
    return parseFloat(((w * l * d) / 6000).toFixed(4));
  }

  function tierLookup(weight: number, rates: { minKg: number; rateUsdPerKg: number }[]): number {
    const sorted = [...rates].sort((a, b) => b.minKg - a.minKg);
    for (const tier of sorted) {
      if (weight >= tier.minKg) return tier.rateUsdPerKg;
    }
    return sorted[sorted.length - 1]?.rateUsdPerKg ?? 0;
  }

  // Calculate base values for one product (no freight share yet)
  function calcRow(g: Good) {
    const qty = quantities[g.id] ?? 0;
    if (qty <= 0) return null;

    const priceAud = g.costUsd * settings.usdToAud;
    const costOfGoods = priceAud * qty + g.logoFee;
    const costOfGoodsBuffered = priceAud * qty * goodsBuffer + g.logoFee;
    const ctns = g.qtyPerCarton > 0 ? qty / g.qtyPerCarton : 0;
    const vw = volWt(g.widthCm, g.lengthCm, g.depthCm);
    const chargeableWtPerCtn = Math.max(g.weightKg, vw);
    const totalWeight = chargeableWtPerCtn * ctns;
    const billableWeight = totalWeight > 0 ? Math.max(totalWeight, 11) : 0;

    const seaRateUsd = tierLookup(totalWeight, settings.seaRates);
    const airRateUsd = tierLookup(totalWeight, settings.airRates);
    const seaRateAud = seaRateUsd * settings.usdToAud;
    const airRateAud = airRateUsd * settings.usdToAud;

    const totalShipSea = billableWeight > 0
      ? (billableWeight * seaRateAud * shippingBuffer) + (alibabaFee * seaRateAud)
      : 0;
    const totalShipAir = seaRateAud > 0
      ? (billableWeight * airRateAud * shippingBuffer) + (alibabaFee * airRateAud)
      : 0;

    return {
      qty, priceAud, costOfGoods, costOfGoodsBuffered, ctns,
      totalWeight, billableWeight, seaRateAud, airRateAud,
      totalShipSea, totalShipAir,
    };
  }

  const activeGoods = goods.filter(g => (quantities[g.id] ?? 0) > 0);

  // Total weight of all active products (for freight share + bulk)
  const totalWeightAll = activeGoods.reduce((sum, g) => {
    const r = calcRow(g);
    return sum + (r?.totalWeight ?? 0);
  }, 0);

  // Full row values with freight share, sell prices, profit
  function calcRowFull(g: Good) {
    const base = calcRow(g);
    if (!base) return null;
    const freightShare = supplierFreight > 0 && totalWeightAll > 0
      ? (base.totalWeight / totalWeightAll) * supplierFreight
      : 0;
    const totalSea = base.totalShipSea + base.costOfGoods + freightShare;
    const totalAir = base.totalShipAir + base.costOfGoods + freightShare;
    const perUnitSea = totalSea > 0 ? totalSea / base.qty : 0;
    const perUnitAir = totalAir > 0 ? totalAir / base.qty : 0;
    const autoSeaSell = perUnitSea > 0
      ? parseFloat((perUnitSea / (1 - marginFrac)).toFixed(2))
      : 0;
    const autoAirSell = perUnitAir > 0
      ? parseFloat((perUnitAir / (1 - marginFrac)).toFixed(2))
      : 0;
    const seaSell = sellPrices[g.id]?.sea ?? autoSeaSell;
    const airSell = sellPrices[g.id]?.air ?? autoAirSell;
    const seaProfitPct = seaSell > 0 ? ((seaSell - perUnitSea) / seaSell) * 100 : 0;
    const airProfitPct = airSell > 0 ? ((airSell - perUnitAir) / airSell) * 100 : 0;
    const seaProfit = (seaSell * base.qty) - totalSea;
    const airProfit = (airSell * base.qty) - totalAir;
    return {
      ...base, freightShare, totalSea, totalAir, perUnitSea, perUnitAir,
      autoSeaSell, autoAirSell, seaSell, airSell,
      seaProfitPct, airProfitPct, seaProfit, airProfit,
    };
  }

  // Bulk shipping
  const bulkSeaRateUsd = tierLookup(totalWeightAll, settings.seaRates);
  const bulkAirRateUsd = tierLookup(totalWeightAll, settings.airRates);
  const bulkSeaRateAud = bulkSeaRateUsd * settings.usdToAud;
  const bulkAirRateAud = bulkAirRateUsd * settings.usdToAud;
  const bulkSeaShip = totalWeightAll > 0
    ? (totalWeightAll * bulkSeaRateAud * shippingBuffer) + (alibabaFee * bulkSeaRateAud)
    : 0;
  const bulkAirShip = totalWeightAll > 0
    ? (totalWeightAll * bulkAirRateAud * shippingBuffer) + (alibabaFee * bulkAirRateAud)
    : 0;
  const totalGoodsAll = activeGoods.reduce((sum, g) => {
    const r = calcRow(g);
    return sum + (r?.costOfGoods ?? 0);
  }, 0);
  const bulkSeaTotal = totalGoodsAll + bulkSeaShip + supplierFreight;
  const bulkAirTotal = totalGoodsAll + bulkAirShip + supplierFreight;
  const indivSeaTotal = activeGoods.reduce((sum, g) => sum + (calcRowFull(g)?.totalSea ?? 0), 0);
  const indivAirTotal = activeGoods.reduce((sum, g) => sum + (calcRowFull(g)?.totalAir ?? 0), 0);
  const seaSavings = indivSeaTotal - bulkSeaTotal;
  const airSavings = indivAirTotal - bulkAirTotal;

  return (
    <div>
      {/* Settings bar */}
      <div className="rounded-[var(--radius)] p-4 mb-5 flex flex-wrap gap-5 items-end"
        style={{ background: "#FFF9E6", border: "1px solid #FFD54F" }}>
        {[
          { label: "Profit Margin %", value: profitMargin, set: setProfitMargin, step: 1, min: 0, max: 90 },
          { label: "Shipping Buffer ×", value: shippingBuffer, set: setShippingBuffer, step: 0.01, min: 1, max: 2 },
          { label: "Alibaba Fee ×", value: alibabaFee, set: setAlibabaFee, step: 0.01, min: 1, max: 2 },
          { label: "Goods Buffer ×", value: goodsBuffer, set: setGoodsBuffer, step: 0.01, min: 1, max: 2 },
          { label: "Supplier Freight AUD", value: supplierFreight, set: setSupplierFreight, step: 1, min: 0, max: 99999 },
        ].map(({ label, value, set, step, min, max }) => (
          <div key={label}>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">{label}</label>
            <input
              type="number" min={min} max={max} step={step} value={value}
              onChange={e => set(Number(e.target.value))}
              className="w-28 px-2 py-1.5 text-sm rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          </div>
        ))}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">USD/AUD</label>
          <input readOnly value={settings.usdToAud.toFixed(4)}
            className="w-24 px-2 py-1.5 text-sm rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-2)] cursor-not-allowed text-[var(--text-muted)]" />
        </div>
        {activeGoods.length > 0 && (
          <div className="ml-auto flex flex-col items-end gap-1">
            <span className="text-xs text-[var(--text-muted)]">{activeGoods.length} product(s) selected</span>
            <Button variant="ghost" size="sm" onClick={() => { setQuantities({}); setSellPrices({}); }} style={{ color: "var(--red)" }}>
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Calculator table */}
      <div className="bg-[var(--surface)] rounded-[var(--radius)] border border-[var(--border)] overflow-x-auto mb-6">
        <table className="text-xs border-collapse" style={{ minWidth: 1400 }}>
          <thead>
            <tr style={{ background: "linear-gradient(135deg, #2d3748 0%, #1a202c 100%)", color: "white" }}>
              {[
                "Product", "Price AUD", "QTY", "Cost of Goods", "Buffered Cost",
                "CTNs", "Weight kg", "Sea Rate", "Air Rate",
                "Ship Sea", "Ship Air", "TOTAL SEA", "TOTAL AIR",
                "Per Unit Sea", "Per Unit Air",
                "SEA SELL $", "Sea %", "AIR SELL $", "Air %",
              ].map(h => (
                <th key={h} className="px-2.5 py-2.5 text-left text-[10px] uppercase tracking-wider font-semibold whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {goods.map(g => {
              const qty = quantities[g.id] ?? 0;
              const isActive = qty > 0;
              const c = isActive ? calcRowFull(g) : null;
              const seaSellVal = c?.seaSell ?? 0;
              const airSellVal = c?.airSell ?? 0;

              return (
                <tr key={g.id} className="border-t border-[var(--border)] transition-colors"
                  style={{ background: isActive ? "var(--green-soft)" : "var(--surface)" }}>
                  <td className="px-2.5 py-2 font-medium whitespace-nowrap max-w-[160px] truncate">{g.name}</td>
                  <td className="px-2.5 py-2" style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>
                    {formatAUD(g.costUsd * settings.usdToAud)}
                  </td>
                  <td className="px-2.5 py-2">
                    <input type="number" min={0} value={qty || ""} placeholder="0"
                      onChange={e => setQty(g.id, Number(e.target.value))}
                      className="w-20 px-1.5 py-1 rounded border text-center text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                      style={{
                        background: isActive ? "white" : "var(--surface-2)",
                        borderColor: isActive ? "var(--accent)" : "var(--border)",
                        fontWeight: isActive ? 600 : 400,
                      }}
                    />
                  </td>
                  <td className="px-2.5 py-2" style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>
                    {c ? formatAUD(c.costOfGoods) : "—"}
                  </td>
                  <td className="px-2.5 py-2" style={{ fontFamily: "var(--font-dm-mono, monospace)", color: "var(--text-muted)" }}>
                    {c ? formatAUD(c.costOfGoodsBuffered) : "—"}
                  </td>
                  <td className="px-2.5 py-2 text-center">{c ? c.ctns.toFixed(1) : "—"}</td>
                  <td className="px-2.5 py-2 text-right">{c ? `${c.totalWeight.toFixed(2)}kg` : "—"}</td>
                  <td className="px-2.5 py-2 text-right" style={{ fontFamily: "var(--font-dm-mono, monospace)", color: "var(--blue)" }}>
                    {c ? `$${c.seaRateAud.toFixed(2)}/kg` : "—"}
                  </td>
                  <td className="px-2.5 py-2 text-right" style={{ fontFamily: "var(--font-dm-mono, monospace)", color: "var(--orange)" }}>
                    {c ? `$${c.airRateAud.toFixed(2)}/kg` : "—"}
                  </td>
                  <td className="px-2.5 py-2" style={{ fontFamily: "var(--font-dm-mono, monospace)", color: "var(--blue)" }}>
                    {c ? formatAUD(c.totalShipSea) : "—"}
                  </td>
                  <td className="px-2.5 py-2" style={{ fontFamily: "var(--font-dm-mono, monospace)", color: "var(--orange)" }}>
                    {c ? formatAUD(c.totalShipAir) : "—"}
                  </td>
                  <td className="px-2.5 py-2 font-semibold" style={{ fontFamily: "var(--font-dm-mono, monospace)", color: "var(--green)" }}>
                    {c ? formatAUD(c.totalSea) : "—"}
                  </td>
                  <td className="px-2.5 py-2 font-semibold" style={{ fontFamily: "var(--font-dm-mono, monospace)", color: "var(--orange)" }}>
                    {c ? formatAUD(c.totalAir) : "—"}
                  </td>
                  <td className="px-2.5 py-2" style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>
                    {c ? formatAUD(c.perUnitSea) : "—"}
                  </td>
                  <td className="px-2.5 py-2" style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>
                    {c ? formatAUD(c.perUnitAir) : "—"}
                  </td>
                  {/* SEA SELL PRICE - editable */}
                  <td className="px-2.5 py-2">
                    {c ? (
                      <input type="number" min={0} step={0.01}
                        value={seaSellVal}
                        onChange={e => setSellPrices(prev => ({ ...prev, [g.id]: { sea: Number(e.target.value), air: prev[g.id]?.air ?? c.autoAirSell } }))}
                        className="w-24 px-1.5 py-1 rounded border text-right text-xs focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                        style={{ background: "#EDFAF3", borderColor: "var(--green)", fontFamily: "var(--font-dm-mono, monospace)", fontWeight: 600 }}
                      />
                    ) : "—"}
                  </td>
                  <td className="px-2.5 py-2 text-center">
                    {c ? (
                      <span className="text-xs font-semibold" style={{ color: c.seaProfitPct >= 0 ? "var(--green)" : "var(--red)" }}>
                        {c.seaProfitPct.toFixed(1)}%
                      </span>
                    ) : "—"}
                  </td>
                  {/* AIR SELL PRICE - editable */}
                  <td className="px-2.5 py-2">
                    {c ? (
                      <input type="number" min={0} step={0.01}
                        value={airSellVal}
                        onChange={e => setSellPrices(prev => ({ ...prev, [g.id]: { sea: prev[g.id]?.sea ?? c.autoSeaSell, air: Number(e.target.value) } }))}
                        className="w-24 px-1.5 py-1 rounded border text-right text-xs focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                        style={{ background: "var(--orange-soft)", borderColor: "var(--orange)", fontFamily: "var(--font-dm-mono, monospace)", fontWeight: 600 }}
                      />
                    ) : "—"}
                  </td>
                  <td className="px-2.5 py-2 text-center">
                    {c ? (
                      <span className="text-xs font-semibold" style={{ color: c.airProfitPct >= 0 ? "var(--green)" : "var(--red)" }}>
                        {c.airProfitPct.toFixed(1)}%
                      </span>
                    ) : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
          {activeGoods.length > 0 && (
            <tfoot>
              <tr className="border-t-2" style={{ background: "var(--surface-2)", borderColor: "var(--border-dark)" }}>
                <td className="px-2.5 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]" colSpan={3}>
                  Totals ({activeGoods.length} products)
                </td>
                <td className="px-2.5 py-2 font-semibold" style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>
                  {formatAUD(totalGoodsAll)}
                </td>
                <td colSpan={7} />
                <td className="px-2.5 py-2 font-bold" style={{ fontFamily: "var(--font-dm-mono, monospace)", color: "var(--green)" }}>
                  {formatAUD(indivSeaTotal)}
                </td>
                <td className="px-2.5 py-2 font-bold" style={{ fontFamily: "var(--font-dm-mono, monospace)", color: "var(--orange)" }}>
                  {formatAUD(indivAirTotal)}
                </td>
                <td colSpan={6} />
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Bulk Shipping panel (2+ active products) */}
      {activeGoods.length >= 2 && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* SEA BULK */}
          <div className="rounded-[var(--radius)] p-5 border" style={{ background: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)", borderColor: "#1976D2" }}>
            <h3 className="font-bold text-sm mb-3" style={{ color: "#1976D2" }}>SEA (BULK)</h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Combined Weight:</span><span style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>{totalWeightAll.toFixed(2)}kg</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Bulk Rate:</span><span style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>${bulkSeaRateAud.toFixed(4)}/kg</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Bulk Shipping:</span><span style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>{formatAUD(bulkSeaShip)}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Goods Cost:</span><span style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>{formatAUD(totalGoodsAll)}</span></div>
              <div className="flex justify-between font-bold border-t border-blue-200 pt-1.5 mt-1.5">
                <span>BULK TOTAL SEA:</span><span style={{ fontFamily: "var(--font-dm-mono, monospace)", color: "#1976D2" }}>{formatAUD(bulkSeaTotal)}</span>
              </div>
              {seaSavings > 0 && (
                <div className="flex justify-between text-xs" style={{ color: "var(--green)" }}>
                  <span>Savings vs individual:</span><span style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>+{formatAUD(seaSavings)}</span>
                </div>
              )}
            </div>
          </div>
          {/* AIR BULK */}
          <div className="rounded-[var(--radius)] p-5 border" style={{ background: "linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)", borderColor: "#F57C00" }}>
            <h3 className="font-bold text-sm mb-3" style={{ color: "#F57C00" }}>AIR (BULK)</h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Combined Weight:</span><span style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>{totalWeightAll.toFixed(2)}kg</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Bulk Rate:</span><span style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>${bulkAirRateAud.toFixed(4)}/kg</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Bulk Shipping:</span><span style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>{formatAUD(bulkAirShip)}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Goods Cost:</span><span style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>{formatAUD(totalGoodsAll)}</span></div>
              <div className="flex justify-between font-bold border-t border-orange-200 pt-1.5 mt-1.5">
                <span>BULK TOTAL AIR:</span><span style={{ fontFamily: "var(--font-dm-mono, monospace)", color: "#F57C00" }}>{formatAUD(bulkAirTotal)}</span>
              </div>
              {airSavings > 0 && (
                <div className="flex justify-between text-xs" style={{ color: "var(--green)" }}>
                  <span>Savings vs individual:</span><span style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>+{formatAUD(airSavings)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Order Summary */}
      {activeGoods.length > 0 && (() => {
        const totalUnits = activeGoods.reduce((s, g) => s + (quantities[g.id] ?? 0), 0);
        const seaRevenue = activeGoods.reduce((s, g) => {
          const c = calcRowFull(g);
          return s + (c ? c.seaSell * c.qty : 0);
        }, 0);
        const airRevenue = activeGoods.reduce((s, g) => {
          const c = calcRowFull(g);
          return s + (c ? c.airSell * c.qty : 0);
        }, 0);
        const seaProfit = seaRevenue - indivSeaTotal;
        const airProfit = airRevenue - indivAirTotal;
        const seaMargin = seaRevenue > 0 ? (seaProfit / seaRevenue) * 100 : 0;
        const airMargin = airRevenue > 0 ? (airProfit / airRevenue) * 100 : 0;
        const bulkSeaRevenue = seaRevenue;
        const bulkAirRevenue = airRevenue;
        const bulkSeaProfit = bulkSeaRevenue - bulkSeaTotal;
        const bulkAirProfit = bulkAirRevenue - bulkAirTotal;
        const bulkSeaMargin = bulkSeaRevenue > 0 ? (bulkSeaProfit / bulkSeaRevenue) * 100 : 0;
        const bulkAirMargin = bulkAirRevenue > 0 ? (bulkAirProfit / bulkAirRevenue) * 100 : 0;

        return (
          <div
            className="rounded-[var(--radius)] border-2 p-5"
            style={{ background: "var(--surface)", borderColor: "var(--accent)", marginBottom: 8 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-sm font-bold uppercase tracking-wide"
                style={{ fontFamily: "var(--font-sans)", color: "var(--text)" }}
              >
                Order Summary
              </h3>
              <span className="text-xs text-[var(--text-muted)]">
                {activeGoods.length} product{activeGoods.length !== 1 ? "s" : ""} &middot; {totalUnits.toLocaleString()} units
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Individual shipping */}
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest font-semibold text-[var(--text-muted)] mb-2">
                  Individual Shipping
                </p>
                {[
                  { label: "Sea", cost: indivSeaTotal, revenue: seaRevenue, profit: seaProfit, margin: seaMargin, accent: "var(--blue)" },
                  { label: "Air", cost: indivAirTotal, revenue: airRevenue, profit: airProfit, margin: airMargin, accent: "var(--orange)" },
                ].map(({ label, cost, revenue, profit, margin, accent }) => (
                  <div key={label} className="rounded-[var(--radius-sm)] p-3 border border-[var(--border)]"
                    style={{ background: "var(--surface-2)" }}>
                    <p className="text-[11px] font-bold mb-2" style={{ color: accent }}>{label}</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-[var(--text-muted)]">Total Cost:</span>
                        <span style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>{formatAUD(cost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-muted)]">Revenue:</span>
                        <span style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>{formatAUD(revenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-muted)]">Profit:</span>
                        <span className="font-bold" style={{ fontFamily: "var(--font-dm-mono, monospace)", color: profit >= 0 ? "var(--green)" : "var(--red)" }}>
                          {formatAUD(profit)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-muted)]">Margin:</span>
                        <span className="font-bold" style={{ fontFamily: "var(--font-dm-mono, monospace)", color: margin >= 0 ? "var(--green)" : "var(--red)" }}>
                          {margin.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bulk shipping */}
              {activeGoods.length >= 2 && (
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-[var(--text-muted)] mb-2">
                    Bulk Shipping
                  </p>
                  {[
                    { label: "Sea (Bulk)", cost: bulkSeaTotal, revenue: bulkSeaRevenue, profit: bulkSeaProfit, margin: bulkSeaMargin, accent: "var(--blue)" },
                    { label: "Air (Bulk)", cost: bulkAirTotal, revenue: bulkAirRevenue, profit: bulkAirProfit, margin: bulkAirMargin, accent: "var(--orange)" },
                  ].map(({ label, cost, revenue, profit, margin, accent }) => (
                    <div key={label} className="rounded-[var(--radius-sm)] p-3 border border-[var(--border)]"
                      style={{ background: "var(--surface-2)" }}>
                      <p className="text-[11px] font-bold mb-2" style={{ color: accent }}>{label}</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-[var(--text-muted)]">Total Cost:</span>
                          <span style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>{formatAUD(cost)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--text-muted)]">Revenue:</span>
                          <span style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>{formatAUD(revenue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--text-muted)]">Profit:</span>
                          <span className="font-bold" style={{ fontFamily: "var(--font-dm-mono, monospace)", color: profit >= 0 ? "var(--green)" : "var(--red)" }}>
                            {formatAUD(profit)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--text-muted)]">Margin:</span>
                          <span className="font-bold" style={{ fontFamily: "var(--font-dm-mono, monospace)", color: margin >= 0 ? "var(--green)" : "var(--red)" }}>
                            {margin.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {activeGoods.length === 0 && (
        <p className="text-center text-sm text-[var(--text-muted)] mt-6">
          Enter quantities in the QTY column to calculate pricing.
        </p>
      )}
    </div>
  );
}
