import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { TextInput, Button } from "react-native-paper";

const LandingScreen = ({ navigation }) => {
    return(
    <View style={styles.container}>
          <Text style={styles.logo}>DiabeVision</Text>
      <Button mode="contained" onPress={()=>navigation.navigate("Login")} style={styles.loginButton}>
        LOGIN
      </Button>

      <Button mode="contained" onPress={()=>navigation.navigate("Signup")} style={styles.loginButton}>
        SIGNUP
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
});

export default LandingScreen;
