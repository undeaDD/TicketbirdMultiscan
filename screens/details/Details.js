import { View, Image, ActivityIndicator, Dimensions, useColorScheme, Alert } from "react-native";
import { useHeaderHeight } from '@react-navigation/elements';
import { BarCodeScanner } from "expo-barcode-scanner";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { DetailsStyles } from "./DetailsStyles";
import * as FileSystem from 'expo-file-system';
import { executeAlgorithm } from "../../Logic";
import { BlurView } from "expo-blur";

export const DetailsOptions = {
	title: "Ergebnisse",
	headerShown: true
};

const getImageSize = async uri => new Promise(resolve => {
	Image.getSize(uri, (width, height) => {
		resolve({width, height});
	});
})

const applyingScale = (code, scale) => {
	const obj = {};
	obj.data = code.data;
	obj.x = parseFloat(code.bounds.origin.x) * scale;
	obj.y = parseFloat(code.bounds.origin.y) * scale;
	obj.size = code.bounds.size.width * scale;
	obj.success = false;
	obj.icon = "cancel";
	return obj;
}

const AsyncAlert = async () => new Promise((resolve) => {
	Alert.alert("Falsche Orientierung", "Die App unterstüzt nur Fotos im 'hochkant' Format.", [{
		style: "cancel",
		text: "Zurück",
		onPress: () => { resolve(); }
	}], { cancelable: false });
});

export function Details({route, navigation}) {
	const [codes, setCodes] = useState([]);
	const headerHeight = useHeaderHeight();
	const scheme = useColorScheme();
	const { photo } = route.params;

	useEffect(() => {
		(async () => {
			const {width, height} = await getImageSize(photo.uri);
			const scale = Dimensions.get('window').width / width;

			if (width > height) {
				await AsyncAlert();
				navigation.goBack();
				FileSystem.deleteAsync(photo.uri);
				return;
			}

			var result = await BarCodeScanner.scanFromURLAsync(photo.uri, [BarCodeScanner.Constants.BarCodeType.qr]);
			result = result.map((code) => applyingScale(code, scale));
			result = executeAlgorithm(result);

			setCodes(result);
		})();
	}, []);

	return (
		<View style={DetailsStyles.container}>
			<Image 
				source={{uri: photo.uri}} 
				style={DetailsStyles.backgroundImage}
				resizeMode="cover"
			/>
			{codes.map(function(code, index) {
				return (
					<View 
						key={index} 
						style={[ 
							DetailsStyles.overlays, 
							{
								left: code.y + 10,
								top: code.x + 10,
								width: code.size - 20,
								height: code.size - 20,
								borderRadius: (code.size - 20) / 2,
								backgroundColor: code.success ? "#00ff00bb" : "#ff0000bb"
							}
						]}
					>
						<MaterialIcons name={code.icon} size={code.size - 40} color={code.success ? "black" : "white"} />
					</View>
				)
            })}

			<BlurView
				intensity={100}
				tint={scheme === "dark" ? "dark" : "light"}
				style={[DetailsStyles.headerBackground, {height: codes.length === 0 ? "100%" : headerHeight}]}
			/>

			{ codes.length === 0 &&
				<ActivityIndicator size="large" style={DetailsStyles.spinner}/>
			}
		</View>
	);
}
