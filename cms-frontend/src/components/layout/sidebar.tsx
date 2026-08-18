// src/components/layout/sidebar.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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

function getCurrentUserRole(): string | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  const token = localStorage.getItem("access_token");

  if (!token) {
    return undefined;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    return payload.role;
  } catch {
    return undefined;
  }
}

const navItems = [
  {
    label: "Tài khoản",
    href: "/users",
    icon: Users,
    adminOnly: true,
  },
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    adminOnly: false,
  },
  {
    label: "Sản phẩm",
    href: "/products",
    icon: Package,
    adminOnly: true,
  },
  {
    label: "Nhà cung cấp",
    href: "/suppliers",
    icon: Truck,
    adminOnly: true,
  },
  {
    label: "Khách hàng",
    href: "/customers",
    icon: Users,
    adminOnly: false,
  },
  {
    label: "Phiếu nhập",
    href: "/stock-in",
    icon: ArrowDownToLine,
    adminOnly: false,
  },
  {
    label: "Phiếu xuất",
    href: "/stock-out",
    icon: ArrowUpFromLine,
    adminOnly: false,
  },
  {
    label: "Tồn kho",
    href: "/inventory",
    icon: Boxes,
    adminOnly: false,
  },
  {
    label: "Báo cáo",
    href: "/reports",
    icon: BarChart3,
    adminOnly: true,
  },
];

export function Sidebar() {
  const [isAdmin] = useState(() => getCurrentUserRole() === "ADMIN");

  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    authService.logout();
    router.push("/login");
  }

  /*
   * Chỉ filter UI.
   *
   * adminOnly = true:
   *   ADMIN -> hiển thị
   *   USER  -> ẩn
   *
   * adminOnly = false:
   *   ADMIN và USER đều hiển thị
   *
   * Backend vẫn chịu trách nhiệm authorization thật.
   */
  const visibleNavItems = navItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <aside className="flex min-h-screen w-60 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-slate-200 px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-900">
            <Boxes className="h-4 w-4 text-white" />
          </div>

          <span className="text-sm font-semibold text-slate-900">
            CMS Kho hàng
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 p-3">
        {visibleNavItems.map((item) => {
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
                  ? "bg-slate-100 font-medium text-slate-900"
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
      <div className="border-t border-slate-200 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          <LogOut className="h-4 w-4" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
