import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { TextInput, Button, ActivityIndicator } from "react-native-paper";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/FontAwesome";

const SignupScreen = ({ navigation }) => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!fullName) newErrors.fullName = "Full name is required.";
    if (!username) newErrors.username = "Username is required.";
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email.";
    }
    if (!phonenumber) {
      newErrors.phonenumber = "Phone number is required.";
    } else if (!/^\d{11}$/.test(phonenumber)) {
      newErrors.phonenumber = "Enter a valid 11-digit phone number.";
    }
    if (!dob) newErrors.dob = "Date of birth is required.";
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: fullName });

      await setDoc(doc(db, "users", userCredential.user.uid), {
        fullName,
        username,
        email,
        phoneNumber: phonenumber,
        dob,
        uid: userCredential.user.uid,
        createdAt: new Date().toISOString(),
      });

      Toast.show({
        type: "success",
        text1: "Sign up",
        text2: "User Registered Successfully.",
      });
      navigation.navigate("Login");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        Toast.show({
          type: "error",
          text1: "Sign up",
          text2: "Email already exists. Please use a different email.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Sign up",
          text2: error.message,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>DiabeVision</Text>
      <Text style={styles.signupText}>Signup</Text>

      <TextInput
        label="Full Name"
        value={fullName}
        onChangeText={(text) => setFullName(text)}
        style={styles.input}
        mode="outlined"
        error={!!errors.fullName}
      />
      {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

      <TextInput
        label="Username"
        value={username}
        onChangeText={(text) => setUserName(text)}
        style={styles.input}
        mode="outlined"
        error={!!errors.username}
      />
      {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

      <TextInput
        label="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
        mode="outlined"
        error={!!errors.email}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <TextInput
        label="Phone Number"
        value={phonenumber}
        onChangeText={(text) => setPhoneNumber(text)}
        style={styles.input}
        mode="outlined"
        error={!!errors.phonenumber}
      />
      {errors.phonenumber && (
        <Text style={styles.errorText}>{errors.phonenumber}</Text>
      )}

      <TextInput
        label="Date of Birth"
        value={dob}
        onChangeText={(text) => setDob(text)}
        style={styles.input}
        mode="outlined"
        error={!!errors.dob}
      />
      {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}

      <View style={styles.passwordContainer}>
        <TextInput
          label="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={!passwordVisible}
          style={styles.passwordInput}
          mode="outlined"
          error={!!errors.password}
        />
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.iconContainer}
        >
          <Icon
            name={passwordVisible ? "eye-slash" : "eye"}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      </View>
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      <Button
        mode="contained"
        onPress={handleSignup}
        style={styles.signupButton}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          "Signup"
        )}
      </Button>
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
  signupText: {
    fontSize: 18,
    marginBottom: 20,
    color: "#3E3E7E",
  },
  input: {
    width: "100%",
    marginBottom: 5,
  },
  passwordContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    marginBottom: 5,
  },
  iconContainer: {
    position: "absolute",
    right: 15,
    top: 18,
  },
  signupButton: {
    marginTop: 10,
    width: "100%",
    backgroundColor: "#3E3E7E",
  },
  errorText: {
    color: "red",
    alignSelf: "flex-start",
    marginLeft: 10,
    marginBottom: 10,
  },
});

export default SignupScreen;
