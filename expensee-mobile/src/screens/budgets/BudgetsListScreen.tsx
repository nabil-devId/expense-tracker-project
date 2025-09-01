import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {budgetService} from '../../api';
import {
  fetchBudgetsStart,
  fetchBudgetsSuccess,
  fetchBudgetsFailure,
  setPeriodFilter,
  setDateFilter,
  BudgetWithSpending,
} from '../../store/slices/budgetSlice';
import {THEME, ROUTES} from '../../constants';
import {RootState} from '../../store';
import BudgetCard from '../../components/molecules/BudgetCard';
import MonthSwitcher from '@/components/molecules/MonthSwitcher';

/**
 * BudgetsListScreen displays a list of the user's budgets with their progress
 * Allows filtering by period (monthly, quarterly, yearly) and refreshing
 */
const BudgetsListScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  const {budgets, overallBudget, isLoading, activePeriod, activeDate, error} =
    useSelector((state: RootState) => state.budgets);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  // Fetch budgets when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchBudgets();
    }, [activePeriod, activeDate, selectedMonth]),
  );

  const fetchBudgets = async () => {
    try {
      dispatch(fetchBudgetsStart());
      const currentMonth = selectedMonth.getMonth() + 1;
      const currentYear = selectedMonth.getFullYear();
      const response = await budgetService.getBudgets(
        currentMonth,
        currentYear,
      );

      dispatch(
        fetchBudgetsSuccess({
          budgets: response.budgets,
          overall_budget: response.overall_budget,
        }),
      );
      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      dispatch(
        fetchBudgetsFailure('Failed to load budgets. Please try again.'),
      );
      setRefreshing(false);
    }
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
    setRefreshing(true);
    fetchBudgets();
  };

  const handleBudgetPress = (budgetId: string) => {
    navigation.navigate(ROUTES.BUDGETS.EDIT, {id: budgetId});
  };

  const getBudgetStatusColor = (percentageUsed: number | string) => {
    const percentage =
      typeof percentageUsed === 'string'
        ? parseFloat(percentageUsed)
        : percentageUsed;

    if (percentage >= 100) return THEME.COLORS.NEGATIVE;
    if (percentage >= 75) return THEME.COLORS.ACCENT_ORANGE;
    return THEME.COLORS.POSITIVE;
  };

  const renderBudgetItem = ({item}: {item: BudgetWithSpending}) => {
    return <BudgetCard budget={item} onPress={handleBudgetPress} />;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  const renderOverallBudget = () => {
    if (!overallBudget?.amount) return null;

    const percentageUsed = parseFloat(overallBudget.percentage_used);
    const statusColor = getBudgetStatusColor(percentageUsed);

    return (
      <View className="bg-light-surface p-4 rounded-lg mb-4 shadow-sm mx-4">
        <Text className="font-bold text-xl text-light-textPrimary mb-2">
          Overall Budget
        </Text>

        <View className="flex-row justify-between items-center mb-2">
          <Text className="font-bold">
            {formatCurrency(parseFloat(overallBudget.current_spending))} /{' '}
            {formatCurrency(parseFloat(overallBudget.amount))}
          </Text>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => {
    return (
      <View className="flex-1 justify-center items-center p-8">
        <Text className="text-light-textSecondary text-lg text-center mt-4 mb-6">
          You don't have any budgets set up yet. Create your first budget to
          start tracking your spending!
        </Text>
        <TouchableOpacity
          className="bg-primary px-6 py-3 rounded-lg"
          onPress={() => navigation.navigate(ROUTES.BUDGETS.CREATE)}>
          <Text className="text-white font-bold">Create Budget</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-light-background pt-4">
      {/* {renderPeriodSelector()} */}
      <MonthSwitcher
        date={selectedMonth}
        onPrev={handlePrevMonth}
        onNext={handleNextMonth}
      />
      {isLoading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={THEME.COLORS.PRIMARY} />
        </View>
      ) : (
        <FlatList
          data={budgets}
          renderItem={renderBudgetItem}
          keyExtractor={item => item.budget_id}
          ListHeaderComponent={renderOverallBudget()}
          ListEmptyComponent={renderEmptyState()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[THEME.COLORS.PRIMARY]}
            />
          }
          contentContainerStyle={{paddingBottom: 20}}
        />
      )}

      {error && (
        <View className="bg-red-100 p-3 mx-4 mb-4 rounded-lg">
          <Text className="text-red-700">{error}</Text>
        </View>
      )}

      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-primary w-14 h-14 rounded-full justify-center items-center shadow-md"
        onPress={() => navigation.navigate(ROUTES.BUDGETS.CREATE)}>
        <Text className="text-white text-3xl font-light">+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BudgetsListScreen;
