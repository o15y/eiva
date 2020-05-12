import { logError } from "@staart/errors";
import { sendMail } from "@staart/mail";
import { render } from "@staart/mustache-markdown";
import { redisQueue } from "@staart/redis";
import { readFile } from "fs-extra";
import { join } from "path";
import { FRONTEND_URL, REDIS_QUEUE_PREFIX } from "../../config";

const MAIL_QUEUE = `${REDIS_QUEUE_PREFIX}outbound-emails`;

let queueSetup = false;
const setupQueue = async () => {
  if (queueSetup) return true;
  const queues = redisQueue.listQueuesAsync();
  if ((await queues).includes(MAIL_QUEUE)) return (queueSetup = true);
  await redisQueue.createQueueAsync({ qname: MAIL_QUEUE });
  return (queueSetup = true);
};

export const receiveEmailMessage = async () => {
  await setupQueue();
  const result = await redisQueue.receiveMessageAsync({
    qname: MAIL_QUEUE,
  });
  if ("id" in result) {
    const params = JSON.parse(result.message);
    if (params.tryNumber && params.tryNumber > 3) {
      logError("Email", `Unable to send email: ${params.to}`);
      return redisQueue.deleteMessageAsync({
        qname: MAIL_QUEUE,
        id: result.id,
      });
    }
    try {
      await safeSendEmail(params);
    } catch (error) {
      console.log(error);
      await redisQueue.sendMessageAsync({
        qname: MAIL_QUEUE,
        message: JSON.stringify({
          ...params,
          tryNumber: params.tryNumber + 1,
        }),
      });
    }
    await redisQueue.deleteMessageAsync({
      qname: MAIL_QUEUE,
      id: result.id,
    });
    receiveEmailMessage();
  }
};

/**
 * Send a new email using AWS SES or SMTP
 */
export const mail = async (params1: any, params2?: any, params3?: any) => {
  await setupQueue();
  await redisQueue.sendMessageAsync({
    qname: MAIL_QUEUE,
    message: JSON.stringify(
      params2 && params3
        ? { to: params1, template: params2, data: params3 }
        : params1
    ),
  });
};

const safeSendEmail = async (params: any) => {
  const result = render(
    (
      await readFile(
        join(
          __dirname,
          "..",
          "..",
          "..",
          "..",
          "src",
          "templates",
          `${params.template}.md`
        )
      )
    ).toString(),
    { ...params.data, frontendUrl: FRONTEND_URL }
  );
  const altText = result[0];
  const message = result[1];
  return sendMail({
    subject: result[1].split("\n", 1)[0].replace(/<\/?[^>]+(>|$)/g, ""),
    message,
    altText,
    ...params,
  });
};
