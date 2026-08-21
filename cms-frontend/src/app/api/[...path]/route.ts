import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL ?? "http://localhost:5000";

async function proxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;

  const targetPath = `/${path.join("/")}`;
  const targetUrl = new URL(targetPath, API_URL);

  // Forward query params
  request.nextUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.set(key, value);
  });

  const headers = new Headers();

  // Forward content type
  const contentType = request.headers.get("content-type");

  if (contentType) {
    headers.set("content-type", contentType);
  }

  // Lấy JWT từ HttpOnly cookie
  const token = request.cookies.get("access_token")?.value;

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.arrayBuffer();

  const response = await fetch(targetUrl.toString(), {
    method: request.method,
    headers,
    body,
  });

  const responseBody = await response.arrayBuffer();

  const responseHeaders = new Headers();

  const responseContentType = response.headers.get("content-type");

  if (responseContentType) {
    responseHeaders.set("content-type", responseContentType);
  }

  if (response.status === 204) {
    return new NextResponse(null, {
      status: 204,
      headers: responseHeaders,
    });
  }

  const nextResponse = new NextResponse(responseBody, {
    status: response.status,
    headers: responseHeaders,
  });

  if (targetPath === "/auth/login" && response.ok) {
    try {
      const data = JSON.parse(new TextDecoder().decode(responseBody));

      if (data.accessToken) {
        nextResponse.cookies.set({
          name: "access_token",
          value: data.accessToken,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24,
        });
      }
    } catch {
      // Không làm gì nếu response không phải JSON
    }
  }

  return nextResponse;
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
