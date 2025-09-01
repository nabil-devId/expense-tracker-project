import React from 'react';
import {View, StyleSheet, FlatList, SectionList, ViewStyle} from 'react-native';
import {colors, spacing} from '@/theme';
import {Text} from '../../atoms/Text';
import {Spinner} from '../../atoms/Spinner';
import {ListItem} from '../../molecules/ListItem';
import {Icon} from '../../atoms/Icon'; // Import Icon for category display

// Minimal category structure needed for the list item display
export interface CategoryForList {
  name: string;
  icon: string; // Assuming this will be the name of the icon (e.g., 'food', 'car')
  // color?: string; // Optional: if icons need specific background colors
}

export interface Expense {
  id: string;
  amount: number; // in cents
  description: string; // This will be the merchant name, used as subtitle
  date: Date | string;
  category: CategoryForList; // Added category details
  receiptImage?: string;
  notes?: string;
}

export interface ExpenseListProps {
  /** List of expenses to display */
  expenses: Expense[];
  /** Function to call when an expense is pressed */
  onExpensePress?: (expense: Expense) => void;
  /** Whether the list is loading */
  isLoading?: boolean;
  /** Message to display when there are no expenses */
  emptyMessage?: string;
  /** Currency symbol to display */
  currencySymbol?: string;
  /** Custom styles for the container */
  style?: ViewStyle;
  /** Whether to group expenses by date */
  groupByDate?: boolean;
  /** Function to render a custom header for each date group. Must return a React.ReactElement or null. */
  renderDateHeader?: (date: Date) => React.ReactElement | null;
  /** Function to call when list is pulled to refresh */
  onRefresh?: () => void;
  /** Whether the list is currently refreshing */
  refreshing?: boolean;
  /** Function to call when end of list is reached */
  onLoadMore?: () => void;
  /** Threshold for calling onLoadMore */
  onEndReachedThreshold?: number;
  /** Component to render at the top of the list. Must be a React.ReactElement or null. */
  ListHeaderComponent?: React.ReactElement | null;
  /** Component to render at the bottom of the list. Must be a React.ReactElement or null. */
  ListFooterComponent?: React.ReactElement | null;
}

/**
 * ExpenseList component for displaying a list of expenses
 *
 * Usage:
 * ```jsx
 * <ExpenseList
 *   expenses={expenses}
 *   onExpensePress={handleExpensePress}
 *   groupByDate
 * />
 * ```
 */
export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onExpensePress,
  isLoading = false,
  emptyMessage = 'No expenses to display',
  currencySymbol = 'Rp',
  style,
  groupByDate = false,
  renderDateHeader,
  onRefresh,
  refreshing = false,
  onLoadMore,
  onEndReachedThreshold = 0.5,
  ListHeaderComponent,
  ListFooterComponent,
}) => {
  // Format amount from cents to display format (e.g., "-Rp50.68")
  const formatAmount = (amount: number): string => {
    // Assuming expenses are positive numbers, display them with a minus sign.
    return `-${currencySymbol}${(amount / 100).toFixed(2)}`;
  };

  // Format date for display (e.g., "Aug 26")
  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      // Using en-US for "Aug" format
      month: 'short',
      day: 'numeric',
    });
  };

  // Group expenses by date if needed
  const prepareData = () => {
    if (!groupByDate) return {items: expenses, sections: null};

    const grouped = expenses.reduce((acc, expense) => {
      const date =
        typeof expense.date === 'string'
          ? new Date(expense.date)
          : expense.date;
      const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format

      if (!acc[dateString]) {
        acc[dateString] = [];
      }

      acc[dateString].push(expense);
      return acc;
    }, {} as Record<string, Expense[]>);

    const sections = Object.entries(grouped)
      .map(([date, items]) => ({
        date: new Date(date),
        data: items,
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime()); // Sort newest first

    return {items: null, sections};
  };

  const {items, sections} = prepareData();

  // Render an individual expense item
  const renderExpenseItem = (expense: Expense) => {
    return (
      <ListItem
        key={expense.id}
        categoryIconName={expense.category.icon}
        categoryName={expense.category.name}
        merchantName={expense.description}
        amountText={formatAmount(expense.amount)}
        dateText={formatDate(expense.date)}
        onPress={() => onExpensePress?.(expense)}
        divider
      />
    );
  };

  // Render loading state
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered, style]}>
        <Spinner size="large" text="Loading expenses..." />
      </View>
    );
  }

  // Render empty state
  if (!expenses.length) {
    return (
      <View style={[styles.container, styles.centered, style]}>
        <Text variant="body" color={colors.neutral.textLight}>
          {emptyMessage}
        </Text>
      </View>
    );
  }

  // Render section header for grouped list
  const renderGroupedDateHeader = ({section}: {section: {date: Date}}) => {
    if (renderDateHeader) {
      return renderDateHeader(section.date);
    }
    return (
      <View style={styles.dateHeader}>
        <Text variant="h4" style={styles.dateHeaderText}>
          {formatDate(section.date)}
        </Text>
      </View>
    );
  };

  // Render grouped list using SectionList
  if (groupByDate && sections) {
    return (
      <SectionList
        sections={sections}
        renderItem={({item}) => renderExpenseItem(item)}
        renderSectionHeader={renderGroupedDateHeader}
        keyExtractor={item => item.id}
        stickySectionHeadersEnabled={false} // Optional: make headers sticky
        style={[styles.container, style]}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        onRefresh={onRefresh}
        refreshing={refreshing}
        onEndReached={onLoadMore}
        onEndReachedThreshold={onEndReachedThreshold}
      />
    );
  }

  // Render flat list
  return (
    <FlatList
      data={items} // items will be expenses when not grouping
      renderItem={({item}) => renderExpenseItem(item)}
      keyExtractor={item => item.id}
      style={[styles.container, style]}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      onRefresh={onRefresh}
      refreshing={refreshing}
      onEndReached={onLoadMore}
      onEndReachedThreshold={onEndReachedThreshold}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    marginBottom: spacing['4'],
  },
  dateHeader: {
    paddingVertical: spacing['3'],
    paddingHorizontal: spacing['4'],
    backgroundColor: colors.neutral.backgroundAlt,
  },
  dateHeaderText: {
    color: colors.neutral.textDark,
  },
});
