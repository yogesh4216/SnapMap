import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import type { ScreenProps } from "../types";
import { FontAwesome } from "@expo/vector-icons";


const MapScreen = ({ navigation }: ScreenProps<"MapScreen">) => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status == "granted") {
        console.log("Permission successful");
      } else {
        console.log("Permission not granted");
      }

      const loc = await Location.getCurrentPositionAsync();

      console.log(loc);
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  if (!location) {
    return (
      <View style={styles.loading}>
        <Text>Fetching location...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        }}
        showsUserLocation
        showsMyLocationButton
      />
    <TouchableOpacity style={styles.cameraButton}>
        <FontAwesome name="camera" size={20} color="white" />
    </TouchableOpacity>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraButton: {
    position: "absolute",  
    bottom: 100,    
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#DB001A", 
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,         
  },
});
