import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import SectionHeader from '@/components/SectionHeader';
import { requireUser } from '@/lib/auth';
import { getListingById, getUserById } from '@/lib/file-db';
import { canBuyNow, supportsBuyNow } from '@/lib/marketplace';

export const dynamic = 'force-dynamic';

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { error?: string };
}) {
  const currentUser = await requireUser(`/checkout/${params.id}`);
  const listing = await getListingById(params.id);

  if (!listing) {
    notFound();
  }

  if (listing.sellerId === currentUser.id) {
    redirect(`/listings/${listing.id}`);
  }

  const seller = await getUserById(listing.sellerId);
  const addresses = currentUser.addresses || [];
  const quantityAvailable = listing.quantityAvailable ?? 1;
  const buyNowSupported = supportsBuyNow(listing);

  return (
    <main className="bg-slate-200 py-8">
      <div className="mx-auto max-w-5xl px-5">
        <Link href={`/listings/${listing.id}`} className="text-sm font-medium text-slate-600 hover:text-slate-900">
          Back to listing
        </Link>

        <div className="mt-4 bg-slate-100 p-5 ring-1 ring-slate-300">
          <SectionHeader
            title="Checkout"
            subtitle="Choose a shipping address, confirm your quantity, and place the order through Greena."
          />

          {searchParams?.error ? (
            <div className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {searchParams.error}
            </div>
          ) : null}

          {!buyNowSupported ? (
            <div className="mt-6 border border-slate-200 bg-white p-5 text-sm text-slate-700">
              This listing is not available for Buy now. You can still go back to the listing and contact the seller.
            </div>
          ) : quantityAvailable < 1 ? (
            <div className="mt-6 border border-slate-200 bg-white p-5 text-sm text-slate-700">
              This listing is sold out right now.
            </div>
          ) : addresses.length === 0 ? (
            <div className="mt-6 border border-slate-200 bg-white p-5 text-sm text-slate-700">
              <p>You need a saved shipping address before you can place an order.</p>
              <Link
                href={`/settings?next=${encodeURIComponent(`/checkout/${listing.id}`)}`}
                className="mt-4 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
              >
                Add shipping address
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
              <form action="/api/orders/buy" method="POST" className="space-y-5 bg-white p-5 ring-1 ring-slate-200">
                <input type="hidden" name="listingId" value={listing.id} />
                <input type="hidden" name="returnTo" value={`/checkout/${listing.id}`} />
                <input
                  type="hidden"
                  name="successTo"
                  value={`/orders?success=${encodeURIComponent(`${listing.title} ordered successfully.`)}`}
                />

                <div>
                  <label htmlFor="addressId" className="mb-2 block text-sm font-medium text-slate-700">
                    Shipping address
                  </label>
                  <select
                    id="addressId"
                    name="addressId"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                    defaultValue={addresses[0]?.id}
                  >
                    {addresses.map((address) => (
                      <option key={address.id} value={address.id}>
                        {address.label} / {address.line1}, {address.city}, {address.postcode}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="quantity" className="mb-2 block text-sm font-medium text-slate-700">
                    Quantity
                  </label>
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min={1}
                    max={quantityAvailable}
                    defaultValue={1}
                    className="w-28 rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                  />
                  <div className="mt-2 text-xs text-slate-500">{quantityAvailable} available to order.</div>
                </div>

                <button
                  type="submit"
                  disabled={!canBuyNow(listing)}
                  className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white disabled:bg-slate-300"
                >
                  Confirm order
                </button>
              </form>

              <aside className="bg-white p-5 ring-1 ring-slate-200">
                <div className="flex items-start gap-4">
                  <img src={listing.image} alt={listing.title} className="h-20 w-20 object-cover" />
                  <div className="min-w-0">
                    <Link href={`/listings/${listing.id}`} className="text-lg font-semibold text-slate-900 hover:text-slate-700">
                      {listing.title}
                    </Link>
                    <div className="mt-1 text-sm text-slate-500">{listing.location}</div>
                  </div>
                </div>

                <dl className="mt-5 space-y-3 border-t border-slate-200 pt-5 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-slate-500">Price</dt>
                    <dd className="font-semibold text-slate-900">{listing.price}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-slate-500">Delivery</dt>
                    <dd className="text-right font-semibold text-slate-900">
                      {(listing.fulfillment || ['Collection']).join(' + ')}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-slate-500">Seller</dt>
                    <dd className="text-right font-semibold text-slate-900">{seller?.name || listing.sellerName}</dd>
                  </div>
                </dl>
              </aside>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
