import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ListingCard } from '../components/ListingCard';
import { ScreenShell } from '../components/ScreenShell';
import { palette } from '../theme';
import { Listing } from '../types';

type SavedScreenProps = {
  listings: Listing[];
  onOpenListing: (listingId: string) => void;
  onOpenBrowse: () => void;
};

export function SavedScreen({ listings, onOpenListing, onOpenBrowse }: SavedScreenProps) {
  return (
    <ScreenShell title="Saved" subtitle="A quick look at how favorites and watchlists might sit inside a more app-native flow.">
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Prototype saved items</Text>
        <Text style={styles.summaryBody}>
          This screen is still using a lightweight placeholder selection until we wire authenticated saved state across web and app.
        </Text>
        <Pressable onPress={onOpenBrowse} style={styles.summaryButton}>
          <Text style={styles.summaryButtonText}>Browse more</Text>
        </Pressable>
      </View>

      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} onPress={() => onOpenListing(listing.id)} />
      ))}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  summary: {
    backgroundColor: palette.mist,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: palette.line,
    padding: 16,
    gap: 8,
  },
  summaryTitle: {
    color: palette.text,
    fontSize: 20,
    fontWeight: '800',
  },
  summaryBody: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  summaryButton: {
    alignSelf: 'flex-start',
    marginTop: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  summaryButtonText: {
    color: palette.text,
    fontSize: 12,
    fontWeight: '700',
  },
});
