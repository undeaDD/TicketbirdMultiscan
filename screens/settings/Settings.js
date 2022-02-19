import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { FlatList, View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { SettingsStyles as Styles, SettingsData } from "./Styles";
import useAsyncStorage from "../helper/useAsyncStorage";
import { MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import * as Linking from 'expo-linking';
import React from "react";

export const SettingsOptions = {
	title: "Einstellungen",
	tabBarLabel: "Einstellungen",
	tabBarIcon: ({ color, size }) => (
		<MaterialIcons name="settings" size={size} color={color} />
	),
};

export function Settings({navigation}) {
	const scheme = useColorScheme();
	const [scanType, setScanType] = useAsyncStorage("@scanType", 0);
	const [password, setPassword] = useAsyncStorage("@password", "");
	const [url, setURL] = useAsyncStorage("@url", "https://undeadd.github.io/TicketbirdMultiscan/");

	const updateScanType = (newValue) => {
		setScanType(newValue);
	};

	const updatePassword = (input) => {
		setPassword(input);
	};

	const updateURL = (input) => {
		if (input === "") {
			// reset to default value 
			setURL("https://undeadd.github.io/TicketbirdMultiscan/");
		} else {
			setURL(input);
		}
	};

	const renderItem = ({item}) => {
		switch (item.id) {
		case "0":
			return (
				<View 
					key={item.id} 
					style={[
						Styles.itemContainer,
						{backgroundColor: scheme === "dark" ? "#1c1c1e" : "#ffffff"}
					]}
				>
					<Text style={[
						Styles.itemTitle,
						{color: scheme === "dark" ? "#ffffff" : "#000000"}
					]}>
						{item.title}
					</Text>
					<TextInput 
						style={[
							Styles.itemInput,
							{
								color: scheme === "dark" ? "#ffffff" : "#000000",
								backgroundColor: scheme === "dark" ? "#323137" : "#eeeeee"
							}
						]}
						defaultValue={""}
						value={password}
						secureTextEntry={true}
						onChangeText={updatePassword}
						autoCapitalize={"none"}
						autoComplete={"off"}
						autoCorrect={false}
						clearButtonMode={"while-editing"}
						clearTextOnFocus={true}
						contextMenuHidden={true}
						disableFullscreenUI={true}
						enablesReturnKeyAutomatically={true}
						keyboardType={"default"}
						returnKeyType={"done"}
					/>
				</View>
			);
		case "1":
			return (
				<View 
					key={item.id} 
					style={[
						Styles.itemContainer,
						{backgroundColor: scheme === "dark" ? "#1c1c1e" : "#ffffff"}
					]}
				>
					<Text style={[
						Styles.itemTitle,
						{color: scheme === "dark" ? "#ffffff" : "#000000"}
					]}>
						{item.title}
					</Text>
					<SegmentedControl
						style={Styles.itemSegmentedControl}
						values={["Negativ", "Positiv"]}
						selectedIndex={scanType}
						onChange={(event) => {
							updateScanType(event.nativeEvent.selectedSegmentIndex);
						}}
					/>
				</View>
			);
		case "2":
			return (
				<View 
					key={item.id} 
					style={[
						Styles.itemContainer,
						{backgroundColor: scheme === "dark" ? "#1c1c1e" : "#ffffff"}
					]}
				>
					<Text style={[
						Styles.itemTitle,
						{color: scheme === "dark" ? "#ffffff" : "#000000"}
					]}>
						{item.title}
					</Text>
					<TextInput 
						style={[
							Styles.itemInput,
							{
								color: scheme === "dark" ? "#ffffff" : "#000000",
								backgroundColor: scheme === "dark" ? "#323137" : "#eeeeee"
							}
						]}
						defaultValue={"https://undeadd.github.io/TicketbirdMultiscan/"}
						value={url}
						onChangeText={updateURL}
						autoCapitalize={"none"}
						autoComplete={"off"}
						autoCorrect={false}
						clearButtonMode={"while-editing"}
						clearTextOnFocus={false}
						contextMenuHidden={false}
						disableFullscreenUI={true}
						enablesReturnKeyAutomatically={true}
						keyboardType={"url"}
						returnKeyType={"done"}
					/>
				</View>
			);
		default:
			return (
				<TouchableOpacity
					key={item.id} 
					onPress={() => {
						Linking.openURL("https://undeadd.github.io/TicketbirdMultiscan/" + item.link)
					}}
					activeOpacity={1}
					style={[
						Styles.itemContainerSmall,
						{backgroundColor: scheme === "dark" ? "#1c1c1e" : "#ffffff"}
					]}
				>
					<Text style={[
						Styles.itemTitleSmall,
						{color: scheme === "dark" ? "#ffffff" : "#000000"}
					]}>
						{item.title}
					</Text>
					<MaterialIcons 
						name="chevron-right"
						size={20}
						color={scheme === "dark" ? "#ffffff" : "#000000"}
						style={Styles.chevron}
					/>
				</TouchableOpacity>
			);
		}
	};

	return (
		<FlatList 
			data={SettingsData}
			renderItem={renderItem}
			keyExtractor={item => item.id}
			styles={Styles.container}
			bounces={true}
		/>
	);
}