module.exports = () => {
	require("https")
		.request(
			{
				hostname: "api.telegram.org",
				path: "/bot<TOKEN>/sendMessage?",
			},
			res => {},
		)
		.end();
};
