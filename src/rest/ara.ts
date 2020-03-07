import { INVALID_API_KEY_SECRET } from "@staart/errors";
import { simpleParser } from "mailparser";
import { elasticSearchIndex } from "../helpers/elasticsearch";
import { getS3Item } from "../helpers/services/s3";
import { smartTokensFromText } from "../helpers/services/ara/tokens";
import { Logger } from "../interfaces/ara";
import { classifyTokens } from "../helpers/services/ara/classify";
import { performAction } from "../helpers/services/ara/actions";

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
    args = args.map(i => (typeof i === "object" ? JSON.stringify(i) : i));
    if (process.env.NODE_ENV === "development") console.log(args.join(" "));
    logs.push(`${new Date().toLocaleString()} ${args.join(" ")}`);
  };
  let returnedInfo: any = {};
  emailSteps(objectId, log)
    .then(details => {
      if (details) returnedInfo = details;
      log(`Completed`);
    })
    .catch((error: Error) => log(`${String(error)}`))
    .then(() =>
      elasticSearchIndex({
        index: "ara-incoming-emails",
        body: {
          date: new Date(),
          ...returnedInfo,
          logs,
          state: logs[logs.length - 1].toLowerCase().includes("error")
            ? "error"
            : "success"
        }
      })
    );
};

const emailSteps = async (objectId: string, log: Logger) => {
  log("Received request", objectId);
  const objectBody = (
    await getS3Item(INCOMING_EMAILS_S3_BUCKET, objectId)
  ).toString();
  const parsedBody = await simpleParser(objectBody);
  const tokens = await smartTokensFromText(parsedBody.text, parsedBody.from);
  log("Smart tokenized sentences", tokens);
  const label = classifyTokens(tokens, log);
  log(`Classified text as "${label}"`);
  return await performAction({
    objectBody,
    parsedBody,
    tokens,
    label,
    log
  });
};
