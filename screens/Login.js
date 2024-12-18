import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Toast from "react-native-toast-message";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [userData, setUserData] = useState(null); // To store user data after login

  const handleLogin = async () => {
    setEmailError("");
    setPasswordError("");

    // Validate email and password
    if (!email) {
      setEmailError("Email is required.");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email.");
    }

    if (!password) {
      setPasswordError("Password is required.");
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
    }

    if (!emailError && !passwordError) {
      try {
        // Attempt to login with email and password
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        // Fetch user data from Firestore after successful login
        const userDocRef = doc(db, "users", userCredential.user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserData(userDoc.data());
          Toast.show({
            type: 'success',
            text1: 'Login Success',
            text2: 'User logged in successfully.',
          });
          
          navigation.navigate("Home", {
            fullName: userData?.fullName,
            username: userData?.username,
          }); 
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.log("Login failed", error.message);
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: error.message,
        });
      }
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>DiabeVision</Text>
      <Text style={styles.loginText}>LOGIN</Text>

      <TextInput
        label="EMAIL"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
        mode="outlined"
        error={!!emailError}
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <TextInput
        label="PASSWORD"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={!passwordVisible}
        style={[styles.input, { paddingRight: 40 }]}
        mode="outlined"
        error={!!passwordError}
        right={
          <TextInput.Icon 
            name={passwordVisible ? "eye-off" : "eye"} 
            onPress={togglePasswordVisibility} 
            color="black" 
            size={24} 
          />
        }
      />
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      <Button mode="contained" onPress={handleLogin} style={styles.loginButton}>
        LOGIN
      </Button>

      <View style={styles.signupText}>
        <Text>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.signupLink}> Sign Up here</Text>
        </TouchableOpacity>
      </View>

      {/* Display user data if logged in */}
      {/* {userData && (
        <View style={styles.userDataContainer}>
          <Text style={styles.userInfo}>Username: {userData.username}</Text>
          <Text style={styles.userInfo}>Full Name: {userData.fullName}</Text>
        </View>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C2C2FC",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#3E3E7E",
  },
  loginText: {
    fontSize: 18,
    marginBottom: 20,
    color: "#3E3E7E",
  },
  input: {
    width: "100%",
    marginBottom: 15,
  },
  loginButton: {
    marginTop: 10,
    width: "100%",
    backgroundColor: "#3E3E7E",
  },
  signupText: {
    flexDirection: "row",
    marginTop: 15,
  },
  signupLink: {
    color: "#0A68FF",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  userDataContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#E5E5E5",
    borderRadius: 5,
    width: "100%",
  },
  userInfo: {
    fontSize: 16,
    color: "#3E3E7E",
  },
});

export default LoginScreen;
