import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Settings, SettingsOptions } from "./screens/settings/Settings";
import { Scanner, ScannerOptions } from "./screens/scanner/Scanner";
import { Details, DetailsOptions } from "./screens/details/Details";
import { DefaultTheme, DarkTheme } from "@react-navigation/native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { LogBox } from "react-native";
import { BlurView } from "expo-blur";
import React from "react";

LogBox.ignoreAllLogs();
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
	const scheme = useColorScheme();
	const theme = scheme === "dark" ? DarkTheme : DefaultTheme;

	return (
		<NavigationContainer theme={theme}>
			<Stack.Navigator
				screenOptions={{
					headerTransparent: true,
				}}
			>
				<Stack.Screen name="Tab" component={TabNavigator} options={TabNavigatorOptions}/>
				<Stack.Screen name="Details" component={Details} options={DetailsOptions}/>
			</Stack.Navigator>
			<StatusBar style="auto" />
		</NavigationContainer>
	);
}

const TabNavigatorOptions = {
	title: "Scanner",
	headerShown: false
};

function TabNavigator() {
	const scheme = useColorScheme();
	const theme = scheme === "dark" ? DarkTheme : DefaultTheme;

	return (
		<Tab.Navigator
			screenOptions={{
				tabBarActiveTintColor: theme.colors.text,
				tabBarInactiveTintColor: "#808080",
				tabBarStyle: { position: "absolute" },
				tabBarBackground: () => (
					<BlurView tint={scheme} intensity={100} style={StyleSheet.absoluteFill} />
				)
			}}>
			<Tab.Screen name="Scanner" component={Scanner} options={ScannerOptions} />
			<Tab.Screen name="Settings" component={Settings} options={SettingsOptions} />
		</Tab.Navigator>
		
	);
}
