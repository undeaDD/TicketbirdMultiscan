import { View, Image, ActivityIndicator, Dimensions, useColorScheme, Alert } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { BarCodeScanner } from "expo-barcode-scanner";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState, useEffect, useRef } from "react";
import { DetailsStyles } from "./DetailsStyles";
import { WebView } from "react-native-webview";
import * as FileSystem from "expo-file-system";
import { BlurView } from "expo-blur";

var setUrlRef;
var setCodesRef;
var currentIndex = 0;
var result = [];
var valids = [];

export const DetailsOptions = {
	title: "Ergebnisse",
	headerShown: true
};

const getImageSize = async uri => new Promise(resolve => {
	Image.getSize(uri, (width, height) => {
		resolve({width, height});
	});
});

const applyingScale = (code, scale, id) => {
	const obj = {};
	obj.id = id;
	obj.data = code.data;
	obj.x = parseFloat(code.bounds.origin.x) * scale;
	obj.y = parseFloat(code.bounds.origin.y) * scale;
	obj.size = code.bounds.size.width * scale;
	obj.success = false;
	obj.icon = "cancel";
	return obj;
};

const AsyncAlert = async (title, message) => new Promise((resolve) => {
	Alert.alert(title, message, [{
		style: "cancel",
		text: "Zurück",
		onPress: () => { resolve(); }
	}], { cancelable: false });
});

const onMessage = (event) => {
	console.log("Got Message: ", event.nativeEvent.data)
	switch (event.nativeEvent.data) {
		case "success":
			if (currentIndex == valids.length) {
				setCodesRef(result); 				 
			} else {
				result[currentIndex].success = true;
				result[currentIndex].icon = "check";
				currentIndex += 1;
				setUrlRef(valids[currentIndex].data);
			}
		case "error":
			if (currentIndex == valids.length) {
				setCodesRef(result); 				 
			} else {
				result[currentIndex].success = false;
				result[currentIndex].icon = "error-outline";
				currentIndex += 1;
				setUrlRef(valids[currentIndex].data);
			}
		default:
			console.log("unknown onMessage Event: ", event.nativeEvent.data);
	}
};



const initialInjectedJavaScript = `
	function injectCode() { 
		injectCode = function() {}; /* run once */
		window.ReactNativeWebView.postMessage('test');  /* callBack to app (with any string) */

		/*
			// TODO: do logic here ...

			// check if login page:
			//  if (document.getElementById("passwordform-password")) {  }
		
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

			// send action for next code
			// window.ReactNativeWebView.postMessage("success") or ("error") or (add you own custom event string <- in the switch case of the onMessage function)
			// ( any other string and it will just be printed in the console <- for debugging purposes ... )
		*/

		window.ReactNativeWebView.postMessage("success");
	}
	
	document.addEventListener('DOMContentLoaded', function () {
		injectCode(); /* run code on finished pageLoad */
	});

	true; /* return boolean always needed at the end of injected js */
`;

export function Details({route, navigation}) {
	const [url, setUrl] = useState(undefined);
	const [codes, setCodes] = useState([]);
	const headerHeight = useHeaderHeight();
	const webViewRef = useRef(null);
	const scheme = useColorScheme();
	const { photo } = route.params;

	useEffect(() => {
		setCodesRef = setCodes;
		setUrlRef = setUrl;

		(async () => {
			const {width, height} = await getImageSize(photo.uri);
			const scale = Dimensions.get("window").width / width;

			if (width > height) {
				await AsyncAlert("Falsche Orientierung", "Die App unterstüzt nur Fotos im 'hochkant' Format.");
				navigation.goBack();
				FileSystem.deleteAsync(photo.uri);
				return;
			}

			var scans = await BarCodeScanner.scanFromURLAsync(photo.uri, [BarCodeScanner.Constants.BarCodeType.qr]);
			var indexId = 0;
			for (const qrCode of scans) {
				var code = applyingScale(qrCode, scale, indexId);
				indexId += 1;
				
				if (
					!code.data.startsWith("https://testcov-has.ticketbird.de/auswertung/") &&
					!code.data.startsWith("https://undeadd.github.io/TicketbirdMultiscan/")
				) {
					code.success = false;
					code.icon = "link-off";
					result.push(code);
					continue;
				}
				
				code.success = false;
				code.icon = "not-listed-location";
				result.push(code);
				valids.push(code);
				continue;
			}

			if (result.length > 0) {
				setUrl(valids[currentIndex].data);
			} else {
				await AsyncAlert("Erneut Scannen", "Die App konnte keine (gültigen) QRCodes in dem Scan finden.");
				navigation.goBack();
				FileSystem.deleteAsync(photo.uri);
				return;
			}
		})();

		return () => {
			setCodesRef = null;
			setUrlRef = null;
			currentIndex = 0;
			result = [];
			valids = [];
		}
	}, []);

	return (
		<View style={DetailsStyles.container}>
			<WebView
				bounces={false}
				source={{uri: url}}
				ref={webViewRef}
				onMessage={onMessage}
				originWhitelist={["*"]}
				style={DetailsStyles.webView}
				scalesPageToFit={true}
				mediaPlaybackRequiresUserAction={false}
				allowsInlineMediaPlayback={false}
				decelerationRate={"fast"}
				useWebKit={true}
				showsHorizontalScrollIndicator={false}
				contentMode={"mobile"}
				mixedContentMode={"compability"}
				setSupportMultipleWindows={false}
				javaScriptCanOpenWindowsAutomatically={true}
				injectedJavaScriptBeforeContentLoaded={initialInjectedJavaScript}
				javaScriptEnabledAndroid={true}
				javaScriptEnabled={true}
				cacheEnabled={false}
				incognito={false}
			/>

			<Image 
				source={{uri: photo.uri}} 
				style={DetailsStyles.backgroundImage}
				resizeMode="cover"
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
