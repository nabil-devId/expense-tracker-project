import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {colors, spacing} from '@/theme';
import {THEME} from '@/constants'; // Import THEME for colors
import {Text} from '../../atoms/Text';
import {Icon} from '../../atoms/Icon';
import {Badge} from '../../atoms/Badge';

export interface ListItemProps {
  /**
   * Name of the icon for the category (e.g., 'cart', 'car-side')
   */
  categoryIconName: string;
  /**
   * Background color for the category icon container
   * If not provided, a default will be used or it can be transparent.
   */
  categoryIconBackgroundColor?: string;
  /**
   * Color for the category icon itself.
   */
  categoryIconColor?: string;
  /**
   * Main title, typically the category name (e.g., "Grocery")
   */
  categoryName: string;
  /**
   * Subtitle, typically the merchant name (e.g., "Eataly downtown")
   */
  merchantName?: string;
  /**
   * Formatted amount string (e.g., "-$50.68")
   */
  amountText: string;
  /**
   * Formatted date string (e.g., "Aug 26")
   */
  dateText: string;
  /**
   * Function to call when list item is pressed
   */
  onPress?: () => void;
  /**
   * Whether to show a divider below the item (default: true)
   */
  divider?: boolean;
  /**
   * Custom styles for the container
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Whether the item is disabled
   */
  disabled?: boolean;
}

/**
 * ListItem component for displaying items in a list
 *
 * Usage:
 * ```jsx
 * <ListItem
 *   title="Groceries"
 *   subtitle="Weekly shopping"
 *   leftIcon={<Icon name="shopping-cart" set="feather" />}
 *   badgeText="$45.50"
 *   badgeVariant="info"
 *   onPress={handlePress}
 *   chevron
 * />
 * ```
 */
export const ListItem: React.FC<ListItemProps> = ({
  categoryIconName,
  categoryIconBackgroundColor = THEME.COLORS.LIGHT_BACKGROUND, // Use THEME.COLORS.LIGHT_BACKGROUND
  categoryIconColor = colors.primary.main, // This should be fine if colors.primary.main is defined in your theme
  categoryName,
  merchantName,
  amountText,
  dateText,
  onPress,
  divider = true,
  style,
  disabled = false,
}) => {
  const content = (
    <View style={[styles.container, divider && styles.divider, style]}>
      {/* Left Icon Area */}
      <View
        style={[
          styles.iconContainer,
          {backgroundColor: categoryIconBackgroundColor},
        ]}>
        <Icon
          name={categoryIconName}
          size={24}
          color={categoryIconColor}
          set="material-community"
        />
      </View>

      {/* Middle Text Area (Category & Merchant) */}
      <View style={styles.textContainer}>
        {merchantName && (
          <Text style={styles.merchantNameText} numberOfLines={1}>
            {merchantName}
          </Text>
        )}
        <Text style={styles.categoryNameText} numberOfLines={1}>
          {categoryName}
        </Text>
      </View>

      {/* Right Amount & Date Area */}
      <View style={styles.amountDateContainer}>
        <Text style={styles.amountText} numberOfLines={1}>
          {amountText}
        </Text>
        <Text style={styles.dateText} numberOfLines={1}>
          {dateText}
        </Text>
      </View>
    </View>
  );

  if (onPress && !disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        disabled={disabled}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing['3'], // Approx 12px
    paddingHorizontal: spacing['4'], // Approx 16px
    backgroundColor: colors.neutral.white, // White background for the item itself
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.neutral.border, // Light gray divider
  },
  iconContainer: {
    width: 40, // Fixed width for icon container
    height: 40, // Fixed height for icon container
    borderRadius: 20, // Make it a circle
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing['3'], // Approx 12px margin to the right
    // backgroundColor will be passed as a prop, default is neutral.surface
  },
  textContainer: {
    flex: 1, // Takes up available space between icon and amount/date
    justifyContent: 'center',
    marginRight: spacing['2'], // Approx 8px margin to the right (before amount/date)
  },
  merchantNameText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.neutral.textDark,
  },
  categoryNameText: {
    fontSize: 12,
    color: colors.neutral.textLight,
    marginTop: 2, // Small space between category and merchant
  },
  amountDateContainer: {
    alignItems: 'flex-end', // Align text to the right
  },
  amountText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.neutral.textDark, // Or a specific color for expense amounts
  },
  dateText: {
    fontSize: 12,
    color: colors.neutral.textLight,
    marginTop: 2, // Small space between amount and date
  },
});
