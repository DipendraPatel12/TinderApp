import { Alert, Platform, PermissionsAndroid } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const DEFAULT_OPTIONS = {
  mediaType: 'photo',
  saveToPhotos: false,
  includeBase64: false,
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 0.8,
};

const formatAsset = (asset) => {
  if (!asset?.uri) return null;
  return {
    uri: asset.uri,
    type: asset.type || 'image/jpeg',
    name: asset.fileName || `photo_${Date.now()}.jpg`,
    fileSize: asset.fileSize || 0,
    width: asset.width || 0,
    height: asset.height || 0,
  };
};

// Request Android camera runtime permission
const requestCameraPermission = async () => {
  if (Platform.OS !== 'android') return true;

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'This app needs access to your camera to take a profile photo.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.log('Camera permission error:', err);
    return false;
  }
};

// Request Android gallery runtime permission (Android 12 and below)
const requestGalleryPermission = async () => {
  if (Platform.OS !== 'android') return true;
  if (Platform.Version >= 33) return true;

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Gallery Permission',
        message: 'This app needs access to your photos to choose a profile photo.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    return true;
  }
};

let isPickerActive = false;

export const openGallery = async (customOptions = {}) => {
  if (isPickerActive) return null;
  isPickerActive = true;
  try {
    await requestGalleryPermission();
    const result = await launchImageLibrary({ ...DEFAULT_OPTIONS, ...customOptions });
    if (result.didCancel) return null;
    if (result.errorCode) {
      if (result.errorCode === 'permission') {
        Alert.alert(
          'Permission Denied',
          'Storage permission is required to choose photos. Please enable it in app settings.'
        );
        return null;
      }
      throw new Error(result.errorMessage || 'Failed to select image from gallery');
    }
    return formatAsset(result.assets?.[0]);
  } catch (error) {
    console.log('Error opening gallery:', error.message || error);
    throw error;
  } finally {
    setTimeout(() => {
      isPickerActive = false;
    }, 500);
  }
};

export const openCamera = async (customOptions = {}) => {
  if (isPickerActive) return null;
  isPickerActive = true;
  try {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Camera permission is required to take photos. Please grant permission in app settings.'
      );
      return null;
    }

    const result = await launchCamera({ ...DEFAULT_OPTIONS, ...customOptions });
    if (result.didCancel) return null;
    if (result.errorCode) {
      if (result.errorCode === 'permission') {
        Alert.alert(
          'Permission Denied',
          'Camera permission is required to take photos. Please grant permission in app settings.'
        );
        return null;
      }
      if (result.errorCode === 'camera_unavailable') {
        Alert.alert('Camera Unavailable', 'No camera hardware found on this device.');
        return null;
      }
      throw new Error(result.errorMessage || 'Failed to capture photo with camera');
    }
    return formatAsset(result.assets?.[0]);
  } catch (error) {
    console.log('Error opening camera:', error.message || error);
    throw error;
  } finally {
    setTimeout(() => {
      isPickerActive = false;
    }, 500);
  }
};

export const promptImagePicker = ({
  title = 'Select Photo',
  message = 'Choose an option to upload your photo',
  onImageSelected,
  onError,
  options = {},
}) => {
  Alert.alert(title, message, [
    {
      text: 'Take Photo',
      onPress: async () => {
        try {
          const image = await openCamera(options);
          if (image && onImageSelected) {
            onImageSelected(image);
          }
        } catch (err) {
          if (onError) onError(err);
        }
      },
    },
    {
      text: 'Choose from Gallery',
      onPress: async () => {
        try {
          const image = await openGallery(options);
          if (image && onImageSelected) {
            onImageSelected(image);
          }
        } catch (err) {
          if (onError) onError(err);
        }
      },
    },
    {
      text: 'Cancel',
      style: 'cancel',
    },
  ]);
};

export default {
  openGallery,
  openCamera,
  promptImagePicker,
};
