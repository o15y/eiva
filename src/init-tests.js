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
const errors_1 = require("@staart/errors");
const mail_1 = require("@staart/mail");
const redis_1 = __importDefault(require("@staart/redis"));
const systeminformation_1 = __importDefault(require("systeminformation"));
const package_json_1 = __importDefault(require("../package.json"));
const config_1 = require("./config");
const elasticsearch_1 = require("./_staart/helpers/elasticsearch");
const mail_2 = require("./_staart/helpers/mail");
const prisma_1 = require("./_staart/helpers/prisma");
const elasticsearch_2 = require("@staart/elasticsearch");
const payments_1 = require("@staart/payments");
let numberOfFailedTests = 0;
class Redis {
    constructor() {
        this.name = "Redis";
    }
    test() {
        return __awaiter(this, void 0, void 0, function* () {
            yield redis_1.default.set(package_json_1.default.name, systeminformation_1.default.time().current);
            yield redis_1.default.del(package_json_1.default.name);
        });
    }
}
class RedisQueue {
    constructor() {
        this.name = "Redis Message Queue";
    }
    test() {
        return __awaiter(this, void 0, void 0, function* () {
            yield mail_2.receiveEmailMessage();
        });
    }
}
class Database {
    constructor() {
        this.name = "Database connection";
    }
    test() {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma_1.prisma.users.findMany({ first: 1 });
        });
    }
}
class Stripe {
    constructor() {
        this.name = "Stripe";
    }
    test() {
        return __awaiter(this, void 0, void 0, function* () {
            const prices = yield payments_1.getProductPricing();
            errors_1.success(`Got ${prices.data.length} pricing plans`);
        });
    }
}
class Email {
    constructor() {
        this.name = "Email";
    }
    test() {
        return __awaiter(this, void 0, void 0, function* () {
            mail_1.setupTransporter();
            yield mail_1.sendMail({
                to: config_1.TEST_EMAIL,
                subject: "Test from Staart",
                message: `This is an example email to test your Staart email configuration.\n\n${JSON.stringify({
                    time: systeminformation_1.default.time(),
                    package: {
                        name: package_json_1.default.name,
                        version: package_json_1.default.version,
                        repository: package_json_1.default.repository,
                        author: package_json_1.default.author,
                        "staart-version": package_json_1.default["staart-version"],
                    },
                })}`,
            });
        });
    }
}
class ElasticSearch {
    constructor() {
        this.name = "ElasticSearch";
    }
    test() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!elasticsearch_2.elasticSearchEnabled) {
                errors_1.warn("ElasticSearch is disabled");
                return;
            }
            yield elasticsearch_1.elasticSearchIndex({
                index: config_1.ELASTIC_INSTANCES_INDEX,
                body: {
                    name: package_json_1.default.name,
                    version: package_json_1.default.version,
                    repository: package_json_1.default.repository,
                    author: package_json_1.default.author,
                    "staart-version": package_json_1.default["staart-version"],
                },
            });
        });
    }
}
const runTests = () => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    try {
        for (var _b = __asyncValues([
            Redis,
            RedisQueue,
            Database,
            Email,
            Stripe,
            ElasticSearch,
        ]), _c; _c = yield _b.next(), !_c.done;) {
            const TestClass = _c.value;
            const testClass = new TestClass();
            try {
                yield testClass.test();
                errors_1.success(testClass.name, "Test passed");
            }
            catch (error) {
                numberOfFailedTests += 1;
                errors_1.logError(testClass.name, "Test failed", 1);
                console.log(error);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
});
console.log();
runTests()
    .then(() => numberOfFailedTests === 0
    ? errors_1.success("All service tests passed")
    : errors_1.logError("Service tests", "All service tests passed", 1))
    .catch((error) => console.log("ERROR", error))
    .then(() => { var _a; return console.log("\n" + "=".repeat((_a = process.stdout.columns) !== null && _a !== void 0 ? _a : 50) + "\n"); });
//# sourceMappingURL=init-tests.js.map