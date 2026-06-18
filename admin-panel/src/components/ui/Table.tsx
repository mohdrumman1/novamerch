"use client";
import React, { useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@/components/icons";
import { EmptyState } from "./EmptyState";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: string;
}

interface TableProps<T extends { id: string }> {
  columns: Column<T>[];
  rows: T[];
  onRowClick?: (row: T) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  keyExtractor?: (row: T) => string;
  sortKey?: string;
  sortDir?: "asc" | "desc";
}

export function Table<T extends { id: string }>({
  columns,
  rows,
  onRowClick,
  emptyTitle,
  emptyDescription,
  keyExtractor,
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sorted = [...rows].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = (a as Record<string, unknown>)[sortKey];
    const bVal = (b as Record<string, unknown>)[sortKey];
    if (aVal === undefined || bVal === undefined) return 0;
    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();
    const aNum = parseFloat(aStr);
    const bNum = parseFloat(bStr);
    const isNum = !isNaN(aNum) && !isNaN(bNum);
    const cmp = isNum ? aNum - bNum : aStr.localeCompare(bStr);
    return sortDir === "asc" ? cmp : -cmp;
  });

  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="overflow-x-auto rounded-[var(--radius)] border border-[var(--border)]">
      <table className="w-full border-collapse">
        <thead>
          <tr style={{ background: "var(--surface-2)" }}>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
                className={`px-4 py-3 text-left text-[10.5px] font-semibold uppercase tracking-wider text-[var(--text-muted)] select-none ${
                  col.sortable ? "cursor-pointer hover:text-[var(--text)]" : ""
                } ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"}`}
                style={{ width: col.width }}
              >
                <span className="inline-flex items-center gap-1">
                  {col.header}
                  {col.sortable && sortKey === col.key && (
                    sortDir === "asc" ? <ChevronUpIcon size={12} /> : <ChevronDownIcon size={12} />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => {
            const key = keyExtractor ? keyExtractor(row) : row.id;
            return (
              <tr
                key={key}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`border-t border-[var(--border)] transition-colors ${
                  onRowClick ? "cursor-pointer hover:bg-[var(--surface-2)]" : ""
                }`}
                style={{ background: "var(--surface)" }}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 text-sm text-[var(--text)] ${
                      col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : ""
                    }`}
                  >
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
