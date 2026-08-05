// src/app/(auth)/login/page.tsx
import { LoginForm } from "@/components/features/auth/login-form";
import { Package } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo + Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-slate-900 mb-4">
            <Package className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-lg font-semibold text-slate-900">
            CMS Quản lý kho
          </h1>
          <p className="text-sm text-slate-500 mt-1">Đăng nhập để tiếp tục</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <LoginForm />
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          © 2024 CMS. All rights reserved.
        </p>
      </div>
    </div>
  );
}
