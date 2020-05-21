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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.resendEmailVerification = exports.sendEmailVerification = exports.createEmail = exports.updateSessionByJwt = exports.getUserBestEmail = exports.getUserPrimaryEmail = exports.deleteAccessToken = exports.updateAccessToken = exports.createAccessToken = exports.createBackupCodes = exports.checkApprovedLocation = exports.addApprovedLocation = exports.updateUser = exports.getUserByEmail = exports.createUser = exports.checkUserUsernameAvailability = exports.getBestUsernameForUser = void 0;
const errors_1 = require("@staart/errors");
const text_1 = require("@staart/text");
const crypto_1 = require("crypto");
const random_int_1 = __importDefault(require("random-int"));
const config_1 = require("../../config");
const jwt_1 = require("../helpers/jwt");
const utils_1 = require("../helpers/utils");
const prisma_1 = require("../helpers/prisma");
const jsonwebtoken_1 = require("jsonwebtoken");
const jwt_2 = require("../helpers/jwt");
const mail_1 = require("../helpers/mail");
const enum_1 = require("../interfaces/enum");
const auth_1 = require("../rest/auth");
const cache_1 = require("../helpers/cache");
/**
 * Get the best available username for a user
 * For example, if the user's name is "Anand Chowdhary"
 * Usernames: "anand", "anand-chowdhary", "anand-chowdhary-a29hi3q"
 * @param name - Name of user
 */
exports.getBestUsernameForUser = (name) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    if (name.split(" ")[0].trim().length) {
        result = text_1.slugify(name.split(" ")[0].trim());
        if (result &&
            !(yield prisma_1.prisma.users.findMany({ where: { username: result } })).length)
            return result;
    }
    result = text_1.slugify(name.trim());
    if (result &&
        !(yield prisma_1.prisma.users.findMany({ where: { username: result } })).length)
        return result;
    let available = false;
    while (!available) {
        result = text_1.createSlug(name);
        if (!(yield prisma_1.prisma.users.findMany({ where: { username: result } })).length)
            available = true;
    }
    return result;
});
/**
 * Check if an organization username is available
 */
exports.checkUserUsernameAvailability = (username) => __awaiter(void 0, void 0, void 0, function* () {
    return ((yield prisma_1.prisma.users.findMany({
        where: { username },
    })).length === 0);
});
/**
 * Create a new user
 */
exports.createUser = (_user) => __awaiter(void 0, void 0, void 0, function* () {
    const user = Object.assign({ nickname: "" }, _user);
    user.name = text_1.capitalizeFirstAndLastLetter(user.name);
    user.nickname = user.nickname || user.name.split(" ")[0];
    user.password = user.password ? yield text_1.hash(user.password, 8) : null;
    user.profilePicture =
        user.profilePicture ||
            `https://api.adorable.io/avatars/285/${crypto_1.createHash("md5")
                .update(user.name)
                .digest("hex")}.png`;
    // Create user
    const result = yield prisma_1.prisma.users.create({
        data: user,
    });
    return result;
});
/**
 * Get the details of a user by their email
 */
exports.getUserByEmail = (email, secureOrigin = false) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma_1.prisma.users.findMany({
        where: {
            emails: {
                some: {
                    email,
                    isVerified: true,
                },
            },
        },
    });
    if (!users.length)
        throw new Error(errors_1.USER_NOT_FOUND);
    if (!secureOrigin)
        return utils_1.deleteSensitiveInfoUser(users[0]);
    return users[0];
});
/**
 * Update a user's details
 */
exports.updateUser = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const originalUser = yield exports.getUserById(id);
    yield cache_1.deleteItemFromCache(`cache_getUserById_${originalUser.id}`);
    if (user.password)
        user.password = yield text_1.hash(user.password, 8);
    // If you're updating your primary email, your Gravatar should reflect it
    if (user.primaryEmail) {
        if ((originalUser.profilePicture || "").includes("api.adorable.io")) {
            const emailDetails = yield prisma_1.prisma.emails.findOne({
                where: { id: user.primaryEmail },
            });
            if (emailDetails)
                user.profilePicture = `https://www.gravatar.com/avatar/${crypto_1.createHash("md5")
                    .update(emailDetails.email)
                    .digest("hex")}?d=${encodeURIComponent(`https://api.adorable.io/avatars/285/${crypto_1.createHash("md5")
                    .update(originalUser.name)
                    .digest("hex")}.png`)}`;
        }
    }
    // If you're updating your username, make sure it's available
    if (user.username) {
        const currentOwnerOfUsername = yield prisma_1.prisma.users.findMany({
            where: { username: user.username },
        });
        if (currentOwnerOfUsername.length &&
            currentOwnerOfUsername[0].id !== originalUser.id)
            throw new Error(errors_1.USERNAME_EXISTS);
    }
    const result = yield prisma_1.prisma.users.update({
        data: user,
        where: { id: parseInt(id) },
    });
    return result;
});
/**
 * Add a new approved location for a user
 * @param ipAddress - IP address for the new location
 */
exports.addApprovedLocation = (userId, ipAddress) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof userId === "number")
        userId = userId.toString();
    const subnet = text_1.anonymizeIpAddress(ipAddress);
    return prisma_1.prisma.approved_locations.create({
        data: {
            user: { connect: { id: parseInt(userId) } },
            subnet,
            createdAt: new Date(),
        },
    });
});
/**
 * Check whether a location is approved for a user
 * @param ipAddress - IP address for checking
 */
exports.checkApprovedLocation = (userId, ipAddress) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof userId === "number")
        userId = userId.toString();
    const user = yield exports.getUserById(userId);
    if (!user)
        throw new Error(errors_1.USER_NOT_FOUND);
    if (!user.checkLocationOnLogin)
        return true;
    const subnet = text_1.anonymizeIpAddress(ipAddress);
    return ((yield prisma_1.prisma.approved_locations.findMany({
        where: { userId: parseInt(userId), subnet },
    })).length !== 0);
});
/**
 * Create 2FA backup codes for user
 * We generate 6-digit backup codes for a user
 * and save the hashed version in the database
 * @param count - Number of backup codes to create
 */
exports.createBackupCodes = (userId, count = 1) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    if (typeof userId === "number")
        userId = userId.toString();
    const now = new Date();
    const codes = [];
    try {
        for (var _b = __asyncValues(Array.from(Array(count).keys())), _c; _c = yield _b.next(), !_c.done;) {
            const _ = _c.value;
            const code = random_int_1.default(100000, 999999).toString();
            codes.push(code);
            yield prisma_1.prisma.backup_codes.create({
                data: {
                    code: yield text_1.hash(code, 8),
                    user: { connect: { id: parseInt(userId) } },
                    createdAt: now,
                    updatedAt: now,
                },
            });
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return codes;
});
/**
 * Create an API key
 */
exports.createAccessToken = (data) => __awaiter(void 0, void 0, void 0, function* () {
    data.expiresAt = data.expiresAt || new Date(config_1.TOKEN_EXPIRY_API_KEY_MAX);
    data.jwtAccessToken = yield jwt_1.accessToken(data);
    return prisma_1.prisma.access_tokens.create({ data });
});
/**
 * Update a user's details
 */
exports.updateAccessToken = (accessTokenId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const newAccessToken = yield prisma_1.prisma.access_tokens.findOne({
        where: { id: parseInt(accessTokenId) },
    });
    if (!newAccessToken)
        throw new Error(errors_1.RESOURCE_NOT_FOUND);
    if (newAccessToken.jwtAccessToken)
        yield jwt_1.invalidateToken(newAccessToken.jwtAccessToken);
    data.jwtAccessToken = yield jwt_1.accessToken(Object.assign(Object.assign({}, newAccessToken), data));
    return prisma_1.prisma.access_tokens.update({
        data,
        where: { id: parseInt(accessTokenId) },
    });
});
/**
 * Delete an API key
 */
exports.deleteAccessToken = (accessTokenId) => __awaiter(void 0, void 0, void 0, function* () {
    const currentAccessToken = yield prisma_1.prisma.access_tokens.findOne({
        where: { id: parseInt(accessTokenId) },
    });
    if (!currentAccessToken)
        throw new Error(errors_1.RESOURCE_NOT_FOUND);
    if (currentAccessToken.jwtAccessToken)
        yield jwt_1.invalidateToken(currentAccessToken.jwtAccessToken);
    return prisma_1.prisma.access_tokens.delete({
        where: { id: parseInt(accessTokenId) },
    });
});
/**
 * Get the primary email of a user
 * @param userId - User Id
 */
exports.getUserPrimaryEmail = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    if (typeof userId === "number")
        userId = userId.toString();
    const primaryEmailId = (_d = (yield prisma_1.prisma.users.findOne({
        select: { primaryEmail: true },
        where: { id: parseInt(userId) },
    }))) === null || _d === void 0 ? void 0 : _d.primaryEmail;
    if (!primaryEmailId)
        throw new Error(errors_1.MISSING_PRIMARY_EMAIL);
    const primaryEmail = yield prisma_1.prisma.emails.findOne({
        where: { id: primaryEmailId },
    });
    if (!primaryEmail)
        throw new Error(errors_1.MISSING_PRIMARY_EMAIL);
    return primaryEmail;
});
/**
 * Get the best email to contact a user
 * @param userId - User ID
 */
exports.getUserBestEmail = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof userId === "number")
        userId = userId.toString();
    try {
        return yield exports.getUserPrimaryEmail(userId);
    }
    catch (error) { }
    const emails = yield prisma_1.prisma.emails.findMany({
        where: { userId: parseInt(userId) },
        orderBy: { isVerified: "desc" },
        first: 1,
    });
    if (!emails.length)
        throw new Error(errors_1.RESOURCE_NOT_FOUND);
    return emails[0];
});
/**
 * Update a session based on JWT
 * @param userId - User ID
 * @param sessionJwt - Provided session JWT
 * @param data - Session information to update
 */
exports.updateSessionByJwt = (userId, sessionJwt, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = jsonwebtoken_1.decode(sessionJwt);
        if (decoded && typeof decoded === "object" && decoded.jti) {
            sessionJwt = decoded.jti;
        }
    }
    catch (error) { }
    const currentSession = yield prisma_1.prisma.sessions.findMany({
        where: { jwtToken: sessionJwt, userId },
    });
    if (!currentSession.length)
        throw new Error(errors_1.RESOURCE_NOT_FOUND);
    return prisma_1.prisma.sessions.update({ where: { id: currentSession[0].id }, data });
});
/**
 * Create a new email for a user
 * @param sendVerification  Whether to send an email verification link to new email
 * @param isVerified  Whether this email is verified by default
 */
exports.createEmail = (userId, email, sendVerification = true, sendPasswordSet = false) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.emails.create({
        data: { email, user: { connect: { id: userId } } },
    });
    if (sendVerification) {
        const user = yield exports.getUserById(userId);
        if (!user)
            throw new Error(errors_1.USER_NOT_FOUND);
        yield exports.sendEmailVerification(result.id, email, user);
    }
    if (sendPasswordSet)
        yield auth_1.sendNewPassword(userId, email);
    return result;
});
/**
 * Send an email verification link
 */
exports.sendEmailVerification = (id, email, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof id === "number")
        id = id.toString();
    const token = yield jwt_2.emailVerificationToken(id);
    yield mail_1.mail(email, enum_1.Templates.EMAIL_VERIFY, { name: user.name, email, token });
    return;
});
/**
 * Resend an email verification link
 */
exports.resendEmailVerification = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof id === "number")
        id = id.toString();
    const token = yield jwt_2.emailVerificationToken(id);
    const emailObject = yield prisma_1.prisma.emails.findOne({
        where: { id: parseInt(id) },
    });
    if (!emailObject)
        throw new Error(errors_1.RESOURCE_NOT_FOUND);
    const email = emailObject.email;
    const user = yield exports.getUserById(emailObject.userId);
    if (!user)
        throw new Error(errors_1.USER_NOT_FOUND);
    yield mail_1.mail(email, enum_1.Templates.EMAIL_VERIFY, { name: user.name, email, token });
    return;
});
/**
 * Get a user object from its ID
 * @param id - User ID
 */
exports.getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof id === "number")
        id = id.toString();
    const key = `cache_getUserById_${id}`;
    try {
        return yield cache_1.getItemFromCache(key);
    }
    catch (error) {
        const user = yield prisma_1.prisma.users.findOne({ where: { id: parseInt(id) } });
        if (user) {
            yield cache_1.setItemInCache(key, user);
            return user;
        }
        throw new Error(errors_1.USER_NOT_FOUND);
    }
});
//# sourceMappingURL=user.service.js.map