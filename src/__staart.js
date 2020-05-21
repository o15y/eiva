"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("regenerator-runtime");
require("@babel/polyfill");
const app_1 = require("./app");
const config_1 = require("./config");
const node_1 = require("@sentry/node");
require("./init-tests");
if (config_1.SENTRY_DSN)
    node_1.init({ dsn: config_1.SENTRY_DSN });
const staart = new app_1.Staart();
staart.start(config_1.PORT);
//# sourceMappingURL=__staart.js.map