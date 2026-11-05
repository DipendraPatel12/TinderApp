import axios from 'axios';
import { firebaseConfig } from '../config';
import { getAuthToken } from './secureStorage';

// Axios instance for Firebase Authentication
export const authClient = axios.create({
  baseURL: 'https://identitytoolkit.googleapis.com/v1',
  timeout: 10000,
});

// Axios instance for Firebase Realtime Database
export const dbClient = axios.create({
  baseURL: firebaseConfig.databaseURL,
  timeout: 10000,
});

// Automatically attach auth token to Realtime Database requests
dbClient.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token && !config.params?.auth) {
    config.params = { ...config.params, auth: token };
  }
  return config;
});

// Error handling helper
const handleResponseError = (error) => {
  const message =
    error.response?.data?.error?.message ||
    error.message ||
    'Network request failed. Please try again.';
  return Promise.reject(new Error(message));
};

authClient.interceptors.response.use((response) => response, handleResponseError);

// Realtime Database response interceptor with silent auto-refresh on 401 token expiration
dbClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isTokenExpired =
      error.response?.status === 401 ||
      error.response?.data?.error === 'Auth token is expired';

    if (isTokenExpired && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { refreshAuthToken } = require('./firebase');
        const newToken = await refreshAuthToken();
        if (newToken) {
          originalRequest.params = {
            ...originalRequest.params,
            auth: newToken,
          };
          return dbClient(originalRequest);
        }
      } catch (refreshErr) {
        console.log('Silent token refresh note:', refreshErr.message || refreshErr);
      }
    }

    return handleResponseError(error);
  }
);

export default {
  authClient,
  dbClient,
};
