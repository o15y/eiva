import { ActionParams } from "../../interfaces";
import { detectEntities } from "../google-cloud";
import { prisma } from "../../../_staart/helpers/prisma";
import { BASE_URL, FRONTEND_URL } from "../../../config";
import { mail } from "../../../_staart/helpers/mail";
import { Slot } from "calendar-slots";
import moment from "moment-timezone";
import { capitalizeFirstAndLastLetter, randomString } from "@staart/text";
import {
  findDateTimeinText,
  convertDigitDates,
  recommendDates,
} from "../dates";
import { getClearbitPersonFromEmail, ClearbitResponse } from "../clearbit";
import { generateToken } from "../../../_staart/helpers/jwt";
import { Tokens } from "../../../_staart/interfaces/enum";
import { getUserBestEmail } from "../../../_staart/services/user.service";

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

  // Find slots
  let slots: Slot[] = [];
  // if (!possibleDateTimes.length) slots = await recommendDates(params, duration);
  slots = await recommendDates(params, duration);
  params.log("Found potential slots", slots.length);

  if (!slots) throw new Error("Couldn't find a date for the appointment");

  // Find guests
  let guests: any[] = [];
  for await (const guest of params.parsedBody.to?.value ?? []) {
    if (
      guest.address !== params.assistantEmail && // Assistant is not a guest
      guest.address !== params.parsedBody.from?.value[0].address // Sender (owner) is not a guest
    ) {
      let details: ClearbitResponse | undefined = undefined;
      try {
        if (params.organization.useClearbit) {
          details = await getClearbitPersonFromEmail(
            guest.address,
            params.organization.clearbitApiKey || undefined
          );
          params.log(
            `Found guest details ${details.person?.name?.fullName ?? ""} ${
              details.company?.name ?? ""
            }`
          );
        } else {
          params.log("Skipping finding guest details");
        }
      } catch (error) {
        params.log("Unable to find guest details");
      }
      if (!(guest.name ?? "").trim()) {
        const potentialName = persons.find((person) =>
          guest.address.toLowerCase().includes(person.name.toLowerCase())
        );
        guest.name = capitalizeFirstAndLastLetter(
          details?.person?.name?.fullName ??
            potentialName?.name ??
            guest.address.split("@")[0]
        );
      }
      let timezone =
        details?.person?.timeZone ??
        details?.company?.timeZone ??
        params.user.timezone;
      guests.push({ ...guest, ...details, timezone });
    }
  }
  if (!guests.length) throw new Error("Couldn't find guests");
  params.log("Found guests for this meeting", guests.length);

  // Update meeting details with guest and proposed times
  await prisma.meetings.update({
    where: { id: params.incomingEmail.meetingId },
    data: {
      language,
      guests: JSON.stringify(guests),
      proposedTimes: JSON.stringify(slots),
    },
  });
  params.log("Updated meeting details with slots and guests");

  // Create outbound email record
  const outgoingEmailId = randomString({ length: 40 });
  const { id } = await prisma.incoming_emails.create({
    data: {
      emailType: "OUTGOING",
      objectId: outgoingEmailId,
      messageId: `${outgoingEmailId}@ara-internal`,
      from: JSON.stringify([
        {
          address: `meet-${params.organization.username}@mail.araassistant.com`,
          name: params.organization.assistantName,
        },
      ]),
      to: JSON.stringify(guests),
      cc: "[]",
      subject: `${params.organization.name} - Appointment`,
      status: "PENDING",
      emailDate: new Date(),
      user: { connect: { id: params.user.id } },
      organization: { connect: { id: params.organization.id } },
      meeting: { connect: { id: params.incomingEmail.meetingId } },
    },
  });
  params.log("Set up tracking for outbound email");

  // TODO support multiple guest timezones
  const guestTimezone = guests[0].timezone ?? params.user.timezone;

  // Generate markdown list of slots with links
  let slotsMarkdown: string[] = [];
  let slotsMarkdownOwner: string[] = [];
  for await (const slot of slots) {
    slotsMarkdown.push(
      `- [${moment
        .tz(slot.start, guestTimezone)
        .format("dddd, MMMM D, h:mm a z")}](${FRONTEND_URL}/meet/${
        params.organization.username
      }/${params.incomingEmail.meetingId}/confirm?token=${encodeURIComponent(
        await generateToken(
          {
            guests,
            timezone: guestTimezone,
            duration,
            datetime: moment.tz(slot.start, guestTimezone).toISOString(),
          },
          "1y",
          Tokens.CONFIRM_APPOINTMENT
        )
      )})`
    );
    slotsMarkdownOwner.push(
      `- [${moment
        .tz(slot.start, params.user.timezone)
        .format("dddd, MMMM D, h:mm a z")}](${FRONTEND_URL}/meet/${
        params.organization.username
      }/${params.incomingEmail.meetingId}/confirm?token=${encodeURIComponent(
        await generateToken(
          {
            guests,
            timezone: params.user.timezone,
            duration,
            datetime: moment.tz(slot.start, params.user.timezone).toISOString(),
          },
          "1y",
          Tokens.CONFIRM_APPOINTMENT
        )
      )})`
    );
  }

  const data = {
    ownerName: params.user.nickname,
    guestName:
      guests
        .map((guest) => guest.name.split(" ")[0])
        .filter((name) => name)
        .join(", ") ?? "guest",
    duration: String(duration),
    guestFullName:
      guests
        .map((guest) => guest.name)
        .filter((name) => name)
        .join(", ") ?? "guest",
    slotsMarkdownOwner: slotsMarkdownOwner.join("\n"),
    slotsMarkdown: slotsMarkdown.join("\n"),
    ...params.organization,
    assistantSignature: params.organization.assistantSignature.replace(
      /\n/g,
      "<br>"
    ),
    unsubscribeUrl: `${FRONTEND_URL}/unsubscribe}`,
    baseUrl: BASE_URL,
    frontendUrl: FRONTEND_URL,
  };

  const sendInLanguage =
    params.organization.emailLanguage === "detect"
      ? ["en", "nl"].includes(language)
        ? language
        : params.organization.emailLanguage
      : params.organization.emailLanguage;
  await mail({
    template: `meeting-invitation.${sendInLanguage}`,
    from: `"${params.organization.assistantName}" <meet-${params.organization.username}@mail.araassistant.com>`,
    to: guests.map((guest) => `"${guest.name}" <${guest.address}>`),
    subject: `${params.organization.name} - Appointment`,
    data: {
      ...data,
      trackingImageUrl: params.organization.readReceipts
        ? `${BASE_URL}/v1/api/read-receipt?token=${encodeURIComponent(
            await generateToken({ id }, "1y", Tokens.EMAIL_UPDATE)
          )}`
        : undefined,
    },
  });
  params.log("Sent email to guests");

  if (params.organization.emailConfirmation) {
    await mail({
      template: `meeting-details.${sendInLanguage}`,
      from: `"${params.organization.assistantName}" <meet-${params.organization.username}@mail.araassistant.com>`,
      to: `"${params.user.name}" <${
        (await getUserBestEmail(params.user.id)).email
      }>`,
      subject: `${data.guestFullName} - Appointment`,
      data,
    });
    params.log("Sent confirmation email to owner");
  }
};
