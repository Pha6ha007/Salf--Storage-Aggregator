import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 
  'https://salf-storage-aggregator-production.up.railway.app';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, 'POST');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, 'PATCH');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, 'PUT');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, 'DELETE');
}

async function proxyRequest(
  request: NextRequest,
  pathSegments: string[],
  method: string
) {
  const path = pathSegments.join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `${BACKEND_URL}/api/v1/${path}${searchParams ? `?${searchParams}` : ''}`;

  // Forward cookies from browser to backend
  const cookieHeader = request.headers.get('cookie') || '';

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (cookieHeader) {
    headers['Cookie'] = cookieHeader;
  }

  // Forward body for mutating requests
  let body: string | undefined;
  if (['POST', 'PATCH', 'PUT'].includes(method)) {
    try {
      body = await request.text();
    } catch {
      body = undefined;
    }
  }

  const backendResponse = await fetch(url, {
    method,
    headers,
    body: body || undefined,
    // Don't follow redirects
    redirect: 'manual',
  });

  const responseBody = await backendResponse.text();

  // Build response headers — forward Set-Cookie as same-site
  const responseHeaders = new Headers();
  responseHeaders.set('Content-Type', backendResponse.headers.get('content-type') || 'application/json');

  // Rewrite Set-Cookie headers: remove SameSite=None, set SameSite=Lax (same origin now)
  const setCookieHeaders = backendResponse.headers.getSetCookie?.() || 
    [backendResponse.headers.get('set-cookie')].filter(Boolean) as string[];

  for (const cookie of setCookieHeaders) {
    if (cookie) {
      // Replace SameSite=None with SameSite=Lax since we're now same-origin
      const rewritten = cookie
        .replace(/SameSite=None/gi, 'SameSite=Lax')
        .replace(/; Secure/gi, ''); // Remove Secure flag for same-origin proxy
      responseHeaders.append('Set-Cookie', rewritten);
    }
  }

  return new NextResponse(responseBody, {
    status: backendResponse.status,
    headers: responseHeaders,
  });
}
