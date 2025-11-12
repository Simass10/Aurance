import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Obter token do cookie
  const token = request.cookies.get('sb-access-token')?.value;

  // Rotas públicas
  const publicRoutes = ['/auth'];
  const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname.startsWith(route));

  // Se não tem token e está tentando acessar rota protegida
  if (!token && !isPublicRoute && request.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // Se tem token, verificar se é válido
  if (token) {
    const { data: { user } } = await supabase.auth.getUser(token);
    
    // Se token inválido, redirecionar para auth
    if (!user && !isPublicRoute) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }

    // Se está autenticado e tenta acessar /auth, redirecionar para home
    if (user && request.nextUrl.pathname === '/auth') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|lasy-bridge.js).*)'],
};
