import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, DrawerLayoutAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const UploadImage = ({ navigation }) => {
   const drawer = useRef(null);
   const handleNavigation = (screenName) => {
    drawer.current.closeDrawer(); 
    navigation.navigate(screenName);
  };

   const navigationView = () =>{
    return(
    <View style={styles.drawerContainer}>
    <Text style={styles.drawerHeader}>MENU</Text>
    <TouchableOpacity style={styles.drawerButton}>
      <View style={styles.iconButtonContainer}>
        <Icon name="home" size={20} color="#FFFFFF" style={styles.icon} />
        <Text style={styles.drawerButtonText} onPress={()=>handleNavigation('Home')}>Home Page</Text>
      </View>
    </TouchableOpacity>
    <TouchableOpacity style={styles.drawerButton}>
      <View style={styles.iconButtonContainer}>
        <Icon name="image" size={20} color="#FFFFFF" style={styles.icon} />
        <Text style={styles.drawerButtonText} onPress={() =>handleNavigation('UploadImage')}>Upload Image</Text>
      </View>
    </TouchableOpacity>
    <TouchableOpacity style={styles.drawerButton}>
      <View style={styles.iconButtonContainer}>
        <Icon name="file" size={20} color="#FFFFFF" style={styles.icon} />
        <Text style={styles.drawerButtonText}>Get Reports</Text>
      </View>
    </TouchableOpacity>
  </View>)
   }
    return (
        <DrawerLayoutAndroid
      ref={drawer}
      drawerWidth={250}
      drawerPosition="left"
      renderNavigationView={navigationView}>

    <View style={styles.container}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => drawer.current.openDrawer()} 
      >
        <Text style={styles.menuButtonText}>☰ Menu</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Upload Image</Text>
      <View style={styles.uploadCard}>

      <View style={styles.imagePlaceholder}>
             <Icon name="picture-o" size={80} color="#B0B0B0" />
      </View>
        <TouchableOpacity 
          style={styles.button} 
          
        >
          <Text style={styles.buttonText}>Generate Report</Text>
        </TouchableOpacity>
      </View>
    </View>
    </DrawerLayoutAndroid>
  );
};

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
    marginBottom: 20,
  },
  uploadCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15, 
    alignItems: 'center',
    width: '100%',
    maxHeight: 400, 
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  uploadText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6C63FF',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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

export default UploadImage;
