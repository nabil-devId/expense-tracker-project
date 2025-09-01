import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {expenseService, categoryService} from '../../api';
import {
  createExpenseStart,
  createExpenseSuccess,
  createExpenseFailure,
} from '../../store/slices/expenseSlice';
import {THEME, ROUTES} from '../../constants';
import {Text} from '../../components/atoms/Text';
import {Button} from '../../components/atoms/Button';
import {Icon} from '../../components/atoms/Icon';
import {AmountInput} from '../../components/molecules/AmountInput';
import {DatePicker, ScreenLayout} from '@/components';
import CategoryPicker, {
  Category,
} from '../../components/molecules/CategoryPicker'; // Adjust path if necessary

/**
 * CreateExpenseScreen allows users to add a new expense
 * Implements the "Add New Expense" flow from the user journey
 */
const CreateExpenseScreen = ({navigation, route}: any) => {
  const dispatch = useDispatch();

  // Get scanned receipt data if coming from receipt scanner
  const scannedData = route.params?.scannedData || null;

  // Form state
  const [merchantName, setMerchantName] = useState(
    scannedData?.merchant_name || '',
  );
  const [amount, setAmount] = useState(
    scannedData?.total_amount?.toString() || '',
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null, // Will be set by useEffect if scannedData.category exists
  );
  const [transactionDate, setTransactionDate] = useState(
    scannedData?.transaction_date
      ? new Date(scannedData.transaction_date)
      : new Date(),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState(scannedData?.notes || '');
  const [paymentMethod, setPaymentMethod] = useState(
    scannedData?.payment_method || '',
  );
  const [location, setLocation] = useState(scannedData?.location_name || '');
  const [receiptImage, setReceiptImage] = useState(
    scannedData?.receipt_image || null,
  );

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  // Fetch categories when component mounts
  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, []),
  );

  // Effect to set selected category from scanned data once categories are loaded
  useEffect(() => {
    if (scannedData?.category && categories.length > 0 && !selectedCategoryId) {
      const foundCategory = categories.find(
        cat => cat.name.toLowerCase() === scannedData.category.toLowerCase(),
      );
      if (foundCategory) {
        setSelectedCategoryId(foundCategory.id);
      }
    }
  }, [scannedData, categories, selectedCategoryId]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
  };

  const fetchCategories = async () => {
    try {
      setIsCategoriesLoading(true);
      const response = await categoryService.getCategories();

      // Transform categories into the format needed for display
      const formattedCategories = [
        ...response.default_categories.map((cat: any) => ({
          id: cat.category_id,
          name: cat.name,
          color: cat.color,
          icon: cat.icon,
        })),
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
    if (!selectedCategoryId) {
      Alert.alert('Error', 'Please select a category.');
      return false;
    }

    if (!merchantName.trim()) {
      Alert.alert('Error', 'Please enter a merchant name.');
      return false;
    }

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount greater than zero.');
      return false;
    }

    return true;
  };

  const handleCreateExpense = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      dispatch(createExpenseStart());

      const selectedCategory = categories.find(
        cat => cat.id === selectedCategoryId,
      );

      const expenseData = {
        merchant_name: merchantName,
        total_amount: parseFloat(amount),
        transaction_date: transactionDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        category_id: selectedCategory?.is_custom
          ? undefined
          : selectedCategory?.id,
        user_category_id: selectedCategory?.is_custom
          ? selectedCategory.id
          : undefined,
        payment_method: paymentMethod || undefined,
        notes: notes || undefined,
      };

      const response = await expenseService.createExpense(expenseData);
      console.log(response);

      // dispatch(createExpenseSuccess(response));

      Alert.alert('Success', 'Expense created successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate(ROUTES.EXPENSES.LIST),
        },
      ]);
    } catch (error: any) {
      console.error('Error creating expense:', error);
      const errorMessage = 'Failed to create expense. Please try again.';
      dispatch(createExpenseFailure(errorMessage));
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setTransactionDate(selectedDate);
    }
  };

  const handleScanReceipt = () => {
    navigation.navigate(ROUTES.EXPENSES.SCAN);
  };

  return (
    <ScreenLayout scrollable={true}>
      <View className="p-4">
        {/* Merchant Name */}
        <View className="mb-4">
          <Text className="text-light-textSecondary mb-2">Merchant Name</Text>
          <TextInput
            className="bg-light-surface border border-gray-300 rounded-lg px-4 py-3 text-light-textPrimary"
            placeholder="e.g., Grocery Store, Restaurant"
            value={merchantName}
            onChangeText={setMerchantName}
          />
        </View>

        {/* Amount */}
        <View className="mb-4">
          <Text className="text-light-textSecondary mb-2">Amount</Text>
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

        {/* Transaction Date */}
        <View className="mb-4">
          <Text className="text-light-textSecondary mb-2">Date</Text>
          <DatePicker value={transactionDate} onChange={onDateChange} />
        </View>

        {/* Category */}
        {/* Category Picker */}
        <View className="mb-4">
          <Text className="text-light-textSecondary mb-2">Category</Text>
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
        </View>

        {/* Payment Method */}
        <View className="mb-4">
          <Text className="text-light-textSecondary mb-2">
            Payment Method (Optional)
          </Text>
          <TextInput
            className="bg-light-surface border border-gray-300 rounded-lg px-4 py-3 text-light-textPrimary"
            placeholder="e.g., Cash, Credit Card"
            value={paymentMethod}
            onChangeText={setPaymentMethod}
          />
        </View>

        {/* Notes */}
        <View className="mb-4">
          <Text className="text-light-textSecondary mb-2">
            Notes (Optional)
          </Text>
          <TextInput
            className="bg-light-surface border border-gray-300 rounded-lg px-4 py-3 text-light-textPrimary"
            placeholder="Add any additional notes"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Create Button */}
        <TouchableOpacity
          className="bg-primary py-4 rounded-lg items-center mb-4"
          onPress={handleCreateExpense}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text
              className="text-white font-bold text-lg"
              style={{color: 'white'}}>
              Save Expense
            </Text>
          )}
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          className="py-2 items-center"
          onPress={() => navigation.goBack()}>
          <Text className="text-light-textSecondary">Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScreenLayout>
  );
};

export default CreateExpenseScreen;
