import React, {  useEffect, useRef, useState } from 'react';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from '../firebaseConfig';
import { PDFDocument,rgb } from 'pdf-lib';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  DrawerLayoutAndroid,
  Modal,
  Alert,

} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import {Image} from 'react-native';
import axios from 'axios';
import { useRecoilValue,useRecoilState } from 'recoil';
import { fullnameState,usernameState,dobstate,emailstate,phoneState,uidState} from '../atoms/state';
import { encode as base64Encode } from 'base64-arraybuffer'; 

const UploadImage = ({ navigation }) => {
  const drawer = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri,setImageUri] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [isLoading_temp,setIsLoading_temp]=useState(false);
  const fullName = useRecoilValue(fullnameState);
  const username = useRecoilValue(usernameState);
  const dob = useRecoilValue(dobstate);
  const email = useRecoilValue(emailstate);
  const phoneNumber = useRecoilValue(phoneState);
  const uid = useRecoilValue(uidState);
  const [prediction_class, setPrediction] = useState('');
  const [uid_temp,setUid] = useRecoilState(uidState);

  
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
      setModalVisible(false);
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
      setImageUri(result.assets[0].uri);
      setModalVisible(false);
    }
  };
  
  const handleGenerateReport = async () => {
    if (!imageUri) {
      alert('Please select an image to generate a report!');
      return;
    }
    setIsLoading_temp(true);
  
    try {
      const form_Data = new FormData();
      form_Data.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'image.jpg',
      });
      const res = await axios.post(
        'https://58e9-34-106-61-49.ngrok-free.app/predict/',
        form_Data,
        { headers: { 'Content-Type': 'multipart/form-data', 'Accept': 'application/json' } }
      );
  
      const prediction = res.data.prediction.class;
      setPrediction(prediction);
      const report_text = res.data.professional_paragraph;
  
      // Create PDF with professional layout
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 800]);
      const { height, width } = page.getSize();
  
      // Add pink background with rounded corners
      page.drawRectangle({
        x: 10,
        y: 10,
        width: width - 40,
        height: height - 40,
        color: rgb(1, 0.9, 0.9),
        borderColor: rgb(0.8, 0.8, 0.8),
        borderWidth: 1,
      //  rotate: degrees(0),
      //  borderRadius: 20,
      });
  
      // Add title
      page.drawText("DiabeVision", {
        x: width / 2 - 50,
        y: height - 80,
        size: 24,
        color: rgb(0, 0, 0),
      });
  
      // Left side - User Information
      let currentY = height - 120;
      const leftMargin = 40;
      const userDetails = [
        `Full Name: ${fullName}`,
        `Email: ${email}`,
        `Username: ${username}`,
        `DOB: ${dob}`,
        `Phone Number: ${phoneNumber}`,
      ];
  
      userDetails.forEach((detail) => {
        page.drawText(detail, {
          x: leftMargin,
          y: currentY,
          size: 12,
          color: rgb(0, 0, 0),
        });
        currentY -= 25;
      });
  
    
      const imageResponse = await fetch(imageUri);
      const imageBytes = await imageResponse.arrayBuffer();
      const image = await pdfDoc.embedJpg(imageBytes);
      

      const rectX = width / 2 + 20; 
      const offset = 20; 
      const rectY = height - 240 + offset; 
      const rectWidth = (width / 2) - 80;
      const rectHeight = 100; 
      
    
      const imageDims = image.scale(Math.min(rectWidth / image.width, rectHeight / image.height));
      
    
      const imageX = rectX + (rectWidth - imageDims.width) / 2;
      const imageY = rectY - (rectHeight - imageDims.height) / 2;
      
      page.drawImage(image, {
        x: imageX,
        y: imageY,
        width: imageDims.width,
        height: imageDims.height,
      });
  
    
      currentY = height - 280;
      page.drawLine({
        start: { x: 40, y: currentY },
        end: { x: width - 40, y: currentY },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
  
     
      currentY -= 40;
      page.drawText("Predicted Class", {
        x: width/2 - 50,
        y: currentY,
        size: 16,
        color: rgb(0, 0, 0),
      });
  
      currentY -= 30;
      page.drawText(prediction, {
        x: width/2 - prediction.length * 3,
        y: currentY,
        size: 14,
        color: rgb(0, 0, 0),
      });
  
     
      currentY -= 20;
      page.drawLine({
        start: { x: 40, y: currentY },
        end: { x: width - 40, y: currentY },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
  
    
      currentY -= 40;
      const formattedText = report_text.match(/.{1,80}(\s|$)|\S+(\s|$)/g);
      formattedText.forEach((line) => {
        if (currentY > 40) { 
          page.drawText(line.trim(), {
            x: 40,
            y: currentY,
            size: 12,
            color: rgb(0, 0, 0),
          });
          currentY -= 20;
        }
      });
  
      const pdfBytes = await pdfDoc.save();
      const base64Data = base64Encode(pdfBytes);
  
      const formData = new FormData();
      formData.append('file', `data:application/pdf;base64,${base64Data}`);
      formData.append('upload_preset', 'upload_preset');
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/dzo0hotjl/upload`;
  
      const response = await axios.post(cloudinaryUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.data.secure_url) {
        await updateFirestore(response.data.secure_url, prediction, report_text);
        alert('Report generated and saved successfully.');
        setImageUri(null);
        navigation.navigate('PatientReports');
      } else {
        alert('Failed to upload report to Cloudinary.');
      }
    } catch (error) {
      console.error("Error generating report:", error.message);
      alert("An error occurred while generating the report.");
    } finally {
      setIsLoading_temp(false);
    }
  };
  
  
  const updateFirestore = async (downloadURL,prediction,report_text) => {
    try {
      const userDocRef = doc(db, 'users', uid); 
      const docSnap = await getDoc(userDocRef);
      
      if (docSnap.exists()) {
        await updateDoc(userDocRef, {
          reports: arrayUnion({
            date: new Date().toISOString(),
            reportUrl: downloadURL,
            prediction: prediction,
            report_text:report_text,
          }),
        });
      } else {
        await setDoc(userDocRef, {
          email: email,
          fullName: fullName,
          dob: dob,
          phoneNumber: phoneNumber,
          uid: uid,
          username: username,
          createdAt: new Date().toISOString(),
          reports: [{
            date: new Date().toISOString(),
            reportUrl: downloadURL,
            prediction: prediction,
            report_text:report_text,
          }],
        });
      }
  
      console.log('Document successfully updated/created!');
    } catch (error) {
      console.error('Error updating/creating document: ', error);
      alert("An error occurred while updating Firestore.");
    }
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
       <TouchableOpacity style={styles.drawerButton} onPress={()=> navigation.navigate("PatientReports")}>
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
            <Text style={styles.buttonText} onPress={()=>handleGenerateReport()}> {isLoading_temp ? (
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
      </View>)}
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UploadImage;
