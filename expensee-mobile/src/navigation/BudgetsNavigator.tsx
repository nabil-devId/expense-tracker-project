import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ROUTES} from '../constants';

// Import screens
import BudgetsListScreen from '../screens/budgets/BudgetsListScreen';
import CreateBudgetScreen from '../screens/budgets/CreateBudgetScreen';
import EditBudgetScreen from '../screens/budgets/EditBudgetScreen';

const Stack = createStackNavigator();

const BudgetsNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.BUDGETS.LIST}
      screenOptions={{
        headerShown: true,
      }}>
      <Stack.Screen
        name={ROUTES.BUDGETS.LIST}
        component={BudgetsListScreen}
        options={{
          title: 'Budgets',
        }}
      />
      <Stack.Screen
        name={ROUTES.BUDGETS.CREATE}
        component={CreateBudgetScreen}
        options={{
          title: 'Create Budget',
        }}
      />
      <Stack.Screen
        name={ROUTES.BUDGETS.EDIT}
        component={EditBudgetScreen}
        options={{
          title: 'Budget',
        }}
      />
    </Stack.Navigator>
  );
};

export default BudgetsNavigator;
