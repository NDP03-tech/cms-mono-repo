// src/app/(dashboard)/stock-in/new/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import { StockInForm } from "@/components/features/stock-in/stock-in-form";

export default function NewStockInPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-start gap-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Tạo phiếu nhập kho
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Tạo phiếu nhập hàng từ nhà cung cấp
          </p>
        </div>
      </div>

      <StockInForm currency="VND" />
    </div>
  );
}
