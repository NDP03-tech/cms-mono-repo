// src/app/(dashboard)/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Plus,
  Loader2,
} from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

import { productService } from "@/services/product.service";
import { stockInService } from "@/services/stock-in.service";
import { stockOutService } from "@/services/stock-out.service";
import { inventoryService } from "@/services/inventory.service";

import type { StockIn, StockInStatus } from "@/types/stock-in.types";
import type { InventoryBalance } from "@/types/inventory.types";

const statusMap: Record<StockInStatus, { label: string; className: string }> = {
  approved: {
    label: "Đã duyệt",
    className:
      "inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
  },
  pending: {
    label: "Chờ duyệt",
    className:
      "inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20",
  },
  draft: {
    label: "Nháp",
    className:
      "inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20",
  },
  rejected: {
    label: "Từ chối",
    className:
      "inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20",
  },
};

function isSameLocalDay(isoDate: string, reference: Date): boolean {
  const d = new Date(isoDate);
  return (
    d.getFullYear() === reference.getFullYear() &&
    d.getMonth() === reference.getMonth() &&
    d.getDate() === reference.getDate()
  );
}

function startOfDayISO(reference: Date): string {
  const d = new Date(reference);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function endOfDayISO(reference: Date): string {
  const d = new Date(reference);
  d.setHours(23, 59, 59, 999);
  return d.toISOString();
}

interface DashboardStats {
  productCount: number;
  stockInToday: number;
  stockInTodayPending: number;
  stockOutToday: number;
  stockOutTodayPending: number;
  // Tổng giá trị tồn kho gộp theo currency — sản phẩm có thể ở nhiều loại
  // tiền khác nhau nên không cộng dồn thành 1 con số duy nhất một cách mù
  // quáng. Hiển thị currency chiếm giá trị lớn nhất làm số chính.
  inventoryValueByCurrency: { currency: string; total: number }[];
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentStockIn, setRecentStockIn] = useState<StockIn[]>([]);
  const [lowStockItems, setLowStockItems] = useState<InventoryBalance[]>([]);

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? "Chào buổi sáng"
      : hour < 18
        ? "Chào buổi chiều"
        : "Chào buổi tối";

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const today = new Date();

        const [products, stockIns, stockOutsToday, balances] =
          await Promise.all([
            productService.list(),
            // StockInFilters chưa hỗ trợ lọc theo ngày (BE), nên phải lấy
            // toàn bộ rồi tự lọc "hôm nay" ở FE.
            stockInService.list(),
            stockOutService.list({
              fromDate: startOfDayISO(today),
              toDate: endOfDayISO(today),
            }),
            // Không truyền filter -> lấy toàn bộ tồn kho để tính giá trị
            // và tìm hàng sắp hết.
            inventoryService.listBalances(),
          ]);

        if (!active) return;

        const stockInsToday = stockIns.filter((s) =>
          isSameLocalDay(s.createdAt, today),
        );

        // Giá trị tồn kho = tổng (quantity * costPrice) của từng sản phẩm,
        // gộp theo currency của sản phẩm đó.
        const costByProductId = new Map(
          products.map((p) => [
            p.id,
            { costPrice: p.costPrice, currency: p.currency },
          ]),
        );
        const valueByCurrency = new Map<string, number>();
        for (const balance of balances) {
          const cost = costByProductId.get(balance.productId);
          if (!cost) continue;
          const value = balance.quantity * cost.costPrice;
          valueByCurrency.set(
            cost.currency,
            (valueByCurrency.get(cost.currency) ?? 0) + value,
          );
        }
        const inventoryValueByCurrency = Array.from(valueByCurrency.entries())
          .map(([currency, total]) => ({ currency, total }))
          .sort((a, b) => b.total - a.total);

        setStats({
          productCount: products.length,
          stockInToday: stockInsToday.length,
          stockInTodayPending: stockInsToday.filter(
            (s) => s.status === "pending",
          ).length,
          stockOutToday: stockOutsToday.length,
          stockOutTodayPending: stockOutsToday.filter(
            (s) => s.status === "pending",
          ).length,
          inventoryValueByCurrency,
        });

        setRecentStockIn(
          [...stockIns]
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )
            .slice(0, 5),
        );

        setLowStockItems(
          [...balances]
            .filter((b) => b.quantity <= 10)
            .sort((a, b) => a.quantity - b.quantity)
            .slice(0, 5),
        );
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        if (active) {
          setError("Không thể tải dữ liệu tổng quan. Vui lòng thử lại.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const primaryInventoryValue = stats?.inventoryValueByCurrency[0];
  const otherCurrenciesCount =
    (stats?.inventoryValueByCurrency.length ?? 0) - 1;

  const statCards = [
    {
      label: "Tổng sản phẩm",
      value: stats ? stats.productCount.toLocaleString("vi-VN") : "—",
      sub: undefined,
      icon: Package,
    },
    {
      label: "Nhập kho hôm nay",
      value: stats ? String(stats.stockInToday) : "—",
      sub: stats ? `${stats.stockInTodayPending} chờ duyệt` : undefined,
      icon: ArrowDownToLine,
    },
    {
      label: "Xuất kho hôm nay",
      value: stats ? String(stats.stockOutToday) : "—",
      sub: stats ? `${stats.stockOutTodayPending} chờ duyệt` : undefined,
      icon: ArrowUpFromLine,
    },
    {
      label: "Giá trị tồn kho",
      value: primaryInventoryValue
        ? primaryInventoryValue.total.toLocaleString("vi-VN")
        : "0",
      sub: primaryInventoryValue
        ? `${primaryInventoryValue.currency}${
            otherCurrenciesCount > 0
              ? ` + ${otherCurrenciesCount} loại tiền khác`
              : ""
          }`
        : undefined,
      icon: DollarSign,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            {greeting}, Admin 👋
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Đây là tổng quan hệ thống hôm nay
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/stock-in/new"
            className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-slate-900 text-white text-sm hover:bg-slate-800 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nhập kho
          </Link>
          <Link
            href="/stock-out/new"
            className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-white border border-slate-200 text-slate-700 text-sm hover:bg-slate-50 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Xuất kho
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-lg border border-slate-200 p-6"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  {stat.label}
                </p>
                <div className="h-8 w-8 rounded-md bg-slate-100 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-slate-600" />
                </div>
              </div>
              <div className="mt-3">
                {loading ? (
                  <Skeleton className="h-8 w-20 bg-slate-100" />
                ) : (
                  <p className="text-2xl font-semibold text-slate-900">
                    {stat.value}
                  </p>
                )}
                {stat.sub && (
                  <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Recent Stock In — 2/3 width */}
        <div className="col-span-2 bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-slate-500" />
              <h2 className="text-sm font-medium text-slate-900">
                Phiếu nhập gần đây
              </h2>
            </div>
            <Link
              href="/stock-in"
              className="text-xs text-slate-500 hover:text-slate-900 transition-colors"
            >
              Xem tất cả →
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
            </div>
          ) : recentStockIn.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-400">
              Chưa có phiếu nhập nào
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Mã phiếu
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Nhà cung cấp
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Mặt hàng
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Tổng tiền
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentStockIn.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs font-mono text-slate-600">
                      <Link
                        href={`/stock-in/${item.id}`}
                        className="hover:text-slate-900 hover:underline"
                      >
                        {item.code}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {item.supplierName}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {item.items.length} mặt hàng
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {item.totalAmount.toLocaleString("vi-VN")} {item.currency}
                    </td>
                    <td className="px-4 py-3">
                      <span className={statusMap[item.status].className}>
                        {statusMap[item.status].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Low Stock Alert — 1/3 width */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-200">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <h2 className="text-sm font-medium text-slate-900">
              Cảnh báo tồn kho thấp
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
            </div>
          ) : lowStockItems.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-400">
              Không có hàng sắp hết
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-6 py-3 hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <p className="text-sm text-slate-700">{item.productName}</p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {item.productSku}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      item.quantity <= 2 ? "text-red-600" : "text-amber-600"
                    }`}
                  >
                    {item.quantity}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="px-6 py-3 border-t border-slate-200">
            <Link
              href="/inventory?maxQuantity=10"
              className="text-xs text-slate-500 hover:text-slate-900 transition-colors"
            >
              Xem tất cả hàng sắp hết →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
