import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Switch,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {budgetService, categoryService, expenseService} from '../../api';
import {
  updateBudgetSuccess,
  deleteBudgetSuccess,
} from '../../store/slices/budgetSlice';
import {THEME, ROUTES} from '../../constants';

/**
 * EditBudgetScreen allows users to view, edit, and delete an existing budget
 * Implements the Budget Edit/Delete flow from the user journey
 */
const EditBudgetScreen = ({route, navigation}: any) => {
  const {id} = route.params;
  const dispatch = useDispatch();

  // Budget state
  const [budget, setBudget] = useState<any>(null);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [isPaused, setIsPaused] = useState(false);

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [associatedExpenses, setAssociatedExpenses] = useState([]);
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(true);

  // Fetch budget details when component mounts or comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchBudgetDetails();
    }, [id]),
  );

  const fetchBudgetDetails = async () => {
    try {
      setIsLoading(true);
      const response = await budgetService.getBudgetById(id);

      setBudget(response);
      setName(response.budget_name || '');
      setAmount(response.amount.toString());
      setIsPaused(response.is_paused || false);
    } catch (error) {
      console.error('Error fetching budget details:', error);
      Alert.alert('Error', 'Failed to load budget details. Please try again.');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setIsSaving(true);

      const updatedBudget = {
        id,
        budget_name: name,
        amount: parseFloat(amount),
        month: budget.month,
        year: budget.year,
        category_id: budget.category_id,
        user_category_id: budget.user_category_id,
      };

      const response = await budgetService.updateBudget(id, updatedBudget);
      // dispatch(updateBudgetSuccess(response));

      // Exit edit mode and refresh budget details
      setIsEditing(false);
      fetchBudgetDetails();

      Alert.alert('Success', 'Budget updated successfully!');
    } catch (error: any) {
      console.error('Error updating budget:', error);
      const errorMessage =
        error.response?.data?.detail ||
        'Failed to update budget. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Budget',
      'Are you sure you want to delete this budget? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: confirmDelete,
        },
      ],
    );
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      await budgetService.deleteBudget(id);
      dispatch(deleteBudgetSuccess(id));

      Alert.alert('Success', 'Budget deleted successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      console.error('Error deleting budget:', error);
      const errorMessage =
        error.response?.data?.detail ||
        'Failed to delete budget. Please try again.';
      Alert.alert('Error', errorMessage);
      setIsDeleting(false);
    }
  };

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a budget name.');
      return false;
    }

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount greater than zero.');
      return false;
    }

    return true;
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

  const formatCurrency = (amount: string) => {
    return parseFloat(amount).toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
    });
  };

  const renderBudgetDetails = () => {
    if (!budget) return null;

    const percentageUsed = parseFloat(budget.percentage_used || '0');
    const statusColor = getBudgetStatusColor(percentageUsed);

    return (
      <View className="mb-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-light-textPrimary">
            {budget.name || 'Budget Details'}
          </Text>
          {isPaused && (
            <View className="bg-gray-200 px-2 py-1 rounded-md">
              <Text className="text-gray-600 font-medium">Paused</Text>
            </View>
          )}
        </View>

        <View className="bg-light-surface p-4 rounded-lg mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-light-textSecondary">Category</Text>
            <Text className="font-medium text-light-textPrimary">
              {budget.category?.name || 'Overall Budget'}
            </Text>
          </View>

          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-light-textSecondary">Period</Text>
            <Text className="font-medium text-light-textPrimary">
              {budget.period?.charAt(0).toUpperCase() +
                budget.period?.slice(1) || ''}
            </Text>
          </View>

          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-light-textSecondary">Date Range</Text>
            <Text className="font-medium text-light-textPrimary">
              {budget.start_date
                ? new Date(budget.start_date).toLocaleDateString()
                : ''}
              {budget.end_date
                ? ` - ${new Date(budget.end_date).toLocaleDateString()}`
                : ''}
            </Text>
          </View>

          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-light-textSecondary">Amount</Text>
            <Text className="font-bold text-lg text-light-textPrimary">
              {formatCurrency(budget.current_spending)} /{' '}
              {formatCurrency(budget.amount)}
            </Text>
          </View>

          {/* Progress bar */}
          <View className="h-4 bg-gray-200 rounded-full mb-2">
            <View
              className="h-4 rounded-full"
              style={{
                backgroundColor: statusColor,
                width: `${Math.min(percentageUsed, 100)}%`,
              }}
            />
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-light-textSecondary">
              {budget.remaining?.startsWith('-') ? 'Over by ' : 'Remaining: '}
              {formatCurrency(budget.remaining?.replace('-', ''))}
            </Text>
            <Text className="font-medium" style={{color: statusColor}}>
              {budget.percentage_used}% used
            </Text>
          </View>
        </View>

        {/* Daily spending pace */}
        <View className="bg-light-surface p-4 rounded-lg mb-4">
          <Text className="font-bold text-lg text-light-textPrimary mb-2">
            Spending Pace
          </Text>

          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-light-textSecondary">Daily Target</Text>
            <Text className="font-medium text-light-textPrimary">
              {formatCurrency(budget.amount)}
            </Text>
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-light-textSecondary">Current Pace</Text>
            <Text
              className="font-medium"
              style={{
                color:
                  percentageUsed > 100
                    ? THEME.COLORS.NEGATIVE
                    : percentageUsed > 75
                    ? THEME.COLORS.ACCENT_ORANGE
                    : THEME.COLORS.POSITIVE,
              }}>
              {percentageUsed > 100
                ? 'Over Budget'
                : percentageUsed > 75
                ? 'Warning'
                : 'On Track'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderEditForm = () => {
    return (
      <View className="mb-6">
        <Text className="text-2xl font-bold text-light-textPrimary mb-4">
          Edit Budget
        </Text>

        {/* Budget Name */}
        <View className="mb-4">
          <Text className="text-light-textSecondary mb-2">Budget Name</Text>
          <TextInput
            className="bg-light-surface border border-gray-300 rounded-lg px-4 py-3 text-light-textPrimary"
            placeholder="e.g., Groceries, Entertainment"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Budget Amount */}
        <View className="mb-6">
          <Text className="text-light-textSecondary mb-2">Budget Amount</Text>
          <View className="flex-row items-center bg-light-surface border border-gray-300 rounded-lg px-4 py-3">
            <Text className="mr-2 text-light-textPrimary">Rp</Text>
            <TextInput
              className="flex-1 text-light-textPrimary text-lg"
              placeholder="0.00"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
        </View>

        {/* Save/Cancel Buttons */}
        <View className="flex-row">
          <TouchableOpacity
            className="flex-1 bg-gray-300 py-3 rounded-lg items-center mr-2"
            onPress={() => setIsEditing(false)}>
            <Text className="font-medium text-gray-700">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-primary py-3 rounded-lg items-center"
            onPress={handleSave}
            disabled={isSaving}>
            {isSaving ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="font-medium text-white">Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderAssociatedExpenses = () => {
    if (isLoadingExpenses) {
      return (
        <View className="items-center py-4">
          <ActivityIndicator size="small" color={THEME.COLORS.PRIMARY} />
          <Text className="text-light-textSecondary mt-2">
            Loading expenses...
          </Text>
        </View>
      );
    }

    if (associatedExpenses.length === 0) {
      return (
        <View className="bg-light-surface p-4 rounded-lg mb-4">
          <Text className="text-center text-light-textSecondary">
            No expenses associated with this budget yet.
          </Text>
        </View>
      );
    }

    return (
      <View className="mb-6">
        <Text className="text-xl font-bold text-light-textPrimary mb-3">
          Associated Expenses
        </Text>

        {associatedExpenses.map((expense: any) => (
          <TouchableOpacity
            key={expense.expense_id}
            className="bg-light-surface p-4 rounded-lg mb-2"
            onPress={() =>
              navigation.navigate(ROUTES.EXPENSES.DETAIL, {
                id: expense.expense_id,
              })
            }>
            <View className="flex-row justify-between items-center mb-1">
              <Text className="font-medium text-light-textPrimary">
                {expense.merchant_name}
              </Text>
              <Text className="font-bold text-light-textPrimary">
                {expense.total_amount}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-light-textSecondary">
                {expense.category}
              </Text>
              <Text className="text-light-textSecondary">
                {new Date(expense.transaction_date).toLocaleDateString()}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          className="mt-2 py-2 items-center"
          onPress={() =>
            navigation.navigate(ROUTES.EXPENSES.LIST, {
              filter: {category: budget?.category?.name},
            })
          }>
          <Text className="text-primary">View All Related Expenses</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-light-background">
        <ActivityIndicator size="large" color={THEME.COLORS.PRIMARY} />
        <Text className="text-light-textSecondary mt-4">
          Loading budget details...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-light-background">
      <View className="p-4">
        {isEditing ? renderEditForm() : renderBudgetDetails()}

        {!isEditing && (
          <>
            {/* Associated Expenses */}
            {/* {renderAssociatedExpenses()} */}

            {/* Action Buttons */}
            <View className="flex-row mb-4">
              <TouchableOpacity
                className="flex-1 bg-light-surface border border-primary py-3 rounded-lg items-center mr-2"
                onPress={() => setIsEditing(true)}>
                <Text className="font-medium text-primary">Edit Budget</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-red-500 py-3 rounded-lg items-center"
                onPress={handleDelete}
                disabled={isDeleting}>
                {isDeleting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="font-medium text-white">Delete Budget</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Back Button */}
        <TouchableOpacity
          className="py-2 items-center"
          onPress={() => navigation.goBack()}>
          <Text className="text-light-textSecondary">Back to Budgets</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditBudgetScreen;
