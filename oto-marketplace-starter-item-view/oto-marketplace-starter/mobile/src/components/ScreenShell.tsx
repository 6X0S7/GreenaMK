import { ReactNode } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { palette, spacing } from '../theme';

type ScreenShellProps = {
  title?: string;
  subtitle?: string;
  hideHeader?: boolean;
  hideEyebrow?: boolean;
  headerOffset?: number;
  contentTopPadding?: number;
  children: ReactNode;
};

export function ScreenShell({ title, subtitle, hideHeader, hideEyebrow, headerOffset = 0, contentTopPadding, children }: ScreenShellProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[styles.content, contentTopPadding !== undefined ? { paddingTop: contentTopPadding } : null]}
        showsVerticalScrollIndicator={false}
      >
        {!hideHeader ? (
          <View style={[styles.header, { marginTop: headerOffset }]}>
            {!hideEyebrow ? <Text style={styles.eyebrow}>Greena prototype</Text> : null}
            {title ? <Text style={styles.title}>{title}</Text> : null}
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
        ) : null}
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.white,
  },
  content: {
    padding: spacing.lg,
    paddingTop: Platform.OS === 'ios' ? spacing.xxl : spacing.lg,
    paddingBottom: 110,
    gap: spacing.lg,
  },
  header: {
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  eyebrow: {
    color: palette.moss,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    color: palette.text,
    fontSize: 32,
    fontWeight: '800',
  },
  subtitle: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 340,
  },
});
