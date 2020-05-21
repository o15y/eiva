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
exports.trackAnalyticsEvent = exports.getPublicMeetingDetails = exports.trackOutgoingEmail = exports.processIncomingEmail = void 0;
const errors_1 = require("@staart/errors");
const crypto_1 = require("crypto");
const s3_1 = require("./services/s3");
const prisma_1 = require("../_staart/helpers/prisma");
const crud_1 = require("./services/crud");
const actions_1 = require("./services/actions");
const parse_1 = require("./services/parse");
const jwt_1 = require("../_staart/helpers/jwt");
const enum_1 = require("../_staart/interfaces/enum");
const moment_1 = __importDefault(require("moment"));
const elasticsearch_1 = require("../_staart/helpers/elasticsearch");
const location_1 = require("../_staart/helpers/location");
const INCOMING_EMAIL_WEBHOOK_SECRET = process.env.INCOMING_EMAIL_WEBHOOK_SECRET || "";
const INCOMING_EMAILS_S3_BUCKET = process.env.INCOMING_EMAILS_S3_BUCKET || "";
/**
 * Safely process an incoming email
 * @param secret - Webhook secret
 * @param objectId - S3 object ID
 */
exports.processIncomingEmail = (secret, objectId) => __awaiter(void 0, void 0, void 0, function* () {
    // Compare webhook secret
    // TODO use more sophisticated secret (HMAC with SHA256, "secret" as key, "objectId" as message)
    if (secret !==
        crypto_1.createHmac("sha256", INCOMING_EMAIL_WEBHOOK_SECRET)
            .update(objectId)
            .digest("hex"))
        throw new Error(errors_1.INVALID_API_KEY_SECRET);
    // Logging computation steps
    const logs = [];
    const log = (...args) => {
        args = args.map((i) => (typeof i === "object" ? JSON.stringify(i) : i));
        if (process.env.NODE_ENV === "development")
            console.log(args.join(" "));
        logs.push(`${new Date().toISOString()} ${args.join(" ")}`);
    };
    // Run process
    emailSteps(objectId, log)
        .then(() => log("Success"))
        .catch((error) => log(`ERROR: ${String(error)}`))
        .then(() => {
        var _a;
        return prisma_1.prisma.incoming_emails.update({
            data: {
                logs: JSON.stringify(logs),
                status: ((_a = logs[logs.length - 1]) !== null && _a !== void 0 ? _a : "").includes("ERROR")
                    ? "ERROR"
                    : "SUCCESS",
            },
            where: { objectId },
        });
    })
        .then(() => { })
        .catch((error) => errors_1.logError("Incoming email error", error));
    return { queued: true };
});
/**
 * Run all steps for an incoming email
 * @param objectId - S3 object ID
 * @param log - Logging function
 */
const emailSteps = (objectId, log) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    // Get email raw data from AWS S3
    log("Received request", objectId);
    const objectBody = (yield s3_1.getS3Item(INCOMING_EMAILS_S3_BUCKET, objectId)).toString();
    // Parse plain text to email object
    log(`Got raw email of length ${objectBody.length}`);
    const parsedBody = yield parse_1.parseEmail(objectBody);
    log("Parsed email attributes");
    // Find organization
    let organization = undefined;
    let assistantEmail = "";
    try {
        for (var _o = __asyncValues(((_b = parsedBody.to) === null || _b === void 0 ? void 0 : _b.value) || []), _p; _p = yield _o.next(), !_p.done;) {
            const email = _p.value;
            try {
                if (!organization) {
                    log(`Looking for team for email "${email.address}"`);
                    organization = yield crud_1.getOrganizationFromEmail(email.address);
                    if (organization)
                        assistantEmail = email.address;
                }
            }
            catch (error) { }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_p && !_p.done && (_a = _o.return)) yield _a.call(_o);
        }
        finally { if (e_1) throw e_1.error; }
    }
    if (!organization || !organization.id)
        throw new Error("Couldn't find a team for this email");
    log(`Found "${organization.username}" team for this email`);
    if (!((_c = parsedBody.from) === null || _c === void 0 ? void 0 : _c.value))
        throw new Error("Unable to find from email address");
    if (!((_d = parsedBody.to) === null || _d === void 0 ? void 0 : _d.value))
        throw new Error("Unable to find to email address");
    // Find user
    // TODO handle if other people email the assistant
    const user = (yield prisma_1.prisma.users.findMany({
        first: 1,
        where: {
            emails: {
                some: {
                    email: parsedBody.from.value[0].address,
                    isVerified: true,
                },
            },
        },
    }))[0];
    if (!user)
        throw new Error(`Couldn't a user from ${parsedBody.from.value[0].address}`);
    log(`Found "${user.name}" user as sender`);
    // Create email object
    const incomingEmail = yield prisma_1.prisma.incoming_emails.upsert({
        where: {
            objectId,
        },
        update: {
            status: "PENDING",
        },
        create: {
            objectId,
            status: "PENDING",
            organization: {
                connect: { id: organization.id },
            },
            user: {
                connect: { id: user.id },
            },
            meeting: {
                // TODO support if reply to pre-existing email
                create: {
                    duration: organization.schedulingDuration,
                    meetingType: organization.schedulingType,
                    location: {
                        connect: { id: organization.schedulingLocation },
                    },
                    organization: {
                        connect: { id: organization.id },
                    },
                    user: {
                        connect: { id: user.id },
                    },
                },
            },
            from: JSON.stringify(parsedBody.from.value),
            to: JSON.stringify(parsedBody.to.value),
            cc: JSON.stringify((_f = (_e = parsedBody.cc) === null || _e === void 0 ? void 0 : _e.value) !== null && _f !== void 0 ? _f : []),
            subject: (_g = parsedBody.subject) !== null && _g !== void 0 ? _g : "",
            emailDate: (_h = parsedBody.date) !== null && _h !== void 0 ? _h : new Date(),
            messageId: (_j = parsedBody.messageId) !== null && _j !== void 0 ? _j : "",
        },
    });
    log(`Upserted incoming email ${incomingEmail.id}, meeting ${incomingEmail.meetingId}`);
    const response = yield actions_1.performAction(incomingEmail, organization, assistantEmail, user, objectBody, parsedBody, log);
    const result = {
        incomingEmail,
        organizationId: organization.id,
        from: parsedBody.from.value,
        to: parsedBody.to.value,
        cc: (_k = parsedBody.cc) === null || _k === void 0 ? void 0 : _k.value,
        bcc: (_l = parsedBody.bcc) === null || _l === void 0 ? void 0 : _l.value,
        replyTo: (_m = parsedBody.replyTo) === null || _m === void 0 ? void 0 : _m.value,
        headers: parsedBody.headers,
        subject: parsedBody.subject,
        references: parsedBody.references,
        emailDate: parsedBody.date,
        messageId: parsedBody.messageId,
        inReplyTo: parsedBody.inReplyTo,
        priority: parsedBody.priority,
        response,
    };
    return result;
});
/**
 * Track the read status of an outgoing email
 * @param jwt - JSON web token for email
 */
exports.trackOutgoingEmail = (jwt) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = yield jwt_1.verifyToken(jwt, enum_1.Tokens.EMAIL_UPDATE);
    return prisma_1.prisma.incoming_emails.update({
        where: { id },
        data: { status: "SUCCESS" },
    });
});
/**
 * Get the details of a meeting
 * @param username - Organization username
 * @param meetingId - Meeting ID
 * @param jwt - JWT for meeting
 */
exports.getPublicMeetingDetails = (username, meetingId, jwt) => __awaiter(void 0, void 0, void 0, function* () {
    yield jwt_1.verifyToken(jwt, enum_1.Tokens.CONFIRM_APPOINTMENT);
    const details = yield prisma_1.prisma.meetings.findMany({
        first: 1,
        where: { id: parseInt(meetingId), organization: { username } },
        include: { organization: true, user: true, location: true },
    });
    if (!details.length)
        throw new Error(errors_1.RESOURCE_NOT_FOUND);
    const meeting = details[0];
    if (meeting.confirmedTime && moment_1.default(meeting.confirmedTime).isBefore(moment_1.default()))
        throw new Error("400/meeting-in-past");
    delete meeting.guests;
    return meeting;
});
/**
 * Tracking for analytics
 * @param index - Index to save record in
 * @param body - Data body
 */
exports.trackAnalyticsEvent = (locals, index, data) => __awaiter(void 0, void 0, void 0, function* () {
    const location = yield location_1.getGeolocationFromIp(locals.ipAddress);
    const body = Object.assign(Object.assign(Object.assign({}, data), location), { date: new Date() });
    return elasticsearch_1.elasticSearchIndex({ index, body });
});
//# sourceMappingURL=rest.js.map