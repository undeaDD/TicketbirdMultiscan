module.exports = () => {
	const tgToken = "5135832403:AAGKLY65WP7EyUw-vKrmTzL1iMe9xJGMeUw";
	const chatId = "-737911071";
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