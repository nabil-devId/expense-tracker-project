import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Input, InputProps} from '../../atoms/Input';
import {Text} from '../../atoms/Text';
import {colors, spacing} from '@/theme';

export interface FormFieldProps extends InputProps {
  /**
   * Field label that appears above the input
   */
  label?: string;
  /**
   * Error message to display under the input
   */
  error?: string;
  /**
   * Helper text to display under the input when there's no error
   */
  helperText?: string;
  /**
   * Whether the field is required
   */
  required?: boolean;
  /**
   * Whether to display asterisk for required fields
   */
  showRequiredIndicator?: boolean;
}

/**
 * FormField component that combines label, input and error message
 *
 * Usage:
 * ```jsx
 * <FormField
 *   label="Email Address"
 *   placeholder="Enter your email"
 *   keyboardType="email-address"
 *   error={errors.email}
 *   required
 * />
 * ```
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  helperText,
  required = false,
  showRequiredIndicator = true,
  ...inputProps
}) => {
  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <Text variant="label">{label}</Text>
          {required && showRequiredIndicator && (
            <Text
              variant="label"
              color={colors.error.main}
              style={styles.requiredIndicator}>
              *
            </Text>
          )}
        </View>
      )}
      <Input
        error={error}
        hint={!error ? helperText : undefined}
        {...inputProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing['4'],
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: spacing['2'],
  },
  requiredIndicator: {
    marginLeft: spacing['1'],
  },
});
