import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20 text-center">
      <div className="rounded-3xl bg-white p-10 shadow-sm ring-1 ring-slate-200">
        <div className="text-sm font-medium uppercase tracking-wide text-slate-500">404</div>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Item not found</h1>
        <p className="mt-3 text-slate-600">That listing does not exist, or it may have been removed.</p>
        <Link href="/browse" className="mt-6 inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-white">
          Go back to browse
        </Link>
      </div>
    </main>
  );
}
