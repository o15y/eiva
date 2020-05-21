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
exports.OrganizationTransactionsController = void 0;
const server_1 = require("@staart/server");
const server_2 = require("@staart/server");
const server_3 = require("@staart/server");
const server_4 = require("@staart/server");
const validate_1 = require("@staart/validate");
const middleware_1 = require("../../../_staart/helpers/middleware");
const utils_1 = require("../../../_staart/helpers/utils");
const organization_1 = require("../../../_staart/rest/organization");
let OrganizationTransactionsController = /** @class */ (() => {
    let OrganizationTransactionsController = class OrganizationTransactionsController {
        getTransactions(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const organizationId = yield utils_1.organizationUsernameToId(req.params.id);
                validate_1.joiValidate({ organizationId: validate_1.Joi.string().required() }, { organizationId });
                const transactionParams = Object.assign({}, req.query);
                validate_1.joiValidate({
                    start: validate_1.Joi.string(),
                    itemsPerPage: validate_1.Joi.number(),
                }, transactionParams);
                return organization_1.getOrganizationTransactionsForUser(utils_1.localsToTokenOrKey(res), organizationId, transactionParams);
            });
        }
        applyCoupon(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const organizationId = yield utils_1.organizationUsernameToId(req.params.id);
                const couponCode = req.body.couponCode;
                validate_1.joiValidate({
                    organizationId: validate_1.Joi.string().required(),
                    couponCode: validate_1.Joi.string().required(),
                }, { organizationId, couponCode });
                return organization_1.applyCouponToOrganizationForUser(utils_1.localsToTokenOrKey(res), organizationId, couponCode);
            });
        }
        getTransaction(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const organizationId = yield utils_1.organizationUsernameToId(req.params.id);
                const transactionId = req.params.transactionId;
                validate_1.joiValidate({
                    organizationId: validate_1.Joi.string().required(),
                    transactionId: validate_1.Joi.string().required(),
                }, { organizationId, transactionId });
                return organization_1.getOrganizationTransactionForUser(utils_1.localsToTokenOrKey(res), organizationId, transactionId);
            });
        }
    };
    __decorate([
        server_4.Get(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationTransactionsController.prototype, "getTransactions", null);
    __decorate([
        server_4.Put(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationTransactionsController.prototype, "applyCoupon", null);
    __decorate([
        server_4.Get(":transactionId"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationTransactionsController.prototype, "getTransaction", null);
    OrganizationTransactionsController = __decorate([
        server_4.ClassMiddleware(middleware_1.authHandler),
        server_4.Controller("organizations/:id/transactions"),
        server_2.ClassWrapper(server_3.jsonAsyncResponse),
        server_1.ClassOptions({ mergeParams: true })
    ], OrganizationTransactionsController);
    return OrganizationTransactionsController;
})();
exports.OrganizationTransactionsController = OrganizationTransactionsController;
//# sourceMappingURL=transactions.js.map