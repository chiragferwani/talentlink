import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Skip rewrites for internal assets and APIs
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/public")
  ) {
    return NextResponse.next()
  }

  // Allow "/" to render the landing page in app/page.tsx
  // if (pathname === "/") {
  //   const url = req.nextUrl.clone()
  //   url.pathname = "/front"
  //   return NextResponse.rewrite(url)
  // }

  return NextResponse.next()
}

// Optional matcher: run middleware for all paths
export const config = {
  matcher: ["/:path*"],
}
