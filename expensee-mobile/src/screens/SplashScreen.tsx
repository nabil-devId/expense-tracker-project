import React, { useEffect } from 'react';
import { View, Image, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, THEME } from '../constants'; // THEME is used for ActivityIndicator color
import { loginSuccess, authCheckComplete } from '../store/slices/authSlice';

/**
 * SplashScreen
 *
 * Displays the app logo and an activity indicator while checking
 * the user's authentication status from AsyncStorage.
 * Navigates based on whether credentials are found.
 */
const SplashScreen = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        const userInfo = await AsyncStorage.getItem(STORAGE_KEYS.USER_INFO);

        if (token && refreshToken && userInfo) {
          console.log('Splash: Found existing credentials, logging in');
          dispatch(
            loginSuccess({
              user: JSON.parse(userInfo),
              token,
              refreshToken,
            }),
          );
        } else {
          console.log('Splash: No credentials found, navigating to auth flow');
          dispatch(authCheckComplete({ isAuthenticated: false }));
        }
      } catch (error) {
        console.error('Error during splash screen initialization:', error);
        // Ensure navigation proceeds even if there's an error
        dispatch(authCheckComplete({ isAuthenticated: false }));
      }
    };

    // Optional: Add a small delay so splash screen is visible for a moment
    // This improves perceived performance and avoids a jarring flash.
    const timer = setTimeout(() => {
      checkLoginStatus();
    }, 500); // 0.5 second delay, adjust as needed

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, [dispatch]);

  return (
    <View className="flex-1 items-center justify-center bg-light-background">
      <Image
        source={require('../assets/images/logo_full.png')}
        // Inline styles for simplicity, can be moved to StyleSheet or NativeWind if preferred
        style={{
          width: 250, // Adjust width as needed
          height: 100, // Adjust height as needed
          resizeMode: 'contain',
          marginBottom: 40, // Space between logo and activity indicator
        }}
      />
      <ActivityIndicator size="large" color={THEME.COLORS.PRIMARY} />
    </View>
  );
};

export default SplashScreen;
