import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import ScreenLayout from '@/components/templates/ScreenLayout/ScreenLayout';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {ROUTES} from '@/constants';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/store';
import {categoryService} from '@/api';

import {Category, fetchCategoriesSuccess} from '@/store/slices/categorySlice';

// Category Item Component
const CategoryItem = ({
  item,
  onHandleDelete,
}: {
  item: Category;
  onHandleDelete: (item: Category) => Promise<void>;
}) => {
  const handleDelete = () => {
    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete ${item.name}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          onPress: () => onHandleDelete(item),
          style: 'destructive',
        },
      ],
    );
  };

  return (
    <View style={styles.itemContainer}>
      <MaterialCommunityIcons
        name={item.icon}
        size={24}
        color="#4F4F4F"
        style={styles.icon}
      />
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemSubtitle}>0 transactions in 0 wallets</Text>
      </View>
      {item.user_category_id && (
        <TouchableOpacity onPress={handleDelete}>
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={24}
            color="#E74C3C"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const CategoryListScreen = () => {
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const dispatch = useDispatch();

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

      dispatch(
        fetchCategoriesSuccess({
          defaultCategories: response.default_categories,
          userCategories: response.user_categories,
        }),
      );
    } catch (error) {
      console.error('Error fetching categories:', error);
      Alert.alert('Error', 'Failed to load categories. Please try again.');
    } finally {
      setIsCategoriesLoading(false);
    }
  };
  const {defaultCategories, userCategories} = useSelector(
    (state: RootState) => state.categories,
  );
  const navigation = useNavigation();
  const handleAddCategory = () => {
    navigation.navigate(ROUTES.PROFILE.ADD_CATEGORY as never);
  };

  const onHandleDelete = async (item: Category) => {
    try {
      await categoryService.deleteCategory(item.user_category_id);
      await fetchCategories();
      Alert.alert(
        'Category Deleted',
        `Category ${item.name} deleted successfully`,
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to delete category');
    }
  };

  return (
    <ScreenLayout>
      {isCategoriesLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <FlatList
          data={[...defaultCategories, ...userCategories]}
          renderItem={({item}) => (
            <CategoryItem
              item={item}
              onHandleDelete={() => onHandleDelete(item)}
            />
          )}
          keyExtractor={item =>
            item.category_id ? item.category_id : item.user_category_id
          }
          contentContainerStyle={styles.listContentContainer}
        />
      )}
      <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
        <MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  listContentContainer: {
    paddingBottom: 80, // Ensure space for the floating action button
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  icon: {
    marginRight: 16,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    color: '#000000',
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#828282',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // Shadow for Android
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default CategoryListScreen;
