import Link from 'next/link';
import SectionHeader from '@/components/SectionHeader';
import { requireUser } from '@/lib/auth';
import { getListings, getOrders, getUserById } from '@/lib/file-db';

export const dynamic = 'force-dynamic';

export default async function SalesPage() {
  const currentUser = await requireUser('/sales');
  const [orders, listings] = await Promise.all([getOrders(), getListings()]);
  const mySales = orders.filter((order) => order.sellerId === currentUser.id);
  const listingMap = new Map(listings.map((listing) => [listing.id, listing]));

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <SectionHeader
        title="Your sales"
        subtitle="Every sale on your listings is tracked here so you always know what sold."
      />

      {mySales.length === 0 ? (
        <div className="mt-6 rounded-3xl bg-white p-6 text-slate-600 shadow-sm ring-1 ring-slate-200">
          No sales yet. <Link href="/sell" className="font-medium text-slate-900">List an item</Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {await Promise.all(
            mySales.map(async (sale) => {
              const listing = listingMap.get(sale.listingId);
              const buyer = await getUserById(sale.buyerId);

              return (
                <div key={sale.id} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                  <div className="flex flex-wrap items-center gap-4">
                    <div
                      className="h-24 w-24 rounded-2xl bg-slate-100 bg-cover bg-center"
                      style={{ backgroundImage: `url(${listing?.image || ''})` }}
                    />
                    <div className="min-w-0 flex-1">
                      <Link href={`/listings/${sale.listingId}`} className="text-lg font-semibold text-slate-900 hover:text-slate-700">
                        {sale.listingTitle}
                      </Link>
                      <div className="mt-1 text-sm text-slate-600">
                        Sold to {buyer?.name || sale.buyerId} / Qty {sale.quantity ?? 1} / {sale.amountPaid}
                      </div>
                      <div className="mt-1 text-sm text-slate-500">
                        Sold on {new Date(sale.purchasedAt).toLocaleString('en-GB')}
                      </div>
                    </div>
                    <Link href={`/messages?view=selling`} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
                      Open inbox
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </main>
  );
}
