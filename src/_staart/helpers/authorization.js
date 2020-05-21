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
exports.can = void 0;
const errors_1 = require("@staart/errors");
const enum_1 = require("../interfaces/enum");
const prisma_1 = require("./prisma");
const user_service_1 = require("../services/user.service");
const organization_service_1 = require("../services/organization.service");
/**
 * Whether a user can perform an action on another user
 */
const canUserUser = (user, action, target) => __awaiter(void 0, void 0, void 0, function* () {
    // A super user can do anything
    if (user.role === "SUDO")
        return true;
    // A user can do anything to herself
    if (user.id === target.id)
        return true;
    const userMemberships = yield prisma_1.prisma.memberships.findMany({
        where: { user: user },
    });
    const targetMemberships = yield prisma_1.prisma.memberships.findMany({
        where: { user: target },
    });
    let allowed = false;
    const similarMemberships = [];
    userMemberships.forEach((userMembership, index) => {
        targetMemberships.forEach((targetMembership) => {
            if (userMembership.id && userMembership.id === targetMembership.id)
                similarMemberships.push(index);
        });
    });
    similarMemberships.forEach((similarMembership) => {
        // A user can read another user in the same organization, as long as they're not a basic member
        if (action === enum_1.UserScopes.READ_USER)
            if (userMemberships[similarMembership].role)
                allowed = true;
    });
    return allowed;
});
/**
 * Whether an access token can perform an action for an organization
 */
const canAccessTokenUser = (accessToken, action, target) => {
    if (accessToken.userId !== target.id)
        return false;
    if (!accessToken.scopes)
        return false;
    if (accessToken.scopes.includes(action))
        return true;
    return false;
};
/**
 * Whether a user can perform an action on an organization
 */
const canUserOrganization = (user, action, target) => __awaiter(void 0, void 0, void 0, function* () {
    // A super user can do anything
    if (user.role === "SUDO")
        return true;
    const memberships = yield prisma_1.prisma.memberships.findMany({ where: { user } });
    const targetMemberships = memberships.filter((m) => m.organizationId === target.id);
    let allowed = false;
    targetMemberships.forEach((membership) => {
        // An organization owner can do anything
        if (membership.role === "OWNER")
            allowed = true;
        // An organization admin can do anything too
        if (membership.role === "ADMIN")
            allowed = true;
        // An organization reseller can do anything too
        if (membership.role === "RESELLER")
            allowed = true;
        // An organization member can read, not edit/delete/invite
        if (membership.role === "MEMBER" &&
            (action === enum_1.OrgScopes.READ_ORG ||
                action === enum_1.OrgScopes.READ_ORG_MEMBERSHIPS ||
                action === enum_1.OrgScopes.READ_ORG_API_KEYS ||
                action === enum_1.OrgScopes.READ_ORG_WEBHOOKS))
            allowed = true;
    });
    return allowed;
});
/**
 * Whether a user can perform an action on a membership
 */
const canUserMembership = (user, action, target) => __awaiter(void 0, void 0, void 0, function* () {
    // A super user can do anything
    if (user.role === "SUDO")
        return true;
    // A member can do anything to herself
    if (user.id === target.userId)
        return true;
    const memberships = yield prisma_1.prisma.memberships.findMany({ where: { user } });
    let allowed = false;
    memberships.forEach((membership) => {
        // An admin, owner, or reseller can edit
        if (membership.organizationId === target.organizationId &&
            (membership.role === "OWNER" ||
                membership.role === "ADMIN" ||
                membership.role === "RESELLER"))
            allowed = true;
        // Another member can view
        if (membership.organizationId === target.organizationId &&
            membership.role === "MEMBER" &&
            action === enum_1.OrgScopes.READ_ORG_MEMBERSHIPS)
            allowed = true;
    });
    return allowed;
});
/**
 * Whether a user can perform an action for the backend
 */
const canUserSudo = (user, action) => __awaiter(void 0, void 0, void 0, function* () {
    // A super user can do anything
    if (user.role === "SUDO")
        return true;
    return false;
});
/**
 * Whether an API key can perform an action for an organization
 */
const canApiKeyOrganization = (apiKey, action, target) => {
    // An API key can only work in its own organization
    if (apiKey.organizationId !== target.id)
        return false;
    // If it has no scopes, it has no permissions
    if (!apiKey.scopes)
        return false;
    if (apiKey.scopes.includes(action))
        return true;
    return false;
};
/**
 * Whether a user has authorization to perform an action
 */
exports.can = (user, action, targetType, target) => __awaiter(void 0, void 0, void 0, function* () {
    let requestFromType = "users";
    /**
     * First, we figure out what the first parameter is
     * If it's a string, it can only be a user ID we'll convert to user
     */
    if (typeof user === "object") {
        if (user.sub === enum_1.Tokens.API_KEY) {
            requestFromType = "api_keys";
        }
        else if (user.sub === enum_1.Tokens.ACCESS_TOKEN) {
            requestFromType = "access_tokens";
        }
    }
    else {
        const result = yield user_service_1.getUserById(user);
        if (!result)
            throw new Error(errors_1.USER_NOT_FOUND);
        user = result;
    }
    /**
     * Now, `user` is of type "users", "ApiKeyResponse", or "AccessTokenResponse"
     * and `requestFromType` will tell us what type it is
     * We fidn what the correct target is
     */
    if (typeof target === "string") {
        if (targetType === "membership") {
            const membership = yield prisma_1.prisma.memberships.findOne({
                where: { id: parseInt(target) },
            });
            if (!membership)
                throw new Error(errors_1.USER_NOT_FOUND);
            target = membership;
        }
        else if (targetType === "organization") {
            const organization = yield organization_service_1.getOrganizationById(target);
            target = organization;
        }
        else {
            // Target is a user
            if (requestFromType === "users" && user.id === parseInt(target)) {
                target = user;
            }
            else {
                const targetUser = yield user_service_1.getUserById(target);
                if (!targetUser)
                    throw new Error(errors_1.USER_NOT_FOUND);
                target = targetUser;
            }
        }
    }
    if (requestFromType === "api_keys") {
        const apiKeyDetails = yield prisma_1.prisma.api_keys.findOne({
            where: { id: parseInt(user.id) },
        });
        if (!apiKeyDetails || !target)
            throw new Error(errors_1.INVALID_TOKEN);
        return canApiKeyOrganization(apiKeyDetails, action, target);
    }
    else if (requestFromType === "access_tokens") {
        const accessTokenDetails = yield prisma_1.prisma.access_tokens.findOne({
            where: { id: parseInt(user.id) },
        });
        if (!accessTokenDetails || !target)
            throw new Error(errors_1.INVALID_TOKEN);
        return canAccessTokenUser(accessTokenDetails, action, target);
    }
    else {
        if (targetType === "user") {
            return canUserUser(user, action, target);
        }
        else if (targetType === "membership") {
            return canUserMembership(user, action, target);
        }
        else if (targetType === "organization") {
            return canUserOrganization(user, action, target);
        }
    }
    return canUserSudo(user, action);
});
//# sourceMappingURL=authorization.js.map