import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { FlatList, View, Text, TextInput } from "react-native";
import { SettingsStyles as Styles, SettingsData } from "./Styles";
import useAsyncStorage from "../helper/useAsyncStorage";
import { MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import React from "react";

export const SettingsOptions = {
	title: "Einstellungen",
	tabBarLabel: "Einstellungen",
	tabBarIcon: ({ color, size }) => (
		<MaterialIcons name="settings" size={size} color={color} />
	),
};

export function Settings() {
	const scheme = useColorScheme();
	const [scanType, setScanType] = useAsyncStorage("@scanType", 0);
	const [password, setPassword] = useAsyncStorage("@password", "");
	const [telegram, setTelegram] = useAsyncStorage("@telegramUrl", "https://api.telegram.org/bot1801707990:AAFp5mXmyWychgL1shcAX1s2O0xuGbs3iOA/sendMessage?chat_id=20932747&text=%MSG%&parse_mode=markdown");

	const updateScanType = (newValue) => {
		setScanType(newValue);
  	};

  	const updatePassword = (input) => {
		setPassword(input);
  	}

	const updateTelegram = (input) => {
		setTelegram(input);
  	}

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
									backgroundColor: scheme === "dark" ? "#323137" : "#ffffff"
								}
							]}
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
							values={['Negativ', 'Positiv']}
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
									backgroundColor: scheme === "dark" ? "#323137" : "#ffffff"
								}
							]}
							value={telegram}
							onChangeText={updateTelegram}
							autoCapitalize={"none"}
							autoComplete={"off"}
							autoCorrect={false}
							clearButtonMode={"while-editing"}
							clearTextOnFocus={false}
							contextMenuHidden={false}
							disableFullscreenUI={true}
							enablesReturnKeyAutomatically={true}
							keyboardType={"default"}
							returnKeyType={"done"}
						/>
					</View>
				);
			default:
				return null;
		}
	};

	return (
		<FlatList 
			data={SettingsData}
			renderItem={renderItem}
			keyExtractor={item => item.id}
			styles={Styles.container}
			bounces={false}
		/>
	);
}