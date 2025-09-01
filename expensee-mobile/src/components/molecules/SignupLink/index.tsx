import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from '../../atoms/Text';
import {colors, spacing} from '@/theme';

export interface SignupLinkProps {
  /**
   * Function to call when the signup link is pressed
   */
  onPress: () => void;
  /**
   * Custom prompt text before the link (default: "Don't have an account?")
   */
  promptText?: string;
  /**
   * Custom link text (default: "Sign Up")
   */
  linkText?: string;
}

/**
 * SignupLink component that provides a link to the signup screen
 *
 * This component displays text with a link to navigate to the registration screen
 *
 * Usage:
 * ```jsx
 * <SignupLink onPress={() => navigation.navigate('Register')} />
 * ```
 */
export const SignupLink: React.FC<SignupLinkProps> = ({
  onPress,
  promptText = "Don't have an account?",
  linkText = 'Sign Up',
}) => {
  return (
    <View style={styles.container}>
      <Text
        variant="bodySmall"
        color={colors.neutral.textLight}
        style={styles.promptText}>
        {promptText}{' '}
      </Text>
      <TouchableOpacity onPress={onPress}>
        <Text variant="bodySmall" color={colors.primary.main} semibold>
          {linkText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing['2'],
  },
  promptText: {
    marginRight: spacing['1'],
  },
});
