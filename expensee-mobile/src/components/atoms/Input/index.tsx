import React, {useState} from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {colors, borderRadius, spacing, typography} from '@/theme';
import {Text} from '../Text';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  fullWidth?: boolean;
}

/**
 * Input component for text entry
 *
 * Usage:
 * ```jsx
 * <Input
 *   label="Email"
 *   placeholder="Enter your email"
 *   error={errors.email}
 *   leftIcon={<MailIcon />}
 * />
 * ```
 */
export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  style,
  fullWidth = true,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  // Determine border color based on state
  const getBorderColor = () => {
    if (error) return colors.error.main;
    if (isFocused) return colors.primary.main;
    return colors.neutral.border;
  };

  return (
    <View
      style={[styles.container, fullWidth && styles.fullWidth, containerStyle]}>
      {label && (
        <Text variant="label" style={styles.label}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: getBorderColor(),
          },
          isFocused && styles.focused,
        ]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            {
              color: colors.neutral.textDark,
            },
            style,
          ]}
          placeholderTextColor={colors.neutral.textLight}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity
            disabled={!onRightIconPress}
            style={styles.rightIcon}
            onPress={onRightIconPress}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {(error || hint) && (
        <Text
          variant="caption"
          color={error ? colors.error.main : colors.neutral.textLight}
          style={styles.helperText}>
          {error || hint}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing['4'],
  },
  fullWidth: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing['4'],
    backgroundColor: colors.neutral.white,
    height: 48, // Fixed height for consistency
  },
  input: {
    flex: 1,
    height: '100%',
    paddingVertical: spacing['3'],
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.base,
  },
  focused: {
    borderWidth: 2,
  },
  label: {
    marginBottom: spacing['2'],
  },
  helperText: {
    marginTop: spacing['1'],
  },
  leftIcon: {
    marginRight: spacing['2'],
  },
  rightIcon: {
    marginLeft: spacing['2'],
  },
});
