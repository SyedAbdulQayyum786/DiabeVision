import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './navigation/AuthStack';
import Toast from 'react-native-toast-message';
import { RecoilRoot } from 'recoil';
export default function App() {
  return (
    <RecoilRoot>
    <NavigationContainer>
      <AuthStack />
      <Toast/>
    </NavigationContainer>
    </RecoilRoot>
  );
}