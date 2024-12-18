import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { about_text } from '../constants';

export default function Home({route}) {
  const { fullName, username } = route.params; 

  const avatarLetter = username.charAt(0).toUpperCase();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>DiabeVision</Text>
      <View style={styles.card}>
        <Text style={styles.welcomeText}>Welcome,</Text>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{avatarLetter}</Text>
        </View>
        <Text style={styles.username}>@{username}</Text>
        <Text style={styles.subHeader}>Diabetic Retinopathy</Text>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={true}>
          <Text style={styles.description}>{about_text}</Text>
        </ScrollView>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Go To Menu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C3BDF3',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    backgroundColor: '#6C63FF',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C63FF',
    marginBottom: 10,
  },
  scrollView: {
    flex: 1, // Takes up all available space
    width: '100%',
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#3A2E9E',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
