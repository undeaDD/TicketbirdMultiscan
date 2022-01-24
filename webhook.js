module.exports = () => {
	const tgToken = "1801707990:AAFp5mXmyWychgL1shcAX1s2O0xuGbs3iOA";
	const chatId = "20932747";
	const message = "%5BExpo%5D%20new%20version%20published";

	require("https")
		.request({
			hostname: "api.telegram.org",
			port: 443,
			path: "/bot" + tgToken + "/sendMessage?chat_id=" + chatId + "&text=" + message + "&parse_mode=markdown",
			method: "GET",
		})
		.end();
};
