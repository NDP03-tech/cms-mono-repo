// src/app/api/auth/logout/route.ts

import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("access_token")?.value;

    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : {}),
      },
    });

    // Xóa cookie phía Next.js
    const nextResponse = NextResponse.json({ success: true }, { status: 200 });

    nextResponse.cookies.delete("access_token");

    return nextResponse;
  } catch (error) {
    console.error("Logout proxy error:", error);

    // Vẫn xóa session phía frontend
    const nextResponse = NextResponse.json({ success: true }, { status: 200 });

    nextResponse.cookies.delete("access_token");

    return nextResponse;
  }
}
