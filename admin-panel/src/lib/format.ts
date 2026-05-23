/** Format a number as AUD currency */
export function formatAUD(amount: number, options?: { compact?: boolean }): string {
  if (options?.compact && Math.abs(amount) >= 1000) {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  }
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Format a date string (ISO) as "DD MMM YYYY" */
export function formatDate(isoDate: string | undefined): string {
  if (!isoDate) return "—";
  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
}

/** Format a number with commas */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-AU").format(n);
}

/** Format a number as a percentage with given decimal places */
export function formatPercent(n: number, decimals = 1): string {
  return `${n.toFixed(decimals)}%`;
}

/** Format a phone number nicely (Australian) */
export function formatPhone(phone: string): string {
  return phone;
}
