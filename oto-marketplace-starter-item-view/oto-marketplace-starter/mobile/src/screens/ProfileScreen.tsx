import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenShell } from '../components/ScreenShell';
import { palette, spacing } from '../theme';

const stats = [
  { label: 'Seller rating', value: '4.9' },
  { label: 'Items sold', value: '18' },
  { label: 'Response time', value: '12m' },
];

export function ProfileScreen() {
  return (
    <ScreenShell title="Profile" subtitle="A mobile profile should surface trust, seller activity, and settings faster than the current web nav allows.">
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>GS</Text>
        </View>
        <View style={styles.profileBody}>
          <Text style={styles.name}>Greena Seller</Text>
          <Text style={styles.meta}>South London · Verified email · 3 years on platform</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.statCard}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Prototype note</Text>
        <Text style={styles.panelBody}>
          Once Supabase is in place, this is where account state, listings, orders, and settings can become real without rethinking the screen shape.
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.actionRow}>
          <Text style={styles.actionText}>Your listings</Text>
          <Text style={styles.actionArrow}>›</Text>
        </Pressable>
        <Pressable style={styles.actionRow}>
          <Text style={styles.actionText}>Payout settings</Text>
          <Text style={styles.actionArrow}>›</Text>
        </Pressable>
        <Pressable style={styles.actionRow}>
          <Text style={styles.actionText}>Help and support</Text>
          <Text style={styles.actionArrow}>›</Text>
        </Pressable>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: '#F4FBFA',
    borderRadius: 24,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#D9F1EE',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#D9F1EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: palette.forest,
    fontSize: 22,
    fontWeight: '800',
  },
  profileBody: {
    flex: 1,
    gap: 6,
  },
  name: {
    color: palette.text,
    fontSize: 22,
    fontWeight: '800',
  },
  meta: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: palette.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.line,
    padding: spacing.md,
    gap: 6,
  },
  statValue: {
    color: palette.text,
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    color: palette.muted,
    fontSize: 12,
    lineHeight: 18,
  },
  panel: {
    backgroundColor: palette.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: palette.line,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  panelTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '800',
  },
  panelBody: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  actions: {
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 22,
    overflow: 'hidden',
  },
  actionRow: {
    backgroundColor: palette.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: palette.line,
  },
  actionText: {
    color: palette.text,
    fontSize: 15,
    fontWeight: '600',
  },
  actionArrow: {
    color: palette.muted,
    fontSize: 22,
    lineHeight: 22,
  },
});
