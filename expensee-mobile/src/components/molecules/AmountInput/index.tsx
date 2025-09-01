import React, {useState, useEffect} from 'react';
import {View, StyleSheet, TextInputProps} from 'react-native';
import {Input} from '../../atoms/Input';
import {Text} from '../../atoms/Text';
import {colors, spacing} from '@/theme';

export interface AmountInputProps
  extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  /**
   * Current value in smallest currency unit (e.g., cents)
   */
  value: number;
  /**
   * Function called when the value changes
   */
  onValueChange: (valueInCents: number) => void;
  /**
   * Currency symbol to display
   */
  currencySymbol?: string;
  /**
   * Label to display above the input
   */
  label?: string;
  /**
   * Error message to display
   */
  error?: string;
  /**
   * Hint text to display
   */
  hint?: string;
  /**
   * Whether the input is disabled
   */
  disabled?: boolean;
}

/**
 * AmountInput component for handling currency input with proper formatting
 *
 * Usage:
 * ```jsx
 * const [amount, setAmount] = useState(2500); // $25.00
 *
 * <AmountInput
 *   label="Amount"
 *   value={amount}
 *   onValueChange={setAmount}
 *   currencySymbol="Rp"
 * />
 * ```
 */
export const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onValueChange,
  currencySymbol = 'Rp',
  label,
  error,
  hint,
  disabled = false,
  ...props
}) => {
  // Convert cents to dollars for display
  const formatForDisplay = (valueInCents: number): string => {
    if (valueInCents === 0) return '';
    return (valueInCents / 100).toFixed(2);
  };

  // Convert dollars input to cents
  const toCents = (valueString: string): number => {
    const cleanValue = valueString.replace(/[^0-9.]/g, '');
    const floatValue = parseFloat(cleanValue);
    if (isNaN(floatValue)) return 0;
    return Math.round(floatValue * 100);
  };

  const [displayValue, setDisplayValue] = useState<string>(
    formatForDisplay(value),
  );

  // Update internal state when value prop changes
  useEffect(() => {
    const formattedValue = formatForDisplay(value);
    if (formattedValue !== displayValue) {
      setDisplayValue(formattedValue);
    }
  }, [value]);

  const handleChangeText = (text: string) => {
    setDisplayValue(text);
    const centsValue = toCents(text);
    onValueChange(centsValue);
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text variant="label" style={styles.label}>
          {label}
        </Text>
      )}
      <View style={styles.inputContainer}>
        <Text
          variant="body"
          style={styles.currencySymbol}
          color={colors.neutral.textDark}>
          {currencySymbol}
        </Text>
        <Input
          value={displayValue}
          onChangeText={handleChangeText}
          keyboardType="decimal-pad"
          placeholder="0.00"
          error={error}
          hint={hint}
          style={styles.input}
          containerStyle={styles.inputWrapper}
          editable={!disabled}
          {...props}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing['4'],
  },
  label: {
    marginBottom: spacing['2'],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    marginRight: spacing['1'],
    fontSize: 18,
    fontWeight: '600',
  },
  inputWrapper: {
    flex: 1,
    marginBottom: 0,
  },
  input: {
    textAlign: 'left',
  },
});
