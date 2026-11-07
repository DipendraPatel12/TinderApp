import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerWithEmail,
  loginWithEmail,
  loginWithGoogle as firebaseLoginWithGoogle,
  logoutUser as firebaseLogoutUser,
  getUserProfile,
  saveUserProfile,
} from '../../services/firebase';

// Async Thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const user = await loginWithEmail(email, password);
      const profile = await getUserProfile(user.uid);
      return {
        user,
        userData: profile || { uid: user.uid, isProfileCompleted: false },
      };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to login');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ email, password, displayName }, { rejectWithValue }) => {
    try {
      const user = await registerWithEmail(email, password, displayName);
      const profile = {
        uid: user.uid,
        email: user.email,
        displayName: displayName || email.split('@')[0],
        isProfileCompleted: false,
        createdAt: new Date().toISOString(),
      };
      return { user, userData: profile };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to register');
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (googleAccount, { rejectWithValue }) => {
    try {
      const user = await firebaseLoginWithGoogle(googleAccount);
      const profile = await getUserProfile(user.uid);
      return {
        user,
        userData: profile || { uid: user.uid, isProfileCompleted: false },
      };
    } catch (err) {
      return rejectWithValue(err.message || 'Google sign-in failed');
    }
  }
);

export const completeUserProfile = createAsyncThunk(
  'auth/completeUserProfile',
  async (profileData = {}, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      if (!auth.user?.uid) throw new Error('No user is currently signed in');

      const existingData = auth.userData || {};

      // Normalize existing and incoming hobbies cleanly
      let resolvedHobbies = existingData.hobbies || [];
      if (profileData.hobbies !== undefined) {
        resolvedHobbies = Array.isArray(profileData.hobbies)
          ? profileData.hobbies
          : Object.values(profileData.hobbies || {});
      } else if (!Array.isArray(resolvedHobbies)) {
        resolvedHobbies = Object.values(resolvedHobbies || {});
      }

      const updatedProfile = {
        ...existingData,
        uid: auth.user.uid,
        displayName:
          profileData.displayName ||
          existingData.displayName ||
          auth.user?.displayName ||
          'User',
        age:
          profileData.age !== undefined
            ? profileData.age
            : existingData.age || '',
        photoURL:
          profileData.photoURL !== undefined
            ? profileData.photoURL
            : existingData.photoURL || '',
        city:
          profileData.city !== undefined
            ? profileData.city
            : existingData.city || '',
        bio:
          profileData.bio !== undefined
            ? profileData.bio
            : existingData.bio || '',
        hobbies: resolvedHobbies,
        isProfileCompleted: true,
        updatedAt: new Date().toISOString(),
      };

      await saveUserProfile(auth.user.uid, updatedProfile);
      return updatedProfile;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to save profile');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    await firebaseLogoutUser();
    return null;
  }
);

const initialState = {
  user: null,
  userData: null,
  loading: false,
  error: null,
  authInitialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.authInitialized = true;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.userData = action.payload.userData;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.userData = action.payload.userData;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Google Login
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.userData = action.payload.userData;
        state.error = null;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Complete Profile
      .addCase(completeUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
        state.error = null;
      })
      .addCase(completeUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.userData = null;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { setUser, setUserData, clearError } = authSlice.actions;
export default authSlice.reducer;

