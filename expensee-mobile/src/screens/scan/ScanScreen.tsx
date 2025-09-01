import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraDevices,
  useCameraFormat,
} from 'react-native-vision-camera';
import {useDispatch} from 'react-redux';
import {launchImageLibrary} from 'react-native-image-picker';
import {receiptService} from '../../api';
import {
  startUpload,
  updateUploadProgress,
  uploadSuccess,
  uploadFailure,
} from '../../store/slices/receiptSlice';
import {API, ROUTES, THEME} from '../../constants';
import {useFocusEffect} from '@react-navigation/native';

const ScanScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  const camera = useRef<Camera>(null);
  const devices = useCameraDevice('back');
  const device = devices;
  const format = useCameraFormat(device, [
    {photoResolution: {width: 1280 / 2, height: 720 / 2}}, // Specify your desired resolution
  ]);

  const [hasPermission, setHasPermission] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [pollingId, setPollingId] = useState<NodeJS.Timeout | null>(null);
  const [currentOcrId, setCurrentOcrId] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      // Reset the all
      setCapturedImage(null);
      setIsUploading(false);
      setIsCapturing(false);
      setCurrentOcrId(null);
    }, []),
  );

  useEffect(() => {
    const checkPermission = async () => {
      const cameraPermission = await Camera.requestCameraPermission();

      setHasPermission(cameraPermission === 'granted');
    };

    checkPermission();

    // Cleanup polling interval when component unmounts
    return () => {
      if (pollingId) {
        clearInterval(pollingId);
      }
    };
  }, []);

  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  const capturePhoto = async () => {
    if (camera.current && isCameraReady) {
      try {
        setIsCapturing(true);

        const photo = await camera.current.takePhoto({
          flash: 'auto',
        });

        setCapturedImage(`file://${photo.path}`);
      } catch (error) {
        console.error('Error capturing photo:', error);
        Alert.alert('Error', 'Failed to capture photo. Please try again.');
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const selectFromGallery = async () => {
    const options = {
      mediaType: 'photo' as const,
      includeBase64: false,
      maxWidth: 1280,
      maxHeight: 720,
      quality: 0.2,
    };

    try {
      const result = await launchImageLibrary(options);

      if (result.didCancel) {
        return;
      }

      if (result.errorMessage) {
        Alert.alert('Error', result.errorMessage);
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        if (selectedAsset.uri) {
          setCapturedImage(selectedAsset.uri);
        }
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Failed to select image from gallery.');
    }
  };

  const uploadReceipt = async () => {
    if (!capturedImage) return;

    setIsUploading(true);
    dispatch(startUpload());

    try {
      // Create a file object from the captured image
      const formData = new FormData();
      formData.append('file', {
        uri: capturedImage,
        type: 'image/jpeg',
        name: 'receipt.jpg',
      });

      // Call the Gemini upload API endpoint using the receiptService
      const data = await receiptService.uploadReceipt(formData);

      // Extract OCR ID from response
      const ocrId = data.ocr_id;
      setCurrentOcrId(ocrId);
      dispatch(uploadSuccess({ocr_id: ocrId}));

      // Start polling for status
      startPollingStatus(ocrId);
    } catch (error) {
      console.error('Error uploading receipt:', error);
      dispatch(uploadFailure('Failed to upload receipt. Please try again.'));
      Alert.alert(
        'Upload Failed',
        'There was a problem uploading your receipt. Please try again.',
      );
      setIsUploading(false);
    }
  };

  const startPollingStatus = async (ocrId: string) => {
    // Poll the status endpoint every 2 seconds
    try {
      const data = await receiptService.getReceiptStatus(ocrId);
      console.log('Status response:', data);

      // If processing is complete, navigate to results screen
      if (data.status === 'processed') {
        setPollingId(null);
        setIsUploading(false);

        // Navigate to results screen with OCR ID
        navigation.navigate(ROUTES.SCAN.SCAN_RESULT, {
          ocrId: ocrId,
          image: capturedImage,
        });
      } else {
        setPollingId(null);
        setIsUploading(false);
        Alert.alert(
          'Error',
          'Failed to check processing status. Please try again.',
        );
      }
    } catch (error) {
      console.error('Error checking status:', error);
      setPollingId(null);
      setIsUploading(false);
      Alert.alert(
        'Error',
        'Failed to check processing status. Please try again.',
      );
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  // If we don't have permission yet
  if (!hasPermission) {
    return (
      <View className="flex-1 justify-center items-center bg-light-background">
        <Text className="text-light-textPrimary text-lg mb-4">
          Camera permission is required
        </Text>
        <TouchableOpacity
          className="bg-primary px-6 py-3 rounded-lg"
          onPress={async () => {
            const cameraPermission = await Camera.requestCameraPermission();
            setHasPermission(cameraPermission === 'granted');
          }}>
          <Text className="text-white font-bold">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // If camera is not ready yet
  if (!device) {
    return (
      <View className="flex-1 justify-center items-center bg-light-background">
        <ActivityIndicator size="large" color={THEME.COLORS.PRIMARY} />
        <Text className="text-light-textPrimary mt-4">Loading camera...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {capturedImage ? (
        // Preview captured image
        <View className="flex-1">
          <Image
            source={{uri: capturedImage}}
            className="flex-1"
            resizeMode="contain"
          />

          <View className="absolute bottom-0 left-0 right-0 flex-row justify-around p-6 bg-black bg-opacity-50">
            <TouchableOpacity
              className="bg-gray-700 p-4 rounded-full"
              onPress={retakePhoto}
              disabled={isUploading}>
              <Text className="text-white">Retake</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-functional-positive p-4 rounded-full"
              onPress={uploadReceipt}
              disabled={isUploading}>
              {isUploading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white">Upload</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Camera view
        <>
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            photo={true}
            onInitialized={onCameraReady}
            format={format}
          />

          <View className="absolute bottom-0 left-0 right-0 flex-row justify-between p-6">
            <TouchableOpacity
              className="bg-gray-700 p-4 rounded-full"
              onPress={selectFromGallery}
              disabled={isUploading}>
              <Text className="text-white">Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-white p-6 rounded-full"
              onPress={capturePhoto}
              disabled={!isCameraReady || isCapturing}>
              {isCapturing ? (
                <ActivityIndicator size="small" color={THEME.COLORS.PRIMARY} />
              ) : (
                <View className="h-6 w-6 bg-primary rounded-full" />
              )}
            </TouchableOpacity>

            {/* Placeholder to balance layout */}
            <View className="w-16"></View>
          </View>

          {/* Camera frame guidelines */}
          <View className="absolute inset-0 justify-center items-center">
            <View className="border-2 border-dashed border-white w-4/5 h-2/5 rounded-lg opacity-70" />
            <Text className="text-white mt-4 px-6 text-center">
              Position receipt within the frame and ensure it's well-lit
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

export default ScanScreen;
