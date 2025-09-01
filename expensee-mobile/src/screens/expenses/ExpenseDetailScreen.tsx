import React, {useEffect, useCallback} from 'react';
import {
  View,
  Image,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {expenseService} from '../../api';
import {
  fetchExpenseDetailStart,
  fetchExpenseDetailSuccess,
  fetchExpenseDetailFailure,
  ExpenseDetail, // Import ExpenseDetail type
} from '../../store/slices/expenseSlice';
import type {RootState, AppDispatch} from '../../store';
import ScreenLayout from '../../components/templates/ScreenLayout/ScreenLayout';
// ExpenseDetailHeader and DetailCard will be replaced by the new layout directly in renderContent
import {Text} from '../../components/atoms/Text';
import {Spinner} from '../../components/atoms/Spinner';
import {Icon} from '../../components/atoms/Icon'; // Assuming Icon atom exists
import {Button} from '../../components/atoms/Button'; // Assuming Button atom exists
import {colors, spacing, borderRadius, typography} from '../../theme'; // Assuming theme exists
import {THEME, ROUTES} from '../../constants';
import {useFocusEffect} from '@react-navigation/native';

// Define ParamList for type safety with navigation
type RootStackParamList = {
  ExpenseDetail: {id: string};
  // ... other routes
};

// Define props type for the screen
type ExpenseDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ExpenseDetail'
>;

const ExpenseDetailScreen: React.FC<ExpenseDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {id} = route.params;

  const {currentExpense, isLoading, error} = useSelector(
    (state: RootState) => state.expenses,
  );

  const fetchExpenseDetail = useCallback(async () => {
    dispatch(fetchExpenseDetailStart());
    try {
      const data = await expenseService.getExpenseById(id);
      dispatch(fetchExpenseDetailSuccess(data));
    } catch (err) {
      console.error('Error fetching expense detail:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load expense details.';
      dispatch(fetchExpenseDetailFailure(errorMessage));
    }
  }, [dispatch, id]);

  useFocusEffect(
    useCallback(() => {
      fetchExpenseDetail();
    }, [fetchExpenseDetail]),
  );

  useEffect(() => {
    if (currentExpense?.merchant_name) {
      navigation.setOptions({title: currentExpense.merchant_name});
    } else {
      navigation.setOptions({title: 'Expense Detail'});
    }
  }, [navigation, currentExpense?.merchant_name]);

  if (isLoading && !currentExpense) {
    return (
      <ScreenLayout scrollable={false} style={styles.centeredContainer}>
        <Spinner text="Loading expense details..." size="large" />
      </ScreenLayout>
    );
  }

  if (error && !currentExpense) {
    return (
      <ScreenLayout scrollable={false} style={styles.centeredContainer}>
        <Icon name="alert-circle-outline" size={60} color={colors.error.main} />
        <Text variant="h3" style={styles.errorTitle}>
          Error
        </Text>
        <Text variant="body" style={styles.errorMessage}>
          {error}
        </Text>
        <Button
          onPress={fetchExpenseDetail}
          variant="primary"
          style={styles.tryAgainButton}>
          Try Again
        </Button>
      </ScreenLayout>
    );
  }

  const formatDetailedDate = (dateString: string): string => {
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) {
      return 'N/A';
    }
    return dateObj
      .toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
      })
      .replace(' at', ',');
  };

  const formatDisplayAmount = (amountStr: string): string => {
    return parseFloat(amountStr).toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
    });
  };

  const renderContent = (expense: ExpenseDetail) => (
    <View style={styles.flexContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.amountText}>
          {formatDisplayAmount(expense.total_amount)}
        </Text>
        <Text style={styles.merchantNameTextHeader}>
          {expense.merchant_name}
        </Text>
        {expense.category?.icon && (
          <View style={styles.categoryIconCircle}>
            <Icon
              name={expense.category.icon}
              size={32}
              color={colors.primary.main}
              set="material-community"
            />
          </View>
        )}
      </View>

      <View style={styles.tagsContainer}>
        {expense.payment_method && (
          <View style={styles.tag}>
            <Icon
              name="credit-card-outline"
              size={16}
              color={colors.neutral.text}
              set="material-community"
              style={styles.tagIcon}
            />
            <Text style={styles.tagText}>{expense.payment_method}</Text>
          </View>
        )}
        {expense.category?.name && (
          <View style={styles.tag}>
            <Icon
              name={expense.category.icon || 'tag-outline'}
              size={16}
              color={colors.neutral.text}
              set="material-community"
              style={styles.tagIcon}
            />
            <Text style={styles.tagText}>{expense.category.name}</Text>
          </View>
        )}
      </View>

      {expense.receipt_image_url && (
        <View style={styles.receiptContainer_alt}>
          <Text style={styles.sectionTitle}>Receipt</Text>
          <Image
            source={{uri: expense.receipt_image_url}}
            style={styles.receiptImage}
            resizeMode="contain"
          />
        </View>
      )}

      <View style={styles.detailsSectionContainer}>
        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.detailItemRow}>
          <Text style={styles.detailLabel}>Payment Date</Text>
          <Text style={styles.detailValue}>
            {formatDetailedDate(expense.transaction_date)}
          </Text>
        </View>
        <View style={styles.detailItemRow}>
          <Text style={styles.detailLabel}>Merchant</Text>
          <Text style={styles.detailValue}>{expense.merchant_name}</Text>
        </View>
      </View>

      <View style={styles.detailsSectionContainer}>
        <Text style={styles.sectionTitle}>Detail Items</Text>
        {expense.items.map((item, index) => (
          <View className="flex-col" key={index}>
            <Text style={styles.detailValue}>{item.name}</Text>
            <Text style={styles.detailLabel}>
              {item.quantity}x {formatDisplayAmount(item.total_price)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderActionButtons = () => {
    return (
      <View className="flex-row justify-between px-4 py-3 bg-light-surface">
        <TouchableOpacity
          className="flex-1 bg-primary py-3 rounded-lg items-center mr-2"
          onPress={() => navigation.navigate(ROUTES.EXPENSES.EDIT, {id})}>
          <Text className="font-medium" style={{color: 'white'}}>
            Edit Expense
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 bg-red-500 py-3 rounded-lg items-center"
          onPress={handleDeleteExpense}>
          <Text className="font-medium" style={{color: 'white'}}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleDeleteExpense = () => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await expenseService.deleteExpense(id);
              Alert.alert('Success', 'Expense deleted successfully!', [
                {
                  text: 'OK',
                  onPress: () => navigation.navigate(ROUTES.EXPENSES.LIST),
                },
              ]);
            } catch (error) {
              console.error('Error deleting expense:', error);
              Alert.alert(
                'Error',
                'Failed to delete expense. Please try again.',
              );
            }
          },
        },
      ],
    );
  };

  return (
    <ScreenLayout
      scrollable={true}
      refreshControl={
        <RefreshControl
          refreshing={isLoading && !!currentExpense}
          onRefresh={fetchExpenseDetail}
        />
      }
      style={{marginTop: -35}}>
      {currentExpense ? renderContent(currentExpense) : null}
      {/* If there's an error but we have stale data, we might show a small error indicator here instead of full screen error */}
      {error && currentExpense && (
        <View style={styles.inlineErrorContainer}>
          <Text color={colors.error.main}>
            Error updating: {error}. Pull to refresh.
          </Text>
        </View>
      )}
      {currentExpense && renderActionButtons()}
    </ScreenLayout>
  );
};

// Styles for the new design
const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: '#FFF9E6', // Light yellow background from design
    paddingVertical: spacing['5'], // Approx 20px
    paddingHorizontal: spacing['4'],
    alignItems: 'center',
    borderBottomLeftRadius: 30, // For the curve
    borderBottomRightRadius: 30, // For the curve
    paddingBottom: spacing['8'], // Extra padding to push icon down for overlap effect
    marginBottom: -spacing['5'], // Negative margin to allow icon overlap
    zIndex: 1,
  },
  amountText: {
    fontSize: typography.fontSize['3xl'], // Corrected theme path
    fontWeight: 'bold',
    color: colors.neutral.textDark,
    marginBottom: spacing['1'],
  },
  merchantNameTextHeader: {
    fontSize: typography.fontSize.md, // Corrected theme path
    color: colors.neutral.text,
    marginBottom: spacing['4'], // Space before the icon circle appears
  },
  categoryIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.neutral.white,
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow for the circle (iOS)
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevation for the circle (Android)
    elevation: 5,
    position: 'relative', // Changed from absolute to allow content flow
    // bottom: -30, // This was to pull it down, now handled by paddingBottom and negative margin
  },
  tagsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: spacing['4'],
    paddingHorizontal: spacing['4'],
    backgroundColor: colors.neutral.white, // Background for the area below the curve
    zIndex: 0,
    paddingTop: spacing['8'], // Extra top padding because of header's negative margin and icon overlap
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.background, // Light grey for tag background
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['2'],
    borderRadius: borderRadius.lg, // Corrected theme path
    marginHorizontal: spacing['1'],
  },
  tagIcon: {
    marginRight: spacing['1'],
  },
  tagText: {
    fontSize: typography.fontSize.sm, // Corrected theme path
    color: colors.neutral.text,
  },
  receiptContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['4'],
    borderTopWidth: 1, // Separator line
    borderBottomWidth: 1,
    borderColor: colors.neutral.border,
    marginTop: spacing['2'], // Spacing from tags
  },
  receiptTextContainer: {
    flex: 1,
  },
  receiptTitle: {
    fontSize: typography.fontSize.md, // Corrected theme path
    fontWeight: 'bold',
    color: colors.neutral.textDark,
  },
  receiptSubtitle: {
    fontSize: typography.fontSize.sm, // Corrected theme path
    color: colors.neutral.textLight,
    marginTop: spacing['1'],
  },
  detailsSectionContainer: {
    backgroundColor: colors.neutral.white,
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['4'],
    marginTop: spacing['2'], // Spacing from receipt section
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl, // Corrected theme path
    fontWeight: 'bold',
    color: colors.neutral.textDark,
    marginBottom: spacing['3'],
  },
  detailItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing['2'],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
  },
  detailLabel: {
    fontSize: typography.fontSize.md, // Corrected theme path
    color: colors.neutral.textLight,
  },
  detailValue: {
    fontSize: typography.fontSize.md, // Corrected theme path
    color: colors.neutral.textDark,
    fontWeight: '500',
  },
  // Styles for error, loading states (merged into main styles object)
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['4'],
  },
  errorTitle: {
    fontSize: typography.fontSize.xl,
    color: colors.error.main,
    fontWeight: 'bold',
    marginTop: spacing['3'],
    marginBottom: spacing['2'],
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: typography.fontSize.md,
    color: colors.neutral.text,
    textAlign: 'center',
    marginBottom: spacing['4'],
  },
  tryAgainButton: {
    marginTop: spacing['2'],
    paddingHorizontal: spacing['5'], // Make button a bit wider
  },
  inlineErrorContainer: {
    backgroundColor: colors.error.light,
    padding: spacing['3'],
    marginHorizontal: spacing['4'],
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing['2'],
  },
  mainContentContainer: {
    padding: spacing['4'],
  },
  receiptContainer_alt: {
    // Style for when receipt image is shown
    backgroundColor: colors.neutral.white,
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['4'],
    marginTop: spacing['2'],
    alignItems: 'center', // Center the title and image
  },
  receiptImage: {
    width: '100%',
    height: 200,
    marginBottom: spacing['4'],
    borderRadius: borderRadius.md, // Added for consistency
  },
});

export default ExpenseDetailScreen;
