import AsyncStorage from '@react-native-async-storage/async-storage';


async function saveValue(key, value){
	try{
		await AsyncStorage.setItem(key, JSON.stringify(value));
	}catch(e){
	  console.log("Saving value failed!");
	}
} 

async function loadValue(key){
	try{
		const value = await AsyncStorage.getItem(key);
		return value != null ? JSON.parse(value) : 0;
	}catch(e){
	  console.log("Loading value failed!");
	}
} 