import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequestWithAuth } from "next-auth/middleware";

export default async function middleware(req: NextRequestWithAuth) {
  const token = await getToken({ req });
  const isAuthenticated = !!token;
  const isManager = token?.role === "manager";

  const path = req.nextUrl.pathname;

  const authRoutes = ["/login", "/sign-up"];

  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

  if (isAuthRoute) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  const protectedRoutes = ["/profile", "/settings"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  if (path.startsWith("/manager")) {
    if (!isAuthenticated || !isManager) {
      const redirectUrl = new URL("/login", req.url);
      redirectUrl.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }

  if (isProtectedRoute) {
    if (!isAuthenticated) {
      const redirectUrl = new URL("/login", req.url);
      redirectUrl.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};
