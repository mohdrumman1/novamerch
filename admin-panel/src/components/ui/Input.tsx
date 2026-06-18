import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export function Input({
  label,
  error,
  helperText,
  fullWidth = true,
  className = "",
  ...props
}: InputProps) {
  const id = props.id ?? props.name;
  return (
    <div className={fullWidth ? "w-full" : ""}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-[var(--text)] mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`block px-3 py-2 rounded-[var(--radius-sm)] border text-sm text-[var(--text)] bg-[var(--surface)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-colors ${
          error ? "border-[var(--red)]" : "border-[var(--border)]"
        } ${fullWidth ? "w-full" : ""} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-[var(--red)]">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-xs text-[var(--text-muted)]">{helperText}</p>
      )}
    </div>
  );
}
