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
exports.OrganizationController = void 0;
const server_1 = require("@staart/server");
const server_2 = require("@staart/server");
const server_3 = require("@staart/server");
const messages_1 = require("@staart/messages");
const server_4 = require("@staart/server");
const validate_1 = require("@staart/validate");
const middleware_1 = require("../../../_staart/helpers/middleware");
const utils_1 = require("../../../_staart/helpers/utils");
const organization_1 = require("../../../_staart/rest/organization");
let OrganizationController = /** @class */ (() => {
    let OrganizationController = class OrganizationController {
        get(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.organizationUsernameToId(req.params.id);
                validate_1.joiValidate({ id: validate_1.Joi.string().required() }, { id });
                const organization = yield organization_1.getOrganizationForUser(utils_1.localsToTokenOrKey(res), id);
                return organization;
            });
        }
        patch(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.organizationUsernameToId(req.params.id);
                validate_1.joiValidate({ id: validate_1.Joi.string().required() }, { id });
                const updated = yield organization_1.updateOrganizationForUser(utils_1.localsToTokenOrKey(res), id, req.body, res.locals);
                return Object.assign(Object.assign({}, messages_1.respond(messages_1.RESOURCE_UPDATED, { resource: "Team" })), { updated });
            });
        }
        delete(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const organizationId = yield utils_1.organizationUsernameToId(req.params.id);
                validate_1.joiValidate({ organizationId: validate_1.Joi.string().required() }, { organizationId });
                yield organization_1.deleteOrganizationForUser(res.locals.token.id, organizationId, res.locals);
                return messages_1.respond(messages_1.RESOURCE_DELETED);
            });
        }
        getData(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const organizationId = yield utils_1.organizationUsernameToId(req.params.id);
                validate_1.joiValidate({ organizationId: validate_1.Joi.string().required() }, { organizationId });
                return organization_1.getAllOrganizationDataForUser(utils_1.localsToTokenOrKey(res), organizationId);
            });
        }
    };
    __decorate([
        server_4.Get(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationController.prototype, "get", null);
    __decorate([
        server_4.Patch(),
        server_4.Middleware(middleware_1.validator({
            name: validate_1.Joi.string(),
            username: validate_1.Joi.string().regex(/^[a-z0-9\-]+$/i),
            forceTwoFactor: validate_1.Joi.boolean(),
            autoJoinDomain: validate_1.Joi.boolean(),
            onlyAllowDomain: validate_1.Joi.boolean(),
            ipRestrictions: validate_1.Joi.string(),
            profilePicture: validate_1.Joi.string(),
        }, "body")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationController.prototype, "patch", null);
    __decorate([
        server_4.Delete(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationController.prototype, "delete", null);
    __decorate([
        server_4.Get("data"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationController.prototype, "getData", null);
    OrganizationController = __decorate([
        server_4.ClassMiddleware(middleware_1.authHandler),
        server_4.Controller("organizations/:id"),
        server_2.ClassWrapper(server_3.jsonAsyncResponse),
        server_1.ClassOptions({ mergeParams: true })
    ], OrganizationController);
    return OrganizationController;
})();
exports.OrganizationController = OrganizationController;
//# sourceMappingURL=index.js.map