// src/services/report.service.ts
import api from "@/lib/axios";
import type {
  SalesSummary,
  SalesSummaryFilters,
  TopCustomerRow,
  TopProductRow,
  InventoryValuation,
  StockInSummary,
  StockInSummaryFilters,
  StockInBySupplierRow,
  InventoryMovementFilters,
  InventoryMovementRow,
  LowStockRow,
  DashboardOverview,
  DashboardOverviewFilters,
} from "@/types/report.types";

export const reportService = {
  // ===== Tổng quan =====
  async overview(
    filters?: DashboardOverviewFilters,
  ): Promise<DashboardOverview> {
    const { data } = await api.get<DashboardOverview>("/reports/overview", {
      params: filters,
    });
    return data;
  },

  // ===== Xuất kho =====
  async salesSummary(filters?: SalesSummaryFilters): Promise<SalesSummary> {
    const { data } = await api.get<SalesSummary>("/reports/sales-summary", {
      params: filters,
    });
    return data;
  },

  async topCustomers(limit = 10): Promise<TopCustomerRow[]> {
    const { data } = await api.get<TopCustomerRow[]>("/reports/top-customers", {
      params: { limit },
    });
    return data ?? [];
  },

  async topProducts(limit = 10): Promise<TopProductRow[]> {
    const { data } = await api.get<TopProductRow[]>("/reports/top-products", {
      params: { limit },
    });
    return data ?? [];
  },

  // ===== Nhập kho =====
  async stockInSummary(
    filters?: StockInSummaryFilters,
  ): Promise<StockInSummary> {
    const { data } = await api.get<StockInSummary>(
      "/reports/stock-in-summary",
      {
        params: filters,
      },
    );
    return data;
  },

  async stockInBySupplier(limit = 10): Promise<StockInBySupplierRow[]> {
    const { data } = await api.get<StockInBySupplierRow[]>(
      "/reports/stock-in-by-supplier",
      { params: { limit } },
    );
    return data ?? [];
  },

  // ===== Tồn kho =====
  async inventoryValuation(): Promise<InventoryValuation> {
    const { data } = await api.get<InventoryValuation>(
      "/reports/inventory-valuation",
    );
    return data;
  },

  async inventoryMovement(
    filters?: InventoryMovementFilters,
  ): Promise<InventoryMovementRow[]> {
    const { data } = await api.get<InventoryMovementRow[]>(
      "/reports/inventory-movement",
      { params: filters },
    );
    return data ?? [];
  },

  async lowStock(threshold = 10): Promise<LowStockRow[]> {
    const { data } = await api.get<LowStockRow[]>("/reports/low-stock", {
      params: { threshold },
    });
    return data ?? [];
  },
};
