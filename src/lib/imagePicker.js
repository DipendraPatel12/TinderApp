import { Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const DEFAULT_OPTIONS = {
  mediaType: 'photo',
  maxWidth: 1000,
  maxHeight: 1000,
  quality: 0.8,
};

/**
 * Format raw asset into a standard normalized image object
 */
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

/**
 * Pick an image from device gallery
 */
export const openGallery = async (customOptions = {}) => {
  try {
    const result = await launchImageLibrary({ ...DEFAULT_OPTIONS, ...customOptions });
    if (result.didCancel) return null;
    if (result.errorCode) {
      throw new Error(result.errorMessage || 'Failed to select image from gallery');
    }
    return formatAsset(result.assets?.[0]);
  } catch (error) {
    console.log('Error opening gallery:', error.message || error);
    throw error;
  }
};

/**
 * Capture a photo using device camera
 */
export const openCamera = async (customOptions = {}) => {
  try {
    const result = await launchCamera({ ...DEFAULT_OPTIONS, ...customOptions });
    if (result.didCancel) return null;
    if (result.errorCode) {
      throw new Error(result.errorMessage || 'Failed to capture photo with camera');
    }
    return formatAsset(result.assets?.[0]);
  } catch (error) {
    console.log('Error opening camera:', error.message || error);
    throw error;
  }
};

/**
 * Show standard picker alert dialog (Take Photo / Choose from Gallery / Cancel)
 */
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

