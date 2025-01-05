import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, DrawerLayoutAndroid, Alert, ScrollView } from 'react-native';
import { useRecoilState, useRecoilValue } from 'recoil';
import { usernameState, phoneState, emailstate, fullnameState, dobstate, uidState } from '../atoms/state';
import { ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ReportDetails({ route, navigation }) {
  const { prediction, report_text } = route.params;
  const username = useRecoilValue(usernameState);
  const phone = useRecoilValue(phoneState);
  const email = useRecoilValue(emailstate);
  const fullname = useRecoilValue(fullnameState);
  const dob = useRecoilValue(dobstate);
  const drawer = useRef(null);
  const [uid, setUid] = useRecoilState(uidState);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: () => {
          setUid("");
          navigation.navigate('Landing');
        },
      },
    ]);
  };

  const navigationView = () => (
    <View style={styles.drawerContainer}>
      <Text style={styles.drawerHeader}>MENU</Text>
      <TouchableOpacity style={styles.drawerButton} onPress={() => navigation.navigate('Home')}>
        <View style={styles.iconButtonContainer}>
          <Icon name="home" size={20} color="#FFFFFF" style={styles.icon} />
          <Text style={styles.drawerButtonText}>Home</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.drawerButton} onPress={() => navigation.navigate('UploadImage')}>
        <View style={styles.iconButtonContainer}>
          <Icon name="image" size={20} color="#FFFFFF" style={styles.icon} />
          <Text style={styles.drawerButtonText}>Upload Image</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.drawerButton} onPress={() => navigation.navigate("PatientReports")}>
        <View style={styles.iconButtonContainer}>
          <Icon name="file" size={20} color="#FFFFFF" style={styles.icon} />
          <Text style={styles.drawerButtonText}>Get Reports</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.drawerButton} onPress={handleLogout}>
        <View style={styles.iconButtonContainer}>
          <Icon name="sign-out" size={20} color="#FFFFFF" style={styles.icon} />
          <Text style={styles.drawerButtonText}>Logout</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <DrawerLayoutAndroid
      key={Math.random()}
      ref={drawer}
      drawerWidth={250}
      drawerPosition="left"
      renderNavigationView={navigationView}
    >
      {isLoading ? (
        <ActivityIndicator size="large" color="#6C63FF" style={styles.loader} />
      ) : (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              if (drawer.current) {
                drawer.current.openDrawer();
              } else {
                console.error('Drawer ref is not set');
              }
            }}
          >
            <Text style={styles.menuButtonText}>☰ Menu</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Report Details</Text>
          <View style={styles.detailsContainer}>
            <Text style={styles.detail}><Text style={styles.label}>Full Name:</Text> {fullname}</Text>
            <Text style={styles.detail}><Text style={styles.label}>Username:</Text> {username}</Text>
            <Text style={styles.detail}><Text style={styles.label}>Email:</Text> {email}</Text>
            <Text style={styles.detail}><Text style={styles.label}>Phone:</Text> {phone}</Text>
            <Text style={styles.detail}><Text style={styles.label}>Date of Birth:</Text> {dob}</Text>
            <Text style={styles.detail}><Text style={styles.label}>Prediction:</Text> {prediction}</Text>
            <ScrollView style={styles.reportTextContainer}>
              <Text style={styles.reportText}>{report_text}</Text>
            </ScrollView>
          </View>
        </View>
      )}
    </DrawerLayoutAndroid>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#C3BDF3',
  },
  menuButton: {
    marginTop:50,
    alignSelf: 'flex-start',
    padding: 10,
    marginVertical: 10,
  },
  menuButtonText: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: '#C3BDF3',
    padding: 20,
  },
  drawerHeader: {
    marginTop:30,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  drawerButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginVertical: 5,
  },
  drawerButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A3E75',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  detail: {
    fontSize: 16,
    color: '#4A3E75',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  reportTextContainer: {
    maxHeight: 200, 
    marginTop: 10,
  },
  reportText: {
    fontSize: 14,
    color: '#4A3E75',
    lineHeight: 20,
    textAlign: 'justify', 
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  icon: {
    marginRight: 10,
  },
});
