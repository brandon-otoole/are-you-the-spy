import config from "./config.js";

function getLogger() {
    if (config.debug) {
        return function(text) {
            console.debug(text);
        }
    } else {
        return function(text) {
            // nop
        }
    }

}

export default {
    "log": getLogger()
}
