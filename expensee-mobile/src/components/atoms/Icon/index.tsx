import React from 'react';
import {StyleProp, TextStyle} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // Added import
import {colors} from '@/theme';

export type IconSet = 'material' | 'ionicons' | 'feather' | 'fontAwesome' | 'material-community'; // Added 'material-community'

export interface IconProps {
  name: string;
  set?: IconSet;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

/**
 * Icon component that provides a unified interface to different icon libraries
 *
 * Usage:
 * ```jsx
 * <Icon name="home" size={24} color={colors.primary.main} />
 * <Icon name="ios-arrow-back" set="ionicons" />
 * ```
 */
export const Icon: React.FC<IconProps> = ({
  name,
  set = 'material',
  size = 24,
  color = colors.neutral.textDark,
  style,
}) => {
  switch (set) {
    case 'ionicons':
      return <Ionicons name={name} size={size} color={color} style={style} />;
    case 'fontAwesome':
      return (
        <FontAwesome name={name} size={size} color={color} style={style} />
      );
    case 'feather':
      return <Feather name={name} size={size} color={color} style={style} />;
    case 'material-community': // Added case for MaterialCommunityIcons
      return (
        <MaterialCommunityIcons name={name} size={size} color={color} style={style} />
      );
    case 'material':
    default:
      return (
        <MaterialIcons name={name} size={size} color={color} style={style} />
      );
  }
};
