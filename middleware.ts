import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";
  const isApiAuthRoute = pathname.startsWith("/api/auth");

  // Don't protect API auth routes and public assets
  if (isApiAuthRoute || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  // Check if the request is for an admin route
  if (isAdminRoute) {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    // If on login page and already authenticated, redirect to admin dashboard
    if (isLoginPage && token) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // If not on login page and not authenticated, redirect to login
    if (!isLoginPage && !token) {
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all admin routes
    "/admin/:path*",
    // Match API routes that need protection
    "/api/content/:path*",
    "/api/upload/:path*",
    "/api/admin/:path*",
    // Match auth routes to check for existing sessions
    "/api/auth/:path*"
  ],
}; 