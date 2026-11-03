import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Auth from '../screens/auth/Auth';
import Login from '../screens/auth/Login';
import Signup from '../screens/auth/Signup';
import CompleteProfile from '../screens/auth/CompleteProfile';

const Stack = createNativeStackNavigator();

const AuthNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={Auth} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="CompleteProfile" component={CompleteProfile} />
    </Stack.Navigator>
  );
};

export default AuthNavigation;
