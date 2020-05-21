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
exports.OrganizationInvoicesController = void 0;
const server_1 = require("@staart/server");
const server_2 = require("@staart/server");
const server_3 = require("@staart/server");
const server_4 = require("@staart/server");
const validate_1 = require("@staart/validate");
const middleware_1 = require("../../../_staart/helpers/middleware");
const utils_1 = require("../../../_staart/helpers/utils");
const organization_1 = require("../../../_staart/rest/organization");
let OrganizationInvoicesController = /** @class */ (() => {
    let OrganizationInvoicesController = class OrganizationInvoicesController {
        getInvoices(req, res) {
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
                return organization_1.getOrganizationInvoicesForUser(utils_1.localsToTokenOrKey(res), organizationId, subscriptionParams);
            });
        }
        getInvoice(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const organizationId = yield utils_1.organizationUsernameToId(req.params.id);
                const invoiceId = req.params.invoiceId;
                validate_1.joiValidate({
                    organizationId: validate_1.Joi.string().required(),
                    invoiceId: validate_1.Joi.string().required(),
                }, { organizationId, invoiceId });
                return organization_1.getOrganizationInvoiceForUser(utils_1.localsToTokenOrKey(res), organizationId, invoiceId);
            });
        }
    };
    __decorate([
        server_4.Get(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationInvoicesController.prototype, "getInvoices", null);
    __decorate([
        server_4.Get(":invoiceId"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationInvoicesController.prototype, "getInvoice", null);
    OrganizationInvoicesController = __decorate([
        server_4.ClassMiddleware(middleware_1.authHandler),
        server_4.Controller("organizations/:id/invoices"),
        server_2.ClassWrapper(server_3.jsonAsyncResponse),
        server_1.ClassOptions({ mergeParams: true })
    ], OrganizationInvoicesController);
    return OrganizationInvoicesController;
})();
exports.OrganizationInvoicesController = OrganizationInvoicesController;
//# sourceMappingURL=invoices.js.map