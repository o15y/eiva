import { prisma } from "../../../_staart/helpers/prisma";
import { Tokens } from "../../../_staart/interfaces/enum";
import { RESOURCE_NOT_FOUND } from "@staart/errors";
import { verifyToken } from "../../../_staart/helpers/jwt";
import moment from "moment-timezone";
import { render } from "@staart/mustache-markdown";
import { capitalizeFirstLetter } from "@staart/text";
import { mail } from "../../../_staart/helpers/mail";
import { confirmIfSlotAvailable } from "../dates";
import { google, CalendarEvent, yahoo, outlook, ics } from "calendar-link";
import { BASE_URL, FRONTEND_URL } from "../../../config";
import { getFullToken } from "../short-token";

/**
 * Confirm a meeting from guest
 * @param token - JWT for verification
 * @param organizationId - Organization ID
 * @param meetingId - Meeting ID
 * @param data - Body data
 */
export const confirmMeetingForGuest = async (
  organizationId: string,
  meetingId: string,
  data: {
    token: string;
    guestName: string;
    guestEmail: string;
    guestTimezone: string;
    duration: number;
    selectedDatetime: Date;
  }
) => {
  await verifyToken(await getFullToken(data.token), Tokens.CONFIRM_APPOINTMENT);

  // Find meeting details
  const meeting = (
    await prisma.meetings.findMany({
      where: {
        id: parseInt(meetingId),
        organizationId: parseInt(organizationId),
      },
      include: { organization: true, user: true },
    })
  )[0];
  if (!meeting) throw new Error(RESOURCE_NOT_FOUND);

  // Make sure this slot is available
  if (
    !confirmIfSlotAvailable(
      meeting.organization,
      moment(data.selectedDatetime),
      moment(data.selectedDatetime).add(data.duration, "minutes")
    )
  )
    throw new Error("429/slot-unavailable");
  if (!meeting.user.primaryEmail) throw new Error(RESOURCE_NOT_FOUND);

  const safeConfirmMeeting = async () => {
    // Add new guest data to `meeting.guests`
    meeting.guests = JSON.stringify(
      (JSON.parse(meeting.guests) as any[]).map((guest) => {
        if (guest.address === data.guestEmail) {
          guest.name = data.guestName;
          guest.timezone = data.guestTimezone;
        }
        return guest;
      })
    );

    // Update meeting details
    // TODO support multiple guests
    const confirmedMeeting = await prisma.meetings.update({
      where: {
        id: parseInt(meetingId),
      },
      data: {
        confirmedTime: moment(data.selectedDatetime).toISOString(),
        guests: meeting.guests,
        duration: Number(data.duration),
      },
    });

    // Get meeting location details
    const location = await prisma.locations.findOne({
      where: { id: meeting.locationId },
    });
    if (!location) return;

    // Send meeting details
    // TODO send re-confirmations

    const userEmail = await prisma.emails.findOne({
      where: { id: meeting.user.primaryEmail ?? 0 },
    });
    if (!userEmail) throw new Error(RESOURCE_NOT_FOUND);

    const meetingWithName = JSON.parse(meeting.guests)
      .map((guest: any) => guest.name)
      .join(", ");

    let locationValue = location.value ?? "";
    let locationData: any = {};
    if (location.data) {
      try {
        locationData = JSON.parse(location.data);
      } catch (error) {}
    }
    if (locationData.template) {
      let result: string = locationData.template ?? "";
      Object.keys(locationData).forEach((key: any) => {
        result = result.replace(`{{${key}}}`, locationData[key]);
      });
      Object.keys(location).forEach((key: any) => {
        result = result.replace(`{{${key}}}`, (location as any)[key]);
      });
      if (result) locationValue = result;
    }

    const event: CalendarEvent = {
      title: `${
        meeting.user.name
      } <> ${meetingWithName} | ${capitalizeFirstLetter(
        location.type.replace("_", " ")
      )}`,
      start: moment(data.selectedDatetime).toDate(),
      duration: [meeting.duration, "minute"],
      // description: "This meeting was scheduled by EIVA",
      location: locationValue,
      busy: true,
      guests: [
        `"${meeting.user.name}" <${userEmail.email}>`,
        ...JSON.parse(meeting.guests).map(
          (guest: any) => `"${guest.name}" <${guest.address}>`
        ),
      ],
    };

    const sharedEmailData = {
      duration: String(confirmedMeeting.duration),
      assistantName: meeting.organization.assistantName,
      assistantSignature: meeting.organization.assistantSignature,
      meetingType: location?.type,
      meetingLocation: locationValue,
      googleLink: google(event),
      outlookLink: outlook(event),
      yahooLink: yahoo(event),
    };

    // Send email to owner
    const ownerEmailData = {
      ...sharedEmailData,
      emailToName: meeting.user.nickname,
      meetingWithName,
      meetingDate: moment
        .tz(data.selectedDatetime, meeting.user.timezone)
        .format("dddd, MMMM D, YYYY"),
      meetingTime: moment
        .tz(data.selectedDatetime, meeting.user.timezone)
        .format("h:mm a z"),
      editLink: `${FRONTEND_URL}/teams/${meeting.organization.username}/meetings/${meeting.id}`,
    };

    const sendInLanguage =
      meeting.organization.emailLanguage === "detect"
        ? ["en", "nl"].includes(meeting.language)
          ? meeting.language
          : meeting.organization.emailLanguage
        : meeting.organization.emailLanguage;

    const icsAttachment = ics(event)
      .replace("data:text/calendar;charset=utf8,", "")
      .replace(/%0A/g, "\n")
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => {
        if (line.includes(":")) {
          line = `${line.split(":")[0]}:${decodeURIComponent(
            line.split(":")[1]
          )}`;
        }
        return line;
      })
      .join("\n");

    await mail({
      template: `meeting-confirmation.${sendInLanguage}`,
      from: `"${meeting.organization.assistantName}" <meet-${meeting.organization.username}@eiva.o15y.com>`,
      to: `"${meeting.user.name}" <${userEmail.email}>`,
      subject: `Confirmed: Appointment with ${meetingWithName}`,
      data: ownerEmailData,
      icalEvent: {
        content: icsAttachment,
      },
    });

    // Send email to guests
    for await (const guest of JSON.parse(meeting.guests)) {
      const guestEmailData = {
        ...sharedEmailData,
        emailToName: guest.name.split(" ")[0],
        meetingWithName: meeting.user.name,
        meetingDate: moment
          .tz(data.selectedDatetime, guest.timezone)
          .format("dddd, MMMM D, YYYY"),
        meetingTime: moment
          .tz(data.selectedDatetime, guest.timezone)
          .format("h:mm a z"),
      };
      await mail({
        template: `meeting-confirmation.${sendInLanguage}`,
        from: `"${meeting.organization.assistantName}" <meet-${meeting.organization.username}@eiva.o15y.com>`,
        to: `"${guest.name}" <${guest.address}>`,
        subject: `Confirmed: Appointment with ${meeting.user.name}`,
        data: guestEmailData,
        icalEvent: {
          content: icsAttachment,
        },
      });
    }
  };
  safeConfirmMeeting()
    .then(() => {})
    .catch(console.error);
  return { queued: true };
};
