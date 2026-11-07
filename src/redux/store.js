import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import swipesReducer from './slices/swipesSlice';
import chatReducer from './slices/chatSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    swipes: swipesReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

