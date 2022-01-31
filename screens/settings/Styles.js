import { StyleSheet } from "react-native";

export const SettingsData = [
	{
		id: "0",
		title: "Password",
		default: "",
	},
	{
		id: "1",
		title: "Scan Type",
		default: "0",
	}
];

export const SettingsStyles = StyleSheet.create({
    container: {
		...StyleSheet.absoluteFillObject
	},
	itemContainer: {
		marginTop: "5%",
		marginHorizontal: "5%",
		height: 60,
		width: "90%",
		borderRadius: 10,
		overflow: "hidden",
		backgroundColor: "#ffffff22"
	},
	itemTitle: {
		fontSize: 12,
		color: "white",
		height: 15,
		width: "100%",
		marginTop: 5
	},
	itemInput: {
		width: "100%",
		height: 40,
		backgroundColor: "gray",
		paddingHorizontal: 10
	},
	itemSegmentedControl: {
		width: "100%",
		height: 40,
	}
});
     