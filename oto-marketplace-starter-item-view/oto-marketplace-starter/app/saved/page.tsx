import Link from 'next/link';
import ListingCard from '@/components/ListingCard';
import SectionHeader from '@/components/SectionHeader';
import { requireUser } from '@/lib/auth';
import { getListings, getSavedListings } from '@/lib/file-db';

export const dynamic = 'force-dynamic';

export default async function SavedListingsPage() {
  const currentUser = await requireUser('/saved');
  const [listings, savedItems] = await Promise.all([getListings(), getSavedListings()]);
  const savedIds = new Set(
    savedItems.filter((item) => item.userId === currentUser.id).map((item) => item.listingId)
  );
  const savedListings = listings.filter((listing) => savedIds.has(listing.id));

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <SectionHeader
        title="Saved listings"
        subtitle="Everything you have bookmarked for later sits here."
      />

      {savedListings.length === 0 ? (
        <div className="mt-6 rounded-3xl bg-white p-6 text-slate-600 shadow-sm ring-1 ring-slate-200">
          You have not saved anything yet. <Link href="/browse" className="font-medium text-slate-900">Browse listings</Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {savedListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </main>
  );
}
