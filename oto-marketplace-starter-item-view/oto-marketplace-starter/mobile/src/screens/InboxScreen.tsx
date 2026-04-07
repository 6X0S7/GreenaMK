import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenShell } from '../components/ScreenShell';
import { palette, spacing } from '../theme';
import { MessagePreview } from '../types';
import { useMemo, useState } from 'react';

type InboxScreenProps = {
  threads: MessagePreview[];
  loading?: boolean;
  error?: string | null;
  onOpenThread: (threadId: string) => void;
};

export function InboxScreen({ threads, loading, error, onOpenThread }: InboxScreenProps) {
  const [mode, setMode] = useState<'buying' | 'selling'>('buying');
  const filteredThreads = useMemo(() => threads.filter((thread) => (thread.mode || 'buying') === mode), [threads, mode]);

  return (
    <ScreenShell hideHeader contentTopPadding={Platform.OS === 'ios' ? 0 : spacing.lg}>
      <View style={styles.header}>
        <Text style={styles.title}>Inbox</Text>
        <View style={styles.toggle}>
          <Pressable onPress={() => setMode('buying')} style={[styles.toggleButton, mode === 'buying' && styles.toggleActive]}>
            <Text style={[styles.toggleText, mode === 'buying' && styles.toggleTextActive]}>Buying</Text>
          </Pressable>
          <Pressable onPress={() => setMode('selling')} style={[styles.toggleButton, mode === 'selling' && styles.toggleActive]}>
            <Text style={[styles.toggleText, mode === 'selling' && styles.toggleTextActive]}>Selling</Text>
          </Pressable>
        </View>
      </View>

      {loading ? <Text style={styles.infoText}>Loading website messages...</Text> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {!loading && !error && filteredThreads.length === 0 ? <Text style={styles.infoText}>No conversations in this tab yet.</Text> : null}

      {filteredThreads.map((thread) => (
        <Pressable key={thread.id} style={({ pressed }) => [styles.thread, pressed && styles.threadPressed]} onPress={() => onOpenThread(thread.id)}>
          <View style={styles.imageWrap}>
            {thread.imageUrl ? (
              <Image source={{ uri: thread.imageUrl }} style={styles.image} resizeMode="cover" />
            ) : (
              <View style={styles.imageFallback} />
            )}
          </View>
          <View style={styles.threadBody}>
            <View style={styles.threadTop}>
              <Text style={styles.name} numberOfLines={1}>
                {thread.name}
              </Text>
              <Text style={styles.time}>{thread.time}</Text>
            </View>
            <Text style={styles.listing} numberOfLines={1}>
              {thread.listingTitle}
            </Text>
            <Text style={[styles.preview, thread.unread && styles.previewUnread]} numberOfLines={1}>
              {thread.preview}
            </Text>
          </View>
        </Pressable>
      ))}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.md,
    paddingTop: spacing.xs,
  },
  title: {
    color: palette.text,
    fontSize: 24,
    fontWeight: '700',
  },
  toggle: {
    flexDirection: 'row',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    borderRadius: 999,
    padding: 4,
  },
  toggleButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  toggleActive: {
    backgroundColor: palette.white,
  },
  toggleText: {
    color: palette.muted,
    fontSize: 13,
    fontWeight: '500',
  },
  toggleTextActive: {
    color: palette.text,
    fontWeight: '700',
  },
  thread: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: palette.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.line,
    paddingHorizontal: spacing.sm,
    paddingVertical: 10,
  },
  threadPressed: {
    opacity: 0.92,
  },
  imageWrap: {
    width: 54,
    height: 54,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: palette.mist,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageFallback: {
    flex: 1,
    backgroundColor: palette.mist,
  },
  threadBody: {
    flex: 1,
    gap: 2,
    justifyContent: 'center',
  },
  threadTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  name: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: '400',
    flex: 1,
  },
  time: {
    color: palette.muted,
    fontSize: 11,
    fontWeight: '500',
  },
  listing: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '600',
  },
  preview: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  previewUnread: {
    color: palette.text,
    fontWeight: '500',
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
});
