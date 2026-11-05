import { cloudinaryConfig } from '../config';

export const uploadImageToCloudinary = async (file) => {
  if (!file?.uri) {
    throw new Error('No image selected for upload');
  }

  const { cloudName, uploadPreset } = cloudinaryConfig;

  const data = new FormData();
  data.append('file', {
    uri: file.uri,
    type: file.type || 'image/jpeg',
    name: file.fileName || `photo_${Date.now()}.jpg`,
  });
  data.append('upload_preset', uploadPreset);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  try {
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: data,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || 'Cloudinary upload failed');
    }

    return result.secure_url;
  } catch (error) {
    console.log('Error uploading to Cloudinary:', error.message || error);
    throw error;
  }
};

export default {
  uploadImageToCloudinary,
};

