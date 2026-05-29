"use client";
import React, { createContext, useContext, useReducer, useEffect, useRef } from "react";
import type { AppState, Customer, Quote, Order, Invoice, Shipment, Good, AppSettings } from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/constants";
import { goods as defaultGoods } from "@/data/goods";

// ─── State ───────────────────────────────────────────────────────────────────

const baseState: AppState = {
  customers: [],
  quotes: [],
  orders: [],
  invoices: [],
  shipments: [],
  goods: defaultGoods,
  settings: DEFAULT_SETTINGS,
};

const LOCAL_GOODS_KEY = "novamerch-goods-v1";
const LOCAL_SETTINGS_KEY = "novamerch-settings-v1";
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function apiPath(path: string): string {
  return `${BASE_PATH}${path}`;
}

// ─── Actions ─────────────────────────────────────────────────────────────────

type Action =
  | { type: "ADD_CUSTOMER"; payload: Customer }
  | { type: "UPDATE_CUSTOMER"; payload: Customer }
  | { type: "DELETE_CUSTOMER"; id: string }
  | { type: "REPLACE_CUSTOMER"; tempId: string; payload: Customer }
  | { type: "ADD_QUOTE"; payload: Quote }
  | { type: "UPDATE_QUOTE"; payload: Quote }
  | { type: "DELETE_QUOTE"; id: string }
  | { type: "REPLACE_QUOTE"; tempId: string; payload: Quote }
  | { type: "ADD_ORDER"; payload: Order }
  | { type: "UPDATE_ORDER"; payload: Order }
  | { type: "DELETE_ORDER"; id: string }
  | { type: "REPLACE_ORDER"; tempId: string; payload: Order }
  | { type: "ADD_INVOICE"; payload: Invoice }
  | { type: "UPDATE_INVOICE"; payload: Invoice }
  | { type: "DELETE_INVOICE"; id: string }
  | { type: "REPLACE_INVOICE"; tempId: string; payload: Invoice }
  | { type: "ADD_SHIPMENT"; payload: Shipment }
  | { type: "UPDATE_SHIPMENT"; payload: Shipment }
  | { type: "DELETE_SHIPMENT"; id: string }
  | { type: "REPLACE_SHIPMENT"; tempId: string; payload: Shipment }
  | { type: "ADD_GOOD"; payload: Good }
  | { type: "UPDATE_GOOD"; payload: Good }
  | { type: "DELETE_GOOD"; id: string }
  | { type: "UPDATE_SETTINGS"; payload: Partial<AppSettings> }
  | { type: "SET_GOODS"; payload: Good[] }
  | { type: "HYDRATE_REMOTE"; customers: Customer[]; quotes: Quote[]; orders: Order[]; invoices: Invoice[]; shipments: Shipment[] };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "ADD_CUSTOMER": return { ...state, customers: [...state.customers, action.payload] };
    case "UPDATE_CUSTOMER": return { ...state, customers: state.customers.map((c) => c.id === action.payload.id ? action.payload : c) };
    case "DELETE_CUSTOMER": return { ...state, customers: state.customers.filter((c) => c.id !== action.id) };
    case "REPLACE_CUSTOMER": return { ...state, customers: state.customers.map((c) => c.id === action.tempId ? action.payload : c) };
    case "ADD_QUOTE": return { ...state, quotes: [...state.quotes, action.payload] };
    case "UPDATE_QUOTE": return { ...state, quotes: state.quotes.map((q) => q.id === action.payload.id ? action.payload : q) };
    case "DELETE_QUOTE": return { ...state, quotes: state.quotes.filter((q) => q.id !== action.id) };
    case "REPLACE_QUOTE": return { ...state, quotes: state.quotes.map((q) => q.id === action.tempId ? action.payload : q) };
    case "ADD_ORDER": return { ...state, orders: [...state.orders, action.payload] };
    case "UPDATE_ORDER": return { ...state, orders: state.orders.map((o) => o.id === action.payload.id ? action.payload : o) };
    case "DELETE_ORDER": return { ...state, orders: state.orders.filter((o) => o.id !== action.id) };
    case "REPLACE_ORDER": return { ...state, orders: state.orders.map((o) => o.id === action.tempId ? action.payload : o) };
    case "ADD_INVOICE": return { ...state, invoices: [...state.invoices, action.payload] };
    case "UPDATE_INVOICE": return { ...state, invoices: state.invoices.map((i) => i.id === action.payload.id ? action.payload : i) };
    case "DELETE_INVOICE": return { ...state, invoices: state.invoices.filter((i) => i.id !== action.id) };
    case "REPLACE_INVOICE": return { ...state, invoices: state.invoices.map((i) => i.id === action.tempId ? action.payload : i) };
    case "ADD_SHIPMENT": return { ...state, shipments: [...state.shipments, action.payload] };
    case "UPDATE_SHIPMENT": return { ...state, shipments: state.shipments.map((s) => s.id === action.payload.id ? action.payload : s) };
    case "DELETE_SHIPMENT": return { ...state, shipments: state.shipments.filter((s) => s.id !== action.id) };
    case "REPLACE_SHIPMENT": return { ...state, shipments: state.shipments.map((s) => s.id === action.tempId ? action.payload : s) };
    case "ADD_GOOD": return { ...state, goods: [...state.goods, action.payload] };
    case "UPDATE_GOOD": return { ...state, goods: state.goods.map((g) => g.id === action.payload.id ? action.payload : g) };
    case "DELETE_GOOD": return { ...state, goods: state.goods.filter((g) => g.id !== action.id) };
    case "SET_GOODS": return { ...state, goods: action.payload };
    case "UPDATE_SETTINGS": return { ...state, settings: { ...state.settings, ...action.payload } };
    case "HYDRATE_REMOTE": return {
      ...state,
      customers: action.customers,
      quotes: action.quotes,
      orders: action.orders,
      invoices: action.invoices,
      shipments: action.shipments,
    };
    default: return state;
  }
}

// ─── API helpers ─────────────────────────────────────────────────────────────

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(apiPath(path), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

async function patch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(apiPath(path), { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

async function del(path: string): Promise<void> {
  const res = await fetch(apiPath(path), { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface DataContextValue {
  customers: Customer[]; quotes: Quote[]; orders: Order[];
  invoices: Invoice[]; shipments: Shipment[]; goods: Good[];
  settings: AppSettings; loading: boolean;
  getCustomer: (id: string) => Customer | undefined;
  getOrder: (id: string) => Order | undefined;
  getInvoice: (id: string) => Invoice | undefined;
  getQuote: (id: string) => Quote | undefined;
  addCustomer: (c: Customer) => void;
  updateCustomer: (c: Customer) => void;
  deleteCustomer: (id: string) => void;
  addQuote: (q: Quote) => void;
  updateQuote: (q: Quote) => void;
  deleteQuote: (id: string) => void;
  addOrder: (o: Order) => void;
  updateOrder: (o: Order) => void;
  deleteOrder: (id: string) => void;
  addInvoice: (i: Invoice) => void;
  updateInvoice: (i: Invoice) => void;
  deleteInvoice: (id: string) => void;
  addShipment: (s: Shipment) => void;
  updateShipment: (s: Shipment) => void;
  deleteShipment: (id: string) => void;
  addGood: (g: Good) => void;
  updateGood: (g: Good) => void;
  deleteGood: (id: string) => void;
  updateSettings: (s: Partial<AppSettings>) => void;
}

const DataContext = createContext<DataContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, baseState);
  const [loading, setLoading] = React.useState(true);
  const fetched = useRef(false);

  // Load goods + settings from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const g = localStorage.getItem(LOCAL_GOODS_KEY);
      if (g) dispatch({ type: "SET_GOODS", payload: JSON.parse(g) as Good[] });
      const s = localStorage.getItem(LOCAL_SETTINGS_KEY);
      if (s) dispatch({ type: "UPDATE_SETTINGS", payload: JSON.parse(s) as Partial<AppSettings> });
    } catch { /* ignore */ }
  }, []);

  // Persist goods + settings to localStorage whenever they change
  useEffect(() => {
    if (typeof window === "undefined" || loading) return;
    try {
      localStorage.setItem(LOCAL_GOODS_KEY, JSON.stringify(state.goods));
      localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(state.settings));
    } catch { /* ignore */ }
  }, [state.goods, state.settings, loading]);

  // Fetch all CRM data from Airtable on mount
  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    fetch(apiPath("/api/bootstrap"))
      .then((r) => r.json())
      .then((data: { customers: Customer[]; quotes: Quote[]; orders: Order[]; invoices: Invoice[]; shipments: Shipment[] }) => {
        dispatch({ type: "HYDRATE_REMOTE", ...data });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // ─── CRUD ─────────────────────────────────────────────────────────────────

  const value: DataContextValue = {
    ...state, loading,
    getCustomer: (id) => state.customers.find((c) => c.id === id),
    getOrder: (id) => state.orders.find((o) => o.id === id),
    getInvoice: (id) => state.invoices.find((i) => i.id === id),
    getQuote: (id) => state.quotes.find((q) => q.id === id),

    addCustomer: (c) => {
      dispatch({ type: "ADD_CUSTOMER", payload: c });
      post<Customer>("/api/customers", c)
        .then((created) => dispatch({ type: "REPLACE_CUSTOMER", tempId: c.id, payload: created }))
        .catch(() => dispatch({ type: "DELETE_CUSTOMER", id: c.id }));
    },
    updateCustomer: (c) => {
      dispatch({ type: "UPDATE_CUSTOMER", payload: c });
      patch(`/api/customers/${c.id}`, c).catch(() => {});
    },
    deleteCustomer: (id) => {
      const snap = state.customers.find((c) => c.id === id);
      dispatch({ type: "DELETE_CUSTOMER", id });
      del(`/api/customers/${id}`).catch(() => { if (snap) dispatch({ type: "ADD_CUSTOMER", payload: snap }); });
    },

    addQuote: (q) => {
      dispatch({ type: "ADD_QUOTE", payload: q });
      post<Quote>("/api/quotes", q)
        .then((created) => dispatch({ type: "REPLACE_QUOTE", tempId: q.id, payload: created }))
        .catch(() => dispatch({ type: "DELETE_QUOTE", id: q.id }));
    },
    updateQuote: (q) => {
      dispatch({ type: "UPDATE_QUOTE", payload: q });
      patch(`/api/quotes/${q.id}`, q).catch(() => {});
    },
    deleteQuote: (id) => {
      const snap = state.quotes.find((q) => q.id === id);
      dispatch({ type: "DELETE_QUOTE", id });
      del(`/api/quotes/${id}`).catch(() => { if (snap) dispatch({ type: "ADD_QUOTE", payload: snap }); });
    },

    addOrder: (o) => {
      dispatch({ type: "ADD_ORDER", payload: o });
      post<Order>("/api/orders", o)
        .then((created) => dispatch({ type: "REPLACE_ORDER", tempId: o.id, payload: created }))
        .catch(() => dispatch({ type: "DELETE_ORDER", id: o.id }));
    },
    updateOrder: (o) => {
      dispatch({ type: "UPDATE_ORDER", payload: o });
      patch(`/api/orders/${o.id}`, o).catch(() => {});
    },
    deleteOrder: (id) => {
      const snap = state.orders.find((o) => o.id === id);
      dispatch({ type: "DELETE_ORDER", id });
      del(`/api/orders/${id}`).catch(() => { if (snap) dispatch({ type: "ADD_ORDER", payload: snap }); });
    },

    addInvoice: (i) => {
      dispatch({ type: "ADD_INVOICE", payload: i });
      post<Invoice>("/api/invoices", i)
        .then((created) => dispatch({ type: "REPLACE_INVOICE", tempId: i.id, payload: created }))
        .catch(() => dispatch({ type: "DELETE_INVOICE", id: i.id }));
    },
    updateInvoice: (i) => {
      dispatch({ type: "UPDATE_INVOICE", payload: i });
      patch(`/api/invoices/${i.id}`, i).catch(() => {});
    },
    deleteInvoice: (id) => {
      const snap = state.invoices.find((i) => i.id === id);
      dispatch({ type: "DELETE_INVOICE", id });
      del(`/api/invoices/${id}`).catch(() => { if (snap) dispatch({ type: "ADD_INVOICE", payload: snap }); });
    },

    addShipment: (s) => {
      dispatch({ type: "ADD_SHIPMENT", payload: s });
      post<Shipment>("/api/shipments", s)
        .then((created) => dispatch({ type: "REPLACE_SHIPMENT", tempId: s.id, payload: created }))
        .catch(() => dispatch({ type: "DELETE_SHIPMENT", id: s.id }));
    },
    updateShipment: (s) => {
      dispatch({ type: "UPDATE_SHIPMENT", payload: s });
      patch(`/api/shipments/${s.id}`, s).catch(() => {});
    },
    deleteShipment: (id) => {
      const snap = state.shipments.find((s) => s.id === id);
      dispatch({ type: "DELETE_SHIPMENT", id });
      del(`/api/shipments/${id}`).catch(() => { if (snap) dispatch({ type: "ADD_SHIPMENT", payload: snap }); });
    },

    // Local-only
    addGood: (g) => dispatch({ type: "ADD_GOOD", payload: g }),
    updateGood: (g) => dispatch({ type: "UPDATE_GOOD", payload: g }),
    deleteGood: (id) => dispatch({ type: "DELETE_GOOD", id }),
    updateSettings: (s) => dispatch({ type: "UPDATE_SETTINGS", payload: s }),
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within a DataProvider");
  return ctx;
}
