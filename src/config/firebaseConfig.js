import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_DATABASE_URL,
  GOOGLE_WEB_CLIENT_ID,
} from '@env';

export const firebaseConfig = {
  apiKey: FIREBASE_API_KEY || 'AIzaSyC_w13JL9clrBEdnt2HREqzj0TyCURHw5Q',
  authDomain: FIREBASE_AUTH_DOMAIN || 'tinderapp-6c7e2.firebaseapp.com',
  projectId: FIREBASE_PROJECT_ID || 'tinderapp-6c7e2',
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID || '210290114219',
  appId: FIREBASE_APP_ID || '1:210290114219:android:f3bb8d13613d2492f241ee',
  databaseURL: FIREBASE_DATABASE_URL || 'https://tinderapp-6c7e2-default-rtdb.firebaseio.com',
  webClientId:
    GOOGLE_WEB_CLIENT_ID ||
    '210290114219-fd2n631in6rd65nv36n83kvtkc33a80t.apps.googleusercontent.com',
};

export default firebaseConfig;
