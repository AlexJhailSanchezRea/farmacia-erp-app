import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const isLoginPage = request.nextUrl.pathname.startsWith("/login");
    const sessionCookie = request.cookies.get("nexa_session");

    // Si no tiene cookie y quiere entrar a una ruta protegida
    if (!sessionCookie && !isLoginPage) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Si ya tiene cookie e intenta entrar a login
    if (sessionCookie && isLoginPage) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    // Configurar en qué rutas corre el middleware
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
