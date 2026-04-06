import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TopBar } from '../components/TopBar';
import { palette, spacing } from '../theme';
import { MessagePreview, ThreadMessage } from '../types';

type ThreadScreenProps = {
  thread: MessagePreview;
  messages: ThreadMessage[];
  onBack: () => void;
};

export function ThreadScreen({ thread, messages, onBack }: ThreadScreenProps) {
  return (
    <View style={styles.screen}>
      <TopBar title={thread.name} subtitle={thread.listingTitle} onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {messages.map((message) => (
          <View key={message.id} style={[styles.messageBubble, message.outgoing ? styles.myBubble : styles.theirBubble]}>
            <Text style={message.outgoing ? styles.myText : styles.theirText}>{message.message}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.composer}>
        <Pressable style={styles.addButton}>
          <Ionicons name="add" size={20} color={palette.text} />
        </Pressable>
        <View style={styles.inputMock}>
          <Text style={styles.inputText}>Write a message...</Text>
        </View>
        <Pressable style={styles.sendButton}>
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
  content: {
    padding: spacing.lg,
    paddingBottom: 110,
    gap: spacing.md,
  },
  messageBubble: {
    maxWidth: '82%',
    borderRadius: 22,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  theirBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
  },
  myBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#E8F7F4',
  },
  theirText: {
    color: palette.text,
    fontSize: 15,
    lineHeight: 22,
  },
  myText: {
    color: palette.text,
    fontSize: 15,
    lineHeight: 22,
  },
  composer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: palette.line,
    backgroundColor: palette.white,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: 26,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  addButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputMock: {
    flex: 1,
    borderRadius: 22,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: palette.line,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  inputText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: palette.forest,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
