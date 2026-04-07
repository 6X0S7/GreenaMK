import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ListingCard } from '../components/ListingCard';
import { palette, spacing } from '../theme';
import { Listing } from '../types';

type BrowseScreenProps = {
  listings: Listing[];
  loading?: boolean;
  error?: string | null;
  searchQuery: string;
  onChangeSearchQuery: (query: string) => void;
  onSubmitSearch: (query: string) => void;
  onOpenListing: (listingId: string) => void;
  onOpenCart: () => void;
};

export function BrowseScreen({
  listings,
  loading,
  error,
  searchQuery,
  onChangeSearchQuery,
  onSubmitSearch,
  onOpenListing,
  onOpenCart,
}: BrowseScreenProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'best' | 'newest' | 'priceLow' | 'priceHigh'>('best');
  const [maxDistance, setMaxDistance] = useState('10');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [category, setCategory] = useState('All');
  const [buyFormat, setBuyFormat] = useState<'all' | 'buyNow' | 'auction'>('all');
  const [draftLocation, setDraftLocation] = useState('Plymouth');
  const [draftDistance, setDraftDistance] = useState(maxDistance);
  const filterTranslateX = useRef(new Animated.Value(420)).current;
  const filterBackdropOpacity = useRef(new Animated.Value(0)).current;
  const cityName = draftLocation || 'Plymouth';

  useEffect(() => {
    if (isFilterOpen) {
      filterTranslateX.setValue(420);
      filterBackdropOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(filterTranslateX, {
          toValue: 0,
          duration: 240,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(filterBackdropOpacity, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [filterBackdropOpacity, filterTranslateX, isFilterOpen]);

  function closeFilter() {
    Animated.parallel([
      Animated.timing(filterTranslateX, {
        toValue: 420,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(filterBackdropOpacity, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => setIsFilterOpen(false));
  }

  const filteredListings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const min = minPrice ? Number(minPrice) : Number.NaN;
    const max = maxPrice ? Number(maxPrice) : Number.NaN;
    const distance = maxDistance ? Number(maxDistance) : Number.POSITIVE_INFINITY;

    const next = listings.filter((listing) => {
      const matchesQuery =
        !query ||
        [listing.title, listing.category, listing.location, listing.seller, listing.description || '']
          .join(' ')
          .toLowerCase()
          .includes(query);
      const matchesCategory = category === 'All' || listing.category === category;
      const numericPrice = Number(listing.price.replace(/[^\d.]/g, ''));
      const matchesMin = !Number.isFinite(min) || numericPrice >= min;
      const matchesMax = !Number.isFinite(max) || numericPrice <= max;
      const matchesDistance = (listing.distanceMiles ?? Number.POSITIVE_INFINITY) <= distance;
      const matchesBuyFormat = buyFormat === 'all' || (buyFormat === 'buyNow' && !listing.price.includes('/'));

      return matchesQuery && matchesCategory && matchesMin && matchesMax && matchesDistance && matchesBuyFormat;
    });

    return next.sort((a, b) => {
      const aPrice = Number(a.price.replace(/[^\d.]/g, ''));
      const bPrice = Number(b.price.replace(/[^\d.]/g, ''));

      switch (sortBy) {
        case 'newest':
          return (b.distanceMiles ?? 0) - (a.distanceMiles ?? 0);
        case 'priceLow':
          return aPrice - bPrice;
        case 'priceHigh':
          return bPrice - aPrice;
        default:
          return (a.distanceMiles ?? 0) - (b.distanceMiles ?? 0);
      }
    });
  }, [listings, searchQuery, category, minPrice, maxPrice, maxDistance, buyFormat, sortBy]);

  const categories = ['All', ...new Set(listings.map((listing) => listing.category))];
  const sortLabel =
    sortBy === 'best'
      ? 'Best match'
      : sortBy === 'newest'
        ? 'Newly listed'
        : sortBy === 'priceLow'
          ? 'Price lowest'
          : 'Price highest';

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={18} color={palette.muted} />
          <TextInput
            value={searchQuery}
            onChangeText={onChangeSearchQuery}
            placeholder="Search for anything"
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            returnKeyType="search"
            onSubmitEditing={() => onSubmitSearch(searchQuery)}
          />
        </View>
        <Pressable style={styles.cartButton} onPress={onOpenCart}>
          <Ionicons name="cart-outline" size={20} color={palette.text} />
        </Pressable>
      </View>

      <View style={styles.controlsRow}>
        <Pressable style={styles.locationButton} onPress={() => setIsLocationOpen(true)}>
          <Ionicons name="location-outline" size={15} color={palette.text} />
          <Text style={styles.locationText}>{cityName}</Text>
          <Text style={styles.locationDistance}>{maxDistance} mi</Text>
        </Pressable>

        <View style={styles.rightControls}>
          <View style={styles.sortWrap}>
            <Pressable style={styles.sortButton} onPress={() => setIsSortOpen((value) => !value)}>
              <Text style={styles.sortButtonText}>Sort</Text>
              <Ionicons name={isSortOpen ? 'chevron-up' : 'chevron-down'} size={15} color={palette.text} />
            </Pressable>
            {isSortOpen ? (
              <View style={styles.sortMenu}>
                {[
                  ['best', 'Best match'],
                  ['newest', 'Newly listed'],
                  ['priceLow', 'Price lowest'],
                  ['priceHigh', 'Price highest'],
                ].map(([value, label]) => (
                  <Pressable
                    key={value}
                    style={styles.sortOption}
                    onPress={() => {
                      setSortBy(value as typeof sortBy);
                      setIsSortOpen(false);
                    }}
                  >
                    <Text style={[styles.sortOptionText, sortBy === value && styles.sortOptionTextActive]}>{label}</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </View>

          <Text style={styles.resultsText}>{loading ? 'Syncing...' : `${filteredListings.length} results`}</Text>

          <Pressable style={styles.filterIconButton} onPress={() => setIsFilterOpen(true)}>
            <Ionicons name="options-outline" size={18} color={palette.text} />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {!loading && !error && filteredListings.length === 0 ? <Text style={styles.emptyText}>No listings match this search yet.</Text> : null}

        {filteredListings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} onPress={() => onOpenListing(listing.id)} />
        ))}
      </ScrollView>

      <Modal visible={isFilterOpen} transparent animationType="none" onRequestClose={closeFilter}>
        <View style={styles.filterModal}>
          <Animated.View style={[styles.filterBackdrop, { opacity: filterBackdropOpacity }]}>
            <Pressable style={styles.filterDismissArea} onPress={closeFilter} />
          </Animated.View>
          <Animated.View style={[styles.filterSheet, { transform: [{ translateX: filterTranslateX }] }]}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Filter</Text>
              <Pressable onPress={closeFilter}>
                <Ionicons name="close" size={22} color={palette.text} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Sort</Text>
                {[
                  ['best', 'Best match'],
                  ['newest', 'Newly listed'],
                  ['priceLow', 'Price + shipping: lowest first'],
                  ['priceHigh', 'Price + shipping: highest first'],
                ].map(([value, label]) => (
                  <Pressable key={value} style={styles.optionRow} onPress={() => setSortBy(value as typeof sortBy)}>
                    <Text style={styles.optionText}>{label}</Text>
                    {sortBy === value ? <Ionicons name="checkmark" size={18} color={palette.forest} /> : null}
                  </Pressable>
                ))}
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Buying format</Text>
                {[
                  ['all', 'All listings'],
                  ['buyNow', 'Buy it now'],
                  ['auction', 'Auction'],
                ].map(([value, label]) => (
                  <Pressable key={value} style={styles.optionRow} onPress={() => setBuyFormat(value as typeof buyFormat)}>
                    <Text style={styles.optionText}>{label}</Text>
                    {buyFormat === value ? <Ionicons name="checkmark" size={18} color={palette.forest} /> : null}
                  </Pressable>
                ))}
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Categories</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChips}>
                  {categories.map((item) => (
                    <Pressable key={item} style={[styles.filterChip, category === item && styles.filterChipActive]} onPress={() => setCategory(item)}>
                      <Text style={[styles.filterChipText, category === item && styles.filterChipTextActive]}>{item}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Price range</Text>
                <View style={styles.priceRow}>
                  <TextInput value={minPrice} onChangeText={setMinPrice} placeholder="Min" keyboardType="numeric" style={styles.input} />
                  <TextInput value={maxPrice} onChangeText={setMaxPrice} placeholder="Max" keyboardType="numeric" style={styles.input} />
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Distance</Text>
                <TextInput value={maxDistance} onChangeText={setMaxDistance} placeholder="Miles" keyboardType="numeric" style={styles.input} />
              </View>
            </ScrollView>

            <View style={styles.filterActions}>
              <Pressable
                style={styles.clearButton}
                onPress={() => {
                  setCategory('All');
                  setBuyFormat('all');
                  setSortBy('best');
                  setMinPrice('');
                  setMaxPrice('');
                  setMaxDistance('10');
                }}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </Pressable>
              <Pressable style={styles.applyButton} onPress={closeFilter}>
                <Text style={styles.applyButtonText}>Show results</Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Modal>

      <Modal visible={isLocationOpen} transparent animationType="slide" onRequestClose={() => setIsLocationOpen(false)}>
        <View style={styles.locationBackdrop}>
          <View style={styles.locationCard}>
            <Text style={styles.locationModalTitle}>Choose your area</Text>
            <View style={styles.mapMock}>
              <Ionicons name="map-outline" size={24} color={palette.moss} />
              <Text style={styles.mapText}>Map preview</Text>
            </View>
            <TextInput value={draftLocation} onChangeText={setDraftLocation} style={styles.input} placeholder="Enter your location" />
            <TextInput value={draftDistance} onChangeText={setDraftDistance} style={styles.input} placeholder="Radius in miles" keyboardType="numeric" />
            <View style={styles.locationActions}>
              <Pressable style={styles.clearButton} onPress={() => setDraftLocation('Use my current location')}>
                <Text style={styles.clearButtonText}>Locate me</Text>
              </Pressable>
              <Pressable
                style={styles.applyButton}
                onPress={() => {
                  const next = Number(draftDistance);
                  if (Number.isFinite(next) && next > 0) {
                    setMaxDistance(String(next));
                  }
                  setIsLocationOpen(false);
                }}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.white,
  },
  topBar: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === 'ios' ? spacing.xxl + 12 : spacing.lg,
    paddingBottom: spacing.sm,
  },
  searchWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    color: palette.text,
    fontSize: 14,
  },
  cartButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    zIndex: 2,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  locationText: {
    color: palette.text,
    fontSize: 13,
    fontWeight: '600',
  },
  locationDistance: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: '500',
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sortWrap: {
    position: 'relative',
    zIndex: 3,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sortButtonText: {
    color: palette.text,
    fontSize: 13,
    fontWeight: '600',
  },
  sortMenu: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: palette.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.line,
    minWidth: 160,
    overflow: 'hidden',
  },
  sortOption: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  sortOptionText: {
    color: palette.text,
    fontSize: 13,
    fontWeight: '500',
  },
  sortOptionTextActive: {
    color: palette.forest,
    fontWeight: '700',
  },
  resultsText: {
    color: palette.text,
    fontSize: 13,
    fontWeight: '600',
  },
  filterIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 120,
    gap: spacing.md,
  },
  errorText: {
    color: palette.red,
    fontSize: 14,
    lineHeight: 21,
  },
  emptyText: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  filterModal: {
    flex: 1,
  },
  filterBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(17,24,39,0.2)',
  },
  filterDismissArea: {
    flex: 1,
  },
  filterSheet: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '88%',
    height: '100%',
    backgroundColor: palette.white,
    paddingTop: Platform.OS === 'ios' ? spacing.xxl + 8 : spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.md,
  },
  filterTitle: {
    color: palette.text,
    fontSize: 22,
    fontWeight: '700',
  },
  filterContent: {
    gap: spacing.lg,
    paddingBottom: spacing.lg,
  },
  filterSection: {
    gap: spacing.sm,
  },
  filterLabel: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '700',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: palette.line,
  },
  optionText: {
    color: palette.text,
    fontSize: 14,
  },
  filterChips: {
    gap: spacing.sm,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: palette.white,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterChipActive: {
    backgroundColor: '#F3F4F6',
    borderColor: '#F3F4F6',
  },
  filterChipText: {
    color: palette.text,
    fontSize: 12,
    fontWeight: '500',
  },
  filterChipTextActive: {
    fontWeight: '700',
  },
  priceRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: palette.text,
    fontSize: 14,
  },
  filterActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: palette.line,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  clearButtonText: {
    color: palette.text,
    fontSize: 13,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1.2,
    backgroundColor: palette.forest,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  applyButtonText: {
    color: palette.white,
    fontSize: 13,
    fontWeight: '700',
  },
  locationBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(17,24,39,0.28)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  locationCard: {
    backgroundColor: palette.white,
    borderRadius: 24,
    padding: spacing.lg,
    gap: spacing.md,
  },
  locationModalTitle: {
    color: palette.text,
    fontSize: 20,
    fontWeight: '700',
  },
  mapMock: {
    height: 150,
    borderRadius: 20,
    backgroundColor: '#EEF8F7',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  mapText: {
    color: palette.moss,
    fontSize: 14,
    fontWeight: '600',
  },
  locationActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
