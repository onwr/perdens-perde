import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isDashboard = path.startsWith('/admin/dashboard');
  
  if (isDashboard) {
    const token = request.cookies.get('honurs_admin_session')?.value;
    
    if (token !== 'authenticated') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/dashboard/:path*'],
};
