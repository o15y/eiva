import { ActionParams } from "../../interfaces";
import { detectEntities } from "../google-cloud";
import { findDateTimeinText, convertDigitDates } from "../dates";

export const setupNewAppointment = async (params: ActionParams) => {
  params.tokens = params.tokens.map(convertDigitDates);
  const paragraph = params.tokens.join(". ");
  const {
    persons,
    locations,
    organizations,
    events,
    consumerGoods,
    phoneNumbers,
    addresses,
    dates,
    language,
  } = await detectEntities(paragraph);
  params.log(`Detected language as "${language}"`);
  if (persons.length) params.log("Detected persons", persons);
  if (locations.length) params.log("Detected locations", locations);
  if (organizations.length) params.log("Detected organizations", organizations);
  if (events.length) params.log("Detected events", events);
  if (consumerGoods.length) params.log("Detected consumerGoods", consumerGoods);
  if (phoneNumbers.length) params.log("Detected phoneNumbers", phoneNumbers);
  if (addresses.length) params.log("Detected addresses", addresses);
  if (dates.length) params.log("Detected dates", dates);

  const possibleDateTimes = findDateTimeinText(paragraph);
  params.log(
    "Possible intial date times",
    possibleDateTimes.map((i) => i.text)
  );

  // TODO Find other dates in the coming weeks
  if (!possibleDateTimes.length)
    throw new Error("Couldn't find a date for the appointment");

  // TODO guests are people in "to" who aren't Ara or the owner
  const guests = params.parsedBody.to.value.filter((i) =>
    i.address.endsWith("@mail.araassistant.com")
  );

  throw new Error("I don't know how to set up a new appointment");
};
