import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigation from './AppNavigation';
import AuthNavigation from './AuthNavigation';
import Splash from '../screens/splash/Splash';
import CompleteProfile from '../screens/auth/CompleteProfile';
import { onAuthStateChanged, getUserProfile } from '../services/firebase';
import { useAuth } from '../hooks';

const RootNavigation = () => {
  const [isSplashTimerDone, setIsSplashTimerDone] = useState(false);
  const { user, userData, authInitialized, syncUser, syncUserData } = useAuth();

  useEffect(() => {

    const timer = setTimeout(() => {
      setIsSplashTimerDone(true);
    }, 1200);

    const unsubscribe = onAuthStateChanged(async (currentUser) => {
      if (currentUser?.uid) {
        try {
          const profile = await getUserProfile(currentUser.uid);
          syncUserData(profile || { uid: currentUser.uid, isProfileCompleted: false });
        } catch (e) {
          syncUserData({ uid: currentUser.uid, isProfileCompleted: false });
        }
        syncUser(currentUser);
      } else {
        syncUserData(null);
        syncUser(null);
      }
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  // App is ready when:
  // 1. Minimum 1.2s splash timer is done
  // 2. Auth state is initialized
  // 3. If a user is logged in, their profile data must also be loaded (preventing CompleteProfile flash)
  const isProfileLoading = Boolean(user && userData === null);
  const isAppReady = isSplashTimerDone && authInitialized && !isProfileLoading;

  if (!isAppReady) {
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
