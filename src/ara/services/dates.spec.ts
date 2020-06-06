import { findStartEndTime } from "./dates";
import moment, { Moment } from "moment";

const TZ = "Asia/Kolkata";

export const momentCompare = (
  dates: {
    startDate: Moment;
    endDate: Moment;
  },
  result: {
    startDate: Moment;
    endDate: Moment;
  }
) => {
  console.log(dates, result);
  return (
    moment(dates.startDate).format("YYYY-MM-DD HH:mm:ss") ===
      moment(result.startDate).format("YYYY-MM-DD HH:mm:ss") &&
    moment(dates.endDate).format("YYYY-MM-DD HH:mm:ss") ===
      moment(result.endDate).format("YYYY-MM-DD HH:mm:ss")
  );
};

it("no info -> now until next week", () => {
  const startDate = moment.tz(TZ).hour(0).minute(0).second(0).millisecond(0);
  const endDate = moment
    .tz(TZ)
    .add(7, "days")
    .hour(23)
    .minute(59)
    .second(0)
    .millisecond(0);
  expect(
    momentCompare(findStartEndTime("set up an appointment", TZ), {
      startDate,
      endDate,
    })
  ).toBeTruthy();
});

it("tomorrow", () => {
  const startDate = moment
    .tz(TZ)
    .add(1, "days")
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0);
  const endDate = moment
    .tz(TZ)
    .add(1, "days")
    .hour(23)
    .minute(59)
    .second(0)
    .millisecond(0);
  expect(
    momentCompare(findStartEndTime("set up an appointment for tomorrow", TZ), {
      startDate,
      endDate,
    })
  ).toBeTruthy();
});

it("next week", () => {
  const startDate = moment
    .tz(TZ)
    .add(7, "days")
    .startOf("week")
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0);
  const endDate = moment
    .tz(TZ)
    .add(7, "days")
    .endOf("week")
    .hour(23)
    .minute(59)
    .second(0)
    .millisecond(0);
  expect(
    momentCompare(findStartEndTime("any time next week", TZ), {
      startDate,
      endDate,
    })
  ).toBeTruthy();
});

it("next Thursday", () => {
  const startDate = moment
    .tz(TZ)
    .day(4)
    .add(1, "week")
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0);
  const endDate = moment
    .tz(TZ)
    .day(4)
    .add(1, "week")
    .hour(23)
    .minute(59)
    .second(0)
    .millisecond(0);
  expect(
    momentCompare(findStartEndTime("next Thursday", TZ), {
      startDate,
      endDate,
    })
  ).toBeTruthy();
});
