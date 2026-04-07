import { ListingCard } from '../components/ListingCard';
import { ScreenShell } from '../components/ScreenShell';
import { Listing } from '../types';

type SavedScreenProps = {
  listings: Listing[];
  onOpenListing: (listingId: string) => void;
  onOpenBrowse: () => void;
};

export function SavedScreen({ listings, onOpenListing }: SavedScreenProps) {
  return (
    <ScreenShell title="Saved" hideEyebrow headerOffset={-36}>
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} onPress={() => onOpenListing(listing.id)} />
      ))}
    </ScreenShell>
  );
}
