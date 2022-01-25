import { View, Image, StyleSheet, ActivityIndicator, Dimensions, useColorScheme, Alert } from "react-native";
import { useHeaderHeight } from '@react-navigation/elements';
import { BarCodeScanner } from "expo-barcode-scanner";
import React, { useState, useEffect } from "react";
import { DetailsStyles } from "./DetailsStyles";
import * as FileSystem from 'expo-file-system';
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
	return obj;
}

const AsyncAlert = async () => new Promise((resolve) => {
	Alert.alert("Falsche Orientierung", "Die App unterstüzt nur Fotos im 'hochkant' Format.", [{
		style: "cancel",
		text: "Zurück",
		onPress: () => {
			resolve();
		},
	}], { cancelable: false });
});

export function Details({route, navigation}) {
	const [processing, setProcessing] = useState(true);
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
			result = result.map( code => applyingScale(code, scale));

			setCodes(result);
			setProcessing(false);
		})();
	}, []);

	return (
		<View style={DetailsStyles.container}>
			<Image 
				blurRadius={processing ? 100 : 0}
				source={{uri: photo.uri}} 
				style={DetailsStyles.backgroundImage}
				resizeMode="cover"
			/>
			<BlurView
				intensity={100}
				tint={scheme === "dark" ? "dark" : "light"}
				style={[DetailsStyles.headerBackground, {height: headerHeight}]}
			/>
			{ processing &&
				<ActivityIndicator size="large" style={DetailsStyles.spinner}/>
			}
			{codes.map(function(code, index) {
				return (
					<View 
						key={index} 
						style={[ 
							DetailsStyles.overlays, 
							{
								left: code.y + 20,
								top: code.x + 20,
								width: code.size - 40,
								height: code.size - 40,
								borderRadius: (code.size - 40) / 2
							}
						]}
					/>
				)
            })}
		</View>
	);
}
