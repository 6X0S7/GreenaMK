import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUserById } from './file-db';

export const SESSION_COOKIE = 'oto-user-id';

export async function getCurrentUser() {
  const userId = cookies().get(SESSION_COOKIE)?.value;

  if (!userId) {
    return null;
  }

  return getUserById(userId);
}

export async function requireUser(nextPath?: string) {
  const user = await getCurrentUser();

  if (!user) {
    const redirectTo = nextPath ? `/sign-in?next=${encodeURIComponent(nextPath)}` : '/sign-in';
    redirect(redirectTo);
  }

  return user;
}
