import { NextRequest, NextResponse } from "next/server";

interface JwtPayload {
  sub?: string;
  username?: string;
  role?: "ADMIN" | "STAFF";
}

function decodePayload(token: string): JwtPayload | null {
  try {
    const encodedPayload = token.split(".")[1];
    if (!encodedPayload) return null;

    const payload = Buffer.from(encodedPayload, "base64url").toString("utf8");
    return JSON.parse(payload) as JwtPayload;
  } catch {
    return null;
  }
}

export function GET(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const payload = token ? decodePayload(token) : null;

  if (!payload?.sub || !payload.username || !payload.role) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    id: payload.sub,
    username: payload.username,
    role: payload.role,
  });
}
