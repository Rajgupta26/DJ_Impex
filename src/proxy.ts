import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "dji_admin_session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the login page itself
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const isAuthenticated = request.cookies.has(SESSION_COOKIE);

  // Protect /admin routes by redirecting unauthenticated users to the login page
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Protect /api/admin routes with a 401 JSON response (without WWW-Authenticate header)
  if (pathname.startsWith("/api/admin")) {
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export { proxy as middleware };

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

