import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({
  label,
  error,
  fullWidth = true,
  options,
  placeholder,
  className = "",
  ...props
}: SelectProps) {
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
      <select
        id={id}
        className={`block px-3 py-2 rounded-[var(--radius-sm)] border text-sm text-[var(--text)] bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] cursor-pointer transition-colors ${
          error ? "border-[var(--red)]" : "border-[var(--border)]"
        } ${fullWidth ? "w-full" : ""} ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-[var(--red)]">{error}</p>}
    </div>
  );
}
