import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Rutas públicas permitidas sin autenticación
  const publicRoutes = ["/login", "/registrarse"];
  const isStaticAsset = pathname.startsWith("/_next") || 
                        pathname.startsWith("/api") || 
                        pathname.includes("."); // Archivos estáticos como favicon.ico

  if (publicRoutes.includes(pathname) || isStaticAsset) {
    return NextResponse.next();
  }

  // Si no hay token, redirigir a login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Definir la ruta esperada para cada rol
  const expectedPath = token.rol === "ADMIN" ? "/admin" : "/usuario";

  // Si el usuario intenta acceder a una ruta que no le corresponde, redirigirlo
  if (!pathname.startsWith(expectedPath)) {
    return NextResponse.redirect(new URL(expectedPath, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|api|trpc|[^?]*\\.(?:\\w+$)).*)', // Filtra rutas protegidas
  ],
};
