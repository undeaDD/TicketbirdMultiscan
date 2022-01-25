import React from "react";

/*
    Do work with qrcodes here:
    qrcode.success = false; <-- success or failure
	qrcode.icon = "check";  <-- https://icons.expo.fyi/ & filter: materialicons

    Object {
        "data": "3",
        "icon": "check",
        "size": 49.674839269919474,
        "success": false,
        "x": 377.98120936409373,
        "y": 72.1356282468702,
    },
*/
export const executeAlgorithm = (qrcodes, webViewRef) => {
    qrcodes.forEach( (qrCode) => {
        const url = qrcodes.data;

        // https://testcov-has.ticketbird.de/auswertung/<ID>
        if (url.startsWith("https://")) {
            // invalid qrcode
            break;
        }

        webViewRef.loadUrl(url);
        // webView has js injection by default
        
        // check if login page:
        //  if (document.getElementById("passwordform-password")) { /*...*/ }

        // set pw: 
        // document.getElementById("passwordform-password").value  = "test123123";
        
        // click submit login button
        // document.querySelectorAll('button[type=submit]')[0].click();

        // click NEGATIVE button
        // document.getElementsByClassName("btn btn-success btn-lg btn-block")[0].click();

        // [optional] click POSITIVE button
        // document.getElementsByClassName("btn btn-danger btn-lg btn-block")[0].click();

        // if alert is called -> press OK

        // check url for result status
        // url.endsWith("success")

        response.json();
    });

    return qrcodes;
}