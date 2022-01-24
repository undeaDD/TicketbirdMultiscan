import { FlatList, View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";

export const SettingsOptions = {
	title: "Einstellungen",
	tabBarLabel: "Einstellungen",
	tabBarIcon: ({ color, size }) => (
		<MaterialIcons name="settings" size={size} color={color} />
	),
};

const Item = ({ title }) => (
	<View style={styles.item}>
		<Text style={styles.title}>{title}</Text>
	</View>
);

export function Settings() {
	const renderItem = ({ item }) => <Item title={item.title} />;

	return <FlatList data={data} renderItem={renderItem} keyExtractor={item => item.id} />;
}

const data = [
	{
		id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
		title: "First Item",
	},
	{
		id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
		title: "Second Item",
	},
	{
		id: "58694a0f-3da1-471f-bd96-145571e29d72",
		title: "Third Item",
	},
];

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	item: {
		backgroundColor: "#f9c2ff",
		padding: 20,
		marginVertical: 8,
		marginHorizontal: 16,
	},
	title: {
		fontSize: 32,
	},
});