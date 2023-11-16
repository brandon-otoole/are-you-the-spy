const DEBUG_TEST = ["DEBUG", "TRUE"].join('_');

function getLogger() {
    if (DEBUG_TEST == "DEBUG_PLACEHOLDER") {
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
