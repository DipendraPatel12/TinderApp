import { View, Text } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigation from './AppNavigation';
import AuthNavigation from './AuthNavigation';
const RootNavigation = () => {
  const active = true;
  return (
    <NavigationContainer>
      {active ? (
        <AppNavigation></AppNavigation>
      ) : (
        <AuthNavigation></AuthNavigation>
      )}
    </NavigationContainer>
  );
};

export default RootNavigation;
