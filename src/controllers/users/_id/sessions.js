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
exports.UserSessionsController = void 0;
const server_1 = require("@staart/server");
const server_2 = require("@staart/server");
const server_3 = require("@staart/server");
const messages_1 = require("@staart/messages");
const server_4 = require("@staart/server");
const validate_1 = require("@staart/validate");
const middleware_1 = require("../../../_staart/helpers/middleware");
const utils_1 = require("../../../_staart/helpers/utils");
const user_1 = require("../../../_staart/rest/user");
let UserSessionsController = /** @class */ (() => {
    let UserSessionsController = class UserSessionsController {
        getUserSessions(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.userUsernameToId(req.params.id, res.locals.token.id);
                validate_1.joiValidate({ id: validate_1.Joi.string().required() }, { id });
                return user_1.getUserSessionsForUser(res.locals.token.id, id, req.query);
            });
        }
        getUserSession(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.userUsernameToId(req.params.id, res.locals.token.id);
                const sessionId = req.params.sessionId;
                validate_1.joiValidate({
                    id: validate_1.Joi.string().required(),
                    sessionId: validate_1.Joi.string().required(),
                }, { id, sessionId });
                return user_1.getUserSessionForUser(res.locals.token.id, id, sessionId);
            });
        }
        deleteUserSession(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.userUsernameToId(req.params.id, res.locals.token.id);
                const sessionId = req.params.sessionId;
                validate_1.joiValidate({
                    id: validate_1.Joi.string().required(),
                    sessionId: validate_1.Joi.string().required(),
                }, { id, sessionId });
                yield user_1.deleteSessionForUser(res.locals.token.id, id, sessionId, res.locals);
                return messages_1.respond(messages_1.RESOURCE_DELETED);
            });
        }
    };
    __decorate([
        server_4.Get(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], UserSessionsController.prototype, "getUserSessions", null);
    __decorate([
        server_4.Get(":sessionId"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], UserSessionsController.prototype, "getUserSession", null);
    __decorate([
        server_4.Delete(":sessionId"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], UserSessionsController.prototype, "deleteUserSession", null);
    UserSessionsController = __decorate([
        server_4.ClassMiddleware(middleware_1.authHandler),
        server_4.Controller("users/:id/sessions"),
        server_2.ClassWrapper(server_3.jsonAsyncResponse),
        server_1.ClassOptions({ mergeParams: true })
    ], UserSessionsController);
    return UserSessionsController;
})();
exports.UserSessionsController = UserSessionsController;
//# sourceMappingURL=sessions.js.map