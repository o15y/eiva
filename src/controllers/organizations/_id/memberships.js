"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.OrganizationMembershipsController = void 0;
const server_1 = require("@staart/server");
const server_2 = require("@staart/server");
const server_3 = require("@staart/server");
const messages_1 = require("@staart/messages");
const server_4 = require("@staart/server");
const validate_1 = require("@staart/validate");
const middleware_1 = require("../../../_staart/helpers/middleware");
const utils_1 = require("../../../_staart/helpers/utils");
const organization_1 = require("../../../_staart/rest/organization");
const client_1 = require("@prisma/client");
let OrganizationMembershipsController = /** @class */ (() => {
    let OrganizationMembershipsController = class OrganizationMembershipsController {
        getMemberships(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const organizationId = yield utils_1.organizationUsernameToId(req.params.id);
                validate_1.joiValidate({ organizationId: validate_1.Joi.string().required() }, { organizationId });
                return organization_1.getOrganizationMembershipsForUser(utils_1.localsToTokenOrKey(res), organizationId, req.query);
            });
        }
        putMemberships(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const organizationId = yield utils_1.organizationUsernameToId(req.params.id);
                const newMemberName = req.body.name;
                const newMemberEmail = req.body.email;
                const role = req.body.role;
                validate_1.joiValidate({
                    organizationId: validate_1.Joi.string().required(),
                    newMemberName: validate_1.Joi.string().min(6).required(),
                    newMemberEmail: validate_1.Joi.string().email().required(),
                    role: validate_1.Joi.number(),
                }, {
                    organizationId,
                    newMemberName,
                    newMemberEmail,
                    role,
                });
                yield organization_1.inviteMemberToOrganization(utils_1.localsToTokenOrKey(res), organizationId, newMemberName, newMemberEmail, role || client_1.MembershipRole.MEMBER, res.locals);
                return messages_1.respond(messages_1.RESOURCE_CREATED);
            });
        }
        getMembership(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const organizationId = yield utils_1.organizationUsernameToId(req.params.id);
                const membershipId = req.params.membershipId;
                validate_1.joiValidate({
                    organizationId: validate_1.Joi.string().required(),
                    membershipId: validate_1.Joi.string().required(),
                }, { organizationId, membershipId });
                return organization_1.getOrganizationMembershipForUser(utils_1.localsToTokenOrKey(res), organizationId, membershipId);
            });
        }
        updateMembership(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const organizationId = yield utils_1.organizationUsernameToId(req.params.id);
                const membershipId = req.params.membershipId;
                validate_1.joiValidate({
                    organizationId: validate_1.Joi.string().required(),
                    membershipId: validate_1.Joi.string().required(),
                }, { organizationId, membershipId });
                const updated = yield organization_1.updateOrganizationMembershipForUser(utils_1.localsToTokenOrKey(res), organizationId, membershipId, req.body);
                return Object.assign(Object.assign({}, messages_1.respond(messages_1.RESOURCE_UPDATED)), { updated });
            });
        }
        deleteMembership(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const organizationId = yield utils_1.organizationUsernameToId(req.params.id);
                const membershipId = req.params.membershipId;
                validate_1.joiValidate({
                    organizationId: validate_1.Joi.string().required(),
                    membershipId: validate_1.Joi.string().required(),
                }, { organizationId, membershipId });
                yield organization_1.deleteOrganizationMembershipForUser(utils_1.localsToTokenOrKey(res), organizationId, membershipId, res.locals);
                return messages_1.respond(messages_1.RESOURCE_DELETED);
            });
        }
    };
    __decorate([
        server_4.Get(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationMembershipsController.prototype, "getMemberships", null);
    __decorate([
        server_4.Put(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationMembershipsController.prototype, "putMemberships", null);
    __decorate([
        server_4.Get(":membershipId"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationMembershipsController.prototype, "getMembership", null);
    __decorate([
        server_4.Patch(":membershipId"),
        server_4.Middleware(middleware_1.validator({
            role: validate_1.Joi.string().allow("OWNER", "ADMIN", "RESELLER", "MEMBER").only(),
        }, "body")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationMembershipsController.prototype, "updateMembership", null);
    __decorate([
        server_4.Delete(":membershipId"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationMembershipsController.prototype, "deleteMembership", null);
    OrganizationMembershipsController = __decorate([
        server_4.ClassMiddleware(middleware_1.authHandler),
        server_4.Controller("organizations/:id/memberships"),
        server_2.ClassWrapper(server_3.jsonAsyncResponse),
        server_1.ClassOptions({ mergeParams: true })
    ], OrganizationMembershipsController);
    return OrganizationMembershipsController;
})();
exports.OrganizationMembershipsController = OrganizationMembershipsController;
//# sourceMappingURL=memberships.js.map