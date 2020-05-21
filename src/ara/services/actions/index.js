"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.performAction = void 0;
const setupNewAppointment_1 = require("./setupNewAppointment");
const rescheduleAppointment_1 = require("./rescheduleAppointment");
const cancelAppointment_1 = require("./cancelAppointment");
const scheduleSummary_1 = require("./scheduleSummary");
const tokenize_1 = require("../tokenize");
const classify_1 = require("../classify");
exports.performAction = (incomingEmail, organization, assistantEmail, user, objectBody, parsedBody, log) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(parsedBody.text && parsedBody.from))
        throw new Error("Couldn't find text or from");
    const tokens = yield tokenize_1.smartTokensFromText(parsedBody.text, parsedBody.from);
    log("Smart tokenized sentences", tokens);
    const label = classify_1.classifyTokens(tokens, log);
    log(`Classified text as "${label}"`);
    return yield act({
        incomingEmail,
        organization,
        assistantEmail,
        user,
        objectBody,
        parsedBody,
        tokens,
        label,
        log,
    });
});
const act = (params) => __awaiter(void 0, void 0, void 0, function* () {
    if (params.label === "setupNewAppointment")
        return yield setupNewAppointment_1.setupNewAppointment(params);
    if (params.label === "rescheduleAppointment")
        return yield rescheduleAppointment_1.rescheduleAppointment(params);
    if (params.label === "cancelAppointment")
        return yield cancelAppointment_1.cancelAppointment(params);
    if (params.label === "scheduleSummary")
        return yield scheduleSummary_1.scheduleSummary(params);
    throw new Error("Requested an unknown action");
});
//# sourceMappingURL=index.js.map