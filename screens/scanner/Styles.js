import { StyleSheet } from "react-native";
import Constants from "expo-constants";

export const ScannerStyles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFillObject
	},
	camera: {
		...StyleSheet.absoluteFillObject
	},
	statusBarBackground: {
		width: "100%",
		height: Constants.statusBarHeight
	},
	flashButtonContainer: {
		width: 30,
		height: 30, 
		margin: 15 
	},
	flashButtonContent: {
		width: 30,
		height: 30,
		borderRadius: 15,
		overflow: "hidden"
	},
	takePictureButton: {
		width: 70,
		height: 70,
		borderWidth: 4,
		borderRadius: 35,
		borderColor: "#ffffff",
		position: "absolute",
		backgroundColor: "#000000dd"
	}
});
     