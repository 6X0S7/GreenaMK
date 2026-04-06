import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';
import { palette, spacing } from '../theme';
import { TabKey } from '../types';

const tabs: Array<{ key: TabKey; icon: keyof typeof Ionicons.glyphMap; activeIcon: keyof typeof Ionicons.glyphMap }> = [
  { key: 'home', icon: 'home-outline', activeIcon: 'home' },
  { key: 'browse', icon: 'search-outline', activeIcon: 'search' },
  { key: 'saved', icon: 'bookmark-outline', activeIcon: 'bookmark' },
  { key: 'inbox', icon: 'chatbubble-ellipses-outline', activeIcon: 'chatbubble-ellipses' },
  { key: 'profile', icon: 'person-outline', activeIcon: 'person' },
];

type BottomTabsProps = {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
};

export function BottomTabs({ activeTab, onChange }: BottomTabsProps) {
  return (
    <View style={styles.wrap}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <Pressable key={tab.key} onPress={() => onChange(tab.key)} style={[styles.tab, isActive && styles.activeTab]}>
            <Ionicons
              name={isActive ? tab.activeIcon : tab.icon}
              size={22}
              color={isActive ? palette.navActive : palette.navIcon}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: palette.nav,
    borderTopWidth: 1,
    borderTopColor: palette.line,
    paddingHorizontal: spacing.sm,
    paddingTop: 10,
    paddingBottom: 22,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
  },
  activeTab: {
    backgroundColor: '#F3F4F6',
  },
});
