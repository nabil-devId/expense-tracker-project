import React from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {colors, spacing, borderRadius} from '@/theme';
import {Text} from '../../atoms/Text';
import {Icon} from '../../atoms/Icon';
import {Badge} from '../../atoms/Badge';

export interface FilterOption {
  id: string;
  label: string;
  icon?: string;
  iconSet?: 'material' | 'ionicons' | 'feather' | 'fontAwesome';
  badge?: number;
}

export interface FilterBarProps {
  /**
   * Title for the filter section
   */
  title?: string;
  /**
   * Array of filter options
   */
  options: FilterOption[];
  /**
   * Currently selected option ID
   */
  selectedId?: string;
  /**
   * Function to call when a filter is selected
   */
  onSelect: (id: string) => void;
  /**
   * Function to call when the filter button is pressed
   */
  onFilterPress?: () => void;
  /**
   * Whether to show the filter button
   */
  showFilterButton?: boolean;
  /**
   * Number of active filters (to show badge on filter button)
   */
  activeFilterCount?: number;
}

/**
 * FilterBar component for filtering lists of data
 *
 * Usage:
 * ```jsx
 * const [filter, setFilter] = useState('all');
 * const filterOptions = [
 *   { id: 'all', label: 'All' },
 *   { id: 'food', label: 'Food', icon: 'restaurant' },
 *   { id: 'transport', label: 'Transport', icon: 'car', iconSet: 'fontAwesome' }
 * ];
 *
 * <FilterBar
 *   options={filterOptions}
 *   selectedId={filter}
 *   onSelect={setFilter}
 *   onFilterPress={openFilterModal}
 *   activeFilterCount={2}
 * />
 * ```
 */
export const FilterBar: React.FC<FilterBarProps> = ({
  title,
  options,
  selectedId,
  onSelect,
  onFilterPress,
  showFilterButton = true,
  activeFilterCount = 0,
}) => {
  return (
    <View style={styles.container}>
      {title && (
        <Text variant="h4" style={styles.title}>
          {title}
        </Text>
      )}

      <View style={styles.filterBarContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScrollContent}>
          {options.map(option => {
            const isSelected = option.id === selectedId;

            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.filterOption,
                  isSelected && styles.selectedOption,
                ]}
                onPress={() => onSelect(option.id)}
                activeOpacity={0.7}>
                {option.icon && (
                  <Icon
                    name={option.icon}
                    set={option.iconSet || 'material'}
                    size={16}
                    color={
                      isSelected
                        ? colors.neutral.white
                        : colors.neutral.textDark
                    }
                    style={styles.optionIcon}
                  />
                )}
                <Text
                  variant="bodySmall"
                  color={
                    isSelected ? colors.neutral.white : colors.neutral.textDark
                  }>
                  {option.label}
                </Text>
                {option.badge !== undefined && option.badge > 0 && (
                  <Badge
                    text={option.badge > 99 ? '99+' : option.badge.toString()}
                    variant={isSelected ? 'secondary' : 'primary'}
                    style={styles.badge}
                    pill
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {showFilterButton && onFilterPress && (
          <TouchableOpacity
            style={styles.filterButton}
            onPress={onFilterPress}
            activeOpacity={0.7}>
            <Icon
              name="filter-list"
              size={20}
              color={colors.neutral.textDark}
            />
            {activeFilterCount > 0 && (
              <Badge
                text={activeFilterCount.toString()}
                variant="error"
                style={styles.filterBadge}
                pill
              />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing['3'],
  },
  title: {
    marginBottom: spacing['2'],
  },
  filterBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filtersScrollContent: {
    paddingRight: spacing['4'],
    paddingVertical: spacing['1'],
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['2'],
    borderRadius: borderRadius.full,
    backgroundColor: colors.neutral.backgroundAlt,
    marginRight: spacing['2'],
  },
  selectedOption: {
    backgroundColor: colors.primary.main,
  },
  optionIcon: {
    marginRight: spacing['1'],
  },
  badge: {
    marginLeft: spacing['1'],
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.neutral.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
  },
});
