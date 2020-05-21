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
exports.UserIdentitiesController = void 0;
const server_1 = require("@staart/server");
const server_2 = require("@staart/server");
const server_3 = require("@staart/server");
const messages_1 = require("@staart/messages");
const server_4 = require("@staart/server");
const validate_1 = require("@staart/validate");
const middleware_1 = require("../../../_staart/helpers/middleware");
const utils_1 = require("../../../_staart/helpers/utils");
const user_1 = require("../../../_staart/rest/user");
let UserIdentitiesController = /** @class */ (() => {
    let UserIdentitiesController = class UserIdentitiesController {
        getUserIdentities(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.userUsernameToId(req.params.id, res.locals.token.id);
                validate_1.joiValidate({ id: validate_1.Joi.string().required() }, { id });
                return user_1.getUserIdentitiesForUser(res.locals.token.id, id, req.query);
            });
        }
        createUserIdentity(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.userUsernameToId(req.params.id, res.locals.token.id);
                validate_1.joiValidate({ id: validate_1.Joi.string().required() }, { id });
                const added = yield user_1.createUserIdentityForUser(res.locals.token.id, id, req.body);
                return Object.assign(Object.assign({}, messages_1.respond(messages_1.RESOURCE_CREATED)), { added });
            });
        }
        connectUserIdentity(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.userUsernameToId(req.params.id, res.locals.token.id);
                validate_1.joiValidate({ id: validate_1.Joi.string().required() }, { id });
                const service = req.params.service;
                const url = req.body.url;
                validate_1.joiValidate({ service: validate_1.Joi.string().required(), url: validate_1.Joi.string().required() }, { service, url });
                yield user_1.connectUserIdentityForUser(res.locals.token.id, id, service, url);
                return messages_1.respond(messages_1.RESOURCE_SUCCESS);
            });
        }
        getUserIdentity(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.userUsernameToId(req.params.id, res.locals.token.id);
                const identityId = req.params.identityId;
                validate_1.joiValidate({
                    id: validate_1.Joi.string().required(),
                    identityId: validate_1.Joi.string().required(),
                }, { id, identityId });
                return user_1.getUserIdentityForUser(res.locals.token.id, id, identityId);
            });
        }
        deleteUserIdentity(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.userUsernameToId(req.params.id, res.locals.token.id);
                const identityId = req.params.identityId;
                validate_1.joiValidate({
                    id: validate_1.Joi.string().required(),
                    identityId: validate_1.Joi.string().required(),
                }, { id, identityId });
                yield user_1.deleteIdentityForUser(res.locals.token.id, id, identityId, res.locals);
                return messages_1.respond(messages_1.RESOURCE_DELETED);
            });
        }
    };
    __decorate([
        server_4.Get(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], UserIdentitiesController.prototype, "getUserIdentities", null);
    __decorate([
        server_4.Put(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], UserIdentitiesController.prototype, "createUserIdentity", null);
    __decorate([
        server_4.Post(":service"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], UserIdentitiesController.prototype, "connectUserIdentity", null);
    __decorate([
        server_4.Get(":identityId"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], UserIdentitiesController.prototype, "getUserIdentity", null);
    __decorate([
        server_4.Delete(":identityId"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], UserIdentitiesController.prototype, "deleteUserIdentity", null);
    UserIdentitiesController = __decorate([
        server_4.ClassMiddleware(middleware_1.authHandler),
        server_4.Controller("users/:id/identities"),
        server_2.ClassWrapper(server_3.jsonAsyncResponse),
        server_1.ClassOptions({ mergeParams: true })
    ], UserIdentitiesController);
    return UserIdentitiesController;
})();
exports.UserIdentitiesController = UserIdentitiesController;
//# sourceMappingURL=identities.js.map