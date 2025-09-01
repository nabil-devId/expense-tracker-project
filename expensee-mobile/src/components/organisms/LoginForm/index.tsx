import React, {useState} from 'react';
import {StyleSheet, View, Alert} from 'react-native';
import {FormField} from '../../molecules/FormField';
import {Button} from '../../atoms/Button';
import {Text} from '../../atoms/Text';
import {TouchableOpacity} from 'react-native';
import {colors, spacing} from '@/theme';
import {VALIDATION} from '../../../constants';
import {useDispatch} from 'react-redux';
import {loginSuccess} from '../../../store/slices/authSlice';
import {authService} from '../../../api';

export interface LoginFormProps {
  /**
   * Function to navigate to the forgot password screen
   */
  onForgotPassword: () => void;
}

/**
 * LoginForm component for user authentication
 *
 * Handles email/password login form with validation and API integration
 *
 * Usage:
 * ```jsx
 * <LoginForm
 *   onForgotPassword={() => navigation.navigate('ForgotPassword')}
 * />
 * ```
 */
export const LoginForm: React.FC<LoginFormProps> = ({onForgotPassword}) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const validate = () => {
    const newErrors = {
      email: '',
      password: '',
    };
    let isValid = true;

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
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      setIsLoading(true);

      const response = await authService.login({
        username: email,
        password,
      });

      // Fetch user info
      const userInfo = await authService.getCurrentUser();

      dispatch(
        loginSuccess({
          user: userInfo,
          token: response.access_token,
          refreshToken: response.refresh_token || '',
        }),
      );
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage =
        error.response?.data?.detail?.message ||
        'Unable to login. Please try again.';

      Alert.alert('Login Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
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

      <View style={styles.passwordContainer}>
        <FormField
          label="Password"
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          required
        />

        {/* <TouchableOpacity
          style={styles.forgotPasswordLink}
          onPress={onForgotPassword}>
          <Text variant="bodySmall" color={colors.primary.main}>
            Forgot Password?
          </Text>
        </TouchableOpacity> */}
      </View>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        loading={isLoading}
        onPress={handleLogin}
        style={styles.loginButton}>
        Log In
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  passwordContainer: {
    marginBottom: spacing['6'],
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginTop: spacing['2'],
  },
  loginButton: {
    marginTop: spacing['4'],
  },
});
