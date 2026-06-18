"use client";
import React, { useState } from "react";
import { useData } from "@/context/DataProvider";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Tabs } from "@/components/ui/Tabs";
import { formatAUD, formatPercent } from "@/lib/format";
import { lineItemsTotal, lineItemsCost } from "@/lib/calc";
import { GST_THRESHOLD, getFiscalYear } from "@/lib/constants";
import { RefreshIcon } from "@/components/icons";

const TABS = [
  { key: "monthly", label: "Monthly Breakdown" },
  { key: "pl", label: "P&L Report" },
];

const FISCAL_YEAR_OPTIONS = ["FY2024/25", "FY2025/26"];

function getMonthKey(isoDate: string): string {
  const d = new Date(isoDate);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function getMonthLabel(key: string): string {
  const [year, month] = key.split("-");
  return new Date(Number(year), Number(month) - 1).toLocaleString("en-AU", { month: "short", year: "numeric" });
}

type MonthData = {
  key: string;
  label: string;
  revenue: number;
  expenditure: number;
  ebit: number;
  marginPct: number;
  orderCount: number;
};

export default function FinancialsPage() {
  const { orders, invoices } = useData();
  const [activeTab, setActiveTab] = useState("monthly");
  const [selectedYear, setSelectedYear] = useState("FY2025/26");
  const [gstRegistered, setGstRegistered] = useState(false);

  // ── Monthly Breakdown ──────────────────────────────────────────────────

  // Revenue: group paid invoices by paidAt month
  const revenueByMonth = new Map<string, number>();
  invoices
    .filter((i) => i.status === "Paid" && i.paidAt)
    .forEach((i) => {
      const key = getMonthKey(i.paidAt!);
      revenueByMonth.set(key, (revenueByMonth.get(key) ?? 0) + (i.amountReceived ?? i.total));
    });
  // Fallback: orders with amountReceived but no paid invoice → group by orderedAt month
  orders
    .filter((o) => (o.amountReceived ?? 0) > 0)
    .forEach((o) => {
      const hasInvoice = invoices.some((i) => i.orderId === o.id && i.status === "Paid");
      if (!hasInvoice) {
        const key = getMonthKey(o.orderedAt);
        revenueByMonth.set(key, (revenueByMonth.get(key) ?? 0) + (o.amountReceived ?? 0));
      }
    });

  // Expenditure: exclude Pending and Cancelled, group by orderedAt month
  const expenditureByMonth = new Map<string, number>();
  const orderCountByMonth = new Map<string, number>();
  orders
    .filter((o) => getFiscalYear(o.orderedAt) === selectedYear)
    .forEach((o) => {
      const key = getMonthKey(o.orderedAt);
      orderCountByMonth.set(key, (orderCountByMonth.get(key) ?? 0) + 1);
      if (o.goodsStatus !== "Pending" && o.goodsStatus !== "Cancelled") {
        const exp = lineItemsCost(o.lineItems) + (o.transportCost ?? 0);
        expenditureByMonth.set(key, (expenditureByMonth.get(key) ?? 0) + exp);
      }
    });

  // Collect all month keys that appear in the selected FY (from orders)
  const fyMonthKeys = new Set<string>();
  orders
    .filter((o) => getFiscalYear(o.orderedAt) === selectedYear)
    .forEach((o) => fyMonthKeys.add(getMonthKey(o.orderedAt)));

  const months: MonthData[] = Array.from(fyMonthKeys)
    .sort()
    .map((key) => {
      const revenue = revenueByMonth.get(key) ?? 0;
      const expenditure = expenditureByMonth.get(key) ?? 0;
      const ebit = revenue - expenditure;
      const marginPct = revenue > 0 ? (ebit / revenue) * 100 : 0;
      return {
        key,
        label: getMonthLabel(key),
        revenue,
        expenditure,
        ebit,
        marginPct,
        orderCount: orderCountByMonth.get(key) ?? 0,
      };
    });

  const totalMonthlyRevenue = months.reduce((sum, m) => sum + m.revenue, 0);
  const totalMonthlyExpenditure = months.reduce((sum, m) => sum + m.expenditure, 0);
  const totalMonthlyEBIT = totalMonthlyRevenue - totalMonthlyExpenditure;
  const totalMonthlyMargin = totalMonthlyRevenue > 0 ? (totalMonthlyEBIT / totalMonthlyRevenue) * 100 : 0;

  // ── P&L Report ─────────────────────────────────────────────────────────

  // All-time figures (no FY filter)
  const totalRevenue = orders.reduce((sum, o) => sum + lineItemsTotal(o.lineItems), 0);
  const costOfGoods = orders.reduce((sum, o) => sum + lineItemsCost(o.lineItems), 0);
  const transport = orders.reduce((sum, o) => sum + (o.transportCost ?? 0), 0);
  const totalExpenses = costOfGoods + transport;
  const netProfit = totalRevenue - totalExpenses;
  const marginPct = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  const gstCollected = totalRevenue * 0.10;
  const gstCredits = totalExpenses * 0.10;
  const gstPayable = gstCollected - gstCredits;

  // Cash Position
  const cashReceived = orders.reduce((sum, o) => sum + (o.amountReceived ?? 0), 0);
  const outstanding = totalRevenue - cashReceived;
  const actualProfitToday = cashReceived - totalExpenses;

  // GST Threshold: all-time revenue (no date filter)
  const allTimeRevenue = orders.reduce((sum, o) => sum + lineItemsTotal(o.lineItems), 0);
  const gstThresholdPct = Math.min(100, (allTimeRevenue / GST_THRESHOLD) * 100);
  const gstThresholdColor =
    gstThresholdPct >= 100 ? "var(--red)" : gstThresholdPct >= 80 ? "var(--orange)" : "var(--green)";

  function marginBadgeColor(pct: number): string {
    if (pct >= 30) return "var(--green-soft)";
    if (pct >= 15) return "var(--orange-soft)";
    return "var(--red-soft)";
  }
  function marginTextColor(pct: number): string {
    if (pct >= 30) return "var(--green)";
    if (pct >= 15) return "var(--orange)";
    return "var(--red)";
  }

  return (
    <div>
      <PageHeader
        title="Financials"
        actions={
          <div className="flex items-center gap-3">
            {activeTab === "monthly" && (
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-2 text-sm rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] focus:outline-none cursor-pointer"
              >
                {FISCAL_YEAR_OPTIONS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            )}
            <button
              className="p-2 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
              onClick={() => window.location.reload()}
              title="Refresh"
            >
              <RefreshIcon size={16} />
            </button>
          </div>
        }
      />

      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} className="mb-6 max-w-sm" />

      {activeTab === "monthly" && (
        <div>
          {/* Summary cards */}
          <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))" }}>
            <StatCard label="Total Revenue" value={formatAUD(totalMonthlyRevenue)} tone="blue" />
            <StatCard label="Total Expenditure" value={formatAUD(totalMonthlyExpenditure)} tone="red" />
            <StatCard label="EBIT" value={formatAUD(totalMonthlyEBIT)} tone={totalMonthlyEBIT >= 0 ? "green" : "red"} />
            <StatCard
              label="Avg Margin"
              value={formatPercent(totalMonthlyMargin)}
              tone={totalMonthlyMargin >= 20 ? "green" : totalMonthlyMargin >= 10 ? "orange" : "red"}
            />
          </div>

          {/* Info banner */}
          <div
            className="rounded-[var(--radius-sm)] p-3 mb-5 text-sm"
            style={{ background: "#FFF8E1", border: "1px solid #FFD54F", color: "#795548" }}
          >
            Revenue = Amount received from customers. Expenditure = Cost of goods + Transport (excluding Pending/Cancelled orders). EBIT = Revenue − Expenditure.
          </div>

          {/* Monthly table */}
          <div className="bg-[var(--surface)] rounded-[var(--radius)] border border-[var(--border)] overflow-hidden">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ background: "var(--surface-2)" }}>
                  {["Month", "Revenue", "Expenditure", "EBIT", "Margin %", "Orders"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[10.5px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {months.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-[var(--text-muted)]">
                      No data for {selectedYear}
                    </td>
                  </tr>
                ) : (
                  months.map((m) => (
                    <tr key={m.key} className="border-t border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors">
                      <td className="px-4 py-3 font-medium">{m.label}</td>
                      <td className="px-4 py-3" style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>
                        {formatAUD(m.revenue)}
                      </td>
                      <td className="px-4 py-3" style={{ fontFamily: "var(--font-dm-mono, monospace)", color: "var(--red)" }}>
                        {formatAUD(m.expenditure)}
                      </td>
                      <td
                        className="px-4 py-3"
                        style={{
                          fontFamily: "var(--font-dm-mono, monospace)",
                          color: m.ebit >= 0 ? "var(--green)" : "var(--red)",
                        }}
                      >
                        {formatAUD(m.ebit)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            background: marginBadgeColor(m.marginPct),
                            color: marginTextColor(m.marginPct),
                          }}
                        >
                          {formatPercent(m.marginPct)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-[var(--text-muted)]">{m.orderCount}</td>
                    </tr>
                  ))
                )}
                {months.length > 0 && (
                  <tr className="border-t-2 border-[var(--border-dark)] font-semibold" style={{ background: "var(--surface-2)" }}>
                    <td className="px-4 py-3">Total</td>
                    <td className="px-4 py-3" style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>{formatAUD(totalMonthlyRevenue)}</td>
                    <td className="px-4 py-3" style={{ fontFamily: "var(--font-dm-mono, monospace)", color: "var(--red)" }}>{formatAUD(totalMonthlyExpenditure)}</td>
                    <td className="px-4 py-3" style={{ fontFamily: "var(--font-dm-mono, monospace)", color: totalMonthlyEBIT >= 0 ? "var(--green)" : "var(--red)" }}>{formatAUD(totalMonthlyEBIT)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: marginBadgeColor(totalMonthlyMargin), color: marginTextColor(totalMonthlyMargin) }}>
                        {formatPercent(totalMonthlyMargin)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">{months.reduce((sum, m) => sum + m.orderCount, 0)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "pl" && (
        <div className="space-y-6">
          {/* GST toggle */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
              <input
                type="checkbox"
                checked={gstRegistered}
                onChange={(e) => setGstRegistered(e.target.checked)}
                className="cursor-pointer"
              />
              GST Registered
            </label>
          </div>

          {/* GST threshold tracker */}
          <div className="bg-[var(--surface)] rounded-[var(--radius)] border border-[var(--border)] p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-[var(--text)]">GST Registration Threshold</h3>
              <span className="text-xs text-[var(--text-muted)]">
                {formatAUD(allTimeRevenue)} / {formatAUD(GST_THRESHOLD)} AUD (all-time)
              </span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background: "var(--surface-2)" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${gstThresholdPct}%`, background: gstThresholdColor }}
              />
            </div>
            <p className="text-xs mt-2" style={{ color: gstThresholdColor }}>
              {gstThresholdPct >= 100
                ? "You have exceeded the GST threshold. Register for GST now."
                : gstThresholdPct >= 80
                ? `Approaching threshold: ${formatPercent(gstThresholdPct)} of $75,000`
                : `${formatPercent(gstThresholdPct)} of $75,000 threshold reached`}
            </p>
          </div>

          {/* P&L table */}
          <div className="bg-[var(--surface)] rounded-[var(--radius)] border border-[var(--border)] overflow-hidden">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ background: "var(--surface-2)" }}>
                  <th className="px-4 py-3 text-left text-[10.5px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">Item</th>
                  <th className="px-4 py-3 text-right text-[10.5px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">Amount</th>
                </tr>
              </thead>
              <tbody>
                {/* INCOME section */}
                <PLRow label="Income" value="" section />
                <PLRow label="Total Revenue" value={formatAUD(totalRevenue)} indent />
                {gstRegistered && <PLRow label="GST Collected (10%)" value={formatAUD(gstCollected)} indent />}

                {/* EXPENSES section */}
                <PLRow label="Expenses" value="" section />
                <PLRow label="Cost of Goods" value={formatAUD(costOfGoods)} indent negative />
                <PLRow label="Transport / Freight" value={formatAUD(transport)} indent negative />
                <PLRow label="Total Expenses" value={formatAUD(totalExpenses)} negative />

                {/* GST Position */}
                {gstRegistered && (
                  <>
                    <PLRow label="GST Position" value="" section />
                    <PLRow label="GST Collected" value={formatAUD(gstCollected)} indent />
                    <PLRow label="GST Credits on Costs" value={formatAUD(gstCredits)} indent negative />
                    <PLRow label="GST Payable to ATO" value={formatAUD(gstPayable)} />
                  </>
                )}
              </tbody>
              <tfoot>
                <tr style={{ background: "#111111" }}>
                  <td className="px-4 py-4 text-white font-bold">NET PROFIT</td>
                  <td
                    className="px-4 py-4 text-right font-bold text-lg"
                    style={{
                      fontFamily: "var(--font-dm-mono, monospace)",
                      color: netProfit >= 0 ? "var(--accent)" : "var(--red)",
                    }}
                  >
                    {formatAUD(netProfit)}
                  </td>
                </tr>
                <tr style={{ background: "var(--surface-2)" }}>
                  <td className="px-4 py-2 text-sm text-[var(--text-muted)]">Profit Margin</td>
                  <td className="px-4 py-2 text-right text-sm font-semibold" style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>
                    {formatPercent(marginPct)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Cash Position section */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text)] mb-3">Cash Position</h3>
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))" }}>
              <StatCard label="Cash Received" value={formatAUD(cashReceived)} tone="blue" />
              <StatCard label="Costs Paid" value={formatAUD(totalExpenses)} tone="red" />
              <StatCard label="Outstanding" value={formatAUD(outstanding)} tone={outstanding > 0 ? "orange" : "green"} />
              <StatCard
                label="Actual Profit Today"
                value={formatAUD(actualProfitToday)}
                tone={actualProfitToday >= 0 ? "green" : "red"}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PLRow({ label, value, section, indent, negative }: {
  label: string;
  value: string;
  section?: boolean;
  indent?: boolean;
  negative?: boolean;
}) {
  return (
    <tr
      className="border-t border-[var(--border)]"
      style={section ? { background: "var(--surface-2)" } : undefined}
    >
      <td className={`px-4 py-2.5 text-sm ${indent ? "pl-8 text-[var(--text-muted)]" : section ? "font-semibold text-[10.5px] uppercase tracking-wider text-[var(--text-muted)]" : "font-medium"}`}>
        {label}
      </td>
      <td
        className="px-4 py-2.5 text-right text-sm"
        style={{
          fontFamily: value ? "var(--font-dm-mono, monospace)" : undefined,
          color: negative ? "var(--red)" : undefined,
        }}
      >
        {negative && value ? `(${value})` : value}
      </td>
    </tr>
  );
}
