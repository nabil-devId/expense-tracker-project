import React from 'react';
import { AuthLayout } from '../../components/organisms/AuthLayout';
import { ForgotPasswordForm } from '../../components/organisms/ForgotPasswordForm';
import { SignupLink } from '../../components/molecules/SignupLink';
import { ROUTES } from '../../constants';

/**
 * ForgotPasswordScreen component for initiating password reset
 *
 * This screen uses AuthLayout with ForgotPasswordForm and SignupLink
 * to provide the password reset request functionality.
 */
const ForgotPasswordScreen = ({ navigation }: any) => {
  return (
    <AuthLayout
      title="Reset Password"
      logoSource={require('../../assets/images/logo_full.png')}
      // The description is handled by the ForgotPasswordForm component itself.
      // AuthLayout could be extended to take a description if needed for consistency.
      footer={
        <SignupLink
          onPress={() => navigation.navigate(ROUTES.AUTH.LOGIN)}
          promptText="" // No prompt needed, just the link
          linkText="Back to Log In"
        />
      }
    >
      <ForgotPasswordForm
        onSuccess={() => navigation.navigate(ROUTES.AUTH.LOGIN)}
      />
    </AuthLayout>
  );
};

export default ForgotPasswordScreen;
