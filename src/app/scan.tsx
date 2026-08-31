import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);

  // Permission is still loading
  if (!permission) {
    return <View style={styles.container} />;
  }

  // Camera permission not granted
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          We need permission to access your camera.
        </Text>

        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>
            Allow Camera
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const takePicture = async () => {
    if (!cameraRef) return;

    try {
      const photo = await cameraRef.takePictureAsync();

      console.log("Photo taken:", photo);

      Alert.alert(
        "Photo Taken",
        "Your image was captured successfully."
      );
    } catch (error) {
      console.log("Camera error:", error);

      Alert.alert(
        "Error",
        "Unable to take a photo. Please try again."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Small Logo */}
      <View style={styles.smallLogo}>
        <Text style={styles.logoText}>LOGO</Text>
      </View>

      {/* Real Camera */}
      <View style={styles.cameraContainer}>
        <CameraView
          ref={(ref) => setCameraRef(ref)}
          style={styles.camera}
          facing="back"
        />
      </View>

      {/* Capture Button */}
      <TouchableOpacity
        style={styles.scanButton}
        onPress={takePicture}
        activeOpacity={0.8}
      >
        <View style={styles.scanCircle} />
      </TouchableOpacity>

      {/* AI Assistant Button */}
      <TouchableOpacity style={styles.botButton}>
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={30}
          color="#F7F4F0"
        />

        <View style={styles.botDots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B9CDDC",
  },

  permissionContainer: {
    flex: 1,
    backgroundColor: "#B9CDDC",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  permissionText: {
    fontSize: 16,
    textAlign: "center",
    color: "#27348A",
    marginBottom: 20,
  },

  permissionButton: {
    backgroundColor: "#27348A",
    paddingHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 25,
  },

  permissionButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  smallLogo: {
    position: "absolute",
    top: 15,
    right: 12,
    width: 50,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#F3F0EC",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  logoText: {
    fontSize: 9,
    color: "#222",
  },

  cameraContainer: {
    width: "79%",
    height: 340,
    alignSelf: "center",
    marginTop: 130,
    borderRadius: 22,
    overflow: "hidden",
  },

  camera: {
    flex: 1,
  },

  scanButton: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 8,
    borderColor: "#27348A",
    backgroundColor: "#F7F4F0",
    alignSelf: "center",
    marginTop: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  scanCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#F7F4F0",
  },

  botButton: {
    position: "absolute",
    bottom: 24,
    right: 12,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#27348A",
    justifyContent: "center",
    alignItems: "center",
  },

  botDots: {
    flexDirection: "row",
    position: "absolute",
    top: 30,
    gap: 3,
  },

  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#F7F4F0",
  },
});