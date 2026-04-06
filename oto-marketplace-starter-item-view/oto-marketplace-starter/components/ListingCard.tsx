import Link from 'next/link';
import { Listing } from '@/lib/types';

export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link href={`/listings/${listing.id}`}>
      <div className="cursor-pointer rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition hover:shadow-lg">
        <div
          className="h-44 rounded-2xl bg-cover bg-center"
          style={{ backgroundImage: `url(${listing.image})` }}
        />

        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold">{listing.title}</h3>
            <p className="text-sm text-slate-600">
              {listing.location} / {listing.category}
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize">
            {listing.type}
          </span>
        </div>

        <div className="mt-3 text-xl font-bold">{listing.price}</div>
        <p className="mt-2 text-sm text-slate-600">
          {listing.quantityAvailable ?? 1} in stock / {(listing.soldCount ?? 0) > 0 ? `${listing.soldCount} sold` : 'No sales yet'}
        </p>
        <p className="mt-2 text-sm font-medium text-slate-700">Seller: {listing.sellerName}</p>
        <p className="mt-2 text-sm text-slate-600">{listing.description}</p>
        <p className="mt-3 text-xs text-slate-500">{listing.distanceMiles} miles away</p>
      </div>
    </Link>
  );
}
