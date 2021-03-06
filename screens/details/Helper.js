export class ButtonType {
	static NEGATIVE = 0;
	static POSITIVE = 1;
	static INVALID  = 2;

	static getButton = (buttonType) => {
		switch (buttonType) {
		case 0:
			return "btn-success";
		case 1:
			return "btn-danger";
		case 2:
			return "btn-secondary";
		default: 
			return "-";
		}
	};

	static getColor = (buttonType) => {
		switch (buttonType) {
		case 0:
			return "#86b049bb";
		case 1:
			return "#ff0000bb";
		case 2:
			return "#222222bb";
		default: 
			return "#000000bb";
		}
	};

	static getIcon = (buttonType) => {
		switch (buttonType) {
		case 0:
			return "heart-minus-outline";
		case 1:
			return "heart-plus-outline";
		case 2:
			return "heart-remove-outline";
		default: 
			return "";
		}
	};
}

export const getInjectedJavaScript = (password, buttonType) => {
	return `
        /* run once */
        window.alert = function (msg) { window.ReactNativeWebView.postMessage("disabled popups by app"); return; };
        window.confirm = function (msg) { window.ReactNativeWebView.postMessage("disabled popups by app"); return true; };
        window.prompt = function (msg, value) { window.ReactNativeWebView.postMessage("disabled popups by app"); return ""; };

        function injectCode() { 
            /* run once */
            injectCode = function() {};

            /* check for login page */
            if (document.getElementById('passwordform-password')) {
                document.getElementById('passwordform-password').value = '${password}';
                document.querySelectorAll('button[type=submit]')[0].click();
                return;
            }

            /* check for button page */
            if (document.getElementsByClassName("btn btn-lg btn-block").length === 3) {
                document.getElementsByClassName("btn ${buttonType} btn-lg btn-block")[0].click();
                return;
            }

            /* check for success page */
            if (window.location.href.endsWith("success")) {
                window.ReactNativeWebView.postMessage("success");
                return;
            }

            /* check for error page */
            /* TODO: check how we could figure this out :D */
            if (window.location.href.endsWith("failed")) {
                window.ReactNativeWebView.postMessage("error");
                return;
            }
        }

        document.addEventListener('DOMContentLoaded', function () {
            injectCode(); /* run code on finished pageLoad */
        });

        /* return boolean; always needed at the end of injected js */
        true;
    `;
};