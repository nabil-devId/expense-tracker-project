import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  StyleSheet,
  Platform,
  Modal,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {API, ROUTES, THEME} from '../../constants';
import {receiptService, categoryService} from '../../api';
import {
  fetchOCRResultStart,
  fetchOCRResultSuccess,
  fetchOCRResultFailure,
  clearOCRResult,
} from '../../store/slices/receiptSlice';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Interface for receipt OCR data
interface ReceiptItem {
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface ConfidenceScore {
  field_name: string;
  confidence_score: string;
}

interface ReceiptData {
  merchant_name: string;
  total_amount: string | number;
  transaction_date: string;
  payment_method: string;
  ocr_id: string;
  items: ReceiptItem[];
  confidence_scores: ConfidenceScore[];
  image_url: string;
  receipt_status: string;
}

// Interface for category data
interface Category {
  category_id: string;
  user_category_id: string;
  name: string;
  icon: string;
  color: string;
  is_custom: boolean;
}

const ScanResultScreen = ({navigation, route}: any) => {
  const dispatch = useDispatch();

  // Get the OCR ID from navigation params
  const {ocrId, image} = route.params || {};

  // State variables for the form data
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<ReceiptItem | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  useEffect(() => {
    // Fetch OCR data when component mounts
    fetchOCRData();

    // Fetch categories
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const data = await categoryService.getCategories();
        setCategories([
          ...data.default_categories,
          ...data.user_categories.map((cat: any) => ({
            name: cat.name,
            icon: cat.icon,
            color: cat.color,
            is_custom: true,
            user_category_id: cat.user_category_id,
          })),
        ]);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [ocrId]);

  const fetchOCRData = async () => {
    if (!ocrId) {
      Alert.alert('Error', 'No receipt ID found. Please try again.');
      navigation.goBack();
      return;
    }

    dispatch(fetchOCRResultStart());
    setLoading(true);

    try {
      const data = await receiptService.getOCRResults(ocrId);
      dispatch(fetchOCRResultSuccess(data));
      setSelectedCategory({
        category_id: data.category?.category_id,
        user_category_id: data.user_category?.user_category_id,
        name: data.category ? data.category.name : data.user_category.name,
        icon: data.category ? data.category.icon : data.user_category.icon,
        color: data.category ? data.category.color : data.user_category.color,
        is_custom: data.category ? false : true,
      });
      setReceiptData(data);
    } catch (error) {
      console.error('Error fetching OCR data:', error);
      dispatch(fetchOCRResultFailure('Failed to fetch receipt data'));
      Alert.alert('Error', 'Failed to load receipt data. Please try again.', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } finally {
      setLoading(false);
    }
  };
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');

    if (receiptData && selectedDate) {
      setReceiptData({
        ...receiptData,
        transaction_date: selectedDate.toISOString(),
      });
    }
  };

  const handleUpdateItem = (index: number) => {
    if (!receiptData || !editingItem) return;

    // Update the item at the specified index
    const updatedItems = [...receiptData.items];
    updatedItems[index] = {
      ...editingItem,
      // Calculate total_price if quantity and unit_price are provided
      total_price: editingItem.quantity * editingItem.unit_price,
    };

    setReceiptData({
      ...receiptData,
      items: updatedItems,
    });

    // Reset editing state
    setEditingItemIndex(null);
    setEditingItem(null);
  };

  const handleSubmit = async () => {
    if (!receiptData) return;

    setSubmitting(true);

    try {
      const payload = {
        merchant_name: receiptData.merchant_name,
        total_amount: parseFloat(receiptData.total_amount as string),
        transaction_date: receiptData.transaction_date,
        payment_method: receiptData.payment_method || 'CASH',
        category_id: selectedCategory?.category_id,
        user_category_id: selectedCategory?.user_category_id,
        items: receiptData.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          unit_price: parseFloat(item.unit_price.toString()),
          total_price: parseFloat(item.total_price.toString()),
        })),
        notes: notes,
      };

      // Use the accept endpoint to submit the final data
      await receiptService.acceptOCRResults(receiptData.ocr_id, payload);

      // On success, navigate back to home screen
      Alert.alert('Success', 'Successfully added expense', [
        {
          text: 'OK',
          onPress: () => {
            dispatch(clearOCRResult());
            navigation.navigate(ROUTES.MAIN.HOME);
          },
        },
      ]);
    } catch (error) {
      console.error('Error submitting receipt data:', error);
      Alert.alert('Error', 'Failed to submit receipt data. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Display loading screen while data is being fetched
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-light-background">
        <ActivityIndicator size="large" color={THEME.COLORS.PRIMARY} />
        <Text className="mt-4 text-light-textPrimary">
          Loading receipt data...
        </Text>
      </View>
    );
  }

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
            value={editingItem.unit_price.toString()}
            keyboardType="numeric"
            onChangeText={text => {
              const unitPrice = parseFloat(text) || 0;
              setEditingItem({...editingItem, unit_price: unitPrice});
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
              <Text className="text-white">Save</Text>
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
    <View className="flex-1 bg-light-background">
      {/* Header Section */}
      <View className="bg-primary pt-12 pb-6 px-4">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mb-4">
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>

        <Text className="text-white text-xl font-bold mb-2">
          Receipt Details
        </Text>

        {receiptData && (
          <Text className="text-white text-opacity-80">
            {receiptData.merchant_name || 'Unknown Merchant'}
          </Text>
        )}
      </View>

      {/* Receipt Image and Details */}
      <ScrollView className="flex-1">
        {receiptData && (
          <>
            {/* Image section */}
            <View className="p-4">
              <Image
                source={{uri: receiptData.image_url || image}}
                className="h-48 w-full rounded-lg"
                resizeMode="cover"
              />
            </View>

            {/* Receipt details form */}
            <View className="bg-white rounded-lg mx-4 my-2 p-4">
              <Text className="font-bold text-lg mb-4">Receipt Details</Text>

              {/* Merchant name */}
              <View className="mb-4">
                <Text className="text-gray-600 mb-1">Merchant</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-2"
                  value={receiptData.merchant_name || ''}
                  onChangeText={text =>
                    setReceiptData({...receiptData, merchant_name: text})
                  }
                  placeholder="Merchant Name"
                />
              </View>

              {/* Total amount */}
              <View className="mb-4">
                <Text className="text-gray-600 mb-1">Total Amount</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-2"
                  value={receiptData.total_amount?.toString() || ''}
                  onChangeText={text =>
                    setReceiptData({...receiptData, total_amount: text})
                  }
                  keyboardType="numeric"
                  placeholder="0.00"
                />
              </View>

              {/* Transaction date */}
              <View className="mb-4">
                <Text className="text-gray-600 mb-1">Date</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  className="border border-gray-300 rounded-lg p-2">
                  <Text>
                    {receiptData.transaction_date
                      ? new Date(
                          receiptData.transaction_date,
                        ).toLocaleDateString()
                      : 'Select Date'}
                  </Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={
                      receiptData.transaction_date
                        ? new Date(receiptData.transaction_date)
                        : new Date()
                    }
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
              </View>

              {/* Payment method */}
              <View className="mb-4">
                <Text className="text-gray-600 mb-1">Payment Method</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-2"
                  value={receiptData.payment_method || ''}
                  onChangeText={text =>
                    setReceiptData({...receiptData, payment_method: text})
                  }
                  placeholder="e.g. Cash, Credit Card"
                />
              </View>

              {/* Category selection */}
              <View className="mb-4">
                <Text className="text-gray-600 mb-1">Category</Text>
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

              {/* Notes */}
              <View className="mb-4">
                <Text className="text-gray-600 mb-1">Notes</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-2"
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Add notes (optional)"
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>

            {/* Items list */}
            <View className="bg-white rounded-lg mx-4 my-2 p-4 mb-6">
              <Text className="font-bold text-lg mb-4">Items</Text>

              {receiptData.items.map((item, index) => (
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
                      {item.quantity} x Rp
                      {parseFloat(item.unit_price.toString()).toFixed(2)}
                    </Text>
                  </View>
                  <Text className="font-bold">
                    Rp
                    {parseFloat(item.total_price.toString()).toFixed(2)}
                  </Text>
                </TouchableOpacity>
              ))}

              {/* Add item button */}
              <TouchableOpacity
                className="mt-4 flex-row items-center"
                onPress={() => {
                  setEditingItemIndex(receiptData.items.length);
                  setEditingItem({
                    name: '',
                    quantity: 1,
                    unit_price: 0,
                    total_price: 0,
                  });
                }}>
                <Icon
                  name="plus-circle"
                  size={20}
                  color={THEME.COLORS.PRIMARY}
                />
                <Text className="text-primary ml-2">Add Item</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      {/* Submit button */}
      <View className="bg-white p-4 shadow-lg">
        <TouchableOpacity
          className="bg-primary py-3 rounded-lg items-center"
          onPress={handleSubmit}
          disabled={submitting}>
          {submitting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Submit Receipt</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Edit item modal */}
      {renderEditItemModal()}

      {/* Category selection modal */}
      {renderCategoryModal()}
    </View>
  );
};

export default ScanResultScreen;
