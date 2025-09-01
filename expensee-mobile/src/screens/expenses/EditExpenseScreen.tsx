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
  Image,
  Modal,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {expenseService, categoryService} from '../../api';
import {
  fetchExpenseDetailStart,
  fetchExpenseDetailSuccess,
  fetchExpenseDetailFailure,
  updateExpenseStart,
  updateExpenseFailure,
  deleteExpenseStart,
  deleteExpenseSuccess,
  deleteExpenseFailure,
  ExpenseDetail,
} from '../../store/slices/expenseSlice';
import {THEME, ROUTES} from '../../constants';
import {Text} from '../../components/atoms/Text';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {RootState} from '../../store';
import {Category} from '@/store/slices/categorySlice';

/**
 * EditExpenseScreen allows users to edit an existing expense
 * Implements the "Edit Expense" flow from the user journey
 */
const EditExpenseScreen = ({navigation, route}: any) => {
  const {id} = route.params;
  const dispatch = useDispatch();
  const {currentExpense, isLoading, error} = useSelector(
    (state: RootState) => state.expenses,
  );

  // Form state
  const [merchantName, setMerchantName] = useState('');
  const [amount, setAmount] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [transactionDate, setTransactionDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<{
    name: string;
    quantity: number;
    unit_price: string;
    total_price: string;
  } | null>(null);
  const [receiptData, setReceiptData] = useState<ExpenseDetail>(
    currentExpense as ExpenseDetail,
  );

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>();

  // Fetch expense details and categories when component mounts
  useFocusEffect(
    useCallback(() => {
      fetchExpenseDetails();
      fetchCategories();
    }, [id]),
  );

  // Populate form with expense details when they are loaded
  useEffect(() => {
    if (receiptData) {
      setMerchantName(receiptData.merchant_name || '');
      setAmount(receiptData.total_amount?.toString() || '');
      setSelectedCategory(
        receiptData.category ? receiptData.category : receiptData.user_category,
      );
      setTransactionDate(
        receiptData.transaction_date
          ? new Date(receiptData.transaction_date)
          : new Date(),
      );
      setNotes(receiptData.notes || '');
      setPaymentMethod(receiptData.payment_method || '');
    }
  }, [receiptData]);

  const fetchExpenseDetails = async () => {
    try {
      dispatch(fetchExpenseDetailStart());
      const response = await expenseService.getExpenseById(id);
      dispatch(fetchExpenseDetailSuccess(response));
    } catch (error: any) {
      console.error('Error fetching expense details:', error);
      const errorMessage = error.message || 'Failed to load expense details.';
      dispatch(fetchExpenseDetailFailure(errorMessage));
      Alert.alert('Error', errorMessage);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
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
      setLoadingCategories(false);
    }
  };

  const validateForm = () => {
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

  const handleUpdateExpense = async () => {
    if (!validateForm()) return;

    try {
      setIsSaving(true);
      dispatch(updateExpenseStart());

      const expenseData = {
        merchant_name: merchantName,
        total_amount: parseFloat(amount),
        transaction_date: transactionDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        category_id: selectedCategory?.category_id || undefined,
        user_category_id: selectedCategory?.user_category_id || undefined,
        payment_method: paymentMethod || undefined,
        notes: notes || undefined,
        items: receiptData?.items || [],
      };

      await expenseService.updateExpense(id, expenseData);

      Alert.alert('Success', 'Expense updated successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      console.error('Error updating expense:', error);
      Alert.alert('Error', 'Failed to update expense. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteExpense = () => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense? This action cannot be undone.',
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
      dispatch(deleteExpenseStart());

      await expenseService.deleteExpense(id);
      dispatch(deleteExpenseSuccess(id));

      Alert.alert('Success', 'Expense deleted successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate(ROUTES.EXPENSES.LIST),
        },
      ]);
    } catch (error: any) {
      console.error('Error deleting expense:', error);
      Alert.alert('Error', 'Failed to delete expense. Please try again.');
      setIsDeleting(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setTransactionDate(selectedDate);
    }
  };

  if (isLoading && !receiptData) {
    return (
      <View className="flex-1 justify-center items-center bg-light-background">
        <ActivityIndicator size="large" color={THEME.COLORS.PRIMARY} />
        <Text className="text-light-textSecondary mt-4">
          Loading expense details...
        </Text>
      </View>
    );
  }

  const handleUpdateItem = (index: number) => {
    if (!receiptData || !editingItem) return;

    // Update the item at the specified index
    const updatedItems = [...receiptData.items];
    updatedItems[index] = {
      ...editingItem,
      // Calculate total_price if quantity and unit_price are provided
      total_price: (
        editingItem.quantity * parseFloat(editingItem.unit_price)
      ).toString(),
    };

    setReceiptData({
      ...receiptData,
      items: updatedItems,
    });

    // Reset editing state
    setEditingItemIndex(null);
    setEditingItem(null);
  };

  const parseCurrency = (value: string) => {
    return parseFloat(value.replace(/[^0-9.]/g, '')).toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
    });
  };

  // Render item edit modal
  const renderEditItemModal = () => {
    if (editingItemIndex === null || !editingItem) return null;

    return (
      <View className="absolute inset-0 bg-black bg-opacity-50 justify-center items-center z-10">
        <View className="bg-white p-4 rounded-lg w-5/6">
          <Text className="text-lg font-bold mb-4">Edit Item</Text>

          <Text className="mb-1">Item Name</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-2 mb-3"
            value={editingItem.name}
            onChangeText={text => setEditingItem({...editingItem, name: text})}
          />

          <Text className="mb-1">Quantity</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-2 mb-3"
            value={editingItem.quantity.toString()}
            keyboardType="numeric"
            onChangeText={text => {
              const quantity = parseFloat(text) || 0;
              setEditingItem({...editingItem, quantity});
            }}
          />

          <Text className="mb-1">Unit Price</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-2 mb-4"
            value={editingItem.unit_price}
            keyboardType="numeric"
            onChangeText={text => {
              setEditingItem({
                ...editingItem,
                unit_price: text,
              });
            }}
          />

          <View className="flex-row justify-end">
            <TouchableOpacity
              className="bg-gray-300 px-4 py-2 rounded-lg mr-2"
              onPress={() => {
                setEditingItemIndex(null);
                setEditingItem(null);
              }}>
              <Text>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-primary px-4 py-2 rounded-lg"
              onPress={() => handleUpdateItem(editingItemIndex)}>
              <Text style={{color: 'white'}}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // Render category selection modal
  const renderCategoryModal = () => {
    if (!showCategoryModal) return null;

    return (
      <Modal
        visible={showCategoryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCategoryModal(false)}>
        <View
          className="flex-1 justify-end"
          style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
          <View className="bg-white rounded-t-lg p-4 h-2/3">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold">Select Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {loadingCategories ? (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color={THEME.COLORS.PRIMARY} />
                <Text className="mt-2">Loading categories...</Text>
              </View>
            ) : (
              <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}>
                <View className="flex-row flex-wrap justify-between">
                  {categories.map(category => (
                    <TouchableOpacity
                      key={
                        category.category_id
                          ? category.category_id
                          : category.user_category_id
                      }
                      className={`m-2 p-3 rounded-lg items-center justify-center w-24 h-24 bg-gray-100`}
                      onPress={() => {
                        setSelectedCategory(category);
                        setShowCategoryModal(false);
                      }}>
                      <Text className="text-xs text-center">
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1">
      <ScrollView className="flex-1 bg-white">
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
            <TextInput
              className="border border-gray-300 rounded-lg p-2"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0.00"
            />
          </View>

          {/* Transaction Date */}
          <View className="mb-4">
            <Text className="text-light-textSecondary mb-2">Date</Text>
            <TouchableOpacity
              className="bg-light-surface border border-gray-300 rounded-lg px-4 py-3 flex-row justify-between items-center"
              onPress={() => setShowDatePicker(true)}>
              <Text className="text-light-textPrimary">
                {transactionDate.toLocaleDateString()}
              </Text>
              <Icon name="calendar" size={20} color={THEME.COLORS.PRIMARY} />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={transactionDate}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
          </View>

          {/* Category */}
          <View className="mb-4">
            <Text className="text-light-textSecondary mb-2">Category</Text>
            <TouchableOpacity
              className="border border-gray-300 rounded-lg p-3 flex-row items-center"
              onPress={() => setShowCategoryModal(true)}>
              {selectedCategory ? (
                <View className="flex-row items-center">
                  <Text>{selectedCategory.name}</Text>
                </View>
              ) : (
                <Text className="text-gray-500">Select a category</Text>
              )}
              <View className="flex-1" />
              <Icon name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
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

          {/* Items list */}
          <View className="bg-white rounded-lg mx-4 my-2 p-4 mb-6">
            <Text className="font-bold text-lg mb-4">Items</Text>

            {receiptData?.items.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="border-b border-gray-200 py-3 flex-row justify-between items-center"
                onPress={() => {
                  setEditingItemIndex(index);
                  setEditingItem({...item});
                }}>
                <View className="flex-1">
                  <Text className="font-medium">{item.name}</Text>
                  <Text className="text-gray-600">
                    {item.quantity} x {parseCurrency(item.unit_price)}
                  </Text>
                </View>
                <Text className="font-bold">
                  {parseCurrency(item.total_price)}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Add item button */}
            <TouchableOpacity
              className="mt-4 flex-row items-center"
              onPress={() => {
                setEditingItemIndex(receiptData?.items?.length ?? 0);
                setEditingItem({
                  name: '',
                  quantity: 1,
                  unit_price: '0',
                  total_price: '0',
                });
              }}>
              <Icon name="plus-circle" size={20} color={THEME.COLORS.PRIMARY} />
              <Text className="text-primary ml-2">Add Item</Text>
            </TouchableOpacity>
          </View>

          {/* Update Button */}
          <TouchableOpacity
            className="bg-primary py-4 rounded-lg items-center mb-4"
            onPress={handleUpdateExpense}
            disabled={isSaving}>
            {isSaving ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text
                className="text-white font-bold text-lg"
                style={{color: 'white'}}>
                Save Changes
              </Text>
            )}
          </TouchableOpacity>

          {/* Delete Button */}
          <TouchableOpacity
            className="bg-red-500 py-4 rounded-lg items-center mb-4"
            onPress={handleDeleteExpense}
            disabled={isDeleting}>
            {isDeleting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text
                className="text-white font-bold text-lg"
                style={{color: 'white'}}>
                Delete Expense
              </Text>
            )}
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            className="py-2 items-center"
            onPress={() => navigation.goBack()}>
            <Text className="text-light-textSecondary" style={{color: 'black'}}>
              Cancel
            </Text>
          </TouchableOpacity>
          {/* Edit item modal */}
          {renderEditItemModal()}
          {renderCategoryModal()}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditExpenseScreen;
