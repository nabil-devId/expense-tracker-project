import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'; // Added RefreshControl
import {useSelector, useDispatch} from 'react-redux';
import {
  useNavigation,
  useFocusEffect,
  NavigationProp,
} from '@react-navigation/native'; // For typed navigation, use NavigationProp

import {RootState} from '../../store';
import {ROUTES, THEME} from '../../constants';
import {budgetService, expenseService} from '../../api';
import {fetchBudgetsSuccess} from '../../store/slices/budgetSlice';

// Import new components
import {ScreenLayout} from '../../components/templates/ScreenLayout';
import {HomeHeader} from '../../components/organisms/HomeHeader';
import {BudgetSummaryCard} from '../../components/organisms/BudgetSummaryCard';
import {
  RecentExpensesList,
  ExpenseItemData,
} from '../../components/organisms/RecentExpensesList'; // Import ExpenseItemData
// import type { MainStackParamList } from '../../navigation/MainNavigator'; // Assuming you have this for type safety - Removed

type HomeScreenNavigationProp = NavigationProp<any>; // Use a general type for now

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useDispatch();
  const {user} = useSelector((state: RootState) => state.auth);
  const {overallBudget} = useSelector((state: RootState) => state.budgets);

  const [recentExpenses, setRecentExpenses] = useState<ExpenseItemData[]>([]);
  // Removed expenseSummary as it's not directly used by new components
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    // useCallback to memoize
    try {
      // Only set loading true if not already refreshing, to avoid UI flicker on pull-to-refresh
      if (!refreshing) {
        setLoading(true);
      }

      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();
      const fetchBudgetsData = await budgetService.getBudgets(
        currentMonth,
        currentYear,
      );
      // Add this log to inspect the data from the API:
      console.log(
        'API response (fetchBudgetsData):',
        JSON.stringify(fetchBudgetsData, null, 2),
      );
      dispatch(fetchBudgetsSuccess(fetchBudgetsData));

      const expensesResponse = await expenseService.getExpenses();

      console.log(
        'API response (expensesResponse):',
        JSON.stringify(expensesResponse, null, 2),
      );

      // Map API response to ExpenseItemData[]
      const mappedExpenses: ExpenseItemData[] = expensesResponse.expenses.map(
        (exp: any) => ({
          id: exp.expense_id,
          description: exp.merchant_name || 'N/A', // Use merchant_name as description
          amount: parseFloat(exp.total_amount) || 0,
          categoryName: exp.category
            ? exp.category.name
            : exp.user_category.name,
          date: exp.transaction_date,
          currencySymbol: exp.currency_symbol || 'Rp', // Assuming API might provide this
        }),
      );
      setRecentExpenses(mappedExpenses);
    } catch (error) {
      console.error('Error fetching home data:', error);
      // Optionally, set an error state here to display to the user
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [dispatch, refreshing]); // Add refreshing to dependencies

  // useFocusEffect to refetch data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    // fetchData will be called due to refreshing state change in its dependency array if using useEffect for it
    // Or call directly if preferred and manage refreshing state carefully
    fetchData();
  };

  const handleViewAllExpenses = () => {
    navigation.navigate(ROUTES.MAIN.EXPENSES, {screen: ROUTES.EXPENSES.LIST});
  };

  const handleExpensePress = (expenseId: string) => {
    navigation.navigate(ROUTES.MAIN.EXPENSES, {
      screen: ROUTES.EXPENSES.DETAIL,
      params: {id: expenseId},
    });
  };

  const handleSetBudget = () => {
    navigation.navigate('Budgets', {screen: 'BudgetsList'}); // Or CreateBudget
  };

  // Initial loading state before any data is fetched or when navigating back
  if (loading && !refreshing && recentExpenses.length === 0 && !overallBudget) {
    return (
      <ScreenLayout>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={THEME.COLORS.PRIMARY} />
          <Text className="mt-3 text-gray-500">Loading your dashboard...</Text>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout
      scrollable={true}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[THEME.COLORS.PRIMARY]}
          tintColor={THEME.COLORS.PRIMARY}
        />
      }>
      <HomeHeader userName={user?.full_name} />

      {overallBudget ? (
        <BudgetSummaryCard
          totalBudget={parseFloat(overallBudget.amount) || 0}
          spentAmount={parseFloat(overallBudget.current_spending) || 0}
        />
      ) : (
        <View className="bg-white p-5 rounded-xl shadow-md my-4 mx-4 items-center">
          <Text className="text-lg font-semibold text-gray-700 mb-2">
            No Active Budget
          </Text>
          <Text className="text-gray-500 mb-4 text-center">
            Set up a budget to track your spending and stay on top of your
            finances.
          </Text>
          <TouchableOpacity
            className="bg-primary px-6 py-3 rounded-lg"
            onPress={handleSetBudget}>
            <Text className="text-white font-semibold">Set Up Budget</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color={THEME.COLORS.PRIMARY} />
      ) : (
        <RecentExpensesList
          expenses={recentExpenses}
          onViewAllPress={handleViewAllExpenses}
          onExpensePress={handleExpensePress}
        />
      )}
      <View className="h-4" />
    </ScreenLayout>
  );
};

export default HomeScreen;
