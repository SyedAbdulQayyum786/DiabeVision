import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA88d-Qrquhzllimhq5n-qxTrsoAJFrtzQ",
  authDomain: "diabevision-7b979.firebaseapp.com",
  projectId: "diabevision-7b979",
  storageBucket: "diabevision-7b979.firebasestorage.app",
  messagingSenderId: "207339886632",
  appId: "1:207339886632:web:431b6f8675c830d29e7d1d",
  measurementId: "G-H51V6E4BTC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);