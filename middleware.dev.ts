import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware alternativo - APENAS para desenvolvimento/debug
// Desabilita validação JWT para permitir navegação
// Use este se o middleware.ts estiver causando problemas

export async function middleware(request: NextRequest) {
  // Em desenvolvimento, deixa tudo passar
  console.log(`[Middleware Dev] ${request.method} ${request.nextUrl.pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/clientes/:path*',
    '/contratos/:path*',
    '/reembolsos/:path*',
    '/relatorios/:path*',
    '/users/:path*',
    '/membros/:path*',
    '/login',
  ],
};
