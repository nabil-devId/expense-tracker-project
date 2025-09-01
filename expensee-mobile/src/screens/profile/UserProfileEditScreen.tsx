import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/store';
import {authService} from '@/api';
import {updateUser} from '@/store/slices/authSlice';
import ScreenLayout from '@/components/templates/ScreenLayout/ScreenLayout';

const UserProfileEditScreen = ({navigation}: {navigation: any}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const {user} = useSelector((state: RootState) => state.auth);
  const [fullName, setFullName] = useState(user?.full_name || '');

  const handleSaveChanges = async () => {
    if (!fullName.trim()) {
      Alert.alert('Validation Error', 'Please enter your full name.');
      return;
    }

    try {
      setLoading(true);
      const updatedUser = await authService.updateUserProfile({
        full_name: fullName,
      });
      dispatch(updateUser(updatedUser));
      Alert.alert('Success', 'Your profile has been updated.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenLayout>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#828282"
            value={fullName}
            onChangeText={setFullName}
          />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveChanges}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#000000',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#4ECDC4',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserProfileEditScreen;
