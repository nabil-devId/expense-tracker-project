import React, {useState} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import {THEME} from '../../../constants';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
  is_custom?: boolean;
}

interface CategoryPickerProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string) => void;
  title?: string;
}

/**
 * CategoryPicker component allows users to select a category from a grid of options
 * Used in budget creation and editing screens
 */
const CategoryPicker: React.FC<CategoryPickerProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  title = 'Select Category',
}) => {
  // Render a single category item
  const renderCategoryItem = ({item}: {item: Category}) => {
    const isSelected = selectedCategoryId === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.categoryItem,
          isSelected && styles.selectedItem,
          {borderColor: item.color},
        ]}
        onPress={() => onSelectCategory(item.id)}
        className="p-3 rounded-lg m-1 items-center justify-center flex-auto">
        <Text
          className="text-center text-sm line-clamp-1"
          style={isSelected ? {color: item.color} : {}}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="mb-4">
      <Text className="text-lg font-bold mb-2 text-light-textPrimary">
        {title}
      </Text>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id}
        numColumns={3}
        className="bg-light-surface rounded-lg w-full"
        scrollEnabled={false}
        contentContainerStyle={styles.categoryGrid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  categoryGrid: {
    alignItems: 'stretch',
  },
  categoryItem: {
    width: '25%',
    borderWidth: 1,
    borderColor: THEME.COLORS.GRAY_LIGHT,
  },
  selectedItem: {
    borderWidth: 2,
    backgroundColor: 'rgba(52, 152, 219, 0.3)',
  },
});

export default CategoryPicker;
