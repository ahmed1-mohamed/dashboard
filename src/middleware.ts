import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isLoggedIn = !!token;

  const role = token?.role_name;

  const isAdminRoute = pathname.startsWith("/admin");
  const isExpertRoute = pathname.startsWith("/expert");
  const isAuthPage = pathname.startsWith("/auth");

  if (!isLoggedIn && !isAuthPage) {
    return NextResponse.redirect(
      new URL(`/auth/signin`, request.url),
    );
  }

  if (isLoggedIn && pathname === "/auth/signin") {
    if (role === "admin") {
      return NextResponse.redirect(
        new URL(`/admin/home`, request.url),
      );
    }
    if (role === "expert") {
      return NextResponse.redirect(
        new URL(`/expert/home`, request.url),
      );
    }
    if (role === "developer") {
      return NextResponse.redirect(
        new URL(`/developer/home`, request.url),
      );
    }
  }

  if (isAdminRoute && role !== "admin") {
    return NextResponse.redirect(
      new URL(`/unauthorized`, request.url),
    );
  }

  if (isExpertRoute && role !== "expert") {
    return NextResponse.redirect(
      new URL(`/unauthorized`, request.url),
    );
  }

  return NextResponse.next();
}
