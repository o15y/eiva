"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ELASTIC_INSTANCES_INDEX = exports.ELASTIC_EVENTS_INDEX = exports.ELASTIC_LOGS_INDEX = exports.ELASTIC_API_VERSION = exports.ELASTIC_LOG = exports.ELASTIC_HOST = exports.AWS_ELASTIC_REGION = exports.AWS_ELASTIC_HOST = exports.AWS_ELASTIC_SECRET_KEY = exports.AWS_ELASTIC_ACCESS_KEY = exports.STRIPE_PRODUCT_ID = exports.STRIPE_WEBHOOK_SECRET = exports.STRIPE_SECRET_KEY = exports.SALESFORCE_CLIENT_SECRET = exports.SALESFORCE_CLIENT_ID = exports.FACEBOOK_CLIENT_SECRET = exports.FACEBOOK_CLIENT_ID = exports.MICROSOFT_CLIENT_SECRET = exports.MICROSOFT_CLIENT_ID = exports.GITHUB_CLIENT_SECRET = exports.GITHUB_CLIENT_ID = exports.GOOGLE_CLIENT_SECRET = exports.GOOGLE_CLIENT_ID = exports.DISALLOW_OPEN_CORS = exports.TOKEN_EXPIRY_API_KEY_MAX = exports.TOKEN_EXPIRY_REFRESH = exports.TOKEN_EXPIRY_APPROVE_LOCATION = exports.TOKEN_EXPIRY_LOGIN = exports.TOKEN_EXPIRY_PASSWORD_RESET = exports.TOKEN_EXPIRY_EMAIL_VERIFICATION = exports.HASH_ID_PREFIX = exports.HASH_IDS = exports.SERVICE_2FA = exports.JWT_ISSUER = exports.JWT_SECRET = exports.EMAIL_PASSWORD = exports.EMAIL_HOST = exports.EMAIL_FROM = exports.SES_SECRET = exports.SES_ACCESS = exports.SES_REGION = exports.SES_EMAIL = exports.TEST_EMAIL = exports.ALLOW_DISPOSABLE_EMAILS = exports.FRONTEND_URL = exports.CACHE_CHECK_PERIOD = exports.CACHE_TTL = exports.REDIS_QUEUE_PREFIX = exports.REDIS_URL = exports.DB_TABLE_PREFIX = exports.DB_DATABASE = exports.DB_PASSWORD = exports.DB_USERNAME = exports.DB_PORT = exports.DB_HOST = exports.SPEED_LIMIT_COUNT = exports.SPEED_LIMIT_DELAY = exports.SPEED_LIMIT_TIME = exports.PUBLIC_RATE_LIMIT_MAX = exports.PUBLIC_RATE_LIMIT_TIME = exports.RATE_LIMIT_MAX = exports.RATE_LIMIT_TIME = exports.BRUTE_FORCE_COUNT = exports.BRUTE_FORCE_DELAY = exports.BRUTE_FORCE_TIME = exports.SENTRY_DSN = exports.BASE_URL = exports.PORT = exports.bool = void 0;
const dotenv_1 = require("dotenv");
dotenv_1.config();
exports.bool = (val) => String(val).toLowerCase() === "true";
// Server
exports.PORT = process.env.PORT ? parseInt(process.env.PORT) : 80;
exports.BASE_URL = process.env.BASE_URL || "";
exports.SENTRY_DSN = process.env.SENTRY_DSN || "";
// Rate limiting
exports.BRUTE_FORCE_TIME = process.env.BRUTE_FORCE_TIME
    ? parseInt(process.env.BRUTE_FORCE_TIME)
    : 300000; // 5 minutes
exports.BRUTE_FORCE_DELAY = process.env.BRUTE_FORCE_DELAY
    ? parseInt(process.env.BRUTE_FORCE_DELAY)
    : 250; // 0.25s per request delay
exports.BRUTE_FORCE_COUNT = process.env.BRUTE_FORCE_COUNT
    ? parseInt(process.env.BRUTE_FORCE_COUNT)
    : 5; // Start delaying after 5 requests
exports.RATE_LIMIT_TIME = process.env.RATE_LIMIT_TIME
    ? parseInt(process.env.RATE_LIMIT_TIME)
    : 60000; // 1 minute
exports.RATE_LIMIT_MAX = process.env.RATE_LIMIT_MAX
    ? parseInt(process.env.RATE_LIMIT_MAX)
    : 1000; // Max 1,000 requests/minute from an IP
exports.PUBLIC_RATE_LIMIT_TIME = process.env.PUBLIC_RATE_LIMIT_TIME
    ? parseInt(process.env.PUBLIC_RATE_LIMIT_TIME)
    : 60000; // 1 minute
exports.PUBLIC_RATE_LIMIT_MAX = process.env.PUBLIC_RATE_LIMIT_MAX
    ? parseInt(process.env.PUBLIC_RATE_LIMIT_MAX)
    : 60; // Max 60 requests/minute from an IP
exports.SPEED_LIMIT_TIME = process.env.SPEED_LIMIT_TIME
    ? parseInt(process.env.SPEED_LIMIT_TIME)
    : 600000; // 10 minutes
exports.SPEED_LIMIT_DELAY = process.env.SPEED_LIMIT_DELAY
    ? parseInt(process.env.SPEED_LIMIT_DELAY)
    : 100; // 100ms per request delay
exports.SPEED_LIMIT_COUNT = process.env.SPEED_LIMIT_COUNT
    ? parseInt(process.env.SPEED_LIMIT_COUNT)
    : 1000; // Start delaying after 1000 requests
// Database
exports.DB_HOST = process.env.DB_HOST || "localhost";
exports.DB_PORT = process.env.DB_PORT
    ? parseInt(process.env.DB_PORT)
    : 3306;
exports.DB_USERNAME = process.env.DB_USERNAME || "root";
exports.DB_PASSWORD = process.env.DB_PASSWORD || "";
exports.DB_DATABASE = process.env.DB_DATABASE || "database";
exports.DB_TABLE_PREFIX = process.env.DB_TABLE_PREFIX || "";
// Redis
exports.REDIS_URL = process.env.REDIS_URL || "";
exports.REDIS_QUEUE_PREFIX = process.env.REDIS_QUEUE_PREFIX || "staart-";
// Caching
exports.CACHE_TTL = process.env.CACHE_TTL
    ? parseInt(process.env.CACHE_TTL)
    : 600;
exports.CACHE_CHECK_PERIOD = process.env.CACHE_CHECK_PERIOD
    ? parseInt(process.env.CACHE_CHECK_PERIOD)
    : 1000;
// Email
exports.FRONTEND_URL = process.env.FRONTEND_URL || "https://example.com";
exports.ALLOW_DISPOSABLE_EMAILS = exports.bool(process.env.DISPOSABLE_EMAIL);
exports.TEST_EMAIL = process.env.TEST_EMAIL || "staart@mailinator.com";
/// If you want to use AWS SES to send emails:
exports.SES_EMAIL = process.env.SES_EMAIL || "";
exports.SES_REGION = process.env.SES_REGION || "eu-west-1";
exports.SES_ACCESS = process.env.SES_ACCESS || "";
exports.SES_SECRET = process.env.SES_SECRET || "";
/// If you want to use SMTP to send emails:
exports.EMAIL_FROM = process.env.EMAIL_FROM || "";
exports.EMAIL_HOST = process.env.EMAIL_HOST || "";
exports.EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || "";
// Auth and tokens
exports.JWT_SECRET = process.env.JWT_SECRET || "staart";
exports.JWT_ISSUER = process.env.JWT_ISSUER || "staart";
exports.SERVICE_2FA = process.env.SERVICE_2FA || "staart";
exports.HASH_IDS = process.env.HASH_IDS || "staart";
exports.HASH_ID_PREFIX = process.env.HASH_ID_PREFIX || "d0e8a7c-";
exports.TOKEN_EXPIRY_EMAIL_VERIFICATION = process.env.TOKEN_EXPIRY_EMAIL_VERIFICATION || "7d";
exports.TOKEN_EXPIRY_PASSWORD_RESET = process.env.TOKEN_EXPIRY_PASSWORD_RESET || "1d";
exports.TOKEN_EXPIRY_LOGIN = process.env.TOKEN_EXPIRY_LOGIN || "15m";
exports.TOKEN_EXPIRY_APPROVE_LOCATION = process.env.TOKEN_EXPIRY_APPROVE_LOCATION || "10m";
exports.TOKEN_EXPIRY_REFRESH = process.env.TOKEN_EXPIRY_REFRESH || "30d";
exports.TOKEN_EXPIRY_API_KEY_MAX = process.env.TOKEN_EXPIRY_API_KEY_MAX
    ? parseInt(process.env.TOKEN_EXPIRY_API_KEY_MAX)
    : 10413685800000; // 2299-12-31 is the default maximum expiry (also what Microsoft uses)
exports.DISALLOW_OPEN_CORS = exports.bool(process.env.DISALLOW_OPEN_CORS);
// OAuth2 credentials
exports.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
exports.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
exports.GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || "";
exports.GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || "";
exports.MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID || "";
exports.MICROSOFT_CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET || "";
exports.FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID || "";
exports.FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET || "";
exports.SALESFORCE_CLIENT_ID = process.env.SALESFORCE_CLIENT_ID || "";
exports.SALESFORCE_CLIENT_SECRET = process.env.SALESFORCE_CLIENT_SECRET || "";
// Payments and billing
exports.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
exports.STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";
exports.STRIPE_PRODUCT_ID = process.env.STRIPE_PRODUCT_ID || "";
// Tracking
exports.AWS_ELASTIC_ACCESS_KEY = process.env.AWS_ELASTIC_ACCESS_KEY || "";
exports.AWS_ELASTIC_SECRET_KEY = process.env.AWS_ELASTIC_SECRET_KEY || "";
exports.AWS_ELASTIC_HOST = process.env.AWS_ELASTIC_HOST || "";
exports.AWS_ELASTIC_REGION = process.env.AWS_ELASTIC_REGION || "";
exports.ELASTIC_HOST = process.env.ELASTIC_HOST || "";
exports.ELASTIC_LOG = process.env.ELASTIC_LOG || "";
exports.ELASTIC_API_VERSION = process.env.ELASTIC_API_VERSION || "7.2";
exports.ELASTIC_LOGS_INDEX = process.env.ELASTIC_LOGS_INDEX || "staart-logs";
exports.ELASTIC_EVENTS_INDEX = process.env.ELASTIC_EVENTS_INDEX || "staart-events";
exports.ELASTIC_INSTANCES_INDEX = process.env.ELASTIC_INSTANCES_INDEX || "staart-instances";
//# sourceMappingURL=config.js.map