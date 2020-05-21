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
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendEmailVerificationWithToken = exports.approveLocation = exports.impersonate = exports.updatePassword = exports.verifyEmail = exports.sendNewPassword = exports.sendPasswordReset = exports.register = exports.login2FA = exports.login = exports.invalidateRefreshToken = exports.validateRefreshToken = void 0;
const disposable_email_1 = require("@staart/disposable-email");
const errors_1 = require("@staart/errors");
const text_1 = require("@staart/text");
const otplib_1 = require("otplib");
const config_1 = require("../../config");
const authorization_1 = require("../helpers/authorization");
const jwt_1 = require("../helpers/jwt");
const cache_1 = require("../helpers/cache");
const mail_1 = require("../helpers/mail");
const tracking_1 = require("../helpers/tracking");
const enum_1 = require("../interfaces/enum");
const prisma_1 = require("../helpers/prisma");
const user_service_1 = require("../services/user.service");
const organization_service_1 = require("../services/organization.service");
exports.validateRefreshToken = (token, locals) => __awaiter(void 0, void 0, void 0, function* () {
    yield jwt_1.checkInvalidatedToken(token);
    const data = yield jwt_1.verifyToken(token, enum_1.Tokens.REFRESH);
    if (!data.id)
        throw new Error(errors_1.USER_NOT_FOUND);
    const user = yield user_service_1.getUserById(data.id);
    if (!user)
        throw new Error(errors_1.USER_NOT_FOUND);
    return jwt_1.postLoginTokens(user, locals, token);
});
exports.invalidateRefreshToken = (token, locals) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield jwt_1.verifyToken(token, enum_1.Tokens.REFRESH);
    if (!data.id)
        throw new Error(errors_1.USER_NOT_FOUND);
    yield prisma_1.prisma.sessions.deleteMany({
        where: { jwtToken: token, userId: parseInt(data.id) },
    });
    return;
});
exports.login = (email, password, locals) => __awaiter(void 0, void 0, void 0, function* () {
    let user;
    try {
        user = yield user_service_1.getUserByEmail(email, true);
    }
    catch (error) {
        const hasUserWithUnverifiedEmail = (yield prisma_1.prisma.users.count({
            where: {
                emails: {
                    some: {
                        email,
                        isVerified: false,
                    },
                },
            },
        })) !== 0;
        if (hasUserWithUnverifiedEmail)
            throw new Error("401/unverified-email");
        throw new Error(errors_1.USER_NOT_FOUND);
    }
    if (!user.password)
        throw new Error(errors_1.MISSING_PASSWORD);
    const isPasswordCorrect = yield text_1.compare(password, user.password);
    if (isPasswordCorrect)
        return jwt_1.getLoginResponse(user, enum_1.EventType.AUTH_LOGIN, "local", locals);
    throw new Error(errors_1.INVALID_LOGIN);
});
exports.login2FA = (code, token, locals) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    const data = yield jwt_1.verifyToken(token, enum_1.Tokens.TWO_FACTOR);
    const user = yield user_service_1.getUserById(data.id);
    if (!user)
        throw new Error(errors_1.USER_NOT_FOUND);
    const secret = user.twoFactorSecret;
    if (!secret)
        throw new Error(errors_1.NOT_ENABLED_2FA);
    if (otplib_1.authenticator.check(code.toString(), secret))
        return jwt_1.postLoginTokens(user, locals);
    const allBackupCodes = yield prisma_1.prisma.backup_codes.findMany({
        where: { userId: user.id },
    });
    let usedBackupCode = undefined;
    try {
        for (var allBackupCodes_1 = __asyncValues(allBackupCodes), allBackupCodes_1_1; allBackupCodes_1_1 = yield allBackupCodes_1.next(), !allBackupCodes_1_1.done;) {
            const backupCode = allBackupCodes_1_1.value;
            if (yield text_1.compare(backupCode.code, code.toString()))
                usedBackupCode = backupCode;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (allBackupCodes_1_1 && !allBackupCodes_1_1.done && (_a = allBackupCodes_1.return)) yield _a.call(allBackupCodes_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    if (usedBackupCode && !usedBackupCode.isUsed) {
        yield prisma_1.prisma.backup_codes.update({
            where: { id: usedBackupCode.id },
            data: { isUsed: true },
        });
        return jwt_1.postLoginTokens(user, locals);
    }
    throw new Error(errors_1.INVALID_2FA_TOKEN);
});
exports.register = (_user, locals, email, organizationId, role, emailVerified = false) => __awaiter(void 0, void 0, void 0, function* () {
    const user = Object.assign({ username: "", nickname: "" }, _user);
    if (email) {
        const isNewEmail = (yield prisma_1.prisma.emails.findMany({ where: { email, isVerified: true } }))
            .length === 0;
        if (!isNewEmail)
            throw new Error(errors_1.EMAIL_EXISTS);
        if (!config_1.ALLOW_DISPOSABLE_EMAILS)
            disposable_email_1.checkIfDisposableEmail(email);
    }
    if (user.username && !(yield user_service_1.checkUserUsernameAvailability(user.username)))
        throw new Error(errors_1.USERNAME_EXISTS);
    user.username = user.username || (yield user_service_1.getBestUsernameForUser(user.name));
    if (!organizationId && email) {
        let domain = "";
        try {
            domain = email.split("@")[1];
            const domainDetails = yield organization_service_1.getDomainByDomainName(domain);
            organizationId = domainDetails.organizationId.toString();
        }
        catch (error) { }
    }
    const userId = (yield user_service_1.createUser(Object.assign(Object.assign({}, user), (organizationId
        ? {
            memberships: {
                create: {
                    organization: {
                        connect: { id: parseInt(organizationId) },
                    },
                    role,
                },
            },
        }
        : {})))).id;
    let resendToken = undefined;
    if (email) {
        const newEmail = yield user_service_1.createEmail(userId, email, !emailVerified);
        yield prisma_1.prisma.users.update({
            where: { id: userId },
            data: { primaryEmail: newEmail.id },
        });
        yield cache_1.deleteItemFromCache(`cache_getUserById_${userId}`);
        resendToken = yield jwt_1.resendEmailVerificationToken(newEmail.id.toString());
    }
    if (locals)
        yield user_service_1.addApprovedLocation(userId, locals.ipAddress);
    return { userId, resendToken };
});
exports.sendPasswordReset = (email, locals) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.getUserByEmail(email);
    const token = yield jwt_1.passwordResetToken(user.id);
    yield mail_1.mail(email, enum_1.Templates.PASSWORD_RESET, { name: user.name, token });
    if (locals)
        tracking_1.trackEvent({
            userId: user.id,
            type: enum_1.EventType.AUTH_PASSWORD_RESET_REQUESTED,
            data: { token },
        }, locals);
    return;
});
exports.sendNewPassword = (userId, email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.prisma.users.findOne({
        where: { id: userId },
        include: { emails: true },
    });
    if (!user)
        throw new Error(errors_1.USER_NOT_FOUND);
    if (!user.emails.filter((userEmail) => userEmail.email === email).length)
        throw new Error(errors_1.RESOURCE_NOT_FOUND);
    const token = yield jwt_1.passwordResetToken(user.id);
    yield mail_1.mail(email, enum_1.Templates.NEW_PASSWORD, { name: user.name, token });
    return;
});
exports.verifyEmail = (token, locals) => __awaiter(void 0, void 0, void 0, function* () {
    const emailId = (yield jwt_1.verifyToken(token, enum_1.Tokens.EMAIL_VERIFY)).id;
    const email = yield prisma_1.prisma.emails.findOne({
        where: { id: parseInt(emailId) },
    });
    if (!email)
        throw new Error(errors_1.RESOURCE_NOT_FOUND);
    tracking_1.trackEvent({
        userId: email.userId,
        type: enum_1.EventType.EMAIL_VERIFIED,
        data: { id: emailId },
    }, locals);
    return prisma_1.prisma.emails.update({
        where: { id: parseInt(emailId) },
        data: { isVerified: true },
    });
});
exports.updatePassword = (token, password, locals) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = (yield jwt_1.verifyToken(token, enum_1.Tokens.PASSWORD_RESET)).id;
    yield prisma_1.prisma.users.update({
        where: { id: parseInt(userId) },
        data: { password: yield text_1.hash(password, 8) },
    });
    yield cache_1.deleteItemFromCache(`cache_getUserById_${userId}`);
    tracking_1.trackEvent({
        userId,
        type: enum_1.EventType.AUTH_PASSWORD_CHANGED,
    }, locals);
    return;
});
exports.impersonate = (tokenUserId, impersonateUserId, locals) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield authorization_1.can(tokenUserId, enum_1.UserScopes.IMPERSONATE, "user", impersonateUserId)))
        throw new Error(errors_1.INSUFFICIENT_PERMISSION);
    const user = yield user_service_1.getUserById(impersonateUserId);
    if (user)
        return jwt_1.getLoginResponse(user, enum_1.EventType.AUTH_LOGIN, "impersonate", locals);
    throw new Error(errors_1.USER_NOT_FOUND);
});
exports.approveLocation = (token, locals) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenUser = yield jwt_1.verifyToken(token, enum_1.Tokens.APPROVE_LOCATION);
    if (!tokenUser.id)
        throw new Error(errors_1.USER_NOT_FOUND);
    const user = yield user_service_1.getUserById(tokenUser.id);
    if (!user)
        throw new Error(errors_1.USER_NOT_FOUND);
    const ipAddress = tokenUser.ipAddress || locals.ipAddress;
    yield user_service_1.addApprovedLocation(user.id, ipAddress);
    tracking_1.trackEvent({
        userId: tokenUser.id,
        type: enum_1.EventType.AUTH_APPROVE_LOCATION,
    }, locals);
    return jwt_1.getLoginResponse(user, enum_1.EventType.AUTH_APPROVE_LOCATION, ipAddress, locals);
});
exports.resendEmailVerificationWithToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield jwt_1.verifyToken(token, enum_1.Tokens.EMAIL_RESEND);
    if (!data.id)
        throw new Error(errors_1.USER_NOT_FOUND);
    return user_service_1.resendEmailVerification(data.id);
});
//# sourceMappingURL=auth.js.map