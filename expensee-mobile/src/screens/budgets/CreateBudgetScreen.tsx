import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {budgetService, categoryService} from '../../api';
import {
  createBudgetSuccess,
  fetchBudgetsSuccess,
} from '../../store/slices/budgetSlice';
import {THEME} from '../../constants';
import CategoryPicker, {
  Category,
} from '../../components/molecules/CategoryPicker';
import PeriodSelector, {
  BudgetPeriod,
} from '../../components/molecules/PeriodSelector';
import {CreateBudgetRequest} from '@/api/budgetService';
import {DatePicker} from '@/components';
import {Picker} from '@react-native-picker/picker';

/**
 * CreateBudgetScreen allows users to create a new budget
 * Implements the Budget Creation flow from the user journey
 */
const CreateBudgetScreen = ({navigation}: any) => {
  const dispatch = useDispatch();

  // Form state
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<BudgetPeriod>('monthly');
  const [startDate, setStartDate] = useState(new Date());
  // State for month and year dropdowns
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  // Data state
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  // Fetch categories when component mounts or comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, []),
  );

  const fetchCategories = async () => {
    try {
      setIsCategoriesLoading(true);
      const response = await categoryService.getCategories();

      // Transform categories into the format expected by CategoryPicker
      const formattedCategories: Category[] = [
        // Add default categories
        ...response.default_categories.map((cat: any) => ({
          id: cat.category_id,
          name: cat.name,
          color: cat.color,
          icon: cat.icon,
        })),
        // Add user categories
        ...response.user_categories.map((cat: any) => ({
          id: cat.user_category_id,
          name: cat.name,
          color: cat.color,
          icon: cat.icon,
          is_custom: true,
        })),
      ];

      setCategories(formattedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      Alert.alert('Error', 'Failed to load categories. Please try again.');
    } finally {
      setIsCategoriesLoading(false);
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

    if (!selectedCategoryId) {
      Alert.alert('Error', 'Please select a category for this budget.');
      return false;
    }

    return true;
  };

  const handleCreateBudget = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      // Calculate end date based on period and start date
      let endDate = new Date(startDate);
      if (period === 'weekly') {
        endDate.setDate(startDate.getDate() + 6); // 7 days (0-6)
      } else if (period === 'monthly') {
        // Set to last day of the month
        endDate = new Date(
          startDate.getFullYear(),
          startDate.getMonth() + 1,
          0,
        );
      }

      const defaultCategory = categories.find(
        category => category.id === selectedCategoryId,
      );

      const budgetRequest: CreateBudgetRequest = {
        amount: parseFloat(amount),
        month: startDate.getMonth() + 1,
        year: startDate.getFullYear(),
        category_id: defaultCategory?.is_custom ? null : defaultCategory?.id,
        user_category_id: defaultCategory?.is_custom
          ? defaultCategory?.id
          : null,
        budget_name: name,
      };

      await budgetService.createBudget(budgetRequest);

      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();
      const response = await budgetService.getBudgets(
        currentMonth,
        currentYear,
      );

      Alert.alert('Success', 'Budget created successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      console.error('Error creating budget:', error);
      const errorMessage =
        error.response?.data?.detail ||
        'Failed to create budget. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onStartDateChange = (newDate: Date) => {
    // The custom DatePicker component handles its own visibility,
    // so setShowStartDatePicker(false) is no longer needed here.
    // The custom DatePicker also ensures 'newDate' is always a valid Date object.
    setStartDate(newDate);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
  };

  return (
    <ScrollView className="flex-1 bg-light-background">
      <View className="p-4">
        <Text className="text-2xl font-bold text-light-textPrimary mb-6">
          Create Budget
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
        <View className="mb-4">
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

        {/* Start Date */}
        <View className="mb-4">
          <Text className="text-light-textSecondary mb-2">Period</Text>
          {/* Month & Year dropdowns */}
          <View className="flex-row">
            {/* Month Picker */}
            <View className="flex-1 mr-2 bg-light-surface border border-gray-300 rounded-lg">
              <Picker
                selectedValue={selectedMonth}
                onValueChange={(value: number) => {
                  setSelectedMonth(value);
                  setStartDate(prev => new Date(selectedYear, value, prev.getDate()));
                }}>
                {Array.from({ length: 12 }, (_, index) => (
                  <Picker.Item
                    key={index}
                    label={new Date(0, index, 1).toLocaleString('default', { month: 'long' })}
                    value={index}
                  />
                ))}
              </Picker>
            </View>
            {/* Year Picker */}
            <View className="flex-1 ml-2 bg-light-surface border border-gray-300 rounded-lg">
              <Picker
                selectedValue={selectedYear}
                onValueChange={(value: number) => {
                  setSelectedYear(value);
                  setStartDate(prev => new Date(value, selectedMonth, prev.getDate()));
                }}>
                {Array.from({ length: 6 }, (_, idx) => {
                  const year = new Date().getFullYear() - 2 + idx;
                  return (
                    <Picker.Item key={year} label={year.toString()} value={year} />
                  );
                })}
              </Picker>
            </View>
          </View>
        </View>

        {/* Category Picker */}
        {isCategoriesLoading ? (
          <View className="items-center py-4">
            <ActivityIndicator size="small" color={THEME.COLORS.PRIMARY} />
            <Text className="text-light-textSecondary mt-2">
              Loading categories...
            </Text>
          </View>
        ) : (
          <CategoryPicker
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={handleCategorySelect}
          />
        )}

        {/* Create Button */}
        <TouchableOpacity
          className="bg-primary py-4 rounded-lg items-center mb-4 mt-6"
          onPress={handleCreateBudget}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Create Budget</Text>
          )}
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          className="py-2 items-center"
          onPress={() => navigation.goBack()}>
          <Text className="text-light-textSecondary">Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CreateBudgetScreen;
