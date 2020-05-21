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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fireSingleWebhook = exports.receiveWebhookMessage = exports.queueWebhook = void 0;
const errors_1 = require("@staart/errors");
const redis_1 = require("@staart/redis");
const axios_1 = __importDefault(require("axios"));
const crypto_1 = require("crypto");
const config_1 = require("../../config");
const prisma_1 = require("./prisma");
const WEBHOOK_QUEUE = `${config_1.REDIS_QUEUE_PREFIX}webhooks`;
let queueSetup = false;
const setupQueue = () => __awaiter(void 0, void 0, void 0, function* () {
    if (queueSetup)
        return true;
    const queues = redis_1.redisQueue.listQueuesAsync();
    if ((yield queues).includes(WEBHOOK_QUEUE))
        return (queueSetup = true);
    yield redis_1.redisQueue.createQueueAsync({ qname: WEBHOOK_QUEUE });
    return (queueSetup = true);
});
exports.queueWebhook = (organizationId, webhook, data) => {
    setupQueue()
        .then(() => redis_1.redisQueue.sendMessageAsync({
        qname: WEBHOOK_QUEUE,
        message: JSON.stringify({
            organizationId,
            webhook,
            data,
            tryNumber: 1,
        }),
    }))
        .then(() => { })
        .catch(() => errors_1.logError("Webhook queue", "Unable to queue webhook"));
};
exports.receiveWebhookMessage = () => __awaiter(void 0, void 0, void 0, function* () {
    yield setupQueue();
    const result = yield redis_1.redisQueue.receiveMessageAsync({
        qname: WEBHOOK_QUEUE,
    });
    if ("id" in result) {
        const { organizationId, webhook, data, tryNumber, } = JSON.parse(result.message);
        if (tryNumber && tryNumber > 3) {
            errors_1.logError("Webhook", `Unable to fire: ${organizationId} ${webhook}`);
            return redis_1.redisQueue.deleteMessageAsync({
                qname: WEBHOOK_QUEUE,
                id: result.id,
            });
        }
        try {
            safeFireWebhook(organizationId, webhook, data);
        }
        catch (error) {
            yield redis_1.redisQueue.sendMessageAsync({
                qname: WEBHOOK_QUEUE,
                message: JSON.stringify({
                    organizationId,
                    webhook,
                    data,
                    tryNumber: tryNumber + 1,
                }),
            });
        }
        yield redis_1.redisQueue.deleteMessageAsync({
            qname: WEBHOOK_QUEUE,
            id: result.id,
        });
        exports.receiveWebhookMessage();
    }
});
const safeFireWebhook = (organizationId, webhook, data) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    const webhooksToFire = yield prisma_1.prisma.webhooks.findMany({
        where: { organizationId: parseInt(organizationId), event: webhook },
    });
    try {
        for (var webhooksToFire_1 = __asyncValues(webhooksToFire), webhooksToFire_1_1; webhooksToFire_1_1 = yield webhooksToFire_1.next(), !webhooksToFire_1_1.done;) {
            const hook = webhooksToFire_1_1.value;
            try {
                yield exports.fireSingleWebhook(hook, webhook, data);
            }
            catch (error) { }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (webhooksToFire_1_1 && !webhooksToFire_1_1.done && (_a = webhooksToFire_1.return)) yield _a.call(webhooksToFire_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return;
});
exports.fireSingleWebhook = (webhook, hookType, data) => __awaiter(void 0, void 0, void 0, function* () {
    let secret;
    if (webhook.secret)
        secret = crypto_1.createHmac("sha1", webhook.secret)
            .update(data || "")
            .digest("hex");
    const options = {
        headers: {
            "User-Agent": `${config_1.JWT_ISSUER}-webhook-service`,
            "X-Signature": secret,
            "Content-Type": webhook.contentType,
        },
        data: {
            hookType,
            data,
        },
    };
    const result = yield axios_1.default.post(webhook.url, options);
    if (webhook.id)
        yield prisma_1.prisma.webhooks.update({
            where: { id: webhook.id },
            data: { lastFiredAt: new Date() },
        });
    return result;
});
//# sourceMappingURL=webhooks.js.map