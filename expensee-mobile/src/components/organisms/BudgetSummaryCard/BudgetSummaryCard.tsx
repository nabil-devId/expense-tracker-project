import React from 'react';
import {View, Text} from 'react-native';
import type {BudgetSummaryCardProps} from './types';
import * as Progress from 'react-native-progress'; // Using react-native-progress for the bar
import {THEME} from '../../../constants'; // For theme colors

/**
 * BudgetSummaryCard
 *
 * Displays a summary of the user's budget, including total, spent, remaining,
 * and a progress bar. Uses NativeWind for styling.
 */
const BudgetSummaryCard: React.FC<BudgetSummaryCardProps> = ({
  totalBudget,
  spentAmount,
}) => {
  const remainingAmount = totalBudget - spentAmount;
  const progress = totalBudget > 0 ? spentAmount / totalBudget : 0;

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('id-ID', {style: 'currency', currency: 'IDR'});
  };

  return (
    <View className="bg-white p-5 rounded-xl shadow-md my-4 mx-4">
      <Text className="text-lg font-semibold text-gray-700 mb-1">
        This Month's Budget
      </Text>
      <View className="flex-row justify-between mb-3">
        <View>
          <Text className="text-sm text-gray-500">Spent</Text>
          <Text className="text-xl font-bold text-red-500">
            {formatCurrency(spentAmount)}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-sm text-gray-500">Remaining</Text>
          <Text className="text-xl font-bold text-green-500">
            {formatCurrency(remainingAmount)}
          </Text>
        </View>
      </View>
      <Progress.Bar
        progress={progress}
        width={null} // null makes it take full width of parent
        height={10}
        color={THEME.COLORS.PRIMARY} // Use primary color from theme
        unfilledColor={THEME.COLORS.GRAY_LIGHT} // Use a light gray for unfilled part
        borderColor="transparent"
        borderRadius={5}
      />
      <View className="flex-row justify-between mt-1">
        <Text className="text-xs text-gray-400">0%</Text>
        <Text className="text-xs text-gray-500">
          Total: {formatCurrency(totalBudget)}
        </Text>
        <Text className="text-xs text-gray-400">100%</Text>
      </View>
    </View>
  );
};

export default BudgetSummaryCard;
