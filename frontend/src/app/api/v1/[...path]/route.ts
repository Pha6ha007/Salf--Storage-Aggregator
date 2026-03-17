import { NextRequest, NextResponse } from 'next/server';

const BACKEND = 'https://salf-storage-aggregator-production.up.railway.app';

async function handler(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const url = `${BACKEND}/api/v1/${path.join('/')}${req.nextUrl.search}`;

  // Forward all headers including cookies
  const headers: Record<string, string> = {
    'content-type': 'application/json',
  };
  const cookie = req.headers.get('cookie');
  if (cookie) headers['cookie'] = cookie;

  const origin = req.headers.get('origin');
  if (origin) headers['origin'] = origin;

  let body: string | undefined;
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    body = await req.text();
  }

  const res = await fetch(url, {
    method: req.method,
    headers,
    body,
    // @ts-expect-error node fetch option
    duplex: 'half',
  });

  const resBody = await res.text();

  const outHeaders = new Headers();
  const ct = res.headers.get('content-type');
  if (ct) outHeaders.set('content-type', ct);

  // Forward Set-Cookie — rewrite to same-origin (Lax, no Secure needed)
  const cookies = res.headers.getSetCookie?.() ?? [];
  for (const c of cookies) {
    const rewritten = c
      .replace(/SameSite=None/gi, 'SameSite=Lax')
      .replace(/;\s*Secure/gi, '');
    outHeaders.append('set-cookie', rewritten);
  }

  return new NextResponse(resBody, { status: res.status, headers: outHeaders });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
