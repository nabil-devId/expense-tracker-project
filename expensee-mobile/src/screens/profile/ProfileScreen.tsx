import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import React from 'react';
import ScreenLayout from '@/components/templates/ScreenLayout/ScreenLayout';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/store';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '@/constants';
import {authService} from '@/api';
import {logout} from '@/store/slices/authSlice';

// Define a type for list items for better organization
type ListItemProps = {
  icon: string;
  label: string;
  onPress?: () => void;
  value?: string | number;
  isUser?: boolean;
  email?: string;
  iconColor?: string;
};

// Reusable ListItem component
const ListItem: React.FC<ListItemProps> = ({
  icon,
  label,
  onPress,
  value,
  isUser,
  email,
  iconColor = '#4CAF50' /* Default Green */,
}) => (
  <TouchableOpacity
    style={styles.listItemContainer}
    onPress={onPress}
    disabled={!onPress}>
    <View style={styles.listItemContent}>
      <MaterialCommunityIcons
        name={icon}
        size={24}
        color={iconColor}
        style={styles.icon}
      />
      {isUser ? (
        <View style={styles.userInfoTextContainer}>
          <Text style={styles.listItemLabel}>{label}</Text>
          {email && <Text style={styles.listItemEmail}>{email}</Text>}
        </View>
      ) : (
        <Text style={styles.listItemLabel}>{label}</Text>
      )}
    </View>
    {/* <View style={styles.listItemRightAccessory}>
      {value && <Text style={styles.listItemValue}>{value}</Text>}
      {onPress && (
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color="#C7C7CC"
        />
      )}
    </View> */}
  </TouchableOpacity>
);

const ProfileScreen = () => {
  // Placeholder function for adding a category

  const {user} = useSelector((state: RootState) => state.auth);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleAddCategory = () => {
    navigation.navigate(ROUTES.PROFILE.CATEGORIES as never);
  };

  const onHandleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  // Placeholder function for logging out
  const handleLogout = () => {
    console.log('Logout pressed');
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Logout',
        onPress: onHandleLogout,
      },
    ]);
  };

  // Placeholder for other navigation actions
  const handleGenericNavigation = (screenName: string) => {
    navigation.navigate(screenName as never);
  };

  return (
    <ScreenLayout scrollable={false}>
      {/* Custom header for 'More' title to match design */}
      {/* <View style={styles.customHeader}>
        <Text style={styles.customHeaderText}>More</Text>
      </View> */}
      <ScrollView style={styles.container}>
        {/* Account Section */}
        <Text style={styles.sectionTitle}>Account</Text>
        <ListItem
          icon="account-circle-outline"
          label={user?.full_name || '-'}
          email={user?.email}
          isUser
          onPress={() =>
            handleGenericNavigation(ROUTES.PROFILE.USER_PROFILE_EDIT)
          }
          iconColor="#FF5722" // Example: Orange for user avatar
        />
        <ListItem
          icon="chart-line"
          label="Analytics!"
          onPress={() => handleGenericNavigation(ROUTES.PROFILE.ANALYTICS)}
        />
        <ListItem
          icon="shape-outline"
          label="Categories"
          value="25"
          onPress={handleAddCategory}
        />
        {/* <ListItem icon="tag-outline" label="Labels" value="5" onPress={() => handleGenericNavigation('Labels')} />
        <ListItem icon="calendar-clock-outline" label="Scheduled Transactions" onPress={() => handleGenericNavigation('Scheduled Transactions')} />
        <ListItem icon="currency-usd" label="Main Currency" value="USD" onPress={() => handleGenericNavigation('Main Currency')} />
        <ListItem icon="wallet-outline" label="Manual Wallets" onPress={() => handleGenericNavigation('Manual Wallets')} />
        <ListItem icon="credit-card-outline" label="Bank Accounts & E-Wallets" onPress={() => handleGenericNavigation('Bank Accounts')} />
        <ListItem icon="bitcoin" label="Crypto Wallets" onPress={() => handleGenericNavigation('Crypto Wallets')} /> */}

        {/* Other Section */}
        <Text style={styles.sectionTitle}>Other</Text>
        {/* <ListItem
          icon="wrench-outline"
          label="Advanced"
          onPress={() => handleGenericNavigation('Advanced Settings')}
        />
        <ListItem
          icon="help-circle-outline"
          label="Help Center"
          onPress={() => handleGenericNavigation('Help Center')}
        /> */}
        <ListItem
          icon="logout"
          label="Logout"
          onPress={handleLogout}
          iconColor="#F44336" /* Red for logout icon */
        />
      </ScrollView>
    </ScreenLayout>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#000000', // Dark background as per design
  },
  customHeader: {
    backgroundColor: '#1C1C1E', // Slightly lighter dark shade for header bar
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center', // Center title 'More'
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C', // Subtle separator
  },
  customHeaderText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000', // Muted color for section titles
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
    textTransform: 'uppercase',
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    // backgroundColor: '#1C1C1E', // Dark item background
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#3A3A3C', // Separator for items
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 16,
  },
  userInfoTextContainer: {
    flexDirection: 'column',
  },
  listItemLabel: {
    fontSize: 17,
    color: '#000', // White text for labels
  },
  listItemEmail: {
    fontSize: 13,
    color: '#000', // Muted color for email
  },
  listItemRightAccessory: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemValue: {
    fontSize: 17,
    color: '#000', // Muted color for values like count/currency
    marginRight: 8,
  },
  // Removed previous button styles as they are replaced by list items
});
