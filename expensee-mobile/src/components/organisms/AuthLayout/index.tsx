import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ImageSourcePropType,
} from 'react-native';
import {colors, spacing} from '@/theme';
import {Text} from '../../atoms/Text';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export interface AuthLayoutProps {
  /**
   * Title to display on the authentication screen
   */
  title?: string;
  /**
   * Logo image source
   */
  logoSource?: ImageSourcePropType;
  /**
   * Children components inside the auth layout
   */
  children: React.ReactNode;
  /**
   * Footer section to show additional actions (like signup link)
   */
  footer?: React.ReactNode;
}

/**
 * AuthLayout component for authentication screens
 *
 * Provides a consistent layout for login, register, and other auth screens
 * with a logo, title, content section, and optional footer.
 *
 * Usage:
 * ```jsx
 * <AuthLayout
 *   title="Welcome Back"
 *   logoSource={require('../../assets/images/logo_full.png')}
 *   footer={<SignupLink navigation={navigation} />}
 * >
 *   <LoginForm />
 * </AuthLayout>
 * ```
 */
export const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  logoSource,
  children,
  footer,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: insets.top + spacing['12'],
            paddingBottom: insets.bottom + spacing['8'],
          },
        ]}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="always">
        <View style={styles.contentContainer}>
          {logoSource && (
            <Image
              source={logoSource}
              resizeMode="contain"
              style={styles.logo}
            />
          )}

          {title && (
            <Text
              variant="h1"
              color={colors.primary.main}
              style={styles.title}
              center>
              {title}
            </Text>
          )}

          <View style={styles.formContainer}>{children}</View>

          {footer && <View style={styles.footer}>{footer}</View>}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: colors.neutral.background,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  contentContainer: {
    paddingHorizontal: spacing['6'],
    width: '100%',
  },
  logo: {
    alignSelf: 'center',
    height: 80,
    width: '100%',
    marginBottom: spacing['6'],
  },
  title: {
    marginBottom: spacing['8'],
  },
  formContainer: {
    width: '100%',
    marginBottom: spacing['8'],
  },
  footer: {
    marginTop: spacing['4'],
  },
});
