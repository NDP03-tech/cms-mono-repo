import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login"];

function getRoleFromToken(token: string): string | undefined {
  try {
    const encodedPayload = token.split(".")[1];
    if (!encodedPayload) return undefined;

    const base64 = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64)) as { role?: string };

    return payload.role;
  } catch {
    return undefined;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cho phép các route public
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // Lấy access token từ cookie
  const token = request.cookies.get("access_token")?.value;

  // Chưa đăng nhập và truy cập route protected
  if (!token && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);

    // Lưu lại URL hiện tại để redirect về sau khi login
    loginUrl.searchParams.set("redirect", pathname);

    return NextResponse.redirect(loginUrl);
  }

  // Đã đăng nhập nhưng truy cập /login
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (token && (pathname === "/users" || pathname.startsWith("/users/"))) {
    if (getRoleFromToken(token) === "STAFF") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
