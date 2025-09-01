import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import type {ExpenseListItemProps} from './types';
import {THEME} from '../../../constants';

// A simple icon placeholder - replace with actual icons
const CategoryIcon = ({color}: {color?: string}) => (
  <View
    style={{
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: color || THEME.COLORS.LIGHT_TEXT_SECONDARY,
      marginRight: 12,
    }}
  /> // Changed to LIGHT_TEXT_SECONDARY
);

/**
 * ExpenseListItem
 *
 * Renders a single item in the expenses list.
 * Uses NativeWind for styling.
 */
const ExpenseListItem: React.FC<ExpenseListItemProps> = ({item, onPress}) => {
  // Destructure categoryName and categoryColor
  const {id, description, amount, categoryName, categoryColor, date} = item;

  const handlePress = () => {
    if (onPress) {
      onPress(id);
    }
  };

  const formatDate = (isoDate: string) => {
    // Basic date formatting, consider using a library for more complex needs
    try {
      return new Date(isoDate).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return isoDate; // Fallback if date is not valid
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
    });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="flex-row items-center bg-white p-4 mb-3 rounded-lg shadow mx-4" // Added mx-4 for horizontal margin
      activeOpacity={0.7}>
      <View className="flex-1">
        <Text className="text-base font-medium text-gray-800" numberOfLines={1}>
          {description}
        </Text>
        <Text className="text-sm text-gray-500">
          {categoryName || 'Uncategorized'}
        </Text>
      </View>
      <View className="items-end">
        <Text className="text-base font-semibold text-red-600">
          {formatCurrency(amount)}
        </Text>
        <Text className="text-xs text-gray-400">{formatDate(date)}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ExpenseListItem;
