import Link from 'next/link';
import BrandLogo from './BrandLogo';
import { getCurrentUser } from '@/lib/auth';
import { getOrders } from '@/lib/file-db';

export default async function Navbar() {
  const currentUser = await getCurrentUser();
  const orders = currentUser ? await getOrders() : [];
  const protectedSellHref = currentUser ? '/sell' : '/sign-in?next=%2Fsell';
  const protectedMessagesHref = currentUser ? '/messages' : '/sign-in?next=%2Fmessages';
  const protectedSavedHref = currentUser ? '/saved' : '/sign-in?next=%2Fsaved';
  const protectedOrdersHref = currentUser ? '/orders' : '/sign-in?next=%2Forders';
  const protectedSalesHref = currentUser ? '/sales' : '/sign-in?next=%2Fsales';
  const protectedProfileHref = currentUser ? '/settings' : '/sign-in?next=%2Fsettings';
  const buyerOrderCount = currentUser ? orders.filter((order) => order.buyerId === currentUser.id).length : 0;
  const sellerSaleCount = currentUser ? orders.filter((order) => order.sellerId === currentUser.id).length : 0;

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center">
        <BrandLogo />

        <form className="w-full md:flex-1" action="/browse">
          <label htmlFor="marketplace-search" className="sr-only">
            Search marketplace
          </label>
          <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm transition focus-within:border-slate-300 focus-within:bg-white">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              id="marketplace-search"
              name="q"
              className="ml-3 w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              placeholder="Search cars, tools, electronics and more"
            />
          </div>
        </form>

        <div className="flex items-center gap-2 self-end sm:gap-3 md:self-auto">
          {currentUser ? (
            <form action="/api/auth/sign-out" method="POST">
              <button
                type="submit"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
              >
                Sign out
              </button>
            </form>
          ) : null}
          <Link
            href={protectedSellHref}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            List item
          </Link>
          <Link
            href={protectedMessagesHref}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            aria-label="Messages"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
            </svg>
          </Link>
          <Link
            href={protectedSavedHref}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            aria-label="Saved listings"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" />
            </svg>
          </Link>
          <Link
            href={protectedOrdersHref}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            aria-label="Orders"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 7h18" />
              <path d="M6 3h12l1 4H5l1-4Z" />
              <path d="M5 7h14v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Z" />
            </svg>
            {buyerOrderCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white">
                {buyerOrderCount}
              </span>
            ) : null}
          </Link>
          <Link
            href={protectedSalesHref}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            aria-label="Sales"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20V10" />
              <path d="m18 14-6 6-6-6" />
              <path d="M6 4h12" />
            </svg>
            {sellerSaleCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-900 px-1 text-[10px] font-bold text-white">
                {sellerSaleCount}
              </span>
            ) : null}
          </Link>
          <Link
            href={protectedProfileHref}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            aria-label="Profile"
          >
            {currentUser ? (
              <span className="text-sm font-semibold text-slate-900">
                {currentUser.name
                  .split(' ')
                  .map((part) => part[0])
                  .join('')
                  .slice(0, 2)}
              </span>
            ) : (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21a8 8 0 0 0-16 0" />
                <circle cx="12" cy="8" r="4" />
              </svg>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
