import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequestWithAuth } from "next-auth/middleware";

export default async function middleware(req: NextRequestWithAuth) {
  const token = await getToken({ req });
  const isAuthenticated = !!token;
  const isCustomer = token?.role === "customer";
  const isManager = token?.role === "manager";
  const isStaff = token?.role === "staff";

  const path = req.nextUrl.pathname;

  if (path === "/") {
    if (isAuthenticated) {
      if (isManager) {
        return NextResponse.redirect(new URL("/manager/dashboard", req.url));
      }
      if (isStaff) {
        return NextResponse.redirect(
          new URL("/manager/product-component", req.url)
        );
      }
    }
  }

  const managerRoutes = ["/manager/dashboard", "/manager/manage-staff"];

  const isManagerRoute = managerRoutes.some((route) => path.startsWith(route));

  if (isManagerRoute) {
    if (!isAuthenticated || !isManager) {
      const redirectUrl = new URL("/login", req.url);
      redirectUrl.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }

  const customerRoutes = [
    "/all-products",
    "/my-order",
    "/create-shrine",
    "/cart",
  ];

  const isCustomerRoute = customerRoutes.some((route) =>
    path.startsWith(route)
  );

  if (isCustomerRoute) {
    if (!isAuthenticated || !isCustomer) {
      const redirectUrl = new URL("/login", req.url);
      redirectUrl.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }

  const authRoutes = ["/login", "/sign-up"];

  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

  if (isAuthRoute) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  const protectedRoutes = ["/profile", "/my-order", "/create-shrine"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  if (path.startsWith("/manager")) {
    if (!isAuthenticated || isCustomer) {
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
