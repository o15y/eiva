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
exports.OrganizationApiKeysController = void 0;
const server_1 = require("@staart/server");
const server_2 = require("@staart/server");
const server_3 = require("@staart/server");
const messages_1 = require("@staart/messages");
const server_4 = require("@staart/server");
const validate_1 = require("@staart/validate");
const middleware_1 = require("../../../_staart/helpers/middleware");
const utils_1 = require("../../../_staart/helpers/utils");
const organization_1 = require("../../../_staart/rest/organization");
let OrganizationApiKeysController = /** @class */ (() => {
    let OrganizationApiKeysController = class OrganizationApiKeysController {
        getUserApiKeys(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.organizationUsernameToId(req.params.id);
                validate_1.joiValidate({ id: validate_1.Joi.string().required() }, { id });
                return organization_1.getOrganizationApiKeysForUser(utils_1.localsToTokenOrKey(res), id, req.query);
            });
        }
        putUserApiKeys(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.organizationUsernameToId(req.params.id);
                validate_1.joiValidate({ id: validate_1.Joi.string().required() }, { id });
                const added = yield organization_1.createApiKeyForUser(utils_1.localsToTokenOrKey(res), id, req.body, res.locals);
                return Object.assign(Object.assign({}, messages_1.respond(messages_1.RESOURCE_CREATED)), { added });
            });
        }
        getUserApiKey(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.organizationUsernameToId(req.params.id);
                const apiKeyId = req.params.apiKeyId;
                validate_1.joiValidate({
                    id: validate_1.Joi.string().required(),
                    apiKeyId: validate_1.Joi.string().required(),
                }, { id, apiKeyId });
                return organization_1.getOrganizationApiKeyForUser(utils_1.localsToTokenOrKey(res), id, apiKeyId);
            });
        }
        patchUserApiKey(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.organizationUsernameToId(req.params.id);
                const apiKeyId = req.params.apiKeyId;
                validate_1.joiValidate({
                    id: validate_1.Joi.string().required(),
                    apiKeyId: validate_1.Joi.string().required(),
                }, { id, apiKeyId });
                const updated = yield organization_1.updateApiKeyForUser(utils_1.localsToTokenOrKey(res), id, apiKeyId, req.body, res.locals);
                return Object.assign(Object.assign({}, messages_1.respond(messages_1.RESOURCE_UPDATED)), { updated });
            });
        }
        deleteUserApiKey(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.organizationUsernameToId(req.params.id);
                const apiKeyId = req.params.apiKeyId;
                validate_1.joiValidate({
                    id: validate_1.Joi.string().required(),
                    apiKeyId: validate_1.Joi.string().required(),
                }, { id, apiKeyId });
                yield organization_1.deleteApiKeyForUser(utils_1.localsToTokenOrKey(res), id, apiKeyId, res.locals);
                return messages_1.respond(messages_1.RESOURCE_DELETED);
            });
        }
        getUserApiKeyLogs(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.organizationUsernameToId(req.params.id);
                const apiKeyId = req.params.apiKeyId;
                validate_1.joiValidate({
                    id: validate_1.Joi.string().required(),
                    apiKeyId: validate_1.Joi.string().required(),
                }, { id, apiKeyId });
                return organization_1.getOrganizationApiKeyLogsForUser(utils_1.localsToTokenOrKey(res), id, apiKeyId, req.query);
            });
        }
    };
    __decorate([
        server_4.Get(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationApiKeysController.prototype, "getUserApiKeys", null);
    __decorate([
        server_4.Put(),
        server_4.Middleware(middleware_1.validator({
            scopes: validate_1.Joi.string(),
            ipRestrictions: validate_1.Joi.string(),
            referrerRestrictions: validate_1.Joi.string(),
            name: validate_1.Joi.string(),
            description: validate_1.Joi.string(),
        }, "body")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationApiKeysController.prototype, "putUserApiKeys", null);
    __decorate([
        server_4.Get(":apiKeyId"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationApiKeysController.prototype, "getUserApiKey", null);
    __decorate([
        server_4.Patch(":apiKeyId"),
        server_4.Middleware(middleware_1.validator({
            scopes: validate_1.Joi.string().allow(null),
            ipRestrictions: validate_1.Joi.string().allow(null),
            referrerRestrictions: validate_1.Joi.string().allow(null),
            name: validate_1.Joi.string().allow(null),
            description: validate_1.Joi.string().allow(null),
        }, "body")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationApiKeysController.prototype, "patchUserApiKey", null);
    __decorate([
        server_4.Delete(":apiKeyId"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationApiKeysController.prototype, "deleteUserApiKey", null);
    __decorate([
        server_4.Get(":apiKeyId/logs"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationApiKeysController.prototype, "getUserApiKeyLogs", null);
    OrganizationApiKeysController = __decorate([
        server_4.ClassMiddleware(middleware_1.authHandler),
        server_4.Controller("organizations/:id/api-keys"),
        server_2.ClassWrapper(server_3.jsonAsyncResponse),
        server_1.ClassOptions({ mergeParams: true })
    ], OrganizationApiKeysController);
    return OrganizationApiKeysController;
})();
exports.OrganizationApiKeysController = OrganizationApiKeysController;
//# sourceMappingURL=api-keys.js.map