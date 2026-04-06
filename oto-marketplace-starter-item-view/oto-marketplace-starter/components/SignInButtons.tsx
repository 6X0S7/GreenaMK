'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { User } from '@/lib/types';

export default function SignInButtons({ users }: { users: User[] }) {
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/browse';
  const error = searchParams.get('error');

  return (
    <div>
      {error === 'user-not-found' ? (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          That demo user could not be found. Please try again.
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {users.map((user) => (
          <Link
            key={user.id}
            href={`/api/auth/sign-in?userId=${encodeURIComponent(user.id)}&next=${encodeURIComponent(nextPath)}`}
            className="rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-slate-300 hover:shadow-md disabled:opacity-60"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-lg font-semibold text-slate-900">{user.name}</div>
                <div className="mt-1 text-sm text-slate-500">{user.location}</div>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                {user.name
                  .split(' ')
                  .map((part) => part[0])
                  .join('')
                  .slice(0, 2)}
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-600">{user.bio}</p>
            <div className="mt-4 text-sm font-medium text-slate-900">{`Continue as ${user.name}`}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
