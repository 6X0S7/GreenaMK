import Ionicons from '@expo/vector-icons/Ionicons';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ListingCard } from '../components/ListingCard';
import { palette, spacing } from '../theme';
import { Listing } from '../types';

type SellerProfileScreenProps = {
  sellerName: string;
  initials: string;
  listings: Listing[];
  onBack: () => void;
  onOpenListing: (listingId: string) => void;
};

export function SellerProfileScreen({ sellerName, initials, listings, onBack, onOpenListing }: SellerProfileScreenProps) {
  const averageRating =
    listings.length > 0
      ? (listings.reduce((sum, listing) => sum + (listing.rating ?? 4.2), 0) / listings.length).toFixed(1)
      : '4.8';

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable onPress={onBack} style={styles.iconButton}>
            <Ionicons name="chevron-back" size={22} color={palette.text} />
          </Pressable>
        </View>

        <View style={styles.hero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{sellerName}</Text>
          <Text style={styles.meta}>
            {averageRating}/5 · {listings.length} listing{listings.length === 1 ? '' : 's'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Listings</Text>
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} onPress={() => onOpenListing(listing.id)} />
          ))}
          {listings.length === 0 ? <Text style={styles.emptyText}>This seller has no active listings yet.</Text> : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.white,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 120,
    gap: spacing.lg,
  },
  topBar: {
    paddingTop: Platform.OS === 'ios' ? spacing.xxl + 8 : spacing.sm,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#E8F7F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: palette.forest,
    fontSize: 30,
    fontWeight: '700',
  },
  name: {
    color: palette.text,
    fontSize: 26,
    fontWeight: '700',
  },
  meta: {
    color: palette.muted,
    fontSize: 14,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    color: palette.text,
    fontSize: 20,
    fontWeight: '700',
  },
  emptyText: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 21,
  },
});
