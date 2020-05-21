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
exports.OrganizationDomainsController = void 0;
const server_1 = require("@staart/server");
const server_2 = require("@staart/server");
const server_3 = require("@staart/server");
const messages_1 = require("@staart/messages");
const server_4 = require("@staart/server");
const validate_1 = require("@staart/validate");
const middleware_1 = require("../../../_staart/helpers/middleware");
const utils_1 = require("../../../_staart/helpers/utils");
const organization_1 = require("../../../_staart/rest/organization");
let OrganizationDomainsController = /** @class */ (() => {
    let OrganizationDomainsController = class OrganizationDomainsController {
        getUserDomains(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.organizationUsernameToId(req.params.id);
                validate_1.joiValidate({ id: validate_1.Joi.string().required() }, { id });
                return organization_1.getOrganizationDomainsForUser(utils_1.localsToTokenOrKey(res), id, req.query);
            });
        }
        putUserDomains(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.organizationUsernameToId(req.params.id);
                validate_1.joiValidate({ id: validate_1.Joi.string().required() }, { id });
                const added = yield organization_1.createDomainForUser(utils_1.localsToTokenOrKey(res), id, req.body, res.locals);
                return Object.assign(Object.assign({}, messages_1.respond(messages_1.RESOURCE_CREATED)), { added });
            });
        }
        getUserDomain(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.organizationUsernameToId(req.params.id);
                const domainId = req.params.domainId;
                validate_1.joiValidate({
                    id: validate_1.Joi.string().required(),
                    domainId: validate_1.Joi.string().required(),
                }, { id, domainId });
                return organization_1.getOrganizationDomainForUser(utils_1.localsToTokenOrKey(res), id, domainId);
            });
        }
        patchUserDomain(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.organizationUsernameToId(req.params.id);
                const domainId = req.params.domainId;
                validate_1.joiValidate({
                    id: validate_1.Joi.string().required(),
                    domainId: validate_1.Joi.string().required(),
                }, { id, domainId });
                const updated = yield organization_1.updateDomainForUser(utils_1.localsToTokenOrKey(res), id, domainId, req.body, res.locals);
                return Object.assign(Object.assign({}, messages_1.respond(messages_1.RESOURCE_UPDATED)), { updated });
            });
        }
        deleteUserDomain(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.organizationUsernameToId(req.params.id);
                const domainId = req.params.domainId;
                validate_1.joiValidate({
                    id: validate_1.Joi.string().required(),
                    domainId: validate_1.Joi.string().required(),
                }, { id, domainId });
                yield organization_1.deleteDomainForUser(utils_1.localsToTokenOrKey(res), id, domainId, res.locals);
                return messages_1.respond(messages_1.RESOURCE_DELETED);
            });
        }
        verifyOrganizationDomain(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.organizationUsernameToId(req.params.id);
                const domainId = req.params.domainId;
                const method = req.body.method || req.query.method;
                validate_1.joiValidate({
                    id: validate_1.Joi.string().required(),
                    domainId: validate_1.Joi.string().required(),
                    method: validate_1.Joi.string().allow("file", "dns").only(),
                }, { id, domainId, method });
                return yield organization_1.verifyDomainForUser(utils_1.localsToTokenOrKey(res), id, domainId, method, res.locals);
            });
        }
    };
    __decorate([
        server_4.Get(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationDomainsController.prototype, "getUserDomains", null);
    __decorate([
        server_4.Put(),
        server_4.Middleware(middleware_1.validator({
            domain: validate_1.Joi.string(),
        }, "body")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationDomainsController.prototype, "putUserDomains", null);
    __decorate([
        server_4.Get(":domainId"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationDomainsController.prototype, "getUserDomain", null);
    __decorate([
        server_4.Patch(":domainId"),
        server_4.Middleware(middleware_1.validator({
            domain: validate_1.Joi.string(),
        }, "body")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationDomainsController.prototype, "patchUserDomain", null);
    __decorate([
        server_4.Delete(":domainId"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationDomainsController.prototype, "deleteUserDomain", null);
    __decorate([
        server_4.Post(":domainId/verify"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationDomainsController.prototype, "verifyOrganizationDomain", null);
    OrganizationDomainsController = __decorate([
        server_4.ClassMiddleware(middleware_1.authHandler),
        server_4.Controller("organizations/:id/domains"),
        server_2.ClassWrapper(server_3.jsonAsyncResponse),
        server_1.ClassOptions({ mergeParams: true })
    ], OrganizationDomainsController);
    return OrganizationDomainsController;
})();
exports.OrganizationDomainsController = OrganizationDomainsController;
//# sourceMappingURL=domains.js.map