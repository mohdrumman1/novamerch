import React from "react";
import type { BadgeTone } from "@/lib/status";
import { BADGE_COLORS } from "@/lib/status";

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  className?: string;
}

export function Badge({ label, tone = "neutral", className = "" }: BadgeProps) {
  const { bg, color } = BADGE_COLORS[tone];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${className}`}
      style={{ backgroundColor: bg, color }}
    >
      {label}
    </span>
  );
}
