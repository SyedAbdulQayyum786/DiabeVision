import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  DrawerLayoutAndroid,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { about_text } from '../constants';
import { useRecoilValue } from 'recoil';
import { fullnameState, usernameState } from '../atoms/state';

export default function Home({ navigation }) {
  const drawer = useRef(null);
  const username = useRecoilValue(usernameState);
  const fullname = useRecoilValue(fullnameState);
  const avatarLetter = fullname?.charAt(0).toUpperCase();

 
  const handleNavigation = (screenName) => {
    drawer.current.closeDrawer();  
    navigation.navigate(screenName);
  };

  const navigationView = () => (
    <View style={styles.drawerContainer}>
      <Text style={styles.drawerHeader}>MENU</Text>
      <TouchableOpacity style={styles.drawerButton} onPress={() => handleNavigation('Home')}>
        <View style={styles.iconButtonContainer}>
          <Icon name="home" size={20} color="#FFFFFF" style={styles.icon} />
          <Text style={styles.drawerButtonText}>Home</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.drawerButton} onPress={() => handleNavigation('UploadImage')}>
        <View style={styles.iconButtonContainer}>
          <Icon name="image" size={20} color="#FFFFFF" style={styles.icon} />
          <Text style={styles.drawerButtonText}>Upload Image</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.drawerButton}>
        <View style={styles.iconButtonContainer}>
          <Icon name="file" size={20} color="#FFFFFF" style={styles.icon} />
          <Text style={styles.drawerButtonText} onPress={()=> handleNavigation("PatientReports")}>Get Reports</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <DrawerLayoutAndroid
      ref={drawer}
      drawerWidth={250}
      drawerPosition="left"
      renderNavigationView={navigationView}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => drawer.current.openDrawer()}
        >
          <Text style={styles.menuButtonText}>☰ Menu</Text>
        </TouchableOpacity>
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
        </View>
      </View>
    </DrawerLayoutAndroid>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C3BDF3',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  menuButton: {
    alignSelf: 'flex-start',
    padding: 10,
    marginVertical: 10,
  },
  menuButtonText: {
    fontSize: 18,
    color: '#6C63FF',
    fontWeight: 'bold',
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
  drawerContainer: {
    flex: 1,
    backgroundColor: '#C3BDF3',
    padding: 20,
  },
  drawerHeader: {
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
  iconButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  icon: {
    marginRight: 10,
  },
});
