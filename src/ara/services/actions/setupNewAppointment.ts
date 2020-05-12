import { ActionParams } from "../../interfaces";
import { detectEntities } from "../google-cloud";
import {
  findDateTimeinText,
  convertDigitDates,
  recommendDates,
} from "../dates";

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

  let slots: any = [];
  if (!possibleDateTimes.length) {
    try {
      slots = await recommendDates(params);
    } catch (error) {
      console.log(error);
    }
  }

  if (!slots) throw new Error("Couldn't find a date for the appointment");
  console.log(`Recommending ${slots.length} slots for scheduling`);

  // TODO guests are people in "to" who aren't Ara or the owner
  const guests = params.parsedBody.to?.value.filter(
    (i) =>
      i.address !== params.assistantEmail &&
      i.address !== params.parsedBody.from?.value[0].address
  );

  throw new Error("I don't know how to set up a new appointment");
};
