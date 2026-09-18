import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Handle /portal/* aliases to root routes
  if (pathname.startsWith('/portal/')) {
    const target = pathname.replace('/portal', '');
    return NextResponse.redirect(new URL(target || '/overview', req.url));
  }
  if (pathname === '/portal') {
    return NextResponse.redirect(new URL('/overview', req.url));
  }

  // Redirect legacy routes
  if (pathname === '/dashboard') {
    return NextResponse.redirect(new URL('/overview', req.url));
  }
  if (pathname === '/conversions' || pathname === '/payouts') {
    return NextResponse.redirect(new URL('/commissions', req.url));
  }

  const protectedRoutes = ['/overview', '/products', '/commissions', '/settings'];
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtected && !req.cookies.get('affiliate_token')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
}

