import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {THEME} from '../../../constants';
import {BudgetWithSpending} from '../../../store/slices/budgetSlice';
import dayjs from 'dayjs';

interface BudgetCardProps {
  budget: BudgetWithSpending;
  onPress: (budgetId: string) => void;
}

/**
 * BudgetCard component displays a single budget item with progress information
 * Used in the BudgetsListScreen to show budget cards in a list
 */
const BudgetCard: React.FC<BudgetCardProps> = ({budget, onPress}) => {
  // Calculate the percentage used as a number for progress bar
  const percentageUsed = parseFloat(budget.percentage_used);

  // Determine the status color based on percentage used
  const getStatusColor = (percentage: number) => {
    if (percentage >= 100) return THEME.COLORS.NEGATIVE;
    if (percentage >= 75) return THEME.COLORS.ACCENT_ORANGE;
    return THEME.COLORS.POSITIVE;
  };

  const statusColor = getStatusColor(percentageUsed);

  const formatDate = (year: number, month: number): string => {
    const dateObj = new Date(year, month);
    return dateObj.toLocaleDateString('id-ID', {
      month: 'short',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  return (
    <TouchableOpacity
      className="bg-light-surface p-4 rounded-lg mb-3 mx-4 shadow-sm"
      onPress={() => onPress(budget.budget_id)}
      style={styles.container}>
      <View className="mb-2">
        {/* Budget header with category name and period */}
        <View className="flex-row justify-between items-center">
          <View className="flex-col">
            <Text className="font-bold text-lg text-light-textPrimary">
              {budget.budget_name}
            </Text>
            <Text className="text-sm">{budget.category?.name}</Text>
          </View>
          <Text className="text-light-textSecondary">
            {formatDate(budget.year, budget.month)}
          </Text>
        </View>

        {/* Date range */}
        <View className="flex-row justify-between items-center mt-1">
          <Text className="text-light-textSecondary">
            {formatDate(budget.year, budget.month)}
          </Text>
          <Text className="font-bold">
            {formatCurrency(parseFloat(budget.current_spending))} /{' '}
            {formatCurrency(parseFloat(budget.amount))}
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View className="h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
        <View
          className="h-full"
          style={{
            width: `${Math.min(percentageUsed, 100)}%`,
            backgroundColor: statusColor,
          }}
        />
      </View>

      {/* Budget status */}
      <View className="flex-row justify-between items-center mt-2">
        <Text className="text-light-textSecondary">
          {budget.remaining?.startsWith('-') ? 'Over by ' : 'Remaining: '}
          {formatCurrency(Math.abs(Number(budget.remaining)))}
        </Text>
        <Text style={{color: statusColor}}>
          {percentageUsed >= 100
            ? 'Over Budget'
            : percentageUsed >= 75
            ? 'Warning'
            : 'On Track'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    elevation: 2,
  },
});

export default BudgetCard;
