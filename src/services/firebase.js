import axios from 'axios';
import { authClient, dbClient } from './api';
import { firebaseConfig } from '../config';
import { saveAuthSession, getAuthSession, clearAuthSession } from './secureStorage';
import { signOutGoogle } from '../lib/googleAuth';

export { firebaseConfig };

let currentSession = null;
const authListeners = new Set();

const notifyAuthListeners = (user) => {
  authListeners.forEach((listener) => listener(user));
};

// Refresh short-lived ID token with Google Secure Token API
export const refreshAuthToken = async () => {
  try {
    const session = currentSession || (await getAuthSession());
    if (!session?.refreshToken) return null;

    const body = `grant_type=refresh_token&refresh_token=${encodeURIComponent(
      session.refreshToken
    )}`;

    const response = await axios.post(
      `https://securetoken.googleapis.com/v1/token?key=${firebaseConfig.apiKey}`,
      body,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 10000,
      }
    );

    const data = response.data;
    const updatedSession = {
      ...session,
      idToken: data.id_token,
      refreshToken: data.refresh_token || session.refreshToken,
    };

    currentSession = updatedSession;
    await saveAuthSession(updatedSession);
    notifyAuthListeners(updatedSession);
    return data.id_token;
  } catch (err) {
    console.log('Token refresh error:', err.message || err);
    return null;
  }
};

// Restore authenticated session on app launch
export const restoreSession = async () => {
  try {
    const saved = await getAuthSession();
    if (saved?.uid && saved?.idToken) {
      currentSession = saved;
      if (saved.refreshToken) {
        refreshAuthToken().catch(() => {});
      }
    }
  } catch (err) {
    console.log('Error restoring session:', err);
  }
  return currentSession;
};

// Register user with email and password
export const registerWithEmail = async (email, password, displayName = '') => {
  try {
    const response = await authClient.post(
      `/accounts:signUp?key=${firebaseConfig.apiKey}`,
      {
        email: email.trim(),
        password,
        returnSecureToken: true,
      }
    );

    const data = response.data;
    const user = {
      uid: data.localId,
      email: data.email,
      displayName: displayName || email.split('@')[0],
      idToken: data.idToken,
      refreshToken: data.refreshToken,
    };

    currentSession = user;
    await saveAuthSession(user);

    await saveUserProfile(user.uid, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      city: '',
      photoURL: '',
      bio: '',
      hobbies: [],
      isProfileCompleted: false,
      createdAt: new Date().toISOString(),
    });

    notifyAuthListeners(user);
    return user;
  } catch (err) {
    throw new Error(formatFirebaseError(err.message));
  }
};

// Log in user with email and password
export const loginWithEmail = async (email, password) => {
  try {
    const response = await authClient.post(
      `/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`,
      {
        email: email.trim(),
        password,
        returnSecureToken: true,
      }
    );

    const data = response.data;
    const user = {
      uid: data.localId,
      email: data.email,
      displayName: data.displayName || email.split('@')[0],
      idToken: data.idToken,
      refreshToken: data.refreshToken,
    };

    currentSession = user;
    await saveAuthSession(user);
    notifyAuthListeners(user);
    return user;
  } catch (err) {
    throw new Error(formatFirebaseError(err.message));
  }
};

// Sign in with Google using selected account
export const loginWithGoogle = async (googleAccount = null) => {
  if (!googleAccount?.email) {
    throw new Error('No Google account provided');
  }

  // Ensure Google ID token is present
  if (!googleAccount.idToken) {
    throw new Error(
      'Google ID token is missing. Please ensure your debug SHA-1 fingerprint is added to Firebase Console.'
    );
  }

  try {
    // Authenticate Google credential with Firebase Identity Toolkit
    const response = await authClient.post(
      `/accounts:signInWithIdp?key=${firebaseConfig.apiKey}`,
      {
        postBody: `id_token=${googleAccount.idToken}&providerId=google.com`,
        requestUri: 'http://localhost',
        returnIdpCredential: true,
        returnSecureToken: true,
      }
    );

    const data = response.data;
    const user = {
      uid: data.localId, // Real Firebase UID in Authentication console
      email: data.email,
      displayName:
        data.displayName || googleAccount.displayName || data.email.split('@')[0],
      photoURL: data.photoUrl || googleAccount.photoURL || '',
      idToken: data.idToken,
      refreshToken: data.refreshToken,
    };

    currentSession = user;
    await saveAuthSession(user);

    // Persist user profile in Realtime Database under their official Firebase Authentication UID
    const existing = await getUserProfile(user.uid);
    if (!existing) {
      await saveUserProfile(user.uid, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        city: '',
        isProfileCompleted: false,
        createdAt: new Date().toISOString(),
      });
    }

    notifyAuthListeners(user);
    return user;
  } catch (err) {
    const errorMsg =
      err.response?.data?.error?.message ||
      err.message ||
      'Failed to authenticate Google user with Firebase';
    console.log('Firebase Google Sign-in error:', errorMsg);
    throw new Error(formatFirebaseError(errorMsg));
  }
};

// Sign out
export const logoutUser = async () => {
  currentSession = null;
  await clearAuthSession();
  await signOutGoogle();
  notifyAuthListeners(null);
  return true;
};

// Get current session user
export const getCurrentUser = () => currentSession;

// Listen to auth state changes
export const onAuthStateChanged = (callback) => {
  authListeners.add(callback);
  restoreSession().then((session) => callback(session));
  return () => authListeners.delete(callback);
};

// Save user profile in Realtime Database
export const saveUserProfile = async (uid, profileData) => {
  try {
    const response = await dbClient.patch(`/users/${uid}.json`, profileData);
    return response.data || profileData;
  } catch (err) {
    console.log('Error saving user profile:', err.message);
    return profileData;
  }
};

// Get user profile from Realtime Database
export const getUserProfile = async (uid) => {
  try {
    const response = await dbClient.get(`/users/${uid}.json`);
    return response.data;
  } catch (err) {
    return null;
  }
};

// Format Firebase errors into readable strings
function formatFirebaseError(code) {
  if (!code) return 'An unexpected error occurred';
  switch (code) {
    case 'EMAIL_EXISTS':
      return 'This email is already registered. Please log in.';
    case 'INVALID_EMAIL':
      return 'Please enter a valid email address.';
    case 'WEAK_PASSWORD : Password should be at least 6 characters':
    case 'WEAK_PASSWORD':
      return 'Password must be at least 6 characters long.';
    case 'EMAIL_NOT_FOUND':
      return 'No account found with this email.';
    case 'INVALID_PASSWORD':
    case 'INVALID_LOGIN_CREDENTIALS':
      return 'Incorrect email or password. Please try again.';
    case 'USER_DISABLED':
      return 'This account has been disabled.';
    case 'TOO_MANY_ATTEMPTS_TRY_LATER':
      return 'Too many attempts. Please try again later.';
    case 'CONFIGURATION_NOT_FOUND':
    case 'OPERATION_NOT_ALLOWED':
      return 'Google Sign-in is not enabled in Firebase Console. Please enable it in Authentication > Sign-in method.';
    case 'INVALID_IDP_RESPONSE':
      return 'Google authentication failed. Please verify that your debug SHA-1 fingerprint is added in Firebase Console.';
    default:
      return code.replace(/_/g, ' ').toLowerCase();
  }
}
