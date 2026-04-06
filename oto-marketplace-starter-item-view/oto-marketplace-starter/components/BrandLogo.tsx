import Link from 'next/link';

export default function BrandLogo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 20c6 0 11-5 11-11V4h-5C6 4 1 9 1 15v5Z" />
          <path d="M8 15c2-3 5-5 9-6" />
        </svg>
      </div>
      <div>
        <div className="text-xl font-bold tracking-tight text-slate-900">Greena</div>
        <div className="text-xs font-medium uppercase tracking-[0.24em] text-emerald-600">marketplace</div>
      </div>
    </Link>
  );
}
