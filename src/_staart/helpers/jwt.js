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
exports.checkReferrerRestrictions = exports.checkIpRestrictions = exports.invalidateToken = exports.checkInvalidatedToken = exports.getLoginResponse = exports.postLoginTokens = exports.refreshToken = exports.approveLocationToken = exports.accessToken = exports.apiKeyToken = exports.twoFactorToken = exports.loginToken = exports.passwordResetToken = exports.resendEmailVerificationToken = exports.emailVerificationToken = exports.couponCodeJwt = exports.verifyToken = exports.generateToken = void 0;
const errors_1 = require("@staart/errors");
const redis_1 = __importDefault(require("@staart/redis"));
const text_1 = require("@staart/text");
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../../config");
const enum_1 = require("../interfaces/enum");
const location_1 = require("./location");
const mail_1 = require("./mail");
const utils_1 = require("./utils");
const prisma_1 = require("./prisma");
const user_service_1 = require("../services/user.service");
/**
 * Generate a new JWT
 */
exports.generateToken = (payload, expiresIn, subject) => new Promise((resolve, reject) => {
    jsonwebtoken_1.sign(
    // Payload is expected to be a plain object
    JSON.parse(JSON.stringify(payload)), config_1.JWT_SECRET, {
        expiresIn,
        subject,
        issuer: config_1.JWT_ISSUER,
        jwtid: text_1.randomString({ length: 12 }),
    }, (error, token) => {
        if (error)
            return reject(error);
        resolve(token);
    });
});
/**
 * Verify a JWT
 */
exports.verifyToken = (token, subject) => new Promise((resolve, reject) => {
    jsonwebtoken_1.verify(token, config_1.JWT_SECRET, { subject }, (error, data) => {
        if (error)
            return reject(error);
        resolve(data);
    });
});
/**
 * Generate a new coupon JWT
 */
exports.couponCodeJwt = (amount, currency, description, expiresAt) => exports.generateToken({ amount, currency, description }, expiresAt
    ? (new Date(expiresAt).getTime() - new Date().getTime()) / 1000
    : "30d", enum_1.Tokens.COUPON);
/**
 * Generate a new email verification JWT
 */
exports.emailVerificationToken = (id) => exports.generateToken({ id }, config_1.TOKEN_EXPIRY_EMAIL_VERIFICATION, enum_1.Tokens.EMAIL_VERIFY);
/**
 * Generate a new email verification JWT
 */
exports.resendEmailVerificationToken = (id) => exports.generateToken({ id }, config_1.TOKEN_EXPIRY_EMAIL_VERIFICATION, enum_1.Tokens.EMAIL_RESEND);
/**
 * Generate a new password reset JWT
 */
exports.passwordResetToken = (id) => exports.generateToken({ id }, config_1.TOKEN_EXPIRY_PASSWORD_RESET, enum_1.Tokens.PASSWORD_RESET);
/**
 * Generate a new login JWT
 */
exports.loginToken = (user) => exports.generateToken(user, config_1.TOKEN_EXPIRY_LOGIN, enum_1.Tokens.LOGIN);
/**
 * Generate a new 2FA JWT
 */
exports.twoFactorToken = (user) => exports.generateToken({ id: user.id }, config_1.TOKEN_EXPIRY_LOGIN, enum_1.Tokens.TWO_FACTOR);
/**
 * Generate an API key JWT
 */
exports.apiKeyToken = (apiKey) => {
    const createApiKey = Object.assign({}, utils_1.removeFalsyValues(apiKey));
    delete createApiKey.createdAt;
    delete createApiKey.jwtApiKey;
    delete createApiKey.updatedAt;
    delete createApiKey.name;
    delete createApiKey.description;
    delete createApiKey.expiresAt;
    return exports.generateToken(createApiKey, (apiKey.expiresAt
        ? new Date(apiKey.expiresAt).getTime()
        : config_1.TOKEN_EXPIRY_API_KEY_MAX) - new Date().getTime(), enum_1.Tokens.API_KEY);
};
/**
 * Generate an access token
 */
exports.accessToken = (accessToken) => {
    const createAccessToken = Object.assign({}, utils_1.removeFalsyValues(accessToken));
    delete createAccessToken.createdAt;
    delete createAccessToken.jwtAccessToken;
    delete createAccessToken.updatedAt;
    delete createAccessToken.name;
    delete createAccessToken.description;
    delete createAccessToken.expiresAt;
    return exports.generateToken(createAccessToken, (accessToken.expiresAt
        ? new Date(accessToken.expiresAt).getTime()
        : config_1.TOKEN_EXPIRY_API_KEY_MAX) - new Date().getTime(), enum_1.Tokens.ACCESS_TOKEN);
};
/**
 * Generate a new approve location JWT
 */
exports.approveLocationToken = (id, ipAddress) => exports.generateToken({ id, ipAddress }, config_1.TOKEN_EXPIRY_APPROVE_LOCATION, enum_1.Tokens.APPROVE_LOCATION);
/**
 * Generate a new refresh JWT
 */
exports.refreshToken = (id) => exports.generateToken({ id }, config_1.TOKEN_EXPIRY_REFRESH, enum_1.Tokens.REFRESH);
exports.postLoginTokens = (user, locals, refreshTokenString) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user.id)
        throw new Error(errors_1.USER_NOT_FOUND);
    const refresh = yield exports.refreshToken(user.id);
    if (!refreshTokenString) {
        let jwtToken = refresh;
        try {
            const decoded = jsonwebtoken_1.decode(refresh);
            if (decoded && typeof decoded === "object" && decoded.jti) {
                jwtToken = decoded.jti;
            }
        }
        catch (error) { }
        yield prisma_1.prisma.sessions.create({
            data: {
                jwtToken,
                ipAddress: locals.ipAddress || "unknown-ip-address",
                userAgent: locals.userAgent || "unknown-user-agent",
                user: { connect: { id: user.id } },
            },
        });
    }
    else {
        yield user_service_1.updateSessionByJwt(user.id, refreshTokenString, {});
    }
    return {
        token: yield exports.loginToken(Object.assign({}, utils_1.deleteSensitiveInfoUser(user))),
        refresh: !refreshTokenString ? refresh : undefined,
    };
});
/**
 * Get the token response after logging in a user
 */
exports.getLoginResponse = (user, type, strategy, locals) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user.id)
        throw new Error(errors_1.USER_NOT_FOUND);
    const verifiedEmails = yield prisma_1.prisma.emails.findMany({
        where: { userId: user.id, isVerified: true },
    });
    if (!verifiedEmails.length)
        throw new Error(errors_1.UNVERIFIED_EMAIL);
    if (locals) {
        if (!(yield user_service_1.checkApprovedLocation(user.id, locals.ipAddress))) {
            const location = yield location_1.getGeolocationFromIp(locals.ipAddress);
            yield mail_1.mail((yield user_service_1.getUserPrimaryEmail(user.id)).email, enum_1.Templates.UNAPPROVED_LOCATION, Object.assign(Object.assign({}, user), { location: location
                    ? location.city || location.region_name || location.country_code
                    : "Unknown location", token: yield exports.approveLocationToken(user.id, locals.ipAddress) }));
            throw new Error(errors_1.UNAPPROVED_LOCATION);
        }
    }
    if (user.twoFactorEnabled)
        return {
            twoFactorToken: yield exports.twoFactorToken(user),
        };
    return exports.postLoginTokens(user, locals);
});
/**
 * Check if a token is invalidated in Redis
 * @param token - JWT
 */
exports.checkInvalidatedToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!redis_1.default)
        return;
    const details = jsonwebtoken_1.decode(token);
    if (details &&
        typeof details === "object" &&
        details.jti &&
        (yield redis_1.default.get(`${config_1.JWT_ISSUER}-revoke-${details.sub}-${details.jti}`)))
        throw new Error(errors_1.REVOKED_TOKEN);
});
/**
 * Invalidate a JWT using Redis
 * @param token - JWT
 */
exports.invalidateToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!redis_1.default)
        return;
    const details = jsonwebtoken_1.decode(token);
    if (details && typeof details === "object" && details.jti)
        yield redis_1.default.set(`${config_1.JWT_ISSUER}-revoke-${details.sub}-${details.jti}`, "1", details.exp && [
            "EX",
            Math.floor((details.exp - new Date().getTime()) / 1000),
        ]);
});
exports.checkIpRestrictions = (apiKey, locals) => {
    if (!apiKey.ipRestrictions)
        return;
    if (!text_1.ipRangeCheck(locals.ipAddress, apiKey.ipRestrictions.split(",").map((range) => range.trim())))
        throw new Error(errors_1.IP_RANGE_CHECK_FAIL);
};
exports.checkReferrerRestrictions = (apiKey, domain) => {
    if (!apiKey.referrerRestrictions || !domain)
        return;
    if (!utils_1.includesDomainInCommaList(apiKey.referrerRestrictions, domain))
        throw new Error(errors_1.REFERRER_CHECK_FAIL);
};
//# sourceMappingURL=jwt.js.map