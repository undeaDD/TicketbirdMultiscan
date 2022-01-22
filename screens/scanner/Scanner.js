import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Platform, useColorScheme, TouchableOpacity } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Camera } from "expo-camera";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
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
	const [hasPermission, setHasPermission] = useState(null);
	const [scanned, setScanned] = useState(true);

	useEffect(() => {
		(async () => {
			const { status } = await BarCodeScanner.requestPermissionsAsync();
			setHasPermission(status === "granted");
		})();
	}, []);

	const handleBarCodeScanned = ({ type, data }) => {
		setScanned(true);
		alert(`Bar code with type ${type} and data ${data} has been scanned!`);
	};

	if (hasPermission === null) {
		return <Text>Requesting for camera permission</Text>;
	}
	if (hasPermission === false) {
		return <Text>No access to camera</Text>;
	}

	return (
		<View style={StyleSheet.absoluteFillObject}>
			<Camera
				type={
					Platform.OS === "web" ? Camera.Constants.Type.front : Camera.Constants.Type.back
				}
				barCodeScannerSettings={{
					barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
				}}
				onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
				style={StyleSheet.absoluteFillObject}
			/>
			<BlurView
				tint={scheme === "dark" ? "dark" : "light"}
				intensity={100}
				style={{ height: Constants.statusBarHeight, width: "100%" }}
			/>
			<TouchableOpacity activeOpacity={0.9}>
				<MaterialCommunityIcons
					name="flash-circle"
					size={30}
					color="black"
					style={{
						margin: 10,
						backgroundColor: "yellow",
						borderRadius: 15,
						width: 30,
						overflow: "hidden",
						height: 30,
					}}
				/>
			</TouchableOpacity>
		</View>
	);
}
