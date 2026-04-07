import Ionicons from '@expo/vector-icons/Ionicons';
import { Alert, Animated, Image, PanResponder, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useMemo, useRef, useState } from 'react';
import { palette, spacing } from '../theme';
import { MessagePreview, ThreadMessage } from '../types';

type ThreadScreenProps = {
  thread: MessagePreview;
  messages: ThreadMessage[];
  onBack: () => void;
  onOpenListing: () => void;
  onOpenContact: () => void;
  canMarkPending?: boolean;
  onMarkPending?: () => Promise<void>;
  onSendMessage?: (message: string) => Promise<void>;
};

type SwipeMessageRowProps = {
  message: string;
  outgoing?: boolean;
  timeLabel: string;
};

const MAX_SWIPE = 72;

function formatDayLabel(value: string) {
  const date = new Date(value);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function SwipeMessageRow({ message, outgoing, timeLabel }: SwipeMessageRowProps) {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 6 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
      onPanResponderMove: (_, gesture) => {
        const next = Math.max(-MAX_SWIPE, Math.min(0, gesture.dx));
        translateX.setValue(next);
      },
      onPanResponderRelease: () => {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          speed: 24,
          bounciness: 4,
        }).start();
      },
      onPanResponderTerminate: () => {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          speed: 24,
          bounciness: 4,
        }).start();
      },
    }),
  ).current;

  return (
    <View style={styles.swipeContainer}>
      <View style={styles.timestampSlot}>
        <Text style={styles.hiddenTimestamp}>{timeLabel}</Text>
      </View>

      <Animated.View
        style={[
          styles.messageRow,
          outgoing ? styles.messageRowOutgoing : styles.messageRowIncoming,
          { transform: [{ translateX }] },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={[styles.messageBubble, outgoing ? styles.myBubble : styles.theirBubble]}>
          <Text style={outgoing ? styles.myText : styles.theirText}>{message}</Text>
        </View>
      </Animated.View>
    </View>
  );
}

export function ThreadScreen({ thread, messages, onBack, onOpenListing, onOpenContact, canMarkPending, onMarkPending, onSendMessage }: ThreadScreenProps) {
  const [scrolled, setScrolled] = useState(false);
  const [draftMessage, setDraftMessage] = useState('');
  const [sending, setSending] = useState(false);

  const groupedMessages = useMemo(() => {
    return messages.map((message, index) => {
      const previous = messages[index - 1];
      const showDate =
        !previous || new Date(previous.createdAt).toDateString() !== new Date(message.createdAt).toDateString();

      return {
        ...message,
        showDate,
        timeLabel: new Date(message.createdAt).toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit' }),
      };
    });
  }, [messages]);

  async function handleSend() {
    const nextMessage = draftMessage.trim();
    if (!nextMessage || !onSendMessage) {
      return;
    }

    try {
      setSending(true);
      await onSendMessage(nextMessage);
      setDraftMessage('');
    } catch (error) {
      Alert.alert('Message failed', error instanceof Error ? error.message : 'Could not send the message.');
    } finally {
      setSending(false);
    }
  }

  async function handleMarkPending() {
    if (!onMarkPending) {
      return;
    }

    try {
      await onMarkPending();
      Alert.alert('Marked pending', 'The listing is now pending for collection.');
    } catch (error) {
      Alert.alert('Update failed', error instanceof Error ? error.message : 'Could not update the listing.');
    }
  }

  return (
    <View style={styles.screen}>
      <View style={[styles.header, scrolled && styles.headerScrolled]}>
        <View style={styles.headerRow}>
          <Pressable onPress={onBack} style={styles.iconButton}>
            <Ionicons name="chevron-back" size={22} color={palette.text} />
          </Pressable>

          <Pressable style={styles.centerHeader} onPress={onOpenListing}>
            <View style={styles.productAvatarWrap}>
              {thread.imageUrl ? <Image source={{ uri: thread.imageUrl }} style={styles.productAvatar} resizeMode="cover" /> : <View style={styles.productAvatar} />}
            </View>
            <Text style={styles.chatTitle} numberOfLines={1}>
              {thread.listingTitle}
            </Text>
          </Pressable>

          <Pressable style={styles.customerBadge} onPress={onOpenContact}>
            <Text style={styles.customerBadgeText}>{thread.initials || 'MC'}</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={(event) => setScrolled(event.nativeEvent.contentOffset.y > 8)}
        scrollEventThrottle={16}
      >
        {canMarkPending ? (
          <Pressable style={styles.pendingAction} onPress={handleMarkPending}>
            <Ionicons name="checkmark-circle-outline" size={18} color={palette.forest} />
            <Text style={styles.pendingActionText}>Agree to collection and mark pending</Text>
          </Pressable>
        ) : null}

        {groupedMessages.map((message) => (
          <View key={message.id} style={styles.messageBlock}>
            {message.showDate ? <Text style={styles.dateStamp}>{formatDayLabel(message.createdAt)}</Text> : null}
            <SwipeMessageRow message={message.message} outgoing={message.outgoing} timeLabel={message.timeLabel} />
          </View>
        ))}
      </ScrollView>

      <View style={styles.composer}>
        <Pressable style={styles.addButton}>
          <Ionicons name="add" size={20} color={palette.text} />
        </Pressable>
        <View style={styles.inputWrap}>
          <TextInput value={draftMessage} onChangeText={setDraftMessage} placeholder="Message" placeholderTextColor="#9CA3AF" style={styles.input} />
        </View>
        <Pressable style={[styles.sendButton, sending && styles.sendButtonDisabled]} onPress={handleSend} disabled={sending}>
          <Ionicons name="send" size={18} color={palette.white} />
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
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: Platform.OS === 'ios' ? spacing.xxl + 8 : spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.96)',
  },
  headerScrolled: {
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229,231,235,0.8)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerHeader: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  productAvatarWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: 'hidden',
    backgroundColor: palette.mist,
  },
  productAvatar: {
    width: '100%',
    height: '100%',
    backgroundColor: palette.mist,
  },
  chatTitle: {
    color: palette.text,
    fontSize: 13,
    fontWeight: '500',
    maxWidth: 180,
  },
  customerBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F7F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerBadgeText: {
    color: palette.forest,
    fontSize: 11,
    fontWeight: '700',
  },
  content: {
    paddingTop: Platform.OS === 'ios' ? 124 : 96,
    paddingHorizontal: spacing.md,
    paddingBottom: 110,
    gap: spacing.sm,
  },
  messageBlock: {
    gap: 6,
  },
  pendingAction: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F5FBFA',
    borderWidth: 1,
    borderColor: '#D9F1EE',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: spacing.sm,
  },
  pendingActionText: {
    color: palette.text,
    fontSize: 13,
    fontWeight: '600',
  },
  dateStamp: {
    alignSelf: 'center',
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '500',
    marginVertical: 8,
  },
  swipeContainer: {
    width: '100%',
    minHeight: 44,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  timestampSlot: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: MAX_SWIPE,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  hiddenTimestamp: {
    color: '#9CA3AF',
    fontSize: 11,
  },
  messageRow: {
    width: '100%',
  },
  messageRowIncoming: {
    alignItems: 'flex-start',
  },
  messageRowOutgoing: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '82%',
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  theirBubble: {
    backgroundColor: '#E9EAEE',
    borderBottomLeftRadius: 8,
  },
  myBubble: {
    backgroundColor: '#0A84FF',
    borderBottomRightRadius: 8,
  },
  theirText: {
    color: palette.text,
    fontSize: 15,
    lineHeight: 21,
  },
  myText: {
    color: palette.white,
    fontSize: 15,
    lineHeight: 21,
  },
  composer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: palette.line,
    backgroundColor: 'rgba(255,255,255,0.96)',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: 26,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrap: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: '#F4F5F7',
    paddingHorizontal: spacing.md,
  },
  input: {
    color: palette.text,
    fontSize: 14,
    paddingVertical: 10,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0A84FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
});
