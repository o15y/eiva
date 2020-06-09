const { parse } = require("chrono-node");
import { WordTokenizer } from "natural";
import { getSlots, getEventsFromSingleCalendar } from "calendar-slots";
import { ActionParams } from "../interfaces";
import moment, { Moment } from "moment-timezone";
import { google } from "googleapis";
import { organizations } from "@prisma/client";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CALENDAR_CLIENT_ID ?? "Client ID",
  process.env.GOOGLE_CALENDAR_CLIENT_SECRET ?? "Client Secret",
  process.env.GOOGLE_CALENDAR_REDIRECT_URL ?? "Redirect URL"
);
const calendarApi = google.calendar("v3");
const wordTokenizer = new WordTokenizer();

/**
 * Confirm if a meeting slot is empty/available
 * @param user - User details
 * @param startTime - Start time
 * @param endTime - End time
 */
export const confirmIfSlotAvailable = async (
  organization: organizations,
  startTime: Moment,
  endTime: Moment
) => {
  if (!(organization.googleAccessToken && organization.googleRefreshToken))
    return true;
  oauth2Client.setCredentials({
    access_token: organization.googleAccessToken,
    refresh_token: organization.googleRefreshToken,
  });
  return (
    (
      await getEventsFromSingleCalendar({
        from: startTime,
        to: endTime,
        auth: oauth2Client,
        calendar: calendarApi,
      })
    ).length === 0
  );
};

/**
 Get a list of recommended slots for an appointment
 @param params - Global action parameters
 @param startTime - Starting time (optional)
 @param endTime - Ending time (optional)
*/
export const recommendDates = async (
  params: ActionParams,
  duration: number,
  startTime?: Moment,
  endTime?: Moment
) => {
  const today = moment();
  const nextWeek = moment().add(1, "week").endOf("day");
  const slotParams: any = {
    slots: 3,
    slotDuration: duration,
    padding: params.organization.schedulingPadding,
    daily: {
      timezone: params.user.timezone,
      from: [
        ...params.organization.schedulingTimeStart
          .split(":")
          .map((i) => parseInt(i)),
      ],
      to: [
        ...params.organization.schedulingTimeEnd
          .split(":")
          .map((i) => parseInt(i)),
      ],
    },
    from: startTime ?? today,
    to: endTime ?? nextWeek,
    days: params.organization.schedulingDays
      ? params.organization.schedulingDays
          .split(",")
          .map((i: string) => parseInt(i.trim()))
      : [1, 2, 3, 4, 5],
    log: true,
    logger: params.log,
  };
  if (
    !(
      params.organization.googleAccessToken &&
      params.organization.googleRefreshToken
    ) &&
    !params.organization.customCalendarUrl
  ) {
    params.log("Unable to find calendar URL or connection");
  } else if (params.organization.customCalendarUrl) {
    params.log("Using custom calendar URL");
    slotParams.url = params.organization.customCalendarUrl;
  } else {
    params.log("Using Google Calendar credentials");
    oauth2Client.setCredentials({
      access_token: params.organization.googleAccessToken,
      refresh_token: params.organization.googleRefreshToken,
    });
    slotParams.auth = oauth2Client;
    slotParams.calendar = calendarApi;
  }
  return getSlots(slotParams);
};

export const findDateTimeinText = (text: string): any => {
  let result = parse(text);

  // Handle case "I can do 4 pm on Tuesday or Wednesday"
  let numberOfTimes = 0;
  let numberOfDates = 0;
  result.forEach((item: any) => {
    if (item.start.knownValues.day || item.start.knownValues.weekday)
      numberOfDates++;
    if (item.start.knownValues.hour) numberOfTimes++;
  });
  if (numberOfTimes === 1 && numberOfDates > 1)
    result = result.map((i: any) => {
      const knownTime = result.find((i: any) => i.start.knownValues.hour)?.start
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

export const findStartEndTime = (
  text: string,
  timezone: string,
  params?: ActionParams
): { startDate: Moment; endDate: Moment } => {
  let startDate = moment.tz(timezone).minute(0).second(0).millisecond(0);
  let endDate = moment.tz(timezone).minute(0).second(0).millisecond(0);
  const times = findDateTimeinText(text) || [];
  times[0] = times[0] || {};
  times[0].text = times[0].text || "";
  if (times[0].text && params)
    params.log(`Found datetime text "${times[0].text}"`);
  times[0].start = times[0].start || { knownValues: {} };
  times[0].start.knownValues = times[0].start.knownValues || {};
  times[0].end = times[0].end || { knownValues: {} };
  times[0].end.knownValues = times[0].end.knownValues || {};

  console.log(JSON.stringify(times[0]));

  // If a year is specified, use that; otherwise current year
  if (times[0].start.knownValues.year)
    startDate.year(parseInt(times[0].start.knownValues.year));

  // If a month is specified, use that; otherwise current month
  if (times[0].start.knownValues.month)
    startDate.month(parseInt(times[0].start.knownValues.month) - 1);

  // If a date is specified, use that; otherwise today
  if (times[0].start.knownValues.day)
    startDate.date(parseInt(times[0].start.knownValues.day));

  // If a date is specified, use that; otherwise today
  if (times[0].start.knownValues.weekday)
    startDate.day(parseInt(times[0].start.knownValues.weekday));

  // If you say something like "next week"
  if (times[0].text.includes("week")) {
    startDate = startDate.startOf("week");
    // If the beginning of the week is in the past, next week
    if (moment().diff(moment(startDate), "day") > 0)
      startDate = startDate.add(1, "week");
  }

  // If you say something like "Thursday", use next week
  if (
    times[0].text.includes("day") &&
    moment().diff(moment(startDate), "day") > 0
  ) {
    startDate = startDate.add(1, "week");
  }

  // If the month + day combination is in the past, use next month
  // e.g., "Meet on 3rd" if today is 29th, means 3rd of next month
  if (moment().diff(moment(startDate), "day") > 0)
    startDate.month(startDate.get("month") + 1);

  if (times[0].start.knownValues.hour)
    // If an hour is specified, use that; otherwise 0
    startDate.hour(parseInt(times[0].start.knownValues.hour));
  else startDate.hour(0);

  // If an minute is specified, use that; otherwise 0
  if (times[0].start.knownValues.minute)
    startDate.minute(parseInt(times[0].start.knownValues.minute));
  else startDate.minute(0);

  endDate.hour(23);
  endDate.minute(59);
  endDate.second(0);

  // If it's a single day, like "Monday" or "day after tomorrow"
  if (times[0].text.includes("tomorrow") || times[0].text.includes("day")) {
    endDate.year(startDate.get("year"));
    endDate.month(startDate.get("month"));
    endDate.date(startDate.get("date"));

    endDate.hour(23);
    endDate.minute(59);
    endDate.second(0);
  } else if (times[0].text.includes("week")) {
    endDate.year(startDate.get("year"));
    endDate.month(startDate.get("month"));
    endDate.date(startDate.get("date"));
    endDate = endDate.endOf("week");

    endDate.hour(23);
    endDate.minute(59);
    endDate.second(0);
  } else {
    // If a year is specified, use that; otherwise
    if (times[0].end.knownValues.year)
      endDate.year(parseInt(times[0].end.knownValues.year));

    // If a month is specified, use that; otherwise current month
    if (times[0].end.knownValues.month)
      endDate.month(parseInt(times[0].end.knownValues.month) - 1);

    // If a date is specified, use that; otherwise a week from now
    if (times[0].end.knownValues.day)
      endDate.date(parseInt(times[0].end.knownValues.day));
    else if (times[0].end.knownValues.weekday)
      endDate.day(parseInt(times[0].end.knownValues.weekday));
    else endDate = endDate.add(1, "week");

    if (times[0].end.knownValues.hour)
      // If an hour is specified, use that; otherwise 23
      endDate.hour(parseInt(times[0].end.knownValues.hour));
    else endDate.hour(23);

    // If an minute is specified, use that; otherwise 59
    if (times[0].end.knownValues.minute)
      endDate.minute(parseInt(times[0].end.knownValues.minute));
    else endDate.minute(59);
  }

  if (endDate.isBefore(startDate)) endDate = endDate.add(1, "week");

  return { startDate, endDate };
};
