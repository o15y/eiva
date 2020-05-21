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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertDigitDates = exports.findDateTimeinText = exports.recommendDates = exports.confirmIfSlotAvailable = void 0;
const chrono_node_1 = require("chrono-node");
const natural_1 = require("natural");
const calendar_slots_1 = require("calendar-slots");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const googleapis_1 = require("googleapis");
const oauth2Client = new googleapis_1.google.auth.OAuth2((_a = process.env.GOOGLE_CALENDAR_CLIENT_ID) !== null && _a !== void 0 ? _a : "Client ID", (_b = process.env.GOOGLE_CALENDAR_CLIENT_SECRET) !== null && _b !== void 0 ? _b : "Client Secret", (_c = process.env.GOOGLE_CALENDAR_REDIRECT_URL) !== null && _c !== void 0 ? _c : "Redirect URL");
const calendarApi = googleapis_1.google.calendar("v3");
const wordTokenizer = new natural_1.WordTokenizer();
/**
 * Confirm if a meeting slot is empty/available
 * @param user - User details
 * @param startTime - Start time
 * @param endTime - End time
 */
exports.confirmIfSlotAvailable = (user, startTime, endTime) => __awaiter(void 0, void 0, void 0, function* () {
    oauth2Client.setCredentials({
        access_token: user.googleAccessToken,
        refresh_token: user.googleRefreshToken,
    });
    return ((yield calendar_slots_1.getEventsFromSingleCalendar({
        from: startTime,
        to: endTime,
        auth: oauth2Client,
        calendar: calendarApi,
    })).length === 0);
});
/**
 Get a list of recommended slots for an appointment
 @param params - Global action parameters
 @param startTime - Starting time (optional)
 @param endTime - Ending time (optional)
*/
exports.recommendDates = (params, duration, startTime, endTime) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(params.user.googleAccessToken && params.user.googleRefreshToken))
        throw new Error("Unable to find Google Calendar connection");
    oauth2Client.setCredentials({
        access_token: params.user.googleAccessToken,
        refresh_token: params.user.googleRefreshToken,
    });
    const today = moment_timezone_1.default();
    const nextWeek = moment_timezone_1.default()
        .add(7, "days")
        .endOf("day");
    return calendar_slots_1.getSlots({
        slots: 3,
        slotDuration: duration,
        padding: params.organization.schedulingPadding,
        from: startTime !== null && startTime !== void 0 ? startTime : today,
        to: endTime !== null && endTime !== void 0 ? endTime : nextWeek,
        days: params.organization.schedulingDays
            ? params.organization.schedulingDays
                .split(",")
                .map((i) => parseInt(i.trim()))
            : [1, 2, 3, 4, 5],
        log: true,
        logger: params.log,
        auth: oauth2Client,
        calendar: calendarApi,
    });
});
exports.findDateTimeinText = (text) => {
    let result = chrono_node_1.parse(text);
    // Handle case "I can do 4 pm on Tuesday or Wednesday"
    let numberOfTimes = 0;
    let numberOfDates = 0;
    result.forEach((item) => {
        if (item.start.knownValues.day || item.start.knownValues.weekday)
            numberOfDates++;
        if (item.start.knownValues.hour)
            numberOfTimes++;
    });
    if (numberOfTimes === 1 && numberOfDates > 1)
        result = result.map((i) => {
            var _a;
            const knownTime = (_a = result.find((i) => i.start.knownValues.hour)) === null || _a === void 0 ? void 0 : _a.start.knownValues;
            if (!knownTime)
                return i;
            i.start.knownValues.hour = knownTime.hour;
            i.start.knownValues.minute = knownTime.minute;
            i.start.knownValues.second = knownTime.second;
            i.start.knownValues.millisecond = knownTime.millisecond;
            return i;
        });
    return result;
};
exports.convertDigitDates = (text) => {
    const words = wordTokenizer.tokenize(text).map((word) => {
        // Four-letter digits that are common in the military e.g., Meet at 1600
        if (word.length === 4 && /^-{0,1}\d+$/.test(word)) {
            const hours = word.substr(0, 2);
            const minutes = word.substr(2);
            if (parseInt(hours, 10) < 24 && parseInt(minutes, 10) < 60)
                word = `${hours}:${minutes}`;
        }
        // Five-letter times with period that are common in the Netherlands e.g., Meet at 16.00
        if (word.length === 5 && word[2] === ".") {
            const hours = word.substr(0, 2);
            const minutes = word.substr(3);
            if (/^-{0,1}\d+$/.test(`${hours}${minutes}`) &&
                parseInt(hours, 10) < 24 &&
                parseInt(minutes, 10) < 60)
                word = `${hours}:${minutes}`;
        }
        return word;
    });
    return words.join(" ");
};
//# sourceMappingURL=dates.js.map