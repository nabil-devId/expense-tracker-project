import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

/**
 * MonthSwitcher
 *
 * A lightweight UI component that shows the currently selected month
 * with chevron buttons to navigate back and forward.
 *
 * Why we need this component:
 *  - Keeps ExpensesListScreen lean by extracting presentation logic.
 *  - Can be reused elsewhere (analytics, budgets, etc.) if needed.
 *
 * Props:
 *  - date: Date object representing the selected month (only year & month are used)
 *  - onPrev: callback executed when user taps previous month button
 *  - onNext: callback executed when user taps next month button
 */
export interface MonthSwitcherProps {
  date: Date;
  onPrev: () => void;
  onNext: () => void;
}

const MonthSwitcher: React.FC<MonthSwitcherProps> = ({
  date,
  onPrev,
  onNext,
}) => {
  const label = date.toLocaleDateString('default', {
    month: 'short', // Changed to 'short' for 'Aug' instead of 'August'
    year: 'numeric',
  });

  return (
    <View className="flex-row items-center justify-between bg-white rounded-lg shadow-md p-2 mx-4 my-2">
      <TouchableOpacity
        onPress={onPrev}
        className="bg-white rounded-md shadow p-2 w-10 h-10 items-center justify-center">
        <Icon name="chevron-left" size={24} color="#333" />
      </TouchableOpacity>

      <Text className="text-base font-medium text-gray-800 mx-2">{label}</Text>

      <TouchableOpacity
        onPress={onNext}
        className="bg-white rounded-md shadow p-2 w-10 h-10 items-center justify-center">
        <Icon name="chevron-right" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

export default MonthSwitcher;
