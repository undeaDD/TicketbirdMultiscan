import { FlatList, View, Text, TextInput, Switch, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { AsyncStorageHandler } from "./AsyncStorageHandler";
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
}

const Item = ({item}) => {
	const [isEnabled, setIsEnabled] = useState(false);
	useEffect(() => {
		AsyncStorageHandler.loadValue("@ccanType").then(setIsEnabled);
	   }, []);
  	const toggleSwitch = (previousState) => {
		  setIsEnabled(previousState => !previousState);
		  AsyncStorageHandler.saveValue("@scanType",!isEnabled);
	};
	switch (item.id){
		case "0":
			return (
				<View>
					<Text style={{width: "100%", height: 40, color: "white"}}></Text>
					<Text style={{width: "100%", height: 20, color: "white"}}>
						{item.title}:
					</Text>
					<TextInput style={{width: "100%", height: 30, color: "white", borderColor: "grey", borderWidth: 1}} defaultValue={item.default} secureTextEntry={true} onChangeText={updatePassword}/>
					<View style={{width: "80%", height: 40, borderBottomColor: "grey", borderBottomWidth: 1, alignSelf: "center"}}></View>
				</View>
			);
		case "1":
			return (
				<View>
					<Text style={{width: "100%", height: 40, color: "white"}}></Text>
					<Text style={{width: "100%", height: 20, color: "white"}}>
						{item.title}:
					</Text>
					<View style={{flex:1 , flexDirection: "row", width: "100%", height: 30, alignItems: "center"}}>
						<Text style={{color: "white"}}>all negative</Text>
						<Switch trackColor={{false: "grey", true: "grey"}} onValueChange={toggleSwitch} value={isEnabled}/>
						<Text style={{color: "white"}}>per Code</Text>
					</View>
				</View>
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