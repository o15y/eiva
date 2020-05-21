"use strict";
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
const text_1 = require("@staart/text");
const cron_1 = require("cron");
const config_1 = require("../config");
const prisma_1 = require("../_staart/helpers/prisma");
exports.default = () => {
    new cron_1.CronJob("0 * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        yield deleteExpiredSessions();
    }), undefined, true);
};
const deleteExpiredSessions = () => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.prisma.sessions.deleteMany({
        where: {
            createdAt: {
                lte: new Date(new Date().getTime() - text_1.ms(config_1.TOKEN_EXPIRY_REFRESH)),
            },
        },
    });
});
//# sourceMappingURL=hourly.js.map