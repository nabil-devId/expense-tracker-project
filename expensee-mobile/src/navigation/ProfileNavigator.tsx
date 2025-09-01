import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ROUTES} from '../constants';

// Import screens
import ProfileScreen from '@/screens/profile/ProfileScreen';
import CategoryListScreen from '@/screens/category/CategoryListScreen';
import AddCategoryScreen from '@/screens/category/AddCategoryScreen';
import UserProfileEditScreen from '@/screens/profile/UserProfileEditScreen';
import AnalyticsScreen from '@/screens/main/AnalyticsScreen';

const Stack = createStackNavigator();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.PROFILE.LIST}
      screenOptions={{
        headerShown: false, // Headers will be managed by individual screens or custom components
      }}>
      <Stack.Screen name={ROUTES.PROFILE.LIST} component={ProfileScreen} />
      <Stack.Screen
        name={ROUTES.PROFILE.CATEGORIES}
        component={CategoryListScreen}
        options={{
          headerShown: true, // Show header for this screen
          title: 'Categories',
        }}
      />
      <Stack.Screen
        name={ROUTES.PROFILE.ADD_CATEGORY}
        component={AddCategoryScreen}
        options={{
          headerShown: true,
          title: 'Create a New Category',
        }}
      />
      <Stack.Screen
        name={ROUTES.PROFILE.USER_PROFILE_EDIT}
        component={UserProfileEditScreen}
        options={{
          headerShown: true,
          title: 'Edit Profile',
        }}
      />
      <Stack.Screen
        name={ROUTES.PROFILE.ANALYTICS}
        component={AnalyticsScreen}
        options={{
          headerShown: true,
          title: 'Analytics',
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
