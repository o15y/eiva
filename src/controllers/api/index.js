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
exports.ApiController = void 0;
const server_1 = require("@staart/server");
const server_2 = require("@staart/server");
const server_3 = require("@staart/server");
const server_4 = require("@staart/server");
const validate_1 = require("@staart/validate");
const middleware_1 = require("../../_staart/helpers/middleware");
const classify_1 = require("../../ara/services/classify");
const tokenize_1 = require("../../ara/services/tokenize");
const parse_1 = require("../../ara/services/parse");
const rest_1 = require("../../ara/rest");
const confirm_meeting_1 = require("../../ara/services/crud/confirm-meeting");
let ApiController = /** @class */ (() => {
    let ApiController = class ApiController {
        classify(req) {
            return __awaiter(this, void 0, void 0, function* () {
                const text = req.body.text;
                validate_1.joiValidate({ text: validate_1.Joi.array().required() }, { text });
                return classify_1.classifyTokens(text, () => { });
            });
        }
        parseEmail(req) {
            return __awaiter(this, void 0, void 0, function* () {
                const text = req.body.text;
                validate_1.joiValidate({ text: validate_1.Joi.array().required() }, { text });
                return parse_1.parseEmail(text);
            });
        }
        smartTokenize(req) {
            return __awaiter(this, void 0, void 0, function* () {
                const text = req.body.text;
                const from = req.body.from;
                validate_1.joiValidate({ text: validate_1.Joi.string().required(), from: validate_1.Joi.object() }, { text, from });
                return tokenize_1.smartTokensFromText(text, from);
            });
        }
        performAction(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const token = res.locals.token;
                const text = req.body.text;
                const organizationId = token.organizationId;
                validate_1.joiValidate({
                    text: validate_1.Joi.string().required(),
                    organizationId: validate_1.Joi.string().required(),
                }, { text, organizationId });
                return {};
                // return performAction(organizationId, req.body, text, () => {});
            });
        }
        readReceiptEmail(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const token = req.query.token;
                rest_1.trackOutgoingEmail(token)
                    .then(() => { })
                    .catch(() => { });
                res.writeHead(200, { "Content-Type": "image/gif" });
                res.end(Buffer.from("R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=", "base64"), "binary");
            });
        }
        getMeetingDetails(req) {
            return __awaiter(this, void 0, void 0, function* () {
                return rest_1.getPublicMeetingDetails(req.params.username, req.params.id, req.query.jwt);
            });
        }
        confirmMeeting(req) {
            return __awaiter(this, void 0, void 0, function* () {
                return confirm_meeting_1.confirmMeetingForGuest(req.params.organizaionId, req.params.meetingId, req.body);
            });
        }
        track(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const index = req.params.index;
                const data = req.body;
                validate_1.joiValidate({
                    index: validate_1.Joi.string().required(),
                    data: validate_1.Joi.object().required(),
                }, { index, data });
                rest_1.trackAnalyticsEvent(res.locals, index, data)
                    .then(() => { })
                    .catch(() => { });
                return { queued: true };
            });
        }
    };
    __decorate([
        server_4.Post("classify"),
        server_4.Middleware(middleware_1.authHandler),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], ApiController.prototype, "classify", null);
    __decorate([
        server_4.Post("parse-email"),
        server_4.Middleware(middleware_1.authHandler),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], ApiController.prototype, "parseEmail", null);
    __decorate([
        server_4.Post("smart-tokenize"),
        server_4.Middleware(middleware_1.authHandler),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], ApiController.prototype, "smartTokenize", null);
    __decorate([
        server_4.Post("perform-action"),
        server_4.Middleware(middleware_1.authHandler),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], ApiController.prototype, "performAction", null);
    __decorate([
        server_4.Get("read-receipt"),
        server_4.Middleware(middleware_1.validator({ token: validate_1.Joi.string() }, "query")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], ApiController.prototype, "readReceiptEmail", null);
    __decorate([
        server_4.Get("meeting-page/:username/:id"),
        server_4.Middleware(middleware_1.validator({ username: validate_1.Joi.string().required(), id: validate_1.Joi.string().required() }, "params")),
        server_4.Middleware(middleware_1.validator({ jwt: validate_1.Joi.string().required() }, "query")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], ApiController.prototype, "getMeetingDetails", null);
    __decorate([
        server_4.Get("confirm-meeting/:organizaionId/:meetingId"),
        server_4.Middleware(middleware_1.validator({
            token: validate_1.Joi.string().required(),
            guestName: validate_1.Joi.string().required(),
            guestEmail: validate_1.Joi.string().required(),
            guestTimezone: validate_1.Joi.string().required(),
            duration: validate_1.Joi.number().required(),
            selectedDatetime: validate_1.Joi.any().required(),
        }, "body")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], ApiController.prototype, "confirmMeeting", null);
    __decorate([
        server_4.Post("track/:index"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], ApiController.prototype, "track", null);
    ApiController = __decorate([
        server_4.Controller("api"),
        server_2.ClassWrapper(server_3.jsonAsyncResponse),
        server_1.ClassOptions({ mergeParams: true })
    ], ApiController);
    return ApiController;
})();
exports.ApiController = ApiController;
//# sourceMappingURL=index.js.map