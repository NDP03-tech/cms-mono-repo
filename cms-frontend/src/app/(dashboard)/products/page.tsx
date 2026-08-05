// src/app/(dashboard)/products/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductTable } from "@/components/features/products/product-table";
import { ProductSheet } from "@/components/features/products/product-sheet";
import { ProductDeleteDialog } from "@/components/features/products/product-delete-dialog";
import { Product } from "@/types/product.types";

// ----------------------------------------------------------------
// Mock data — xóa khi kết nối BE thật
// ----------------------------------------------------------------
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    sku: "SP-001",
    name: "Áo thun nam cổ tròn",
    unit: "cái",
    costPrice: 150000,
    currency: "VND",
    isActive: true,
  },
  {
    id: "2",
    sku: "SP-002",
    name: "Quần jean nam slim fit",
    unit: "cái",
    costPrice: 350000,
    currency: "VND",
    isActive: true,
  },
  {
    id: "3",
    sku: "SP-003",
    name: "Giày thể thao Nike",
    unit: "đôi",
    costPrice: 850000,
    currency: "VND",
    isActive: true,
  },
  {
    id: "4",
    sku: "SP-004",
    name: "Áo polo nữ",
    unit: "cái",
    costPrice: 200000,
    currency: "VND",
    isActive: false,
  },
  {
    id: "5",
    sku: "SP-005",
    name: "Túi xách da thật",
    unit: "cái",
    costPrice: 1200000,
    currency: "VND",
    isActive: true,
  },
  {
    id: "6",
    sku: "SP-006",
    name: "Mũ lưỡi trai",
    unit: "cái",
    costPrice: 95000,
    currency: "VND",
    isActive: true,
  },
];

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  // Filter locally từ mock data
  useEffect(() => {
    let filtered = allProducts;

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((p) =>
        statusFilter === "active" ? p.isActive : !p.isActive,
      );
    }

    setProducts(filtered);
  }, [search, statusFilter, allProducts]);

  // Khi kết nối BE thật thì dùng cái này thay thế useEffect trên
  const fetchProducts = useCallback(async () => {
    // setIsLoading(true);
    // try {
    //   const data = await productService.list({ name: search, isActive: ... });
    //   setAllProducts(data);
    // } catch {
    //   setAllProducts([]);
    // } finally {
    //   setIsLoading(false);
    // }
  }, []);

  function handleEdit(product: Product) {
    setEditProduct(product);
    setSheetOpen(true);
  }

  function handleDelete(product: Product) {
    setDeleteProduct(product);
    setDeleteOpen(true);
  }

  function handleAddNew() {
    setEditProduct(null);
    setSheetOpen(true);
  }

  // Mock create
  function handleSheetSuccess(product?: Product) {
    if (editProduct) {
      // Update
      setAllProducts((prev) =>
        prev.map((p) => (p.id === editProduct.id ? { ...p, ...product } : p)),
      );
    } else {
      // Create — thêm vào đầu list với id tạm
      const newProduct: Product = {
        id: Date.now().toString(),
        sku: product?.sku ?? "",
        name: product?.name ?? "",
        unit: product?.unit ?? "",
        costPrice: product?.costPrice ?? 0,
        currency: product?.currency ?? "VND",
        isActive: true,
      };
      setAllProducts((prev) => [newProduct, ...prev]);
    }
    setSheetOpen(false);
  }

  // Mock delete
  function handleDeleteSuccess() {
    if (deleteProduct) {
      setAllProducts((prev) => prev.filter((p) => p.id !== deleteProduct.id));
    }
    setDeleteOpen(false);
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Sản phẩm</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Quản lý danh mục sản phẩm
          </p>
        </div>
        <Button
          onClick={handleAddNew}
          size="sm"
          className="h-9 bg-slate-900 hover:bg-slate-800 text-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm sản phẩm
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Tìm theo tên, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm border-slate-200"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] h-9 text-sm border-slate-200">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="active">Đang bán</SelectItem>
            <SelectItem value="inactive">Ngừng bán</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-slate-400 ml-auto">
          {products.length} sản phẩm
        </p>
      </div>

      {/* Table */}
      <ProductTable
        products={products}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Create / Edit Sheet */}
      <ProductSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSuccess={handleSheetSuccess}
        product={editProduct}
      />

      {/* Delete Dialog */}
      <ProductDeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onSuccess={handleDeleteSuccess}
        product={deleteProduct}
      />
    </div>
  );
}
