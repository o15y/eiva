import {
  logError,
  INVALID_API_KEY_SECRET,
  RESOURCE_NOT_FOUND,
} from "@staart/errors";
import { createHmac } from "crypto";
import { getS3Item } from "./services/s3";
import { Logger } from "./interfaces";
import { organizations } from "@prisma/client";
import { prisma } from "../_staart/helpers/prisma";
import { getOrganizationFromEmail } from "./services/crud";
import { performAction } from "./services/actions";
import { parseEmail } from "./services/parse";
import { verifyToken } from "../_staart/helpers/jwt";
import { Tokens } from "../_staart/interfaces/enum";
import moment from "moment";
import { elasticSearchIndex } from "../_staart/helpers/elasticsearch";
import { Locals } from "../_staart/interfaces/general";
import { getGeolocationFromIp } from "../_staart/helpers/location";
import { EmailAddress } from "mailparser";

const INCOMING_EMAIL_WEBHOOK_SECRET =
  process.env.INCOMING_EMAIL_WEBHOOK_SECRET || "";
const INCOMING_EMAILS_S3_BUCKET = process.env.INCOMING_EMAILS_S3_BUCKET || "";

/**
 * Safely process an incoming email
 * @param secret - Webhook secret
 * @param objectId - S3 object ID
 */
export const processIncomingEmail = async (
  secret: string,
  objectId: string
) => {
  // Compare webhook secret
  // TODO use more sophisticated secret (HMAC with SHA256, "secret" as key, "objectId" as message)
  // if (
  //   secret !==
  //   createHmac("sha256", INCOMING_EMAIL_WEBHOOK_SECRET)
  //     .update(objectId)
  //     .digest("hex")
  // )
  //   throw new Error(INVALID_API_KEY_SECRET);

  // Logging computation steps
  const logs: string[] = [];
  const log: Logger = (...args: any[]) => {
    args = args.map((i) => (typeof i === "object" ? JSON.stringify(i) : i));
    console.log(args.join(" "));
    logs.push(`${new Date().toISOString()} ${args.join(" ")}`);
  };

  // Run process
  emailSteps(objectId, log)
    .then(() => log("Success"))
    .catch((error) => log(`ERROR: ${String(error)}`))
    .then(() =>
      prisma.incoming_emails.update({
        data: {
          logs: JSON.stringify(logs),
          status: (logs[logs.length - 1] ?? "").includes("ERROR")
            ? "ERROR"
            : "SUCCESS",
        },
        where: { objectId },
      })
    )
    .then(() => {})
    .catch((error) => logError("Incoming email error", error));
  return { queued: true };
};

/**
 * Run all steps for an incoming email
 * @param objectId - S3 object ID
 * @param log - Logging function
 */
const emailSteps = async (objectId: string, log: Logger) => {
  // Get email raw data from AWS S3
  log("Received request", objectId);
  const objectBody = (
    await getS3Item(INCOMING_EMAILS_S3_BUCKET, objectId)
  ).toString();

  // Parse plain text to email object
  log(`Got raw email of length ${objectBody.length}`);
  const parsedBody = await parseEmail(objectBody);
  log("Parsed email attributes");

  // Find organization
  let organization: organizations | undefined = undefined;
  let assistantEmail = "";
  let allEmails: EmailAddress[] = [];
  (parsedBody.to?.value ?? []).forEach((email) => allEmails.push(email));
  (parsedBody.cc?.value ?? []).forEach((email) => allEmails.push(email));
  for await (const email of allEmails) {
    try {
      if (!organization) {
        log(`Looking for team for email "${email.address}"`);
        organization = await getOrganizationFromEmail(email.address);
        if (organization) assistantEmail = email.address;
      }
    } catch (error) {}
  }
  if (!organization || !organization.id)
    throw new Error("Couldn't find a team for this email");
  log(`Found "${organization.username}" team for this email`);

  if (!parsedBody.from?.value)
    throw new Error("Unable to find from email address");
  if (!parsedBody.to?.value) throw new Error("Unable to find to email address");

  // Find user
  // TODO handle if other people email the assistant
  const user = (
    await prisma.users.findMany({
      take: 1,
      where: {
        emails: {
          some: {
            email: parsedBody.from.value[0].address,
            isVerified: true,
          },
        },
      },
    })
  )[0];
  if (!user)
    throw new Error(`Couldn't a user from ${parsedBody.from.value[0].address}`);
  log(`Found "${user.name}" user as sender`);

  // Create email object
  console.log(
    JSON.stringify(
      {
        where: {
          objectId,
        },
        update: {
          status: "PENDING",
        },
        create: {
          objectId,
          status: "PENDING",
          organization: {
            connect: { id: organization.id },
          },
          user: {
            connect: { id: user.id },
          },
          meeting: {
            // TODO support if reply to pre-existing email
            create: {
              guests: "[]",
              duration: organization.schedulingDuration,
              meetingType: organization.schedulingType,
              location: {
                connect: { id: organization.schedulingLocation },
              },
              organization: {
                connect: { id: organization.id },
              },
              user: {
                connect: { id: user.id },
              },
            },
          },
          from: JSON.stringify(parsedBody.from.value),
          to: JSON.stringify(parsedBody.to.value),
          cc: JSON.stringify(parsedBody.cc?.value ?? []),
          subject: parsedBody.subject ?? "",
          emailDate: parsedBody.date ?? new Date(),
          messageId: parsedBody.messageId ?? "",
        },
      },
      null,
      2
    )
  );
  const incomingEmail = await prisma.incoming_emails.upsert({
    where: {
      objectId,
    },
    update: {
      status: "PENDING",
    },
    create: {
      objectId,
      status: "PENDING",
      organization: {
        connect: { id: organization.id },
      },
      user: {
        connect: { id: user.id },
      },
      meeting: {
        // TODO support if reply to pre-existing email
        create: {
          guests: "[]",
          duration: organization.schedulingDuration,
          meetingType: organization.schedulingType,
          location: {
            connect: { id: organization.schedulingLocation },
          },
          organization: {
            connect: { id: organization.id },
          },
          user: {
            connect: { id: user.id },
          },
        },
      },
      from: JSON.stringify(parsedBody.from.value),
      to: JSON.stringify(parsedBody.to.value),
      cc: JSON.stringify(parsedBody.cc?.value ?? []),
      subject: parsedBody.subject ?? "",
      emailDate: parsedBody.date ?? new Date(),
      messageId: parsedBody.messageId ?? "",
    },
  });
  log(
    `Upserted incoming email ${incomingEmail.id}, meeting ${incomingEmail.meetingId}`
  );

  const response = await performAction(
    incomingEmail,
    organization,
    assistantEmail,
    user,
    objectBody,
    parsedBody,
    log
  );

  const result = {
    incomingEmail,
    organizationId: organization.id,
    from: parsedBody.from.value,
    to: parsedBody.to.value,
    cc: parsedBody.cc?.value,
    bcc: parsedBody.bcc?.value,
    replyTo: parsedBody.replyTo?.value,
    headers: parsedBody.headers,
    subject: parsedBody.subject,
    references: parsedBody.references,
    emailDate: parsedBody.date,
    messageId: parsedBody.messageId,
    inReplyTo: parsedBody.inReplyTo,
    priority: parsedBody.priority,
    response,
  };

  return result;
};

/**
 * Track the read status of an outgoing email
 * @param jwt - JSON web token for email
 */
export const trackOutgoingEmail = async (jwt: string) => {
  const { id } = await verifyToken<{ id: number }>(jwt, Tokens.EMAIL_UPDATE);
  return prisma.incoming_emails.update({
    where: { id },
    data: { status: "SUCCESS" },
  });
};

/**
 * Get the details of a meeting
 * @param username - Organization username
 * @param meetingId - Meeting ID
 * @param jwt - JWT for meeting
 */
export const getPublicMeetingDetails = async (
  username: string,
  meetingId: string,
  jwt: string
) => {
  await verifyToken(jwt, Tokens.CONFIRM_APPOINTMENT);
  const details = await prisma.meetings.findMany({
    take: 1,
    where: { id: parseInt(meetingId), organization: { username } },
    include: { organization: true, user: true, location: true },
  });
  if (!details.length) throw new Error(RESOURCE_NOT_FOUND);
  const meeting = details[0];
  if (meeting.confirmedTime && moment(meeting.confirmedTime).isBefore(moment()))
    throw new Error("400/meeting-in-past");
  delete meeting.guests;
  return meeting;
};

/**
 * Tracking for analytics
 * @param index - Index to save record in
 * @param body - Data body
 */
export const trackAnalyticsEvent = async (
  locals: Locals,
  index: string,
  data: any
) => {
  const location = await getGeolocationFromIp(locals.ipAddress);
  const body = { ...data, ...location, date: new Date() };
  return elasticSearchIndex({ index, body });
};
