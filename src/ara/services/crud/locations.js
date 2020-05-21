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
exports.deleteLocationForOrganization = exports.updateLocationForOrganization = exports.createLocationForOrganization = exports.getLocationForOrganization = exports.getAllLocationsForOrganization = void 0;
const prisma_1 = require("../../../_staart/helpers/prisma");
const authorization_1 = require("../../../_staart/helpers/authorization");
const enum_1 = require("../../../_staart/interfaces/enum");
const errors_1 = require("@staart/errors");
exports.getAllLocationsForOrganization = (tokenUserId, organizationId, queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(tokenUserId, enum_1.OrgScopes.READ_ORG, "organization", organizationId)) {
        return prisma_1.paginatedResult(yield prisma_1.prisma.locations.findMany(Object.assign({ where: { organizationId: parseInt(organizationId) } }, prisma_1.queryParamsToSelect(queryParams))), { first: queryParams.first, last: queryParams.last });
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.getLocationForOrganization = (tokenUserId, organizationId, meetingId) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(tokenUserId, enum_1.OrgScopes.READ_ORG, "organization", organizationId))
        return prisma_1.prisma.locations.findOne({ where: { id: parseInt(meetingId) } });
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.createLocationForOrganization = (tokenUserId, organizationId, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(tokenUserId, enum_1.OrgScopes.UPDATE_ORG, "organization", organizationId))
        return prisma_1.prisma.locations.create({
            data: Object.assign(Object.assign({}, data), { organization: { connect: { id: parseInt(organizationId) } } }),
        });
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.updateLocationForOrganization = (tokenUserId, organizationId, meetingId, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(tokenUserId, enum_1.OrgScopes.UPDATE_ORG, "organization", organizationId))
        return prisma_1.prisma.locations.update({
            where: { id: parseInt(meetingId) },
            data,
        });
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.deleteLocationForOrganization = (tokenUserId, organizationId, meetingId) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(tokenUserId, enum_1.OrgScopes.UPDATE_ORG, "organization", organizationId))
        return prisma_1.prisma.locations.delete({ where: { id: parseInt(meetingId) } });
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
//# sourceMappingURL=locations.js.map