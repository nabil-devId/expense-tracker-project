import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import ScreenLayout from '@/components/templates/ScreenLayout/ScreenLayout';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {categoryService} from '@/api';

import {ROUTES} from '@/constants';

// Mock data for colors and icons
const colors = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#FED766',
  '#2AB7CA',
  '#F06595',
  '#74B816',
  '#B197FC',
  '#63E6BE',
  '#FFC0CB',
];

const icons = [
  'food-fork-drink',
  'airplane',
  'silverware-fork-knife',
  'account-outline',
  'credit-card-outline',
  'movie-open-outline',
  'home-outline',
  'flash-outline',
  'shopping-outline',
  'bed-outline',
  'medical-bag',
  'help-circle-outline',
  'tshirt-crew-outline',
  'train-variant',
  'food-croissant',
  'glass-cocktail',
  'soccer',
  'paw',
  'school-outline',
  'filmstrip',
  'heart-outline',
  'train-car',
  'cash-multiple',
  'music-note-outline',
  'wallet-outline',
  'gift-outline',
  'tie',
  'sack',
  'coffee-outline',
  'gas-station-outline',
  'parking',
  'tag-outline',
  'smoking',
  'book-open-page-variant-outline',
  'wrench-outline',
  'motorbike',
  'laptop',
  'content-cut',
  'apple',
  'pencil-outline',
  'car-side',
  'receipt',
  'flower-tulip-outline',
  'account-group-outline',
];

const AddCategoryScreen = ({navigation}: {navigation: any}) => {
  const [categoryName, setCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedIcon, setSelectedIcon] = useState(icons[0]);

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) {
      Alert.alert('Validation Error', 'Please enter a category name.');
      return;
    }

    try {
      await categoryService.createCategory({
        name: categoryName,
        color: selectedColor,
        icon: selectedIcon,
      });
      Alert.alert('Category Created', `Name: ${categoryName}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to create category');
    }
    navigation.goBack();
  };

  return (
    <ScreenLayout>
      <ScrollView style={styles.container}>
        <View style={styles.previewContainer}>
          <View
            style={[
              styles.previewIconCircle,
              {backgroundColor: selectedColor},
            ]}>
            <MaterialCommunityIcons
              name={selectedIcon}
              size={40}
              color="#FFFFFF"
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Category name"
            placeholderTextColor="#828282"
            value={categoryName}
            onChangeText={setCategoryName}
          />
        </View>

        <Text style={styles.sectionTitle}>Category color</Text>
        <View style={styles.colorGrid}>
          {colors.map(color => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorCircle,
                {backgroundColor: color},
                selectedColor === color && styles.selectedColor,
              ]}
              onPress={() => setSelectedColor(color)}
            />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Category icon</Text>
        <View style={styles.iconGrid}>
          {icons.map(icon => (
            <TouchableOpacity
              key={icon}
              style={[
                styles.iconCircle,
                selectedIcon === icon && {backgroundColor: selectedColor},
              ]}
              onPress={() => setSelectedIcon(icon)}>
              <MaterialCommunityIcons
                name={icon}
                size={30}
                color={selectedIcon === icon ? '#FFFFFF' : '#000000'}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity
        className="bg-primary p-6 "
        style={styles.createButton}
        onPress={handleCreateCategory}>
        <Text style={styles.createButtonText}>Create a Category</Text>
      </TouchableOpacity>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  previewIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  input: {
    flex: 1,
    fontSize: 20,
    color: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 15,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#000000',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    backgroundColor: '#F2F2F2',
  },
  createButton: {
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    margin: 20,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddCategoryScreen;
