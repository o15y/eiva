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
exports.OrganizationLocationsController = void 0;
const server_1 = require("@staart/server");
const server_2 = require("@staart/server");
const server_3 = require("@staart/server");
const messages_1 = require("@staart/messages");
const server_4 = require("@staart/server");
const validate_1 = require("@staart/validate");
const middleware_1 = require("../../../_staart/helpers/middleware");
const utils_1 = require("../../../_staart/helpers/utils");
const locations_1 = require("../../../ara/services/crud/locations");
let OrganizationLocationsController = /** @class */ (() => {
    let OrganizationLocationsController = class OrganizationLocationsController {
        createOrganizationLocation(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.organizationUsernameToId(req.params.id);
                validate_1.joiValidate({
                    id: validate_1.Joi.string().required(),
                }, { id });
                const added = yield locations_1.createLocationForOrganization(utils_1.localsToTokenOrKey(res), id, req.body);
                return Object.assign(Object.assign({}, messages_1.respond(messages_1.RESOURCE_CREATED)), { added });
            });
        }
        getOrganizationLocations(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.organizationUsernameToId(req.params.id);
                validate_1.joiValidate({ id: validate_1.Joi.string().required() }, { id });
                return locations_1.getAllLocationsForOrganization(utils_1.localsToTokenOrKey(res), id, req.query);
            });
        }
        getOrganizationLocation(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.organizationUsernameToId(req.params.id);
                const locationId = req.params.locationId;
                validate_1.joiValidate({
                    id: validate_1.Joi.string().required(),
                    locationId: validate_1.Joi.string().required(),
                }, { id, locationId });
                return locations_1.getLocationForOrganization(utils_1.localsToTokenOrKey(res), id, locationId);
            });
        }
        patchOrganizationLocation(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.organizationUsernameToId(req.params.id);
                const locationId = req.params.locationId;
                validate_1.joiValidate({
                    id: validate_1.Joi.string().required(),
                    locationId: validate_1.Joi.string().required(),
                }, { id, locationId });
                const updated = yield locations_1.updateLocationForOrganization(utils_1.localsToTokenOrKey(res), id, locationId, req.body);
                return Object.assign(Object.assign({}, messages_1.respond(messages_1.RESOURCE_UPDATED)), { updated });
            });
        }
        deleteOrganizationLocation(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield utils_1.organizationUsernameToId(req.params.id);
                const locationId = req.params.locationId;
                validate_1.joiValidate({
                    id: validate_1.Joi.string().required(),
                    locationId: validate_1.Joi.string().required(),
                }, { id, locationId });
                yield locations_1.deleteLocationForOrganization(utils_1.localsToTokenOrKey(res), id, locationId);
                return messages_1.respond(messages_1.RESOURCE_DELETED);
            });
        }
    };
    __decorate([
        server_4.Put(),
        server_4.Middleware(middleware_1.validator({
            type: validate_1.Joi.string()
                .allow("VIDEO_CALL", "PHONE_CALL", "IN_PERSON")
                .only()
                .required(),
            value: validate_1.Joi.string().required(),
            data: validate_1.Joi.string(),
        }, "body")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationLocationsController.prototype, "createOrganizationLocation", null);
    __decorate([
        server_4.Get(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationLocationsController.prototype, "getOrganizationLocations", null);
    __decorate([
        server_4.Get(":locationId"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationLocationsController.prototype, "getOrganizationLocation", null);
    __decorate([
        server_4.Patch(":locationId"),
        server_4.Middleware(middleware_1.validator({
            type: validate_1.Joi.string()
                .allow("VIDEO_CALL", "PHONE_CALL", "IN_PERSON")
                .only(),
            data: validate_1.Joi.string(),
            value: validate_1.Joi.string(),
        }, "body")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationLocationsController.prototype, "patchOrganizationLocation", null);
    __decorate([
        server_4.Delete(":locationId"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], OrganizationLocationsController.prototype, "deleteOrganizationLocation", null);
    OrganizationLocationsController = __decorate([
        server_4.ClassMiddleware(middleware_1.authHandler),
        server_4.Controller("organizations/:id/locations"),
        server_2.ClassWrapper(server_3.jsonAsyncResponse),
        server_1.ClassOptions({ mergeParams: true })
    ], OrganizationLocationsController);
    return OrganizationLocationsController;
})();
exports.OrganizationLocationsController = OrganizationLocationsController;
//# sourceMappingURL=locations.js.map