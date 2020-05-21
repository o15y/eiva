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
exports.getOrganizationFromEmail = void 0;
const text_1 = require("@staart/text");
const prisma_1 = require("../../../_staart/helpers/prisma");
const errors_1 = require("@staart/errors");
exports.getOrganizationFromEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    if (text_1.isMatch(email, "*@mail.araassistant.com")) {
        let username = email.split("@")[0];
        if (username.startsWith("meet-"))
            username = username.substring("meet-".length);
        const orgFromEmails = yield prisma_1.prisma.organizations.findOne({
            where: { username },
        });
        if (orgFromEmails)
            return orgFromEmails;
        // TODO: Support for aliases
        // // const aliases = (await query(
        // //   `SELECT * FROM ${tableName("aliases")} WHERE alias = ? LIMIT 1`,
        // //   [email.split("@")[0]]
        // // )) as Array<Alias>;
        // if (aliases.length) return await getOrganization(aliases[0].organizationId);
    }
    else {
        const orgFromCustomEmail = yield prisma_1.prisma.organizations.findMany({
            where: { customEmailAddress: email },
        });
        if (orgFromCustomEmail.length)
            return orgFromCustomEmail[0];
    }
    throw new Error(errors_1.ORGANIZATION_NOT_FOUND);
});
//# sourceMappingURL=index.js.map