import { NextResponse, type NextRequest } from "next/server";

/**
 * The only gate in front of the admin panel.
 *
 * Set ADMIN_PASSWORD and every /admin page and /api/admin route asks for HTTP
 * Basic credentials (any user name, that password). Leave it unset and the panel
 * is open to anyone who knows the URL, which also means anyone who can read
 * every enquiry and delete content: the panel itself says so in a banner.
 *
 * Basic auth is chosen because it needs no login page, no session store and no
 * cookie. It is only as private as the connection, so it assumes HTTPS.
 */
const PROTECTED = [/^\/admin(?:\/|$)/, /^\/api\/admin(?:\/|$)/];

/** Length-independent comparison, so a wrong guess leaks no timing signal. */
function matches(candidate: string, expected: string): boolean {
  if (candidate.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < candidate.length; i += 1) {
    diff |= candidate.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

export function proxy(request: NextRequest) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return NextResponse.next();
  if (!PROTECTED.some((pattern) => pattern.test(request.nextUrl.pathname))) {
    return NextResponse.next();
  }

  const header = request.headers.get("authorization") ?? "";
  if (header.startsWith("Basic ")) {
    try {
      const decoded = atob(header.slice(6));
      const password = decoded.slice(decoded.indexOf(":") + 1);
      if (matches(password, expected)) return NextResponse.next();
    } catch {
      /* A malformed header is simply a failed attempt. */
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Nabeen admin", charset="UTF-8"',
      "cache-control": "no-store",
    },
  });
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
