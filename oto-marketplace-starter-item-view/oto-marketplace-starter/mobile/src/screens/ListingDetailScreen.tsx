import Ionicons from '@expo/vector-icons/Ionicons';
import { Alert, Image, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { palette, spacing } from '../theme';
import { Listing } from '../types';
import { useState } from 'react';

type ListingDetailScreenProps = {
  listing: Listing;
  onBack: () => void;
  onOpenProfile?: () => void;
  onOpenMessageThread?: () => void;
  onSendCollectRequest?: (message: string) => Promise<void>;
};

export function ListingDetailScreen({ listing, onBack, onOpenProfile, onOpenMessageThread, onSendCollectRequest }: ListingDetailScreenProps) {
  const availability = listing.condition.toLowerCase().includes('pending') ? 'Pending' : 'Available';
  const rating = typeof listing.rating === 'number' ? listing.rating.toFixed(1) : '4.2';
  const isFreeListing = listing.category === 'Free Stuff' || listing.price.toLowerCase().includes('free');
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [draftMessage, setDraftMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [composerMode, setComposerMode] = useState<'collect'>('collect');

  async function handleSendMessage() {
    const nextMessage = draftMessage.trim();
    const handler = onSendCollectRequest;
    if (!nextMessage || !handler) {
      return;
    }

    try {
      setSending(true);
      await handler(nextMessage);
      setDraftMessage('');
      setIsComposerOpen(false);
      Alert.alert('Collection request sent', 'Your collection request was sent to the seller.');
    } catch (error) {
      Alert.alert('Message failed', error instanceof Error ? error.message : 'Could not create the chat.');
    } finally {
      setSending(false);
    }
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.gallery}>
          {listing.image ? <Image source={{ uri: listing.image }} style={styles.galleryImage} resizeMode="cover" /> : null}

          <View style={styles.galleryTopRow}>
            <Pressable style={styles.floatingButton} onPress={onBack}>
              <Ionicons name="chevron-back" size={22} color={palette.text} />
            </Pressable>
            <Pressable style={styles.floatingButton}>
              <Ionicons name="share-outline" size={20} color={palette.text} />
            </Pressable>
          </View>

          <View style={styles.galleryFooter}>
            <View style={styles.galleryDots}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.titleRow}>
            <View style={styles.titleWrap}>
              <Text style={styles.title}>{listing.title}</Text>
              <Text style={styles.price}>{listing.price.replace('Â£', '£')}</Text>
            </View>
            <Pressable style={styles.saveButton}>
              <Ionicons name="heart-outline" size={20} color={palette.text} />
            </Pressable>
          </View>

          <Text style={styles.meta}>
            {availability} · {listing.location} · {listing.distance}
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

        <Pressable style={styles.sellerSection} onPress={onOpenProfile}>
          <View style={styles.sellerRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{listing.seller.slice(0, 1)}</Text>
            </View>
            <View style={styles.sellerCopy}>
              <Text style={styles.sellerName}>{listing.seller}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color={palette.gold} />
                <Text style={styles.ratingText}>{rating}/5</Text>
              </View>
            </View>
          </View>
        </Pressable>

        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionText}>
            {listing.description || 'Seller notes will appear here once more detailed listing content is available.'}
          </Text>
          <Text style={styles.detailLine}>Condition: {listing.condition}</Text>
          <Text style={styles.detailLine}>Status: {availability}</Text>
          <Text style={styles.detailLine}>Category: {listing.category}</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomActions}>
        {!isFreeListing ? (
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryText}>Make offer</Text>
          </Pressable>
        ) : (
          <Pressable
            style={styles.secondaryButton}
            onPress={() => {
              setComposerMode('collect');
              setDraftMessage(`Hi, I'd love to collect this if it's still available. I can pick it up at a time that suits you.`);
              setIsComposerOpen(true);
            }}
          >
            <Text style={styles.secondaryText}>Collect</Text>
          </Pressable>
        )}
        <Pressable
          style={styles.primaryButton}
          onPress={onOpenMessageThread}
        >
          <Text style={styles.primaryText}>Message seller</Text>
        </Pressable>
      </View>

      <Modal visible={isComposerOpen} transparent animationType="slide" onRequestClose={() => setIsComposerOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Request collection</Text>
              <Pressable onPress={() => setIsComposerOpen(false)} style={styles.modalCloseButton}>
                <Ionicons name="close" size={18} color={palette.text} />
              </Pressable>
            </View>
            <Text style={styles.modalSubtitle} numberOfLines={2}>
              {`Send a quick collection request for ${listing.title}`}
            </Text>
            <TextInput
              value={draftMessage}
              onChangeText={setDraftMessage}
              placeholder="Add a short note for the seller"
              placeholderTextColor="#9CA3AF"
              style={styles.messageInput}
              multiline
              textAlignVertical="top"
            />
            <View style={styles.modalActions}>
              <Pressable style={styles.cancelButton} onPress={() => setIsComposerOpen(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.sendMessageButton, sending && styles.sendMessageButtonDisabled]} onPress={handleSendMessage} disabled={sending}>
                <Text style={styles.sendMessageButtonText}>{sending ? 'Sending...' : 'Send request'}</Text>
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
  content: {
    paddingTop: 0,
    paddingBottom: 130,
    gap: spacing.md,
  },
  gallery: {
    height: 380,
    backgroundColor: palette.mist,
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  galleryImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  galleryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === 'ios' ? spacing.xxl + 6 : spacing.lg,
  },
  floatingButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  galleryDots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  dotActive: {
    width: 18,
    backgroundColor: palette.white,
  },
  summaryCard: {
    paddingHorizontal: spacing.lg,
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
  title: {
    color: palette.text,
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
  },
  price: {
    color: palette.text,
    fontSize: 20,
    fontWeight: '400',
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
    fontSize: 14,
    lineHeight: 20,
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
  sellerSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
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
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  descriptionSection: {
    paddingHorizontal: spacing.lg,
    gap: 8,
  },
  descriptionText: {
    color: palette.text,
    fontSize: 15,
    lineHeight: 23,
  },
  detailLine: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 20,
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
    paddingBottom: Platform.OS === 'ios' ? spacing.xl + 6 : 26,
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(17,24,39,0.28)',
    justifyContent: 'flex-end',
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: palette.white,
    borderRadius: 24,
    padding: spacing.lg,
    gap: spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    color: palette.text,
    fontSize: 20,
    fontWeight: '700',
  },
  modalCloseButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSubtitle: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  messageInput: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: palette.text,
    fontSize: 15,
    lineHeight: 22,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  cancelButtonText: {
    color: palette.text,
    fontSize: 13,
    fontWeight: '600',
  },
  sendMessageButton: {
    flex: 1.2,
    borderRadius: 16,
    backgroundColor: palette.forest,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  sendMessageButtonDisabled: {
    opacity: 0.6,
  },
  sendMessageButtonText: {
    color: palette.white,
    fontSize: 13,
    fontWeight: '700',
  },
});
