import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = (request.headers.get('host') || '').replace(/:\d+$/, '');

  // profusta.com -> perdens.com (duplicate content / canonical karışıklığı)
  if (host === 'profusta.com' || host === 'www.profusta.com') {
    const target = new URL(
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
      'https://perdens.com',
    );
    return NextResponse.redirect(target, 301);
  }

  // www -> apex (Google indeksini tek domainde toplar)
  if (host.startsWith('www.')) {
    const url = request.nextUrl.clone();
    url.host = host.slice(4);
    url.protocol = request.nextUrl.protocol;
    return NextResponse.redirect(url, 301);
  }

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
  matcher: [
    '/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|html)$).*)',
  ],
};
