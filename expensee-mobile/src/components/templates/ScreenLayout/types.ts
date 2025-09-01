import type { ReactNode, ReactElement } from 'react';
import type { ViewStyle, RefreshControlProps, ScrollViewProps } from 'react-native';

export interface ScreenLayoutProps {
  children: ReactNode;
  scrollable?: boolean; // If true, content will be wrapped in a ScrollView
  style?: ViewStyle; // Custom styles for the main content container (View or ScrollView)
  contentContainerStyle?: ViewStyle; // Custom styles for the ScrollView's inner content container
  refreshControl?: ReactElement<RefreshControlProps>; // For pull-to-refresh functionality in ScrollView
  keyboardShouldPersistTaps?: ScrollViewProps['keyboardShouldPersistTaps']; // Controls when keyboard should dismiss
}
