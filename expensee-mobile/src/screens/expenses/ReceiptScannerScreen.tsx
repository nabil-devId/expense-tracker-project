import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {Camera} from 'react-native-camera';
import {
  scanReceiptStart,
  scanReceiptSuccess,
  scanReceiptFailure,
} from '../../store/slices/expenseSlice';
import {expenseService} from '../../api';
import {THEME, ROUTES} from '../../constants';
import {Button} from '../../components/atoms/Button';
import {Icon} from '../../components/atoms/Icon';

/**
 * ReceiptScannerScreen allows users to scan receipts and extract data
 * Implements the "Scan Receipt" flow from the user journey
 */
const ReceiptScannerScreen = ({navigation, route}: any) => {
  const dispatch = useDispatch();
  const cameraRef = useRef<Camera>(null);
  
  // Parameters from navigation
  const returnToEdit = route.params?.returnToEdit || false;
  const expenseId = route.params?.expenseId || null;
  
  // Component state
  const [isCameraReady, setCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);
  
  // Camera permission state
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  
  // Request camera permissions when component mounts
  useEffect(() => {
    requestCameraPermission();
  }, []);
  
  const requestCameraPermission = async () => {
    try {
      // In a real implementation, this would use the appropriate permission request API
      // For this example, we'll simulate permission being granted
      setHasCameraPermission(true);
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      setHasCameraPermission(false);
      Alert.alert(
        'Camera Permission Required',
        'Please grant camera permission to scan receipts.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    }
  };
  
  const handleCameraReady = () => {
    setCameraReady(true);
  };
  
  const takePicture = async () => {
    if (!cameraRef.current || isCapturing) return;
    
    try {
      setIsCapturing(true);
      
      // In a real implementation, this would capture an actual image
      // For this example, we'll simulate capturing an image
      // const options = { quality: 0.8, base64: true };
      // const data = await cameraRef.current.takePictureAsync(options);
      
      // Simulate camera capture delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate captured image (base64 string)
      const simulatedBase64Image = 'simulated_base64_image_data';
      setCapturedImage(simulatedBase64Image);
      
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };
  
  const processReceipt = async () => {
    if (!capturedImage) return;
    
    try {
      setIsProcessing(true);
      dispatch(scanReceiptStart());
      
      // In a real implementation, this would send the image to the API for processing
      // const response = await expenseService.scanReceipt(capturedImage);
      
      // Simulate API processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate extracted data from receipt
      const simulatedData = {
        merchant_name: 'Grocery Store',
        total_amount: '150000',
        transaction_date: '2025-05-28',
        items: [
          {
            name: 'Milk',
            quantity: 2,
            unit_price: '15000',
            total_price: '30000',
          },
          {
            name: 'Bread',
            quantity: 1,
            unit_price: '20000',
            total_price: '20000',
          },
          {
            name: 'Eggs',
            quantity: 1,
            unit_price: '35000',
            total_price: '35000',
          },
        ],
      };
      
      setExtractedData(simulatedData);
      dispatch(scanReceiptSuccess());
      
    } catch (error: any) {
      console.error('Error processing receipt:', error);
      const errorMessage = error.message || 'Failed to process receipt. Please try again.';
      dispatch(scanReceiptFailure(errorMessage));
      Alert.alert('Error', errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleRetake = () => {
    setCapturedImage(null);
    setExtractedData(null);
  };
  
  const handleConfirm = () => {
    if (!extractedData) return;
    
    // If we're returning to edit an existing expense
    if (returnToEdit && expenseId) {
      // In a real implementation, this would update the expense with the receipt data
      navigation.navigate(ROUTES.EXPENSES.EDIT, {
        id: expenseId,
        scannedData: {
          ...extractedData,
          receipt_image: capturedImage,
        },
      });
    } else {
      // Otherwise, navigate to create a new expense with the extracted data
      navigation.navigate(ROUTES.EXPENSES.CREATE, {
        scannedData: {
          ...extractedData,
          receipt_image: capturedImage,
        },
      });
    }
  };
  
  // Render loading state while checking camera permissions
  if (hasCameraPermission === null) {
    return (
      <View className="flex-1 justify-center items-center bg-light-background">
        <ActivityIndicator size="large" color={THEME.COLORS.PRIMARY} />
        <Text className="text-light-textSecondary mt-4">
          Checking camera permissions...
        </Text>
      </View>
    );
  }
  
  // Render permission denied state
  if (hasCameraPermission === false) {
    return (
      <View className="flex-1 justify-center items-center bg-light-background p-4">
        <Icon name="camera-off" size={64} color={THEME.COLORS.NEGATIVE} />
        <Text className="text-xl font-bold text-light-textPrimary mt-4 mb-2">
          Camera Access Denied
        </Text>
        <Text className="text-light-textSecondary text-center mb-6">
          Please grant camera permission to use the receipt scanner.
        </Text>
        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
          variant="primary"
        />
      </View>
    );
  }
  
  // Render camera preview if no image is captured yet
  if (!capturedImage) {
    return (
      <View className="flex-1">
        {/* In a real implementation, this would be a real Camera component */}
        <View className="flex-1 bg-black justify-center items-center">
          <Text className="text-white text-center px-8 mb-4">
            Position the receipt within the frame and ensure good lighting
          </Text>
          
          {/* Camera frame guide */}
          <View className="border-2 border-white w-4/5 h-2/3 rounded-lg opacity-70" />
        </View>
        
        {/* Camera controls */}
        <View className="bg-black py-6 px-4 flex-row justify-between items-center">
          <TouchableOpacity
            className="p-2"
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={28} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity
            className="bg-white rounded-full w-16 h-16 justify-center items-center"
            onPress={takePicture}
            disabled={isCapturing || !isCameraReady}>
            {isCapturing ? (
              <ActivityIndicator size="small" color={THEME.COLORS.PRIMARY} />
            ) : (
              <View className="bg-white rounded-full w-14 h-14 border-2 border-gray-300" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            className="p-2"
            onPress={() => {
              // In a real implementation, this would toggle flash
              Alert.alert('Flash', 'Flash toggle would be implemented here');
            }}>
            <Icon name="flash" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  // Render image review and extracted data
  return (
    <ScrollView className="flex-1 bg-light-background">
      <View className="p-4">
        <Text className="text-2xl font-bold text-light-textPrimary mb-4">
          Receipt Scan Results
        </Text>
        
        {/* Receipt image preview */}
        <View className="bg-gray-200 h-60 rounded-lg mb-4 justify-center items-center">
          <Text className="text-light-textSecondary">
            [Receipt Image Preview]
          </Text>
        </View>
        
        {isProcessing ? (
          <View className="items-center py-8">
            <ActivityIndicator size="large" color={THEME.COLORS.PRIMARY} />
            <Text className="text-light-textSecondary mt-4">
              Processing receipt...
            </Text>
          </View>
        ) : extractedData ? (
          <View className="mb-6">
            <Text className="text-xl font-bold text-light-textPrimary mb-2">
              Extracted Information
            </Text>
            
            <View className="bg-light-surface rounded-lg p-4 mb-4">
              <View className="flex-row justify-between mb-2">
                <Text className="text-light-textSecondary">Merchant</Text>
                <Text className="font-medium text-light-textPrimary">
                  {extractedData.merchant_name}
                </Text>
              </View>
              
              <View className="flex-row justify-between mb-2">
                <Text className="text-light-textSecondary">Total Amount</Text>
                <Text className="font-medium text-light-textPrimary">
                  Rp {extractedData.total_amount}
                </Text>
              </View>
              
              <View className="flex-row justify-between mb-2">
                <Text className="text-light-textSecondary">Date</Text>
                <Text className="font-medium text-light-textPrimary">
                  {extractedData.transaction_date}
                </Text>
              </View>
            </View>
            
            {extractedData.items && extractedData.items.length > 0 && (
              <View className="bg-light-surface rounded-lg p-4">
                <Text className="font-bold text-light-textPrimary mb-2">
                  Items
                </Text>
                
                {extractedData.items.map((item: any, index: number) => (
                  <View
                    key={index}
                    className="flex-row justify-between py-2 border-b border-gray-200">
                    <View className="flex-1">
                      <Text className="text-light-textPrimary">{item.name}</Text>
                      <Text className="text-light-textSecondary text-sm">
                        {item.quantity} x Rp {item.unit_price}
                      </Text>
                    </View>
                    <Text className="font-medium text-light-textPrimary">
                      Rp {item.total_price}
                    </Text>
                  </View>
                ))}
              </View>
            )}
            
            <View className="flex-row mt-6">
              <TouchableOpacity
                className="flex-1 bg-light-surface border border-primary py-3 rounded-lg items-center mr-2"
                onPress={handleRetake}>
                <Text className="font-medium text-primary">Retake</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className="flex-1 bg-primary py-3 rounded-lg items-center"
                onPress={handleConfirm}>
                <Text className="font-medium text-white">Use This Receipt</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="items-center py-4">
            <Button
              title="Process Receipt"
              onPress={processReceipt}
              variant="primary"
              isLoading={isProcessing}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ReceiptScannerScreen;
