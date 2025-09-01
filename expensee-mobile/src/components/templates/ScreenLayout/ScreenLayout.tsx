import React from 'react';
import {View, ScrollView, StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {ScreenLayoutProps} from './types';
import {THEME} from '../../../constants'; // For StatusBar and default background color reference

/**
 * ScreenLayout
 *
 * A template component providing a consistent layout structure for screens.
 * It handles SafeArea, background color, StatusBar, and optionally wraps content in a ScrollView.
 *
 * Props:
 * - children: The content to be rendered within the layout.
 * - scrollable: If true, children are wrapped in a ScrollView. Defaults to false.
 * - style: Custom styles for the main content container (View or ScrollView).
 * - contentContainerStyle: Custom styles for the ScrollView's inner content container.
 * - refreshControl: ReactElement for pull-to-refresh in ScrollView.
 * - keyboardShouldPersistTaps: Behavior of keyboard taps in ScrollView.
 */
const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  children,
  scrollable = false,
  style,
  contentContainerStyle,
  refreshControl,
  keyboardShouldPersistTaps = 'handled',
}) => {
  const ContainerComponent = scrollable ? ScrollView : View;
  const commonContainerClasses = 'flex-1'; // Ensures the container takes up available space

  // Props for the container (ScrollView or View)
  const containerProps: any = scrollable
    ? {
        contentContainerStyle: [{flexGrow: 1}, contentContainerStyle], // flexGrow ensures ScrollView content can expand
        refreshControl: refreshControl,
        keyboardShouldPersistTaps: keyboardShouldPersistTaps,
        className: commonContainerClasses,
        showsVerticalScrollIndicator: false,
      }
    : {
        className: commonContainerClasses,
      };

  return (
    <SafeAreaView
      className="flex-1 bg-white" // NativeWind class for flex and background
    >
      <StatusBar
        // Use theme constants for status bar style and background color consistency
        barStyle={(THEME as any).STATUS_BAR_STYLE_LIGHT || 'dark-content'} // Default to 'dark-content' if not defined
        backgroundColor={THEME.COLORS.LIGHT_BACKGROUND} // Use defined LIGHT_BACKGROUND
      />
      <ContainerComponent {...containerProps} style={style}>
        {children}
      </ContainerComponent>
    </SafeAreaView>
  );
};

export default ScreenLayout;
