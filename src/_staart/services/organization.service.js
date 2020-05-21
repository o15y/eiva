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
exports.getOrganizationByUsername = exports.getOrganizationById = exports.checkDomainAvailability = exports.createDomain = exports.refreshOrganizationProfilePicture = exports.getDomainByDomainName = exports.updateApiKey = exports.createApiKey = exports.getApiKeyLogs = exports.updateOrganization = exports.createOrganization = exports.checkOrganizationUsernameAvailability = void 0;
const elasticsearch_1 = require("@staart/elasticsearch");
const errors_1 = require("@staart/errors");
const text_1 = require("@staart/text");
const text_2 = require("@staart/text");
const axios_1 = __importDefault(require("axios"));
const randomcolor_1 = __importDefault(require("randomcolor"));
const config_1 = require("../../config");
const jwt_1 = require("../helpers/jwt");
const prisma_1 = require("../helpers/prisma");
const cache_1 = require("../helpers/cache");
/**
 * Check if an organization username is available
 */
exports.checkOrganizationUsernameAvailability = (username) => __awaiter(void 0, void 0, void 0, function* () {
    return ((yield prisma_1.prisma.organizations.findMany({
        where: { username },
    })).length === 0);
});
const getBestUsernameForOrganization = (name) => __awaiter(void 0, void 0, void 0, function* () {
    let available = false;
    let result = text_2.slugify(name.trim());
    if (result && exports.checkOrganizationUsernameAvailability(result))
        available = true;
    while (!available) {
        result = text_2.createSlug(name.trim());
        if (exports.checkOrganizationUsernameAvailability(result))
            available = true;
    }
    return result;
});
/*
 * Create a new organization for a user
 */
exports.createOrganization = (organization, ownerId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!organization.name)
        throw new Error(errors_1.INVALID_INPUT);
    organization.name = text_2.capitalizeFirstAndLastLetter(organization.name);
    organization.username = yield getBestUsernameForOrganization(organization.name);
    const backgroundColor = randomcolor_1.default({
        luminosity: "dark",
        format: "hex",
    }).replace("#", "");
    organization.profilePicture = `https://ui-avatars.com/api/?name=${encodeURIComponent((organization.name || "XX").substring(0, 2).toUpperCase())}&background=${backgroundColor}&color=fff`;
    try {
        const result = yield prisma_1.prisma.organizations.create({
            data: organization,
        });
        yield prisma_1.prisma.memberships.create({
            data: {
                role: "OWNER",
                user: { connect: { id: parseInt(ownerId) } },
                organization: { connect: { id: result.id } },
            },
        });
        return result;
    }
    catch (error) {
        console.log(error);
        throw new Error(error);
    }
});
/*
 * Update an organization
 */
exports.updateOrganization = (id, organization) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof id === "number")
        id = id.toString();
    const originalOrganization = yield exports.getOrganizationById(id);
    yield cache_1.deleteItemFromCache(`cache_getOrganizationById_${originalOrganization.id}`, `cache_getOrganizationByUsername_${originalOrganization.username}`);
    if (!originalOrganization)
        throw new Error(errors_1.ORGANIZATION_NOT_FOUND);
    if (organization.username &&
        originalOrganization.username &&
        organization.username !== originalOrganization.username) {
        const currentOwners = yield prisma_1.prisma.organizations.findMany({
            where: { username: originalOrganization.username },
        });
        if (currentOwners.length) {
            const currentOwnerId = currentOwners[0].id;
            if (currentOwnerId !== parseInt(id))
                throw new Error(errors_1.USERNAME_EXISTS);
        }
    }
    return prisma_1.prisma.organizations.update({
        data: organization,
        where: { id: parseInt(id) },
    });
});
/**
 * Get an API key
 */
exports.getApiKeyLogs = (apiKeyId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const range = query.range || "7d";
    const from = query.from ? parseInt(query.from) : 0;
    const result = yield elasticsearch_1.elasticSearch.search({
        index: config_1.ELASTIC_LOGS_INDEX,
        from,
        body: {
            query: {
                bool: {
                    must: [
                        {
                            match: {
                                apiKeyId,
                            },
                        },
                        {
                            range: {
                                date: {
                                    gte: new Date(new Date().getTime() - text_1.ms(range)),
                                },
                            },
                        },
                    ],
                },
            },
            sort: [
                {
                    date: { order: "desc" },
                },
            ],
            size: 10,
        },
    });
    return elasticsearch_1.cleanElasticSearchQueryResponse(result.body, 10);
});
/**
 * Create an API key
 */
exports.createApiKey = (apiKey) => __awaiter(void 0, void 0, void 0, function* () {
    apiKey.expiresAt = apiKey.expiresAt || new Date(config_1.TOKEN_EXPIRY_API_KEY_MAX);
    apiKey.jwtApiKey = yield jwt_1.apiKeyToken(apiKey);
    return prisma_1.prisma.api_keys.create({ data: apiKey });
});
/**
 * Update a user's details
 */
exports.updateApiKey = (apiKeyId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const apiKey = yield prisma_1.prisma.api_keys.findOne({
        where: { id: parseInt(apiKeyId) },
    });
    if (!apiKey)
        throw new Error(errors_1.RESOURCE_NOT_FOUND);
    if (apiKey.jwtApiKey)
        yield jwt_1.invalidateToken(apiKey.jwtApiKey);
    data.jwtApiKey = yield jwt_1.apiKeyToken(Object.assign(Object.assign({}, apiKey), data));
    return prisma_1.prisma.api_keys.update({ data, where: { id: parseInt(apiKeyId) } });
});
/**
 * Get a domain
 */
exports.getDomainByDomainName = (domain) => __awaiter(void 0, void 0, void 0, function* () {
    const domainDetails = yield prisma_1.prisma.domains.findMany({
        where: { domain, isVerified: true },
        first: 1,
    });
    if (domainDetails.length)
        return domainDetails[0];
    throw new Error(errors_1.RESOURCE_NOT_FOUND);
});
exports.refreshOrganizationProfilePicture = (organizationId) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof organizationId === "number")
        organizationId = organizationId.toString();
    const domains = yield prisma_1.prisma.domains.findMany({
        where: { organizationId: parseInt(organizationId) },
        orderBy: { updatedAt: "desc" },
    });
    if (domains.length) {
        const domainIcons = yield axios_1.default.get(`https://unavatar.now.sh/${domains[0].domain}?json`);
        if (domainIcons.data &&
            domainIcons.data.url &&
            domainIcons.data.url !== "http://unavatar.now.sh/fallback.png")
            return prisma_1.prisma.organizations.update({
                data: { profilePicture: domainIcons.data.url },
                where: { id: parseInt(organizationId) },
            });
    }
    const organization = yield prisma_1.prisma.organizations.findOne({
        where: { id: parseInt(organizationId) },
        select: { name: true, username: true },
    });
    if (!organization)
        throw new Error(errors_1.ORGANIZATION_NOT_FOUND);
    const backgroundColor = randomcolor_1.default({
        luminosity: "dark",
        format: "hex",
    }).replace("#", "");
    const profilePicture = `https://ui-avatars.com/api/?name=${encodeURIComponent(organization.name || organization.username || "XX").replace(/^([a-zA-Z0-9 _-]+)$/gi, "")}&background=${backgroundColor}&color=fff`;
    return prisma_1.prisma.organizations.update({
        data: { profilePicture },
        where: { id: parseInt(organizationId) },
    });
});
/**
 * Create a domain
 */
exports.createDomain = (domain) => __awaiter(void 0, void 0, void 0, function* () {
    domain.verificationCode = `${config_1.JWT_ISSUER}=${text_2.randomString({
        length: 32,
    })}`;
    const response = yield prisma_1.prisma.domains.create({ data: domain });
    yield exports.refreshOrganizationProfilePicture(response.organizationId);
    return response;
});
/**
 * Get a user by their username
 */
exports.checkDomainAvailability = (username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const domain = yield exports.getDomainByDomainName(username);
        if (domain && domain.id)
            return false;
    }
    catch (error) { }
    return true;
});
/**
 * Get a organization object from its ID
 * @param id - User ID
 */
exports.getOrganizationById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof id === "number")
        id = id.toString();
    const key = `cache_getOrganizationById_${id}`;
    try {
        return yield cache_1.getItemFromCache(key);
    }
    catch (error) {
        const organization = yield prisma_1.prisma.organizations.findOne({
            where: { id: parseInt(id) },
        });
        if (organization) {
            yield cache_1.setItemInCache(key, organization);
            return organization;
        }
        throw new Error(errors_1.ORGANIZATION_NOT_FOUND);
    }
});
/**
 * Get a organization object from its username
 * @param username - User's username
 */
exports.getOrganizationByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const key = `cache_getOrganizationByUsername_${username}`;
    try {
        return yield cache_1.getItemFromCache(key);
    }
    catch (error) {
        const organization = yield prisma_1.prisma.organizations.findOne({
            where: { username },
        });
        if (organization) {
            yield cache_1.setItemInCache(key, organization);
            return organization;
        }
        throw new Error(errors_1.ORGANIZATION_NOT_FOUND);
    }
});
//# sourceMappingURL=organization.service.js.map