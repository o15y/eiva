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
exports.OrganizationMeetingsController = void 0;
const server_1 = require("@staart/server");
const server_2 = require("@staart/server");
const server_3 = require("@staart/server");
const messages_1 = require("@staart/messages");
const server_4 = require("@staart/server");
const validate_1 = require("@staart/validate");
const middleware_1 = require("../../../_staart/helpers/middleware");
const utils_1 = require("../../../_staart/helpers/utils");
const meetings_1 = require("../../../ara/services/crud/meetings");
let OrganizationMeetingsController = /** @class */ (() => {
    let OrganizationMeetingsController = class OrganizationMeetingsController {
        getOrganizationMeetings(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.organizationUsernameToId(req.params.id);
                validate_1.joiValidate({ id: validate_1.Joi.string().required() }, { id });
                return meetings_1.getAllMeetingsForOrganization(utils_1.localsToTokenOrKey(res), id, req.query);
            });
        }
        getOrganizationMeeting(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.organizationUsernameToId(req.params.id);
                const meetingId = req.params.meetingId;
                validate_1.joiValidate({
                    id: validate_1.Joi.string().required(),
                    meetingId: validate_1.Joi.string().required(),
                }, { id, meetingId });
                return meetings_1.getMeetingForOrganization(utils_1.localsToTokenOrKey(res), id, meetingId);
            });
        }
        patchOrganizationMeeting(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.organizationUsernameToId(req.params.id);
                const meetingId = req.params.meetingId;
                validate_1.joiValidate({
                    id: validate_1.Joi.string().required(),
                    meetingId: validate_1.Joi.string().required(),
                }, { id, meetingId });
                const updated = yield meetings_1.updateMeetingForOrganization(utils_1.localsToTokenOrKey(res), id, meetingId, req.body);
                return Object.assign(Object.assign({}, messages_1.respond(messages_1.RESOURCE_UPDATED)), { updated });
            });
        }
        deleteOrganizationMeeting(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.organizationUsernameToId(req.params.id);
                const meetingId = req.params.meetingId;
                validate_1.joiValidate({
                    id: validate_1.Joi.string().required(),
                    meetingId: validate_1.Joi.string().required(),
                }, { id, meetingId });
                yield meetings_1.deleteMeetingForOrganization(utils_1.localsToTokenOrKey(res), id, meetingId);
                return messages_1.respond(messages_1.RESOURCE_DELETED);
            });
        }
        getOrganizationMeetingEmails(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.organizationUsernameToId(req.params.id);
                const meetingId = req.params.meetingId;
                validate_1.joiValidate({
                    id: validate_1.Joi.string().required(),
                    meetingId: validate_1.Joi.string().required(),
                }, { id, meetingId });
                return meetings_1.getMeetingIncomingEmailsForOrganization(utils_1.localsToTokenOrKey(res), id, meetingId, req.query);
            });
        }
        getOrganizationMeetingEmail(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.organizationUsernameToId(req.params.id);
                const meetingId = req.params.meetingId;
                const emailId = req.params.emailId;
                validate_1.joiValidate({
                    id: validate_1.Joi.string().required(),
                    meetingId: validate_1.Joi.string().required(),
                    emailId: validate_1.Joi.string().required(),
                }, { id, meetingId, emailId });
                return meetings_1.getMeetingIncomingEmailForOrganization(utils_1.localsToTokenOrKey(res), id, meetingId, emailId);
            });
        }
    };
    __decorate([
        server_4.Get(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationMeetingsController.prototype, "getOrganizationMeetings", null);
    __decorate([
        server_4.Get(":meetingId"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationMeetingsController.prototype, "getOrganizationMeeting", null);
    __decorate([
        server_4.Patch(":meetingId"),
        server_4.Middleware(middleware_1.validator({
            proposedTimes: validate_1.Joi.string(),
            confirmedTime: validate_1.Joi.string(),
            duration: validate_1.Joi.number(),
            meetingType: validate_1.Joi.string(),
            guests: validate_1.Joi.string(),
            location: validate_1.Joi.object(),
        }, "body")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationMeetingsController.prototype, "patchOrganizationMeeting", null);
    __decorate([
        server_4.Delete(":meetingId"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationMeetingsController.prototype, "deleteOrganizationMeeting", null);
    __decorate([
        server_4.Get(":meetingId/emails"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationMeetingsController.prototype, "getOrganizationMeetingEmails", null);
    __decorate([
        server_4.Get(":meetingId/emails/:emailId"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationMeetingsController.prototype, "getOrganizationMeetingEmail", null);
    OrganizationMeetingsController = __decorate([
        server_4.ClassMiddleware(middleware_1.authHandler),
        server_4.Controller("organizations/:id/meetings"),
        server_2.ClassWrapper(server_3.jsonAsyncResponse),
        server_1.ClassOptions({ mergeParams: true })
    ], OrganizationMeetingsController);
    return OrganizationMeetingsController;
})();
exports.OrganizationMeetingsController = OrganizationMeetingsController;
//# sourceMappingURL=meetings.js.map