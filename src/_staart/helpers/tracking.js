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
exports.trackUrl = exports.trackEvent = exports.clearSecurityEventsData = exports.clearTrackingData = exports.getSecurityEvents = exports.getTrackingData = void 0;
const enum_1 = require("../interfaces/enum");
const jwt_1 = require("./jwt");
let trackingData = [];
let securityEventsData = [];
exports.getTrackingData = () => trackingData;
exports.getSecurityEvents = () => securityEventsData;
exports.clearTrackingData = () => {
    trackingData = [];
};
exports.clearSecurityEventsData = () => {
    securityEventsData = [];
};
exports.trackEvent = (event, locals) => {
    event.date = new Date();
    if (locals) {
        event.ipAddress = locals.ipAddress;
        event.userAgent = locals.userAgent;
    }
    securityEventsData.push(event);
};
exports.trackUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.method === "OPTIONS")
        return;
    const trackingObject = Object.assign({ date: new Date(), apiKey: req.get("X-Api-Key") || req.query.key, method: req.method, params: req.params, protocol: req.protocol, query: req.query, body: req.body, cookies: req.cookies, headers: req.headers, url: req.url, ipCountry: (req.get("cf-ipcountry") || "").toLowerCase() }, res.locals);
    if (trackingObject.apiKey) {
        try {
            const token = yield jwt_1.verifyToken(trackingObject.apiKey, enum_1.Tokens.API_KEY);
            trackingObject.apiKeyId = token.id;
            trackingObject.apiKeyOrganizationId = token.organizationId;
            trackingObject.apiKeyJti = token.jti;
            delete trackingObject.apiKey;
        }
        catch (error) {
            return;
        }
    }
    Object.keys(trackingObject).forEach((key) => {
        if (typeof trackingObject[key] === "object" &&
            !Array.isArray(trackingObject[key]) &&
            !(trackingObject[key] instanceof Date)) {
            trackingObject[key] = JSON.stringify(trackingObject[key]);
        }
        if (trackingObject[key] === undefined)
            delete trackingObject[key];
        if (trackingObject[key] === "{}")
            delete trackingObject[key];
    });
    res.on("finish", () => {
        trackingObject.statusCode = res.statusCode;
        trackingObject.completedDate = new Date();
        trackingData.push(trackingObject);
    });
});
//# sourceMappingURL=tracking.js.map