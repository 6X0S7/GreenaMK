import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ListingCard } from '../components/ListingCard';
import { ScreenShell } from '../components/ScreenShell';
import { categories } from '../data/mock';
import { palette, spacing } from '../theme';
import { Listing } from '../types';

type BrowseScreenProps = {
  listings: Listing[];
  loading?: boolean;
  error?: string | null;
  onOpenListing: (listingId: string) => void;
};

export function BrowseScreen({ listings, loading, error, onOpenListing }: BrowseScreenProps) {
  const [activeCategory, setActiveCategory] = useState<string>('Tools');
  const filteredListings = listings.filter((listing) => {
    if (activeCategory === 'All') {
      return true;
    }

    if (activeCategory === 'Free Stuff') {
      return listing.price.toLowerCase().includes('free');
    }

    return listing.category === activeCategory;
  });

  return (
    <ScreenShell title="Browse" subtitle="Testing category chips, tighter search patterns, and card density for smaller screens.">
      <View style={styles.searchCard}>
        <Text style={styles.searchLabel}>Search</Text>
        <Text style={styles.searchPlaceholder}>Live website data is feeding this screen now.</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {['All', ...categories].map((category) => (
          <Pressable
            key={category}
            onPress={() => setActiveCategory(category)}
            style={[styles.chip, activeCategory === category && styles.chipActive]}
          >
            <Text style={[styles.chipText, activeCategory === category && styles.chipTextActive]}>{category}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.resultsRow}>
        <Text style={styles.resultsTitle}>{loading ? 'Syncing...' : `${filteredListings.length} results`}</Text>
        <Pressable style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Filters</Text>
        </Pressable>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {!loading && !error && filteredListings.length === 0 ? (
        <Text style={styles.emptyText}>No live listings match this category yet.</Text>
      ) : null}

      {filteredListings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} onPress={() => onOpenListing(listing.id)} />
      ))}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  searchCard: {
    backgroundColor: palette.white,
    borderRadius: 22,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: palette.line,
    gap: 6,
  },
  searchLabel: {
    color: palette.moss,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  searchPlaceholder: {
    color: palette.muted,
    fontSize: 16,
  },
  chips: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  chip: {
    backgroundColor: palette.white,
    borderColor: palette.line,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  chipActive: {
    backgroundColor: '#F3F4F6',
    borderColor: '#F3F4F6',
  },
  chipText: {
    color: palette.text,
    fontSize: 13,
    fontWeight: '700',
  },
  chipTextActive: {
    color: palette.navActive,
  },
  resultsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultsTitle: {
    color: palette.text,
    fontSize: 15,
    fontWeight: '700',
  },
  filterButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterButtonText: {
    color: palette.text,
    fontSize: 12,
    fontWeight: '700',
  },
  emptyText: {
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
