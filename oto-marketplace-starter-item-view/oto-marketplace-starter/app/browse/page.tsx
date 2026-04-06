import BrowseFilters from '@/components/BrowseFilters';
import ListingCard from '@/components/ListingCard';
import { marketplaceCategories } from '@/lib/constants';
import { getListings } from '@/lib/file-db';
import { isFreeStuffListing, matchesDistance, matchesPriceRange } from '@/lib/marketplace';

export const dynamic = 'force-dynamic';

const browseModes = [
  { value: 'buy', label: 'Buy' },
  { value: 'rent', label: 'Rent' },
  { value: 'rent-to-own', label: 'Rent-to-own' },
  { value: 'free', label: 'Free Stuff' },
] as const;

function getDistanceValue(distanceMode?: string, distance?: string) {
  return distanceMode === 'range' ? distance || '' : '';
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams?: {
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    distance?: string;
    distanceMode?: string;
    mode?: string;
  };
}) {
  const listings = await getListings();
  const query = searchParams?.q?.trim().toLowerCase() || '';
  const selectedCategory = searchParams?.category || '';
  const selectedMinPrice = searchParams?.minPrice || '';
  const selectedMaxPrice = searchParams?.maxPrice || '';
  const selectedMode = browseModes.some((mode) => mode.value === searchParams?.mode)
    ? (searchParams?.mode as (typeof browseModes)[number]['value'])
    : 'buy';
  const selectedDistance = getDistanceValue(searchParams?.distanceMode, searchParams?.distance);
  const isFreeStuffMode = selectedMode === 'free';
  const categories = [...new Set([...marketplaceCategories, ...listings.map((listing) => listing.category)])]
    .filter((category) => category !== 'Free Stuff')
    .sort((a, b) => a.localeCompare(b));

  const filteredListings = listings.filter((listing) => {
    const haystack = [listing.title, listing.category, listing.location, listing.sellerName, listing.description]
      .join(' ')
      .toLowerCase();

    if (query && !haystack.includes(query)) {
      return false;
    }

    if (selectedMode === 'buy' && (listing.type !== 'sale' || isFreeStuffListing(listing))) {
      return false;
    }

    if (selectedMode === 'rent' && listing.type !== 'rent') {
      return false;
    }

    if (selectedMode === 'rent-to-own' && listing.type !== 'rent-to-own') {
      return false;
    }

    if (selectedMode === 'free' && !isFreeStuffListing(listing)) {
      return false;
    }

    if (selectedCategory && listing.category !== selectedCategory) {
      return false;
    }

    if (!isFreeStuffMode && !matchesPriceRange(listing, selectedMinPrice, selectedMaxPrice)) {
      return false;
    }

    if (!matchesDistance(listing, selectedDistance)) {
      return false;
    }

    return true;
  });

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Browse listings</h1>
          <p className="mt-2 text-slate-600">Search real seller-owned listings and narrow the results with live filters.</p>
        </div>

        <form action="/browse" className="w-full md:w-auto">
          <input type="hidden" name="q" value={query} />
          <input type="hidden" name="category" value={selectedCategory} />
          <input type="hidden" name="minPrice" value={selectedMinPrice} />
          <input type="hidden" name="maxPrice" value={selectedMaxPrice} />
          <input type="hidden" name="distanceMode" value={selectedDistance ? 'range' : ''} />
          <input type="hidden" name="distance" value={selectedDistance} />
          <div className="flex gap-2">
            <label className="block flex-1 text-sm font-medium text-slate-700">
              <span className="mb-2 block">Mode</span>
              <select
                name="mode"
                defaultValue={selectedMode}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none md:min-w-[220px]"
              >
                {browseModes.map((mode) => (
                  <option key={mode.value} value={mode.value}>
                    {mode.label}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="self-end rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white">
              Apply
            </button>
          </div>
        </form>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <BrowseFilters
          categories={categories}
          selectedCategory={selectedCategory}
          selectedMinPrice={selectedMinPrice}
          selectedMaxPrice={selectedMaxPrice}
          selectedDistance={selectedDistance}
          selectedMode={selectedMode}
          query={query}
          isFreeStuffMode={isFreeStuffMode}
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredListings.length === 0 ? (
            <div className="rounded-3xl bg-white p-6 text-slate-600 shadow-sm ring-1 ring-slate-200 md:col-span-2 xl:col-span-3">
              No listings match these filters yet.
            </div>
          ) : (
            filteredListings.map((listing) => <ListingCard key={listing.id} listing={listing} />)
          )}
        </div>
      </div>
    </main>
  );
}
