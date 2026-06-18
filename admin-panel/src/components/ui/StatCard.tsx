import React from "react";

interface StatCardProps {
  label: string;
  value: string;
  sublabel?: string;
  tone?: "default" | "green" | "red" | "orange" | "blue";
  accent?: boolean; // left border accent
  accentColor?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  sublabel,
  tone = "default",
  accentColor,
  className = "",
}: StatCardProps) {
  const valueColors: Record<string, string> = {
    default: "var(--text)",
    green: "var(--green)",
    red: "var(--red)",
    orange: "var(--orange)",
    blue: "var(--blue)",
  };

  return (
    <div
      className={`bg-[var(--surface)] rounded-[var(--radius)] border border-[var(--border)] p-5 ${className}`}
      style={accentColor ? { borderLeft: `4px solid ${accentColor}` } : undefined}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] mb-2">
        {label}
      </p>
      <p
        className="text-2xl font-semibold font-[var(--font-dm-mono,monospace)]"
        style={{ color: valueColors[tone] }}
      >
        {value}
      </p>
      {sublabel && (
        <p className="text-xs text-[var(--text-muted)] mt-1">{sublabel}</p>
      )}
    </div>
  );
}
