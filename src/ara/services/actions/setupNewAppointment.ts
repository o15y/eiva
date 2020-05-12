import { ActionParams } from "../../interfaces";
import { detectEntities } from "../google-cloud";
import { prisma } from "../../../_staart/helpers/prisma";
import { mail } from "../../../_staart/helpers/mail";
import { Slot } from "calendar-slots";
import moment from "moment-timezone";
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

  const duration = params.organization.schedulingDuration;

  let slots: Slot[] = [];
  if (!possibleDateTimes.length) slots = await recommendDates(params, duration);

  if (!slots) throw new Error("Couldn't find a date for the appointment");

  // TODO guests are people in "to" who aren't Ara or the owner
  const guests =
    params.parsedBody.to?.value.filter(
      (i) =>
        i.address !== params.assistantEmail &&
        i.address !== params.parsedBody.from?.value[0].address
    ) ?? [];
  if (!guests.length) throw new Error("Couldn't find guests");

  await prisma.meetings.update({
    where: { id: params.incomingEmail.meetingId },
    data: {
      guests: JSON.stringify(guests),
      proposedTimes: JSON.stringify(slots),
    },
  });

  const data = {
    guestName: "John",
    duration: String(duration),
    slotsMarkdown: slots
      .map(
        (slot) =>
          `- ${moment
            .tz(slot.start, params.user.timezone)
            .format("dddd, MMMM D, h:mm a z")}`
      )
      .join("\n"),
  };
  await mail({
    from: `"${params.organization.name}'s Assistant" <meet-${params.organization.username}@mail.araassistant.com>`,
    to: guests.map((guest) => `"${guest.name}" <${guest.address}>`),
    subject: `${params.organization.name} - Appointment`,
    data,
  });
  params.log("Sent email to guests");
};
