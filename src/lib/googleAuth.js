import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

// Configure Google Sign-In
GoogleSignin.configure({
  scopes: ['email', 'profile'],
});

/**
 * Trigger Android's native default Google Sign-In account chooser
 * Opens the system-level Google Account sheet with device accounts
 */
export const promptGoogleSignIn = async () => {
  try {
    // 1. Ensure Google Play Services are available
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    // 2. Open Android's native default account chooser
    const response = await GoogleSignin.signIn();

    // 3. Extract user data (supports both latest and legacy response shapes)
    const userInfo = response?.data?.user || response?.user || response;
    const idToken = response?.data?.idToken || response?.idToken;

    if (!userInfo?.email) {
      throw new Error('No account selected');
    }

    return {
      email: userInfo.email.trim().toLowerCase(),
      displayName: userInfo.name || userInfo.givenName || userInfo.email.split('@')[0],
      photoURL: userInfo.photo || null,
      idToken: idToken || null,
    };
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // User dismissed the native dialog
      return null;
    }
    if (error.code === statusCodes.IN_PROGRESS) {
      console.log('Google Sign-in is already in progress');
      return null;
    }
    if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      throw new Error('Google Play Services is not available on this device');
    }

    console.log('Google Sign-in error:', error.message || error);
    throw error;
  }
};

/**
 * Sign out of native Google session
 */
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
