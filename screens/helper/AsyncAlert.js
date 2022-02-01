import { Alert } from "react-native";

export const AsyncAlert = async (title, message) => new Promise((resolve) => {
	Alert.alert(title, message, [{
		style: "cancel",
		text: "Zurück",
		onPress: () => { resolve(); }
	}], { cancelable: false });
});