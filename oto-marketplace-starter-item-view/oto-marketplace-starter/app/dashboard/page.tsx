import Link from 'next/link';
import SectionHeader from '@/components/SectionHeader';
import { requireUser } from '@/lib/auth';
import { getListings, getMessages, getOffers, getOrders, getSavedListings } from '@/lib/file-db';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const currentUser = await requireUser('/dashboard');
  const [listings, messages, orders, savedItems, offers] = await Promise.all([
    getListings(),
    getMessages(),
    getOrders(),
    getSavedListings(),
    getOffers(),
  ]);

  const myListings = listings.filter((listing) => listing.sellerId === currentUser.id);
  const myIncomingMessages = messages.filter((message) => message.recipientId === currentUser.id);
  const myOutgoingMessages = messages.filter((message) => message.senderId === currentUser.id);
  const myOrders = orders.filter((order) => order.buyerId === currentUser.id);
  const mySavedCount = savedItems.filter((item) => item.userId === currentUser.id).length;
  const myOffers = offers.filter((offer) => offer.sellerId === currentUser.id);
  const mySales = orders.filter((order) => order.sellerId === currentUser.id);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <SectionHeader
        title="Your dashboard"
        subtitle="Your profile, listing ownership, and message activity all live here now."
      />

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="text-sm text-slate-500">Your listings</div>
          <div className="mt-2 text-3xl font-bold text-slate-900">{myListings.length}</div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="text-sm text-slate-500">Messages to you</div>
          <div className="mt-2 text-3xl font-bold text-slate-900">{myIncomingMessages.length}</div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="text-sm text-slate-500">Sales</div>
          <div className="mt-2 text-3xl font-bold text-slate-900">{mySales.length}</div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-slate-900">Your listings</h2>
            <Link href="/sell" className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">
              Add listing
            </Link>
          </div>

          {myListings.length === 0 ? (
            <p className="mt-4 text-slate-600">You have not listed anything yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {myListings.map((listing) => (
                <div key={listing.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-semibold text-slate-900">{listing.title}</div>
                      <div className="mt-1 text-sm text-slate-600">
                        {listing.location} / {listing.category} / {listing.price}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {(listing.quantityAvailable ?? 1) > 0
                          ? `${listing.quantityAvailable ?? 1} left / ${listing.soldCount ?? 0} sold`
                          : `Sold out / ${listing.soldCount ?? 0} sold`}
                      </div>
                    </div>
                    <Link href={`/listings/${listing.id}`} className="text-sm font-medium text-slate-700">
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">Profile</h2>
          <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <div className="text-lg font-semibold text-slate-900">{currentUser.name}</div>
            <div className="mt-1 text-sm text-slate-600">{currentUser.email}</div>
            <div className="mt-1 text-sm text-slate-600">{currentUser.location}</div>
            {currentUser.bio ? <p className="mt-3 text-sm text-slate-600">{currentUser.bio}</p> : null}
          </div>
          <Link
            href="/messages?view=selling"
            className="mt-4 inline-flex rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
          >
            Open selling inbox
          </Link>
          <Link
            href="/saved"
            className="mt-3 inline-flex rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
          >
            Open saved listings
          </Link>
          <Link
            href="/orders"
            className="mt-3 inline-flex rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
          >
            Open orders
          </Link>
          <Link
            href="/sales"
            className="mt-3 inline-flex rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
          >
            Open sales
          </Link>
          <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <div className="text-sm text-slate-500">Purchases</div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{myOrders.length}</div>
            <div className="mt-1 text-sm text-slate-600">{myOutgoingMessages.length} messages sent</div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">Orders you placed</h2>
          {myOrders.length === 0 ? (
            <p className="mt-4 text-slate-600">You have not bought anything yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {myOrders.map((order) => (
                <div key={order.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div className="font-semibold text-slate-900">{order.listingTitle}</div>
                  <div className="mt-1 text-sm text-slate-600">
                    Qty {order.quantity ?? 1} / {order.amountPaid} / {new Date(order.purchasedAt).toLocaleDateString('en-GB')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">Offers on your listings</h2>
          {myOffers.length === 0 ? (
            <p className="mt-4 text-slate-600">No offers yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {myOffers.map((offer) => (
                <div key={offer.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div className="font-semibold text-slate-900">{offer.listingTitle}</div>
                  <div className="mt-1 text-sm text-slate-600">
                    {offer.buyerName} offered {offer.amount}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-slate-900">Recent sales</h2>
          <Link href="/sales" className="text-sm font-medium text-slate-700">
            View all sales
          </Link>
        </div>
        {mySales.length === 0 ? (
          <p className="mt-4 text-slate-600">No sales yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {mySales.slice(0, 5).map((sale) => (
              <div key={sale.id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="font-semibold text-slate-900">{sale.listingTitle}</div>
                <div className="mt-1 text-sm text-slate-600">
                  Qty {sale.quantity ?? 1} / {sale.amountPaid} / {new Date(sale.purchasedAt).toLocaleDateString('en-GB')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
