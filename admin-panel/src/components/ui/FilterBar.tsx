"use client";
import React from "react";
import { SearchIcon } from "@/components/icons";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  search?: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
  };
  filters?: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: FilterOption[];
  }[];
  rightSlot?: React.ReactNode;
}

export function FilterBar({ search, filters, rightSlot }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-5">
      {search && (
        <div className="relative min-w-[200px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
            <SearchIcon size={16} />
          </span>
          <input
            type="text"
            value={search.value}
            onChange={(e) => search.onChange(e.target.value)}
            placeholder={search.placeholder ?? "Search..."}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </div>
      )}
      {filters?.map((filter, i) => (
        <select
          key={i}
          value={filter.value}
          onChange={(e) => filter.onChange(e.target.value)}
          className="px-3 py-2 text-sm rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] cursor-pointer"
        >
          {filter.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}
      {rightSlot && <div className="ml-auto">{rightSlot}</div>}
    </div>
  );
}
