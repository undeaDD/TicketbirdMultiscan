import { Alert } from "react-native";
import React from "react";

export default AsyncAlert = async (title, message) => new Promise((resolve) => {
    Alert.alert(title, message, [{
        style: "cancel",
        text: "Zurück",
        onPress: () => { resolve(); }
    }], { cancelable: false });
});