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
exports.setItemInCache = exports.deleteItemFromCache = exports.getItemFromCache = void 0;
const redis_1 = __importDefault(require("@staart/redis"));
const errors_1 = require("@staart/errors");
/**
 * Get an item from Redis cache
 * @param key - Key
 */
exports.getItemFromCache = (key) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield redis_1.default.get(key);
    if (result)
        return JSON.parse(result);
    throw new Error(errors_1.RESOURCE_NOT_FOUND);
});
/**
 * Delete items from Redis cache
 * @param keys - Keys to delete
 */
exports.deleteItemFromCache = (...keys) => __awaiter(void 0, void 0, void 0, function* () {
    return redis_1.default.del(...keys);
});
/**
 * Set a new item in Redis cache
 * @param key - Item key
 * @param value - Item value object
 * @param expiry - Expiry time (defaults to 10 mins)
 */
exports.setItemInCache = (key, value, expiry) => __awaiter(void 0, void 0, void 0, function* () {
    yield redis_1.default.set(key, JSON.stringify(value), [
        "EX",
        expiry ? Math.floor((expiry.getTime() - new Date().getTime()) / 1000) : 600,
    ]);
});
//# sourceMappingURL=cache.js.map