import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged as onNativeAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  deleteUser,
} from '@react-native-firebase/auth';
import {
  getDatabase,
  ref,
  serverTimestamp,
} from '@react-native-firebase/database';
import { firebaseConfig } from '../config';
import { signOutGoogle } from '../lib/googleAuth';

export { firebaseConfig };

// Native Database instance accessor
export const getDb = () => {
  return getDatabase(undefined, firebaseConfig.databaseURL);
};

// Native Auth instance accessor
export const getAuthInstance = () => {
  return getAuth();
};

// Compatibility namespaces for native SDK syntax database().ref() and auth().signIn...
export const auth = () => getAuthInstance();
auth.GoogleAuthProvider = GoogleAuthProvider;

export const database = () => getDb();
database.ServerValue = {
  get TIMESTAMP() {
    return serverTimestamp();
  },
};

// Format native Firebase user object to clean, serializable plain object
export const formatUser = (nativeUser, overrideDisplayName = null) => {
  if (!nativeUser) return null;
  return {
    uid: nativeUser.uid,
    email: nativeUser.email || '',
    displayName:
      overrideDisplayName ||
      nativeUser.displayName ||
      (nativeUser.email ? nativeUser.email.split('@')[0] : '') ||
      'User',
    photoURL: nativeUser.photoURL || '',
  };
};

/**
 * Register a user with email and password using native Firebase Auth.
 * Automatically saves profile in Realtime Database under their official UID.
 */
export const registerWithEmail = async (email, password, displayName = '') => {
  try {
    const authInstance = getAuthInstance();
    const userCredential = await createUserWithEmailAndPassword(
      authInstance,
      email.trim(),
      password
    );
    const nativeUser = userCredential.user;
    const resolvedDisplayName = displayName || email.split('@')[0];

    try {
      await updateProfile(nativeUser, { displayName: resolvedDisplayName });
    } catch (e) {
      console.log('Note: updateProfile displayName error:', e.message);
    }

    await saveUserProfile(nativeUser.uid, {
      uid: nativeUser.uid,
      email: nativeUser.email,
      displayName: resolvedDisplayName,
      city: '',
      photoURL: nativeUser.photoURL || '',
      bio: '',
      hobbies: [],
      isProfileCompleted: false,
      createdAt: new Date().toISOString(),
    });

    return formatUser(nativeUser, resolvedDisplayName);
  } catch (err) {
    throw new Error(formatFirebaseError(err.code || err.message));
  }
};

/**
 * Log in user with email and password using native Firebase Auth.
 */
export const loginWithEmail = async (email, password) => {
  try {
    const authInstance = getAuthInstance();
    const userCredential = await signInWithEmailAndPassword(
      authInstance,
      email.trim(),
      password
    );
    return formatUser(userCredential.user);
  } catch (err) {
    throw new Error(formatFirebaseError(err.code || err.message));
  }
};

/**
 * Sign in with Google using GoogleAuthProvider.credential() and signInWithCredential().
 */
export const loginWithGoogle = async (googleAccount = null) => {
  if (!googleAccount?.email) {
    throw new Error('No Google account provided');
  }

  if (!googleAccount.idToken) {
    throw new Error(
      'Google ID token is missing. Please ensure your debug SHA-1 fingerprint is added to Firebase Console.'
    );
  }

  try {
    const authInstance = getAuthInstance();
    const credential = GoogleAuthProvider.credential(googleAccount.idToken);
    const userCredential = await signInWithCredential(authInstance, credential);
    const nativeUser = userCredential.user;

    // Check if user profile already exists, if not initialize under their official Firebase Authentication UID
    const existing = await getUserProfile(nativeUser.uid);
    if (!existing) {
      await saveUserProfile(nativeUser.uid, {
        uid: nativeUser.uid,
        email: nativeUser.email,
        displayName:
          nativeUser.displayName ||
          googleAccount.displayName ||
          (nativeUser.email ? nativeUser.email.split('@')[0] : 'User'),
        photoURL: nativeUser.photoURL || googleAccount.photoURL || '',
        city: '',
        bio: '',
        hobbies: [],
        isProfileCompleted: false,
        createdAt: new Date().toISOString(),
      });
    }

    return formatUser(nativeUser);
  } catch (err) {
    const errorMsg = err.code || err.message || 'Google sign-in failed';
    console.log('Firebase Google Sign-in error:', errorMsg);
    throw new Error(formatFirebaseError(errorMsg));
  }
};

/**
 * Sign out current user from Firebase and Google.
 */
export const logoutUser = async () => {
  try {
    const authInstance = getAuthInstance();
    await signOut(authInstance);
  } catch (err) {
    console.log('Error during Firebase signOut:', err.message);
  }
  await signOutGoogle();
  return true;
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = () => {
  const authInstance = getAuthInstance();
  return formatUser(authInstance.currentUser);
};

/**
 * Listen to native auth state changes with automatic unsubscription
 */
export const onAuthStateChanged = (callback) => {
  const authInstance = getAuthInstance();
  return onNativeAuthStateChanged(authInstance, (user) => {
    callback(formatUser(user));
  });
};

/**
 * Send password reset email
 */
export const sendPasswordReset = async (email) => {
  try {
    const authInstance = getAuthInstance();
    await sendPasswordResetEmail(authInstance, email.trim());
    return true;
  } catch (err) {
    throw new Error(formatFirebaseError(err.code || err.message));
  }
};

/**
 * Update authenticated user's profile in Firebase Auth
 */
export const updateUserProfile = async (profile) => {
  const authInstance = getAuthInstance();
  if (!authInstance.currentUser) {
    throw new Error('No user is currently signed in');
  }
  await updateProfile(authInstance.currentUser, profile);
  return formatUser(authInstance.currentUser);
};

/**
 * Delete current user account from Firebase Auth
 */
export const deleteUserAccount = async () => {
  const authInstance = getAuthInstance();
  if (!authInstance.currentUser) {
    throw new Error('No user is currently signed in');
  }
  await deleteUser(authInstance.currentUser);
  return true;
};

/**
 * Save / update user profile in Realtime Database under /users/{uid}
 */
export const saveUserProfile = async (uid, profileData) => {
  if (!uid) return profileData;
  try {
    const db = getDb();
    await db.ref(`/users/${uid}`).update(profileData);
    return profileData;
  } catch (err) {
    console.log('Error saving user profile:', err.message);
    return profileData;
  }
};

/**
 * Get user profile from Realtime Database under /users/{uid}
 */
export const getUserProfile = async (uid) => {
  if (!uid) return null;
  try {
    const db = getDb();
    const snapshot = await db.ref(`/users/${uid}`).once('value');
    const data = snapshot.val();
    if (data && data.hobbies && !Array.isArray(data.hobbies)) {
      data.hobbies = Object.values(data.hobbies);
    }
    return data;
  } catch (err) {
    console.log('Error getting user profile:', err.message);
    return null;
  }
};

// Automatic token refresh helper (native SDK handles refreshing automatically)
export const refreshAuthToken = async () => {
  try {
    const authInstance = getAuthInstance();
    if (authInstance.currentUser) {
      return await authInstance.currentUser.getIdToken(true);
    }
    return null;
  } catch (e) {
    return null;
  }
};

// Session restore helper
export const restoreSession = async () => {
  return getCurrentUser();
};

/**
 * Format Firebase error codes to user-friendly messages
 */
export function formatFirebaseError(codeOrMessage) {
  if (!codeOrMessage) return 'An unexpected error occurred';
  const str = String(codeOrMessage);

  if (str.includes('email-already-in-use') || str.includes('EMAIL_EXISTS')) {
    return 'This email is already registered. Please log in.';
  }
  if (str.includes('invalid-email') || str.includes('INVALID_EMAIL')) {
    return 'Please enter a valid email address.';
  }
  if (str.includes('weak-password') || str.includes('WEAK_PASSWORD')) {
    return 'Password must be at least 6 characters long.';
  }
  if (str.includes('user-not-found') || str.includes('EMAIL_NOT_FOUND')) {
    return 'No account found with this email.';
  }
  if (
    str.includes('wrong-password') ||
    str.includes('INVALID_PASSWORD') ||
    str.includes('invalid-credential') ||
    str.includes('INVALID_LOGIN_CREDENTIALS')
  ) {
    return 'Incorrect email or password. Please try again.';
  }
  if (str.includes('user-disabled') || str.includes('USER_DISABLED')) {
    return 'This account has been disabled.';
  }
  if (str.includes('too-many-requests') || str.includes('TOO_MANY_ATTEMPTS')) {
    return 'Too many attempts. Please try again later.';
  }
  if (
    str.includes('operation-not-allowed') ||
    str.includes('CONFIGURATION_NOT_FOUND') ||
    str.includes('OPERATION_NOT_ALLOWED')
  ) {
    return 'Sign-in method is not enabled in Firebase Console. Please enable it in Authentication > Sign-in method.';
  }
  if (str.includes('network-request-failed')) {
    return 'Network request failed. Please check your internet connection.';
  }
  return str.replace(/auth\//g, '').replace(/_/g, ' ').toLowerCase();
}

export default {
  registerWithEmail,
  loginWithEmail,
  loginWithGoogle,
  logoutUser,
  getCurrentUser,
  onAuthStateChanged,
  sendPasswordReset,
  updateUserProfile,
  deleteUserAccount,
  saveUserProfile,
  getUserProfile,
  refreshAuthToken,
  restoreSession,
  formatFirebaseError,
  auth,
  database,
};
