import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from "@/lib/auth";

const API_AUTH_PREFIX = "/api/auth";
const PUBLIC_ROUTES = ["/","/login"]

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await auth();
  const isPublicRoute =PUBLIC_ROUTES.includes(pathname);

  // for callbacks
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users from protected routes
  if (!session?.user && !isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  // Redirect authenticated users away from /login
  if (session?.user && isPublicRoute) {
    return NextResponse.redirect(new URL("/home", request.url));
  }
  // Allow the request to proceed
  return NextResponse.next();

}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}