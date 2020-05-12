import { logError, INVALID_API_KEY_SECRET } from "@staart/errors";
import { elasticSearch } from "@staart/elasticsearch";
import { getS3Item } from "./services/s3";
import { Logger } from "./interfaces";
import { organizations, users } from "@prisma/client";
import { prisma } from "../_staart/helpers/prisma";
import { getOrganizationFromEmail } from "./services/crud";
import { performAction } from "./services/actions";
import { parseEmail } from "./services/parse";

const INCOMING_EMAIL_WEBHOOK_SECRET =
  process.env.INCOMING_EMAIL_WEBHOOK_SECRET || "";
const INCOMING_EMAILS_S3_BUCKET = process.env.INCOMING_EMAILS_S3_BUCKET || "";

export const processIncomingEmail = async (
  secret: string,
  objectId: string
) => {
  // Compare webhook secret
  // TODO use more sophisticated secret (HMAC with SHA256, "secret" as key, "objectId" as message)
  if (secret !== INCOMING_EMAIL_WEBHOOK_SECRET)
    throw new Error(INVALID_API_KEY_SECRET);

  // Logging computation steps
  const logs: string[] = [];
  const log: Logger = (...args: any[]) => {
    args = args.map((i) => (typeof i === "object" ? JSON.stringify(i) : i));
    if (process.env.NODE_ENV === "development") console.log(args.join(" "));
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
  for await (const email of parsedBody.to?.value || []) {
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
      first: 1,
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
    ...((await performAction(
      incomingEmail,
      organization,
      assistantEmail,
      user,
      objectBody,
      parsedBody,
      log
    )) || {}),
  };

  return result;
};
