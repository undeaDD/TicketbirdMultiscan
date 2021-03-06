import { View, Platform, useColorScheme, TouchableOpacity, useWindowDimensions, Alert } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect, useRef } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import { ScannerStyles as Styles } from "./Styles";
import { ButtonType } from "../details/Helper";
import * as Haptics from "expo-haptics";
import { log } from "../helper/logger";
import { BlurView } from "expo-blur";
import { Camera } from "expo-camera";

export const ScannerOptions = {
	title: "Scanner",
	headerShown: false,
	tabBarLabel: "Scanner",
	tabBarIcon: ({ color, size }) => (
		<MaterialIcons name="qr-code-scanner" size={size} color={color} />
	),
};

export function Scanner({navigation}) {
	const scheme = useColorScheme();
	const width = useWindowDimensions().width;
	const tabBarHeight = useBottomTabBarHeight();
	const [flashMode, setFlashMode] = useState(false);
	const [scanType, setScanType] = useState(false);
	const cameraRef = useRef(null);

	useEffect(() => {
		(async () => {
			const tempScanType = JSON.parse(await AsyncStorage.getItem("@scanType"));
			setScanType(tempScanType);

			const { status } = await BarCodeScanner.requestPermissionsAsync();
			if (status === undefined || status !== "granted") {
				Alert.alert("Kein Zugriff", "Die App benötigt Zugriff auf die Kamera, um die QRCodes einzuscannen.", [{
					style: "cancel",
					text: "Okay",
				}]);
			}
		})();
	}, []);

	const toggleFlash = async () => {
		Haptics.impactAsync("light");
		setFlashMode(!flashMode);
	};

	const takePhoto = async () => {
		try { 
			Haptics.impactAsync("heavy");
			var photo = await cameraRef.current.takePictureAsync();
			navigation.navigate("Details", {photo: photo});
		} catch(e) {
			log("Failed takePhoto: " + e);
		}
	};

	return (
		<View style={Styles.container}>
			<Camera
				ref={cameraRef}
				useCamera2Api={true}
				flashMode={flashMode ? "on" : "off"}
				type={Platform.OS === "web" ? "front" : "back"}
				videoStabilizationMode={Camera.Constants.VideoStabilization.auto}
				style={Styles.camera}
			/>
			<BlurView
				intensity={100}
				tint={scheme === "dark" ? "dark" : "light"}
				style={Styles.statusBarBackground}
			/>
			<TouchableOpacity 
				activeOpacity={0.9}
				onPress={toggleFlash}
				style={Styles.flashButtonContainer}
			>
				<MaterialCommunityIcons
					name="flash-circle"
					size={30}
					color="#000000dd"
					style={[
						{backgroundColor: flashMode ? "#ffff00" : "#ffffff"},
						Styles.flashButtonContent
					]}
				/>
			</TouchableOpacity>
			<TouchableOpacity
				activeOpacity={0.5}
				onPress={takePhoto}
				style={[
					{bottom: tabBarHeight + 10, left: width / 2 - 35}, { backgroundColor: ButtonType.getColor(scanType) }, {borderColor: "white"},
					Styles.takePictureButton
				]}
			>
				<MaterialCommunityIcons
					name={ ButtonType.getIcon(scanType) }
					size={40}
					color="#ffffffdd"
					style={Styles.takePictureIcon}
				/>
			</TouchableOpacity>
		</View>
	);
}
