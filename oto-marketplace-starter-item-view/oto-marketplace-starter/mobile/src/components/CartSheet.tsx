import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { palette, spacing } from '../theme';
import { Listing } from '../types';

type CartSheetProps = {
  visible: boolean;
  items: Listing[];
  onClose: () => void;
  onOpenListing: (listingId: string) => void;
};

function getNumericPrice(price: string) {
  const numericPrice = Number(price.replace(/[^\d.]/g, ''));
  return Number.isFinite(numericPrice) ? numericPrice : 0;
}

function formatCurrency(amount: number) {
  return `£${amount.toFixed(2)}`;
}

export function CartSheet({ visible, items, onClose, onOpenListing }: CartSheetProps) {
  const subtotal = items.reduce((sum, item) => sum + getNumericPrice(item.price), 0);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.dismissArea} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>Cart</Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={20} color={palette.text} />
            </Pressable>
          </View>

          <Text style={styles.subtitle}>
            {items.length === 0 ? 'Your basket is empty for now.' : `${items.length} item${items.length === 1 ? '' : 's'} ready to review`}
          </Text>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            {items.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="bag-handle-outline" size={28} color={palette.muted} />
                <Text style={styles.emptyTitle}>Nothing in cart yet</Text>
                <Text style={styles.emptyText}>Save or open a listing and we can turn this into a real checkout flow next.</Text>
              </View>
            ) : (
              items.map((item) => (
                <Pressable key={item.id} style={styles.itemCard} onPress={() => onOpenListing(item.id)}>
                  <View style={styles.imageWrap}>
                    {item.image ? <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" /> : <View style={styles.imageFallback} />}
                  </View>

                  <View style={styles.itemBody}>
                    <View style={styles.itemTopRow}>
                      <Text style={styles.itemTitle} numberOfLines={2}>
                        {item.title}
                      </Text>
                      <Text style={styles.itemPrice}>{item.price.replace('Â£', '£')}</Text>
                    </View>

                    <Text style={styles.metaText} numberOfLines={1}>
                      {item.seller} · {item.location}
                    </Text>

                    <View style={styles.metaRow}>
                      <View style={styles.tag}>
                        <Text style={styles.tagText}>{item.condition}</Text>
                      </View>
                      <Text style={styles.metaText}>{item.distance}</Text>
                    </View>
                  </View>
                </Pressable>
              ))
            )}
          </ScrollView>

          <View style={styles.footer}>
            <View>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>{formatCurrency(subtotal)}</Text>
            </View>
            <Pressable style={styles.ctaButton}>
              <Text style={styles.ctaText}>Go to cart</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(17,24,39,0.28)',
    justifyContent: 'flex-end',
  },
  dismissArea: {
    flex: 1,
  },
  sheet: {
    maxHeight: '78%',
    backgroundColor: palette.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: Platform.OS === 'ios' ? spacing.md : spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: palette.line,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  title: {
    color: palette.text,
    fontSize: 24,
    fontWeight: '700',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  content: {
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  emptyState: {
    backgroundColor: palette.mist,
    borderRadius: 22,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyTitle: {
    color: palette.text,
    fontSize: 17,
    fontWeight: '600',
  },
  emptyText: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  itemCard: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: 20,
    backgroundColor: palette.mist,
  },
  imageWrap: {
    width: 92,
    height: 92,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#E9EEF0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageFallback: {
    flex: 1,
    backgroundColor: '#E9EEF0',
  },
  itemBody: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 6,
  },
  itemTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  itemTitle: {
    flex: 1,
    color: palette.text,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 19,
  },
  itemPrice: {
    color: palette.text,
    fontSize: 15,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  metaText: {
    color: palette.muted,
    fontSize: 12,
    lineHeight: 17,
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: palette.white,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: {
    color: palette.text,
    fontSize: 11,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: palette.line,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  totalLabel: {
    color: palette.muted,
    fontSize: 12,
    marginBottom: 2,
  },
  totalValue: {
    color: palette.text,
    fontSize: 20,
    fontWeight: '700',
  },
  ctaButton: {
    minWidth: 132,
    backgroundColor: palette.forest,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
  },
  ctaText: {
    color: palette.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
