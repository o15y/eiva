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
exports.receiveElasticSearchMessage = exports.elasticSearchIndex = void 0;
const elasticsearch_1 = require("@staart/elasticsearch");
const errors_1 = require("@staart/errors");
const redis_1 = require("@staart/redis");
const config_1 = require("../../config");
const ELASTIC_QUEUE = `${config_1.REDIS_QUEUE_PREFIX}es-records`;
let queueSetup = false;
const setupQueue = () => __awaiter(void 0, void 0, void 0, function* () {
    if (queueSetup)
        return true;
    const queues = redis_1.redisQueue.listQueuesAsync();
    if ((yield queues).includes(ELASTIC_QUEUE))
        return (queueSetup = true);
    yield redis_1.redisQueue.createQueueAsync({ qname: ELASTIC_QUEUE });
    return (queueSetup = true);
});
exports.elasticSearchIndex = (indexParams) => __awaiter(void 0, void 0, void 0, function* () {
    yield setupQueue();
    yield redis_1.redisQueue.sendMessageAsync({
        qname: ELASTIC_QUEUE,
        message: JSON.stringify({ indexParams, tryNumber: 1 }),
    });
});
exports.receiveElasticSearchMessage = () => __awaiter(void 0, void 0, void 0, function* () {
    yield setupQueue();
    const result = yield redis_1.redisQueue.receiveMessageAsync({
        qname: ELASTIC_QUEUE,
    });
    if ("id" in result) {
        if (!elasticsearch_1.elasticSearchEnabled)
            return redis_1.redisQueue.deleteMessageAsync({
                qname: ELASTIC_QUEUE,
                id: result.id,
            });
        const { indexParams, tryNumber, } = JSON.parse(result.message);
        if (tryNumber && tryNumber > 3)
            return redis_1.redisQueue.deleteMessageAsync({
                qname: ELASTIC_QUEUE,
                id: result.id,
            });
        try {
            yield elasticsearch_1.elasticSearch.index(indexParams);
        }
        catch (error) {
            errors_1.logError("ElasticSearch", `Unable to save record, trying again: ${JSON.stringify(error)}`);
            yield redis_1.redisQueue.sendMessageAsync({
                qname: ELASTIC_QUEUE,
                message: JSON.stringify({
                    indexParams,
                    tryNumber: tryNumber + 1,
                }),
            });
        }
        yield redis_1.redisQueue.deleteMessageAsync({
            qname: ELASTIC_QUEUE,
            id: result.id,
        });
        exports.receiveElasticSearchMessage();
    }
});
//# sourceMappingURL=elasticsearch.js.map