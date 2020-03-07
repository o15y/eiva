import { ActionParams } from "../../../../interfaces/ara";
import { detectEntities } from "../../google-cloud";
import { findDateTimeinText, getDateInfoFromString } from "../dates";

export const setupNewAppointment = async (params: ActionParams) => {
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
    language
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

  let possibleDates = dates.map(i => getDateInfoFromString(i.name));
  if (!dates.length) possibleDates = findDateTimeinText(paragraph);

  // TODO Find other dates in the coming weeks
  if (!possibleDates.length)
    throw new Error("Couldn't find a date for the appointment");

  // TODO guests are people in "to" who aren't Ara or the owner
  const guests = params.parsedBody.to.value.filter(i =>
    i.address.endsWith("@mail.araassistant.com")
  );

  throw new Error("I don't know how to set up a new appointment");
};
