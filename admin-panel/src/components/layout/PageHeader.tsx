import React from "react";

interface PageHeaderProps {
  title: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, actions }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1
        className="text-[27px] text-[var(--text)]"
        style={{
          fontFamily: "var(--font-syne, serif)",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          margin: 0,
        }}
      >
        {title}
      </h1>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
