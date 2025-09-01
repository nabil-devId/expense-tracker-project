import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, spacing, borderRadius, shadows} from '@/theme';
import {Text} from '../../atoms/Text';
import {Icon} from '../../atoms/Icon';

export interface TabItem {
  /**
   * Unique key for the tab
   */
  key: string;
  /**
   * Label to display below the icon
   */
  label: string;
  /**
   * Icon name to display
   */
  iconName: string;
  /**
   * Icon set to use (optional)
   */
  iconSet?: 'material' | 'ionicons' | 'feather' | 'fontAwesome';
  /**
   * Badge count to show (optional)
   */
  badgeCount?: number;
}

export interface TabBarProps {
  /**
   * Array of tab items to display
   */
  tabs: TabItem[];
  /**
   * Currently active tab key
   */
  activeTabKey: string;
  /**
   * Function to call when a tab is pressed
   */
  onTabPress: (tabKey: string) => void;
  /**
   * Whether to show labels below icons
   */
  showLabels?: boolean;
  /**
   * Custom background color
   */
  backgroundColor?: string;
  /**
   * Whether to use compact styling
   */
  compact?: boolean;
}

/**
 * TabBar component for bottom navigation
 *
 * Usage:
 * ```jsx
 * const tabs = [
 *   { key: 'home', label: 'Home', iconName: 'home' },
 *   { key: 'expenses', label: 'Expenses', iconName: 'receipt', badgeCount: 3 },
 *   { key: 'add', label: 'Add', iconName: 'add-circle' },
 *   { key: 'budgets', label: 'Budgets', iconName: 'pie-chart', iconSet: 'feather' },
 *   { key: 'profile', label: 'Profile', iconName: 'person' },
 * ];
 *
 * <TabBar
 *   tabs={tabs}
 *   activeTabKey="home"
 *   onTabPress={handleTabPress}
 * />
 * ```
 */
export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTabKey,
  onTabPress,
  showLabels = true,
  backgroundColor = colors.neutral.white,
  compact = false,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          paddingBottom: insets.bottom || spacing['2'],
          height: compact
            ? 56 + (insets.bottom || spacing['2'])
            : 64 + (insets.bottom || spacing['2']),
        },
        styles.elevation,
      ]}>
      {tabs.map(tab => {
        const isActive = tab.key === activeTabKey;
        const shouldHighlight = tab.key === 'add'; // Special style for add button

        return (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              isActive && styles.activeTab,
              shouldHighlight && styles.highlightTab,
            ]}
            onPress={() => onTabPress(tab.key)}
            activeOpacity={0.7}>
            <View style={styles.tabContent}>
              <View
                style={[
                  styles.iconContainer,
                  shouldHighlight && styles.highlightIconContainer,
                  isActive && !shouldHighlight && styles.activeIconContainer,
                ]}>
                <Icon
                  name={tab.iconName}
                  set={tab.iconSet || 'material'}
                  size={shouldHighlight ? 28 : 24}
                  color={
                    shouldHighlight
                      ? colors.neutral.white
                      : isActive
                      ? colors.primary.main
                      : colors.neutral.textLight
                  }
                />

                {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
                  <View style={styles.badge}>
                    <Text
                      variant="caption"
                      color={colors.neutral.white}
                      bold
                      center>
                      {tab.badgeCount > 99 ? '99+' : tab.badgeCount}
                    </Text>
                  </View>
                )}
              </View>

              {showLabels && (
                <Text
                  variant="caption"
                  color={
                    isActive ? colors.primary.main : colors.neutral.textLight
                  }
                  center
                  style={styles.label}>
                  {tab.label}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.neutral.border,
  },
  elevation: {
    ...shadows.md,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    // Custom styling for active tab
  },
  highlightTab: {
    // Custom styling for highlighted tab (e.g., add button)
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 40,
    height: 40,
  },
  activeIconContainer: {
    // Styling for active tab icon container
  },
  highlightIconContainer: {
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.full,
    padding: spacing['1'],
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.error.main,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  label: {
    marginTop: 2,
    fontSize: 11,
  },
});
