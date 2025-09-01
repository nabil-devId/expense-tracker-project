import React, {useState, useEffect, useCallback} from 'react';
import MonthSwitcher from '../../components/molecules/MonthSwitcher';
import {View, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {expenseService} from '../../api';
import {
  fetchExpensesStart,
  fetchExpensesSuccess,
  fetchExpensesFailure,
  setPage,
  updateFilters,
  ExpenseState, // Import ExpenseState for typing defaultFilters
} from '../../store/slices/expenseSlice';
import {ROUTES} from '../../constants';
import {RootState} from '../../store';
import {ExpenseList} from '../../components/organisms/ExpenseList';
import {ScreenLayout} from '../../components/templates/ScreenLayout';
// Use the Expense type from ExpenseList which now includes CategoryForList
import type {Expense as ComponentExpense} from '../../components/organisms/ExpenseList';
// We'll also need the original Expense type from the slice for the raw API data
import type {Expense as StoreExpense} from '../../store/slices/expenseSlice';

const ExpensesListScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  const {expenses, pagination, filters, isLoading} = useSelector(
    (state: RootState) =>
      state.expenses as {expenses: StoreExpense[]} & Omit<
        RootState['expenses'],
        'expenses'
      >, // Cast to use StoreExpense for raw data
  );

  /**
   * Local month state for the switcher. We keep this separate from redux filters
   * to avoid unnecessary renders of the whole screen when user taps quickly.
   */
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  // Initialize localFilters with the filters from Redux state
  const [localFilters, setLocalFilters] =
    useState<ExpenseState['filters']>(filters);

  // Update localFilters when global filters change (e.g., from another screen or initial load)
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  /**
   * Sync selectedMonth -> redux filters (fromDate / toDate) whenever month changes.
   * We intentionally isolate the computation here to keep logic clear.
   */
  useEffect(() => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth(); // 0-indexed
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    // Format as YYYY-MM-DD to match backend expectation
    const fmt = (d: Date) => d.toISOString().split('T')[0];
    dispatch(
      updateFilters({
        fromDate: fmt(firstDay),
        toDate: fmt(lastDay),
      }),
    );
  }, [dispatch, selectedMonth]);

  const fetchExpensesCallback = useCallback(() => {
    const fetchApi = async () => {
      try {
        dispatch(fetchExpensesStart());
        const response = await expenseService.getExpenses({
          page: pagination.page,
          limit: pagination.limit,
          from_date: filters.fromDate ?? undefined, // Use global filters for API call, convert null to undefined
          to_date: filters.toDate ?? undefined,
          // category: filters.category ?? undefined,
          merchant: filters.merchant ?? undefined,
          min_amount: filters.minAmount ?? undefined,
          max_amount: filters.maxAmount ?? undefined,
          sort_by: filters.sortBy,
          sort_order: filters.sortOrder,
        });
        dispatch(
          fetchExpensesSuccess({
            expenses: response.expenses,
            pagination: response.pagination,
            summary: response.summary,
          }),
        );
      } catch (error) {
        console.error('Error fetching expenses:', error);
        dispatch(
          fetchExpensesFailure('Failed to load expenses. Please try again.'),
        );
      }
    };
    fetchApi();
  }, [dispatch, pagination.page, filters]); // filters is a dependency now for API call

  useEffect(() => {
    fetchExpensesCallback();
  }, [fetchExpensesCallback]); // This useEffect triggers when fetchExpensesCallback changes

  const mappedExpenses: ComponentExpense[] = expenses.map(
    (exp: StoreExpense) => ({
      id: exp.expense_id,
      amount: Math.round(parseFloat(exp.total_amount) * 100), // Convert string amount to number in cents
      description: exp.merchant_name, // This will be used as subtitle (merchant)
      date: exp.transaction_date,
      category: {
        name: exp.category?.name || 'Uncategorized', // Use category name from API response
        icon: exp.category?.icon || 'help-circle-outline', // Use category icon from API, or a default
      },
      notes: exp.notes || undefined,
    }),
  );

  const handleItemPress = (item: ComponentExpense) => {
    navigation.navigate(ROUTES.EXPENSES.DETAIL, {id: item.id});
  };

  const handlePrevMonth = () => {
    setSelectedMonth(
      prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setSelectedMonth(prev => {
      const next = new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
      const today = new Date();
      // Optional: prevent navigating to future months beyond current month
      if (
        next.getFullYear() > today.getFullYear() ||
        (next.getFullYear() === today.getFullYear() &&
          next.getMonth() > today.getMonth())
      ) {
        return prev;
      }
      return next;
    });
  };

  const handleRefresh = () => {
    if (pagination.page !== 1) {
      dispatch(setPage(1)); // This will trigger fetchExpensesCallback via useEffect dependencies
    } else {
      fetchExpensesCallback();
    }
  };

  const handleLoadMore = () => {
    if (!isLoading && pagination.page < pagination.total_pages) {
      dispatch(setPage(pagination.page + 1)); // This will trigger fetchExpensesCallback
    }
  };

  return (
    <View className="flex-1 bg-[#f0f4f6]">
      <MonthSwitcher
        date={selectedMonth}
        onPrev={handlePrevMonth}
        onNext={handleNextMonth}
      />
      <ScreenLayout scrollable={false} style={{marginTop: -20}}>
        <View className="flex-1 bg-white">
          <ExpenseList
            expenses={mappedExpenses}
            onExpensePress={handleItemPress}
            isLoading={isLoading && pagination.page === 1}
            onRefresh={handleRefresh}
            refreshing={isLoading && pagination.page === 1}
            onLoadMore={handleLoadMore}
          />
          <TouchableOpacity
            className="absolute bottom-6 right-6 bg-primary w-14 h-14 rounded-full justify-center items-center shadow-lg"
            onPress={() => navigation.navigate(ROUTES.EXPENSES.CREATE)}>
            <Icon name="plus" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </ScreenLayout>
    </View>
  );
};

export default ExpensesListScreen;
