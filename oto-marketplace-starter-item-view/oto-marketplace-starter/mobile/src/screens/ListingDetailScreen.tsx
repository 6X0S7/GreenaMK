import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TopBar } from '../components/TopBar';
import { palette, spacing } from '../theme';
import { Listing } from '../types';

type ListingDetailScreenProps = {
  listing: Listing;
  onBack: () => void;
};

export function ListingDetailScreen({ listing, onBack }: ListingDetailScreenProps) {
  return (
    <View style={styles.screen}>
      <TopBar title="Listing" subtitle={listing.location} onBack={onBack} rightLabel="Share" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.gallery}>
          {listing.image ? <Image source={{ uri: listing.image }} style={styles.galleryImage} resizeMode="cover" /> : null}
          <View style={styles.galleryBadge}>
            <Text style={styles.galleryBadgeText}>{listing.category}</Text>
          </View>
          <View style={styles.galleryFooter}>
            <View style={styles.galleryDots}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
            <View style={styles.galleryCounter}>
              <Ionicons name="images-outline" size={16} color={palette.text} />
              <Text style={styles.galleryCounterText}>Live image</Text>
            </View>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.titleRow}>
            <View style={styles.titleWrap}>
              <Text style={styles.price}>{listing.price}</Text>
              <Text style={styles.title}>{listing.title}</Text>
            </View>
            <Pressable style={styles.saveButton}>
              <Ionicons name="heart-outline" size={20} color={palette.text} />
            </Pressable>
          </View>

          <Text style={styles.meta}>
            {listing.condition} · {listing.location} · {listing.distance}
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statPill}>
              <Ionicons name="flash-outline" size={15} color={palette.moss} />
              <Text style={styles.statText}>Fast response</Text>
            </View>
            <View style={styles.statPill}>
              <Ionicons name="car-outline" size={15} color={palette.moss} />
              <Text style={styles.statText}>Delivery possible</Text>
            </View>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Description</Text>
          <Text style={styles.panelBody}>
            {listing.description ||
              'A richer detail page helps us test hierarchy better than the web cards. This should eventually hold real photos, seller notes, condition detail, and availability without feeling crowded.'}
          </Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Seller</Text>
          <View style={styles.sellerRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{listing.seller.slice(0, 1)}</Text>
            </View>
            <View style={styles.sellerCopy}>
              <Text style={styles.sellerName}>{listing.seller}</Text>
              <Text style={styles.sellerMeta}>Live marketplace seller data from the current website seed.</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomActions}>
        <Pressable style={styles.secondaryButton}>
          <Text style={styles.secondaryText}>Make offer</Text>
        </Pressable>
        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryText}>Message seller</Text>
        </Pressable>
      </View>
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
    paddingBottom: 130,
    gap: spacing.lg,
  },
  gallery: {
    height: 280,
    borderRadius: 26,
    backgroundColor: palette.mist,
    padding: spacing.lg,
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative',
  },
  galleryImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  galleryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: palette.sage,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  galleryBadgeText: {
    color: palette.forest,
    fontSize: 12,
    fontWeight: '700',
  },
  galleryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  galleryDots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(17,24,39,0.2)',
  },
  dotActive: {
    width: 18,
    backgroundColor: palette.text,
  },
  galleryCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.86)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
  },
  galleryCounterText: {
    color: palette.text,
    fontSize: 12,
    fontWeight: '700',
  },
  summaryCard: {
    gap: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  titleWrap: {
    flex: 1,
    gap: 6,
  },
  price: {
    color: palette.forest,
    fontSize: 26,
    fontWeight: '800',
  },
  title: {
    color: palette.text,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  saveButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F5FBFA',
    borderWidth: 1,
    borderColor: '#D9F1EE',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  statText: {
    color: palette.text,
    fontSize: 13,
    fontWeight: '700',
  },
  panel: {
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 22,
    padding: spacing.lg,
    gap: spacing.sm,
    backgroundColor: palette.white,
  },
  panelTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '800',
  },
  panelBody: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 23,
  },
  sellerRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#EEF8F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: palette.forest,
    fontSize: 20,
    fontWeight: '800',
  },
  sellerCopy: {
    flex: 1,
    gap: 4,
  },
  sellerName: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '800',
  },
  sellerMeta: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  bottomActions: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: palette.white,
    borderTopWidth: 1,
    borderTopColor: palette.line,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 26,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  secondaryText: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '700',
  },
  primaryButton: {
    flex: 1.2,
    borderRadius: 16,
    backgroundColor: palette.forest,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  primaryText: {
    color: palette.white,
    fontSize: 14,
    fontWeight: '800',
  },
});
