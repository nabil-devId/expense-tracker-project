import React from 'react';
import {View, StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
import {colors, spacing, shadows} from '@/theme';
import {Text} from '../../atoms/Text';
import {Icon} from '../../atoms/Icon';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export interface HeaderProps {
  /**
   * Title to display in the header
   */
  title: string;
  /**
   * Subtitle to display under the title
   */
  subtitle?: string;
  /**
   * Function to call when the back button is pressed
   */
  onBackPress?: () => void;
  /**
   * Custom content to display on the right side
   */
  rightContent?: React.ReactNode;
  /**
   * Whether to show a shadow below the header
   */
  showShadow?: boolean;
  /**
   * Background color of the header
   */
  backgroundColor?: string;
  /**
   * Whether the status bar text should be light
   */
  lightStatusBar?: boolean;
}

/**
 * Header component for screen headers with navigation and actions
 *
 * Usage:
 * ```jsx
 * <Header
 *   title="Expenses"
 *   subtitle="May 2023"
 *   onBackPress={navigation.goBack}
 *   rightContent={<Icon name="plus" set="feather" />}
 * />
 * ```
 */
export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onBackPress,
  rightContent,
  showShadow = true,
  backgroundColor = colors.neutral.white,
  lightStatusBar = false,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <>
      <View
        style={[
          styles.container,
          showShadow && styles.shadow,
          {backgroundColor, paddingTop: insets.top},
        ]}>
        <View style={styles.content}>
          <View style={styles.leftSection}>
            {onBackPress && (
              <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
                <Icon
                  name="arrow-back"
                  size={24}
                  color={colors.neutral.textDark}
                />
              </TouchableOpacity>
            )}
            <View style={styles.titleContainer}>
              <Text variant="h3" numberOfLines={1}>
                {title}
              </Text>
              {subtitle && (
                <Text variant="bodySmall" color={colors.neutral.textLight}>
                  {subtitle}
                </Text>
              )}
            </View>
          </View>
          {rightContent && (
            <View style={styles.rightSection}>{rightContent}</View>
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  shadow: {
    ...shadows.md,
    elevation: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['3'],
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: spacing['2'],
    marginRight: spacing['2'],
  },
  titleContainer: {
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
