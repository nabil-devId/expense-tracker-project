import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '../../atoms/Text';
import {colors, spacing, borderRadius, typography} from '../../../theme';

interface DetailRow {
  label: string;
  value: React.ReactNode | string | null | undefined;
}

interface DetailCardProps {
  title?: string;
  details: DetailRow[];
  style?: object; // For custom styling of the card container
}

export const DetailCard: React.FC<DetailCardProps> = ({title, details, style}) => {
  // Filter out details that have no value to display
  const validDetails = details.filter(detail => {
    if (typeof detail.value === 'string') {
      return detail.value.trim() !== '';
    }
    return detail.value !== null && typeof detail.value !== 'undefined';
  });

  // If there are no valid details to show and no title, don't render the card
  if (validDetails.length === 0 && !title) {
    return null;
  }

  return (
    <View style={[styles.card, style]}>
      {title && <Text variant="h3" style={styles.cardTitle}>{title}</Text>}
      {validDetails.map((item, index) => (
        <View
          key={item.label}
          style={[
            styles.infoRow,
            // Apply 'infoRowLast' style if it's the last item in the filtered list
            index === validDetails.length - 1 && styles.infoRowLast,
          ]}>
          <Text variant="body" medium style={styles.label}>
            {item.label}
          </Text>
          <Text variant="body" style={styles.value}>
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.neutral.backgroundAlt,
    borderRadius: borderRadius.lg,
    padding: spacing['4'],
    marginBottom: spacing['4'],
    shadowColor: '#000', // iOS shadow
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2, // Android shadow (increased slightly for better visibility)
  },
  cardTitle: {
    marginBottom: spacing['3'],
    color: colors.neutral.textDark,
    // fontWeight is handled by the Text atom's variant="h3"
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing['3'],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
  },
  infoRowLast: {
    borderBottomWidth: 0, // No border for the last item
  },
  label: {
    color: colors.neutral.textLight,
    flex: 1, 
    marginRight: spacing['2'],
  },
  value: {
    color: colors.neutral.textDark,
    flexShrink: 1, 
    textAlign: 'right',
  },
});

export default DetailCard;
