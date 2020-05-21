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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeWebhookAuthHandler = exports.validator = exports.cachedResponse = exports.speedLimitHandler = exports.rateLimitHandler = exports.bruteForceHandler = exports.authHandler = exports.trackingHandler = exports.errorHandler = void 0;
const errors_1 = require("@staart/errors");
const payments_1 = require("@staart/payments");
const server_1 = require("@staart/server");
const text_1 = require("@staart/text");
const validate_1 = require("@staart/validate");
const package_json_1 = __importDefault(require("../../../package.json"));
const config_1 = require("../../config");
const enum_1 = require("../interfaces/enum");
const errors_2 = require("./errors");
const jwt_1 = require("./jwt");
const tracking_1 = require("./tracking");
const utils_1 = require("./utils");
const bruteForce = server_1.slowDown({
    windowMs: config_1.BRUTE_FORCE_TIME,
    delayAfter: config_1.BRUTE_FORCE_COUNT,
    delayMs: config_1.BRUTE_FORCE_DELAY,
});
const rateLimiter = server_1.RateLimit({
    windowMs: config_1.RATE_LIMIT_TIME,
    max: config_1.RATE_LIMIT_MAX,
});
const publicRateLimiter = server_1.RateLimit({
    windowMs: config_1.PUBLIC_RATE_LIMIT_TIME,
    max: config_1.PUBLIC_RATE_LIMIT_MAX,
});
const speedLimiter = server_1.slowDown({
    windowMs: config_1.SPEED_LIMIT_TIME,
    delayAfter: config_1.SPEED_LIMIT_COUNT,
    delayMs: config_1.SPEED_LIMIT_DELAY,
});
/**
 * Handle any errors for Express
 */
exports.errorHandler = (error, req, res, next) => {
    if (error.api_error_code) {
        // Handle Chargebee errors
        error = error.message;
    }
    const response = errors_2.safeError(error.toString().replace("Error: ", ""));
    res.status(response.status);
    res.json({ error: response.code, message: response.message });
};
/**
 * Add locals for IP address and user agent
 */
exports.trackingHandler = (req, res, next) => {
    res.locals.userAgent = req.get("User-Agent");
    res.setHeader("X-Api-Version", package_json_1.default.version);
    let ip = req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress;
    if (ip === "::1")
        ip = "2001:67c:2564:a309:f0e0:1ee6:137b:29e8";
    if (typeof ip === "string")
        ip = ip.split(",")[0];
    if (Array.isArray(ip) && ip.length)
        ip = ip[0];
    res.locals.ipAddress = ip;
    res.locals.referrer = req.headers.referer;
    tracking_1.trackUrl(req, res)
        .then(() => { })
        .then(() => { })
        .finally(() => next());
};
/**
 * Add locals for a user after verifying their token
 */
exports.authHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userJwt = req.get("Authorization");
        if (userJwt) {
            if (userJwt.startsWith("Bearer "))
                userJwt = userJwt.replace("Bearer ", "");
            const userToken = yield jwt_1.verifyToken(userJwt, enum_1.Tokens.LOGIN);
            yield jwt_1.checkInvalidatedToken(userJwt);
            if (userToken)
                res.locals.token = userToken;
        }
        let apiKeyJwt = req.get("X-Api-Key") || req.query.key;
        if (apiKeyJwt) {
            if (apiKeyJwt.startsWith("Bearer "))
                apiKeyJwt = apiKeyJwt.replace("Bearer ", "");
            const apiKeyToken = yield jwt_1.verifyToken(apiKeyJwt, enum_1.Tokens.API_KEY);
            yield jwt_1.checkInvalidatedToken(apiKeyJwt);
            jwt_1.checkIpRestrictions(apiKeyToken, res.locals);
            const origin = req.get("Origin");
            if (origin) {
                const referrerDomain = new URL(origin).hostname;
                jwt_1.checkReferrerRestrictions(apiKeyToken, referrerDomain);
                if (apiKeyToken.referrerRestrictions) {
                    if (utils_1.includesDomainInCommaList(apiKeyToken.referrerRestrictions, referrerDomain)) {
                        res.setHeader("Access-Control-Allow-Origin", origin);
                    }
                }
                else {
                    res.setHeader("Access-Control-Allow-Origin", "*");
                }
            }
            if (apiKeyToken && !res.locals.token)
                res.locals.token = apiKeyToken;
        }
    }
    catch (error) {
        const jwtError = errors_2.safeError(error);
        res.status(jwtError.status);
        return res.json(jwtError);
    }
    if (res.locals.token)
        return next();
    const error = errors_2.safeError(errors_1.MISSING_TOKEN);
    res.status(error.status);
    return res.json(error);
});
/**
 * Brute force middleware
 */
exports.bruteForceHandler = bruteForce;
/**
 * Rate limiting middleware
 */
exports.rateLimitHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const apiKey = req.get("X-Api-Key") || req.query.key;
    if (apiKey) {
        try {
            const details = yield jwt_1.verifyToken(apiKey, enum_1.Tokens.API_KEY);
            if (details.organizationId) {
                res.setHeader("X-Rate-Limit-Type", "api-key");
                return rateLimiter(req, res, next);
            }
        }
        catch (error) { }
    }
    res.setHeader("X-RateLimit-Limit-Type", "public");
    return publicRateLimiter(req, res, next);
});
/**
 * Speed limiting middleware
 */
exports.speedLimitHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const apiKey = req.get("X-Api-Key") || req.query.key;
    if (apiKey) {
        try {
            const details = yield jwt_1.verifyToken(apiKey, enum_1.Tokens.API_KEY);
            if (details.organizationId) {
                res.setHeader("X-Rate-Limit-Type", "api-key");
                return next();
            }
        }
        catch (error) { }
    }
    return speedLimiter(req, res, next);
});
/**
 * Response caching middleware
 * @param time - Amount of time to cache contenr for
 */
exports.cachedResponse = (time) => {
    return (req, res, next) => {
        res.set("Cache-Control", `max-age=${Math.floor(text_1.ms(time) / 1000)}, must-revalidate`);
        return next();
    };
};
exports.validator = (schemaMap, type) => {
    return (req, res, next) => {
        let data;
        switch (type) {
            case "params":
                data = req.params;
                break;
            case "query":
                data = req.query;
                break;
            default:
                data = req.body;
        }
        validate_1.joiValidate(schemaMap, data);
        next();
    };
};
/**
 * Handle Stripe's webhook authentication
 */
exports.stripeWebhookAuthHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const signature = req.get("stripe-signature");
    if (!signature) {
        const error = errors_2.safeError(errors_1.MISSING_SIGNATURE);
        res.status(error.status);
        return res.json(error);
    }
    try {
        const event = payments_1.constructWebhookEvent(req.rawBody, signature);
        res.locals.stripeEvent = event;
        next();
    }
    catch (error) {
        console.log("Webhook error", error);
        const webhookError = errors_2.safeError(errors_1.INVALID_SIGNATURE);
        res.status(webhookError.status);
        return res.json(webhookError);
    }
});
//# sourceMappingURL=middleware.js.map