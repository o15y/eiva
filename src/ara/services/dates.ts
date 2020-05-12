import { parse } from "chrono-node";
import { WordTokenizer } from "natural";
import { getSlots } from "calendar-slots";
import { ActionParams } from "../interfaces";
import moment, { Moment } from "moment-timezone";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CALENDAR_CLIENT_ID ?? "Client ID",
  process.env.GOOGLE_CALENDAR_CLIENT_SECRET ?? "Client Secret",
  process.env.GOOGLE_CALENDAR_REDIRECT_URL ?? "Redirect URL"
);
const calendarApi = google.calendar("v3");

const wordTokenizer = new WordTokenizer();

/**
 Get a list of recommended slots for an appointment
 @param params - Global action parameters
 @param startTime - Starting time (optional)
 @param endTime - Ending time (optional)
*/
export const recommendDates = async (
  params: ActionParams,
  startTime?: Moment,
  endTime?: Moment
) => {
  if (!(params.user.googleAccessToken && params.user.googleRefreshToken))
    throw new Error("Unable to find Google Calendar connection");
  oauth2Client.setCredentials({
    access_token: params.user.googleAccessToken,
    refresh_token: params.user.googleRefreshToken,
  });
  const today = moment();
  const nextWeek = moment()
    .add(7, "days")
    .endOf("day");
  return getSlots({
    slotDuration: 30,
    slots: 3,
    from: startTime ?? today,
    to: endTime ?? nextWeek,
    days: params.organization.schedulingDays
      ? JSON.parse(params.organization.schedulingDays)
      : [1, 2, 3, 4, 5],
    log: true,
    logger: params.log,
    auth: oauth2Client,
    calendar: calendarApi,
  });
};

export const findDateTimeinText = (text: string) => {
  let result = parse(text);

  // Handle case "I can do 4 pm on Tuesday or Wednesday"
  let numberOfTimes = 0;
  let numberOfDates = 0;
  result.forEach((item) => {
    if (item.start.knownValues.day || item.start.knownValues.weekday)
      numberOfDates++;
    if (item.start.knownValues.hour) numberOfTimes++;
  });
  if (numberOfTimes === 1 && numberOfDates > 1)
    result = result.map((i) => {
      const knownTime = result.find((i) => i.start.knownValues.hour)?.start
        .knownValues;
      if (!knownTime) return i;
      i.start.knownValues.hour = knownTime.hour;
      i.start.knownValues.minute = knownTime.minute;
      i.start.knownValues.second = knownTime.second;
      i.start.knownValues.millisecond = knownTime.millisecond;
      return i;
    });

  return result;
};

export const convertDigitDates = (text: string) => {
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
      if (
        /^-{0,1}\d+$/.test(`${hours}${minutes}`) &&
        parseInt(hours, 10) < 24 &&
        parseInt(minutes, 10) < 60
      )
        word = `${hours}:${minutes}`;
    }
    return word;
  });
  return words.join(" ");
};
