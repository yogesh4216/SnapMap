import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import type { CameraType } from "expo-camera";

export default function CameraScreen() {
  const cameraRef = useRef<CameraView | null>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  /* -------------------- Permissions -------------------- */
  useEffect(() => {
    (async () => {
      const galleryPermission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!galleryPermission.granted) {
        Alert.alert(
          "Permission required",
          "Gallery permission is required."
        );
      }
    })();
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Camera permission is required
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionBtn}>
          <Text style={styles.permissionBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* -------------------- Camera Actions -------------------- */
  const takePhoto = async () => {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync();
    setPreviewUri(photo.uri);
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setPreviewUri(result.assets[0].uri);
    }
  };

  const flipCamera = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  /* -------------------- Preview Screen -------------------- */
  if (previewUri) {
    return (
      <View style={styles.previewContainer}>
        <Image source={{ uri: previewUri }} style={styles.previewImage} />

        <View style={styles.previewActions}>
          <TouchableOpacity
            style={styles.previewBtn}
            onPress={() => setPreviewUri(null)}
          >
            <Text style={styles.previewText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.previewBtn}
            onPress={() => {
              Alert.alert("Success", "Image ready for upload");
              setPreviewUri(null);
            }}
          >
            <Text style={styles.previewText}>Upload</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  /* -------------------- Camera Screen -------------------- */
  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
      />

      <View style={styles.controls}>
        <TouchableOpacity onPress={pickFromGallery}>
          <Text style={styles.controlText}>Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shutter} onPress={takePhoto}>
          <View style={styles.shutterInner} />
        </TouchableOpacity>

        <TouchableOpacity onPress={flipCamera}>
          <Text style={styles.controlText}>Flip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* -------------------- Styles -------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },

  /* Controls */
  controls: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    paddingHorizontal: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  controlText: {
    color: "white",
    fontSize: 16,
    minWidth: 60,
    textAlign: "center",
  },

  /* Shutter */
  shutter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  shutterInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
  },

  /* Preview */
  previewContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: "90%",
    height: "70%",
    borderRadius: 10,
  },
  previewActions: {
    flexDirection: "row",
    marginTop: 20,
    gap: 20,
  },
  previewBtn: {
    padding: 12,
    backgroundColor: "#e74c3c",
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  previewText: {
    color: "white",
    fontSize: 16,
  },

  /* Permission */
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  permissionText: {
    color: "white",
    marginBottom: 20,
  },
  permissionBtn: {
    backgroundColor: "#e74c3c",
    padding: 12,
    borderRadius: 8,
  },
  permissionBtnText: {
    color: "white",
    fontSize: 16,
  },
});