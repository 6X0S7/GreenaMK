import Link from 'next/link';
import { notFound } from 'next/navigation';
import ListingCard from '@/components/ListingCard';
import SectionHeader from '@/components/SectionHeader';
import { getListings, getUserById } from '@/lib/file-db';

export const dynamic = 'force-dynamic';

export default async function UserProfilePage({ params }: { params: { id: string } }) {
  const [user, listings] = await Promise.all([getUserById(params.id), getListings()]);

  if (!user) {
    notFound();
  }

  const sellerListings = listings.filter((listing) => listing.sellerId === user.id);
  const averageRating =
    sellerListings.length > 0
      ? (
          sellerListings.reduce((total, listing) => total + (listing.rating || 5), 0) / sellerListings.length
        ).toFixed(1)
      : '5.0';

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <Link href="/messages" className="text-sm font-medium text-slate-600 hover:text-slate-900">
        Back
      </Link>

      <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <SectionHeader
          title={user.name}
          subtitle={`${user.location} / ${sellerListings.length} listings / ${averageRating} rating`}
        />
        {user.bio ? <p className="mt-4 max-w-3xl text-slate-600">{user.bio}</p> : null}
      </div>

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-slate-900">Listings from this seller</h2>
        {sellerListings.length === 0 ? (
          <p className="mt-4 text-slate-600">No active listings yet.</p>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sellerListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
