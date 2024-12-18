import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyA88d-Qrquhzllimhq5n-qxTrsoAJFrtzQ",
  authDomain: "diabevision-7b979.firebaseapp.com",
  projectId: "diabevision-7b979",
  storageBucket: "diabevision-7b979.firebasestorage.app",
  messagingSenderId: "207339886632",
  appId: "1:207339886632:web:431b6f8675c830d29e7d1d",
  measurementId: "G-H51V6E4BTC"
};


const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { auth,db };