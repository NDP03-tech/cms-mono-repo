// src/app/(dashboard)/stock-out/new/page.tsx
"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { StockOutForm } from "@/components/features/stock-out/stock-out-form";

export default function NewStockOutPage() {
  return (
    <Suspense>
      <NewStockOutContent />
    </Suspense>
  );
}

function NewStockOutContent() {
  const searchParams = useSearchParams();
  const initialCustomerId = searchParams.get("customerId") ?? undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/stock-out"
          className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Tạo phiếu xuất kho
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Điền thông tin và thêm sản phẩm vào phiếu
          </p>
        </div>
      </div>

      <StockOutForm initialCustomerId={initialCustomerId} />
    </div>
  );
}
