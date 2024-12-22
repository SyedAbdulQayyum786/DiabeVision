import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/Login';
import SignupScreen from '../screens/Signup';
import LandingScreen from '../screens/Landing';
import Home from '../screens/Home';
import UploadImage from '../screens/UploadImage';

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Landing" screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="UploadImage" component={UploadImage}/>
    </Stack.Navigator>
  );
}
