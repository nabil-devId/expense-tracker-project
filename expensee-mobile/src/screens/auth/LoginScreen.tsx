import React from 'react';
import {StyleSheet} from 'react-native';
import {AuthLayout} from '../../components/organisms/AuthLayout';
import {LoginForm} from '../../components/organisms/LoginForm';
import {SignupLink} from '../../components/molecules/SignupLink';
import {ROUTES} from '../../constants';

/**
 * LoginScreen component for user authentication
 *
 * This screen uses the AuthLayout with LoginForm and SignupLink components
 * to provide a complete login experience.
 */
const LoginScreen = ({navigation}: any) => {
  return (
    <AuthLayout
      title="Welcome Back"
      logoSource={require('../../assets/images/logo_full.png')}
      footer={
        <SignupLink onPress={() => navigation.navigate(ROUTES.AUTH.REGISTER)} />
      }>
      <LoginForm
        onForgotPassword={() =>
          navigation.navigate(ROUTES.AUTH.FORGOT_PASSWORD)
        }
      />
    </AuthLayout>
  );
};

export default LoginScreen;
