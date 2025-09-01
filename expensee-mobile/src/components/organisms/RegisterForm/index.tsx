import React, {useState} from 'react';
import {StyleSheet, View, Alert} from 'react-native';
import {FormField} from '../../molecules/FormField';
import {Button} from '../../atoms/Button';
import {Icon} from '../../atoms/Icon';
import {Text} from '../../atoms/Text';
import {spacing} from '../../../theme';
import {VALIDATION} from '../../../constants';
import {authService} from '../../../api';

export interface RegisterFormProps {
  /**
   * Function to call when registration is successful
   */
  onRegistrationSuccess: () => void;
}

/**
 * RegisterForm component for user registration
 *
 * Handles form with full name, email, password fields with validation and API integration
 *
 * Usage:
 * ```jsx
 * <RegisterForm
 *   onRegistrationSuccess={() => navigation.navigate('Login')}
 * />
 * ```
 */
export const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegistrationSuccess,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validate = () => {
    const newErrors = {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
    let isValid = true;

    // Full name validation
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!VALIDATION.EMAIL_REGEX.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      newErrors.password = `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`;
      isValid = false;
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      setIsLoading(true);

      await authService.register({
        email,
        password,
        full_name: fullName,
      });

      Alert.alert(
        'Registration Successful',
        'Your account has been created successfully. Please log in.',
        [
          {
            text: 'OK',
            onPress: onRegistrationSuccess,
          },
        ],
      );
    } catch (error: any) {
      console.error(
        'Registration error:',
        error.response?.data.detail?.[0]?.msg,
      );
      const errorMessage =
        error.response?.data?.detail?.[0]?.msg ||
        error.response?.data?.detail ||
        'Registration failed. Please try again.';
      Alert.alert(
        'Registration Failed',
        'A user with this email already exists',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <FormField
        label="Full Name"
        placeholder="Enter your full name"
        value={fullName}
        onChangeText={setFullName}
        error={errors.fullName}
        required
      />

      <FormField
        label="Email"
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        error={errors.email}
        required
      />

      <FormField
        label="Password"
        placeholder="Enter your password"
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        helperText={`Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`}
        required
        rightIcon={
          <Icon
            name={showPassword ? 'eye-off' : 'eye'}
            set="feather"
            size={20}
            color="#888"
          />
        }
        onRightIconPress={() => setShowPassword(prev => !prev)}
      />

      <FormField
        label="Confirm Password"
        placeholder="Confirm your password"
        secureTextEntry={!showConfirmPassword}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        error={errors.confirmPassword}
        required
        style={styles.lastField}
        rightIcon={
          <Icon
            name={showConfirmPassword ? 'eye-off' : 'eye'}
            set="feather"
            size={20}
            color="#888"
          />
        }
        onRightIconPress={() => setShowConfirmPassword(prev => !prev)}
      />

      <Button
        variant="primary"
        size="lg"
        fullWidth
        loading={isLoading}
        onPress={handleRegister}
        style={styles.registerButton}>
        Create Account
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
  registerButton: {
    marginTop: spacing['4'],
  },
});
