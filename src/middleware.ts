import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || 'localhost:3000';

  // Determine current environment
  const isLocalhost = hostname.includes('localhost') || hostname.includes('192.168');
  const baseDomain = isLocalhost ? hostname.split(':')[0] : process.env.NEXT_PUBLIC_APP_URL?.replace('https://', '').replace('http://', '') || 'jobplatform.com';

  // Extract subdomain
  let tenantSlug = 'default';
  
  if (isLocalhost) {
    // For localhost, we might test via slug.localhost:3000 (needs hosts file edit) or ?tenant=slug
    const customHostParts = hostname.replace(`:${url.port}`, '').split('.');
    if (customHostParts.length > 1 && customHostParts[0] !== 'localhost') {
      tenantSlug = customHostParts[0];
    } else {
      tenantSlug = url.searchParams.get('tenant') || 'default';
    }
  } else {
    // For production (e.g., tenant.domain.com)
    // Remove port if present
    const cleanHostname = hostname.split(':')[0];
    if (cleanHostname.endsWith(baseDomain) && cleanHostname !== baseDomain && cleanHostname !== `www.${baseDomain}`) {
       tenantSlug = cleanHostname.replace(`.${baseDomain}`, '');
    } else {
      tenantSlug = url.searchParams.get('tenant') || 'default';
    }
  }

  // Also support /t/slug path override for deep linking
  const pathParts = url.pathname.split('/');
  if (pathParts[1] === 't' && pathParts[2]) {
    tenantSlug = pathParts[2];
  }

  const response = NextResponse.next();
  response.headers.set('x-tenant-slug', tenantSlug);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
