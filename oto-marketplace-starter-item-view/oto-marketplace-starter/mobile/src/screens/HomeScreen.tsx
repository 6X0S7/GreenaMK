import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ListingCard } from '../components/ListingCard';
import { ScreenShell } from '../components/ScreenShell';
import { palette, spacing } from '../theme';
import { Listing } from '../types';

type HomeScreenProps = {
  listings: Listing[];
  loading?: boolean;
  error?: string | null;
  onOpenListing: (listingId: string) => void;
  onOpenBrowse: () => void;
};

export function HomeScreen({ listings, loading, error, onOpenListing, onOpenBrowse }: HomeScreenProps) {
  return (
    <ScreenShell
      title="Local finds, faster"
      subtitle="A first-pass app concept focused on quick browsing, compact cards, and stronger mobile hierarchy."
    >
      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>Nearby now</Text>
        <Text style={styles.heroTitle}>This app is now reading the website's live data layer.</Text>
        <Text style={styles.heroBody}>
          Keep the Next.js site running and this prototype will pull the same listings and messages you already see on web.
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured picks</Text>
        <Pressable onPress={onOpenBrowse}>
          <Text style={styles.sectionAction}>See all</Text>
        </Pressable>
      </View>

      {loading ? <Text style={styles.infoText}>Loading website listings...</Text> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {!loading && !error && listings.length === 0 ? <Text style={styles.infoText}>No live listings found yet.</Text> : null}

      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} onPress={() => onOpenListing(listing.id)} />
      ))}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: '#F4FBFA',
    borderRadius: 24,
    padding: spacing.xl,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: '#D9F1EE',
  },
  heroLabel: {
    color: palette.moss,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroTitle: {
    color: palette.text,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
  heroBody: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: palette.text,
    fontSize: 19,
    fontWeight: '800',
  },
  sectionAction: {
    color: palette.moss,
    fontSize: 14,
    fontWeight: '700',
  },
  infoText: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  errorText: {
    color: palette.red,
    fontSize: 14,
    lineHeight: 21,
  },
});
