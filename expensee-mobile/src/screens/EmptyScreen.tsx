import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenLayout } from '../components/templates/ScreenLayout';

interface EmptyScreenProps {
  // Add any props here
}

const EmptyScreen: React.FC<EmptyScreenProps> = () => {
  return (
    <ScreenLayout>
      <View style={styles.container}>
        <Text style={styles.text}>Screen content goes here</Text>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
  },
});

export default EmptyScreen;