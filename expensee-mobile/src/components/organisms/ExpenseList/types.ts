import type { ExpenseData } from '../../../store/slices/expenseSlice'; // Assuming ExpenseData from Redux is suitable

export interface ExpenseListProps {
  expenses: ExpenseData[];
  onItemPress: (id: string) => void;
  onRefresh?: () => void;
  onLoadMore?: () => void;
  isLoading?: boolean;
  isRefreshing?: boolean;
  ListHeaderComponent?: React.ReactElement | null;
  emptyMessage?: string;
}
