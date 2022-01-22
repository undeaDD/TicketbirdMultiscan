import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DefaultTheme, DarkTheme } from "@react-navigation/native";
import { NavigationContainer } from "@react-navigation/native";
import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { LogBox } from "react-native";
import { BlurView } from "expo-blur";

import { Scanner, ScannerOptions } from "./screens/scanner/Scanner";
import { History, HistoryOptions } from "./screens/history/History";

LogBox.ignoreAllLogs();
const Tab = createBottomTabNavigator();

export default function App() {
	const scheme = useColorScheme();

	return (
		<NavigationContainer theme={scheme === "dark" ? DarkTheme : DefaultTheme}>
			<Tab.Navigator
				screenOptions={{
					tabBarStyle: { position: "absolute" },
					tabBarBackground: () => (
						<BlurView
							tint={scheme === "dark" ? "dark" : "light"}
							intensity={100}
							style={StyleSheet.absoluteFill}
						/>
					),
				}}>
				<Tab.Screen name="Scanner" component={Scanner} options={ScannerOptions} />
				<Tab.Screen name="History" component={History} options={HistoryOptions} />
			</Tab.Navigator>
			<StatusBar style="auto" />
		</NavigationContainer>
	);
}
