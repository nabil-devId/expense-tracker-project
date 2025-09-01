import React from 'react';
import {View, StyleSheet} from 'react-native';
import {colors, spacing, borderRadius} from '@/theme';
import {Text} from '../../atoms/Text';
import {Card, CardHeader, CardContent} from '../../molecules/Card';

export interface BudgetProgressCardProps {
  /**
   * Title of the budget
   */
  title: string;
  /**
   * Category ID of the budget
   */
  categoryId: string;
  /**
   * Total budget amount in cents
   */
  budgetAmount: number;
  /**
   * Current spent amount in cents
   */
  spentAmount: number;
  /**
   * Currency symbol to display
   */
  currencySymbol?: string;
  /**
   * Function to call when card is pressed
   */
  onPress?: () => void;
}

/**
 * BudgetProgressCard component for displaying budget progress
 *
 * Usage:
 * ```jsx
 * <BudgetProgressCard
 *   title="Groceries Budget"
 *   categoryId="groceries"
 *   budgetAmount={30000} // $300.00
 *   spentAmount={18500} // $185.00
 *   onPress={handlePress}
 * />
 * ```
 */
export const BudgetProgressCard: React.FC<BudgetProgressCardProps> = ({
  title,
  categoryId,
  budgetAmount,
  spentAmount,
  currencySymbol = 'Rp',
  onPress,
}) => {
  // Format amount from cents to display format
  const formatAmount = (amount: number): string => {
    return `${currencySymbol}${(amount / 100).toFixed(2)}`;
  };

  // Calculate percentage of budget used
  const percentage =
    budgetAmount > 0
      ? Math.min(Math.round((spentAmount / budgetAmount) * 100), 100)
      : 0;

  // Determine color based on percentage
  const getProgressColor = () => {
    if (percentage >= 90) return colors.error.main;
    if (percentage >= 75) return colors.warning.main;
    return colors.success.main;
  };

  return (
    <Card elevation={1} onPress={onPress}>
      <CardHeader>
        <View style={styles.header}>
          <View style={styles.category}>
            <Text variant="h4">{title}</Text>
          </View>
          <Text variant="body" bold color={getProgressColor()}>
            {percentage}%
          </Text>
        </View>
      </CardHeader>

      <CardContent>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${percentage}%`,
                  backgroundColor: getProgressColor(),
                },
              ]}
            />
          </View>
        </View>

        {/* Budget Info */}
        <View style={styles.budgetInfo}>
          <View>
            <Text variant="caption" color={colors.neutral.textLight}>
              Spent
            </Text>
            <Text variant="body" semibold>
              {formatAmount(spentAmount)}
            </Text>
          </View>

          <Text variant="body">of</Text>

          <View style={styles.alignRight}>
            <Text variant="caption" color={colors.neutral.textLight}>
              Budget
            </Text>
            <Text variant="body" semibold>
              {formatAmount(budgetAmount)}
            </Text>
          </View>
        </View>

        {/* Remaining */}
        <View style={styles.remaining}>
          <Text variant="bodySmall">
            {spentAmount <= budgetAmount ? 'Remaining' : 'Over budget'}:{' '}
            <Text
              variant="bodySmall"
              bold
              color={
                spentAmount <= budgetAmount
                  ? colors.success.main
                  : colors.error.main
              }>
              {formatAmount(Math.abs(budgetAmount - spentAmount))}
            </Text>
          </Text>
        </View>
      </CardContent>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  category: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: colors.neutral.backgroundAlt,
    borderRadius: borderRadius.full,
    padding: spacing['2'],
    marginRight: spacing['2'],
  },
  progressContainer: {
    marginVertical: spacing['3'],
  },
  progressBackground: {
    height: 10,
    backgroundColor: colors.neutral.backgroundAlt,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  budgetInfo: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: spacing['2'],
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  remaining: {
    marginTop: spacing['4'],
  },
});
