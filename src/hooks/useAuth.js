import { useDispatch, useSelector } from 'react-redux';
import {
  loginUser,
  registerUser,
  loginWithGoogle as loginWithGoogleAction,
  completeUserProfile,
  logoutUser,
  clearError,
  setUser,
  setUserData,
} from '../redux/slices/authSlice';
import { promptGoogleSignIn } from '../lib';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, userData, loading, error, authInitialized } = useSelector(
    (state) => state.auth
  );

  const login = async (email, password) => {
    const resultAction = await dispatch(loginUser({ email, password }));
    if (loginUser.rejected.match(resultAction)) {
      throw new Error(resultAction.payload || 'Login failed');
    }
    return resultAction.payload;
  };

  const register = async (email, password, displayName) => {
    const resultAction = await dispatch(
      registerUser({ email, password, displayName })
    );
    if (registerUser.rejected.match(resultAction)) {
      throw new Error(resultAction.payload || 'Registration failed');
    }
    return resultAction.payload;
  };

  const signInWithGoogle = async () => {
    // Triggers Android's native default Google Account Chooser
    const googleUser = await promptGoogleSignIn();
    if (!googleUser) return null; // Cancelled by user

    const resultAction = await dispatch(loginWithGoogleAction(googleUser));
    if (loginWithGoogleAction.rejected.match(resultAction)) {
      throw new Error(resultAction.payload || 'Google sign-in failed');
    }
    return resultAction.payload;
  };

  const saveProfile = async ({ photoURL, city, bio = '', hobbies = [] }) => {
    const resultAction = await dispatch(
      completeUserProfile({ photoURL, city, bio, hobbies })
    );
    if (completeUserProfile.rejected.match(resultAction)) {
      throw new Error(resultAction.payload || 'Failed to complete profile');
    }
    return resultAction.payload;
  };

  const logout = async () => {
    await dispatch(logoutUser());
  };

  const resetAuthError = () => {
    dispatch(clearError());
  };

  const syncUser = (currentUser) => {
    dispatch(setUser(currentUser));
  };

  const syncUserData = (profileData) => {
    dispatch(setUserData(profileData));
  };

  return {
    user,
    userData,
    loading,
    error,
    authInitialized,
    login,
    register,
    signInWithGoogle,
    saveProfile,
    logout,
    resetAuthError,
    syncUser,
    syncUserData,
  };
};

export default useAuth;

