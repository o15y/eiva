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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClearbitPersonFromEmail = void 0;
const axios_1 = __importDefault(require("axios"));
const CLEARBIT_SECRET_KEY = (_a = process.env.CLEARBIT_SECRET_KEY) !== null && _a !== void 0 ? _a : "";
exports.getClearbitPersonFromEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield axios_1.default.get(`https://person-stream.clearbit.com/v2/combined/find?email=${encodeURIComponent(email)}`, {
        headers: {
            Authorization: `Bearer ${CLEARBIT_SECRET_KEY}`,
        },
    })).data;
});
//# sourceMappingURL=clearbit.js.map