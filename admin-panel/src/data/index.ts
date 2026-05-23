import type { AppState } from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/constants";
import { customers } from "./customers";
import { quotes } from "./quotes";
import { orders } from "./orders";
import { invoices } from "./invoices";
import { shipments } from "./shipments";
import { goods } from "./goods";

export const initialState: AppState = {
  customers,
  quotes,
  orders,
  invoices,
  shipments,
  goods,
  settings: DEFAULT_SETTINGS,
};

export { customers, quotes, orders, invoices, shipments, goods };
