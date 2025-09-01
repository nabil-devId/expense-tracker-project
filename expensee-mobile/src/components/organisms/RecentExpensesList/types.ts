// No longer importing Category model

export interface ExpenseItemData {
  id: string;
  description: string;
  amount: number;
  categoryName?: string | null; // Changed from category
  categoryColor?: string | null; // Added for icon color
  date: string;
  currencySymbol?: string;
}

export interface RecentExpensesListProps {
  expenses: ExpenseItemData[];
  onViewAllPress?: () => void;
  onExpensePress?: (expenseId: string) => void;
  listTitle?: string;
  maxItems?: number; // Max items to show before "View All"
}

export interface ExpenseListItemProps {
  item: ExpenseItemData;
  onPress?: (id: string) => void;
}
