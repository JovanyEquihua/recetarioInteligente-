import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isStaticAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".");

  if (isStaticAsset) {
    return NextResponse.next();
  }

  const publicRoutes = ["/", "/login", "/registrarse", "/verificar", "/restablecer-contrasena"];
  const dynamicPublicRoutes = ["/receta", "/mapa"];

  const isPublic =
    publicRoutes.includes(pathname) ||
    dynamicPublicRoutes.some((route) => pathname.startsWith(route));

  if (isPublic) {
    if (pathname === "/" && token) {
      const expectedPath = getRoleBasePath(token.rol);
      return NextResponse.redirect(new URL(expectedPath, req.url));
    }
    return NextResponse.next();
  }

  // Si no hay token y la ruta no es pública, redirige a login
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const roleBasePath = getRoleBasePath(token.rol);

  // Si está accediendo a una ruta que no corresponde con su rol, redirigir
  if (
    pathname.startsWith("/admin") && token.rol !== "ADMIN" ||
    pathname.startsWith("/usuario") && token.rol !== "USUARIO" ||
    pathname.startsWith("/moderador") && token.rol !== "MODERADOR"
  ) {
    return NextResponse.redirect(new URL(roleBasePath, req.url));
  }

  return NextResponse.next();
}

// Helper para obtener ruta base por rol
function getRoleBasePath(rol) {
  switch (rol) {
    case "ADMIN":
      return "/admin";
    case "MODERADOR":
      return "/moderador";
    default:
      return "/usuario";
  }
}

export const config = {
  matcher: [
    "/((?!_next|api|trpc|[^?]\\.(?:\\w+$)).*)",
  ],
};
