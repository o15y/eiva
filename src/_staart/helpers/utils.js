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
exports.queryToParams = exports.dnsResolve = exports.includesDomainInCommaList = exports.removeFalsyValues = exports.IdValues = exports.readOnlyValues = exports.jsonValues = exports.dateValues = exports.boolValues = exports.getCodeFromRequest = exports.safeRedirect = exports.localsToTokenOrKey = exports.userUsernameToId = exports.organizationUsernameToId = exports.deleteSensitiveInfoUser = void 0;
const text_1 = require("@staart/text");
const validate_1 = require("@staart/validate");
const errors_1 = require("@staart/errors");
const dns_1 = __importDefault(require("dns"));
const enum_1 = require("../interfaces/enum");
const prisma_1 = require("../helpers/prisma");
/**
 * Delete any sensitive information for a user like passwords and tokens
 */
exports.deleteSensitiveInfoUser = (user) => {
    delete user.password;
    delete user.twoFactorSecret;
    return user;
};
exports.organizationUsernameToId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = (_a = (yield prisma_1.prisma.organizations.findOne({
        select: { id: true },
        where: {
            username: id,
        },
    }))) === null || _a === void 0 ? void 0 : _a.id.toString();
    if (result)
        return result;
    throw new Error(errors_1.ORGANIZATION_NOT_FOUND);
});
exports.userUsernameToId = (id, tokenUserId) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    if (id === "me" && tokenUserId) {
        return String(tokenUserId);
    }
    else {
        const result = (_b = (yield prisma_1.prisma.users.findOne({
            select: { id: true },
            where: {
                username: id,
            },
        }))) === null || _b === void 0 ? void 0 : _b.id.toString();
        if (result)
            return result;
        throw new Error(errors_1.USER_NOT_FOUND);
    }
});
exports.localsToTokenOrKey = (res) => {
    if (res.locals.token.sub == enum_1.Tokens.API_KEY) {
        return res.locals.token;
    }
    return res.locals.token.id;
};
exports.safeRedirect = (req, res, url) => {
    if (req.get("X-Requested-With") === "XMLHttpRequest")
        return res.json({ redirect: url });
    return res.redirect(url);
};
exports.getCodeFromRequest = (req) => {
    const code = req.body.code || (req.get("Authorization") || "").replace("Bearer ", "");
    validate_1.joiValidate({ code: validate_1.Joi.string().required() }, { code });
    return code;
};
/**
 * MySQL columns which are booleans
 */
exports.boolValues = [
    "twoFactorEnabled",
    "prefersReducedMotion",
    "prefersColorSchemeDark",
    "used",
    "isVerified",
    "forceTwoFactor",
    "autoJoinDomain",
    "onlyAllowDomain",
    "isActive",
    "checkLocationOnLogin",
];
/**
 * MySQL columns which are datetime values
 */
exports.dateValues = [
    "createdAt",
    "updatedAt",
    "lastFiredAt",
    "expiresAt",
];
/**
 * MySQL columns which are JSON values
 */
exports.jsonValues = ["data"];
/**
 * MySQL columns which are read-only
 */
exports.readOnlyValues = [
    "createdAt",
    "id",
    "jwtApiKey",
    "userId",
    "organizationId",
];
/**
 * MySQL columns which are for int IDs
 */
exports.IdValues = [
    "id",
    "userId",
    "organizationId",
    "primaryEmail",
    "apiKeyId",
    "apiKeyOrganizationId",
];
exports.removeFalsyValues = (value) => {
    if (value && typeof value === "object") {
        Object.keys(value).map((key) => {
            if (!value[key])
                delete value[key];
        });
    }
    return value;
};
exports.includesDomainInCommaList = (commaList, value) => {
    const list = commaList.split(",").map((item) => item.trim());
    let includes = false;
    list.forEach((item) => {
        if (item === value || text_1.isMatch(value, `*.${item}`))
            includes = true;
    });
    return includes;
};
exports.dnsResolve = (hostname, recordType) => new Promise((resolve, reject) => {
    dns_1.default.resolve(hostname, recordType, (error, records) => {
        if (error)
            return reject(error);
        resolve(records);
    });
});
exports.queryToParams = (req) => {
    if (typeof req.query === "object") {
        const query = req.query;
        const result = {};
        if (typeof query.skip === "string")
            result.skip = parseInt(query.skip);
        if (typeof query.first === "string")
            result.first = parseInt(query.first);
        if (typeof query.last === "string")
            result.last = parseInt(query.last);
        query.select = query.select || [];
        if (typeof query.select === "string")
            query.select = [query.select];
        const select = {};
        query.select.forEach((selectQuery) => (select[selectQuery] = true));
        if (Object.keys(select).length)
            result.select = select;
        query.include = query.include || [];
        if (typeof query.include === "string")
            query.include = [query.include];
        const include = {};
        query.include.forEach((includeQuery) => (include[includeQuery] = true));
        if (Object.keys(include).length)
            result.include = include;
        query.orderBy = query.orderBy || [];
        if (typeof query.orderBy === "string")
            query.orderBy = [query.orderBy];
        const orderBy = {};
        query.orderBy.forEach((orderByQuery) => {
            if (orderByQuery.trim() && orderByQuery.includes(":")) {
                const orderByArg = orderByQuery.split(":")[1];
                if (["asc", "desc"].includes(orderByArg))
                    orderBy[orderByQuery.split(":")[0]] = orderByArg;
            }
        });
        if (Object.keys(orderBy).length)
            result.orderBy = orderBy;
        console.log(JSON.stringify(query), JSON.stringify(result));
        return result;
    }
    return {};
};
//# sourceMappingURL=utils.js.map