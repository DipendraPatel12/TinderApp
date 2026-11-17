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
  serverTimestamp,
} from '@react-native-firebase/database';
import { firebaseConfig } from '../config';
import { signOutGoogle } from '../lib/googleAuth';

export { firebaseConfig, serverTimestamp };

export const getDb = () => {
  return getDatabase(undefined, firebaseConfig.databaseURL);
};

export const getAuthInstance = () => {
  return getAuth();
};

export const auth = () => getAuthInstance();
auth.GoogleAuthProvider = GoogleAuthProvider;

export const database = () => getDb();
database.ServerValue = {
  get TIMESTAMP() {
    return serverTimestamp();
  },
};

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

export const registerWithEmail = async (email, password, displayName = '') => {
  try {
    const authInstance = getAuthInstance();
    const userCredential = await createUserWithEmailAndPassword(
      authInstance,
      email.trim(),
      password
    );
    const nativeUser = userCredential.user;
    const resolvedDisplayName = displayName;

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
      createdAt: serverTimestamp(),
    });

    return formatUser(nativeUser, resolvedDisplayName);
  } catch (err) {
    throw new Error(formatFirebaseError(err.code || err.message));
  }
};

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
        createdAt: serverTimestamp(),
      });
    }

    return formatUser(nativeUser);
  } catch (err) {
    const errorMsg = err.code || err.message || 'Google sign-in failed';
    console.log('Firebase Google Sign-in error:', errorMsg);
    throw new Error(formatFirebaseError(errorMsg));
  }
};

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

export const getCurrentUser = () => {
  const authInstance = getAuthInstance();
  return formatUser(authInstance.currentUser);
};

export const onAuthStateChanged = (callback) => {
  const authInstance = getAuthInstance();
  return onNativeAuthStateChanged(authInstance, (user) => {
    callback(formatUser(user));
  });
};

export const sendPasswordReset = async (email) => {
  try {
    const authInstance = getAuthInstance();
    await sendPasswordResetEmail(authInstance, email.trim());
    return true;
  } catch (err) {
    throw new Error(formatFirebaseError(err.code || err.message));
  }
};

export const updateUserProfile = async (profile) => {
  const authInstance = getAuthInstance();
  if (!authInstance.currentUser) {
    throw new Error('No user is currently signed in');
  }
  await updateProfile(authInstance.currentUser, profile);
  return formatUser(authInstance.currentUser);
};

export const deleteUserAccount = async () => {
  const authInstance = getAuthInstance();
  if (!authInstance.currentUser) {
    throw new Error('No user is currently signed in');
  }
  await deleteUser(authInstance.currentUser);
  return true;
};

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
  formatFirebaseError,
  auth,
  database,
};
