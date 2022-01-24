import { View, Image, StyleSheet, ActivityIndicator, Dimensions } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import React, { useState, useEffect } from "react";
import { DetailsStyles } from "./DetailsStyles";

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
	obj.x = code.bounds.origin.x * scale.width;
	obj.y = code.bounds.origin.y * scale.height;
	obj.width = code.bounds.size.width * scale.width;
	obj.height = code.bounds.size.height * scale.height;
	return obj;
}

export function Details({route}) {
	const [processing, setProcessing] = useState(true);
	const [codes, setCodes] = useState([]);
	const { photo } = route.params;

	useEffect(() => {
		(async () => {
			const {width, height} = await getImageSize(photo.uri);
			const dim = Dimensions.get('window');
			const scale = {width: dim.width / width, height: dim.height / height};

			var result = await BarCodeScanner.scanFromURLAsync(photo.uri, [BarCodeScanner.Constants.BarCodeType.qr]);
			
			result = result.map( code => applyingScale(code, scale));

			console.log("Ergebnisse: ", result);
			await new Promise(resolve => setTimeout(resolve, 2000))

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
			/>
			{ processing &&
				<ActivityIndicator size="large" style={DetailsStyles.spinner}/>
			}

			{codes.map(function(code, index) {
				return (<View key={index} style={{backgroundColor: "green", position: "absolute", left: code.x, top: code.y, width: code.width, height: code.height}}/>)
            })}
		</View>
	);
}
