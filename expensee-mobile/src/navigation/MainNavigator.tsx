import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native'; // <-- Import this
import {ROUTES, THEME} from '../constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import screens
import HomeScreen from '../screens/main/HomeScreen';
import ExpensesNavigator from './ExpensesNavigator';
import BudgetsNavigator from './BudgetsNavigator';
import AnalyticsScreen from '../screens/main/AnalyticsScreen';
import ScanNavigator from './ScanNavigator';
import ProfileNavigator from './ProfileNavigator';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  const resetNavigation = (navigation: any, routeName: string) => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: routeName,
          state: {routes: [{name: routeName}]},
        },
      ],
    });
  };
  return (
    <Tab.Navigator
      initialRouteName={ROUTES.MAIN.HOME}
      screenOptions={{
        tabBarActiveTintColor: THEME.COLORS.PRIMARY,
        tabBarInactiveTintColor: THEME.COLORS.LIGHT_TEXT_SECONDARY,
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarStyle: {
          // This is the default style for all tabs
          backgroundColor: THEME.COLORS.LIGHT_SURFACE,
          display: 'flex', // Default to visible
        },
        headerShown: false,
      }}>
      <Tab.Screen
        name={ROUTES.MAIN.HOME}
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="home" color={color} size={size} />
          ),
          // Tab bar will be visible by default (inherits from screenOptions)
        }}
      />
      <Tab.Screen
        name={ROUTES.MAIN.EXPENSES}
        component={ExpensesNavigator}
        listeners={({navigation}) => ({
          unmountOnBlur: true,
          tabPress: e => {
            e.preventDefault();
            resetNavigation(navigation, ROUTES.MAIN.EXPENSES);
          },
        })}
        options={({route}) => {
          const routeName =
            getFocusedRouteNameFromRoute(route) ?? ROUTES.EXPENSES.LIST;
          const isListScreen =
            routeName === ROUTES.EXPENSES.LIST ||
            routeName === ROUTES.MAIN.EXPENSES;

          return {
            tabBarIcon: ({color, size}) => (
              <Icon name="receipt" color={color} size={size} />
            ),
            tabBarStyle: {
              // Keep existing styles from screenOptions if visible
              ...(isListScreen && {
                backgroundColor: THEME.COLORS.LIGHT_SURFACE,
              }),
              display: isListScreen ? 'flex' : 'none',
            },
          };
        }}
      />
      <Tab.Screen
        name={ROUTES.MAIN.SCAN}
        component={ScanNavigator}
        listeners={({navigation}) => ({
          unmountOnBlur: true,
          tabPress: e => {
            e.preventDefault();
            resetNavigation(navigation, ROUTES.MAIN.SCAN);
          },
        })}
        options={({route}) => {
          return {
            tabBarIcon: ({color, size}) => (
              <Icon name="camera" color={color} size={size} />
            ),
            tabBarStyle: {
              // Keep existing styles from screenOptions if visible
              display: 'none',
            },
          };
        }}
      />
      <Tab.Screen
        name={ROUTES.MAIN.BUDGETS}
        component={BudgetsNavigator}
        options={({route}) => {
          const routeName =
            getFocusedRouteNameFromRoute(route) ?? ROUTES.EXPENSES.LIST;
          const isListScreen =
            routeName === ROUTES.EXPENSES.LIST ||
            routeName === ROUTES.MAIN.EXPENSES ||
            routeName === ROUTES.BUDGETS.LIST;

          return {
            tabBarIcon: ({color, size}) => (
              <Icon name="wallet" color={color} size={size} />
            ),
            tabBarStyle: {
              // Keep existing styles from screenOptions if visible
              ...(isListScreen && {
                backgroundColor: THEME.COLORS.LIGHT_SURFACE,
              }),
              display: isListScreen ? 'flex' : 'none',
            },
          };
        }}
      />
      <Tab.Screen
        name={ROUTES.MAIN.PROFILE}
        component={ProfileNavigator}
        options={({route}) => {
          const routeName =
            getFocusedRouteNameFromRoute(route) ?? ROUTES.MAIN.PROFILE;
          const isListScreen =
            routeName === ROUTES.MAIN.PROFILE ||
            routeName === ROUTES.PROFILE.LIST;
          console.log('routeName', routeName);
          return {
            tabBarIcon: ({color, size}) => (
              <Icon name="account-settings" color={color} size={size} />
            ),
            tabBarStyle: {
              // Keep existing styles from screenOptions if visible
              ...(isListScreen && {
                backgroundColor: THEME.COLORS.LIGHT_SURFACE,
              }),
              display: isListScreen ? 'flex' : 'none',
            },
          };
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
