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
exports.updateMembershipForUser = exports.deleteMembershipForUser = exports.getMembershipDetailsForUser = exports.deleteEmailFromUserForUser = exports.addEmailToUserForUser = exports.resendEmailVerificationForUser = exports.getEmailForUser = exports.getAllEmailsForUser = exports.addInvitationCredits = exports.deleteIdentityForUser = exports.getUserIdentityForUser = exports.connectUserIdentityForUser = exports.createUserIdentityForUser = exports.getUserIdentitiesForUser = exports.deleteSessionForUser = exports.getUserSessionForUser = exports.getUserSessionsForUser = exports.deleteAccessTokenForUser = exports.createAccessTokenForUser = exports.updateAccessTokenForUser = exports.getUserAccessTokenForUser = exports.getUserAccessTokensForUser = exports.regenerateBackupCodesForUser = exports.disable2FAForUser = exports.verify2FAForUser = exports.enable2FAForUser = exports.getAllDataForUser = exports.getMembershipsForUser = exports.deleteUserForUser = exports.updatePasswordForUser = exports.updateUserForUser = exports.getUserFromIdForUser = void 0;
const errors_1 = require("@staart/errors");
const text_1 = require("@staart/text");
const otplib_1 = require("otplib");
const qrcode_1 = require("qrcode");
const config_1 = require("../../config");
const user_service_1 = require("../services/user.service");
const authorization_1 = require("../helpers/authorization");
const tracking_1 = require("../helpers/tracking");
const organization_1 = require("./organization");
const enum_1 = require("../interfaces/enum");
const mail_1 = require("../helpers/mail");
const payments_1 = require("@staart/payments");
const jwt_1 = require("../helpers/jwt");
const prisma_1 = require("../helpers/prisma");
const config_2 = require("../../config");
const disposable_email_1 = require("@staart/disposable-email");
const cache_1 = require("../helpers/cache");
exports.getUserFromIdForUser = (userId, tokenUserId, queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(tokenUserId, enum_1.UserScopes.READ_USER, "user", userId)) {
        const user = yield prisma_1.prisma.users.findOne(Object.assign(Object.assign({}, prisma_1.queryParamsToSelect(queryParams)), { where: { id: parseInt(userId) } }));
        if (user)
            return user;
        throw new Error(errors_1.USER_NOT_FOUND);
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.updateUserForUser = (tokenUserId, updateUserId, data, locals) => __awaiter(void 0, void 0, void 0, function* () {
    delete data.password;
    if (yield authorization_1.can(tokenUserId, enum_1.UserScopes.UPDATE_USER, "user", updateUserId)) {
        const user = yield prisma_1.prisma.users.update({
            data,
            where: { id: parseInt(updateUserId) },
        });
        yield cache_1.deleteItemFromCache(`cache_getUserById_${updateUserId}`);
        tracking_1.trackEvent({
            userId: tokenUserId,
            type: enum_1.EventType.USER_UPDATED,
            data: { id: updateUserId, data },
        }, locals);
        return user;
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.updatePasswordForUser = (tokenUserId, updateUserId, oldPassword, newPassword, locals) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(tokenUserId, enum_1.UserScopes.CHANGE_PASSWORD, "user", updateUserId)) {
        const user = yield user_service_1.getUserById(updateUserId);
        if (user.password) {
            const correctPassword = yield text_1.compare(oldPassword, user.password);
            if (!correctPassword)
                throw new Error(errors_1.INCORRECT_PASSWORD);
        }
        const result = yield prisma_1.prisma.users.update({
            data: { password: yield text_1.hash(newPassword, 8) },
            where: { id: parseInt(updateUserId) },
        });
        yield cache_1.deleteItemFromCache(`cache_getUserById_${updateUserId}`);
        tracking_1.trackEvent({
            userId: tokenUserId,
            type: enum_1.EventType.AUTH_PASSWORD_CHANGED,
            data: { id: updateUserId },
        }, locals);
        return result;
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.deleteUserForUser = (tokenUserId, updateUserId, locals) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    if (yield authorization_1.can(tokenUserId, enum_1.UserScopes.DELETE_USER, "user", updateUserId)) {
        const organizationsToDelete = yield prisma_1.prisma.organizations.findMany({
            select: {
                stripeCustomerId: true,
            },
            where: {
                memberships: {
                    every: { userId: parseInt(updateUserId) },
                },
            },
        });
        try {
            for (var organizationsToDelete_1 = __asyncValues(organizationsToDelete), organizationsToDelete_1_1; organizationsToDelete_1_1 = yield organizationsToDelete_1.next(), !organizationsToDelete_1_1.done;) {
                const organization = organizationsToDelete_1_1.value;
                if (organization.stripeCustomerId)
                    yield payments_1.deleteCustomer(organization.stripeCustomerId);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (organizationsToDelete_1_1 && !organizationsToDelete_1_1.done && (_a = organizationsToDelete_1.return)) yield _a.call(organizationsToDelete_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        yield prisma_1.prisma.organizations.deleteMany({
            where: {
                memberships: {
                    every: { userId: parseInt(updateUserId) },
                },
            },
        });
        yield prisma_1.prisma.emails.deleteMany({
            where: { userId: parseInt(updateUserId) },
        });
        yield prisma_1.prisma.memberships.deleteMany({
            where: { userId: parseInt(updateUserId) },
        });
        yield prisma_1.prisma.approved_locations.deleteMany({
            where: { userId: parseInt(updateUserId) },
        });
        const originalUser = yield user_service_1.getUserById(updateUserId);
        yield prisma_1.prisma.users.delete({ where: { id: parseInt(updateUserId) } });
        yield cache_1.deleteItemFromCache(`cache_getUserById_${originalUser.id}`, `cache_getUserIdByUsername_${originalUser.username}`);
        tracking_1.trackEvent({
            userId: tokenUserId,
            type: enum_1.EventType.USER_DELETED,
            data: { id: updateUserId },
        }, locals);
        return;
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.getMembershipsForUser = (tokenUserId, dataUserId, queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(tokenUserId, enum_1.UserScopes.READ_USER_MEMBERSHIPS, "user", dataUserId))
        return prisma_1.paginatedResult(yield prisma_1.prisma.memberships.findMany(Object.assign(Object.assign({}, prisma_1.queryParamsToSelect(queryParams)), { where: { userId: parseInt(dataUserId) }, include: { organization: true } })), { first: queryParams.first, last: queryParams.last });
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.getAllDataForUser = (tokenUserId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield authorization_1.can(tokenUserId, enum_1.UserScopes.READ_USER, "user", userId)))
        throw new Error(errors_1.INSUFFICIENT_PERMISSION);
    return prisma_1.prisma.users.findOne({
        where: { id: parseInt(userId) },
        include: {
            emails: true,
            access_tokens: true,
            approved_locations: true,
            backup_codes: true,
            identities: true,
            memberships: true,
            sessions: true,
        },
    });
});
exports.enable2FAForUser = (tokenUserId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield authorization_1.can(tokenUserId, enum_1.UserScopes.ENABLE_USER_2FA, "user", userId)))
        throw new Error(errors_1.INSUFFICIENT_PERMISSION);
    const secret = otplib_1.authenticator.generateSecret();
    yield prisma_1.prisma.users.update({
        where: { id: parseInt(userId) },
        data: { twoFactorSecret: secret },
    });
    yield cache_1.deleteItemFromCache(`cache_getUserById_${userId}`);
    const authPath = otplib_1.authenticator.keyuri(`user-${userId}`, config_1.SERVICE_2FA, secret);
    const qrCode = yield qrcode_1.toDataURL(authPath);
    return { qrCode };
});
exports.verify2FAForUser = (tokenUserId, userId, verificationCode) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    if (!(yield authorization_1.can(tokenUserId, enum_1.UserScopes.ENABLE_USER_2FA, "user", userId)))
        throw new Error(errors_1.INSUFFICIENT_PERMISSION);
    const secret = (_b = (yield prisma_1.prisma.users.findOne({
        select: { twoFactorSecret: true },
        where: { id: parseInt(userId) },
    }))) === null || _b === void 0 ? void 0 : _b.twoFactorSecret;
    if (!secret)
        throw new Error(errors_1.NOT_ENABLED_2FA);
    if (!otplib_1.authenticator.check(verificationCode.toString(), secret))
        throw new Error(errors_1.INVALID_2FA_TOKEN);
    const codes = yield user_service_1.createBackupCodes(userId, 10);
    yield prisma_1.prisma.users.update({
        where: { id: parseInt(userId) },
        data: { twoFactorEnabled: true },
    });
    yield cache_1.deleteItemFromCache(`cache_getUserById_${userId}`);
    return codes;
});
exports.disable2FAForUser = (tokenUserId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield authorization_1.can(tokenUserId, enum_1.UserScopes.DISABLE_USER_2FA, "user", userId)))
        throw new Error(errors_1.INSUFFICIENT_PERMISSION);
    yield prisma_1.prisma.backup_codes.deleteMany({ where: { userId: parseInt(userId) } });
    const result = prisma_1.prisma.users.update({
        where: { id: parseInt(userId) },
        data: {
            twoFactorEnabled: false,
            twoFactorSecret: null,
        },
    });
    yield cache_1.deleteItemFromCache(`cache_getUserById_${userId}`);
    return result;
});
exports.regenerateBackupCodesForUser = (tokenUserId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield authorization_1.can(tokenUserId, enum_1.UserScopes.REGENERATE_USER_BACKUP_CODES, "user", userId)))
        throw new Error(errors_1.INSUFFICIENT_PERMISSION);
    yield prisma_1.prisma.backup_codes.deleteMany({ where: { userId: parseInt(userId) } });
    return user_service_1.createBackupCodes(userId, 10);
});
exports.getUserAccessTokensForUser = (tokenUserId, userId, queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(tokenUserId, enum_1.UserScopes.READ_USER_ACCESS_TOKENS, "user", userId))
        return prisma_1.paginatedResult(yield prisma_1.prisma.access_tokens.findMany(Object.assign({ where: { userId: parseInt(userId) } }, prisma_1.queryParamsToSelect(queryParams))), { first: queryParams.first, last: queryParams.last });
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.getUserAccessTokenForUser = (tokenUserId, userId, accessTokenId) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(tokenUserId, enum_1.UserScopes.READ_USER_ACCESS_TOKENS, "user", userId))
        return prisma_1.prisma.access_tokens.findOne({
            where: { id: parseInt(accessTokenId) },
        });
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.updateAccessTokenForUser = (tokenUserId, userId, accessTokenId, data, locals) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(tokenUserId, enum_1.UserScopes.UPDATE_USER_ACCESS_TOKENS, "user", userId))
        return prisma_1.prisma.access_tokens.update({
            where: { id: parseInt(accessTokenId) },
            data,
        });
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.createAccessTokenForUser = (tokenUserId, userId, accessToken, locals) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(tokenUserId, enum_1.UserScopes.CREATE_USER_ACCESS_TOKENS, "user", userId)) {
        accessToken.jwtAccessToken = text_1.randomString({ length: 20 });
        accessToken.expiresAt =
            accessToken.expiresAt || new Date(config_1.TOKEN_EXPIRY_API_KEY_MAX);
        return prisma_1.prisma.access_tokens.create({
            data: Object.assign(Object.assign({}, accessToken), { user: { connect: { id: parseInt(userId) } } }),
        });
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.deleteAccessTokenForUser = (tokenUserId, userId, accessTokenId, locals) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(tokenUserId, enum_1.UserScopes.DELETE_USER_ACCESS_TOKENS, "user", userId))
        return prisma_1.prisma.access_tokens.delete({
            where: { id: parseInt(accessTokenId) },
        });
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.getUserSessionsForUser = (tokenUserId, userId, queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(tokenUserId, enum_1.UserScopes.READ_USER_SESSION, "user", userId))
        return prisma_1.paginatedResult(yield prisma_1.prisma.sessions.findMany(Object.assign({ where: { userId: parseInt(userId) } }, prisma_1.queryParamsToSelect(queryParams))), { first: queryParams.first, last: queryParams.last });
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.getUserSessionForUser = (tokenUserId, userId, sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(tokenUserId, enum_1.UserScopes.READ_USER_SESSION, "user", userId))
        return prisma_1.prisma.sessions.findOne({ where: { id: parseInt(sessionId) } });
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.deleteSessionForUser = (tokenUserId, userId, sessionId, locals) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(tokenUserId, enum_1.UserScopes.DELETE_USER_SESSION, "user", userId)) {
        return prisma_1.prisma.sessions.delete({ where: { id: parseInt(sessionId) } });
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.getUserIdentitiesForUser = (tokenUserId, userId, queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(tokenUserId, enum_1.UserScopes.READ_USER_IDENTITY, "user", userId))
        return prisma_1.paginatedResult(yield prisma_1.prisma.identities.findMany(Object.assign({ where: { userId: parseInt(userId) } }, prisma_1.queryParamsToSelect(queryParams))), { first: queryParams.first, last: queryParams.last });
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.createUserIdentityForUser = (tokenUserId, userId, identity) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(tokenUserId, enum_1.UserScopes.CREATE_USER_IDENTITY, "user", userId))
        return prisma_1.prisma.identities.create({
            data: Object.assign(Object.assign({}, identity), { user: { connect: { id: parseInt(userId) } } }),
        });
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.connectUserIdentityForUser = (tokenUserId, userId, service, url) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(tokenUserId, enum_1.UserScopes.CREATE_USER_IDENTITY, "user", userId))
        // return createIdentityConnect(userId, service, url);
        throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.getUserIdentityForUser = (tokenUserId, userId, identityId) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(tokenUserId, enum_1.UserScopes.READ_USER_IDENTITY, "user", userId))
        return prisma_1.prisma.identities.findOne({ where: { id: parseInt(identityId) } });
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.deleteIdentityForUser = (tokenUserId, userId, identityId, locals) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(tokenUserId, enum_1.UserScopes.DELETE_USER_IDENTITY, "user", userId)) {
        return prisma_1.prisma.identities.delete({ where: { id: parseInt(identityId) } });
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.addInvitationCredits = (invitedBy, newUserId) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const invitedByUserId = (_c = (yield prisma_1.prisma.users.findOne({
        select: { username: true },
        where: { id: parseInt(invitedBy) },
    }))) === null || _c === void 0 ? void 0 : _c.username;
    if (!invitedByUserId)
        return;
    const invitedByDetails = yield user_service_1.getUserById(invitedByUserId);
    if (!invitedByDetails)
        return;
    const invitedByEmail = yield user_service_1.getUserPrimaryEmail(invitedByUserId);
    const newUserEmail = yield user_service_1.getUserBestEmail(newUserId);
    const newUserDetails = yield user_service_1.getUserById(newUserId);
    if (!newUserDetails)
        return;
    const emailData = {
        invitedByName: invitedByDetails.name,
        invitedByCode: yield jwt_1.couponCodeJwt(500, "usd", `Invite credits from ${newUserDetails.name}`),
        newUserName: newUserDetails.name,
        newUserCode: yield jwt_1.couponCodeJwt(500, "usd", `Invite credits from ${invitedByDetails.name}`),
    };
    yield mail_1.mail(invitedByEmail.email, enum_1.Templates.CREDITS_INVITED_BY, emailData);
    yield mail_1.mail(newUserEmail.email, enum_1.Templates.CREDITS_NEW_USER, emailData);
});
exports.getAllEmailsForUser = (tokenUserId, userId, queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(tokenUserId, enum_1.UserScopes.READ_USER_EMAILS, "user", userId)) {
        return prisma_1.paginatedResult(yield prisma_1.prisma.emails.findMany(Object.assign({ where: { userId: parseInt(userId) } }, prisma_1.queryParamsToSelect(queryParams))), { first: queryParams.first, last: queryParams.last });
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.getEmailForUser = (tokenUserId, userId, emailId) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(tokenUserId, enum_1.UserScopes.READ_USER_EMAILS, "user", userId))
        return prisma_1.prisma.emails.findOne({ where: { id: parseInt(emailId) } });
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.resendEmailVerificationForUser = (tokenUserId, userId, emailId) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(tokenUserId, enum_1.UserScopes.RESEND_USER_EMAIL_VERIFICATION, "user", userId))
        return user_service_1.resendEmailVerification(emailId);
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.addEmailToUserForUser = (tokenUserId, userId, email, locals) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield authorization_1.can(tokenUserId, enum_1.UserScopes.CREATE_USER_EMAILS, "user", userId)))
        throw new Error(errors_1.INSUFFICIENT_PERMISSION);
    if (!config_2.ALLOW_DISPOSABLE_EMAILS)
        disposable_email_1.checkIfDisposableEmail(email);
    const emailExistsAlready = (yield prisma_1.prisma.emails.findMany({ where: { email } })).length !== 0;
    if (emailExistsAlready)
        throw new Error(errors_1.EMAIL_EXISTS);
    const result = yield user_service_1.createEmail(parseInt(userId), email, true);
    tracking_1.trackEvent({ userId, type: enum_1.EventType.EMAIL_CREATED, data: { email } }, locals);
    return result;
});
exports.deleteEmailFromUserForUser = (tokenUserId, userId, emailId, locals) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield authorization_1.can(tokenUserId, enum_1.UserScopes.DELETE_USER_EMAILS, "user", userId)))
        throw new Error(errors_1.INSUFFICIENT_PERMISSION);
    const email = yield prisma_1.prisma.emails.findOne({
        where: { id: parseInt(emailId) },
    });
    if (!email)
        throw new Error(errors_1.RESOURCE_NOT_FOUND);
    if (email.userId !== parseInt(userId))
        throw new Error(errors_1.INSUFFICIENT_PERMISSION);
    const verifiedEmails = yield prisma_1.prisma.emails.findMany({
        where: { id: parseInt(emailId) },
    });
    if (verifiedEmails.length === 1 && email.isVerified)
        throw new Error(errors_1.EMAIL_CANNOT_DELETE);
    const currentPrimaryEmailId = (yield user_service_1.getUserPrimaryEmail(userId)).id;
    if (currentPrimaryEmailId === parseInt(emailId)) {
        const nextVerifiedEmail = verifiedEmails.filter((emailObject) => emailObject.id !== parseInt(emailId))[0];
        yield prisma_1.prisma.users.update({
            where: { id: parseInt(userId) },
            data: { primaryEmail: nextVerifiedEmail.id },
        });
        yield cache_1.deleteItemFromCache(`cache_getUserById_${userId}`);
    }
    const result = yield prisma_1.prisma.emails.delete({
        where: { id: parseInt(emailId) },
    });
    tracking_1.trackEvent({ userId, type: enum_1.EventType.EMAIL_DELETED, data: { email: email.email } }, locals);
    return result;
});
exports.getMembershipDetailsForUser = (userId, membershipId) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.UserScopes.READ_USER_MEMBERSHIPS, "membership", membershipId))
        return prisma_1.prisma.memberships.findOne({
            where: { id: parseInt(membershipId) },
            include: { user: true, organization: true },
        });
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.deleteMembershipForUser = (tokenUserId, membershipId, locals) => __awaiter(void 0, void 0, void 0, function* () {
    const membership = yield prisma_1.prisma.memberships.findOne({
        where: { id: parseInt(membershipId) },
    });
    if (!membership)
        throw new Error(errors_1.MEMBERSHIP_NOT_FOUND);
    if (yield authorization_1.can(tokenUserId, enum_1.UserScopes.DELETE_USER_MEMBERSHIPS, "membership", membership)) {
        const organizationMembers = yield prisma_1.prisma.memberships.findMany({
            where: { organizationId: membership.organizationId },
        });
        if (organizationMembers.length === 1)
            return organization_1.deleteOrganizationForUser(tokenUserId, String(membership.organizationId), locals);
        if (membership.role === "OWNER") {
            const currentMembers = organizationMembers.filter((member) => member.role === "OWNER");
            if (currentMembers.length < 2)
                throw new Error(errors_1.CANNOT_DELETE_SOLE_OWNER);
        }
        tracking_1.trackEvent({
            userId: membershipId,
            type: enum_1.EventType.MEMBERSHIP_DELETED,
        }, locals);
        return yield prisma_1.prisma.memberships.delete({ where: { id: membership.id } });
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.updateMembershipForUser = (userId, membershipId, data, locals) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.UserScopes.UPDATE_USER_MEMBERSHIPS, "membership", membershipId)) {
        const membership = yield prisma_1.prisma.memberships.findOne({
            where: { id: parseInt(membershipId) },
        });
        if (!membership)
            throw new Error(errors_1.MEMBERSHIP_NOT_FOUND);
        if (data.role !== membership.role) {
            if (membership.role === "OWNER") {
                const organizationMembers = yield prisma_1.prisma.memberships.findMany({
                    where: { organizationId: membership.organizationId },
                });
                const currentMembers = organizationMembers.filter((member) => member.role === "OWNER");
                if (currentMembers.length < 2)
                    throw new Error(errors_1.CANNOT_UPDATE_SOLE_OWNER);
            }
        }
        tracking_1.trackEvent({
            userId: membershipId,
            type: enum_1.EventType.MEMBERSHIP_UPDATED,
        }, locals);
        return prisma_1.prisma.memberships.update({
            where: { id: parseInt(membershipId) },
            data,
        });
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
//# sourceMappingURL=user.js.map