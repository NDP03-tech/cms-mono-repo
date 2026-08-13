"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { stockOutService } from "@/services/stock-out.service";
import type { Customer } from "@/types/customer.types";

interface StockOutFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId: string;
  /** Truyền khi tạo từ trang chi tiết khách hàng — khoá sẵn customer, ẩn select. */
  fixedCustomer?: Customer;
  /** Danh sách khách hàng để chọn, dùng khi không có fixedCustomer (trang Stock-out chung). */
  customers?: Customer[];
  onCreated: (stockOutId: string) => void;
}

const CURRENCIES = ["VND", "USD"];

export function StockOutFormSheet({
  open,
  onOpenChange,
  currentUserId,
  fixedCustomer,
  customers = [],
  onCreated,
}: StockOutFormSheetProps) {
  const [customerId, setCustomerId] = useState(fixedCustomer?.id ?? "");
  const [currency, setCurrency] = useState("VND");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setCustomerId(fixedCustomer?.id ?? "");
      setCurrency("VND");
      setError(null);
    }
  }, [open, fixedCustomer]);

  const handleCreate = async () => {
    if (!customerId) return setError("Please select a customer");
    setError(null);
    setSubmitting(true);
    try {
      // Tạo stock-out DRAFT không kèm item — item sẽ được thêm ở bước tiếp theo
      // qua endpoint POST /stock-out/:id/items (StockOutItemEditor).
      const id = await stockOutService.create({
        customerId,
        createdBy: currentUserId,
        currency,
        items: [],
      });
      onOpenChange(false);
      onCreated(id);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Could not create stock-out");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md bg-white">
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold text-slate-900">
            New stock-out
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4 py-6">
          {fixedCustomer ? (
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Customer
              </Label>
              <div className="h-9 flex items-center px-3 rounded-md border border-slate-200 bg-slate-50 text-sm text-slate-700">
                {fixedCustomer.name}
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Customer
              </Label>
              <Select value={customerId} onValueChange={setCustomerId}>
                <SelectTrigger className="h-9 text-sm border-slate-200">
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Currency
            </Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="h-9 text-sm border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <p className="text-xs text-slate-400">
            The stock-out is created as a draft. You can add items and submit it
            for approval on the next screen.
          </p>

          {error && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {error}
            </p>
          )}
        </div>

        <SheetFooter className="gap-2">
          <Button
            variant="outline"
            className="h-9 border-slate-200 text-slate-700 hover:bg-slate-50"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="h-9 bg-slate-900 text-white hover:bg-slate-800"
            disabled={submitting}
            onClick={handleCreate}
          >
            {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Create draft
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
