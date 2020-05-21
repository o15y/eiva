"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.safeError = void 0;
const errors_1 = require("@staart/errors");
const errors_2 = require("@staart/errors");
/**
 * Parse default errors and send a safe string
 */
exports.safeError = (error) => {
    let errorString = error.toString();
    if (errorString.startsWith("Error: "))
        errorString = errorString.replace("Error: ", "");
    if (errorString.startsWith("joi:")) {
        const joiError = JSON.parse(errorString.split("joi:")[1]);
        return exports.sendError(`422/${joiError.details[0].message}`);
    }
    if (errorString === "TokenExpiredError: jwt expired")
        return exports.sendError(errors_1.EXPIRED_TOKEN);
    if (errorString.startsWith("JsonWebToken"))
        return exports.sendError(errors_1.INVALID_TOKEN);
    console.log(error);
    return exports.sendError(errorString);
};
/**
 * Send an HTTPError object
 */
exports.sendError = (error) => {
    if (error.includes("/")) {
        let status = parseInt(error.split("/")[0]);
        if (isNaN(status))
            status = 500;
        const code = error.split("/")[1];
        return { status, code };
    }
    errors_2.warn(error);
    return { status: 500, code: error };
};
//# sourceMappingURL=errors.js.map