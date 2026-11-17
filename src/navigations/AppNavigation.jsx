import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/home/Home';
import Profile from '../screens/profile/Profile';
import ChatList from '../screens/chat/ChatList';
import ChatScreen from '../screens/chat/ChatScreen';
import UserProfile from '../screens/profile/UserProfile';
import EditProfile from '../screens/profile/EditProfile';
import BlockedUsers from '../screens/profile/BlockedUsers';
import { AppIcon } from '../lib';
import { Colors } from '../constants';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textPlaceholder,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.borderLightAlt,
          height: 58,
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <AppIcon name="fire" size={size || 24} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="ChatList"
        component={ChatList}
        options={{
          tabBarLabel: 'Matches',
          tabBarIcon: ({ color, size }) => (
            <AppIcon name="comments" size={size || 23} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <AppIcon name="user" size={size || 22} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="UserProfile" component={UserProfile} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="BlockedUsers" component={BlockedUsers} />
    </Stack.Navigator>
  );
};

export default AppNavigation;
