import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { TextInput, Button } from "react-native-paper";

const SignupScreen = ({ navigation }) => {
  const [username,setUserName]= useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phonenumber,setPhoneNumber] =useState("");
  const [fullName,setfullName] = useState("");
  const [dob,setdob]= useState("");
  

  const handlesignup = () => {
    console.log("Login with:", email, password);
    // Firebase authentication logic here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>DiabeVision</Text>
      <Text style={styles.signupText}>Signup</Text>
      <TextInput
        label="NAME:"
        value={fullName}
        onChangeText={(text) => setfullName(text)}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="USERNAME:"
        value={username}
        onChangeText={(text) => setUserName(text)}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="EMAIL:"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
        mode="outlined"
      />

<TextInput
        label="PHONE NUMBER:"
        value={phonenumber}
        onChangeText={(text) => setPhoneNumber(text)}
        style={styles.input}
        mode="outlined"
      />

<TextInput
        label="DOB:"
        value={dob}
        onChangeText={(text) => setdob(text)}
        style={styles.input}
        mode="outlined"
      />



      <TextInput
        label="PASSWORD:"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        style={styles.input}
        mode="outlined"
        right={<TextInput.Icon name="eye" />}
      />

      <Button mode="contained" onPress={handlesignup} style={styles.signupButton}>
        Signup
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
    marginBottom: 15,
  },
  signupButton: {
    marginTop: 10,
    width: "100%",
    backgroundColor: "#3E3E7E",
  },


});

export default SignupScreen;
