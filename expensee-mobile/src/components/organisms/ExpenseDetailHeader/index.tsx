import React from 'react';
import {View, StyleSheet, TextStyle} from 'react-native';
import {Text} from '../../atoms/Text';
import {colors, spacing, typography} from '../../../theme';

interface ExpenseDetailHeaderProps {
  merchantName: string;
  totalAmount: string; // Expecting amount in cents as string
  transactionDate: string; // Expecting ISO date string
}

export const ExpenseDetailHeader: React.FC<ExpenseDetailHeaderProps> = ({
  merchantName,
  totalAmount,
  transactionDate,
}) => {
  const formattedAmount = parseFloat(totalAmount).toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
  });
  const formattedDate = new Date(transactionDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View style={styles.headerContainer}>
      <Text variant="h1" style={styles.merchantName} accessibilityRole="header">
        {merchantName}
      </Text>
      <Text variant="h1" style={styles.totalAmount}>
        {formattedAmount}
      </Text>
      <Text variant="caption" style={styles.transactionDate}>
        {formattedDate}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.primary.main,
    paddingVertical: spacing['4'], // Adjusted padding
    paddingHorizontal: spacing['6'],
    alignItems: 'center',
  },
  merchantName: {
    color: colors.primary.contrast,
    marginBottom: spacing['1'],
    fontSize: typography.fontSize['2xl'], // Using h1 variant's default size might be too big, so explicitly setting
    fontWeight: typography.fontWeight.bold as TextStyle['fontWeight'], // Explicitly making it bold like an h1
    textAlign: 'center',
  },
  totalAmount: {
    color: colors.primary.contrast,
    fontSize: typography.fontSize['3xl'], // Making amount prominent
    fontWeight: typography.fontWeight.bold as TextStyle['fontWeight'],
    marginVertical: spacing['1'],
    textAlign: 'center',
  },
  transactionDate: {
    color: colors.primary.contrast,
    opacity: 0.8,
    marginTop: spacing['1'],
    textAlign: 'center',
  },
});

export default ExpenseDetailHeader;
