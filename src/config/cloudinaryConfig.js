import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '@env';

/**
 * Cloudinary Configuration loaded from .env
 */
export const cloudinaryConfig = {
  cloudName: CLOUDINARY_CLOUD_NAME || 'dwen6kq4r',
  uploadPreset: CLOUDINARY_UPLOAD_PRESET || 'tinder_preset',
};

export default cloudinaryConfig;
