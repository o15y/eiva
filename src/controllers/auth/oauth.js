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
exports.AuthOAuthController = void 0;
const server_1 = require("@staart/server");
const server_2 = require("@staart/server");
const server_3 = require("@staart/server");
const server_4 = require("@staart/server");
const querystring_1 = require("querystring");
const config_1 = require("../../config");
const utils_1 = require("../../_staart/helpers/utils");
const enum_1 = require("../../_staart/interfaces/enum");
const oauth_1 = require("../../_staart/rest/oauth");
const OAuthRedirector = (action) => (...args) => {
    return action(args[0], args[1], (error) => {
        utils_1.safeRedirect(args[0], args[1], `${config_1.FRONTEND_URL}/errors/oauth?${querystring_1.stringify(Object.assign(Object.assign(Object.assign({}, args[0].params), args[0].query), { error: error.toString().replace("Error: ", "") }))}`);
    });
};
const OAuthRedirect = (req, res, response) => {
    return utils_1.safeRedirect(req, res, `${config_1.FRONTEND_URL}/auth/token?${querystring_1.stringify(Object.assign(Object.assign({}, response), { subject: enum_1.Tokens.LOGIN }))}`);
};
let AuthOAuthController = /** @class */ (() => {
    let AuthOAuthController = class AuthOAuthController {
        getOAuthUrlSalesforce(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                utils_1.safeRedirect(req, res, oauth_1.salesforce.client.code.getUri());
            });
        }
        getOAuthCallbackSalesforce(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                return OAuthRedirect(req, res, yield oauth_1.salesforce.callback(`${config_1.BASE_URL}/auth${req.path}?${querystring_1.stringify(req.query)}`, res.locals));
            });
        }
        getOAuthUrlGitHub(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                utils_1.safeRedirect(req, res, oauth_1.github.client.code.getUri());
            });
        }
        getOAuthCallbackGitHub(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                return OAuthRedirect(req, res, yield oauth_1.github.callback(`${config_1.BASE_URL}/auth${req.path}?${querystring_1.stringify(req.query)}`, res.locals));
            });
        }
        getOAuthUrlMicrosoft(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                utils_1.safeRedirect(req, res, oauth_1.microsoft.client.code.getUri());
            });
        }
        getOAuthCallbackMicrosoft(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                return OAuthRedirect(req, res, yield oauth_1.microsoft.callback(`${config_1.BASE_URL}/auth${req.path}?${querystring_1.stringify(req.query)}`, res.locals));
            });
        }
        getOAuthUrlGoogle(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                utils_1.safeRedirect(req, res, oauth_1.google.client.code.getUri());
            });
        }
        getOAuthCallbackGoogle(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                return OAuthRedirect(req, res, yield oauth_1.google.callback(`${config_1.BASE_URL}/auth${req.path}?${querystring_1.stringify(req.query)}`, res.locals));
            });
        }
        getOAuthUrlFacebook(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                utils_1.safeRedirect(req, res, oauth_1.facebook.client.code.getUri());
            });
        }
        getOAuthCallbackFacebook(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                return OAuthRedirect(req, res, yield oauth_1.facebook.callback(`${config_1.BASE_URL}/auth${req.path}?${querystring_1.stringify(req.query)}`, res.locals));
            });
        }
    };
    __decorate([
        server_4.Get("salesforce"),
        server_4.Wrapper(OAuthRedirector),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], AuthOAuthController.prototype, "getOAuthUrlSalesforce", null);
    __decorate([
        server_4.Get("salesforce/callback"),
        server_4.Wrapper(OAuthRedirector),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], AuthOAuthController.prototype, "getOAuthCallbackSalesforce", null);
    __decorate([
        server_4.Get("github"),
        server_4.Wrapper(OAuthRedirector),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], AuthOAuthController.prototype, "getOAuthUrlGitHub", null);
    __decorate([
        server_4.Get("github/callback"),
        server_4.Wrapper(OAuthRedirector),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], AuthOAuthController.prototype, "getOAuthCallbackGitHub", null);
    __decorate([
        server_4.Get("microsoft"),
        server_4.Wrapper(OAuthRedirector),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], AuthOAuthController.prototype, "getOAuthUrlMicrosoft", null);
    __decorate([
        server_4.Get("microsoft/callback"),
        server_4.Wrapper(OAuthRedirector),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], AuthOAuthController.prototype, "getOAuthCallbackMicrosoft", null);
    __decorate([
        server_4.Get("google"),
        server_4.Wrapper(OAuthRedirector),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], AuthOAuthController.prototype, "getOAuthUrlGoogle", null);
    __decorate([
        server_4.Get("google/callback"),
        server_4.Wrapper(OAuthRedirector),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], AuthOAuthController.prototype, "getOAuthCallbackGoogle", null);
    __decorate([
        server_4.Get("facebook"),
        server_4.Wrapper(OAuthRedirector),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], AuthOAuthController.prototype, "getOAuthUrlFacebook", null);
    __decorate([
        server_4.Get("facebook/callback"),
        server_4.Wrapper(OAuthRedirector),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], AuthOAuthController.prototype, "getOAuthCallbackFacebook", null);
    AuthOAuthController = __decorate([
        server_4.Controller("oauth"),
        server_4.Controller("auth/oauth"),
        server_2.ClassWrapper(server_3.jsonAsyncResponse),
        server_1.ClassOptions({ mergeParams: true })
    ], AuthOAuthController);
    return AuthOAuthController;
})();
exports.AuthOAuthController = AuthOAuthController;
//# sourceMappingURL=oauth.js.map