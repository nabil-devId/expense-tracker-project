import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import {RootState} from '../store';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import SplashScreen from '../screens/SplashScreen';

const Stack = createNativeStackNavigator();

// Define the app states
enum AppState {
  LOADING = 'LOADING',
  AUTHENTICATED = 'AUTHENTICATED',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
}

const RootNavigator = () => {
  const {isAuthenticated, isLoading, initialCheckDone} = useSelector(
    (state: RootState) => state.auth,
  );
  const [appState, setAppState] = useState<AppState>(AppState.LOADING);

  // Handle app state transition based on auth state
  useEffect(() => {
    // Determine app state based on auth state
    if (isLoading || !initialCheckDone) {
      // Still loading or initial check not done, stay in loading state
      setAppState(AppState.LOADING);
    } else {
      // Auth check is complete, navigate based on auth status
      setAppState(
        isAuthenticated ? AppState.AUTHENTICATED : AppState.UNAUTHENTICATED,
      );
    }

    // Safety timeout to ensure we never get stuck on the splash screen
    const safetyTimeout = setTimeout(() => {
      if (appState === AppState.LOADING) {
        console.log(
          'Safety timeout fired - forcing navigation from splash screen',
        );
        setAppState(
          isAuthenticated ? AppState.AUTHENTICATED : AppState.UNAUTHENTICATED,
        );
      }
    }, 5000);

    return () => {
      clearTimeout(safetyTimeout);
    };
  }, [isAuthenticated, isLoading, initialCheckDone, appState]);

  // For logging purposes
  useEffect(() => {
    console.log('App State:', {
      appState,
      isLoading,
      initialCheckDone,
      isAuthenticated,
    });
  }, [appState, isLoading, initialCheckDone, isAuthenticated]);

  // Render different navigators based on app state
  const renderNavigator = (): React.ReactNode => {
    switch (appState) {
      case AppState.LOADING:
        return <Stack.Screen name="Splash" component={SplashScreen} />;
      case AppState.AUTHENTICATED:
        return <Stack.Screen name="Main" component={MainNavigator} />;
      case AppState.UNAUTHENTICATED:
        return <Stack.Screen name="Auth" component={AuthNavigator} />;
      default:
        return <Stack.Screen name="Auth" component={AuthNavigator} />;
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator id={undefined} screenOptions={{headerShown: false}}>
        {renderNavigator()}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
