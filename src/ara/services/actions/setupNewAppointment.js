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
exports.setupNewAppointment = void 0;
const google_cloud_1 = require("../google-cloud");
const prisma_1 = require("../../../_staart/helpers/prisma");
const config_1 = require("../../../config");
const mail_1 = require("../../../_staart/helpers/mail");
const mustache_markdown_1 = require("@staart/mustache-markdown");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const text_1 = require("@staart/text");
const dates_1 = require("../dates");
const clearbit_1 = require("../clearbit");
const jwt_1 = require("../../../_staart/helpers/jwt");
const enum_1 = require("../../../_staart/interfaces/enum");
exports.setupNewAppointment = (params) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a, e_2, _b;
    var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
    params.tokens = params.tokens.map(dates_1.convertDigitDates);
    const paragraph = params.tokens.join(". ");
    const { persons, locations, organizations, events, consumerGoods, phoneNumbers, addresses, dates, language, } = yield google_cloud_1.detectEntities(paragraph);
    params.log(`Detected language as "${language}"`);
    if (persons.length)
        params.log("Detected persons", persons);
    if (locations.length)
        params.log("Detected locations", locations);
    if (organizations.length)
        params.log("Detected organizations", organizations);
    if (events.length)
        params.log("Detected events", events);
    if (consumerGoods.length)
        params.log("Detected consumerGoods", consumerGoods);
    if (phoneNumbers.length)
        params.log("Detected phoneNumbers", phoneNumbers);
    if (addresses.length)
        params.log("Detected addresses", addresses);
    if (dates.length)
        params.log("Detected dates", dates);
    const possibleDateTimes = dates_1.findDateTimeinText(paragraph);
    params.log("Possible intial date times", possibleDateTimes.map((i) => i.text));
    const duration = params.organization.schedulingDuration;
    // Find slots
    let slots = [];
    if (!possibleDateTimes.length)
        slots = yield dates_1.recommendDates(params, duration);
    params.log("Found potential slots", slots.length);
    if (!slots)
        throw new Error("Couldn't find a date for the appointment");
    // Find guests
    let guests = [];
    try {
        for (var _x = __asyncValues((_d = (_c = params.parsedBody.to) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : []), _y; _y = yield _x.next(), !_y.done;) {
            const guest = _y.value;
            if (guest.address !== params.assistantEmail &&
                guest.address !== ((_e = params.parsedBody.from) === null || _e === void 0 ? void 0 : _e.value[0].address)) {
                let details = undefined;
                try {
                    details = yield clearbit_1.getClearbitPersonFromEmail(guest.address);
                    params.log(`Found guest details ${(_h = (_g = (_f = details.person) === null || _f === void 0 ? void 0 : _f.name) === null || _g === void 0 ? void 0 : _g.fullName) !== null && _h !== void 0 ? _h : ""} ${(_k = (_j = details
                        .company) === null || _j === void 0 ? void 0 : _j.name) !== null && _k !== void 0 ? _k : ""}`);
                }
                catch (error) {
                    params.log("Unable to find guest details");
                }
                if (!((_l = guest.name) !== null && _l !== void 0 ? _l : "").trim()) {
                    const potentialName = persons.find((person) => guest.address.toLowerCase().includes(person.name.toLowerCase()));
                    guest.name = text_1.capitalizeFirstAndLastLetter((_q = (_p = (_o = (_m = details === null || details === void 0 ? void 0 : details.person) === null || _m === void 0 ? void 0 : _m.name) === null || _o === void 0 ? void 0 : _o.fullName) !== null && _p !== void 0 ? _p : potentialName === null || potentialName === void 0 ? void 0 : potentialName.name) !== null && _q !== void 0 ? _q : guest.address.split("@")[0]);
                }
                let timezone = (_u = (_s = (_r = details === null || details === void 0 ? void 0 : details.person) === null || _r === void 0 ? void 0 : _r.timeZone) !== null && _s !== void 0 ? _s : (_t = details === null || details === void 0 ? void 0 : details.company) === null || _t === void 0 ? void 0 : _t.timeZone) !== null && _u !== void 0 ? _u : params.user.timezone;
                guests.push(Object.assign(Object.assign(Object.assign({}, guest), details), { timezone }));
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_y && !_y.done && (_a = _x.return)) yield _a.call(_x);
        }
        finally { if (e_1) throw e_1.error; }
    }
    if (!guests.length)
        throw new Error("Couldn't find guests");
    params.log("Found guests for this meeting", guests.length);
    // Update meeting details with guest and proposed times
    yield prisma_1.prisma.meetings.update({
        where: { id: params.incomingEmail.meetingId },
        data: {
            guests: JSON.stringify(guests),
            proposedTimes: JSON.stringify(slots),
        },
    });
    params.log("Updated meeting details with slots and guests");
    // Create outbound email record
    const outgoingEmailId = text_1.randomString({ length: 40 });
    const { id } = yield prisma_1.prisma.incoming_emails.create({
        data: {
            emailType: "OUTGOING",
            objectId: outgoingEmailId,
            messageId: `${outgoingEmailId}@ara-internal`,
            from: `[{"address":"meet-${params.organization.username}@mail.araassistant.com","name":"${params.organization.assistantName}"}]`,
            to: JSON.stringify(guests),
            cc: "[]",
            subject: `${params.organization.name} - Appointment`,
            status: "PENDING",
            emailDate: new Date(),
            user: { connect: { id: params.user.id } },
            organization: { connect: { id: params.organization.id } },
            meeting: { connect: { id: params.incomingEmail.meetingId } },
        },
    });
    params.log("Set up tracking for outbound email");
    // TODO support multiple guest timezones
    const guestTimezone = (_v = guests[0].timezone) !== null && _v !== void 0 ? _v : params.user.timezone;
    // Generate markdown list of slots with links
    let slotsMarkdown = [];
    try {
        for (var slots_1 = __asyncValues(slots), slots_1_1; slots_1_1 = yield slots_1.next(), !slots_1_1.done;) {
            const slot = slots_1_1.value;
            slotsMarkdown.push(`- [${moment_timezone_1.default
                .tz(slot.start, guestTimezone)
                .format("dddd, MMMM D, h:mm a z")}](${config_1.FRONTEND_URL}/meet/${params.organization.username}/${params.incomingEmail.meetingId}/confirm?token=${encodeURIComponent(yield jwt_1.generateToken({
                guests,
                timezone: guestTimezone,
                duration,
                datetime: moment_timezone_1.default.tz(slot.start, guestTimezone).toISOString(),
            }, "1y", enum_1.Tokens.CONFIRM_APPOINTMENT))})`);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (slots_1_1 && !slots_1_1.done && (_b = slots_1.return)) yield _b.call(slots_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    const data = {
        ownerName: params.user.nickname,
        guestName: (_w = guests
            .map((guest) => guest.name.split(" ")[0])
            .filter((name) => name)
            .join(", ")) !== null && _w !== void 0 ? _w : "guest",
        duration: String(duration),
        assistantName: params.organization.assistantName,
        assistantSignature: params.organization.assistantSignature,
        trackingImageUrl: `${config_1.BASE_URL}/v1/api/read-receipt?token=${encodeURIComponent(yield jwt_1.generateToken({ id }, "1y", enum_1.Tokens.EMAIL_UPDATE))}`,
        slotsMarkdown: slotsMarkdown.join("\n"),
    };
    data.assistantSignature = mustache_markdown_1.render(data.assistantSignature, data)[1];
    yield mail_1.mail({
        template: "meeting-invitation",
        from: `"${params.organization.assistantName}" <meet-${params.organization.username}@mail.araassistant.com>`,
        to: guests.map((guest) => `"${guest.name}" <${guest.address}>`),
        subject: `${params.organization.name} - Appointment`,
        data,
    });
    params.log("Sent email to guests");
});
//# sourceMappingURL=setupNewAppointment.js.map