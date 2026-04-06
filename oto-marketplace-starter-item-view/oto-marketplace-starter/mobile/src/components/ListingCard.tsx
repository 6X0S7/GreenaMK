import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Listing } from '../types';
import { palette, spacing } from '../theme';

type ListingCardProps = {
  listing: Listing;
  onPress?: () => void;
};

export function ListingCard({ listing, onPress }: ListingCardProps) {
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]} onPress={onPress}>
      <View style={styles.imagePlaceholder}>
        {listing.image ? <Image source={{ uri: listing.image }} style={styles.image} resizeMode="cover" /> : null}
        <View style={styles.imageTopRow}>
          <Text style={styles.imageLabel}>{listing.category}</Text>
          <View style={styles.heartButton}>
            <Ionicons name="heart-outline" size={18} color={palette.text} />
          </View>
        </View>
        <View style={styles.galleryDots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.row}>
          <Text style={styles.price}>{listing.price}</Text>
          {listing.badge ? <Text style={styles.badge}>{listing.badge}</Text> : null}
        </View>
        <Text style={styles.title}>{listing.title}</Text>
        <Text style={styles.meta}>
          {listing.condition} · {listing.location} · {listing.distance}
        </Text>
        <View style={styles.footerRow}>
          <Text style={styles.seller}>Seller: {listing.seller}</Text>
          <View style={styles.ctaPill}>
            <Text style={styles.ctaText}>View</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.white,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: palette.line,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.995 }],
  },
  imagePlaceholder: {
    height: 168,
    backgroundColor: palette.mist,
    justifyContent: 'space-between',
    padding: spacing.md,
    position: 'relative',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  imageTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  imageLabel: {
    backgroundColor: palette.sage,
    color: palette.forest,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: '700',
  },
  heartButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryDots: {
    flexDirection: 'row',
    gap: 6,
    alignSelf: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(17,24,39,0.18)',
  },
  dotActive: {
    width: 18,
    backgroundColor: palette.text,
  },
  body: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  price: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '800',
  },
  badge: {
    color: palette.forest,
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '700',
  },
  meta: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 20,
  },
  seller: {
    color: palette.slate,
    fontSize: 13,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginTop: 6,
  },
  ctaPill: {
    backgroundColor: '#F3F4F6',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  ctaText: {
    color: palette.text,
    fontSize: 12,
    fontWeight: '700',
  },
});
