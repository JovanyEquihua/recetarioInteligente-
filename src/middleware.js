import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Rutas públicas permitidas sin autenticación
  const publicRoutes = ["/", "/login", "/registrarse", "/verificar","/restablecer-contrasena"];
  const isStaticAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".");

  // Permitir acceso a rutas públicas o recursos estáticos
  if (publicRoutes.includes(pathname) || isStaticAsset) {
    // Pero si estás en "/" y ya tienes token, redirige según rol
    if (pathname === "/" && token) {
      const expectedPath = token.rol === "ADMIN" ? "/admin" : "/usuario";
      return NextResponse.redirect(new URL(expectedPath, req.url));
    }
    return NextResponse.next();
  }

  // Si no hay token, redirige a login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirigir según el rol si intenta ir a otra ruta
  const expectedPath = token.rol === "ADMIN" ? "/admin" : "/usuario";
  if (!pathname.startsWith(expectedPath)) {
    return NextResponse.redirect(new URL(expectedPath, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|api|trpc|[^?]*\\.(?:\\w+$)).*)",
  ],
};
