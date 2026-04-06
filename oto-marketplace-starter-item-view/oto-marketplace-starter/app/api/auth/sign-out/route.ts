import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/auth';

export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  const response = NextResponse.redirect(new URL('/sign-in', origin));
  response.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
  return response;
}

export async function POST(request: Request) {
  const { origin } = new URL(request.url);
  const response = NextResponse.redirect(new URL('/sign-in', origin));
  response.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
  return response;
}
