import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Listing } from '../types';
import { palette, spacing } from '../theme';

type ListingCardProps = {
  listing: Listing;
  onPress?: () => void;
};

function getRatingColor(rating: number) {
  if (rating >= 4) {
    return '#159947';
  }

  if (rating >= 3) {
    return '#F08A24';
  }

  return '#D14343';
}

function getListingTypeLabel(listing: Listing) {
  if (listing.type === 'rent') {
    return 'To rent';
  }

  if (listing.type === 'rent-to-own') {
    return 'Rent to own';
  }

  if (listing.category === 'Free Stuff') {
    return 'Free stuff';
  }

  return 'For sale';
}

export function ListingCard({ listing, onPress }: ListingCardProps) {
  const rating = listing.rating ?? 4.2;
  const ratingColor = getRatingColor(rating);
  const sellerInitials = listing.seller
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]} onPress={onPress}>
      <View style={styles.imageWrap}>
        {listing.image ? <Image source={{ uri: listing.image }} style={styles.image} resizeMode="cover" /> : null}
        {!listing.image ? <View style={styles.imageFallback} /> : null}
        {listing.category === 'Free Stuff' ? (
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{listing.category}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {listing.title}
        </Text>

        <Text style={styles.typeLine} numberOfLines={1}>
          {getListingTypeLabel(listing)}
        </Text>

        <Text style={styles.meta} numberOfLines={1}>
          {listing.location} · {listing.distance}
        </Text>

        <View style={styles.bottomRow}>
          <View style={styles.sellerRow}>
            <View style={styles.sellerThumb}>
              {listing.image ? <Image source={{ uri: listing.image }} style={styles.sellerThumbImage} resizeMode="cover" /> : <View style={styles.sellerThumbFallback} />}
            </View>
            <View style={styles.initialsBadge}>
              <Text style={styles.initialsText}>{sellerInitials}</Text>
            </View>
            <Ionicons name="star" size={13} color={ratingColor} />
            <Text style={[styles.rating, { color: ratingColor }]}>{rating.toFixed(1)}/5</Text>
          </View>

          <Text style={styles.price} numberOfLines={1}>
            {listing.price.replace('Â£', '£')}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'stretch',
    backgroundColor: palette.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.line,
    padding: spacing.sm,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.995 }],
  },
  imageWrap: {
    width: 108,
    height: 108,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: palette.mist,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageFallback: {
    flex: 1,
    backgroundColor: palette.mist,
  },
  categoryPill: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  categoryText: {
    color: palette.text,
    fontSize: 11,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 2,
    gap: 6,
  },
  title: {
    color: palette.text,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 20,
  },
  typeLine: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: '400',
  },
  meta: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: '400',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
  },
  sellerThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: palette.mist,
  },
  sellerThumbImage: {
    width: '100%',
    height: '100%',
  },
  sellerThumbFallback: {
    flex: 1,
    backgroundColor: palette.mist,
  },
  initialsBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    color: palette.text,
    fontSize: 10,
    fontWeight: '700',
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
  },
  price: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 18,
    textAlign: 'right',
    maxWidth: 96,
  },
});
