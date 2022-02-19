import { StyleSheet } from "react-native";

export const SettingsData = [
	{
		id: "0",
		title: "Passwort:",
	},
	{
		id: "1",
		title: "Automatische Angabe:",
	}, 
	{
		id: "2",
		title: "Eigene Api Url:"
	}, 
	{
		id: "3",
		title: "Feedback senden",
		link: "feedback.html"
	}, 
	{
		id: "4",
		title: "Test QRCode Bild",
		link: "test.png"
	}, 
	{
		id: "5",
		title: "Datenschutz",
		link: "datenschutz.html"
	}, 
	{
		id: "6",
		title: "Impressum",
		link: "impressum.html"
	}, 
	{
		id: "7",
		title: "FAQ",
		link: "faq.html"
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
	},
	itemContainerSmall: {
		marginTop: "5%",
		marginHorizontal: "5%",
		height: 50,
		width: "90%",
		borderRadius: 10,
		overflow: "hidden",
		color: "white",
		flexDirection: "row"
	},
	itemTitleSmall: {
		fontSize: 15,
		color: "white",
		height: 50,
		width: "70%",
		marginVertical: 15,
		paddingHorizontal: 20
	},
	chevron: {
		height: 50,
		width: 50,
		paddingTop: 15,
		marginLeft: "auto",
		textAlign: "center"
	}
});
     