import { FlatList, View, Text, TextInput, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";

var password = " ";

export const SettingsOptions = {
	title: "Einstellungen",
	tabBarLabel: "Einstellungen",
	tabBarIcon: ({ color, size }) => (
		<MaterialIcons name="settings" size={size} color={color} />
	),
};

const updatePassword = (pwInput) => {
	password = pwInput;
	console.log(password);
}

const Item = ({item}) => {
	switch (item.id){
		case "0":
			return (
				<View>
					<Text style={{width: "100%", height: "60", color: "white"}}>
						Password:
					</Text>
					<TextInput style={{width: "100%", height: "60", color: "white", borderColor: "grey"}} defaultValue={item.default} secureTextEntry={true} onChangeText={updatePassword}/>
				</View>
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
	const renderItem = ({item}) => <Item item={item}/>;
	return <FlatList data={data} renderItem={renderItem} keyExtractor={item => item.id} />;
}

const data = [
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