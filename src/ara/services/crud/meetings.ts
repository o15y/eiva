import {
  prisma,
  paginatedResult,
  queryParamsToSelect,
} from "../../../_staart/helpers/prisma";
import { can } from "../../../_staart/helpers/authorization";
import { OrgScopes, Tokens } from "../../../_staart/interfaces/enum";
import { meetingsUpdateInput } from "@prisma/client";
import { INSUFFICIENT_PERMISSION, RESOURCE_NOT_FOUND } from "@staart/errors";
import { verifyToken } from "../../../_staart/helpers/jwt";
import moment from "moment";

export const getAllMeetingsForOrganization = async (
  tokenUserId: string,
  organizationId: string,
  queryParams: any
) => {
  if (
    await can(tokenUserId, OrgScopes.READ_ORG, "organization", organizationId)
  ) {
    return paginatedResult(
      await prisma.meetings.findMany({
        where: { organizationId: parseInt(organizationId) },
        ...queryParamsToSelect(queryParams),
      }),
      { first: queryParams.first, last: queryParams.last }
    );
  }
  throw new Error(INSUFFICIENT_PERMISSION);
};

export const getMeetingForOrganization = async (
  tokenUserId: string,
  organizationId: string,
  meetingId: string
) => {
  if (
    await can(tokenUserId, OrgScopes.READ_ORG, "organization", organizationId)
  )
    return prisma.meetings.findOne({ where: { id: parseInt(meetingId) } });
  throw new Error(INSUFFICIENT_PERMISSION);
};

export const updateMeetingForOrganization = async (
  tokenUserId: string,
  organizationId: string,
  meetingId: string,
  data: meetingsUpdateInput
) => {
  if (
    await can(tokenUserId, OrgScopes.UPDATE_ORG, "organization", organizationId)
  )
    return prisma.meetings.update({ where: { id: parseInt(meetingId) }, data });
  throw new Error(INSUFFICIENT_PERMISSION);
};

export const deleteMeetingForOrganization = async (
  tokenUserId: string,
  organizationId: string,
  meetingId: string
) => {
  if (
    await can(tokenUserId, OrgScopes.UPDATE_ORG, "organization", organizationId)
  )
    return prisma.meetings.delete({ where: { id: parseInt(meetingId) } });
  throw new Error(INSUFFICIENT_PERMISSION);
};

export const getMeetingIncomingEmailsForOrganization = async (
  tokenUserId: string,
  organizationId: string,
  meetingId: string,
  queryParams: any
) => {
  if (
    await can(tokenUserId, OrgScopes.READ_ORG, "organization", organizationId)
  ) {
    return paginatedResult(
      await prisma.incoming_emails.findMany({
        where: {
          organizationId: parseInt(organizationId),
          meetingId: parseInt(meetingId),
        },
        ...queryParamsToSelect(queryParams),
      }),
      { first: queryParams.first, last: queryParams.last }
    );
  }
  throw new Error(INSUFFICIENT_PERMISSION);
};

export const getMeetingIncomingEmailForOrganization = async (
  tokenUserId: string,
  organizationId: string,
  meetingId: string,
  incomingEmailId: string
) => {
  if (
    await can(tokenUserId, OrgScopes.READ_ORG, "organization", organizationId)
  )
    return prisma.incoming_emails.findOne({
      where: {
        id: parseInt(incomingEmailId),
        meetingId: parseInt(meetingId),
        organizationId: parseInt(organizationId),
      },
    });
  throw new Error(INSUFFICIENT_PERMISSION);
};

export const confirmMeetingForGuest = async (
  token: string,
  organizationId: string,
  meetingId: string,
  data: {
    guestName: string;
    guestEmail: string;
    guestTimezone: string;
    duration: number;
    selectedDatetime: Date;
  }
) => {
  await verifyToken(token, Tokens.CONFIRM_APPOINTMENT);
  const meeting = (
    await prisma.meetings.findMany({
      where: {
        id: parseInt(meetingId),
        organizationId: parseInt(organizationId),
      },
    })
  )[0];
  if (!meeting) throw new Error(RESOURCE_NOT_FOUND);
  meeting.guests = JSON.stringify(
    (JSON.parse(meeting.guests) as any[]).map((guest) => {
      if (guest.address === data.guestEmail) {
        guest.name = data.guestName;
        guest.timezone = data.guestTimezone;
      }
      return guest;
    })
  );
  // TODO support multiple guests
  await prisma.meetings.update({
    where: {
      id: parseInt(meetingId),
    },
    data: {
      confirmedTime: moment(data.selectedDatetime).toISOString(),
      guests: meeting.guests,
      duration: data.duration,
    },
  });
};
