import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import { uidState } from "../atoms/state";
import { useRecoilValue } from "recoil";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore"; 

const PatientReports = () => {
  const [reports, setReports] = useState([]);
  const uid = useRecoilValue(uidState); 

  // Fetch reports from Firestore
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
      }
    };
    fetchReports();
  }, []);

  // Handle viewing the report
  const handleView = async (url) => {
    try {
      const fileUri = `${FileSystem.documentDirectory}${url.split("/").pop()}`;
      const downloadResumable = FileSystem.createDownloadResumable(url, fileUri);
      const { uri } = await downloadResumable.downloadAsync();
      await FileSystem.openDocumentAsync(uri);
    } catch (error) {
      console.error("Error viewing the report:", error);
      Alert.alert("Failed to view the report.");
    }
  };

  // Handle printing the report
  const handlePrint = async (url) => {
    try {
      const fileUri = `${FileSystem.documentDirectory}${url.split("/").pop()}`;
      const downloadResumable = FileSystem.createDownloadResumable(url, fileUri);
      const { uri } = await downloadResumable.downloadAsync();
      const fileBase64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Print.printAsync({
        html: `<iframe src="data:application/pdf;base64,${fileBase64}" style="width:100%;height:100%;"></iframe>`,
      });
    } catch (error) {
      console.error("Error printing the report:", error);
      Alert.alert("Failed to print the report.");
    }
  };

  const renderReport = ({ item, index }) => (
    <View style={styles.reportContainer}>
      <Text style={styles.reportName}>Report {index + 1}</Text>
      <TouchableOpacity style={styles.button} onPress={() => handleView(item.reportUrl)}>
        <Text style={styles.buttonText}>VIEW</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => handlePrint(item.reportUrl)}>
        <Text style={styles.buttonText}>PRINT</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patient Reports</Text>
      <FlatList
        data={reports}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderReport}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f3f4f6",
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
});

export default PatientReports;
