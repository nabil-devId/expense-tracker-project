import React from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import type {RecentExpensesListProps, ExpenseItemData} from './types';
import ExpenseListItem from './ExpenseListItem';

/**
 * RecentExpensesList
 *
 * Displays a list of recent expenses with an option to view all.
 * Uses NativeWind for styling.
 */
const RecentExpensesList: React.FC<RecentExpensesListProps> = ({
  expenses,
  onViewAllPress,
  onExpensePress,
  listTitle = 'Recent Expenses',
  maxItems = 5,
}) => {
  const displayedExpenses = expenses.slice(0, maxItems);

  const renderItem = ({item}: {item: ExpenseItemData}) => (
    <ExpenseListItem item={item} onPress={onExpensePress} />
  );

  const ListHeader = () => (
    <View className="flex-row justify-between items-center mb-3 mt-5 px-4">
      <Text className="text-xl font-semibold text-gray-800">{listTitle}</Text>
      {expenses.length > maxItems && onViewAllPress && (
        <TouchableOpacity onPress={onViewAllPress} activeOpacity={0.7}>
          <Text className="text-primary font-medium">View All</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (expenses.length === 0) {
    return (
      <View className="px-4 py-8 items-center">
        <ListHeader />
        <Text className="text-gray-500 mt-4">No recent expenses to show.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={displayedExpenses}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      ListHeaderComponent={<ListHeader />}
      // Remove scroll if it's part of a larger scrollable view (e.g. ScreenLayout)
      // For standalone lists, you might want to enable it.
      scrollEnabled={false}
      contentContainerClassName="pb-4"
      // contentContainerClassName="pb-4" // NativeWind class for content container style
    />
  );
};

export default RecentExpensesList;
