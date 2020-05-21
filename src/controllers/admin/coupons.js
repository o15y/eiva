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
exports.AdminCouponController = void 0;
const server_1 = require("@staart/server");
const server_2 = require("@staart/server");
const server_3 = require("@staart/server");
const errors_1 = require("@staart/errors");
const messages_1 = require("@staart/messages");
const server_4 = require("@staart/server");
const validate_1 = require("@staart/validate");
const middleware_1 = require("../../_staart/helpers/middleware");
const admin_1 = require("../../_staart/rest/admin");
let AdminCouponController = /** @class */ (() => {
    let AdminCouponController = class AdminCouponController {
        getCoupons(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const userId = res.locals.token.id;
                if (!userId)
                    throw new Error(errors_1.MISSING_FIELD);
                return admin_1.getAllCouponsForUser(userId, req.query);
            });
        }
        createCoupon(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const userId = res.locals.token.id;
                if (!userId)
                    throw new Error(errors_1.MISSING_FIELD);
                const added = yield admin_1.generateCouponForUser(userId, req.body);
                return Object.assign(Object.assign({}, messages_1.respond(messages_1.RESOURCE_CREATED)), { added });
            });
        }
        getCoupon(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const userId = res.locals.token.id;
                if (!userId)
                    throw new Error(errors_1.MISSING_FIELD);
                return admin_1.getCouponForUser(userId, req.params.id);
            });
        }
        updateCoupon(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const userId = res.locals.token.id;
                if (!userId)
                    throw new Error(errors_1.MISSING_FIELD);
                return admin_1.updateCouponForUser(userId, req.params.id, req.body);
            });
        }
        deleteCoupon(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const userId = res.locals.token.id;
                if (!userId)
                    throw new Error(errors_1.MISSING_FIELD);
                return admin_1.deleteCouponForUser(userId, req.params.id);
            });
        }
    };
    __decorate([
        server_4.Get(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], AdminCouponController.prototype, "getCoupons", null);
    __decorate([
        server_4.Put(),
        server_4.Middleware(middleware_1.validator({
            code: validate_1.Joi.string(),
            teamRestrictions: validate_1.Joi.string(),
            amount: validate_1.Joi.number().required(),
            currency: validate_1.Joi.string().min(3).max(3).required(),
            description: validate_1.Joi.string(),
            jwt: validate_1.Joi.boolean(),
            expiresAt: validate_1.Joi.any(),
            maxUses: validate_1.Joi.number(),
        }, "body")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], AdminCouponController.prototype, "createCoupon", null);
    __decorate([
        server_4.Get(":id"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], AdminCouponController.prototype, "getCoupon", null);
    __decorate([
        server_4.Patch(":id"),
        server_4.Middleware(middleware_1.validator({
            code: validate_1.Joi.string(),
            amount: validate_1.Joi.number(),
            currency: validate_1.Joi.string().min(3).max(3),
            description: validate_1.Joi.string().allow(null),
            expiresAt: validate_1.Joi.any().allow(null),
            teamRestrictions: validate_1.Joi.string().allow(null),
            maxUses: validate_1.Joi.number().allow(null),
            jwt: validate_1.Joi.boolean(),
        }, "body")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], AdminCouponController.prototype, "updateCoupon", null);
    __decorate([
        server_4.Delete(":id"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], AdminCouponController.prototype, "deleteCoupon", null);
    AdminCouponController = __decorate([
        server_4.ClassMiddleware(middleware_1.authHandler),
        server_4.Controller("admin/coupons"),
        server_2.ClassWrapper(server_3.jsonAsyncResponse),
        server_1.ClassOptions({ mergeParams: true })
    ], AdminCouponController);
    return AdminCouponController;
})();
exports.AdminCouponController = AdminCouponController;
//# sourceMappingURL=coupons.js.map