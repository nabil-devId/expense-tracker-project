import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {colors, spacing} from '@/theme';
import {Text} from '../Text';

export interface DividerProps {
  /**
   * Text to display in the middle of the divider
   */
  text?: string;
  /**
   * Color of the divider line
   */
  color?: string;
  /**
   * Horizontal margin around the divider
   */
  margin?: number;
  /**
   * Custom styles for the divider container
   */
  style?: ViewStyle;
}

/**
 * Divider component for visually separating content
 *
 * Usage:
 * ```jsx
 * <Divider />
 * <Divider text="OR" />
 * <Divider color={colors.primary.light} margin={16} />
 * ```
 */
export const Divider: React.FC<DividerProps> = ({
  text,
  color = colors.neutral.border,
  margin = spacing['4'],
  style,
}) => {
  if (text) {
    return (
      <View style={[styles.container, {marginVertical: margin}, style]}>
        <View style={[styles.line, {backgroundColor: color}]} />
        <Text
          variant="caption"
          color={colors.neutral.textLight}
          style={styles.text}>
          {text}
        </Text>
        <View style={[styles.line, {backgroundColor: color}]} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.simpleDivider,
        {
          backgroundColor: color,
          marginVertical: margin,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  line: {
    flex: 1,
    height: 1,
  },
  text: {
    paddingHorizontal: spacing['4'],
  },
  simpleDivider: {
    width: '100%',
    height: 1,
  },
});
