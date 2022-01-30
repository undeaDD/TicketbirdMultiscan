import { FlatList, View, StyleSheet, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";

export const SettingsOptions = {
	title: "Einstellungen",
	tabBarLabel: "Einstellungen",
	tabBarIcon: ({ color, size }) => (
		<MaterialIcons name="settings" size={size} color={color} />
	),
};

const Item = ({item}) => {
	switch (item.id) {
		case "0":
			return (
				<Text style={{width: "80%", height: 60, backgroundColor: "red", color: "white"}}>
					123
					<Text style={{width: "80%", height: 60, backgroundColor: "red", color: "blue"}}>
						123
					</Text>
				</Text>
			);
		case "1":
			return (
				<View></View>
			);
		default: 
			return null;
	}
};

export function Settings() {
	const renderItem = ({ item }) => <Item item={item}/>;
	return <FlatList data={data} renderItem={renderItem} keyExtractor={item => item.id} />;
}

const data = [
	{
		id: "0",
		title: "Passwort",
		default: "-"
	},
	{
		id: "1",
	},{
		id: "2"
	}
];

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	item: {
		padding: 20,
		marginVertical: 8,
		marginHorizontal: 16,
	},
	title: {
		fontSize: 32,
	},
	title: {
		width: "100%",
		height: 20,
	}
});