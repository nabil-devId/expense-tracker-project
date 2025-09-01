import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {THEME} from '../../../constants';

export type BudgetPeriod = 'weekly' | 'monthly';

interface PeriodSelectorProps {
  selectedPeriod: BudgetPeriod;
  onSelectPeriod: (period: BudgetPeriod) => void;
  title?: string;
}

/**
 * PeriodSelector component allows users to select a time period for their budget
 * Currently supports weekly and monthly options as per MVP requirements
 */
const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  selectedPeriod,
  onSelectPeriod,
  title = 'Budget Period',
}) => {
  return (
    <View className="mb-4">
      <Text className="text-lg font-bold mb-2 text-light-textPrimary">
        {title}
      </Text>
      <View className="flex-row bg-light-surface rounded-lg overflow-hidden">
        <TouchableOpacity
          className={`flex-1 py-3 px-4 ${
            selectedPeriod === 'weekly' ? 'bg-primary' : ''
          }`}
          onPress={() => onSelectPeriod('weekly')}>
          <Text
            className={`text-center ${
              selectedPeriod === 'weekly'
                ? 'text-white font-bold'
                : 'text-light-textSecondary'
            }`}>
            Weekly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 px-4 ${
            selectedPeriod === 'monthly' ? 'bg-primary' : ''
          }`}
          onPress={() => onSelectPeriod('monthly')}>
          <Text
            className={`text-center ${
              selectedPeriod === 'monthly'
                ? 'text-white font-bold'
                : 'text-light-textSecondary'
            }`}>
            Monthly
          </Text>
        </TouchableOpacity>
      </View>
      <Text className="text-xs text-light-textSecondary mt-1 ml-1">
        {selectedPeriod === 'weekly'
          ? 'Budget resets every week'
          : 'Budget resets on the 1st of each month'}
      </Text>
    </View>
  );
};

export default PeriodSelector;
