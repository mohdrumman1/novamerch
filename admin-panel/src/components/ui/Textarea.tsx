import React from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export function Textarea({
  label,
  error,
  fullWidth = true,
  className = "",
  ...props
}: TextareaProps) {
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
      <textarea
        id={id}
        rows={3}
        className={`block px-3 py-2 rounded-[var(--radius-sm)] border text-sm text-[var(--text)] bg-[var(--surface)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y transition-colors ${
          error ? "border-[var(--red)]" : "border-[var(--border)]"
        } ${fullWidth ? "w-full" : ""} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-[var(--red)]">{error}</p>}
    </div>
  );
}
