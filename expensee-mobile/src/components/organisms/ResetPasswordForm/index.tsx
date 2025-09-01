import React, {useState} from 'react';
import {StyleSheet, View, Alert} from 'react-native';
import {FormField} from '../../molecules/FormField';
import {Button} from '../../atoms/Button';
import {spacing} from '../../../theme';
import {VALIDATION} from '../../../constants';
import {authService} from '../../../api';

export interface ResetPasswordFormProps {
  /**
   * The reset token received via email
   */
  token: string;
  /**
   * Function to call when password reset is successful
   */
  onSuccess: () => void;
}

/**
 * ResetPasswordForm component for resetting user password
 *
 * Handles new password validation and API integration
 *
 * Usage:
 * ```jsx
 * <ResetPasswordForm
 *   token={token}
 *   onSuccess={() => navigation.navigate('Login')}
 * />
 * ```
 */
export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  token,
  onSuccess,
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const validate = () => {
    const newErrors = {
      newPassword: '',
      confirmPassword: '',
    };
    let isValid = true;

    // New password validation
    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
      isValid = false;
    } else if (newPassword.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      newErrors.newPassword = `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`;
      isValid = false;
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleResetPassword = async () => {
    if (!validate()) return;

    try {
      setIsLoading(true);

      await authService.resetPassword({
        token,
        new_password: newPassword,
      });

      Alert.alert(
        'Success',
        'Your password has been reset successfully. Please log in with your new password.',
        [
          {
            text: 'OK',
            onPress: onSuccess,
          },
        ],
      );
    } catch (error: any) {
      console.error('Reset password error:', error);
      const errorMessage =
        error.response?.data?.detail ||
        'Password reset failed. The token may be invalid or expired.';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <FormField
        label="New Password"
        placeholder="Enter your new password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        error={errors.newPassword}
        helperText={`Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`}
        required
      />

      <FormField
        label="Confirm Password"
        placeholder="Confirm your new password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        error={errors.confirmPassword}
        required
        style={styles.lastField}
      />

      <Button
        variant="primary"
        size="lg"
        fullWidth
        loading={isLoading}
        onPress={handleResetPassword}
        style={styles.resetButton}>
        Reset Password
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  lastField: {
    marginBottom: spacing['6'],
  },
  resetButton: {
    marginTop: spacing['4'],
  },
});
