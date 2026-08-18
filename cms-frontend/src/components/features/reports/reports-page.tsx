// src/components/reports/reports-page.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { OverviewTab } from "./overview-tab";
import { StockInTab } from "./stock-in-tab";
import { StockOutTab } from "./stock-out-tab";
import { InventoryTab } from "./inventory-tab";
import type { GroupBy } from "./shared";

export function ReportsPage() {
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [groupBy, setGroupBy] = useState<GroupBy>("day");

  const filters = {
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
    groupBy,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Báo cáo</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Tổng quan nhập - xuất - tồn kho
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-9 border-slate-200 text-slate-600"
        >
          <DownloadIcon className="h-4 w-4 mr-2" />
          Xuất báo cáo
        </Button>
      </div>

      <div className="flex items-end gap-3 bg-white rounded-lg border border-slate-200 p-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Từ ngày
          </Label>
          <Input
            type="date"
            className="h-9 border-slate-200 text-sm w-[160px]"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Đến ngày
          </Label>
          <Input
            type="date"
            className="h-9 border-slate-200 text-sm w-[160px]"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Nhóm theo
          </Label>
          <div className="flex gap-1">
            {(["day", "week", "month"] as GroupBy[]).map((g) => (
              <button
                key={g}
                onClick={() => setGroupBy(g)}
                className={
                  "h-9 px-3 rounded-md text-sm border transition-colors " +
                  (groupBy === g
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50")
                }
              >
                {g === "day" ? "Ngày" : g === "week" ? "Tuần" : "Tháng"}
              </button>
            ))}
          </div>
        </div>
        {(fromDate || toDate) && (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 text-slate-500 hover:text-slate-900"
            onClick={() => {
              setFromDate("");
              setToDate("");
            }}
          >
            Xóa lọc
          </Button>
        )}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="stock-in">Nhập kho</TabsTrigger>
          <TabsTrigger value="stock-out">Xuất kho</TabsTrigger>
          <TabsTrigger value="inventory">Tồn kho</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab filters={filters} />
        </TabsContent>
        <TabsContent value="stock-in">
          <StockInTab filters={filters} />
        </TabsContent>
        <TabsContent value="stock-out">
          <StockOutTab filters={filters} />
        </TabsContent>
        <TabsContent value="inventory">
          <InventoryTab filters={filters} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
