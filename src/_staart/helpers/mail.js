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
exports.mail = exports.receiveEmailMessage = void 0;
const errors_1 = require("@staart/errors");
const mail_1 = require("@staart/mail");
const mustache_markdown_1 = require("@staart/mustache-markdown");
const redis_1 = require("@staart/redis");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const config_1 = require("../../config");
const MAIL_QUEUE = `${config_1.REDIS_QUEUE_PREFIX}outbound-emails`;
let queueSetup = false;
const setupQueue = () => __awaiter(void 0, void 0, void 0, function* () {
    if (queueSetup)
        return true;
    const queues = redis_1.redisQueue.listQueuesAsync();
    if ((yield queues).includes(MAIL_QUEUE))
        return (queueSetup = true);
    yield redis_1.redisQueue.createQueueAsync({ qname: MAIL_QUEUE });
    return (queueSetup = true);
});
exports.receiveEmailMessage = () => __awaiter(void 0, void 0, void 0, function* () {
    yield setupQueue();
    const result = yield redis_1.redisQueue.receiveMessageAsync({
        qname: MAIL_QUEUE,
    });
    if ("id" in result) {
        const params = JSON.parse(result.message);
        if (params.tryNumber && params.tryNumber > 3) {
            errors_1.logError("Email", `Unable to send email: ${params.to}`);
            return redis_1.redisQueue.deleteMessageAsync({
                qname: MAIL_QUEUE,
                id: result.id,
            });
        }
        try {
            yield safeSendEmail(params);
        }
        catch (error) {
            console.log(error);
            yield redis_1.redisQueue.sendMessageAsync({
                qname: MAIL_QUEUE,
                message: JSON.stringify(Object.assign(Object.assign({}, params), { tryNumber: params.tryNumber + 1 })),
            });
        }
        yield redis_1.redisQueue.deleteMessageAsync({
            qname: MAIL_QUEUE,
            id: result.id,
        });
        exports.receiveEmailMessage();
    }
});
/**
 * Send a new email using AWS SES or SMTP
 */
exports.mail = (params1, params2, params3) => __awaiter(void 0, void 0, void 0, function* () {
    yield setupQueue();
    yield redis_1.redisQueue.sendMessageAsync({
        qname: MAIL_QUEUE,
        message: JSON.stringify(params2 && params3
            ? { to: params1, template: params2, data: params3 }
            : params1),
    });
});
const safeSendEmail = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const result = mustache_markdown_1.render((yield fs_extra_1.readFile(path_1.join(__dirname, "..", "..", "..", "..", "src", "templates", `${params.template}.md`))).toString(), Object.assign(Object.assign({}, params.data), { frontendUrl: config_1.FRONTEND_URL }));
    const altText = result[0];
    const message = result[1];
    return mail_1.sendMail(Object.assign({ subject: result[1].split("\n", 1)[0].replace(/<\/?[^>]+(>|$)/g, ""), message,
        altText }, params));
});
//# sourceMappingURL=mail.js.map