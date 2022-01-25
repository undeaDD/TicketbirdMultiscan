import { View, Image, StyleSheet, ActivityIndicator, Dimensions, useColorScheme } from "react-native";
import { useHeaderHeight } from '@react-navigation/elements';
import { BarCodeScanner } from "expo-barcode-scanner";
import React, { useState, useEffect } from "react";
import { DetailsStyles } from "./DetailsStyles";
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
	obj.x = parseFloat(code.bounds.origin.x) * scale.width;
	obj.y = parseFloat(code.bounds.origin.y) * scale.height;
	obj.width = 5  // code.bounds.size.width * scale.width;
	obj.height = 5 // code.bounds.size.height * scale.height;

	console.log(obj)
	return obj;
}

export function Details({route}) {
	const [processing, setProcessing] = useState(true);
	const [codes, setCodes] = useState([]);
	const headerHeight = useHeaderHeight();
	const scheme = useColorScheme();
	const { photo } = route.params;

	useEffect(() => {
		(async () => {
			const {width, height} = await getImageSize(photo.uri);
			const dim = Dimensions.get('window');
			const scale = {width: parseFloat(dim.width) / parseFloat(width), height: parseFloat(dim.height) / parseFloat(height)};

			var result = await BarCodeScanner.scanFromURLAsync(photo.uri, [BarCodeScanner.Constants.BarCodeType.qr]);
			result = result.map( code => applyingScale(code, scale));

			setCodes(result);
			setProcessing(false);
			// remove photo from cache: FileSystem.deleteAsync(photo.uri);
		})();
	}, []);

	return (
		<View style={StyleSheet.absoluteFill}>
			<Image 
				blurRadius={processing ? 100 : 0}
				source={{uri: photo.uri}} 
				style={StyleSheet.absoluteFill}
				resizeMode="cover"
			/>
			<BlurView
				intensity={100}
				tint={scheme === "dark" ? "dark" : "light"}
				style={{width: "100%", position: "absolute", left: 0, top: 0, height: headerHeight}}
			/>
			{ processing &&
				<ActivityIndicator size="large" style={DetailsStyles.spinner}/>
			}

			{codes.map(function(code, index) {
				return (<View key={index} style={{backgroundColor: "green", position: "absolute", left: index * 20, top: code.y, width: 20, height: 20}}/>)
            })}
		</View>
	);
}
