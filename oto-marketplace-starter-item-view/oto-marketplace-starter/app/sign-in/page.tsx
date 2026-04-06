import SectionHeader from '@/components/SectionHeader';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

const errorMessages: Record<string, string> = {
  'missing-fields': 'Enter both your username and password.',
  'invalid-credentials': 'That username or password is incorrect.',
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: { next?: string; error?: string };
}) {
  const currentUser = await getCurrentUser();
  const nextPath = searchParams?.next || '/browse';

  if (currentUser) {
    redirect(nextPath);
  }

  const errorMessage = searchParams?.error ? errorMessages[searchParams.error] : '';

  return (
    <main className="mx-auto max-w-xl px-6 py-10">
      <SectionHeader
        title="Sign in"
        subtitle="Use your Greena username and password to access messages, orders, selling, and account settings."
      />

      <form action="/api/auth/sign-in" method="POST" className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <input type="hidden" name="next" value={nextPath} />

        {errorMessage ? (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <div>
          <label htmlFor="username" className="mb-2 block text-sm font-medium text-slate-700">
            Username
          </label>
          <input
            id="username"
            name="username"
            autoComplete="username"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            placeholder="Enter username"
            required
          />
        </div>

        <div className="mt-4">
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            placeholder="Enter password"
            required
          />
        </div>

        <button type="submit" className="mt-5 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
          Sign in
        </button>
      </form>
    </main>
  );
}
