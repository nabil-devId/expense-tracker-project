import React from 'react';
import { FlatList, View, Text, ActivityIndicator } from 'react-native';
import ExpenseListItem from '../RecentExpensesList/ExpenseListItem'; // Path to be verified/adjusted
import type { ExpenseListProps } from './types';
import type { ExpenseData } from '../../../store/slices/expenseSlice'; // Assuming ExpenseData from Redux is suitable
import { THEME } from '../../../constants';

const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onItemPress,
  onRefresh,
  onLoadMore,
  isLoading = false,
  isRefreshing = false,
  ListHeaderComponent,
  emptyMessage = 'No expenses found.',
}) => {
  const renderItem = ({ item }: { item: ExpenseData }) => (
    // TODO: Adapt data from ExpenseData to ExpenseListItemProps['item']
    // This is a placeholder mapping and needs to be accurate based on ExpenseListItem's actual props
    // and the structure of ExpenseData from Redux.
    <ExpenseListItem
      item={{
        id: item.expense_id, // Assuming expense_id is the ID
        description: item.merchant_name || item.description || 'N/A', // Prioritize merchant_name
        amount: item.total_amount,
        categoryName: item.category || 'Uncategorized',
        categoryColor: item.category_color, // Assuming this field exists or can be derived
        date: item.transaction_date,
        // currencySymbol: item.currency_symbol, // If available
        // has_receipt_image: item.has_receipt_image // For potential icon display in ExpenseListItem
      }}
      onPress={onItemPress}
    />
  );

  if (isLoading && !isRefreshing && expenses.length === 0) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <ActivityIndicator size="large" color={THEME.COLORS.PRIMARY} />
        <Text className="mt-2 text-light-textSecondary">Loading expenses...</Text>
      </View>
    );
  }

  if (!isLoading && expenses.length === 0 && !ListHeaderComponent) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-lg text-light-textSecondary">{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={expenses}
      renderItem={renderItem}
      keyExtractor={item => item.expense_id}
      onRefresh={onRefresh}
      refreshing={isRefreshing}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={() => {
        if (isLoading && expenses.length > 0) {
          return <ActivityIndicator size="small" color={THEME.COLORS.PRIMARY} className="my-4" />;
        }
        return null;
      }}
      contentContainerStyle={expenses.length === 0 ? { flexGrow: 1, justifyContent: 'center' } : {}}
      className="flex-1"
    />
  );
};

export default ExpenseList;
