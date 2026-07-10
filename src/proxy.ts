import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Optimistic auth check (per Next.js guidance, real authorization tetap
// dilakukan oleh auth() di setiap API route dan server component).
// Cukup cek keberadaan session cookie NextAuth — edge-safe, tanpa crypto.
function hasSessionCookie(request: NextRequest): boolean {
  return Boolean(
    request.cookies.get("authjs.session-token") ??
      request.cookies.get("__Secure-authjs.session-token")
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoggedIn = hasSessionCookie(request);

  // Halaman dashboard hanya untuk user yang sudah login
  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // User yang sudah login tidak perlu melihat halaman login lagi
  if (pathname === "/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
