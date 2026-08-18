// src/types/report.types.ts
//
// Khớp với output của ReportsController (BE) — DTO thuần cho aggregate query,
// không phải entity domain.

export interface SalesSummaryPoint {
  period: string; // ISO date
  revenue: number;
  orderCount: number;
}

export interface SalesSummary {
  points: SalesSummaryPoint[];
  totalRevenue: number;
  totalOrders: number;
}

export interface TopCustomerRow {
  customerId: string;
  customerName: string;
  revenue: number;
  orderCount: number;
}

export interface TopProductRow {
  productId: string;
  productName: string;
  sku: string;
  totalQuantity: number;
  totalRevenue: number;
}

export interface InventoryValuationRow {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  costPrice: number;
  currency: string;
  value: number;
}

export interface InventoryValuation {
  rows: InventoryValuationRow[];
  totalValue: number;
}

export interface SalesSummaryFilters {
  fromDate?: string;
  toDate?: string;
  groupBy?: "day" | "week" | "month";
}

// ===== Mới: Nhập kho =====

export interface StockInSummaryFilters {
  fromDate?: string;
  toDate?: string;
  groupBy?: "day" | "week" | "month";
}

export interface StockInSummaryPoint {
  period: string;
  value: number;
  voucherCount: number;
}

export interface StockInSummary {
  points: StockInSummaryPoint[];
  totalValue: number;
  totalVouchers: number;
}

export interface StockInBySupplierRow {
  supplierId: string;
  supplierName: string;
  value: number;
  voucherCount: number;
}

// ===== Mới: Tồn kho =====

export interface InventoryMovementFilters {
  fromDate?: string;
  toDate?: string;
}

export interface InventoryMovementRow {
  productId: string;
  productName: string;
  sku: string;
  openingQuantity: number;
  inQuantity: number;
  outQuantity: number;
  closingQuantity: number;
}

export interface LowStockRow {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  threshold: number;
  status: "low" | "out";
}

// ===== Mới: Tổng quan =====

export interface DashboardOverviewFilters {
  fromDate?: string;
  toDate?: string;
}

export interface DashboardOverview {
  totalStockInValue: number;
  totalStockOutValue: number;
  stockInVoucherCount: number;
  stockOutVoucherCount: number;
  productsInStockCount: number;
  totalInventoryValue: number;
}
