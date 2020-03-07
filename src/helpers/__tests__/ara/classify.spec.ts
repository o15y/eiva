import { classifyTokens } from "../../services/ara/classify";

it("detects new appointment", () => {
  expect(classifyTokens(["set up a meeting with john"], () => {})).toBe(
    "setupNewAppointment"
  );
  expect(classifyTokens(["meet john for coffee"], () => {})).toBe(
    "setupNewAppointment"
  );
  expect(classifyTokens(["setup video call with john"], () => {})).toBe(
    "setupNewAppointment"
  );
});

it("detects appointment rescheduling", () => {
  expect(
    classifyTokens(["can't make it to coffee with john anymore"], () => {})
  ).toBe("rescheduleAppointment");
  expect(classifyTokens(["reschedule dinner with john"], () => {})).toBe(
    "rescheduleAppointment"
  );
  expect(classifyTokens(["reschedule my meeting"], () => {})).toBe(
    "rescheduleAppointment"
  );
});

it("detects appointment cancellation", () => {
  expect(classifyTokens(["cancel lunch with john"], () => {})).toBe(
    "cancelAppointment"
  );
  expect(classifyTokens(["cancel my meeting"], () => {})).toBe(
    "cancelAppointment"
  );
  expect(classifyTokens(["cancel the appointment"], () => {})).toBe(
    "cancelAppointment"
  );
});

it("detects schedule summary", () => {
  expect(classifyTokens(["send me my meeting schedule"], () => {})).toBe(
    "scheduleSummary"
  );
  expect(classifyTokens(["what's my schedule for tomorrow"], () => {})).toBe(
    "scheduleSummary"
  );
  expect(classifyTokens(["email my this week's schedule"], () => {})).toBe(
    "scheduleSummary"
  );
});
