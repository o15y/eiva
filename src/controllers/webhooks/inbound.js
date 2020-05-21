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
exports.InboundWebhooksController = void 0;
const server_1 = require("@staart/server");
const server_2 = require("@staart/server");
const server_3 = require("@staart/server");
const server_4 = require("@staart/server");
const rest_1 = require("../../ara/rest");
const validate_1 = require("@staart/validate");
let InboundWebhooksController = /** @class */ (() => {
    let InboundWebhooksController = class InboundWebhooksController {
        lambdaWebhook(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const secret = (req.get("Authorization") || "").replace("Bearer ", "") ||
                    req.query.secret;
                validate_1.joiValidate({ secret: validate_1.Joi.string().required(), objectId: validate_1.Joi.string().required() }, { secret, objectId: req.params.objectId });
                return rest_1.processIncomingEmail(secret, req.params.objectId);
            });
        }
    };
    __decorate([
        server_4.Get("email/:objectId"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], InboundWebhooksController.prototype, "lambdaWebhook", null);
    InboundWebhooksController = __decorate([
        server_4.Controller("webhooks/inbound"),
        server_2.ClassWrapper(server_3.jsonAsyncResponse),
        server_1.ClassOptions({ mergeParams: true })
    ], InboundWebhooksController);
    return InboundWebhooksController;
})();
exports.InboundWebhooksController = InboundWebhooksController;
//# sourceMappingURL=inbound.js.map