import React, {  useRef, useState } from 'react';
import {doc,updateDoc,arrayUnion} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { PDFDocument,rgb } from 'pdf-lib';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  DrawerLayoutAndroid,
  Modal,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import {Image} from 'react-native';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { fullnameState,usernameState,dobstate,emailstate } from '../atoms/state';
import { encode } from 'base64-arraybuffer';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';


const UploadImage = ({ navigation }) => {
  const drawer = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri,setImageUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 
  const fullName = useRecoilValue(fullnameState);
  const username = useRecoilValue(usernameState);
  const dob = useRecoilValue(dobstate);
  const email = useRecoilValue(emailstate);

  const handleNavigation = (screenName) => {
    drawer.current.closeDrawer();
    navigation.navigate(screenName);
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log('Image from camera:', result.assets[0].uri);
      setImageUri(result.assets[0].uri);
    }
  };

  const openGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log('Image name:', result.assets);
      console.log('Image from gallery:', result.assets[0].uri);
      setImageUri(result.assets[0].uri);
    }
  };

 const handleGenerateReport = async () => {
  if (!imageUri) {
    alert('Please select an image to generate report!');
    return;
  }
  setIsLoading(true);

  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'image.jpg',
  });

  try {
    const response = await axios.post(
      'https://e009-34-132-82-185.ngrok-free.app/predict/',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data', 'Accept': 'application/json' } }
    );

    const prediction = response.data.prediction;
    const probabilities = response.data.all_probabilities;

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    page.drawText("DiabeVision", { x: 50, y: 750, size: 30, color: rgb(0, 0, 1) });

    // Add User Info
    page.drawText(`Full Name: ${fullName}`, { x: 50, y: 700 });
    page.drawText(`Email: ${email}`, { x: 50, y: 680 });
    page.drawText(`Username: ${username}`, { x: 50, y: 660 });
    page.drawText(`DOB: ${dob}`, { x: 50, y: 640 });

    // Add Prediction Info
    page.drawText("Prediction:", { x: 50, y: 600 });
    page.drawText(`Class: ${prediction.class}`, { x: 50, y: 580 });
    page.drawText(`Confidence: ${prediction.confidence}`, { x: 50, y: 560 });

    // Save PDF to byte array
    const pdfBytes = await pdfDoc.save();
    const fileUri = `${FileSystem.documentDirectory}${username}_${Date.now()}.pdf`;

    // Write the PDF to the file system
    await RNFetchBlob.fs.writeFile(fileUri, pdfBytes, 'base64');

    // Upload PDF to Firebase Storage
    const storage = getStorage();
    const storageRef = ref(storage, `reports/${username}_${Date.now()}.pdf`);
    const pdfBase64 = await RNFetchBlob.fs.readFile(fileUri, 'base64');
    const metadata = { contentType: 'application/pdf' };

    await uploadString(storageRef, pdfBase64, 'base64', metadata);

    // Get Download URL
    const downloadURL = await getDownloadURL(storageRef);

    // Update Firestore
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userDocRef, {
      reports: arrayUnion({
        timestamp: new Date().toISOString(),
        prediction: prediction.class,
        confidence: prediction.confidence,
        url: downloadURL,
      }),
    });

    // Optionally Share the File
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    } else {
      alert("PDF saved to device, but sharing is not available.");
    }

    alert("Report generated and saved successfully.");
  } catch (error) {
    console.error("Error generating report:", error);
  } finally {
    setIsLoading(false);
  }
};

  const navigationView = () => (
    <View style={styles.drawerContainer}>
      <Text style={styles.drawerHeader}>MENU</Text>
      <TouchableOpacity style={styles.drawerButton}>
        <View style={styles.iconButtonContainer}>
          <Icon name="home" size={20} color="#FFFFFF" style={styles.icon} />
          <Text
            style={styles.drawerButtonText}
            onPress={() => handleNavigation('Home')}
          >
            Home Page
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.drawerButton}>
        <View style={styles.iconButtonContainer}>
          <Icon name="image" size={20} color="#FFFFFF" style={styles.icon} />
          <Text
            style={styles.drawerButtonText}
            onPress={() => handleNavigation('UploadImage')}
          >
            Upload Image
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.drawerButton}>
        <View style={styles.iconButtonContainer}>
          <Icon name="file" size={20} color="#FFFFFF" style={styles.icon} />
          <Text style={styles.drawerButtonText}>Get Reports</Text>
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
        <Text style={styles.header}>Upload Image</Text>
        <View style={styles.uploadCard}>
        <TouchableOpacity
  style={styles.imagePlaceholder}
  onPress={() => setModalVisible(true)}
>
  {imageUri ? (
    <Image
      source={{ uri: imageUri }}
      style={{ width: '100%', height: '100%', borderRadius: 10 }}
    />
  ) : (
    <Icon name="picture-o" size={80} color="#B0B0B0" />
  )}
</TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText} onPress={()=>handleGenerateReport()}> {isLoading ? (
                      <ActivityIndicator size="small" color="#fff" /> 
                    ) : (
                      "Generate Report"
                    )}</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
              <Text style={styles.modalHeader}>Select an Option</Text>
              <TouchableOpacity style={styles.modalButton} onPress={openCamera}>
                <Text style={styles.modalButtonText}>Open Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={openGallery}
              >
                <Text style={styles.modalButtonText}>Select from Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  imagePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  button: {
    backgroundColor: '#6C63FF',
    borderRadius: 10,
    width: '50%',
    height: 50,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#6C63FF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UploadImage;
