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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Staart = void 0;
const daily_1 = __importDefault(require("./crons/daily"));
const hourly_1 = __importDefault(require("./crons/hourly"));
const minute_1 = __importDefault(require("./crons/minute"));
daily_1.default();
hourly_1.default();
minute_1.default();
const coupons_1 = require("./controllers/admin/coupons");
const index_1 = require("./controllers/admin/index");
const index_2 = require("./controllers/auth/index");
const oauth_1 = require("./controllers/auth/oauth");
const inbound_1 = require("./controllers/webhooks/inbound");
const index_3 = require("./controllers/webhooks/index");
const index_4 = require("./controllers/api/index");
const index_5 = require("./controllers/organizations/index");
const api_keys_1 = require("./controllers/organizations/_id/api-keys");
const billing_1 = require("./controllers/organizations/_id/billing");
const domains_1 = require("./controllers/organizations/_id/domains");
const index_6 = require("./controllers/organizations/_id/index");
const invoices_1 = require("./controllers/organizations/_id/invoices");
const locations_1 = require("./controllers/organizations/_id/locations");
const meetings_1 = require("./controllers/organizations/_id/meetings");
const memberships_1 = require("./controllers/organizations/_id/memberships");
const sources_1 = require("./controllers/organizations/_id/sources");
const subscriptions_1 = require("./controllers/organizations/_id/subscriptions");
const transactions_1 = require("./controllers/organizations/_id/transactions");
const webhooks_1 = require("./controllers/organizations/_id/webhooks");
const access_tokens_1 = require("./controllers/users/_id/access-tokens");
const emails_1 = require("./controllers/users/_id/emails");
const identities_1 = require("./controllers/users/_id/identities");
const index_7 = require("./controllers/users/_id/index");
const memberships_2 = require("./controllers/users/_id/memberships");
const security_1 = require("./controllers/users/_id/security");
const sessions_1 = require("./controllers/users/_id/sessions");
const server_1 = require("@staart/server");
const server_2 = require("@staart/server");
const server_3 = require("@staart/server");
const errors_1 = require("@staart/errors");
const server_4 = require("@staart/server");
const server_5 = require("@staart/server");
const middleware_1 = require("./_staart/helpers/middleware");
let RootController = /** @class */ (() => {
    let RootController = class RootController {
        info() {
            return __awaiter(this, void 0, void 0, function* () {
                return {
                    repository: "https://github.com/staart/api",
                    docs: "https://staart.js.org",
                    madeBy: ["https://o15y.com", "https://anandchowdhary.com"],
                };
            });
        }
    };
    __decorate([
        server_4.Get(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], RootController.prototype, "info", null);
    RootController = __decorate([
        server_4.Controller("v1"),
        server_2.ClassWrapper(server_3.jsonAsyncResponse),
        server_1.ChildControllers([new coupons_1.AdminCouponController(), new index_1.AdminController(), new index_2.AuthController(), new oauth_1.AuthOAuthController(), new inbound_1.InboundWebhooksController(), new index_3.WebhooksController(), new index_4.ApiController(), new index_5.OrganizationController(), new api_keys_1.OrganizationApiKeysController(), new billing_1.OrganizationBillingController(), new domains_1.OrganizationDomainsController(), new index_6.OrganizationController(), new invoices_1.OrganizationInvoicesController(), new locations_1.OrganizationLocationsController(), new meetings_1.OrganizationMeetingsController(), new memberships_1.OrganizationMembershipsController(), new sources_1.OrganizationSourcesController(), new subscriptions_1.OrganizationSubscriptionsController(), new transactions_1.OrganizationTransactionsController(), new webhooks_1.OrganizationWebhooksController(), new access_tokens_1.UserAccessTokensController(), new emails_1.UserEmailsController(), new identities_1.UserIdentitiesController(), new index_7.UserController(), new memberships_2.UserMembershipsController(), new security_1.UserSecurityController(), new sessions_1.UserSessionsController()])
    ], RootController);
    return RootController;
})();
class Staart extends server_4.Server {
    constructor() {
        super();
        this.app.get("/favicon.ico", (req, res) => res.sendFile("/home/runner/work/ara/ara/.staart/static/favicon.ico"));
        this.app.get("/robots.txt", (req, res) => res.sendFile("/home/runner/work/ara/ara/.staart/static/robots.txt"));
        this.setupHandlers();
        this.addControllers([new RootController()]);
        this.app.use(middleware_1.errorHandler);
    }
    start(port) {
        this.app.listen(port, () => errors_1.success(`Listening on ${port}`));
    }
    setupHandlers() {
        server_5.setupMiddleware(this.app);
        this.app.use(middleware_1.trackingHandler);
        this.app.use(middleware_1.rateLimitHandler);
        this.app.use(middleware_1.speedLimitHandler);
    }
}
exports.Staart = Staart;
//# sourceMappingURL=app.js.map