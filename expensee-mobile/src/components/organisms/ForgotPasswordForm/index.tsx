import React, {useState} from 'react';
import {StyleSheet, View, Alert} from 'react-native';
import {FormField} from '../../molecules/FormField';
import {Button} from '../../atoms/Button';
import {Text} from '../../atoms/Text';
import {spacing, colors} from '../../../theme';
import {VALIDATION} from '../../../constants';
import {authService} from '../../../api';

export interface ForgotPasswordFormProps {
  /**
   * Function to call when forgot password request is successful
   */
  onSuccess: () => void;
  /**
   * Optional custom form description
   */
  description?: string;
}

/**
 * ForgotPasswordForm component for password reset requests
 *
 * Handles email validation and API integration for password reset
 *
 * Usage:
 * ```jsx
 * <ForgotPasswordForm
 *   onSuccess={() => navigation.navigate('Login')}
 *   description="Enter your email and we'll send you a link to reset your password"
 * />
 * ```
 */
export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSuccess,
  description = "Enter your email address and we'll send you a link to reset your password.",
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validate = () => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }

    if (!VALIDATION.EMAIL_REGEX.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }

    setEmailError('');
    return true;
  };

  const handleForgotPassword = async () => {
    if (!validate()) return;

    try {
      setIsLoading(true);

      await authService.forgotPassword({email});

      // For security reasons, we always show a success message even if the email doesn't exist
      Alert.alert(
        'Password Reset Email Sent',
        'If an account exists with this email, you will receive a password reset link.',
        [
          {
            text: 'OK',
            onPress: onSuccess,
          },
        ],
      );
    } catch (error: any) {
      console.error('Forgot password error:', error);

      // For security reasons, we don't reveal if an email exists or not
      Alert.alert(
        'Password Reset Email Sent',
        'If an account exists with this email, you will receive a password reset link.',
        [
          {
            text: 'OK',
            onPress: onSuccess,
          },
        ],
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {description && (
        <Text
          variant="body"
          color={colors.neutral.textLight}
          style={styles.description}
          center>
          {description}
        </Text>
      )}

      <FormField
        label="Email"
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        error={emailError}
        required
      />

      <Button
        variant="primary"
        size="lg"
        fullWidth
        loading={isLoading}
        onPress={handleForgotPassword}
        style={styles.submitButton}>
        Send Reset Link
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  description: {
    marginBottom: spacing['6'],
  },
  submitButton: {
    marginTop: spacing['6'],
  },
});
