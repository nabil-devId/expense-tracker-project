import React from 'react';
import {StyleSheet} from 'react-native';
import {AuthLayout} from '../../components/organisms/AuthLayout';
import {RegisterForm} from '../../components/organisms/RegisterForm';
import {SignupLink} from '../../components/molecules/SignupLink';
import {ROUTES} from '../../constants';

/**
 * RegisterScreen component for user registration
 *
 * Uses AuthLayout and RegisterForm components for a consistent UX
 */
const RegisterScreen = ({navigation}: any) => {
  return (
    <AuthLayout
      title="Create Account"
      logoSource={require('../../assets/images/logo_full.png')}
      footer={
        <SignupLink
          onPress={() => navigation.navigate(ROUTES.AUTH.LOGIN)}
          promptText="Already have an account?"
          linkText="Log In"
        />
      }>
      <RegisterForm
        onRegistrationSuccess={() => navigation.navigate(ROUTES.AUTH.LOGIN)}
      />
    </AuthLayout>
  );
};

// No styles needed as we're using the AuthLayout component

export default RegisterScreen;
