// ExpensesNavigator.js
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ROUTES} from '../constants';

// Import screens
import ExpensesListScreen from '../screens/expenses/ExpensesListScreen';
import ExpenseDetailScreen from '../screens/expenses/ExpenseDetailScreen';
import CreateExpenseScreen from '../screens/expenses/CreateExpenseScreen';
import EditExpenseScreen from '../screens/expenses/EditExpenseScreen';
import ReceiptScannerScreen from '../screens/expenses/ReceiptScannerScreen';
// No need for getFocusedRouteNameFromRoute or useLayoutEffect here anymore

const Stack = createStackNavigator();

const ExpensesNavigator = () => {
  // No need for route, navigation props here for this purpose
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.EXPENSES.LIST}
      screenOptions={{
        headerShown: true,
      }}>
      <Stack.Screen
        name={ROUTES.EXPENSES.LIST}
        component={ExpensesListScreen}
        options={{
          title: 'Expenses',
        }}
      />
      <Stack.Screen
        name={ROUTES.EXPENSES.DETAIL}
        component={ExpenseDetailScreen}
        options={{
          title: 'Expense Details',
        }}
        screenOptions={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name={ROUTES.EXPENSES.CREATE}
        component={CreateExpenseScreen}
        options={{
          title: 'Add Expense',
        }}
      />
      <Stack.Screen
        name={ROUTES.EXPENSES.EDIT}
        component={EditExpenseScreen}
        options={{
          title: 'Edit Expense',
        }}
      />
      <Stack.Screen
        name={ROUTES.EXPENSES.SCAN}
        component={ReceiptScannerScreen}
        options={{
          title: 'Scan Receipt',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default ExpensesNavigator;
