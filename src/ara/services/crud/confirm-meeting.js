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
exports.confirmMeetingForGuest = void 0;
const prisma_1 = require("../../../_staart/helpers/prisma");
const enum_1 = require("../../../_staart/interfaces/enum");
const errors_1 = require("@staart/errors");
const jwt_1 = require("../../../_staart/helpers/jwt");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const mustache_markdown_1 = require("@staart/mustache-markdown");
const mail_1 = require("../../../_staart/helpers/mail");
const dates_1 = require("../dates");
/**
 * Confirm a meeting from guest
 * @param token - JWT for verification
 * @param organizationId - Organization ID
 * @param meetingId - Meeting ID
 * @param data - Body data
 */
exports.confirmMeetingForGuest = (organizationId, meetingId, data) => __awaiter(void 0, void 0, void 0, function* () {
    yield jwt_1.verifyToken(data.token, enum_1.Tokens.CONFIRM_APPOINTMENT);
    // Find meeting details
    const meeting = (yield prisma_1.prisma.meetings.findMany({
        where: {
            id: parseInt(meetingId),
            organizationId: parseInt(organizationId),
        },
        include: { organization: true, user: true },
    }))[0];
    if (!meeting)
        throw new Error(errors_1.RESOURCE_NOT_FOUND);
    // Make sure this slot is available
    if (!dates_1.confirmIfSlotAvailable(meeting.user, moment_timezone_1.default(data.selectedDatetime), moment_timezone_1.default(data.selectedDatetime).add(data.duration, "minutes")))
        throw new Error("429/slot-unavailable");
    const safeConfirmMeeting = () => __awaiter(void 0, void 0, void 0, function* () {
        var e_1, _a;
        // Add new guest data to `meeting.guests`
        meeting.guests = JSON.stringify(JSON.parse(meeting.guests).map((guest) => {
            if (guest.address === data.guestEmail) {
                guest.name = data.guestName;
                guest.timezone = data.guestTimezone;
            }
            return guest;
        }));
        // Update meeting details
        // TODO support multiple guests
        const confirmedMeeting = yield prisma_1.prisma.meetings.update({
            where: {
                id: parseInt(meetingId),
            },
            data: {
                confirmedTime: moment_timezone_1.default(data.selectedDatetime).toISOString(),
                guests: meeting.guests,
                duration: data.duration,
            },
        });
        // Get memeeting location details
        if (!meeting.confirmedTime)
            return;
        const location = yield prisma_1.prisma.locations.findOne({
            where: { id: meeting.locationId },
        });
        // Send meeting details
        // TODO send re-confirmations
        const sharedEmailData = {
            duration: String(confirmedMeeting.duration),
            assistantName: meeting.organization.assistantName,
            assistantSignature: meeting.organization.assistantSignature,
            meetingType: meeting.meetingType,
            meetingLocation: location === null || location === void 0 ? void 0 : location.value,
            editLink: "#",
            googleLink: "#",
            outlookLink: "#",
            yahooLink: "#",
            icsLink: "#",
        };
        sharedEmailData.assistantSignature = mustache_markdown_1.render(sharedEmailData.assistantSignature, sharedEmailData)[1];
        // Send email to owner
        const meetingWithName = JSON.parse(meeting.guests)
            .map((guest) => guest.name)
            .join(", ");
        const userEmail = yield prisma_1.prisma.emails.findOne({
            where: { id: meeting.user.primaryEmail },
        });
        if (!userEmail)
            throw new Error(errors_1.RESOURCE_NOT_FOUND);
        const ownerEmailData = Object.assign(Object.assign({}, sharedEmailData), { emailToName: meeting.user.nickname, meetingWithName, meetingDate: moment_timezone_1.default
                .tz(meeting.confirmedTime, meeting.user.timezone)
                .format("dddd, MMMM D, YYYY"), meetingTime: moment_timezone_1.default
                .tz(meeting.confirmedTime, meeting.user.timezone)
                .format("h:mm a z") });
        yield mail_1.mail({
            template: "meeting-confirmation",
            from: `"${meeting.organization.assistantName}" <meet-${meeting.organization.username}@mail.araassistant.com>`,
            to: `"${meeting.user.name}" <${userEmail.email}>`,
            subject: `Confirmed: Appointment with ${meetingWithName}`,
            data: ownerEmailData,
        });
        try {
            // Send email to guests
            for (var _b = __asyncValues(JSON.parse(meeting.guests)), _c; _c = yield _b.next(), !_c.done;) {
                const guest = _c.value;
                const guestEmailData = Object.assign(Object.assign({}, sharedEmailData), { emailToName: guest.name.split(" ")[0], meetingWithName: meeting.user.name, meetingDate: moment_timezone_1.default
                        .tz(meeting.confirmedTime, guest.timezone)
                        .format("dddd, MMMM D, YYYY"), meetingTime: moment_timezone_1.default
                        .tz(meeting.confirmedTime, guest.timezone)
                        .format("h:mm a z") });
                yield mail_1.mail({
                    template: "meeting-confirmation",
                    from: `"${meeting.organization.assistantName}" <meet-${meeting.organization.username}@mail.araassistant.com>`,
                    to: `"${guest.name}" <${guest.address}>`,
                    subject: `Confirmed: Appointment with ${meeting.user.name}`,
                    data: guestEmailData,
                });
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
    safeConfirmMeeting()
        .then(() => { })
        .catch(console.error);
    return { queued: true };
});
//# sourceMappingURL=confirm-meeting.js.map