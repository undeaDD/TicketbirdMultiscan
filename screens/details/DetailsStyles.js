import { StyleSheet } from "react-native";

export const DetailsStyles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFillObject
	},
    backgroundImage: {
        ...StyleSheet.absoluteFillObject
    },
    headerBackground: {
        width: "100%",
        position: "absolute",
        left: 0,
        top: 0
    },
	spinner: {
		position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
	},
    overlays: {
        position: "absolute",
        justifyContent:"center",
        alignItems:"center"
    }
});
     