import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const correlationId =
    request.headers.get("x-correlation-id") ||
    `web-${crypto.randomUUID()}`;

  const response = NextResponse.next({
    request: {
      headers: new Headers(request.headers),
    },
  });

  // Apply Distributed Correlation ID
  response.headers.set("x-correlation-id", correlationId);

  // Apply Enterprise Security Headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  // Protect Authenticated App Routes
  const { pathname } = request.nextUrl;
  const isProtectedPath =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/sources") ||
    pathname.startsWith("/knowledge") ||
    pathname.startsWith("/organizations");

  const sessionCookie = request.cookies.get("kenora_session")?.value;
  const authHeader = request.headers.get("authorization");

  if (isProtectedPath && !sessionCookie && !authHeader) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
