export type ID = string;

export interface LineItem {
  id: ID;
  description: string;
  qty: number;
  unitPrice: number; // ex-GST, AUD
  costPerUnit?: number; // supplier cost
}

export type QuoteStatus = "Draft" | "Sent" | "Accepted" | "Declined" | "Expired";
export type OrderGoodsStatus = "Pending" | "Ordered" | "In Transit" | "Completed" | "Cancelled";
export type OrderInvoiceStatus = "Need to Invoice" | "Deposit Invoice Sent" | "Paid Deposit" | "Final Invoice Sent" | "Paid Full" | "Invoiced" | "NA";
export type InvoiceStatus = "Draft" | "Sent" | "Paid" | "Overdue" | "Void";
export type InvoiceKind = "Deposit" | "Final" | "Full";
export type ShipmentStatus = "In Transit" | "Arrived" | "Delayed";
export type ShippingMethod = "Agent Sea" | "Agent Air" | "Supplier Air";
export type TransportType = "Supplier Air" | "Agent Air" | "Agent Sea";

export interface Customer {
  id: ID;
  name: string;
  company: string;
  email: string;
  phone: string;
  abn?: string;
  billingAddress: string;
  shippingAddress?: string;
  createdAt: string; // ISO date string
  notes?: string;
}

export type QuoteSource = "Mockup Builder" | "Manual" | "Email Inquiry";

export interface Quote {
  id: ID;
  ref: string; // e.g. "#Q1049"
  customerId: ID;
  status: QuoteStatus;
  issuedAt: string; // ISO date string
  validUntil: string; // ISO date string
  lineItems: LineItem[];
  freightCost?: number;
  imageUrl?: string; // mockup image data URL
  comments?: string;
  source?: QuoteSource;
}

export interface Order {
  id: ID;
  ref: string; // e.g. "#O1031"
  customerId: ID;
  quoteId?: ID;
  goodsStatus: OrderGoodsStatus;
  invoiceStatus: OrderInvoiceStatus;
  transportType: TransportType;
  transportCost?: number;
  fy: string; // "FY2024/25"
  orderedAt: string; // ISO date string
  lineItems: LineItem[];
  freightPaid?: boolean;
  freightPaidDate?: string;
  trackingAgentToK2?: string;
  trackingK2ToCustomer?: string;
  amountReceived?: number;
  comments?: string;
}

export interface Invoice {
  id: ID;
  ref: string; // e.g. "#1047-Deposit"
  orderId?: ID;
  customerId: ID;
  kind: InvoiceKind;
  pairedInvoiceId?: ID;
  status: InvoiceStatus;
  issuedAt: string; // ISO date string
  dueAt: string; // ISO date string
  paidAt?: string; // ISO date string
  subtotal: number; // ex-GST
  gst: number;
  total: number; // subtotal + gst
  amountReceived?: number;
  lineItems: LineItem[];
  comments?: string;
}

export interface ShipmentItem {
  description: string;
  qty: number;
  orderId?: ID;
}

export interface Shipment {
  id: ID;
  ref: string; // e.g. "#SHP-0009"
  orderId?: ID;
  customerId: ID;
  status: ShipmentStatus;
  shippingMethod: ShippingMethod;
  trackingAgentToK2?: string;
  trackingSupplierToAgent?: string;
  shippedAt?: string; // ISO date string
  expectedArrival?: string; // ISO date string
  arrivedAt?: string; // ISO date string
  items: ShipmentItem[];
  notes?: string;
}

export interface Good {
  id: ID;
  sku: string;
  name: string;
  category: "Drinkware" | "Apparel" | "Office" | "Bags" | "Promotional" | "Sport";
  costUsd: number; // supplier cost in USD
  logoFee: number; // AUD
  minQty: number;
  widthCm: number;
  lengthCm: number;
  depthCm: number;
  weightKg: number;
  qtyPerCarton: number;
}

export interface ShippingRate {
  label: string;
  minKg: number;
  rateUsdPerKg: number;
}

export interface AppSettings {
  usdToAud: number;
  seaRates: ShippingRate[];
  airRates: ShippingRate[];
}

// For the data provider state
export interface AppState {
  customers: Customer[];
  quotes: Quote[];
  orders: Order[];
  invoices: Invoice[];
  shipments: Shipment[];
  goods: Good[];
  settings: AppSettings;
}
