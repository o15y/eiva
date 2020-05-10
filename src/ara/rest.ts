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
  if (secret !== INCOMING_EMAIL_WEBHOOK_SECRET)
    throw new Error(INVALID_API_KEY_SECRET);
  const logs: string[] = [];
  const log: Logger = (...args: any[]) => {
    args = args.map((i) => (typeof i === "object" ? JSON.stringify(i) : i));
    if (process.env.NODE_ENV === "development") console.log(args.join(" "));
    logs.push(`${new Date().toISOString()} ${args.join(" ")}`);
  };
  let returnedInfo: any = {};
  let insertId = "";
  let organizationId = "";
  const insertIdUpdater = (iInsertId: string, iOrganizationId: string) => {
    insertId = iInsertId;
    organizationId = iOrganizationId;
  };
  emailSteps(objectId, log, insertIdUpdater)
    .then((details) => {
      if (details) returnedInfo = details;
      log("Completed");
    })
    .catch((error: Error) => log(String(error)))
    .then(() =>
      elasticSearch.index({
        index: "ara-incoming-emails",
        body: {
          date: new Date(),
          ...returnedInfo,
          logs,
          state: logs[logs.length - 1].toLowerCase().includes("error")
            ? "error"
            : "success",
        },
      })
    )
    .then((response) => {
      const elasticId = response.body._id;
      if (organizationId && insertId && elasticId) {
        console.log("TODO update incoming email");
        // return updateIncomingEmail(organizationId, insertId, { elasticId });
      }
    })
    .then(() => {})
    .catch((error) => logError("Incoming email", error));
};

const emailSteps = async (
  objectId: string,
  log: Logger,
  insertIdUpdater: (insertIt: string, organizationId: string) => void
) => {
  log("Received request", objectId);
  const objectBody = (
    await getS3Item(INCOMING_EMAILS_S3_BUCKET, objectId)
  ).toString();
  log(`Got raw email of length ${objectBody.length}`);
  const parsedBody = await parseEmail(objectBody);
  log("Parsed email attributes");
  let organization: organizations | undefined = undefined;
  for await (const email of parsedBody.to?.value || []) {
    try {
      if (!organization) {
        log(`Looking for team for email "${email.address}"`);
        organization = await getOrganizationFromEmail(email.address);
      }
    } catch (error) {}
  }
  if (!organization || !organization.id)
    throw new Error("Couldn't find a team for this email");
  log(`Found "${organization.username}" team for this email`);

  if (!parsedBody.from?.value)
    throw new Error("Unable to find from email address");
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

  // TODO handle if other people email the assistant
  if (!user) throw new Error("Couldn't find this user in this team");
  // const { insertId } = await createIncomingEmail({
  //   objectId,
  //   organizationId: organization.id,
  // });
  // log(`Created initial entry with ID "${insertId}"`);
  // insertIdUpdater(insertId, String(organization.id));
  return {
    organizationId: organization.id,
    from: parsedBody.from?.value,
    to: parsedBody.to?.value,
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
      organization,
      user,
      objectBody,
      parsedBody,
      log
    )) || {}),
  };
};
