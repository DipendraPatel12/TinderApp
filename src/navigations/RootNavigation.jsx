import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigation from './AppNavigation';
import AuthNavigation from './AuthNavigation';
import Splash from '../screens/splash/Splash';
import CompleteProfile from '../screens/auth/CompleteProfile';
import { onAuthStateChanged, getUserProfile } from '../services/firebase';
import { useAuth } from '../hooks';

const RootNavigation = () => {
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const { user, userData, authInitialized, syncUser, syncUserData } = useAuth();

  useEffect(() => {
    // 1. Brief minimum brand presentation (1.2s) so branding displays smoothly
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 1200);

    // 2. Sync with real Firebase Auth state & fetch profile
    const unsubscribe = onAuthStateChanged(async (currentUser) => {
      syncUser(currentUser);
      if (currentUser?.uid) {
        try {
          const profile = await getUserProfile(currentUser.uid);
          syncUserData(profile || { uid: currentUser.uid, isProfileCompleted: false });
        } catch (e) {
          syncUserData({ uid: currentUser.uid, isProfileCompleted: false });
        }
      }
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  // Show splash until BOTH the minimum brand time has elapsed AND Firebase auth has resolved
  const isSplashVisible = !minTimeElapsed || !authInitialized;

  if (isSplashVisible) {
    return <Splash />;
  }

  return (
    <NavigationContainer>
      {user ? (
        userData?.isProfileCompleted ? (
          <AppNavigation />
        ) : (
          <CompleteProfile />
        )
      ) : (
        <AuthNavigation />
      )}
    </NavigationContainer>
  );
};

export default RootNavigation;
