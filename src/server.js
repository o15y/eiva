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
exports.Staart = void 0;
const errors_1 = require("@staart/errors");
const server_1 = require("@staart/server");
const server_2 = require("@staart/server");
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
        server_1.Get(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], RootController.prototype, "info", null);
    RootController = __decorate([
        server_1.Controller("v1")
    ], RootController);
    return RootController;
})();
class Staart extends server_1.Server {
    constructor() {
        super();
        this.setupHandlers();
        this.addControllers([new RootController()]);
        this.app.use(middleware_1.errorHandler);
    }
    start(port) {
        this.app.listen(port, () => errors_1.success(`Listening on ${port}`));
    }
    setupHandlers() {
        server_2.setupMiddleware(this.app);
        this.app.use(middleware_1.trackingHandler);
        this.app.use(middleware_1.rateLimitHandler);
        this.app.use(middleware_1.speedLimitHandler);
    }
}
exports.Staart = Staart;
//# sourceMappingURL=server.js.map