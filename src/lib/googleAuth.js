import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { firebaseConfig } from '../config';

// Configure Google Sign-In with Web Client ID
GoogleSignin.configure({
  scopes: ['email', 'profile'],
  webClientId: firebaseConfig.webClientId,
});

export const promptGoogleSignIn = async () => {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();

    const userInfo = response?.data?.user || response?.user || response;
    let idToken = response?.data?.idToken || response?.idToken;

    // Fetch idToken via getTokens if not present in direct response
    if (!idToken) {
      try {
        const tokens = await GoogleSignin.getTokens();
        idToken = tokens?.idToken;
      } catch (tokenErr) {
        console.log('Error getting tokens from GoogleSignin:', tokenErr);
      }
    }

    if (!userInfo?.email) {
      throw new Error('No Google account was selected.');
    }

    return {
      email: userInfo.email.trim().toLowerCase(),
      displayName: userInfo.name || userInfo.givenName || userInfo.email.split('@')[0],
      photoURL: userInfo.photo || null,
      idToken: idToken || null,
    };
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      return null;
    }
    if (error.code === statusCodes.IN_PROGRESS) {
      return null;
    }
    if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      throw new Error('Google Play Services is not available on this device.');
    }
    if (error.code === '10' || error.message?.includes('DEVELOPER_ERROR')) {
      throw new Error(
        'Google Sign-In DEVELOPER_ERROR (10): Please ensure your SHA-1 fingerprint (5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25) is added in Firebase Console.'
      );
    }

    console.log('Google Sign-in error:', error.message || error);
    throw error;
  }
};

export const signOutGoogle = async () => {
  try {
    await GoogleSignin.signOut();
  } catch (error) {
    console.log('Google Sign-out note:', error.message || error);
  }
};

export default {
  promptGoogleSignIn,
  signOutGoogle,
};
