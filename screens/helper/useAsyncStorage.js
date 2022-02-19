import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";

export default function useAsyncStorage(key, initialValue) {
	const [storedValue, setStoredValue] = useState(undefined);
  
	async function getStoredItem(key, initialValue) {
		try {
			const item = await AsyncStorage.getItem(key);
			const value = item ? JSON.parse(item) : initialValue;
			setStoredValue(value);
		} catch (error) { return; }
	}
  
	useEffect(() => {
		getStoredItem(key, initialValue);
	}, [key, initialValue]);
  
	const setValue = async (value) => {
		try {
			const valueToStore =
          value instanceof Function ? value(storedValue) : value;
			setStoredValue(valueToStore);
			await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
		} catch (error) { return; }
	};
  
	return [storedValue, setValue];
}