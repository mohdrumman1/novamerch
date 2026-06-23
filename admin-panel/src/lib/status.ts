import type {
  QuoteStatus,
  OrderGoodsStatus,
  OrderInvoiceStatus,
  InvoiceStatus,
  ShipmentStatus,
} from "./types";

export type BadgeTone = "green" | "blue" | "orange" | "red" | "neutral" | "purple";

export const QUOTE_STATUS_TONE: Record<QuoteStatus, BadgeTone> = {
  Draft: "neutral",
  Sent: "blue",
  Accepted: "green",
  Declined: "red",
  Expired: "red",
};

export const ORDER_GOODS_STATUS_TONE: Record<OrderGoodsStatus, BadgeTone> = {
  Pending: "neutral",
  Ordered: "orange",
  "In Transit": "blue",
  Completed: "green",
  Cancelled: "red",
};

export const ORDER_INVOICE_STATUS_TONE: Record<OrderInvoiceStatus, BadgeTone> = {
  "Need to Invoice": "orange",
  "Deposit Invoice Sent": "blue",
  "Paid Deposit": "neutral",
  "Final Invoice Sent": "purple",
  "Paid Full": "green",
  Invoiced: "blue",
  NA: "neutral",
};

export const INVOICE_STATUS_TONE: Record<InvoiceStatus, BadgeTone> = {
  Draft: "neutral",
  Sent: "blue",
  Paid: "green",
  Overdue: "red",
  Void: "neutral",
};

export const SHIPMENT_STATUS_TONE: Record<ShipmentStatus, BadgeTone> = {
  "In Transit": "blue",
  Arrived: "green",
  Delayed: "orange",
};

export const BADGE_COLORS: Record<BadgeTone, { bg: string; color: string }> = {
  green: { bg: "var(--green-soft)", color: "var(--green)" },
  blue: { bg: "var(--blue-soft)", color: "var(--blue)" },
  orange: { bg: "var(--orange-soft)", color: "var(--orange)" },
  red: { bg: "var(--red-soft)", color: "var(--red)" },
  neutral: { bg: "var(--surface-2)", color: "var(--text-muted)" },
  purple: { bg: "#F3E5F5", color: "#7B1FA2" },
};
