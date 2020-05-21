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
exports.getOrganizationTransactionForUser = exports.getOrganizationTransactionsForUser = exports.applyCouponToOrganizationForUser = exports.deleteWebhookForUser = exports.createWebhookForUser = exports.updateWebhookForUser = exports.getOrganizationWebhookForUser = exports.getOrganizationWebhooksForUser = exports.verifyDomainForUser = exports.deleteDomainForUser = exports.createDomainForUser = exports.updateDomainForUser = exports.getOrganizationDomainForUser = exports.getOrganizationDomainsForUser = exports.deleteApiKeyForUser = exports.createApiKeyForUser = exports.updateApiKeyForUser = exports.getOrganizationApiKeyLogsForUser = exports.getOrganizationApiKeyForUser = exports.getOrganizationApiKeysForUser = exports.inviteMemberToOrganization = exports.deleteOrganizationMembershipForUser = exports.updateOrganizationMembershipForUser = exports.getOrganizationMembershipForUser = exports.getOrganizationMembershipsForUser = exports.getAllOrganizationDataForUser = exports.createOrganizationSourceForUser = exports.updateOrganizationSourceForUser = exports.deleteOrganizationSourceForUser = exports.getOrganizationPricingPlansForUser = exports.createOrganizationSubscriptionForUser = exports.updateOrganizationSubscriptionForUser = exports.getOrganizationSubscriptionForUser = exports.getOrganizationSubscriptionsForUser = exports.getOrganizationSourceForUser = exports.getOrganizationSourcesForUser = exports.getOrganizationInvoiceForUser = exports.getOrganizationInvoicesForUser = exports.updateOrganizationBillingForUser = exports.getOrganizationBillingForUser = exports.deleteOrganizationForUser = exports.updateOrganizationForUser = exports.newOrganizationForUser = exports.getOrganizationForUser = void 0;
const errors_1 = require("@staart/errors");
const payments_1 = require("@staart/payments");
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../../config");
const authorization_1 = require("../helpers/authorization");
const jwt_1 = require("../helpers/jwt");
const mail_1 = require("../helpers/mail");
const tracking_1 = require("../helpers/tracking");
const utils_1 = require("../helpers/utils");
const webhooks_1 = require("../helpers/webhooks");
const enum_1 = require("../interfaces/enum");
const auth_1 = require("./auth");
const prisma_1 = require("../helpers/prisma");
const organization_service_1 = require("../services/organization.service");
const text_1 = require("@staart/text");
const webhooks_2 = require("../helpers/webhooks");
const user_service_1 = require("../services/user.service");
const cache_1 = require("../helpers/cache");
exports.getOrganizationForUser = (userId, organizationId) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.READ_ORG, "organization", organizationId))
        return organization_service_1.getOrganizationById(organizationId);
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.newOrganizationForUser = (userId, organization, locals) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(organization.name || "").trim()) {
        const user = yield user_service_1.getUserById(userId);
        organization.name = user.name;
    }
    return organization_service_1.createOrganization(organization, userId);
});
exports.updateOrganizationForUser = (userId, organizationId, data, locals) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.UPDATE_ORG, "organization", organizationId)) {
        const result = yield prisma_1.prisma.organizations.update({
            where: {
                id: parseInt(organizationId),
            },
            data,
        });
        webhooks_1.queueWebhook(organizationId, enum_1.Webhooks.UPDATE_ORGANIZATION, data);
        tracking_1.trackEvent({ organizationId, type: enum_1.Webhooks.UPDATE_ORGANIZATION }, locals);
        return result;
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.deleteOrganizationForUser = (userId, organizationId, locals) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.DELETE_ORG, "organization", organizationId)) {
        const organizationDetails = yield organization_service_1.getOrganizationById(organizationId);
        yield cache_1.deleteItemFromCache(`cache_getOrganizationById_${organizationDetails.id}`, `cache_getOrganizationByUsername_${organizationDetails.username}`);
        if (organizationDetails.stripeCustomerId)
            yield payments_1.deleteCustomer(organizationDetails.stripeCustomerId);
        yield prisma_1.prisma.organizations.delete({
            where: {
                id: parseInt(organizationId),
            },
        });
        webhooks_1.queueWebhook(organizationId, enum_1.Webhooks.DELETE_ORGANIZATION);
        tracking_1.trackEvent({ organizationId, type: enum_1.Webhooks.DELETE_ORGANIZATION }, locals);
        return;
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.getOrganizationBillingForUser = (userId, organizationId) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.READ_ORG_BILLING, "organization", organizationId)) {
        const organization = yield organization_service_1.getOrganizationById(organizationId);
        if (!organization)
            throw new Error(errors_1.ORGANIZATION_NOT_FOUND);
        if (organization.stripeCustomerId)
            return payments_1.getCustomer(organization.stripeCustomerId);
        throw new Error(errors_1.STRIPE_NO_CUSTOMER);
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.updateOrganizationBillingForUser = (userId, organizationId, data, locals) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.UPDATE_ORG_BILLING, "organization", organizationId)) {
        const organization = yield organization_service_1.getOrganizationById(organizationId);
        if (!organization)
            throw new Error(errors_1.ORGANIZATION_NOT_FOUND);
        let result;
        if (organization.stripeCustomerId) {
            result = yield payments_1.updateCustomer(organization.stripeCustomerId, data);
        }
        else {
            result = yield payments_1.createCustomer(organizationId, data, (organizationId, data) => prisma_1.prisma.organizations.update({
                where: {
                    id: parseInt(organizationId),
                },
                data,
            }));
        }
        webhooks_1.queueWebhook(organizationId, enum_1.Webhooks.UPDATE_ORGANIZATION_BILLING, data);
        tracking_1.trackEvent({ organizationId, type: enum_1.Webhooks.UPDATE_ORGANIZATION_BILLING }, locals);
        return result;
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.getOrganizationInvoicesForUser = (userId, organizationId, params) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.READ_ORG_INVOICES, "organization", organizationId)) {
        const organization = yield organization_service_1.getOrganizationById(organizationId);
        if (!organization)
            throw new Error(errors_1.ORGANIZATION_NOT_FOUND);
        if (organization.stripeCustomerId)
            return payments_1.getInvoices(organization.stripeCustomerId, params);
        throw new Error(errors_1.STRIPE_NO_CUSTOMER);
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.getOrganizationInvoiceForUser = (userId, organizationId, invoiceId) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.READ_ORG_INVOICES, "organization", organizationId)) {
        const organization = yield organization_service_1.getOrganizationById(organizationId);
        if (!organization)
            throw new Error(errors_1.ORGANIZATION_NOT_FOUND);
        if (organization.stripeCustomerId)
            return payments_1.getInvoice(organization.stripeCustomerId, invoiceId);
        throw new Error(errors_1.STRIPE_NO_CUSTOMER);
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.getOrganizationSourcesForUser = (userId, organizationId, params) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.READ_ORG_SOURCES, "organization", organizationId)) {
        const organization = yield organization_service_1.getOrganizationById(organizationId);
        if (!organization)
            throw new Error(errors_1.ORGANIZATION_NOT_FOUND);
        if (organization.stripeCustomerId)
            return payments_1.getSources(organization.stripeCustomerId, params);
        throw new Error(errors_1.STRIPE_NO_CUSTOMER);
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.getOrganizationSourceForUser = (userId, organizationId, sourceId) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.READ_ORG_SOURCES, "organization", organizationId)) {
        const organization = yield organization_service_1.getOrganizationById(organizationId);
        if (!organization)
            throw new Error(errors_1.ORGANIZATION_NOT_FOUND);
        if (organization.stripeCustomerId)
            return payments_1.getSource(organization.stripeCustomerId, sourceId);
        throw new Error(errors_1.STRIPE_NO_CUSTOMER);
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.getOrganizationSubscriptionsForUser = (userId, organizationId, params) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.READ_ORG_SUBSCRIPTIONS, "organization", organizationId)) {
        const organization = yield organization_service_1.getOrganizationById(organizationId);
        if (!organization)
            throw new Error(errors_1.ORGANIZATION_NOT_FOUND);
        if (organization.stripeCustomerId)
            return payments_1.getSubscriptions(organization.stripeCustomerId, params);
        throw new Error(errors_1.STRIPE_NO_CUSTOMER);
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.getOrganizationSubscriptionForUser = (userId, organizationId, subscriptionId) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.READ_ORG_SUBSCRIPTIONS, "organization", organizationId)) {
        const organization = yield organization_service_1.getOrganizationById(organizationId);
        if (!organization)
            throw new Error(errors_1.ORGANIZATION_NOT_FOUND);
        if (organization.stripeCustomerId)
            return payments_1.getSubscription(organization.stripeCustomerId, subscriptionId);
        throw new Error(errors_1.STRIPE_NO_CUSTOMER);
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.updateOrganizationSubscriptionForUser = (userId, organizationId, subscriptionId, data, locals) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.UPDATE_ORG_SUBSCRIPTIONS, "organization", organizationId)) {
        const organization = yield organization_service_1.getOrganizationById(organizationId);
        if (!organization)
            throw new Error(errors_1.ORGANIZATION_NOT_FOUND);
        if (organization.stripeCustomerId) {
            const result = yield payments_1.updateSubscription(organization.stripeCustomerId, subscriptionId, data);
            webhooks_1.queueWebhook(organizationId, enum_1.Webhooks.UPDATE_ORGANIZATION_SUBSCRIPTION, data);
            tracking_1.trackEvent({ organizationId, type: enum_1.Webhooks.UPDATE_ORGANIZATION_SUBSCRIPTION }, locals);
            return result;
        }
        throw new Error(errors_1.STRIPE_NO_CUSTOMER);
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.createOrganizationSubscriptionForUser = (userId, organizationId, params, locals) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.CREATE_ORG_SUBSCRIPTIONS, "organization", organizationId)) {
        const organization = yield organization_service_1.getOrganizationById(organizationId);
        if (!organization)
            throw new Error(errors_1.ORGANIZATION_NOT_FOUND);
        if (organization.stripeCustomerId) {
            const result = yield payments_1.createSubscription(organization.stripeCustomerId, params);
            webhooks_1.queueWebhook(organizationId, enum_1.Webhooks.CREATE_ORGANIZATION_SUBSCRIPTION, params);
            tracking_1.trackEvent({ organizationId, type: enum_1.Webhooks.CREATE_ORGANIZATION_SUBSCRIPTION }, locals);
            return result;
        }
        throw new Error(errors_1.STRIPE_NO_CUSTOMER);
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.getOrganizationPricingPlansForUser = (userId, organizationId) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.READ_ORG_PLANS, "organization", organizationId))
        return payments_1.getProductPricing();
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.deleteOrganizationSourceForUser = (userId, organizationId, sourceId, locals) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.DELETE_ORG_SOURCES, "organization", organizationId)) {
        const organization = yield organization_service_1.getOrganizationById(organizationId);
        if (!organization)
            throw new Error(errors_1.ORGANIZATION_NOT_FOUND);
        if (organization.stripeCustomerId) {
            const result = yield payments_1.deleteSource(organization.stripeCustomerId, sourceId);
            webhooks_1.queueWebhook(organizationId, enum_1.Webhooks.DELETE_ORGANIZATION_SOURCE, sourceId);
            tracking_1.trackEvent({ organizationId, type: enum_1.Webhooks.DELETE_ORGANIZATION_SOURCE }, locals);
            return result;
        }
        throw new Error(errors_1.STRIPE_NO_CUSTOMER);
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.updateOrganizationSourceForUser = (userId, organizationId, sourceId, data, locals) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.UPDATE_ORG_SOURCES, "organization", organizationId)) {
        const organization = yield organization_service_1.getOrganizationById(organizationId);
        if (!organization)
            throw new Error(errors_1.ORGANIZATION_NOT_FOUND);
        if (organization.stripeCustomerId) {
            const result = yield payments_1.updateSource(organization.stripeCustomerId, sourceId, data);
            webhooks_1.queueWebhook(organizationId, enum_1.Webhooks.UPDATE_ORGANIZATION_SOURCE, data);
            tracking_1.trackEvent({ organizationId, type: enum_1.Webhooks.UPDATE_ORGANIZATION_SOURCE }, locals);
            return result;
        }
        throw new Error(errors_1.STRIPE_NO_CUSTOMER);
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.createOrganizationSourceForUser = (userId, organizationId, card, locals) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.CREATE_ORG_SOURCES, "organization", organizationId)) {
        const organization = yield organization_service_1.getOrganizationById(organizationId);
        if (!organization)
            throw new Error(errors_1.ORGANIZATION_NOT_FOUND);
        if (organization.stripeCustomerId) {
            const result = yield payments_1.createSource(organization.stripeCustomerId, card);
            webhooks_1.queueWebhook(organizationId, enum_1.Webhooks.CREATE_ORGANIZATION_SOURCE, card);
            tracking_1.trackEvent({ organizationId, type: enum_1.Webhooks.CREATE_ORGANIZATION_SOURCE }, locals);
            return result;
        }
        throw new Error(errors_1.STRIPE_NO_CUSTOMER);
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.getAllOrganizationDataForUser = (userId, organizationId) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.READ_ORG_TRANSACTIONS, "organization", organizationId)) {
        const organization = yield prisma_1.prisma.organizations.findOne({
            where: {
                id: parseInt(organizationId),
            },
            include: {
                api_keys: true,
                domains: true,
                memberships: true,
                webhooks: true,
            },
        });
        if (!organization)
            throw new Error(errors_1.ORGANIZATION_NOT_FOUND);
        return Object.assign(Object.assign({}, organization), (organization.stripeCustomerId
            ? {
                billing: yield payments_1.getCustomer(organization.stripeCustomerId),
                subscriptions: yield payments_1.getSubscriptions(organization.stripeCustomerId, {}),
                invoices: yield payments_1.getInvoices(organization.stripeCustomerId, {}),
                sources: yield payments_1.getSources(organization.stripeCustomerId, {}),
            }
            : {}));
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.getOrganizationMembershipsForUser = (userId, organizationId, queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.READ_ORG_MEMBERSHIPS, "organization", organizationId))
        return prisma_1.paginatedResult(yield prisma_1.prisma.memberships.findMany(Object.assign({ where: { organizationId: parseInt(organizationId) } }, prisma_1.queryParamsToSelect(queryParams))), { first: queryParams.first, last: queryParams.last });
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.getOrganizationMembershipForUser = (userId, organizationId, membershipId) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.READ_ORG_MEMBERSHIPS, "organization", organizationId))
        return prisma_1.prisma.memberships.findOne({
            where: { id: parseInt(membershipId) },
            include: { user: true },
        });
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.updateOrganizationMembershipForUser = (userId, organizationId, membershipId, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.UPDATE_ORG_MEMBERSHIPS, "organization", organizationId)) {
        if (data.role) {
            const currentMembership = yield prisma_1.prisma.memberships.findOne({
                where: { id: parseInt(membershipId) },
            });
            if (!currentMembership)
                throw new Error(errors_1.MEMBERSHIP_NOT_FOUND);
            if (currentMembership.role === "OWNER" && data.role !== "OWNER") {
                const members = yield prisma_1.prisma.memberships.findMany({
                    where: { organizationId: parseInt(organizationId), role: "OWNER" },
                });
                if (members.length === 1)
                    throw new Error(errors_1.CANNOT_DELETE_SOLE_MEMBER);
            }
        }
        return prisma_1.prisma.memberships.update({
            where: { id: parseInt(membershipId) },
            data,
        });
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
/**
 * Delete an organization membership for user
 * If an organization has only one member, the user,
 * Delete the entire organization, not just the membership
 */
exports.deleteOrganizationMembershipForUser = (userId, organizationId, membershipId, locals) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.DELETE_ORG_MEMBERSHIPS, "organization", organizationId)) {
        const members = yield prisma_1.prisma.memberships.findMany({
            where: { organizationId: parseInt(organizationId) },
        });
        if (members.length === 1)
            return exports.deleteOrganizationForUser(userId, organizationId, locals);
        return prisma_1.prisma.memberships.delete({ where: { id: parseInt(membershipId) } });
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.inviteMemberToOrganization = (userId, organizationId, newMemberName, newMemberEmail, role, locals) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (yield authorization_1.can(userId, enum_1.OrgScopes.CREATE_ORG_MEMBERSHIPS, "organization", organizationId)) {
        const organization = yield organization_service_1.getOrganizationById(organizationId);
        if (!organization)
            throw new Error(errors_1.ORGANIZATION_NOT_FOUND);
        if (organization.onlyAllowDomain) {
            const emailDomain = newMemberEmail.split("@")[1];
            try {
                const domainDetails = yield organization_service_1.getDomainByDomainName(emailDomain);
                if (domainDetails.organizationId !== parseInt(organizationId))
                    throw new Error();
            }
            catch (error) {
                throw new Error(errors_1.CANNOT_INVITE_DOMAIN);
            }
        }
        let newUser = undefined;
        let userExists = false;
        let createdUserId;
        const checkUser = yield prisma_1.prisma.users.findMany({
            where: { emails: { some: { email: newMemberEmail } } },
            first: 1,
        });
        if (checkUser.length) {
            newUser = checkUser[0];
            userExists = true;
        }
        if (userExists && newUser) {
            const isMemberAlready = (yield prisma_1.prisma.memberships.findMany({
                where: {
                    userId: newUser.id,
                    organizationId: parseInt(organizationId),
                },
            })).length !== 0;
            createdUserId = newUser.id;
            if (isMemberAlready)
                throw new Error(errors_1.USER_IS_MEMBER_ALREADY);
            yield prisma_1.prisma.memberships.create({
                data: {
                    user: { connect: { id: newUser.id } },
                    organization: { connect: { id: parseInt(organizationId) } },
                    role,
                },
            });
        }
        else {
            const newAccount = yield auth_1.register({ name: newMemberName }, locals, newMemberEmail, organizationId, role);
            createdUserId = newAccount.userId;
        }
        if (createdUserId) {
            const inviter = typeof userId !== "object"
                ? (_b = (_a = (yield user_service_1.getUserById(userId))) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "Someone" : "Someone";
            const userDetails = yield user_service_1.getUserById(createdUserId);
            mail_1.mail(newMemberEmail, enum_1.Templates.INVITED_TO_TEAM, Object.assign(Object.assign({}, userDetails), { team: organization.name, inviter }))
                .then(() => { })
                .catch(() => { });
        }
        return;
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.getOrganizationApiKeysForUser = (userId, organizationId, queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.READ_ORG_API_KEYS, "organization", organizationId))
        return prisma_1.paginatedResult(yield prisma_1.prisma.api_keys.findMany(Object.assign({ where: { organizationId: parseInt(organizationId) } }, prisma_1.queryParamsToSelect(queryParams))), { first: queryParams.first, last: queryParams.last });
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.getOrganizationApiKeyForUser = (userId, organizationId, apiKeyId) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.READ_ORG_API_KEYS, "organization", organizationId))
        return prisma_1.prisma.api_keys.findOne({ where: { id: parseInt(apiKeyId) } });
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.getOrganizationApiKeyLogsForUser = (userId, organizationId, apiKeyId, query) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.READ_ORG_API_KEY_LOGS, "organization", organizationId))
        return organization_service_1.getApiKeyLogs(apiKeyId, query);
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.updateApiKeyForUser = (userId, organizationId, apiKeyId, data, locals) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.UPDATE_ORG_API_KEYS, "organization", organizationId)) {
        const result = yield prisma_1.prisma.api_keys.update({
            where: { id: parseInt(apiKeyId) },
            data,
        });
        webhooks_1.queueWebhook(organizationId, enum_1.Webhooks.UPDATE_API_KEY, data);
        tracking_1.trackEvent({ organizationId, type: enum_1.Webhooks.UPDATE_API_KEY }, locals);
        return result;
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.createApiKeyForUser = (userId, organizationId, apiKey, locals) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.CREATE_ORG_API_KEYS, "organization", organizationId)) {
        apiKey.jwtApiKey = text_1.randomString({ length: 20 });
        apiKey.expiresAt = apiKey.expiresAt || new Date(config_1.TOKEN_EXPIRY_API_KEY_MAX);
        const result = yield prisma_1.prisma.api_keys.create({
            data: Object.assign(Object.assign({}, apiKey), { organization: {
                    connect: {
                        id: parseInt(organizationId),
                    },
                } }),
        });
        webhooks_1.queueWebhook(organizationId, enum_1.Webhooks.CREATE_API_KEY, apiKey);
        tracking_1.trackEvent({ organizationId, type: enum_1.Webhooks.CREATE_API_KEY }, locals);
        return result;
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.deleteApiKeyForUser = (userId, organizationId, apiKeyId, locals) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.DELETE_ORG_API_KEYS, "organization", organizationId)) {
        const result = yield prisma_1.prisma.api_keys.delete({
            where: { id: parseInt(apiKeyId) },
        });
        webhooks_1.queueWebhook(organizationId, enum_1.Webhooks.DELETE_API_KEY, apiKeyId);
        tracking_1.trackEvent({ organizationId, type: enum_1.Webhooks.DELETE_API_KEY }, locals);
        return result;
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.getOrganizationDomainsForUser = (userId, organizationId, queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.READ_ORG_DOMAINS, "organization", organizationId))
        return prisma_1.paginatedResult(yield prisma_1.prisma.domains.findMany(Object.assign({ where: { organizationId: parseInt(organizationId) } }, prisma_1.queryParamsToSelect(queryParams))), { first: queryParams.first, last: queryParams.last });
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.getOrganizationDomainForUser = (userId, organizationId, domainId) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.READ_ORG_DOMAINS, "organization", organizationId))
        return prisma_1.prisma.domains.findOne({ where: { id: parseInt(domainId) } });
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.updateDomainForUser = (userId, organizationId, domainId, data, locals) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.UPDATE_ORG_DOMAINS, "organization", organizationId)) {
        const result = yield prisma_1.prisma.domains.update({
            where: { id: parseInt(domainId) },
            data,
        });
        webhooks_1.queueWebhook(organizationId, enum_1.Webhooks.UPDATE_DOMAIN, data);
        tracking_1.trackEvent({ organizationId, type: enum_1.Webhooks.UPDATE_DOMAIN }, locals);
        return result;
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.createDomainForUser = (userId, organizationId, domain, locals) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.CREATE_ORG_DOMAINS, "organization", organizationId)) {
        yield organization_service_1.checkDomainAvailability(domain.domain);
        const result = yield prisma_1.prisma.domains.create({
            data: Object.assign(Object.assign({}, domain), { verificationCode: yield text_1.randomString({ length: 25 }), isVerified: false, organization: {
                    connect: {
                        id: parseInt(organizationId),
                    },
                } }),
        });
        webhooks_1.queueWebhook(organizationId, enum_1.Webhooks.CREATE_DOMAIN, domain);
        tracking_1.trackEvent({ organizationId, type: enum_1.Webhooks.CREATE_DOMAIN }, locals);
        return result;
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.deleteDomainForUser = (userId, organizationId, domainId, locals) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.DELETE_ORG_DOMAINS, "organization", organizationId)) {
        const result = yield prisma_1.prisma.domains.delete({
            where: { id: parseInt(domainId) },
        });
        webhooks_1.queueWebhook(organizationId, enum_1.Webhooks.DELETE_DOMAIN, domainId);
        tracking_1.trackEvent({ organizationId, type: enum_1.Webhooks.DELETE_DOMAIN }, locals);
        return result;
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.verifyDomainForUser = (userId, organizationId, domainId, method, locals) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.VERIFY_ORG_DOMAINS, "organization", organizationId)) {
        const domain = yield prisma_1.prisma.domains.findOne({
            where: { id: parseInt(domainId) },
        });
        if (!domain)
            throw new Error(errors_1.RESOURCE_NOT_FOUND);
        if (domain.isVerified)
            throw new Error(errors_1.DOMAIN_ALREADY_VERIFIED);
        if (!domain.verificationCode)
            throw new Error(errors_1.DOMAIN_UNABLE_TO_VERIFY);
        if (method === "file") {
            try {
                const file = (yield axios_1.default.get(`http://${domain.domain}/.well-known/${config_1.JWT_ISSUER}-verify.txt`)).data;
                if (file.replace(/\r?\n|\r/g, "").trim() === domain.verificationCode) {
                    const result = yield prisma_1.prisma.domains.update({
                        where: { id: parseInt(domainId) },
                        data: { isVerified: true },
                    });
                    webhooks_1.queueWebhook(organizationId, enum_1.Webhooks.VERIFY_DOMAIN, {
                        domainId,
                        method,
                    });
                    tracking_1.trackEvent({ organizationId, type: enum_1.Webhooks.VERIFY_DOMAIN }, locals);
                    return result;
                }
            }
            catch (error) {
                throw new Error(errors_1.DOMAIN_MISSING_FILE);
            }
        }
        else {
            const dns = yield utils_1.dnsResolve(domain.domain, "TXT");
            if (JSON.stringify(dns).includes(domain.verificationCode)) {
                const result = yield prisma_1.prisma.domains.update({
                    where: { id: parseInt(domainId) },
                    data: { isVerified: true },
                });
                webhooks_1.queueWebhook(organizationId, enum_1.Webhooks.VERIFY_DOMAIN, {
                    domainId,
                    method,
                });
                tracking_1.trackEvent({ organizationId, type: enum_1.Webhooks.VERIFY_DOMAIN }, locals);
                return result;
            }
            else {
                throw new Error(errors_1.DOMAIN_MISSING_DNS);
            }
        }
        throw new Error(errors_1.DOMAIN_UNABLE_TO_VERIFY);
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.getOrganizationWebhooksForUser = (userId, organizationId, queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.READ_ORG_WEBHOOKS, "organization", organizationId))
        return prisma_1.paginatedResult(yield prisma_1.prisma.webhooks.findMany(Object.assign({ where: { organizationId: parseInt(organizationId) } }, prisma_1.queryParamsToSelect(queryParams))), { first: queryParams.first, last: queryParams.last });
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.getOrganizationWebhookForUser = (userId, organizationId, webhookId) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.READ_ORG_WEBHOOKS, "organization", organizationId))
        return prisma_1.prisma.webhooks.findOne({ where: { id: parseInt(webhookId) } });
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.updateWebhookForUser = (userId, organizationId, webhookId, data, locals) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.UPDATE_ORG_WEBHOOKS, "organization", organizationId)) {
        const result = yield prisma_1.prisma.webhooks.update({
            where: { id: parseInt(webhookId) },
            data,
        });
        webhooks_1.queueWebhook(organizationId, enum_1.Webhooks.UPDATE_WEBHOOK, data);
        tracking_1.trackEvent({ organizationId, type: enum_1.Webhooks.UPDATE_WEBHOOK }, locals);
        return result;
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.createWebhookForUser = (userId, organizationId, webhook, locals) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.DELETE_ORG_WEBHOOKS, "organization", organizationId)) {
        const result = yield prisma_1.prisma.webhooks.create({
            data: Object.assign(Object.assign({}, webhook), { organization: {
                    connect: {
                        id: parseInt(organizationId),
                    },
                } }),
        });
        webhooks_2.fireSingleWebhook(result, enum_1.Webhooks.TEST_WEBHOOK)
            .then(() => { })
            .catch(() => { });
        webhooks_1.queueWebhook(organizationId, enum_1.Webhooks.CREATE_WEBHOOK, webhook);
        tracking_1.trackEvent({ organizationId, type: enum_1.Webhooks.CREATE_WEBHOOK }, locals);
        return result;
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.deleteWebhookForUser = (userId, organizationId, webhookId, locals) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.CREATE_ORG_WEBHOOKS, "organization", organizationId)) {
        const result = prisma_1.prisma.webhooks.delete({
            where: { id: parseInt(webhookId) },
        });
        webhooks_1.queueWebhook(organizationId, enum_1.Webhooks.DELETE_WEBHOOK, webhookId);
        tracking_1.trackEvent({ organizationId, type: enum_1.Webhooks.DELETE_WEBHOOK }, locals);
        return result;
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.applyCouponToOrganizationForUser = (userId, organizationId, coupon) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.CREATE_ORG_TRANSACTIONS, "organization", organizationId)) {
        let amount = undefined;
        let currency = undefined;
        let description = undefined;
        try {
            const result = yield jwt_1.verifyToken(coupon, enum_1.Tokens.COUPON);
            yield jwt_1.checkInvalidatedToken(coupon);
            amount = result.amount;
            currency = result.currency;
            description = result.description;
        }
        catch (error) {
            throw new Error(errors_1.INVALID_INPUT);
        }
        const organization = yield organization_service_1.getOrganizationById(organizationId);
        if (!organization)
            throw new Error(errors_1.ORGANIZATION_NOT_FOUND);
        if (amount && currency && organization.stripeCustomerId) {
            const result = yield payments_1.createCustomerBalanceTransaction(organization.stripeCustomerId, {
                amount,
                currency,
                description,
            });
            yield jwt_1.invalidateToken(coupon);
            return result;
        }
        throw new Error(errors_1.STRIPE_NO_CUSTOMER);
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.getOrganizationTransactionsForUser = (userId, organizationId, params) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.READ_ORG_TRANSACTIONS, "organization", organizationId)) {
        const organization = yield organization_service_1.getOrganizationById(organizationId);
        if (!organization)
            throw new Error(errors_1.ORGANIZATION_NOT_FOUND);
        if (organization.stripeCustomerId)
            return payments_1.getCustomBalanceTransactions(organization.stripeCustomerId, params);
        throw new Error(errors_1.STRIPE_NO_CUSTOMER);
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.getOrganizationTransactionForUser = (userId, organizationId, transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(userId, enum_1.OrgScopes.READ_ORG_TRANSACTIONS, "organization", organizationId)) {
        const organization = yield organization_service_1.getOrganizationById(organizationId);
        if (!organization)
            throw new Error(errors_1.ORGANIZATION_NOT_FOUND);
        if (organization.stripeCustomerId)
            return payments_1.getCustomBalanceTransaction(organization.stripeCustomerId, transactionId);
        throw new Error(errors_1.STRIPE_NO_CUSTOMER);
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
//# sourceMappingURL=organization.js.map