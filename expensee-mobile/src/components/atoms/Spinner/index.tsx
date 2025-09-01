import React from 'react';
import {ActivityIndicator, StyleSheet, View, ViewStyle} from 'react-native';
import {colors} from '@/theme';
import {Text} from '../Text';

export type SpinnerSize = 'small' | 'large';

export interface SpinnerProps {
  /**
   * Size of the spinner
   */
  size?: SpinnerSize;
  /**
   * Color of the spinner
   */
  color?: string;
  /**
   * Text to display below the spinner
   */
  text?: string;
  /**
   * Whether to show a centered overlay that blocks the UI
   */
  overlay?: boolean;
  /**
   * Custom container style
   */
  style?: ViewStyle;
}

/**
 * Spinner component for indicating loading states
 *
 * Usage:
 * ```jsx
 * <Spinner />
 * <Spinner size="large" color={colors.primary.main} text="Loading..." />
 * <Spinner overlay />
 * ```
 */
export const Spinner: React.FC<SpinnerProps> = ({
  size = 'small',
  color = colors.primary.main,
  text,
  overlay = false,
  style,
}) => {
  const content = (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
      {text && (
        <Text
          variant="caption"
          style={styles.text}
          color={colors.neutral.textLight}>
          {text}
        </Text>
      )}
    </View>
  );

  if (overlay) {
    return (
      <View style={styles.overlayContainer}>
        <View style={styles.overlay}>{content}</View>
      </View>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: 8,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 999,
  },
  overlay: {
    backgroundColor: colors.neutral.white,
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
