// src/components/features/suppliers/supplier-table.tsx
"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Supplier } from "@/types/supplier.types";

interface SupplierTableProps {
  suppliers: Supplier[];
  isLoading: boolean;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
  canManage: boolean;
}

export function SupplierTable({
  suppliers,
  isLoading,
  onEdit,
  onDelete,
  canManage,
}: SupplierTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {[
                "Tên nhà cung cấp",
                "Số điện thoại",
                "Email",
                "Địa chỉ",
                "Trạng thái",
                "",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {Array.from({ length: 6 }).map((_, j) => (
                  <td key={j} className="px-4 py-3">
                    <Skeleton className="h-4 w-full bg-slate-100" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (suppliers.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center mb-4">
            <span className="text-2xl">🚚</span>
          </div>
          <p className="text-sm font-medium text-slate-900">
            Chưa có nhà cung cấp nào
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Thêm nhà cung cấp đầu tiên để bắt đầu
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                Tên nhà cung cấp
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                Số điện thoại
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                Địa chỉ
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                Trạng thái
              </th>
              <th className="px-4 py-3 w-[80px]" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {suppliers.map((supplier) => (
              <tr
                key={supplier.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-4 py-3 text-sm text-slate-700 font-medium">
                  {supplier.name}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {supplier.phone || "—"}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {supplier.email || "—"}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600 max-w-[200px] truncate">
                  {supplier.address || "—"}
                </td>
                <td className="px-4 py-3">
                  {supplier.isActive ? (
                    <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                      Hoạt động
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/20">
                      Ngừng hợp tác
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    {canManage && (
                      <>
                        <button
                          onClick={() => onEdit(supplier)}
                          className="h-7 w-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(supplier)}
                          className="h-7 w-7 flex items-center justify-center rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
