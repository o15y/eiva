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
exports.OrganizationWebhooksController = void 0;
const server_1 = require("@staart/server");
const server_2 = require("@staart/server");
const server_3 = require("@staart/server");
const messages_1 = require("@staart/messages");
const server_4 = require("@staart/server");
const validate_1 = require("@staart/validate");
const middleware_1 = require("../../../_staart/helpers/middleware");
const utils_1 = require("../../../_staart/helpers/utils");
const organization_1 = require("../../../_staart/rest/organization");
let OrganizationWebhooksController = /** @class */ (() => {
    let OrganizationWebhooksController = class OrganizationWebhooksController {
        getOrganizationWebhooks(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.organizationUsernameToId(req.params.id);
                validate_1.joiValidate({ id: validate_1.Joi.string().required() }, { id });
                return organization_1.getOrganizationWebhooksForUser(utils_1.localsToTokenOrKey(res), id, req.query);
            });
        }
        putOrganizationWebhooks(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.organizationUsernameToId(req.params.id);
                validate_1.joiValidate({ id: validate_1.Joi.string().required() }, { id });
                const added = yield organization_1.createWebhookForUser(utils_1.localsToTokenOrKey(res), id, req.body, res.locals);
                return Object.assign(Object.assign({}, messages_1.respond(messages_1.RESOURCE_CREATED)), { added });
            });
        }
        getOrganizationWebhook(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.organizationUsernameToId(req.params.id);
                const webhookId = req.params.webhookId;
                validate_1.joiValidate({
                    id: validate_1.Joi.string().required(),
                    webhookId: validate_1.Joi.string().required(),
                }, { id, webhookId });
                return organization_1.getOrganizationWebhookForUser(utils_1.localsToTokenOrKey(res), id, webhookId);
            });
        }
        patchOrganizationWebhook(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.organizationUsernameToId(req.params.id);
                const webhookId = req.params.webhookId;
                validate_1.joiValidate({
                    id: validate_1.Joi.string().required(),
                    webhookId: validate_1.Joi.string().required(),
                }, { id, webhookId });
                const updated = yield organization_1.updateWebhookForUser(utils_1.localsToTokenOrKey(res), id, webhookId, req.body, res.locals);
                return Object.assign(Object.assign({}, messages_1.respond(messages_1.RESOURCE_UPDATED)), { updated });
            });
        }
        deleteOrganizationWebhook(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.organizationUsernameToId(req.params.id);
                const webhookId = req.params.webhookId;
                validate_1.joiValidate({
                    id: validate_1.Joi.string().required(),
                    webhookId: validate_1.Joi.string().required(),
                }, { id, webhookId });
                yield organization_1.deleteWebhookForUser(utils_1.localsToTokenOrKey(res), id, webhookId, res.locals);
                return messages_1.respond(messages_1.RESOURCE_DELETED);
            });
        }
    };
    __decorate([
        server_4.Get(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationWebhooksController.prototype, "getOrganizationWebhooks", null);
    __decorate([
        server_4.Put(),
        server_4.Middleware(middleware_1.validator({
            event: validate_1.Joi.string().required(),
            url: validate_1.Joi.string().uri().required(),
            contentType: validate_1.Joi.string(),
            secret: validate_1.Joi.string().allow(),
            isActive: validate_1.Joi.boolean(),
        }, "body")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationWebhooksController.prototype, "putOrganizationWebhooks", null);
    __decorate([
        server_4.Get(":webhookId"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationWebhooksController.prototype, "getOrganizationWebhook", null);
    __decorate([
        server_4.Patch(":webhookId"),
        server_4.Middleware(middleware_1.validator({
            event: validate_1.Joi.string(),
            url: validate_1.Joi.string().uri(),
            contentType: validate_1.Joi.string(),
            secret: validate_1.Joi.string(),
            isActive: validate_1.Joi.boolean(),
        }, "body")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationWebhooksController.prototype, "patchOrganizationWebhook", null);
    __decorate([
        server_4.Delete(":webhookId"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationWebhooksController.prototype, "deleteOrganizationWebhook", null);
    OrganizationWebhooksController = __decorate([
        server_4.ClassMiddleware(middleware_1.authHandler),
        server_4.Controller("organizations/:id/webhooks"),
        server_2.ClassWrapper(server_3.jsonAsyncResponse),
        server_1.ClassOptions({ mergeParams: true })
    ], OrganizationWebhooksController);
    return OrganizationWebhooksController;
})();
exports.OrganizationWebhooksController = OrganizationWebhooksController;
//# sourceMappingURL=webhooks.js.map