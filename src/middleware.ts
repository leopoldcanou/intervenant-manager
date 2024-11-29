// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const protectedPaths = ["/intervenants"];

  if (protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
    try {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } catch (error) {
      console.error("Erreur d'authentification:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/intervenants/:path*"],
};
