import React, {useState} from 'react';
import {View, StyleSheet, Platform, TouchableOpacity} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {colors, spacing} from '@/theme';
import {Text} from '../../atoms/Text';
import {Icon} from '../../atoms/Icon';
import {Input} from '../../atoms/Input';

export interface DatePickerProps {
  /**
   * Selected date
   */
  value: Date;
  /**
   * Function called when date changes
   */
  onChange: (date: Date) => void;
  /**
   * Label to display
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
   * Format to display the date (default: MM/DD/YYYY)
   */
  format?: string;
  /**
   * Minimum selectable date
   */
  minimumDate?: Date;
  /**
   * Maximum selectable date
   */
  maximumDate?: Date;
  /**
   * Whether the input is disabled
   */
  disabled?: boolean;
}

/**
 * DatePicker component that wraps React Native's DateTimePicker
 * with a platform-specific implementation
 *
 * Usage:
 * ```jsx
 * const [date, setDate] = useState(new Date());
 *
 * <DatePicker
 *   label="Transaction Date"
 *   value={date}
 *   onChange={setDate}
 *   minimumDate={new Date(2020, 0, 1)}
 * />
 * ```
 */
export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  error,
  hint,
  format = 'MM/DD/YYYY',
  minimumDate,
  maximumDate,
  disabled = false,
}) => {
  const [show, setShow] = useState(false);

  // Format date for display
  const formatDate = (date: Date): string => {
    // Simple formatter, can be expanded with a library like date-fns
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    // Replace format tokens with actual values
    return format
      .replace('DD', day)
      .replace('MM', month)
      .replace('YYYY', year.toString());
  };

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || value;

    if (Platform.OS === 'android') {
      setShow(false);
    }

    onChange(currentDate);
  };

  const showDatepicker = () => {
    if (!disabled) {
      setShow(true);
    }
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text variant="label" style={styles.label}>
          {label}
        </Text>
      )}

      {/* Input field that shows the selected date */}
      <TouchableOpacity
        onPress={showDatepicker}
        disabled={disabled}
        style={[styles.inputTouchable, disabled && styles.disabled]}>
        <Input
          value={formatDate(value)}
          editable={false}
          pointerEvents="none"
          rightIcon={
            <Icon
              name="calendar"
              set="feather"
              color={colors.neutral.textLight}
            />
          }
          error={error}
          hint={hint}
          style={styles.input}
        />
      </TouchableOpacity>

      {/* Date Picker */}
      {/* <DatePicker value={value} onChange={function (date: Date): void {}} /> */}
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={value}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          // On iOS, the picker is shown in a modal so we don't need to handle
          // the visibility manually
          {...(Platform.OS === 'ios' && {onCancel: () => setShow(false)})}
        />
      )}
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
  inputTouchable: {
    width: '100%',
  },
  input: {
    color: colors.neutral.textDark,
  },
  disabled: {
    opacity: 0.7,
  },
});
