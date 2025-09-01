import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from 'react-native';
import {colors, borderRadius, shadows, spacing} from '@/theme';

export interface CardProps {
  /**
   * Content of the card
   */
  children: React.ReactNode;
  /**
   * Function to call when card is pressed
   */
  onPress?: () => void;
  /**
   * Custom styles for the card container
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Level of elevation/shadow (1-3)
   */
  elevation?: 1 | 2 | 3;
  /**
   * Whether the card has a border
   */
  bordered?: boolean;
  /**
   * Whether to add default padding inside the card
   */
  padded?: boolean;
  /**
   * Align content in the center of the card
   */
  centered?: boolean;
}

/**
 * Card component for containing related content
 *
 * Usage:
 * ```jsx
 * <Card>
 *   <Text>Simple card content</Text>
 * </Card>
 *
 * <Card elevation={2} onPress={handlePress}>
 *   <Text>Touchable card with shadow</Text>
 * </Card>
 * ```
 */
export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  style,
  elevation = 1,
  bordered = false,
  padded = true,
  centered = false,
}) => {
  // Get shadow based on elevation
  const getShadow = () => {
    switch (elevation) {
      case 1:
        return shadows.sm;
      case 2:
        return shadows.md;
      case 3:
        return shadows.lg;
      default:
        return shadows.sm;
    }
  };

  const cardStyles = [
    styles.card,
    getShadow(),
    padded && styles.padded,
    bordered && styles.bordered,
    centered && styles.centered,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyles}
        onPress={onPress}
        activeOpacity={0.8}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyles}>{children}</View>;
};

// Additional components for card structure
export const CardHeader: React.FC<{
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}> = ({children, style}) => (
  <View style={[styles.cardHeader, style]}>{children}</View>
);

export const CardContent: React.FC<{
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}> = ({children, style}) => (
  <View style={[styles.cardContent, style]}>{children}</View>
);

export const CardFooter: React.FC<{
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}> = ({children, style}) => (
  <View style={[styles.cardFooter, style]}>{children}</View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.neutral.white,
    overflow: 'hidden',
    marginVertical: spacing['2'],
  },
  bordered: {
    borderWidth: 1,
    borderColor: colors.neutral.border,
  },
  padded: {
    padding: spacing['4'],
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
    paddingBottom: spacing['3'],
    marginBottom: spacing['3'],
  },
  cardContent: {
    flex: 1,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.neutral.border,
    paddingTop: spacing['3'],
    marginTop: spacing['3'],
  },
});
