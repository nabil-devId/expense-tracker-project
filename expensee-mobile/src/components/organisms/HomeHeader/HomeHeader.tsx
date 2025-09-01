import React from 'react';
import {View, Text} from 'react-native';
import type {HomeHeaderProps} from './types';

/**
 * HomeHeader
 *
 * Displays a personalized greeting to the user.
 * Uses NativeWind for styling.
 */
const HomeHeader: React.FC<HomeHeaderProps> = ({userName}) => {
  return (
    <View className="bg-primary p-6 rounded-b-3xl">
      <Text className="text-white text-xl font-bold mb-2">
        Hello, {userName || 'there'}!
      </Text>
      <Text className="text-white opacity-80">Let's track your expenses</Text>
    </View>
  );
};

export default HomeHeader;
