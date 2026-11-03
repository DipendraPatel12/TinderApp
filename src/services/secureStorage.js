import * as Keychain from 'react-native-keychain';

/**
 * Save user auth session securely
 */
export const saveAuthSession = async (sessionData) => {
  try {
    const credentials = JSON.stringify(sessionData);
    await Keychain.setGenericPassword('auth_session', credentials);
    return true;
  } catch (error) {
    console.log('Error saving auth session:', error);
    return false;
  }
};

/**
 * Retrieve saved auth session
 */
export const getAuthSession = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials && credentials.password) {
      return JSON.parse(credentials.password);
    }
    return null;
  } catch (error) {
    console.log('Error getting auth session:', error);
    return null;
  }
};

/**
 * Get active auth token
 */
export const getAuthToken = async () => {
  const session = await getAuthSession();
  return session?.idToken || null;
};

/**
 * Clear auth session on logout
 */
export const clearAuthSession = async () => {
  try {
    await Keychain.resetGenericPassword();
    return true;
  } catch (error) {
    console.log('Error clearing auth session:', error);
    return false;
  }
};

export default {
  saveAuthSession,
  getAuthSession,
  getAuthToken,
  clearAuthSession,
};
