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
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectEntities = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const crypto_1 = require("crypto");
exports.detectEntities = (text) => __awaiter(void 0, void 0, void 0, function* () {
    const KEY = `googlecloud${crypto_1.createHash("md5")
        .update(text)
        .digest("hex")}.json`;
    if (process.env.NODE_ENV === "development") {
        try {
            const file = yield fs_extra_1.readJson(path_1.join(".", ".cache", KEY));
            if (file)
                return file;
        }
        catch (error) { }
    }
    try {
        const data = (yield axios_1.default.post(`https://language.googleapis.com/v1/documents:analyzeEntities?key=${process.env.NATURAL_LANGUAGE_API_KEY}`, {
            document: {
                content: text,
                type: "PLAIN_TEXT",
            },
            encodingType: "UTF8",
        }, {})).data;
        const result = Object.assign({}, data);
        result.numbers = data.entities.filter((i) => i.type === "NUMBER");
        result.unknowns = data.entities.filter((i) => i.type === "UNKNOWN");
        result.persons = data.entities.filter((i) => i.type === "PERSON");
        result.locations = data.entities.filter((i) => i.type === "LOCATION");
        result.organizations = data.entities.filter((i) => i.type === "ORGANIZATION");
        result.events = data.entities.filter((i) => i.type === "EVENT");
        result.workOfArts = data.entities.filter((i) => i.type === "WORK_OF_ART");
        result.consumerGoods = data.entities.filter((i) => i.type === "CONSUMER_GOOD");
        result.others = data.entities.filter((i) => i.type === "OTHER");
        result.phoneNumbers = data.entities.filter((i) => i.type === "PHONE_NUMBER");
        result.addresses = data.entities.filter((i) => i.type === "ADDRESS");
        result.dates = data.entities.filter((i) => i.type === "DATE");
        result.prices = data.entities.filter((i) => i.type === "PRICE");
        if (process.env.NODE_ENV === "development") {
            yield fs_extra_1.writeJson(path_1.join(".", ".cache", KEY), result);
        }
        return result;
    }
    catch (error) {
        throw new Error("Unable to detect entities in text");
    }
});
//# sourceMappingURL=google-cloud.js.map