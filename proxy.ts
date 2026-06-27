import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth-tokens"

// Public routes that never require authentication. Everything else is private.
const PUBLIC_ROUTES = ["/"]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname)
  const hasToken = Boolean(request.cookies.get(ACCESS_TOKEN_COOKIE)?.value)

  // Unauthenticated user trying to reach a private route → send to login.
  if (!isPublicRoute && !hasToken) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Already authenticated user landing on the login page → send to the app.
  if (isPublicRoute && hasToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Run on every route except Next.js internals and static assets
  // (anything containing a dot, e.g. /card-login.png, /logos/*.png).
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
