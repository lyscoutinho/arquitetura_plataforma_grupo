import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Em desenvolvimento, permite tudo sem verificação de autenticação
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    console.log(`[DEV] Permitindo acesso a: ${request.nextUrl.pathname}`);
    return NextResponse.next();
  }

  // Em produção, mantém validação básica
  const token = request.cookies.get('engnet.token')?.value;
  const loginUrl = new URL('/login', request.url);

  if (!token) {
    if (
      request.nextUrl.pathname.startsWith('/dashboard') ||
      request.nextUrl.pathname.startsWith('/clientes') ||
      request.nextUrl.pathname.startsWith('/contratos') ||
      request.nextUrl.pathname.startsWith('/reembolsos') ||
      request.nextUrl.pathname.startsWith('/relatorios') ||
      request.nextUrl.pathname.startsWith('/users') ||
      request.nextUrl.pathname.startsWith('/membros')
    ) {
      return NextResponse.redirect(loginUrl);
    }
  }

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