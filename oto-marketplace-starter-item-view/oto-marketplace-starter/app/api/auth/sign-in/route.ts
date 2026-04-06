import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/auth';
import { getUserByCredentials } from '@/lib/file-db';

function createSignedInResponse(userId: string, redirectTo: string, origin: string) {
  const response = NextResponse.redirect(new URL(redirectTo, origin));
  response.cookies.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });

  return response;
}

function withError(nextPath: string, error: string) {
  return `/sign-in?next=${encodeURIComponent(nextPath)}&error=${encodeURIComponent(error)}`;
}

export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  const formData = await request.formData();
  const username = String(formData.get('username') || '').trim();
  const password = String(formData.get('password') || '');
  const nextPath = String(formData.get('next') || '/browse');

  if (!username || !password) {
    return NextResponse.redirect(new URL(withError(nextPath, 'missing-fields'), origin));
  }

  const user = await getUserByCredentials(username, password);

  if (!user) {
    return NextResponse.redirect(new URL(withError(nextPath, 'invalid-credentials'), origin));
  }

  return createSignedInResponse(user.id, nextPath, origin);
}
