import { View, Image, Dimensions, useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getImageSize, applyingScale } from "../helper/ImageHelper";
import { useHeaderHeight } from "@react-navigation/elements";
import { getInjectedJavaScript, ButtonType } from "./Helper";
import React, { useState, useEffect, useRef } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import { MaterialIcons } from "@expo/vector-icons";
import { AsyncAlert } from "../helper/AsyncAlert";
import { DetailsStyles } from "./DetailsStyles";
import { WebView } from "react-native-webview";
import * as FileSystem from "expo-file-system";
import { log } from "./../helper/logger";
import { BlurView } from "expo-blur";

export const DetailsOptions = {
	title: "Ergebnisse",
	headerShown: true
};

export function Details( {route, navigation} ) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [webViewKey, setWebViewKey] = useState("1");
	const [injectedJS, setInjectedJS] = useState("");
	const [url, setUrl] = useState(undefined);
	const [result, setResult] = useState([]);
	const [valids, setValids] = useState([]);
	const [codes, setCodes] = useState([]);
	const headerHeight = useHeaderHeight();
	const webViewRef = useRef(null);
	const scheme = useColorScheme();
	const { photo } = route.params;

	const processQRCode = (code) => {
		code.evaluation = (code.evaluation + 1 )% 3;
		console.log("Test is now ", (code.evaluation == 0 ? "negative" : (code.evaluation == 1 ? "positive" : "broken")));
	};

	const onMessage = (event) => {
		const msg = event.nativeEvent.data;
		switch (msg) {
		case "success":
		case "error":
			if (currentIndex == valids.length) {
				setCodes(result); 				 
			} else {
				const clone = [...result];
				clone[currentIndex].success = msg === "success";
				clone[currentIndex].icon = msg === "success" ? "check" : "error-outline";
				setResult(clone);
				setCurrentIndex(currentIndex + 1);
				setUrl(valids[currentIndex].data);
				setWebViewKey((parseInt(webViewKey) + 1).toString());
			}
			return;
		default:
			log("Unknown onMessage Event: " + msg);
			return;
		}
	};
	
	useEffect(() => {
		(async () => {
			const password = JSON.parse(await AsyncStorage.getItem("@password"));
			const buttonType = JSON.parse(await AsyncStorage.getItem("@scanType"));
			const apiUrl = JSON.parse(await AsyncStorage.getItem("@url"));

			const tempJS = getInjectedJavaScript(password, ButtonType.getButton(buttonType));
			setInjectedJS(tempJS);

			const {width, height} = await getImageSize(photo.uri);
			const scale = Dimensions.get("window").width / width;

			if (width > height) {
				await AsyncAlert("Falsche Orientierung", "Die App unterst??zt nur Fotos im 'hochkant' Format.");
				navigation.goBack();
				FileSystem.deleteAsync(photo.uri);
				return;
			}

			var tempResult = [];
			var tempValids = [];

			var scans = await BarCodeScanner.scanFromURLAsync(photo.uri, [BarCodeScanner.Constants.BarCodeType.qr]);
			
			var indexId = 0;
			for (const qrCode of scans) {
				var code = applyingScale(qrCode, scale, indexId);
				indexId += 1;
				
				if (
					!code.data.startsWith(apiUrl) &&
					!code.data.startsWith("https://undeadd.github.io/TicketbirdMultiscan/")
				) {
					code.success = false;
					code.icon = "link-off";
					tempResult.push(code);
					continue;
				}
				
				code.success = false;
				code.icon = "not-listed-location";
				tempResult.push(code);
				tempValids.push(code);
				continue;
			}

			if (tempResult.length > 0) {
				setResult(tempResult);
				setValids(tempValids);

				if (tempValids[currentIndex] && tempValids[currentIndex].data) {
					setUrl(tempValids[currentIndex].data);
				} else {
					log("Scanned broken QRCode");
				}
			} else {
				log("No QRCodes found");
				await AsyncAlert("Erneut Scannen", "Die App konnte keine (g??ltigen) QRCodes in dem Scan finden.");
				navigation.goBack();
				FileSystem.deleteAsync(photo.uri);
				return;
			}
		})();
	}, []);

	return (
		<View style={DetailsStyles.container}>
			<WebView
				key={webViewKey}
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
				injectedJavaScriptBeforeContentLoaded={injectedJS}
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
						onPress={()=>{processQRCode(code);}}
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
				style={[DetailsStyles.headerBackground, {height: headerHeight}]}
			/>

		</View>
	);
}