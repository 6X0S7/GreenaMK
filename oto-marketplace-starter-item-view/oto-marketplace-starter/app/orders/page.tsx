import Link from 'next/link';
import SectionHeader from '@/components/SectionHeader';
import { requireUser } from '@/lib/auth';
import { getListings, getOrders } from '@/lib/file-db';

export const dynamic = 'force-dynamic';

export default async function OrdersPage({
  searchParams,
}: {
  searchParams?: { success?: string };
}) {
  const currentUser = await requireUser('/orders');
  const [orders, listings] = await Promise.all([getOrders(), getListings()]);
  const myOrders = orders.filter((order) => order.buyerId === currentUser.id);
  const listingMap = new Map(listings.map((listing) => [listing.id, listing]));
  const successMessage = searchParams?.success;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <SectionHeader
        title="Your orders"
        subtitle="Everything you have bought through Greena appears here."
      />

      {successMessage ? (
        <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
          {successMessage}
        </div>
      ) : null}

      {myOrders.length === 0 ? (
        <div className="mt-6 rounded-3xl bg-white p-6 text-slate-600 shadow-sm ring-1 ring-slate-200">
          No orders yet. <Link href="/browse" className="font-medium text-slate-900">Browse listings</Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {myOrders.map((order) => {
            const listing = listingMap.get(order.listingId);

            return (
              <div key={order.id} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <div className="flex flex-wrap items-center gap-4">
                  <div
                    className="h-24 w-24 rounded-2xl bg-slate-100 bg-cover bg-center"
                    style={{ backgroundImage: `url(${listing?.image || ''})` }}
                  />
                  <div className="min-w-0 flex-1">
                    <Link href={`/listings/${order.listingId}`} className="text-lg font-semibold text-slate-900 hover:text-slate-700">
                      {order.listingTitle}
                    </Link>
                    <div className="mt-1 text-sm text-slate-600">
                      Qty {order.quantity ?? 1} / {order.amountPaid}
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      Bought on {new Date(order.purchasedAt).toLocaleString('en-GB')}
                    </div>
                  </div>
                  <Link href={`/listings/${order.listingId}`} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
                    View item
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
