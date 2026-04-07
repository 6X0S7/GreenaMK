import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ListingCard } from '../components/ListingCard';
import { ScreenShell } from '../components/ScreenShell';
import { palette, spacing } from '../theme';
import { Listing } from '../types';
import { useMemo, useState } from 'react';

type HomeScreenProps = {
  historyListings: Listing[];
  freeListings: Listing[];
  personalizedListings: Listing[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  activeDistance: number;
  onChangeDistance: (distance: number) => void;
  onOpenListing: (listingId: string) => void;
  onSearch: (query: string) => void;
  onOpenCart: () => void;
};

function RailCard({ listing, onPress }: { listing: Listing; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.railCard}>
      <View style={styles.railImageWrap}>
        {listing.image ? <Image source={{ uri: listing.image }} style={styles.railImage} resizeMode="cover" /> : null}
        <View style={styles.railOverlay}>
          <View style={styles.railBadge}>
            <Text style={styles.railBadgeText}>{listing.category}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.railTitle} numberOfLines={2}>
        {listing.title}
      </Text>
      <Text style={styles.railPrice}>{listing.price}</Text>
    </Pressable>
  );
}

export function HomeScreen({
  historyListings,
  freeListings,
  personalizedListings,
  loading,
  error,
  onRetry,
  activeDistance,
  onChangeDistance,
  onOpenListing,
  onSearch,
  onOpenCart,
}: HomeScreenProps) {
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [draftLocation, setDraftLocation] = useState('Plymouth');
  const [draftDistance, setDraftDistance] = useState(String(activeDistance));
  const [searchText, setSearchText] = useState('');
  const cityName = draftLocation || 'Plymouth';
  const titleDistance = `${activeDistance} mi`;

  const railHistory = useMemo(() => historyListings.slice(0, 8), [historyListings]);
  const railFree = useMemo(() => freeListings.slice(0, 8), [freeListings]);

  return (
    <ScreenShell hideHeader contentTopPadding={Platform.OS === 'ios' ? 0 : spacing.lg}>
      <View style={styles.topControls}>
        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={18} color={palette.muted} />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search for anything"
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            returnKeyType="search"
            onSubmitEditing={() => {
              const query = searchText.trim();
              if (query) {
                onSearch(query);
              }
            }}
          />
        </View>
        <Pressable style={styles.cartButton} onPress={onOpenCart}>
          <Ionicons name="cart-outline" size={20} color={palette.text} />
        </Pressable>
      </View>

      <View style={styles.headerRow}>
        <Text style={styles.forYouTitle}>For you</Text>
        <Pressable onPress={() => setIsLocationOpen(true)} style={styles.locationButton}>
          <Ionicons name="location-outline" size={16} color={palette.text} />
          <Text style={styles.locationText}>{cityName}</Text>
          <Text style={styles.locationDistance}>{titleDistance}</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Your history</Text>

      {loading ? <Text style={styles.infoText}>Loading products...</Text> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {error && onRetry ? (
        <Pressable onPress={onRetry} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry sync</Text>
        </Pressable>
      ) : null}

      <View style={styles.railSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.railContent}>
          {railHistory.map((listing) => (
            <RailCard key={listing.id} listing={listing} onPress={() => onOpenListing(listing.id)} />
          ))}
        </ScrollView>
      </View>

      <Text style={styles.sectionTitle}>Free stuff</Text>

      <View style={styles.railSection}>
        {railFree.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.railContent}>
            {railFree.map((listing) => (
              <RailCard key={listing.id} listing={listing} onPress={() => onOpenListing(listing.id)} />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyRail}>
            <Text style={styles.emptyTitle}>Nothing free nearby yet</Text>
            <Text style={styles.emptyText}>Try widening your radius or check again after more listings are viewed.</Text>
          </View>
        )}
      </View>

      <Text style={styles.sectionTitle}>Personalised ads</Text>

      {personalizedListings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} onPress={() => onOpenListing(listing.id)} />
      ))}

      <Modal visible={isLocationOpen} transparent animationType="slide" onRequestClose={() => setIsLocationOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Choose your area</Text>
            <View style={styles.mapMock}>
              <Ionicons name="map-outline" size={24} color={palette.moss} />
              <Text style={styles.mapText}>Map preview</Text>
            </View>
            <TextInput value={draftLocation} onChangeText={setDraftLocation} style={styles.input} placeholder="Enter your location" />
            <TextInput
              value={draftDistance}
              onChangeText={setDraftDistance}
              style={styles.input}
              placeholder="Radius in miles"
              keyboardType="numeric"
            />
            <View style={styles.modalActions}>
              <Pressable style={styles.secondaryButton} onPress={() => setDraftLocation('Use my current location')}>
                <Text style={styles.secondaryButtonText}>Locate me</Text>
              </Pressable>
              <Pressable
                style={styles.primaryButton}
                onPress={() => {
                  const next = Number(draftDistance);
                  if (Number.isFinite(next) && next > 0) {
                    onChangeDistance(next);
                  }
                  setIsLocationOpen(false);
                }}
              >
                <Text style={styles.primaryButtonText}>Apply</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  topControls: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingTop: 0,
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: palette.text,
    fontSize: 24,
    fontWeight: '700',
  },
  forYouTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '700',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
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
  railSection: {
    marginTop: -6,
  },
  railContent: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  railCard: {
    width: 160,
    gap: 8,
  },
  railImageWrap: {
    height: 140,
    borderRadius: 18,
    backgroundColor: palette.mist,
    overflow: 'hidden',
  },
  railImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  railOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 10,
  },
  railBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  railBadgeText: {
    color: palette.text,
    fontSize: 11,
    fontWeight: '600',
  },
  railTitle: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
  },
  railPrice: {
    color: palette.text,
    fontSize: 15,
    fontWeight: '400',
  },
  emptyRail: {
    backgroundColor: palette.mist,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 20,
    padding: spacing.lg,
    gap: 6,
  },
  emptyTitle: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 20,
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
  retryButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  retryText: {
    color: palette.text,
    fontSize: 12,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(17,24,39,0.28)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: palette.white,
    borderRadius: 24,
    padding: spacing.lg,
    gap: spacing.md,
  },
  modalTitle: {
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
  input: {
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: palette.text,
    fontSize: 14,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  secondaryButtonText: {
    color: palette.text,
    fontSize: 13,
    fontWeight: '600',
  },
  primaryButton: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: palette.forest,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: palette.white,
    fontSize: 13,
    fontWeight: '700',
  },
});
