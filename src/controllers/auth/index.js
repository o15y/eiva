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
exports.AuthController = void 0;
const server_1 = require("@staart/server");
const server_2 = require("@staart/server");
const server_3 = require("@staart/server");
const errors_1 = require("@staart/errors");
const messages_1 = require("@staart/messages");
const server_4 = require("@staart/server");
const validate_1 = require("@staart/validate");
const jwt_1 = require("../../_staart/helpers/jwt");
const middleware_1 = require("../../_staart/helpers/middleware");
const auth_1 = require("../../_staart/rest/auth");
const oauth_1 = require("./oauth");
const user_1 = require("../../_staart/rest/user");
let AuthController = /** @class */ (() => {
    let AuthController = class AuthController {
        register(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const user = req.body;
                const email = req.body.email;
                const invitedByUser = req.body.invitedByUser;
                delete user.organizationId;
                delete user.email;
                delete user.invitedByUser;
                if (user.role === "ADMIN")
                    delete user.role;
                delete user.membershipRole;
                const { userId, resendToken } = yield auth_1.register(user, res.locals, email, req.body.organizationId, req.body.membershipRole);
                if (invitedByUser)
                    yield user_1.addInvitationCredits(invitedByUser, userId.toString());
                return Object.assign(Object.assign({}, messages_1.respond(messages_1.RESOURCE_CREATED)), { resendToken });
            });
        }
        login(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                return auth_1.login(req.body.email, req.body.password, res.locals);
            });
        }
        twoFactor(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const code = req.body.code;
                const token = req.body.token;
                return auth_1.login2FA(code, token, res.locals);
            });
        }
        postVerifyToken(req) {
            return __awaiter(this, void 0, void 0, function* () {
                const token = req.body.token || (req.get("Authorization") || "").replace("Bearer ", "");
                const subject = req.body.subject;
                try {
                    const data = yield jwt_1.verifyToken(token, subject);
                    return { verified: true, data };
                }
                catch (error) {
                    throw new Error(errors_1.INVALID_TOKEN);
                }
            });
        }
        postRefreshToken(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const token = req.body.token || (req.get("Authorization") || "").replace("Bearer ", "");
                validate_1.joiValidate({ token: validate_1.Joi.string().required() }, { token });
                return auth_1.validateRefreshToken(token, res.locals);
            });
        }
        postLogout(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const token = req.body.token || (req.get("Authorization") || "").replace("Bearer ", "");
                validate_1.joiValidate({ token: validate_1.Joi.string().required() }, { token });
                yield auth_1.invalidateRefreshToken(token, res.locals);
                return messages_1.respond(messages_1.RESOURCE_SUCCESS);
            });
        }
        postResetPasswordRequest(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const email = req.body.email;
                yield auth_1.sendPasswordReset(email, res.locals);
                return messages_1.respond(messages_1.RESOURCE_SUCCESS);
            });
        }
        postResetPasswordRecover(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const token = req.body.token || (req.get("Authorization") || "").replace("Bearer ", "");
                const password = req.body.password;
                validate_1.joiValidate({
                    token: validate_1.Joi.string().required(),
                    password: validate_1.Joi.string().min(6).required(),
                }, { token, password });
                yield auth_1.updatePassword(token, password, res.locals);
                return messages_1.respond(messages_1.RESOURCE_UPDATED);
            });
        }
        resendEmail(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const token = req.body.token;
                yield auth_1.resendEmailVerificationWithToken(token);
                return messages_1.respond(messages_1.RESOURCE_UPDATED);
            });
        }
        getImpersonate(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const tokenUserId = res.locals.token.id;
                const impersonateUserId = req.params.id;
                return auth_1.impersonate(tokenUserId, impersonateUserId, res.locals);
            });
        }
        getApproveLocation(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const token = req.body.token || req.params.token;
                validate_1.joiValidate({ token: validate_1.Joi.string().required() }, { token });
                return auth_1.approveLocation(token, res.locals);
            });
        }
        postVerifyEmail(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const token = req.body.token || req.params.token;
                validate_1.joiValidate({ token: validate_1.Joi.string().required() }, { token });
                yield auth_1.verifyEmail(token, res.locals);
                return messages_1.respond(messages_1.RESOURCE_SUCCESS);
            });
        }
    };
    __decorate([
        server_4.Post("register"),
        server_4.Middleware(middleware_1.bruteForceHandler),
        server_4.Middleware(middleware_1.validator({
            email: validate_1.Joi.string().email().required(),
            name: validate_1.Joi.string()
                .min(3)
                .regex(/^[a-zA-Z ]*$/)
                .required(),
            countryCode: validate_1.Joi.string().length(2),
            password: validate_1.Joi.string().min(6),
            gender: validate_1.Joi.string().length(1),
            preferredLanguage: validate_1.Joi.string().min(2).max(5),
            timezone: validate_1.Joi.string(),
            invitedByUser: validate_1.Joi.string().optional(),
        }, "body")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], AuthController.prototype, "register", null);
    __decorate([
        server_4.Post("login"),
        server_4.Middleware(middleware_1.bruteForceHandler),
        server_4.Middleware(middleware_1.validator({
            email: validate_1.Joi.string().email().required(),
            password: validate_1.Joi.string().min(6).required(),
        }, "body")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], AuthController.prototype, "login", null);
    __decorate([
        server_4.Post("2fa"),
        server_4.Middleware(middleware_1.validator({
            token: validate_1.Joi.string().required(),
            code: validate_1.Joi.number().min(5).required(),
        }, "body")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], AuthController.prototype, "twoFactor", null);
    __decorate([
        server_4.Post("verify-token"),
        server_4.Middleware(middleware_1.validator({
            token: validate_1.Joi.string().required(),
            subject: validate_1.Joi.string().required(),
        }, "body")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], AuthController.prototype, "postVerifyToken", null);
    __decorate([
        server_4.Post("refresh"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], AuthController.prototype, "postRefreshToken", null);
    __decorate([
        server_4.Post("logout"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], AuthController.prototype, "postLogout", null);
    __decorate([
        server_4.Post("reset-password/request"),
        server_4.Middleware(middleware_1.validator({
            email: validate_1.Joi.string().email().required(),
        }, "body")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], AuthController.prototype, "postResetPasswordRequest", null);
    __decorate([
        server_4.Post("reset-password/recover"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], AuthController.prototype, "postResetPasswordRecover", null);
    __decorate([
        server_4.Post("resend-verification"),
        server_4.Middleware(middleware_1.validator({
            token: validate_1.Joi.string().required(),
        }, "body")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], AuthController.prototype, "resendEmail", null);
    __decorate([
        server_4.Post("impersonate/:id"),
        server_4.Middleware(middleware_1.authHandler),
        server_4.Middleware(middleware_1.validator({ impersonateUserId: validate_1.Joi.string().required() }, "params")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], AuthController.prototype, "getImpersonate", null);
    __decorate([
        server_4.Post("approve-location"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], AuthController.prototype, "getApproveLocation", null);
    __decorate([
        server_4.Post("verify-email"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], AuthController.prototype, "postVerifyEmail", null);
    AuthController = __decorate([
        server_4.ChildControllers([new oauth_1.AuthOAuthController()]),
        server_4.Controller("auth"),
        server_2.ClassWrapper(server_3.jsonAsyncResponse),
        server_1.ClassOptions({ mergeParams: true })
    ], AuthController);
    return AuthController;
})();
exports.AuthController = AuthController;
//# sourceMappingURL=index.js.map