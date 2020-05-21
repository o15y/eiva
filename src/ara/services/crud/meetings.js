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
exports.getMeetingIncomingEmailForOrganization = exports.getMeetingIncomingEmailsForOrganization = exports.deleteMeetingForOrganization = exports.updateMeetingForOrganization = exports.getMeetingForOrganization = exports.getAllMeetingsForOrganization = void 0;
const prisma_1 = require("../../../_staart/helpers/prisma");
const authorization_1 = require("../../../_staart/helpers/authorization");
const enum_1 = require("../../../_staart/interfaces/enum");
const errors_1 = require("@staart/errors");
exports.getAllMeetingsForOrganization = (tokenUserId, organizationId, queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(tokenUserId, enum_1.OrgScopes.READ_ORG, "organization", organizationId)) {
        return prisma_1.paginatedResult(yield prisma_1.prisma.meetings.findMany(Object.assign({ where: { organizationId: parseInt(organizationId) } }, prisma_1.queryParamsToSelect(queryParams))), { first: queryParams.first, last: queryParams.last });
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.getMeetingForOrganization = (tokenUserId, organizationId, meetingId) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(tokenUserId, enum_1.OrgScopes.READ_ORG, "organization", organizationId))
        return prisma_1.prisma.meetings.findOne({ where: { id: parseInt(meetingId) } });
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.updateMeetingForOrganization = (tokenUserId, organizationId, meetingId, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(tokenUserId, enum_1.OrgScopes.UPDATE_ORG, "organization", organizationId))
        return prisma_1.prisma.meetings.update({ where: { id: parseInt(meetingId) }, data });
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.deleteMeetingForOrganization = (tokenUserId, organizationId, meetingId) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(tokenUserId, enum_1.OrgScopes.UPDATE_ORG, "organization", organizationId))
        return prisma_1.prisma.meetings.delete({ where: { id: parseInt(meetingId) } });
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.getMeetingIncomingEmailsForOrganization = (tokenUserId, organizationId, meetingId, queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(tokenUserId, enum_1.OrgScopes.READ_ORG, "organization", organizationId)) {
        return prisma_1.paginatedResult(yield prisma_1.prisma.incoming_emails.findMany(Object.assign({ where: {
                organizationId: parseInt(organizationId),
                meetingId: parseInt(meetingId),
            } }, prisma_1.queryParamsToSelect(queryParams))), { first: queryParams.first, last: queryParams.last });
    }
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
exports.getMeetingIncomingEmailForOrganization = (tokenUserId, organizationId, meetingId, incomingEmailId) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield authorization_1.can(tokenUserId, enum_1.OrgScopes.READ_ORG, "organization", organizationId))
        return prisma_1.prisma.incoming_emails.findOne({
            where: {
                id: parseInt(incomingEmailId),
                meetingId: parseInt(meetingId),
                organizationId: parseInt(organizationId),
            },
        });
    throw new Error(errors_1.INSUFFICIENT_PERMISSION);
});
//# sourceMappingURL=meetings.js.map