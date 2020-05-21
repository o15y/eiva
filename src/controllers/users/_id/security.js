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
exports.UserSecurityController = void 0;
const server_1 = require("@staart/server");
const server_2 = require("@staart/server");
const server_3 = require("@staart/server");
const messages_1 = require("@staart/messages");
const server_4 = require("@staart/server");
const validate_1 = require("@staart/validate");
const middleware_1 = require("../../../_staart/helpers/middleware");
const utils_1 = require("../../../_staart/helpers/utils");
const user_1 = require("../../../_staart/rest/user");
let UserSecurityController = /** @class */ (() => {
    let UserSecurityController = class UserSecurityController {
        updatePassword(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.userUsernameToId(req.params.id, res.locals.token.id);
                const oldPassword = req.body.oldPassword;
                const newPassword = req.body.newPassword;
                validate_1.joiValidate({
                    id: validate_1.Joi.string().required(),
                }, { id });
                yield user_1.updatePasswordForUser(res.locals.token.id, id, oldPassword, newPassword, res.locals);
                return messages_1.respond(messages_1.RESOURCE_UPDATED);
            });
        }
        getUserData(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.userUsernameToId(req.params.id, res.locals.token.id);
                validate_1.joiValidate({ id: validate_1.Joi.string().required() }, { id });
                return user_1.getAllDataForUser(res.locals.token.id, id);
            });
        }
        getEnable2FA(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.userUsernameToId(req.params.id, res.locals.token.id);
                validate_1.joiValidate({ id: validate_1.Joi.string().required() }, { id });
                return user_1.enable2FAForUser(res.locals.token.id, id);
            });
        }
        postVerify2FA(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.userUsernameToId(req.params.id, res.locals.token.id);
                const code = req.body.code;
                validate_1.joiValidate({
                    id: validate_1.Joi.string().required(),
                    code: validate_1.Joi.number().min(5).required(),
                }, { id, code });
                const backupCodes = yield user_1.verify2FAForUser(res.locals.token.id, id, code);
                return Object.assign(Object.assign({}, messages_1.respond(messages_1.RESOURCE_SUCCESS)), { backupCodes });
            });
        }
        delete2FA(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.userUsernameToId(req.params.id, res.locals.token.id);
                validate_1.joiValidate({ id: validate_1.Joi.string().required() }, { id });
                yield user_1.disable2FAForUser(res.locals.token.id, id);
                return messages_1.respond(messages_1.RESOURCE_SUCCESS);
            });
        }
        getRegenerateBackupCodes(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.userUsernameToId(req.params.id, res.locals.token.id);
                validate_1.joiValidate({ id: validate_1.Joi.string().required() }, { id });
                const backupCodes = yield user_1.regenerateBackupCodesForUser(res.locals.token.id, id);
                return Object.assign(Object.assign({}, messages_1.respond(messages_1.RESOURCE_SUCCESS)), { backupCodes });
            });
        }
    };
    __decorate([
        server_4.Put("password"),
        server_4.Middleware(middleware_1.validator({
            oldPassword: validate_1.Joi.string().allow("").optional(),
            newPassword: validate_1.Joi.string().min(6).required(),
        }, "body")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], UserSecurityController.prototype, "updatePassword", null);
    __decorate([
        server_4.Get("data"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], UserSecurityController.prototype, "getUserData", null);
    __decorate([
        server_4.Get("2fa/enable"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], UserSecurityController.prototype, "getEnable2FA", null);
    __decorate([
        server_4.Post("2fa/verify"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], UserSecurityController.prototype, "postVerify2FA", null);
    __decorate([
        server_4.Delete("2fa"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], UserSecurityController.prototype, "delete2FA", null);
    __decorate([
        server_4.Get("backup-codes/regenerate"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], UserSecurityController.prototype, "getRegenerateBackupCodes", null);
    UserSecurityController = __decorate([
        server_4.ClassMiddleware(middleware_1.authHandler),
        server_4.Controller("users/:id/security"),
        server_2.ClassWrapper(server_3.jsonAsyncResponse),
        server_1.ClassOptions({ mergeParams: true })
    ], UserSecurityController);
    return UserSecurityController;
})();
exports.UserSecurityController = UserSecurityController;
//# sourceMappingURL=security.js.map