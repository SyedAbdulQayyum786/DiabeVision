import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRecoilValue } from 'recoil';
import { usernameState, phoneState, emailstate, fullnameState, dobstate } from '../atoms/state';

export default function ReportDetails({route}) {
  const { prediction } = route.params;
  const username = useRecoilValue(usernameState);
  const phone = useRecoilValue(phoneState);
  const email = useRecoilValue(emailstate);
  const fullname = useRecoilValue(fullnameState);
  const dob = useRecoilValue(dobstate);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Report Details</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.detail}><Text style={styles.label}>Full Name:</Text> {fullname}</Text>
        <Text style={styles.detail}><Text style={styles.label}>Username:</Text> {username}</Text>
        <Text style={styles.detail}><Text style={styles.label}>Email:</Text> {email}</Text>
        <Text style={styles.detail}><Text style={styles.label}>Phone:</Text> {phone}</Text>
        <Text style={styles.detail}><Text style={styles.label}>Date of Birth:</Text> {dob}</Text>
        <Text style={styles.detail}><Text style={styles.label}>Prediction:</Text> {prediction}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#C3BDF3', // Light purple background
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A3E75',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsContainer: {
    width: '100%', // Full width of the screen
    padding: 20,
    backgroundColor: '#FFFFFF', // White container background
    borderRadius: 10, // Rounded corners
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.1, // Shadow opacity
    shadowRadius: 4, // Shadow blur radius
    elevation: 5, // Shadow for Android
  },
  detail: {
    fontSize: 16,
    color: '#4A3E75',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
  },
});
