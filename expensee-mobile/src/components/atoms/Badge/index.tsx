import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {colors, borderRadius, spacing} from '@/theme';
import {Text} from '../Text';

export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

export interface BadgeProps {
  /**
   * Text content of the badge
   */
  text?: string;
  /**
   * Whether to only show a dot indicator without text
   */
  dot?: boolean;
  /**
   * Color variant of the badge
   */
  variant?: BadgeVariant;
  /**
   * Custom styles for the badge container
   */
  style?: ViewStyle;
  /**
   * Whether the badge corners should be fully rounded (pill shape)
   */
  pill?: boolean;
  /**
   * Whether the badge should have a border only (outlined style)
   */
  outlined?: boolean;
}

/**
 * Badge component for displaying status indicators, counts, or short labels
 *
 * Usage:
 * ```jsx
 * <Badge text="New" />
 * <Badge text="5" variant="error" />
 * <Badge dot variant="success" />
 * <Badge text="Premium" outlined variant="primary" />
 * ```
 */
export const Badge: React.FC<BadgeProps> = ({
  text,
  dot = false,
  variant = 'primary',
  style,
  pill = false,
  outlined = false,
}) => {
  // Get background color based on variant
  const getBackgroundColor = () => {
    if (outlined) return 'transparent';

    switch (variant) {
      case 'primary':
        return colors.primary.main;
      case 'secondary':
        return colors.secondary.main;
      case 'success':
        return colors.success.main;
      case 'warning':
        return colors.warning.main;
      case 'error':
        return colors.error.main;
      case 'info':
        return colors.info.main;
      default:
        return colors.primary.main;
    }
  };

  // Get text/border color based on variant
  const getColor = () => {
    if (outlined) {
      switch (variant) {
        case 'primary':
          return colors.primary.main;
        case 'secondary':
          return colors.secondary.main;
        case 'success':
          return colors.success.main;
        case 'warning':
          return colors.warning.main;
        case 'error':
          return colors.error.main;
        case 'info':
          return colors.info.main;
        default:
          return colors.primary.main;
      }
    }

    return colors.neutral.white;
  };

  // If it's a dot badge (no text)
  if (dot) {
    return (
      <View
        style={[
          styles.dot,
          {
            backgroundColor: getBackgroundColor(),
            borderColor: getColor(),
            borderWidth: outlined ? 1 : 0,
          },
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: getBackgroundColor(),
          borderRadius: pill ? borderRadius.full : borderRadius.sm,
          borderColor: getColor(),
          borderWidth: outlined ? 1 : 0,
        },
        style,
      ]}>
      <Text variant="caption" color={getColor()} bold>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingVertical: spacing['1'],
    paddingHorizontal: spacing['2'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
  },
});
