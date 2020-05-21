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
exports.UserController = void 0;
const server_1 = require("@staart/server");
const server_2 = require("@staart/server");
const server_3 = require("@staart/server");
const messages_1 = require("@staart/messages");
const server_4 = require("@staart/server");
const validate_1 = require("@staart/validate");
const middleware_1 = require("../../../_staart/helpers/middleware");
const utils_1 = require("../../../_staart/helpers/utils");
const user_1 = require("../../../_staart/rest/user");
let UserController = /** @class */ (() => {
    let UserController = class UserController {
        get(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.userUsernameToId(req.params.id, res.locals.token.id);
                validate_1.joiValidate({ id: validate_1.Joi.string().required() }, { id });
                return user_1.getUserFromIdForUser(id, res.locals.token.id, req.query);
            });
        }
        patch(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.userUsernameToId(req.params.id, res.locals.token.id);
                validate_1.joiValidate({ id: validate_1.Joi.string().required() }, { id });
                const updated = yield user_1.updateUserForUser(res.locals.token.id, id, req.body, res.locals);
                return Object.assign(Object.assign({}, messages_1.respond(messages_1.RESOURCE_UPDATED)), { updated });
            });
        }
        delete(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.userUsernameToId(req.params.id, res.locals.token.id);
                validate_1.joiValidate({ id: validate_1.Joi.string().required() }, { id });
                yield user_1.deleteUserForUser(res.locals.token.id, id, res.locals);
                return messages_1.respond(messages_1.RESOURCE_DELETED);
            });
        }
    };
    __decorate([
        server_4.Get(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], UserController.prototype, "get", null);
    __decorate([
        server_4.Patch(),
        server_4.Middleware(middleware_1.validator({
            name: validate_1.Joi.string()
                .min(3)
                .regex(/^[a-zA-Z ]*$/),
            username: validate_1.Joi.string().regex(/^[a-z0-9\-]+$/i),
            nickname: validate_1.Joi.string(),
            primaryEmail: [validate_1.Joi.string(), validate_1.Joi.number()],
            countryCode: validate_1.Joi.string().length(2),
            password: validate_1.Joi.string().min(6),
            gender: validate_1.Joi.string()
                .allow("MALE", "FEMALE", "NONBINARY", "UNKNOWN")
                .only(),
            timezone: validate_1.Joi.string(),
            notificationEmails: validate_1.Joi.string()
                .allow("ACCOUNT", "UPDATES", "PROMOTIONS")
                .only(),
            prefersLanguage: validate_1.Joi.string().min(2).max(5),
            prefersReducedMotion: validate_1.Joi.string()
                .allow("NO_PREFERENCE", "REDUCE")
                .only(),
            prefersColorScheme: validate_1.Joi.string()
                .allow("NO_PREFERENCE", "LIGHT", "DARK")
                .only(),
            profilePicture: validate_1.Joi.string(),
            checkLocationOnLogin: validate_1.Joi.boolean(),
        }, "body")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], UserController.prototype, "patch", null);
    __decorate([
        server_4.Delete(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], UserController.prototype, "delete", null);
    UserController = __decorate([
        server_4.ClassMiddleware(middleware_1.authHandler),
        server_4.Controller("users/:id"),
        server_2.ClassWrapper(server_3.jsonAsyncResponse),
        server_1.ClassOptions({ mergeParams: true })
    ], UserController);
    return UserController;
})();
exports.UserController = UserController;
//# sourceMappingURL=index.js.map