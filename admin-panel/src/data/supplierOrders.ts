import type { SupplierOrder } from "@/lib/types";

export const supplierOrders: SupplierOrder[] = [
  {
    id: "supplier-order-001",
    orderNumber: "309939247501026460",
    orderDate: "2026-08-06",
    supplierName: "Jinan Runhang Textile Co., Ltd.",
    supplierContactName: "Vicki Gao",
    supplierPhone: "15318818819",
    supplierEmail: "vicki@jnrhtex.com",
    supplierAddress: "CN, Shandong, Jinan, Zhangqiu Chuangye Park",
    storeUrl:
      "https://www.alibaba.com/product-detail/Factory-Custom-50-50-Polyester-Cotton_1601389404865.html?spm=a2756.trade-list-buyer.0.0.289276e95im2Bl",
    shipFrom: "CN",
    shippingMethod: "Air freight",
    incoterms: "CIF",
    itemSubtotalUsd: 1584.6,
    shippingFeeUsd: 1000.0,
    totalUsd: 2584.6,
    initialPaymentUsd: 1292.3,
    initialPaymentDate: "2026-08-12",
    balanceUsd: 1292.3,
    balanceStatus: "No payment record yet",
    relatedCustomer: "Cooks Hill",
    items: [
      {
        id: "soi-001-1",
        productName:
          "Factory Directly Wholesale Active Wear Custom 100% Polyester White Women Short Sleeve Polo T Shirt",
        unitPriceUsd: 2.78,
        qty: 57,
        totalUsd: 158.46,
      },
      {
        id: "soi-001-2",
        productName:
          "Custom Print 100% Cotton Plain Slim Fit Fashion Blank Black t Shirts Super Soft Luxury Heather Color Men's T-shirt",
        unitPriceUsd: 2.78,
        qty: 57,
        totalUsd: 158.46,
      },
      {
        id: "soi-001-3",
        productName:
          "Custom Printing Polyester Cotton Interlock Dry Fit Sports Men's T-shirts High Quality logo Print Moisture Wicking Mesh t Shirt",
        unitPriceUsd: 2.78,
        qty: 57,
        totalUsd: 158.46,
      },
      {
        id: "soi-001-4",
        productName:
          "Custom Embroidered logo 100% Cotton Kids School Uniforms Short Sleeve Polo Shirt",
        unitPriceUsd: 2.78,
        qty: 57,
        totalUsd: 158.46,
      },
      {
        id: "soi-001-5",
        productName:
          "Custom t Shirt Shorts Set Cotton Polyester Blend Plain Dyed Men's 2 Piece Shorts and t Shirt Set",
        unitPriceUsd: 2.78,
        qty: 57,
        totalUsd: 158.46,
      },
      {
        id: "soi-001-6",
        productName:
          "Factory Custom Soft Comfortable 100% Cotton T-shirts Men's Silk Screen Printing Logo Design Short Sleeve Unisex T-shirts",
        unitPriceUsd: 2.78,
        qty: 57,
        totalUsd: 158.46,
      },
    ],
    notes:
      "Order shows 10 line items total (View all items (10)); only 6 were captured with names. All 10 follow the same pattern: USD 2.78/pc, 57 qty each, product qty 570.00, item subtotal USD 1,584.60. Shipping address: Nova Merch, +61 422 518 149, 11 Redmond Circuit, Cameron Park, NSW 2285, Australia. Attached: 570 pcs T Shirts Deposit Proforma Invoice.pdf (on Alibaba order page, not saved locally). Initial payment (USD 1,292.30) paid by card on 2026-08-12 at 01:27:52. Remaining balance (USD 1,292.30), estimated A$1,849.51, awaiting payment.",
  },
];
