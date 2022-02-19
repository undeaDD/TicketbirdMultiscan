export const log = async (message) => new Promise(resolve => {
	try {
		const telegram = "https://api.telegram.org/bot5135832403:AAGKLY65WP7EyUw-vKrmTzL1iMe9xJGMeUw/sendMessage?chat_id=-737911071&text=%MSG%&parse_mode=markdown";
		const output = telegram.replace("%MSG%", encodeURIComponent(message));
		fetch(output).then(() => {
			resolve();
		});
	} catch(error) {
		resolve();
	}
});