import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const DASHBOARD_ROUTES: Record<string, string[]> = {
  '/admin': ['admin'],
  '/student': ['student'],
  '/company': ['company'],
};

export function middleware(request: NextRequest): NextResponse {
  const path = request.nextUrl.pathname;
  const role = request.cookies.get('app_role')?.value;

  const protectedRoute = Object.keys(DASHBOARD_ROUTES).find((route) => path.startsWith(route));

  if (protectedRoute) {
    if (!role) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const allowedRoles = DASHBOARD_ROUTES[protectedRoute];
    if (!allowedRoles.includes(role)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/student/:path*', '/company/:path*'],
};
