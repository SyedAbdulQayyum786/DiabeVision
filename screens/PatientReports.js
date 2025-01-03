import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, DrawerLayoutAndroid, ActivityIndicator } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import { uidState } from "../atoms/state";
import { useRecoilState, useRecoilValue } from "recoil";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore"; 
import Icon from 'react-native-vector-icons/FontAwesome';

const PatientReports = ({navigation}) => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // State for loading indicator
  const uid = useRecoilValue(uidState); 
  const drawer = useRef(null);
  const [uid_temp, setUid] = useRecoilState(uidState);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: () => {
          setUid(""); 
          navigation.navigate('Landing')
        },
      },
    ]);
  };

  const navigationView = () => (
    <View style={styles.drawerContainer}>
      <Text style={styles.drawerHeader}>MENU</Text>
      <TouchableOpacity style={styles.drawerButton}  onPress={() => navigation.navigate('Home')}>
        <View style={styles.iconButtonContainer}>
          <Icon name="home" size={20} color="#FFFFFF" style={styles.icon} />
          <Text style={styles.drawerButtonText}>Home</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.drawerButton} onPress={() => navigation.navigate('UploadImage')}>
        <View style={styles.iconButtonContainer}>
          <Icon name="image" size={20} color="#FFFFFF" style={styles.icon} />
          <Text style={styles.drawerButtonText} >Upload Image</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.drawerButton}>
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
    const fetchReports = async () => {
      try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setReports(docSnap.data().reports || []);
        } else {
          Alert.alert("No reports found!");
        }
      } catch (error) {
        console.error("Error fetching reports: ", error);
      } finally {
        setIsLoading(false); 
      }
    };
    fetchReports();
  }, []);

  const handleView = (prediction) => {
    console.log(prediction);
    navigation.navigate('ReportDetails', { prediction });
  };

  const handlePrint = async (url) => {
    try {
      const fileUri = `${FileSystem.documentDirectory}${url.split("/").pop()}`;
      const downloadResumable = FileSystem.createDownloadResumable(url, fileUri);
      const { uri } = await downloadResumable.downloadAsync();
      await Print.printAsync({
        uri, 
      });
    } catch (error) {
      console.error("Error printing the report:", error);
      Alert.alert("Failed to print the report.");
    }
  };

  const renderReport = ({ item, index }) => (
    <View style={styles.reportContainer}>
      <Text style={styles.reportName}>Report {index + 1}</Text>
      <TouchableOpacity style={styles.button} onPress={() => handleView(item.prediction)}>
        <Text style={styles.buttonText}>VIEW</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => handlePrint(item.reportUrl)}>
        <Text style={styles.buttonText}>PRINT</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <DrawerLayoutAndroid
      key={Math.random()}
      ref={drawer}
      drawerWidth={250}
      drawerPosition="left"
      renderNavigationView={navigationView}
    >
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
        <Text style={styles.title}>Patient Reports</Text>
        {isLoading ? ( // Show ActivityIndicator while loading reports
          <ActivityIndicator size="large" color="#4f46e5" style={styles.loader} />
        ) : reports.length === 0 ? (
          <Text style={styles.noReportsText}>No reports to show</Text>
        ) : (
          <FlatList
            data={reports}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderReport}
          />
        )}
      </View>
    </DrawerLayoutAndroid>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#C3BDF3',
  },
  menuButton: {
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  reportContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#e0e7ff",
  },
  reportName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#4f46e5",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  iconButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  icon: {
    marginRight: 10,
  },
  noReportsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6C63FF",
    textAlign: "center",
    marginTop: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PatientReports;
