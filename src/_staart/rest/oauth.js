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
exports.microsoft = exports.google = exports.facebook = exports.github = exports.salesforce = exports.loginWithOAuth2Service = void 0;
const errors_1 = require("@staart/errors");
const axios_1 = __importDefault(require("axios"));
const client_oauth2_1 = __importDefault(require("client-oauth2"));
const config_1 = require("../../config");
const jwt_1 = require("../helpers/jwt");
const enum_1 = require("../interfaces/enum");
const auth_1 = require("./auth");
const prisma_1 = require("../helpers/prisma");
const user_service_1 = require("../services/user.service");
const getRedirectUri = (service) => `${config_1.BASE_URL}/auth/oauth/${service}/callback`;
exports.loginWithOAuth2Service = (service, name, email, locals) => __awaiter(void 0, void 0, void 0, function* () {
    if (!name)
        throw new Error(errors_1.OAUTH_NO_NAME);
    if (!email)
        throw new Error(errors_1.OAUTH_NO_EMAIL);
    const allUsers = yield prisma_1.prisma.users.findMany({
        where: { emails: { some: { email } } },
    });
    if (allUsers.length)
        return jwt_1.getLoginResponse(allUsers[0], enum_1.EventType.AUTH_LOGIN_OAUTH, service, locals);
    const newUser = yield auth_1.register({ name }, locals, email, undefined, undefined, true);
    const loggedInUser = yield user_service_1.getUserById(newUser.userId);
    if (!loggedInUser)
        throw new Error(errors_1.USER_NOT_FOUND);
    return jwt_1.getLoginResponse(loggedInUser, enum_1.EventType.AUTH_LOGIN_OAUTH, service, locals);
});
exports.salesforce = {
    client: new client_oauth2_1.default({
        clientId: config_1.SALESFORCE_CLIENT_ID,
        clientSecret: config_1.SALESFORCE_CLIENT_SECRET,
        redirectUri: getRedirectUri("salesforce"),
        authorizationUri: "https://login.salesforce.com/services/oauth2/authorize",
        accessTokenUri: "https://login.salesforce.com/services/oauth2/token",
        scopes: ["id"],
    }),
    callback: (url, locals) => __awaiter(void 0, void 0, void 0, function* () {
        const token = (yield exports.salesforce.client.code.getToken(url)).accessToken;
        const data = (yield axios_1.default.get("https://login.salesforce.com/services/oauth2/userinfo", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })).data;
        if (!data.email_verified)
            throw new Error(errors_1.OAUTH_NO_EMAIL);
        return exports.loginWithOAuth2Service("salesforce", data.name, data.email, locals);
    }),
};
exports.github = {
    client: new client_oauth2_1.default({
        clientId: config_1.GITHUB_CLIENT_ID,
        clientSecret: config_1.GITHUB_CLIENT_SECRET,
        redirectUri: getRedirectUri("github"),
        authorizationUri: "https://github.com/login/oauth/authorize",
        accessTokenUri: "https://github.com/login/oauth/access_token",
        scopes: ["read:user", "user:email"],
    }),
    callback: (url, locals) => __awaiter(void 0, void 0, void 0, function* () {
        const token = (yield exports.github.client.code.getToken(url)).accessToken;
        const data = (yield axios_1.default.get("https://api.github.com/user", {
            headers: {
                Authorization: `token ${token}`,
            },
        })).data;
        return exports.loginWithOAuth2Service("github", data.name, data.email, locals);
    }),
};
exports.facebook = {
    client: new client_oauth2_1.default({
        clientId: config_1.FACEBOOK_CLIENT_ID,
        clientSecret: config_1.FACEBOOK_CLIENT_SECRET,
        redirectUri: getRedirectUri("facebook"),
        authorizationUri: "https://www.facebook.com/v3.3/dialog/oauth",
        accessTokenUri: "https://graph.facebook.com/v3.3/oauth/access_token",
        scopes: ["email"],
    }),
    callback: (url, locals) => __awaiter(void 0, void 0, void 0, function* () {
        const token = (yield exports.facebook.client.code.getToken(url)).accessToken;
        const data = (yield axios_1.default.get(`https://graph.facebook.com/v3.3/me?fields=name,email&access_token=${token}`)).data;
        return exports.loginWithOAuth2Service("facebook", data.name, data.email, locals);
    }),
};
exports.google = {
    client: new client_oauth2_1.default({
        clientId: config_1.GOOGLE_CLIENT_ID,
        clientSecret: config_1.GOOGLE_CLIENT_SECRET,
        redirectUri: getRedirectUri("google"),
        authorizationUri: "https://accounts.google.com/o/oauth2/v2/auth",
        accessTokenUri: "https://www.googleapis.com/oauth2/v4/token",
        scopes: ["https://www.googleapis.com/auth/userinfo.email"],
    }),
    callback: (url, locals) => __awaiter(void 0, void 0, void 0, function* () {
        // const token = (await google.client.code.getToken(url));
        // console.log("Got response", JSON.stringify(token.accessToken));
        return {};
        // const data = (await axios.get("https://api.google.com/user", {
        //   headers: {
        //     Authorization: `token ${token}`
        //   }
        // })).data;
        // return loginWithOAuth2Service("google", data.name, data.email, locals);
    }),
};
exports.microsoft = {
    client: new client_oauth2_1.default({
        clientId: config_1.MICROSOFT_CLIENT_ID,
        clientSecret: config_1.MICROSOFT_CLIENT_SECRET,
        redirectUri: getRedirectUri("microsoft"),
        authorizationUri: "https://login.microsoftonline.com/common/oauth2/authorize",
        accessTokenUri: "https://login.microsoftonline.com/common/oauth2/token",
        scopes: ["user.read", "mail.read"],
    }),
    callback: (url, locals) => __awaiter(void 0, void 0, void 0, function* () {
        const token = (yield exports.microsoft.client.code.getToken(url)).accessToken;
        const data = (yield axios_1.default.get("https://graph.microsoft.com/v1.0/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })).data;
        console.log(JSON.stringify(data));
        return exports.loginWithOAuth2Service("microsoft", data.displayName, data.mail, locals);
    }),
};
//# sourceMappingURL=oauth.js.map