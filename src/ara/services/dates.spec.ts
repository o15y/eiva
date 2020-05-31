import { findStartEndTime } from "./dates";
import moment, { Moment } from "moment";

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
    moment(dates.startDate).format("YYYY-MM-DD") ===
      moment(result.startDate).format("YYYY-MM-DD") &&
    moment(dates.endDate).format("YYYY-MM-DD") ===
      moment(result.endDate).format("YYYY-MM-DD")
  );
};

it("recommend now until next week", () => {
  const now = moment();
  const nextWeek = moment().add(7, "days");
  expect(
    momentCompare(findStartEndTime("set up an appointment", "Asia/Kolkata"), {
      startDate: now,
      endDate: nextWeek,
    })
  ).toBeTruthy();
});
