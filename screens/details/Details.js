import { View, Image, ActivityIndicator, Dimensions, useColorScheme, Alert, StyleSheet } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { BarCodeScanner } from "expo-barcode-scanner";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState, useEffect, useRef } from "react";
import { DetailsStyles } from "./DetailsStyles";
import { WebView } from "react-native-webview";
import * as FileSystem from "expo-file-system";
import { BlurView } from "expo-blur";

export const DetailsOptions = {
	title: "Ergebnisse",
	headerShown: true
};

const getImageSize = async uri => new Promise(resolve => {
	Image.getSize(uri, (width, height) => {
		resolve({width, height});
	});
});

const applyingScale = (code, scale) => {
	const obj = {};
	obj.data = code.data;
	obj.x = parseFloat(code.bounds.origin.x) * scale;
	obj.y = parseFloat(code.bounds.origin.y) * scale;
	obj.size = code.bounds.size.width * scale;
	obj.success = false;
	obj.icon = "cancel";
	return obj;
};

const AsyncAlert = async () => new Promise((resolve) => {
	Alert.alert("Falsche Orientierung", "Die App unterstüzt nur Fotos im 'hochkant' Format.", [{
		style: "cancel",
		text: "Zurück",
		onPress: () => { resolve(); }
	}], { cancelable: false });
});

const onNavigationStateChange = (newNavigationState) => {

};

const onMessage = (messageEvent) => {
	console.log(messageEvent)
	waiting = true;
};

const onWebViewError = (error) => {
	console.log(error)
};

const onWebViewHTTPError = (error) => {
	console.log(error)
};

const onShouldStartLoadWithRequest = () => {
	return true;
};

const initialInjectedJavaScript = `
window.postMessage("test");
true;
`;

export function Details({route, navigation}) {
	const [url, setUrl] = useState([]);
	const [codes, setCodes] = useState([]);
	const headerHeight = useHeaderHeight();
	const webViewRef = useRef(null);
	const scheme = useColorScheme();
	const { photo } = route.params;

	var waiting = false;

	useEffect(() => {
		(async () => {
			const {width, height} = await getImageSize(photo.uri);
			const scale = Dimensions.get("window").width / width;

			if (width > height) {
				await AsyncAlert();
				navigation.goBack();
				FileSystem.deleteAsync(photo.uri);
				return;
			}

			var scans = await BarCodeScanner.scanFromURLAsync(photo.uri, [BarCodeScanner.Constants.BarCodeType.qr]);
			var result = [];

			for (const qrCode of scans) {
				var code = applyingScale(qrCode, scale)

				if (!code.data.startsWith("https://testcov-has.ticketbird.de/auswertung/")) {
					code.success = false;
					code.icon = "link-off";
					result.push(code);
					continue;
				}
				
				code.success = true;
				code.icon = "check";

				setUrl(code.data);

				// await new Promise(r => setTimeout(r, 2000));

				// webView has js injection by default
					
				// check if login page:
				//  if (document.getElementById("passwordform-password")) { /*...*/ }

				// set pw: 
				// document.getElementById("passwordform-password").value  = "test123123";
					
				// click submit login button
				// document.querySelectorAll('button[type=submit]')[0].click();

				// click NEGATIVE button
				// document.getElementsByClassName("btn btn-success btn-lg btn-block")[0].click();

				// [optional] click POSITIVE button
				// document.getElementsByClassName("btn btn-danger btn-lg btn-block")[0].click();

				// if alert is called -> press OK

				// check url for result status
				// url.endsWith("success")

				result.push(code);
				continue;
			}

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
			<WebView
				source={{uri: url}}
				ref={webViewRef}
				originWhitelist={["*"]}
				style={DetailsStyles.webView}
				scalesPageToFit={false}
				mediaPlaybackRequiresUserAction={false}
				allowsInlineMediaPlayback={true}
				decelerationRate={"normal"}
				useWebKit={true}
				showsHorizontalScrollIndicator={false}
				contentMode={"mobile"}
				setSupportMultipleWindows={false}
				onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
				javaScriptCanOpenWindowsAutomatically={false}
				androidHardwareAccelerationDisabled={true}
				injectedJavaScriptBeforeContentLoaded={initialInjectedJavaScript}
				onError={onWebViewError}
				onHttpError={onWebViewHTTPError}
				onMessage={onMessage}
				onNavigationStateChange={onNavigationStateChange}
				mixedContentMode={"always"}
				javaScriptEnabled={true}
				cacheEnabled={false}
				incognito={false}
				style={StyleSheet.absoluteFillObject}
			/>
			{codes.map((code, index) => {
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
				);
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
