// src/app/(dashboard)/page.tsx
import {
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Plus,
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    label: "Tổng sản phẩm",
    value: "1,284",
    sub: "+12 tháng này",
    icon: Package,
  },
  {
    label: "Nhập kho hôm nay",
    value: "8",
    sub: "3 chờ duyệt",
    icon: ArrowDownToLine,
  },
  {
    label: "Xuất kho hôm nay",
    value: "5",
    sub: "1 chờ duyệt",
    icon: ArrowUpFromLine,
  },
  {
    label: "Giá trị tồn kho",
    value: "2.4 tỷ",
    sub: "VND",
    icon: DollarSign,
  },
];

const recentStockIn = [
  {
    code: "PN-20240115-001",
    supplier: "Công ty Dệt may HN",
    items: 3,
    total: "4.500.000",
    status: "approved",
  },
  {
    code: "PN-20240115-002",
    supplier: "Xưởng may Sài Gòn",
    items: 5,
    total: "12.000.000",
    status: "pending",
  },
  {
    code: "PN-20240114-003",
    supplier: "Công ty Dệt may HN",
    items: 2,
    total: "3.200.000",
    status: "approved",
  },
  {
    code: "PN-20240114-002",
    supplier: "Nhà cung cấp ABC",
    items: 8,
    total: "25.000.000",
    status: "draft",
  },
  {
    code: "PN-20240113-001",
    supplier: "Xưởng may Sài Gòn",
    items: 4,
    total: "8.400.000",
    status: "approved",
  },
];

const lowStockItems = [
  { name: "Áo thun nam S", sku: "SP-001", quantity: 3 },
  { name: "Quần jean nam 32", sku: "SP-015", quantity: 5 },
  { name: "Giày thể thao 42", sku: "SP-089", quantity: 2 },
  { name: "Áo polo nữ M", sku: "SP-034", quantity: 4 },
  { name: "Túi xách da", sku: "SP-112", quantity: 1 },
];

const statusMap: Record<string, { label: string; className: string }> = {
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
};

export default function DashboardPage() {
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? "Chào buổi sáng"
      : hour < 18
        ? "Chào buổi chiều"
        : "Chào buổi tối";

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

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => {
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
                <p className="text-2xl font-semibold text-slate-900">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
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
                  key={item.code}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3 text-xs font-mono text-slate-600">
                    {item.code}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {item.supplier}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {item.items} mặt hàng
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {item.total}đ
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
        </div>

        {/* Low Stock Alert — 1/3 width */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-200">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <h2 className="text-sm font-medium text-slate-900">
              Cảnh báo tồn kho thấp
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {lowStockItems.map((item) => (
              <div
                key={item.sku}
                className="flex items-center justify-between px-6 py-3 hover:bg-slate-50 transition-colors"
              >
                <div>
                  <p className="text-sm text-slate-700">{item.name}</p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {item.sku}
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
