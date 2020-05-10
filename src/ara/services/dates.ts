import { parse } from "chrono-node";
import { WordTokenizer } from "natural";
import { getSlots } from "calendar-slots";
import { ActionParams } from "../interfaces";
import moment from "moment-timezone";

const wordTokenizer = new WordTokenizer();

export const recommendDates = async (params: ActionParams) => {
  if (!(params.user.googleAccessToken && params.user.googleRefreshToken))
    throw new Error("Unable to find Google Calendar connection");
  const today = moment();
  const nextWeek = moment()
    .add(7, "days")
    .endOf("day");
  return getSlots({
    slotDuration: 30,
    slots: 3,
    from: today,
    to: nextWeek,
    days: params.organization.schedulingDays
      ? JSON.parse(params.organization.schedulingDays)
      : [1, 2, 3, 4, 5],
    log: true,
    logger: params.log,
    user: {
      accessToken: params.user.googleAccessToken,
      refreshToken: params.user.googleRefreshToken,
    },
  });
};

export const findDateTimeinText = (text: string) => {
  let result = parse(text);

  // CASE "Tuesday or Wednesday, 4 pm"
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
    // Four-letter digits e.g., Meet at 1600
    if (word.length === 4 && /^-{0,1}\d+$/.test(word)) {
      const hours = word.substr(0, 2);
      const minutes = word.substr(2);
      if (parseInt(hours, 10) < 24 && parseInt(minutes, 10) < 60)
        word = `${hours}:${minutes}`;
    }
    // Five-letter times with period e.g., Meet at 16.00
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
