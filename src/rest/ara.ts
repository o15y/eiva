import { INVALID_API_KEY_SECRET } from "@staart/errors";
import { simpleParser } from "mailparser";
import { elasticSearchIndex } from "../helpers/elasticsearch";
import { getS3Item } from "../helpers/services/s3";

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
  const log = (...args: any[]) => {
    if (process.env.NODE_ENV === "development") console.log(args.join(" "));
    logs.push(`${new Date().toLocaleString()} ${args.join(" ")}`);
  };
  let returnedInfo: any = {};
  emailSteps(objectId, log)
    .then(details => {
      returnedInfo = details;
      log(`Completed`);
    })
    .catch((error: Error) => log(`ERROR ${String(error)}`))
    .then(() =>
      elasticSearchIndex({
        index: "ara-incoming-emails",
        body: {
          date: new Date(),
          ...returnedInfo,
          logs
        }
      })
    );
};

const emailSteps = async (objectId: string, log: (...args: any[]) => void) => {
  log("Received request", objectId);
  const objectBody = (
    await getS3Item(INCOMING_EMAILS_S3_BUCKET, objectId)
  ).toString();
  const parsedBody = await simpleParser(objectBody);
};
