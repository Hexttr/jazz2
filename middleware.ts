import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSessionCookieName, verifySession } from "@/lib/admin-session"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next()
  }
  const isLoginPath =
    pathname === "/admin/login" || pathname === "/admin/login/"
  if (isLoginPath) {
    const token = request.cookies.get(getSessionCookieName())?.value
    if (token && (await verifySession(token))) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
    return NextResponse.next()
  }
  const token = request.cookies.get(getSessionCookieName())?.value
  if (!token || !(await verifySession(token))) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
}
