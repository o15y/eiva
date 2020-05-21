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
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("@staart/errors");
const cron_1 = require("cron");
const config_1 = require("@staart/config");
const config_2 = require("../config");
const elasticsearch_1 = require("../_staart/helpers/elasticsearch");
const mail_1 = require("../_staart/helpers/mail");
const tracking_1 = require("../_staart/helpers/tracking");
const utils_1 = require("../_staart/helpers/utils");
const webhooks_1 = require("../_staart/helpers/webhooks");
/**
 * We run this cron job every minute in production
 * but every 10 seconds in development
 */
exports.default = () => {
    var _a;
    new cron_1.CronJob(config_1.getConfig("NODE_ENV") === "production"
        ? "* * * * *"
        : (_a = config_1.getConfig("DEV_CRON_MINUTE")) !== null && _a !== void 0 ? _a : "*/10 * * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        yield mail_1.receiveEmailMessage();
        yield elasticsearch_1.receiveElasticSearchMessage();
        yield webhooks_1.receiveWebhookMessage();
        yield storeTrackingLogs();
        yield storeSecurityEvents();
    }), undefined, true);
};
const storeSecurityEvents = () => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    const data = tracking_1.getSecurityEvents();
    if (!data.length)
        return;
    const date = new Date();
    const year = date.getUTCFullYear();
    let month = (date.getUTCMonth() + 1).toString();
    month = parseInt(month) < 10 ? `0${month}` : month;
    let day = (date.getUTCDate() + 1).toString();
    day = parseInt(day) < 10 ? `0${day}` : day;
    try {
        for (var data_1 = __asyncValues(data), data_1_1; data_1_1 = yield data_1.next(), !data_1_1.done;) {
            const body = data_1_1.value;
            if (typeof body === "object") {
                Object.keys(body).forEach((key) => {
                    if (utils_1.IdValues.includes(key))
                        body[key] = body[key];
                });
                if (body.data && typeof body.data === "object") {
                    Object.keys(body.data).forEach((key) => {
                        if (utils_1.IdValues.includes(key))
                            body.data[key] = body.data[key];
                    });
                }
            }
            try {
                yield elasticsearch_1.elasticSearchIndex({
                    index: config_2.ELASTIC_EVENTS_INDEX,
                    body,
                });
            }
            catch (err) {
                errors_1.error("Got error in saving to ElasticSearch", JSON.stringify(err));
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (data_1_1 && !data_1_1.done && (_a = data_1.return)) yield _a.call(data_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    tracking_1.clearSecurityEventsData();
});
const storeTrackingLogs = () => __awaiter(void 0, void 0, void 0, function* () {
    var e_2, _b;
    const data = tracking_1.getTrackingData();
    if (!data.length)
        return;
    const date = new Date();
    const year = date.getUTCFullYear();
    let month = (date.getUTCMonth() + 1).toString();
    month = parseInt(month) < 10 ? `0${month}` : month;
    let day = (date.getUTCDate() + 1).toString();
    day = parseInt(day) < 10 ? `0${day}` : day;
    try {
        for (var data_2 = __asyncValues(data), data_2_1; data_2_1 = yield data_2.next(), !data_2_1.done;) {
            const body = data_2_1.value;
            try {
                if (typeof body === "object") {
                    Object.keys(body).forEach((key) => {
                        if (utils_1.IdValues.includes(key))
                            body[key] = body[key];
                    });
                    if (body.data && typeof body.data === "object") {
                        Object.keys(body.data).forEach((key) => {
                            if (utils_1.IdValues.includes(key))
                                body.data[key] = body.data[key];
                        });
                    }
                }
                yield elasticsearch_1.elasticSearchIndex({
                    index: config_2.ELASTIC_LOGS_INDEX,
                    body,
                });
            }
            catch (err) {
                errors_1.error("Got error in saving to ElasticSearch", JSON.stringify(err));
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (data_2_1 && !data_2_1.done && (_b = data_2.return)) yield _b.call(data_2);
        }
        finally { if (e_2) throw e_2.error; }
    }
    tracking_1.clearTrackingData();
});
//# sourceMappingURL=minute.js.map