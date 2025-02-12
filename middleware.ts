import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const API_AUTH_PREFIX = "/api/auth";
const PUBLIC_ROUTES = ["/","/login"]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isApiAuthRoute = pathname.startsWith(API_AUTH_PREFIX);
  const isPublicRoute =PUBLIC_ROUTES.includes(pathname);
  const session = await auth();
  console.log(`pathname=${pathname}, user: ${JSON.stringify(session)}`);
  // Allow access to API auth routes
  if (isApiAuthRoute) {
    return NextResponse.next();
  }
  // Redirect unauthenticated users from protected routes
  if (!session?.user && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect authenticated users away from /login
  if (session?.user && pathname==="/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  // Allow the request to proceed
  return NextResponse.next();
}
// Apply middleware to all pages except static assets and API routes
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
