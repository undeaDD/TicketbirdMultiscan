import { StyleSheet } from "react-native";

export const SettingsData = [
	{
		id: "0",
		title: "Passwort:",
	},
	{
		id: "1",
		title: "Automatische Angabe:",
	}, {
		id: "2",
		title: "Scans an Telegram senden:"
	}
];

export const SettingsStyles = StyleSheet.create({
    container: {
		...StyleSheet.absoluteFillObject
	},
	itemContainer: {
		marginTop: "5%",
		marginHorizontal: "5%",
		height: 80,
		width: "90%",
		borderRadius: 10,
		overflow: "hidden",
		color: "white"
	},
	itemTitle: {
		fontSize: 12,
		color: "white",
		height: 15,
		width: "100%",
		marginVertical: 7,
		paddingHorizontal: 10
	},
	itemInput: {
		width: "90%",
		height: 40,
		marginHorizontal: "5%",
		paddingHorizontal: 10,
		borderRadius: 6
	},
	itemSegmentedControl: {
		width: "92%",
		marginHorizontal: "4%",
		height: 40,
	}
});
     