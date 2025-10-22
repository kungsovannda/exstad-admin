import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { signOut } from "next-auth/react";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const signInUrl = new URL("/login", req.url);
    signInUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(signInUrl);
  }

  const allowedRoles = ["ADMIN", "INSTRUCTOR1", "INSTRUCTOR2"];
  const roles = token?.user?.roles || [];
  const hasRole = roles.some((role) => allowedRoles.includes(role));
  const url = "/unauthorized";
  if (!hasRole) {
    signOut();
    return NextResponse.redirect(new URL(url, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|unauthorized|login).*)",
  ],
};
