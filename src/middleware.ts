// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // ตรวจสอบ token โดยใช้ getToken
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  console.log("Token:", token); // เพิ่ม log เพื่อตรวจสอบ token

  const isAuthenticated = !!token;

  // ถ้าผู้ใช้ยังไม่ล็อกอินและไม่ได้อยู่ที่ /login ให้ redirect ไปที่ /login
  if (!isAuthenticated && path !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ถ้าผู้ใช้ล็อกอินแล้วและอยู่ที่ /login ให้ redirect ไปที่หน้า /
  if (isAuthenticated && path === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// กำหนด path ที่จะใช้ middleware
export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico).*)"],
};
