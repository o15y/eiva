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
exports.AdminController = void 0;
const server_1 = require("@staart/server");
const server_2 = require("@staart/server");
const server_3 = require("@staart/server");
const errors_1 = require("@staart/errors");
const server_4 = require("@staart/server");
const middleware_1 = require("../../_staart/helpers/middleware");
const admin_1 = require("../../_staart/rest/admin");
let AdminController = /** @class */ (() => {
    let AdminController = class AdminController {
        getOrganizations(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const userId = res.locals.token.id;
                if (!userId)
                    throw new Error(errors_1.MISSING_FIELD);
                return admin_1.getAllOrganizationForUser(userId, req.query);
            });
        }
        getUsers(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const userId = res.locals.token.id;
                if (!userId)
                    throw new Error(errors_1.MISSING_FIELD);
                return admin_1.getAllUsersForUser(userId, req.query);
            });
        }
        getServerLogs(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const userId = res.locals.token.id;
                if (!userId)
                    throw new Error(errors_1.MISSING_FIELD);
                return admin_1.getServerLogsForUser(userId, req.query);
            });
        }
        getPaymentEvents(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const userId = res.locals.token.id;
                if (!userId)
                    throw new Error(errors_1.MISSING_FIELD);
                return admin_1.getPaymentEventsForUser(userId, req.query);
            });
        }
        info() {
            return __awaiter(this, void 0, void 0, function* () {
                return {
                    success: true,
                    message: "admin-info-success",
                };
            });
        }
    };
    __decorate([
        server_4.Get("organizations"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], AdminController.prototype, "getOrganizations", null);
    __decorate([
        server_4.Get("users"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], AdminController.prototype, "getUsers", null);
    __decorate([
        server_4.Get("server-logs"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], AdminController.prototype, "getServerLogs", null);
    __decorate([
        server_4.Get("payment-events"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], AdminController.prototype, "getPaymentEvents", null);
    __decorate([
        server_4.Get("info"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], AdminController.prototype, "info", null);
    AdminController = __decorate([
        server_4.ClassMiddleware(middleware_1.authHandler),
        server_4.Controller("admin"),
        server_2.ClassWrapper(server_3.jsonAsyncResponse),
        server_1.ClassOptions({ mergeParams: true })
    ], AdminController);
    return AdminController;
})();
exports.AdminController = AdminController;
//# sourceMappingURL=index.js.map