import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // List of public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/create-account", "/criar-conta", "/recover-password", "/recuperar-senha"]

  // Check if the current route is a public route
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname)

  // If the route is not public and the user is not authenticated, redirect to login
  //if (!isPublicRoute && !session) {
  //  return NextResponse.redirect(new URL("/login", req.url))
  //}

  // If the user is authenticated and trying to access a public route, redirect to home
  //if (isPublicRoute && session) {
  //  return NextResponse.redirect(new URL("/home", req.url))
  //}

  return res
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

