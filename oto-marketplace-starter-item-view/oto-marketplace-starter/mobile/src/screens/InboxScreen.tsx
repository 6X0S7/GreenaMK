import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenShell } from '../components/ScreenShell';
import { palette, spacing } from '../theme';
import { MessagePreview } from '../types';

type InboxScreenProps = {
  threads: MessagePreview[];
  loading?: boolean;
  error?: string | null;
  onOpenThread: (threadId: string) => void;
};

export function InboxScreen({ threads, loading, error, onOpenThread }: InboxScreenProps) {
  return (
    <ScreenShell title="Inbox" subtitle="This prototype is useful for testing message density, unread states, and seller conversation previews.">
      {loading ? <Text style={styles.infoText}>Loading website messages...</Text> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {!loading && !error && threads.length === 0 ? <Text style={styles.infoText}>No live conversations found yet.</Text> : null}

      {threads.map((thread) => (
        <Pressable key={thread.id} style={({ pressed }) => [styles.thread, pressed && styles.threadPressed]} onPress={() => onOpenThread(thread.id)}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{thread.name.slice(0, 1)}</Text>
          </View>
          <View style={styles.threadBody}>
            <View style={styles.threadTop}>
              <Text style={styles.name}>{thread.name}</Text>
              <Text style={styles.time}>{thread.time}</Text>
            </View>
            <Text style={styles.listing}>{thread.listingTitle}</Text>
            <Text style={[styles.preview, thread.unread && styles.previewUnread]}>{thread.preview}</Text>
          </View>
        </Pressable>
      ))}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  thread: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: palette.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: palette.line,
    padding: spacing.md,
  },
  threadPressed: {
    opacity: 0.92,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF8F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: palette.forest,
    fontSize: 18,
    fontWeight: '800',
  },
  threadBody: {
    flex: 1,
    gap: 4,
  },
  threadTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  name: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '800',
  },
  time: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  listing: {
    color: palette.moss,
    fontSize: 13,
    fontWeight: '700',
  },
  preview: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  previewUnread: {
    color: palette.text,
    fontWeight: '600',
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
