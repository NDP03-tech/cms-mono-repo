// src/components/layout/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Truck,
  Users,
  ArrowDownToLine,
  ArrowUpFromLine,
  BarChart3,
  LogOut,
  Boxes,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";

const navItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Sản phẩm",
    href: "/products",
    icon: Package,
  },
  {
    label: "Nhà cung cấp",
    href: "/suppliers",
    icon: Truck,
  },
  {
    label: "Khách hàng",
    href: "/customers",
    icon: Users,
  },
  {
    label: "Phiếu nhập",
    href: "/stock-in",
    icon: ArrowDownToLine,
  },
  {
    label: "Phiếu xuất",
    href: "/stock-out",
    icon: ArrowUpFromLine,
  },
  {
    label: "Tồn kho",
    href: "/inventory",
    icon: Boxes,
  },
  {
    label: "Báo cáo",
    href: "/reports",
    icon: BarChart3,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    authService.logout();
    router.push("/login");
  }

  return (
    <aside className="w-60 bg-white border-r border-slate-200 flex flex-col min-h-screen">
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-md bg-slate-900 flex items-center justify-center">
            <Boxes className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-slate-900">
            CMS Kho hàng
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-slate-100 text-slate-900 font-medium"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
