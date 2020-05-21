"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginatedResult = exports.queryParamsToSelect = exports.prisma = void 0;
const client_1 = require("@prisma/client");
const server_1 = require("@staart/server");
const errors_1 = require("@staart/errors");
const config_1 = require("@staart/config");
exports.prisma = new client_1.PrismaClient({
    log: config_1.getConfig("NODE_ENV") === "production" ? ["warn"] : ["info", "warn"],
});
server_1.cleanup(() => {
    errors_1.complete("Gracefully exiting Staart API app");
    exports.prisma.disconnect().then(() => errors_1.success("Disconnected database connection"));
});
exports.queryParamsToSelect = (queryParams) => {
    const data = {};
    ["first", "last", "skip"].forEach((i) => {
        if (typeof queryParams[i] === "string" &&
            !isNaN(parseInt(queryParams[i]))) {
            data[i] = parseInt(queryParams[i]);
        }
    });
    ["before", "after"].forEach((i) => {
        if (typeof queryParams[i] === "string" &&
            !isNaN(parseInt(queryParams[i]))) {
            data[i] = {
                id: parseInt(queryParams[i]),
            };
        }
    });
    ["select", "include"].forEach((i) => {
        if (typeof queryParams[i] === "string") {
            queryParams[i]
                .split(",")
                .map((j) => j.trim())
                .forEach((j) => {
                data[i] = data[i] || {};
                data[i][j] = true;
            });
        }
    });
    const orderBy = queryParams.orderBy;
    if (typeof orderBy === "string") {
        const orders = orderBy.split(",").map((i) => i.trim());
        orders.forEach((order) => {
            data.orderBy = data.orderBy || {};
            data.orderBy[order.split(":")[0]] =
                order.includes(":") && order.split(":")[1] === "desc" ? "desc" : "asc";
        });
    }
    return data;
};
exports.paginatedResult = (data, { first, last }) => {
    const dataArray = data;
    const hasMore = dataArray.length >= (first || last || Infinity);
    return {
        data,
        hasMore,
        next: hasMore ? dataArray[dataArray.length - 1].id : undefined,
    };
};
//# sourceMappingURL=prisma.js.map