export class ButtonType {
    static NEGATIVE = "btn-success";
    static POSITIVE = "btn-danger";
    static INVALID  = "btn-secondary";

    getColor = (buttonType) => {
        switch (buttonType) {
            case NEGATIVE:
                return "green";
            case POSITIVE:
                return "red";
            case INVALID:
                return "gray";
            default: 
                return "black";
        }
    }
}

export default getInjectedJavaScript = (password, buttonType) => {
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
                document.getElementById('passwordform-password').value  = '${password}';
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

        true; /* return boolean; always needed at the end of injected js */
    `;
}