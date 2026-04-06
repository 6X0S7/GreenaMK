import { getListings } from '@/lib/file-db';
import ListingCard from './ListingCard';
import Link from 'next/link';

export default async function FeaturedListings() {
  const listings = await getListings();
  const featured = listings.slice(0, 4);

  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Featured listings</h2>
          <p className="mt-1 text-slate-600">These are pulled from your local data file.</p>
        </div>
        <Link href="/browse" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
          View all
        </Link>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {featured.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </section>
  );
}
