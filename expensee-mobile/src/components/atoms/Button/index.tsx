import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import {colors, borderRadius, spacing, shadows} from '@/theme';
import {Text} from '../Text';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  rounded?: boolean;
  style?: ViewStyle;
}

/**
 * Button component that follows the design system
 *
 * Usage:
 * ```jsx
 * <Button onPress={handlePress}>Default Button</Button>
 * <Button variant="secondary" size="sm">Small Secondary Button</Button>
 * <Button leftIcon={<SomeIcon />} disabled>Button with Icon</Button>
 * ```
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  loading = false,
  disabled = false,
  children,
  rounded = false,
  style,
  ...props
}) => {
  // Define variant styles
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled
            ? colors.neutral.borderDark
            : colors.primary.main,
          borderColor: 'transparent',
        };
      case 'secondary':
        return {
          backgroundColor: disabled
            ? colors.neutral.borderDark
            : colors.secondary.main,
          borderColor: 'transparent',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: disabled ? colors.neutral.border : colors.primary.main,
          borderWidth: 1,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        };
      case 'danger':
        return {
          backgroundColor: disabled
            ? colors.neutral.borderDark
            : colors.error.main,
          borderColor: 'transparent',
        };
      default:
        return {
          backgroundColor: colors.primary.main,
          borderColor: 'transparent',
        };
    }
  };

  // Define size styles
  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: spacing['2'],
          paddingHorizontal: spacing['4'],
        };
      case 'md':
        return {
          paddingVertical: spacing['3'],
          paddingHorizontal: spacing['5'],
        };
      case 'lg':
        return {
          paddingVertical: spacing['4'],
          paddingHorizontal: spacing['6'],
        };
      default:
        return {
          paddingVertical: spacing['3'],
          paddingHorizontal: spacing['5'],
        };
    }
  };

  // Define text color based on variant
  const getTextColor = () => {
    switch (variant) {
      case 'outline':
      case 'ghost':
        return disabled ? colors.neutral.textLight : colors.primary.main;
      default:
        return disabled ? colors.neutral.textLight : colors.neutral.white;
    }
  };

  // Define text size based on button size
  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 'bodySmall';
      case 'lg':
        return 'body';
      default:
        return 'bodySmall';
    }
  };

  // Calculate border radius
  const getBorderRadius = () => {
    if (rounded) return borderRadius.full;
    return borderRadius.md;
  };

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.button,
        getVariantStyle(),
        getSizeStyle(),
        fullWidth && styles.fullWidth,
        {borderRadius: getBorderRadius()},
        style,
      ]}
      {...props}>
      <View style={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={getTextColor()}
            style={styles.loader}
          />
        ) : (
          <>
            {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
            {typeof children === 'string' ? (
              <Text
                variant={getTextSize() as any}
                color={getTextColor()}
                semibold
                center>
                {children}
              </Text>
            ) : (
              children
            )}
            {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...shadows.sm,
  },
  fullWidth: {
    width: '100%',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: spacing['2'],
  },
  rightIcon: {
    marginLeft: spacing['2'],
  },
  loader: {
    marginHorizontal: spacing['1'],
  },
});
