import Link from 'next/link';
import { notFound } from 'next/navigation';
import ListingCard from '@/components/ListingCard';
import ListingGallery from '@/components/ListingGallery';
import { getCurrentUser } from '@/lib/auth';
import {
  getListingById,
  getListings,
  getMessages,
  getOrders,
  getReviews,
  getSavedListings,
  getUserById,
} from '@/lib/file-db';
import { formatRelativeDate } from '@/lib/format';
import { canCounterOffer, getAverageRating, getThreadKey, supportsBuyNow } from '@/lib/marketplace';

export const dynamic = 'force-dynamic';

function makeGalleryImages(image: string, galleryImages?: string[]) {
  if (galleryImages && galleryImages.length > 0) {
    return galleryImages;
  }

  return [image];
}

export default async function ListingDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { reviews?: string; error?: string };
}) {
  const [listing, allListings, currentUser, messages, seller, orders, reviews, savedItems] = await Promise.all([
    getListingById(params.id),
    getListings(),
    getCurrentUser(),
    getMessages(),
    getListingById(params.id).then(async (item) => (item ? getUserById(item.sellerId) : null)),
    getOrders(),
    getReviews(),
    getSavedListings(),
  ]);

  if (!listing) {
    notFound();
  }

  const relatedListings = allListings
    .filter((item) => item.id !== listing.id && item.category === listing.category)
    .slice(0, 3);
  const isOwner = currentUser?.id === listing.sellerId;
  const threadId =
    currentUser
      ? getThreadKey({
          id: 'draft',
          listingId: listing.id,
          listingTitle: listing.title,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderEmail: currentUser.email,
          recipientId: listing.sellerId,
          recipientName: listing.sellerName,
          recipientEmail: seller?.email || '',
          message: '',
          createdAt: '',
        })
      : '';
  const existingThread = messages.find((message) => getThreadKey(message) === threadId);
  const galleryImages = makeGalleryImages(listing.image, listing.galleryImages);
  const listingReviews = reviews.filter((review) => review.listingId === listing.id);
  const sellerReviews = reviews.filter((review) => review.sellerId === listing.sellerId);
  const reviewTab = searchParams?.reviews === 'seller' ? 'seller' : 'listing';
  const visibleReviews = reviewTab === 'seller' ? sellerReviews : listingReviews;
  const sellerType = seller?.accountType === 'business' ? 'Business' : 'Private';
  const sellerRating = sellerReviews.length > 0 ? getAverageRating(sellerReviews) : seller?.rating || listing.rating || 4.8;
  const sellerRatingCount = sellerReviews.length > 0 ? sellerReviews.length : seller?.ratingCount || listing.ratingCount || 24;
  const listingRating = listingReviews.length > 0 ? getAverageRating(listingReviews) : listing.rating || sellerRating;
  const listingRatingCount = listingReviews.length > 0 ? listingReviews.length : listing.ratingCount || Math.max(8, Math.round(sellerRatingCount / 2));
  const condition = listing.condition || (listing.type === 'sale' ? 'Used - good' : 'Available to rent');
  const fulfillment = listing.fulfillment || ['Collection'];
  const acceptsOffers = listing.acceptsOffers ?? listing.type === 'sale';
  const quantityAvailable = listing.quantityAvailable ?? 1;
  const soldCount = listing.soldCount ?? 0;
  const savedListingIds = new Set(
    savedItems.filter((item) => item.userId === currentUser?.id).map((item) => item.listingId)
  );
  const isSaved = savedListingIds.has(listing.id);
  const buyNowEnabled = supportsBuyNow(listing) && !isOwner;
  const counterOfferEnabled = canCounterOffer(listing) && !isOwner;
  const canLeaveReview = currentUser
    ? orders.some((order) => {
        if (order.listingId !== listing.id || order.buyerId !== currentUser.id) {
          return false;
        }

        return (
          Date.now() >= new Date(order.purchasedAt).getTime() + 24 * 60 * 60 * 1000 &&
          !reviews.some((review) => review.listingId === listing.id && review.buyerId === currentUser.id)
        );
      })
    : false;
  const messageHref = currentUser
    ? existingThread
      ? `/messages?view=${isOwner ? 'selling' : 'buying'}&thread=${encodeURIComponent(threadId)}`
      : '/messages?view=buying'
    : `/sign-in?next=${encodeURIComponent(`/listings/${listing.id}`)}`;
  const checkoutHref = currentUser
    ? `/checkout/${listing.id}`
    : `/sign-in?next=${encodeURIComponent(`/checkout/${listing.id}`)}`;

  return (
    <main className="bg-slate-200 py-8">
      <div className="mx-auto max-w-7xl px-5">
        <Link href="/browse" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          Back to browse
        </Link>

        {searchParams?.error ? (
          <div className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {searchParams.error}
          </div>
        ) : null}

        <div className="mt-4 bg-slate-100 p-4 ring-1 ring-slate-300 lg:p-5">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_390px]">
            <section className="space-y-4">
              <ListingGallery images={galleryImages} title={listing.title} />

              <div className="bg-white p-5 ring-1 ring-slate-200">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Description
                    </div>
                    <h2 className="mt-1 text-xl font-bold text-slate-900">{listing.title}</h2>
                  </div>
                  <div className="text-sm font-semibold text-slate-700">{listing.category}</div>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                  {listing.description}
                </p>
              </div>

              <div className="bg-white p-5 ring-1 ring-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-bold text-slate-900">Reviews</h2>
                  <div className="flex gap-2">
                    <Link
                      href={`/listings/${listing.id}?reviews=listing`}
                      className={`rounded-full px-4 py-2 text-sm font-medium ${
                        reviewTab === 'listing' ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      Listing Reviews
                    </Link>
                    <Link
                      href={`/listings/${listing.id}?reviews=seller`}
                      className={`rounded-full px-4 py-2 text-sm font-medium ${
                        reviewTab === 'seller' ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      Seller Reviews
                    </Link>
                  </div>
                </div>

                {canLeaveReview ? (
                  <form action="/api/reviews" method="POST" className="mt-4 space-y-3 border border-slate-200 bg-slate-50 p-4">
                    <input type="hidden" name="listingId" value={listing.id} />
                    <input type="hidden" name="sellerId" value={listing.sellerId} />
                    <input type="hidden" name="returnTo" value={`/listings/${listing.id}?reviews=${reviewTab}`} />
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="text-sm font-medium text-slate-700" htmlFor="rating">
                        Rating
                      </label>
                      <select
                        id="rating"
                        name="rating"
                        className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm"
                        defaultValue="5"
                      >
                        <option value="5">5 / 5</option>
                        <option value="4">4 / 5</option>
                        <option value="3">3 / 5</option>
                        <option value="2">2 / 5</option>
                        <option value="1">1 / 5</option>
                      </select>
                    </div>
                    <textarea
                      name="comment"
                      className="min-h-[96px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                      placeholder="Share what the item and seller were like."
                      required
                    />
                    <button type="submit" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
                      Submit review
                    </button>
                  </form>
                ) : null}

                {visibleReviews.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-600">No reviews yet.</p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {visibleReviews.map((review) => (
                      <article key={review.id} className="border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <div className="text-sm font-semibold text-slate-900">{review.buyerName}</div>
                            <div className="mt-1 text-xs text-slate-500">{formatRelativeDate(review.createdAt)}</div>
                          </div>
                          <div className="text-sm font-semibold text-slate-900">{review.rating} / 5</div>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-700">{review.comment}</p>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <aside className="space-y-4">
              <div className="bg-white p-5 ring-1 ring-slate-200">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-[30px] font-bold leading-9 text-slate-950">{listing.title}</h1>
                    <div className="mt-1 text-sm text-slate-500">
                      {listing.location} / {listing.distanceMiles} miles away
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-slate-900">{listingRating.toFixed(1)} / 5</div>
                    <div className="mt-1 text-xs text-slate-500">{listingRatingCount} item ratings</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3 border border-slate-200 bg-slate-50 p-3">
                  <img src={galleryImages[0]} alt={listing.sellerName} className="h-12 w-12 object-cover" />
                  <div className="min-w-0">
                    <Link href={`/users/${listing.sellerId}`} className="truncate text-sm font-semibold text-slate-900 hover:text-slate-700">
                      {listing.sellerName}
                    </Link>
                    <div className="mt-1 text-xs text-slate-500">
                      {sellerType} / {sellerRating.toFixed(1)} out of 5 / {sellerRatingCount} ratings
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-[34px] font-bold leading-none text-slate-950">{listing.price}</div>

                <dl className="mt-4 space-y-2 border border-slate-200 p-4 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-slate-500">Condition</dt>
                    <dd className="font-semibold text-slate-900">{condition}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-slate-500">Delivery</dt>
                    <dd className="text-right font-semibold text-slate-900">{fulfillment.join(' + ')}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-slate-500">Listing type</dt>
                    <dd className="font-semibold capitalize text-slate-900">{listing.type}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-slate-500">Category</dt>
                    <dd className="font-semibold text-slate-900">{listing.category}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-slate-500">Quantity</dt>
                    <dd className="font-semibold text-slate-900">{quantityAvailable} available</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-slate-500">Sales</dt>
                    <dd className="font-semibold text-slate-900">{soldCount} sold</dd>
                  </div>
                </dl>

                {acceptsOffers ? (
                  <div className="mt-3 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                    Full price listing / counter offers available
                  </div>
                ) : null}

                <div className="mt-4 grid gap-3">
                  {buyNowEnabled ? (
                    quantityAvailable > 0 ? (
                      <Link
                        href={checkoutHref}
                        className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white"
                      >
                        Buy now
                      </Link>
                    ) : (
                      <div className="inline-flex items-center justify-center rounded-full bg-slate-300 px-5 py-3 text-sm font-semibold text-white">
                        Sold out
                      </div>
                    )
                  ) : null}

                  {counterOfferEnabled ? (
                    <form action="/api/offers" method="POST" className="space-y-3">
                      <input type="hidden" name="listingId" value={listing.id} />
                      <input type="hidden" name="returnTo" value={`/listings/${listing.id}`} />
                      <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">GBP</span>
                        <input
                          name="amount"
                          type="number"
                          min={1}
                          step="0.01"
                          defaultValue={listing.priceAmount ?? 1}
                          className="w-full rounded-2xl border border-slate-300 py-3 pl-14 pr-4 text-sm"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
                      >
                        Counter offer
                      </button>
                    </form>
                  ) : (
                    <Link
                      href={messageHref}
                      className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
                    >
                      Contact
                    </Link>
                  )}

                  <form action="/api/saved/toggle" method="POST">
                    <input type="hidden" name="listingId" value={listing.id} />
                    <input type="hidden" name="returnTo" value={`/listings/${listing.id}`} />
                    <button
                      type="submit"
                      className="w-full rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800"
                    >
                      {isSaved ? 'Saved' : 'Save for later'}
                    </button>
                  </form>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <section className="mt-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-slate-900">Related listings</h2>
            <Link href="/browse" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              View all
            </Link>
          </div>

          {relatedListings.length === 0 ? (
            <p className="mt-4 text-slate-600">No related listings yet.</p>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {relatedListings.map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
