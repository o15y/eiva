import { prisma } from "../../../_staart/helpers/prisma";
import { Tokens } from "../../../_staart/interfaces/enum";
import { RESOURCE_NOT_FOUND } from "@staart/errors";
import { verifyToken } from "../../../_staart/helpers/jwt";
import moment from "moment-timezone";
import { render } from "@staart/mustache-markdown";
import { mail } from "../../../_staart/helpers/mail";
import { confirmIfSlotAvailable } from "../dates";

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
  await verifyToken(data.token, Tokens.CONFIRM_APPOINTMENT);

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
      meeting.user,
      moment(data.selectedDatetime),
      moment(data.selectedDatetime).add(data.duration, "minutes")
    )
  )
    throw new Error("429/slot-unavailable");

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
        duration: data.duration,
      },
    });

    // Get memeeting location details
    if (!meeting.confirmedTime) return;
    const location = await prisma.locations.findOne({
      where: { id: meeting.locationId },
    });

    // Send meeting details
    // TODO send re-confirmations

    const sharedEmailData = {
      duration: String(confirmedMeeting.duration),
      assistantName: meeting.organization.assistantName,
      assistantSignature: meeting.organization.assistantSignature,
      meetingType: meeting.meetingType,
      meetingLocation: location?.value,
      editLink: "#",
      googleLink: "#",
      outlookLink: "#",
      yahooLink: "#",
      icsLink: "#",
    };
    sharedEmailData.assistantSignature = render(
      sharedEmailData.assistantSignature,
      sharedEmailData
    )[1];

    // Send email to owner
    const meetingWithName = JSON.parse(meeting.guests)
      .map((guest: any) => guest.name)
      .join(", ");
    if (!meeting.user.primaryEmail) throw new Error(RESOURCE_NOT_FOUND);
    const userEmail = await prisma.emails.findOne({
      where: { id: meeting.user.primaryEmail },
    });
    if (!userEmail) throw new Error(RESOURCE_NOT_FOUND);
    const ownerEmailData = {
      ...sharedEmailData,
      emailToName: meeting.user.nickname,
      meetingWithName,
      meetingDate: moment
        .tz(meeting.confirmedTime, meeting.user.timezone)
        .format("dddd, MMMM D, YYYY"),
      meetingTime: moment
        .tz(meeting.confirmedTime, meeting.user.timezone)
        .format("h:mm a z"),
    };

    const sendInLanguage =
      meeting.organization.emailLanguage === "detect"
        ? ["en", "nl"].includes(meeting.language)
          ? meeting.language
          : meeting.organization.emailLanguage
        : meeting.organization.emailLanguage;

    await mail({
      template: `meeting-confirmation.${sendInLanguage}`,
      from: `"${meeting.organization.assistantName}" <meet-${meeting.organization.username}@mail.araassistant.com>`,
      to: `"${meeting.user.name}" <${userEmail.email}>`,
      subject: `Confirmed: Appointment with ${meetingWithName}`,
      data: ownerEmailData,
    });

    // Send email to guests
    for await (const guest of JSON.parse(meeting.guests)) {
      const guestEmailData = {
        ...sharedEmailData,
        emailToName: guest.name.split(" ")[0],
        meetingWithName: meeting.user.name,
        meetingDate: moment
          .tz(meeting.confirmedTime, guest.timezone)
          .format("dddd, MMMM D, YYYY"),
        meetingTime: moment
          .tz(meeting.confirmedTime, guest.timezone)
          .format("h:mm a z"),
      };
      await mail({
        template: `meeting-confirmation.${sendInLanguage}`,
        from: `"${meeting.organization.assistantName}" <meet-${meeting.organization.username}@mail.araassistant.com>`,
        to: `"${guest.name}" <${guest.address}>`,
        subject: `Confirmed: Appointment with ${meeting.user.name}`,
        data: guestEmailData,
      });
    }
  };
  safeConfirmMeeting()
    .then(() => {})
    .catch(console.error);
  return { queued: true };
};
