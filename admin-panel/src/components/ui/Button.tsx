"use client";
import React from "react";

type ButtonVariant = "primary" | "ghost" | "danger" | "subtle" | "outline";
type ButtonSize = "sm" | "md" | "lg" | "compact";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export function Button({
  variant = "ghost",
  size = "md",
  loading,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-medium rounded-[var(--radius-sm)] transition-colors cursor-pointer border-0 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      "bg-[var(--accent)] text-[#0A0A0A] hover:bg-[var(--accent-dark)] shadow-sm",
    ghost: "bg-transparent text-[var(--text)] hover:bg-[var(--surface-2)]",
    danger: "bg-[var(--red-soft)] text-[var(--red)] hover:bg-red-100",
    subtle:
      "bg-[var(--surface-2)] text-[var(--text)] hover:bg-[var(--border)]",
    outline:
      "bg-transparent text-[var(--text)] border border-[var(--border)] hover:bg-[var(--surface-2)]",
  };

  const sizeStyles: Record<ButtonSize, string> = {
    compact: "px-2.5 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
