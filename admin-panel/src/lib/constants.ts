export const GST_RATE = 0.1;
export const GST_THRESHOLD = 75_000; // AUD

export const FISCAL_YEARS = ["FY2024/25", "FY2025/26"] as const;
export type FiscalYear = typeof FISCAL_YEARS[number];

export const FY_ALL = "All Time";

// Returns the fiscal year string for a given ISO date string
export function getFiscalYear(isoDate: string): string {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1-indexed
  if (month >= 7) {
    return `FY${year}/${String(year + 1).slice(2)}`;
  }
  return `FY${year - 1}/${String(year).slice(2)}`;
}

export const QUOTE_STATUSES = ["Draft", "Sent", "Accepted", "Declined", "Expired"] as const;
export const ORDER_GOODS_STATUSES = ["Pending", "Ordered", "In Transit", "Completed", "Cancelled"] as const;
export const ORDER_INVOICE_STATUSES = [
  "Need to Invoice", "Deposit Invoice Sent", "Paid Deposit",
  "Final Invoice Sent", "Paid Full", "Invoiced", "NA"
] as const;
export const INVOICE_STATUSES = ["Draft", "Sent", "Pending", "Paid", "Overdue"] as const;
export const INVOICE_KINDS = ["Deposit", "Final", "Full"] as const;
export const SHIPMENT_STATUSES = ["In Transit", "Arrived", "Delayed"] as const;
export const SHIPPING_METHODS = ["Agent Sea", "Agent Air", "Supplier Air"] as const;
export const TRANSPORT_TYPES = ["Supplier Air", "Agent Air", "Agent Sea"] as const;
export const GOOD_CATEGORIES = ["Drinkware", "Apparel", "Office", "Bags", "Promotional", "Sport"] as const;

export const CARRIERS = [
  "Australia Post",
  "StarTrack",
  "TNT",
  "Aramex",
  "DHL Express",
  "FedEx",
] as const;

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", iconKey: "Dashboard" },
  { label: "Quotes", href: "/quotes", iconKey: "Quotes" },
  { label: "Orders", href: "/orders", iconKey: "Orders" },
  { label: "Invoices", href: "/invoices", iconKey: "Invoices" },
  { label: "Shipments", href: "/shipments", iconKey: "Shipments" },
  { label: "Customers", href: "/customers", iconKey: "Customers" },
  { label: "Financials", href: "/financials", iconKey: "Financials" },
  { label: "Goods", href: "/goods", iconKey: "Goods" },
] as const;

export const DEFAULT_SETTINGS: import("./types").AppSettings = {
  usdToAud: 1.58,
  seaRates: [
    { label: "11kg+", minKg: 11, rateUsdPerKg: 5.5 },
    { label: "21kg+", minKg: 21, rateUsdPerKg: 4.8 },
    { label: "100kg+", minKg: 100, rateUsdPerKg: 3.9 },
    { label: "300kg+", minKg: 300, rateUsdPerKg: 3.2 },
  ],
  airRates: [
    { label: "11kg+", minKg: 11, rateUsdPerKg: 14.0 },
    { label: "21kg+", minKg: 21, rateUsdPerKg: 12.5 },
    { label: "100kg+", minKg: 100, rateUsdPerKg: 11.0 },
    { label: "300kg+", minKg: 300, rateUsdPerKg: 9.5 },
  ],
};
