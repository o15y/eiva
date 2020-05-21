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
exports.OrganizationSubscriptionsController = void 0;
const server_1 = require("@staart/server");
const server_2 = require("@staart/server");
const server_3 = require("@staart/server");
const messages_1 = require("@staart/messages");
const server_4 = require("@staart/server");
const validate_1 = require("@staart/validate");
const middleware_1 = require("../../../_staart/helpers/middleware");
const utils_1 = require("../../../_staart/helpers/utils");
const organization_1 = require("../../../_staart/rest/organization");
let OrganizationSubscriptionsController = /** @class */ (() => {
    let OrganizationSubscriptionsController = class OrganizationSubscriptionsController {
        getSubscriptions(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const organizationId = yield utils_1.organizationUsernameToId(req.params.id);
                validate_1.joiValidate({ organizationId: validate_1.Joi.string().required() }, { organizationId });
                const subscriptionParams = Object.assign({}, req.query);
                validate_1.joiValidate({
                    start: validate_1.Joi.string(),
                    billing: validate_1.Joi.string().valid("charge_automatically", "send_invoice"),
                    itemsPerPage: validate_1.Joi.number(),
                    plan: validate_1.Joi.string(),
                    status: validate_1.Joi.string(),
                }, subscriptionParams);
                return organization_1.getOrganizationSubscriptionsForUser(utils_1.localsToTokenOrKey(res), organizationId, subscriptionParams);
            });
        }
        putSubscriptions(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const organizationId = yield utils_1.organizationUsernameToId(req.params.id);
                validate_1.joiValidate({ organizationId: validate_1.Joi.string().required() }, { organizationId });
                const subscriptionParams = Object.assign({}, req.body);
                validate_1.joiValidate({
                    plan: validate_1.Joi.string().required(),
                    billing: validate_1.Joi.string().valid("charge_automatically", "send_invoice"),
                    tax_percent: validate_1.Joi.number(),
                    number_of_seats: validate_1.Joi.number(),
                }, subscriptionParams);
                yield organization_1.createOrganizationSubscriptionForUser(utils_1.localsToTokenOrKey(res), organizationId, subscriptionParams, res.locals);
                return messages_1.respond(messages_1.RESOURCE_CREATED);
            });
        }
        getSubscription(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const organizationId = yield utils_1.organizationUsernameToId(req.params.id);
                const subscriptionId = req.params.subscriptionId;
                validate_1.joiValidate({
                    organizationId: validate_1.Joi.string().required(),
                    subscriptionId: validate_1.Joi.string().required(),
                }, { organizationId, subscriptionId });
                return organization_1.getOrganizationSubscriptionForUser(utils_1.localsToTokenOrKey(res), organizationId, subscriptionId);
            });
        }
        patchSubscription(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const organizationId = yield utils_1.organizationUsernameToId(req.params.id);
                const subscriptionId = req.params.subscriptionId;
                const data = req.body;
                validate_1.joiValidate({
                    organizationId: validate_1.Joi.string().required(),
                    subscriptionId: validate_1.Joi.string().required(),
                }, { organizationId, subscriptionId });
                validate_1.joiValidate({
                    billing: validate_1.Joi.string().valid("charge_automatically", "send_invoice"),
                    cancel_at_period_end: validate_1.Joi.boolean(),
                    coupon: validate_1.Joi.string(),
                    default_source: validate_1.Joi.string(),
                    items: validate_1.Joi.array(),
                    proration_behavior: validate_1.Joi.string(),
                }, data);
                yield organization_1.updateOrganizationSubscriptionForUser(utils_1.localsToTokenOrKey(res), organizationId, subscriptionId, data, res.locals);
                return messages_1.respond(messages_1.RESOURCE_UPDATED);
            });
        }
    };
    __decorate([
        server_4.Get(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationSubscriptionsController.prototype, "getSubscriptions", null);
    __decorate([
        server_4.Put(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationSubscriptionsController.prototype, "putSubscriptions", null);
    __decorate([
        server_4.Get(":subscriptionId"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationSubscriptionsController.prototype, "getSubscription", null);
    __decorate([
        server_4.Patch(":subscriptionId"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationSubscriptionsController.prototype, "patchSubscription", null);
    OrganizationSubscriptionsController = __decorate([
        server_4.ClassMiddleware(middleware_1.authHandler),
        server_4.Controller("organizations/:id/subscriptions"),
        server_2.ClassWrapper(server_3.jsonAsyncResponse),
        server_1.ClassOptions({ mergeParams: true })
    ], OrganizationSubscriptionsController);
    return OrganizationSubscriptionsController;
})();
exports.OrganizationSubscriptionsController = OrganizationSubscriptionsController;
//# sourceMappingURL=subscriptions.js.map