import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session?.user;

  const protectedPaths = ["/dashboard", "/presentations", "/profile"];
  const authPaths = ["/login", "/register", "/forgot-password"];

  const isProtected = protectedPaths.some((path) => nextUrl.pathname.startsWith(path));
  const isAuthPath = authPaths.some((path) => nextUrl.pathname.startsWith(path));

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL(`/login?callbackUrl=${nextUrl.pathname}`, req.url));
  }

  if (isAuthPath && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
