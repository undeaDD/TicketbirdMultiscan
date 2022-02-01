import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { FlatList, View, Text, TextInput } from "react-native";
import { SettingsStyles as Styles, SettingsData } from "./Styles";
import useAsyncStorage from "../helper/useAsyncStorage";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";

export const SettingsOptions = {
	title: "Einstellungen",
	tabBarLabel: "Einstellungen",
	tabBarIcon: ({ color, size }) => (
		<MaterialIcons name="settings" size={size} color={color} />
	),
};

export function Settings() {
	const [scanType, setScanType] = useAsyncStorage("@scanType", 0);
	const [password, setPassword] = useAsyncStorage("@password", "");

	const updateScanType = (newValue) => {
		setScanType(newValue);
  	};

  	const updatePassword = (input) => {
		setPassword(input);
  	}

	const renderItem = ({item}) => {
		switch (item.id) {
			case "0":
				return (
					<View key={item.id} style={Styles.itemContainer}>
						<Text  style={Styles.itemTitle}>
							{item.title}
						</Text>
						<TextInput  style={Styles.itemInput} value={password} secureTextEntry={true} onChangeText={updatePassword}/>
					</View>
				);
			case "1":
				return (
					<View key={item.id} style={Styles.itemContainer}>
						<Text style={Styles.itemTitle}>
							{item.title}
						</Text>
						<SegmentedControl
							style={Styles.itemSegmentedControl}
							values={['Negativ', 'per Test']}
							selectedIndex={scanType}
							onChange={(event) => {
								updateScanType(event.nativeEvent.selectedSegmentIndex);
							}}
						/>
					</View>
				);
			default:
				return null;
		}
	};

	return (
		<FlatList data={SettingsData} renderItem={renderItem} keyExtractor={item => item.id} styles={Styles.container} />
	);
}