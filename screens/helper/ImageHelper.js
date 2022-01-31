import { Image } from "react-native";
import React from "react";

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
    return obj;
};