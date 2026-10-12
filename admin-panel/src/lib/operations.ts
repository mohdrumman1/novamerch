export const CUSTOMER_VISIBLE_STATUSES = ["Pending", "In Production", "Partially Dispatched", "In Transit", "Partially Delivered", "Delivered", "Delayed"] as const;

export function canReleaseToSupplier(approvalStatus: string, specificationVersion: number | undefined) {
  return approvalStatus === "Approved" && typeof specificationVersion === "number" && specificationVersion > 0;
}

export function feedbackDueAt(deliveredAt: string) {
  const date = new Date(deliveredAt);
  date.setUTCDate(date.getUTCDate() + 7);
  return date.toISOString();
}

export function safeCustomerOrderView(input: Record<string, unknown>) {
  return {
    orderRef: input.orderRef,
    products: input.products ?? [],
    status: input.status ?? "Pending",
    estimatedDelivery: input.estimatedDelivery ?? null,
    shipments: input.shipments ?? [],
    updates: input.updates ?? [],
    contactUrl: "/contact",
  };
}
