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
exports.getServerLogsForUser = exports.getPaymentEventsForUser = exports.generateCouponForUser = exports.deleteCouponForUser = exports.updateCouponForUser = exports.getCouponForUser = exports.getAllCouponsForUser = exports.getAllUsersForUser = exports.getAllOrganizationForUser = void 0;
const elasticsearch_1 = require("@staart/elasticsearch");
const errors_1 = require("@staart/errors");
const text_1 = require("@staart/text");
const config_1 = require("../../config");
const authorization_1 = require("../helpers/authorization");
const enum_1 = require("../interfaces/enum");
const prisma_1 = require("../helpers/prisma");
const payments_1 = require("@staart/payments");
const jwt_1 = require("../helpers/jwt");
exports.getAllOrganizationForUser = (tokenUserId, queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(tokenUserId, enum_1.SudoScopes.READ, "sudo"))
        return prisma_1.paginatedResult(yield prisma_1.prisma.organizations.findMany(prisma_1.queryParamsToSelect(queryParams)), { first: queryParams.first, last: queryParams.last });
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.getAllUsersForUser = (tokenUserId, queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(tokenUserId, enum_1.SudoScopes.READ, "sudo"))
        return prisma_1.paginatedResult(yield prisma_1.prisma.users.findMany(prisma_1.queryParamsToSelect(queryParams)), { first: queryParams.first, last: queryParams.last });
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.getAllCouponsForUser = (tokenUserId, queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(tokenUserId, enum_1.SudoScopes.READ, "sudo"))
        return prisma_1.paginatedResult(yield prisma_1.prisma.coupon_codes.findMany(prisma_1.queryParamsToSelect(queryParams)), { first: queryParams.first, last: queryParams.last });
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.getCouponForUser = (tokenUserId, couponId) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(tokenUserId, enum_1.SudoScopes.READ, "sudo"))
        return prisma_1.prisma.coupon_codes.findOne({ where: { id: parseInt(couponId) } });
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.updateCouponForUser = (tokenUserId, couponId, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(tokenUserId, enum_1.SudoScopes.READ, "sudo"))
        return prisma_1.prisma.coupon_codes.update({
            data,
            where: { id: parseInt(couponId) },
        });
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.deleteCouponForUser = (tokenUserId, couponId) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(tokenUserId, enum_1.SudoScopes.READ, "sudo"))
        return prisma_1.prisma.coupon_codes.delete({ where: { id: parseInt(couponId) } });
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.generateCouponForUser = (tokenUserId, body) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield authorization_1.can(tokenUserId, enum_1.SudoScopes.READ, "sudo")))
        throw new Error(errors_1.INSUFFICIENT_PERMISSION);
    if (body.jwt)
        return jwt_1.couponCodeJwt(body.amount, body.currency, body.description);
    delete body.jwt;
    body.code =
        body.code || text_1.randomString({ length: 10, type: "distinguishable" });
    return prisma_1.prisma.coupon_codes.create({
        data: body,
    });
});
exports.getPaymentEventsForUser = (tokenUserId, body) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield authorization_1.can(tokenUserId, enum_1.SudoScopes.READ, "sudo")))
        throw new Error(errors_1.INSUFFICIENT_PERMISSION);
    return payments_1.getEvents(body);
});
/**
 * Get an API key
 */
exports.getServerLogsForUser = (tokenUserId, query) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield authorization_1.can(tokenUserId, enum_1.SudoScopes.READ, "sudo")))
        throw new Error(errors_1.INSUFFICIENT_PERMISSION);
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
//# sourceMappingURL=admin.js.map