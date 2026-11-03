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

/**
 * Restore authenticated session on app launch
 */
export const restoreSession = async () => {
  try {
    const saved = await getAuthSession();
    if (saved?.uid && saved?.idToken) {
      currentSession = saved;
    }
  } catch (err) {
    console.log('Error restoring session:', err);
  }
  return currentSession;
};

/**
 * Register a user with Email and Password using Axios
 */
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

    // Create initial user profile
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

/**
 * Log in a user with Email and Password using Axios
 */
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

/**
 * Sign in with Google using selected Google account
 */
export const loginWithGoogle = async (googleAccount = null) => {
  const email = (googleAccount?.email || 'user@gmail.com').trim().toLowerCase();
  const displayName = googleAccount?.displayName || email.split('@')[0];
  const photoURL =
    googleAccount?.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=FE3C72&color=fff`;

  // Deterministic UID based on Google email so logging in with the same email restores existing profile
  const sanitizedUid = 'google_' + email.replace(/[^a-z0-9]/g, '_');
  const user = {
    uid: sanitizedUid,
    email,
    displayName,
    photoURL,
    idToken: 'google_token_' + sanitizedUid,
  };

  currentSession = user;
  await saveAuthSession(user);

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
};

/**
 * Sign out
 */
export const logoutUser = async () => {
  currentSession = null;
  await clearAuthSession();
  await signOutGoogle();
  notifyAuthListeners(null);
  return true;
};

/**
 * Get current session user
 */
export const getCurrentUser = () => currentSession;

/**
 * Listen to auth state changes
 */
export const onAuthStateChanged = (callback) => {
  authListeners.add(callback);
  restoreSession().then((session) => callback(session));
  return () => authListeners.delete(callback);
};

/**
 * Save / Update User Profile in Realtime Database
 */
export const saveUserProfile = async (uid, profileData) => {
  try {
    const response = await dbClient.patch(`/users/${uid}.json`, profileData);
    return response.data || profileData;
  } catch (err) {
    console.log('Error saving user profile:', err.message);
    return profileData;
  }
};

/**
 * Get User Profile from Realtime Database
 */
export const getUserProfile = async (uid) => {
  try {
    const response = await dbClient.get(`/users/${uid}.json`);
    return response.data;
  } catch (err) {
    return null;
  }
};

/**
 * Helper to turn Firebase error codes into user-friendly strings
 */
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
    default:
      return code.replace(/_/g, ' ').toLowerCase();
  }
}
