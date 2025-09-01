import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native'; // Keep for no-token case
import { AuthLayout } from '../../components/organisms/AuthLayout';
import { ResetPasswordForm } from '../../components/organisms/ResetPasswordForm';
import { SignupLink } from '../../components/molecules/SignupLink';
import { ROUTES } from '../../constants';

/**
 * ResetPasswordScreen component for setting a new password.
 *
 * This screen handles the password reset process using a token
 * provided via route parameters. It uses AuthLayout and ResetPasswordForm.
 */
const ResetPasswordScreen = ({ navigation, route }: any) => {
  // The token should be passed as a route param
  const token = route.params?.token;

  if (!token) {
    // Display error if token is missing
    return (
      <View className="flex-1 justify-center items-center p-8 bg-light-background">
        <Text className="text-xl text-center text-light-textPrimary mb-4">
          Invalid or missing reset token.
        </Text>
        <Text className="text-light-textSecondary text-center mb-8">
          Please request a new password reset link.
        </Text>
        <TouchableOpacity
          className="bg-primary py-4 px-8 rounded-lg"
          onPress={() => navigation.navigate(ROUTES.AUTH.FORGOT_PASSWORD)}>
          <Text className="text-white font-bold">Request New Link</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render the form if token is present
  return (
    <AuthLayout
      title="Set New Password"
      logoSource={require('../../assets/images/logo_full.png')}
      footer={
        <SignupLink
          onPress={() => navigation.navigate(ROUTES.AUTH.LOGIN)}
          promptText=""
          linkText="Back to Log In"
        />
      }
    >
      <Text className="text-light-textSecondary text-center mb-6 px-4">
        Please enter and confirm your new password.
      </Text>
      <ResetPasswordForm
        token={token}
        onSuccess={() => navigation.navigate(ROUTES.AUTH.LOGIN)}
      />
    </AuthLayout>
  );
};

export default ResetPasswordScreen;
