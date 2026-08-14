// src/components/features/customers/customer-detail.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Package,
  Pencil,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { customerService } from "@/services/customer.service";
import { useStockOuts } from "@/hooks/use-stock-outs";
import { StockOutTable } from "@/components/features/stock-out/stock-out-table";
import { StockOutSubmitDialog } from "@/components/features/stock-out/stock-out-submit-dialog";
import { StockOutApproveDialog } from "@/components/features/stock-out/stock-out-approve-dialog";
import { StockOutRejectDialog } from "@/components/features/stock-out/stock-out-reject-dialog";
import type { Customer } from "@/types/customer.types";
import type { StockOut } from "@/types/stock-out.types";

// TODO: thay bằng session hook thật — quyết định có hiện nút Duyệt/Từ chối hay không.
const CURRENT_USER_IS_ADMIN = true;

interface CustomerDetailProps {
  customerId: string;
  onEdit: (customer: Customer) => void;
}

export function CustomerDetail({ customerId, onEdit }: CustomerDetailProps) {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loadingCustomer, setLoadingCustomer] = useState(true);

  const {
    data: stockOuts,
    loading: loadingStockOuts,
    refetch,
  } = useStockOuts({ customerId });

  const [submitTarget, setSubmitTarget] = useState<StockOut | null>(null);
  const [approveTarget, setApproveTarget] = useState<StockOut | null>(null);
  const [rejectTarget, setRejectTarget] = useState<StockOut | null>(null);

  useEffect(() => {
    let active = true;
    setLoadingCustomer(true);
    customerService
      .getById(customerId)
      .then((data) => active && setCustomer(data))
      .finally(() => active && setLoadingCustomer(false));
    return () => {
      active = false;
    };
  }, [customerId]);

  const totalApprovedValue = stockOuts
    .filter((s) => s.status === "approved")
    .reduce((sum, s) => sum + s.totalAmount, 0);

  function handleDialogSuccess() {
    refetch();
  }

  if (loadingCustomer || !customer) {
    return (
      <div className="p-6 space-y-3">
        <div className="h-8 w-64 rounded-md bg-slate-100 animate-pulse" />
        <div className="h-24 w-full rounded-lg bg-slate-100 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 rounded-md"
            onClick={() => router.push("/customers")}
          >
            <ArrowLeft className="h-4 w-4 text-slate-600" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-slate-900">
                {customer.name}
              </h1>
              <span
                className={
                  customer.isActive
                    ? "inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                    : "inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/20"
                }
              >
                {customer.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              Hồ sơ khách hàng và lịch sử xuất kho
            </p>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="h-9 border-slate-200 text-slate-700 hover:bg-slate-50"
          onClick={() => onEdit(customer)}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Sửa khách hàng
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5" /> Điện thoại
          </p>
          <p className="text-sm text-slate-900 mt-2">{customer.phone || "—"}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" /> Email
          </p>
          <p className="text-sm text-slate-900 mt-2">{customer.email || "—"}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" /> Địa chỉ
          </p>
          <p className="text-sm text-slate-900 mt-2">
            {customer.address || "—"}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
            <Package className="h-3.5 w-3.5" /> Tổng giá trị đã duyệt
          </p>
          <p className="text-sm text-slate-900 mt-2">
            {new Intl.NumberFormat("vi-VN").format(totalApprovedValue)} ₫
          </p>
        </div>
      </div>

      <Separator className="bg-slate-200" />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-slate-900">
            Lịch sử xuất kho{" "}
            <span className="text-slate-400 font-normal">
              ({stockOuts.length})
            </span>
          </h2>
          <Button
            size="sm"
            className="h-9 bg-slate-900 hover:bg-slate-800"
            onClick={() =>
              router.push(`/stock-out/new?customerId=${customer.id}`)
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Tạo phiếu xuất
          </Button>
        </div>

        {loadingStockOuts ? (
          <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-9 w-full rounded-md bg-slate-100 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <StockOutTable
            stockOuts={stockOuts}
            showCustomerColumn={false}
            onView={(s) => router.push(`/stock-out/${s.id}`)}
            onSubmit={(s) => setSubmitTarget(s)}
            onApprove={(s) => setApproveTarget(s)}
            onReject={(s) => setRejectTarget(s)}
          />
        )}
      </div>

      <StockOutSubmitDialog
        stockOut={submitTarget}
        open={!!submitTarget}
        onOpenChange={(open) => !open && setSubmitTarget(null)}
        onSuccess={handleDialogSuccess}
      />
      <StockOutApproveDialog
        stockOut={approveTarget}
        open={!!approveTarget}
        onOpenChange={(open) => !open && setApproveTarget(null)}
        onSuccess={handleDialogSuccess}
      />
      <StockOutRejectDialog
        stockOut={rejectTarget}
        open={!!rejectTarget}
        onOpenChange={(open) => !open && setRejectTarget(null)}
        onSuccess={handleDialogSuccess}
      />
    </div>
  );
}
