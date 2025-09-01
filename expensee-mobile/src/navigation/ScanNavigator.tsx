import {View, Text} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ROUTES} from '@/constants';
import ScanScreen from '../screens/scan/ScanScreen';
import ScanResultScreen from '@/screens/scan/ScanResultScreen';
const Stack = createStackNavigator();

const ScanNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ROUTES.SCAN.SCAN}
        component={ScanScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ROUTES.SCAN.SCAN_RESULT}
        component={ScanResultScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default ScanNavigator;
