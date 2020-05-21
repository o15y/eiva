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
exports.UserAccessTokensController = void 0;
const server_1 = require("@staart/server");
const server_2 = require("@staart/server");
const server_3 = require("@staart/server");
const messages_1 = require("@staart/messages");
const server_4 = require("@staart/server");
const validate_1 = require("@staart/validate");
const middleware_1 = require("../../../_staart/helpers/middleware");
const utils_1 = require("../../../_staart/helpers/utils");
const user_1 = require("../../../_staart/rest/user");
let UserAccessTokensController = /** @class */ (() => {
    let UserAccessTokensController = class UserAccessTokensController {
        getUserAccessTokens(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.userUsernameToId(req.params.id, res.locals.token.id);
                validate_1.joiValidate({ id: validate_1.Joi.string().required() }, { id });
                return user_1.getUserAccessTokensForUser(res.locals.token.id, id, req.query);
            });
        }
        putUserAccessTokens(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.userUsernameToId(req.params.id, res.locals.token.id);
                validate_1.joiValidate({ id: validate_1.Joi.string().required() }, { id });
                try {
                    const added = yield user_1.createAccessTokenForUser(res.locals.token.id, id, req.body, res.locals);
                    return Object.assign(Object.assign({}, messages_1.respond(messages_1.RESOURCE_CREATED)), { added });
                }
                catch (error) {
                    console.log(error);
                    return {};
                }
            });
        }
        getUserAccessToken(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.userUsernameToId(req.params.id, res.locals.token.id);
                const accessTokenId = req.params.accessTokenId;
                validate_1.joiValidate({
                    id: validate_1.Joi.string().required(),
                    accessTokenId: validate_1.Joi.string().required(),
                }, { id, accessTokenId });
                return user_1.getUserAccessTokenForUser(res.locals.token.id, id, accessTokenId);
            });
        }
        patchUserAccessToken(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.userUsernameToId(req.params.id, res.locals.token.id);
                const accessTokenId = req.params.accessTokenId;
                validate_1.joiValidate({
                    id: validate_1.Joi.string().required(),
                    accessTokenId: validate_1.Joi.string().required(),
                }, { id, accessTokenId });
                const updated = yield user_1.updateAccessTokenForUser(res.locals.token.id, id, accessTokenId, req.body, res.locals);
                return Object.assign(Object.assign({}, messages_1.respond(messages_1.RESOURCE_UPDATED)), { updated });
            });
        }
        deleteUserAccessToken(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.userUsernameToId(req.params.id, res.locals.token.id);
                const accessTokenId = req.params.accessTokenId;
                validate_1.joiValidate({
                    id: validate_1.Joi.string().required(),
                    accessTokenId: validate_1.Joi.string().required(),
                }, { id, accessTokenId });
                yield user_1.deleteAccessTokenForUser(res.locals.token.id, id, accessTokenId, res.locals);
                return messages_1.respond(messages_1.RESOURCE_DELETED);
            });
        }
    };
    __decorate([
        server_4.Get(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], UserAccessTokensController.prototype, "getUserAccessTokens", null);
    __decorate([
        server_4.Put(),
        server_4.Middleware(middleware_1.validator({
            scopes: validate_1.Joi.string(),
            name: validate_1.Joi.string(),
            description: validate_1.Joi.string(),
            expiresAt: validate_1.Joi.string(),
        }, "body")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], UserAccessTokensController.prototype, "putUserAccessTokens", null);
    __decorate([
        server_4.Get(":accessTokenId"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], UserAccessTokensController.prototype, "getUserAccessToken", null);
    __decorate([
        server_4.Patch(":accessTokenId"),
        server_4.Middleware(middleware_1.validator({
            scopes: validate_1.Joi.string().allow(null),
            name: validate_1.Joi.string().allow(null),
            description: validate_1.Joi.string().allow(null),
            expiresAt: validate_1.Joi.string(),
        }, "body")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], UserAccessTokensController.prototype, "patchUserAccessToken", null);
    __decorate([
        server_4.Delete(":accessTokenId"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], UserAccessTokensController.prototype, "deleteUserAccessToken", null);
    UserAccessTokensController = __decorate([
        server_4.ClassMiddleware(middleware_1.authHandler),
        server_4.Controller("users/:id/access-tokens"),
        server_2.ClassWrapper(server_3.jsonAsyncResponse),
        server_1.ClassOptions({ mergeParams: true })
    ], UserAccessTokensController);
    return UserAccessTokensController;
})();
exports.UserAccessTokensController = UserAccessTokensController;
//# sourceMappingURL=access-tokens.js.map