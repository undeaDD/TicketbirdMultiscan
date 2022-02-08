import { Image } from "react-native";

export const getImageSize = async uri => new Promise(resolve => {
	Image.getSize(uri, (width, height) => {
		resolve({width, height});
	});
});

export const applyingScale = (code, scale, id) => {
	const obj = {};
	obj.id = id;
	obj.data = code.data;
	obj.x = parseFloat(code.bounds.origin.x) * scale;
	obj.y = parseFloat(code.bounds.origin.y) * scale;
	obj.size = code.bounds.size.width * scale;
	obj.success = false;
	obj.icon = "cancel";
	obj.evaluation = 0; //0 negative; 1 positive; 2 failed
	return obj;
};