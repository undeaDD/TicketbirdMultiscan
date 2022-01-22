import React, { useState, useEffect, useRef } from "react";
import { Text, View, StyleSheet, Platform, useColorScheme, TouchableOpacity, useWindowDimensions } from "react-native";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BarCodeScanner } from "expo-barcode-scanner";
import * as FileSystem from 'expo-file-system';
import { Camera } from "expo-camera";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import Constants from "expo-constants";
import { BlurView } from "expo-blur";

export const ScannerOptions = {
	title: "Scanner",
	headerShown: false,
	tabBarLabel: "Scanner",
	tabBarIcon: ({ color, size }) => (
		<MaterialIcons name="qr-code-scanner" size={size} color={color} />
	),
};

export function Scanner() {
	const scheme = useColorScheme();
	const width = useWindowDimensions().width;
	const tabBarHeight = useBottomTabBarHeight();
	const [hasPermission, setHasPermission] = useState(null);
	const [flashMode, setFlashMode] = useState(false);
	const cameraRef = useRef(null);

	useEffect(() => {
		(async () => {
			const { status } = await BarCodeScanner.requestPermissionsAsync();
			setHasPermission(status === "granted");
		})();
	}, []);

	const toggleFlash = async () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		setFlashMode(!flashMode)
	}

	const takePhoto = async () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
		const photo = await cameraRef.current.takePictureAsync();
		BarCodeScanner.scanFromURLAsync(photo.uri, [BarCodeScanner.Constants.BarCodeType.qr]).then( (result) => {
			FileSystem.deleteAsync(photo.uri);
			const data = result.map((obj) => obj.data);
			console.log("Ergebnisse: " + data);
			alert("Ergebnisse: " + data);
		});
	}

	if (hasPermission === null) {
		return <Text>Requesting for camera permission</Text>;
	}
	if (hasPermission === false) {
		return <Text>No access to camera</Text>;
	}

	return (
		<View style={StyleSheet.absoluteFillObject}>
			<Camera
				ref={cameraRef}
				flashMode={flashMode ? Camera.Constants.FlashMode.on : Camera.Constants.FlashMode.off}
				type={Platform.OS === "web" ? Camera.Constants.Type.front : Camera.Constants.Type.back}
				videoStabilizationMode={Camera.Constants.VideoStabilization.auto}
				style={StyleSheet.absoluteFillObject}
			/>
			<BlurView
				tint={scheme === "dark" ? "dark" : "light"}
				intensity={100}
				style={{ height: Constants.statusBarHeight, width: "100%" }}
			/>
			<TouchableOpacity 
				style={{width: 30, height: 30, margin: 15 }}
				activeOpacity={0.9}
				onPress={toggleFlash}
			>
				<MaterialCommunityIcons
					name="flash-circle"
					size={30}
					color="black"
					style={{
						backgroundColor: flashMode ? "yellow" : "white",
						borderRadius: 15,
						width: 30,
						overflow: "hidden",
						height: 30,
					}}
				/>
			</TouchableOpacity>
			<TouchableOpacity 
				style={{width: 70, height: 70, bottom: tabBarHeight + 10, borderColor: "white", borderWidth: 4, borderRadius: 35, left: width / 2 - 35, position: "absolute", backgroundColor: "black"}}
				activeOpacity={0.5}
				onPress={takePhoto}
			>
			</TouchableOpacity>
		</View>
	);
}
