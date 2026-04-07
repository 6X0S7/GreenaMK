import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { palette, spacing } from '../theme';

type ContactProfileScreenProps = {
  name: string;
  initials: string;
  subtitle?: string;
  onBack: () => void;
  onViewProfile?: () => void;
};

export function ContactProfileScreen({ name, initials, subtitle, onBack, onViewProfile }: ContactProfileScreenProps) {
  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <Pressable onPress={onBack} style={styles.iconButton}>
          <Ionicons name="chevron-back" size={22} color={palette.text} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{name}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact details</Text>
          <Text style={styles.cardText}>Profile interactions, trust signals, and seller history will live here.</Text>
        </View>

        {onViewProfile ? (
          <Pressable style={styles.profileButton} onPress={onViewProfile}>
            <Text style={styles.profileButtonText}>View their profile</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.white,
  },
  topBar: {
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === 'ios' ? spacing.xxl + 2 : spacing.md,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    gap: spacing.md,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#E8F7F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: palette.forest,
    fontSize: 28,
    fontWeight: '700',
  },
  name: {
    color: palette.text,
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: palette.muted,
    fontSize: 14,
    textAlign: 'center',
  },
  card: {
    alignSelf: 'stretch',
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 20,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  cardTitle: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '700',
  },
  cardText: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  profileButton: {
    alignSelf: 'stretch',
    backgroundColor: palette.forest,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  profileButtonText: {
    color: palette.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
